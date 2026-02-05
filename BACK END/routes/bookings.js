const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * POST /api/bookings
 * Create a new booking
 */
router.post('/', async (req, res) => {
    try {
        const {
            roomId,
            checkIn,
            checkOut,
            adults,
            children,
            name,
            email,
            phone,
            country,
            address,
            specialRequests,
            paymentMethod,
            roomPrice,
            totalNights,
            totalPrice
        } = req.body;
        
        // Validate required fields
        if (!roomId || !checkIn || !checkOut || !name || !email || !phone || !paymentMethod) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['roomId', 'checkIn', 'checkOut', 'name', 'email', 'phone', 'paymentMethod']
            });
        }
        
        // Validate dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (checkInDate < today) {
            return res.status(400).json({ error: 'Check-in date cannot be in the past' });
        }
        
        if (checkOutDate <= checkInDate) {
            return res.status(400).json({ error: 'Check-out date must be after check-in date' });
        }
        
        // Calculate nights if not provided
        const nights = totalNights || Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        
        // Check room availability
        const availabilityQuery = `
            SELECT id FROM bookings
            WHERE room_id = ?
            AND status != 'cancelled'
            AND (
                (check_in <= ? AND check_out > ?)
                OR (check_in < ? AND check_out >= ?)
                OR (check_in >= ? AND check_out <= ?)
            )
        `;
        
        const [conflicts] = await promisePool.query(availabilityQuery, [
            roomId,
            checkOut, checkIn,
            checkOut, checkOut,
            checkIn, checkOut
        ]);
        
        if (conflicts.length > 0) {
            return res.status(409).json({ 
                error: 'Room is not available for the selected dates',
                message: 'This room has already been booked for these dates. Please select different dates or another room.'
            });
        }
        
        // Get room details to calculate price if not provided
        let finalRoomPrice = roomPrice;
        let finalTotalPrice = totalPrice;
        
        if (!roomPrice || !totalPrice) {
            const [rooms] = await promisePool.query('SELECT price_per_night FROM rooms WHERE id = ?', [roomId]);
            
            if (rooms.length === 0) {
                return res.status(404).json({ error: 'Room not found' });
            }
            
            finalRoomPrice = rooms[0].price_per_night;
            const subtotal = finalRoomPrice * nights;
            const tax = subtotal * 0.10; // 10% tax
            finalTotalPrice = subtotal + tax;
        }
        
        // Generate booking reference
        const bookingReference = `KL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        // Insert booking
        const insertQuery = `
            INSERT INTO bookings (
                room_id, booking_reference, guest_name, guest_email, guest_phone,
                guest_country, guest_address, check_in, check_out, adults, children,
                total_nights, room_price, total_price, payment_method, status, special_requests
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
        `;
        
        const [result] = await promisePool.query(insertQuery, [
            roomId,
            bookingReference,
            name,
            email,
            phone,
            country || null,
            address || null,
            checkIn,
            checkOut,
            adults || 2,
            children || 0,
            nights,
            finalRoomPrice,
            finalTotalPrice,
            paymentMethod,
            specialRequests || null
        ]);
        
        // Fetch the created booking
        const [bookings] = await promisePool.query(
            'SELECT * FROM bookings WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json({
            message: 'Booking created successfully',
            booking: bookings[0]
        });
        
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ 
            error: 'Failed to create booking',
            message: error.message 
        });
    }
});

/**
 * GET /api/bookings
 * Get all bookings (for admin)
 */
router.get('/', async (req, res) => {
    try {
        const { status, email, startDate, endDate } = req.query;
        
        let query = `
            SELECT b.*, r.title as room_title, r.room_type, r.room_number
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            WHERE 1=1
        `;
        const params = [];
        
        // Add filters
        if (status) {
            query += ' AND b.status = ?';
            params.push(status);
        }
        
        if (email) {
            query += ' AND b.guest_email = ?';
            params.push(email);
        }
        
        if (startDate) {
            query += ' AND b.check_in >= ?';
            params.push(startDate);
        }
        
        if (endDate) {
            query += ' AND b.check_out <= ?';
            params.push(endDate);
        }
        
        query += ' ORDER BY b.created_at DESC';
        
        const [bookings] = await promisePool.query(query, params);
        
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ 
            error: 'Failed to fetch bookings',
            message: error.message 
        });
    }
});

/**
 * GET /api/bookings/:id
 * Get single booking by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT b.*, r.title as room_title, r.room_type, r.room_number, r.images
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            WHERE b.id = ?
        `;
        
        const [bookings] = await promisePool.query(query, [id]);
        
        if (bookings.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        const booking = {
            ...bookings[0],
            room_images: bookings[0].images ? JSON.parse(bookings[0].images) : []
        };
        delete booking.images;
        
        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ 
            error: 'Failed to fetch booking',
            message: error.message 
        });
    }
});

/**
 * GET /api/bookings/reference/:reference
 * Get booking by reference number
 */
router.get('/reference/:reference', async (req, res) => {
    try {
        const { reference } = req.params;
        
        const query = `
            SELECT b.*, r.title as room_title, r.room_type, r.room_number
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            WHERE b.booking_reference = ?
        `;
        
        const [bookings] = await promisePool.query(query, [reference]);
        
        if (bookings.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        res.json(bookings[0]);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ 
            error: 'Failed to fetch booking',
            message: error.message 
        });
    }
});

/**
 * PUT /api/bookings/:id
 * Update booking status
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }
        
        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                error: 'Invalid status',
                validStatuses 
            });
        }
        
        const query = 'UPDATE bookings SET status = ? WHERE id = ?';
        const [result] = await promisePool.query(query, [status, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        // Fetch updated booking
        const [bookings] = await promisePool.query('SELECT * FROM bookings WHERE id = ?', [id]);
        
        res.json({
            message: 'Booking updated successfully',
            booking: bookings[0]
        });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ 
            error: 'Failed to update booking',
            message: error.message 
        });
    }
});

/**
 * DELETE /api/bookings/:id
 * Cancel/Delete a booking
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Update status to cancelled instead of deleting
        const query = 'UPDATE bookings SET status = "cancelled" WHERE id = ?';
        const [result] = await promisePool.query(query, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ 
            error: 'Failed to cancel booking',
            message: error.message 
        });
    }
});

/**
 * GET /api/bookings/stats/dashboard
 * Get booking statistics for dashboard
 */
router.get('/stats/dashboard', async (req, res) => {
    try {
        const queries = {
            total: 'SELECT COUNT(*) as count FROM bookings',
            pending: 'SELECT COUNT(*) as count FROM bookings WHERE status = "pending"',
            confirmed: 'SELECT COUNT(*) as count FROM bookings WHERE status = "confirmed"',
            cancelled: 'SELECT COUNT(*) as count FROM bookings WHERE status = "cancelled"',
            revenue: 'SELECT SUM(total_price) as total FROM bookings WHERE status != "cancelled"',
            upcoming: `
                SELECT COUNT(*) as count FROM bookings 
                WHERE check_in >= CURDATE() AND status = "confirmed"
            `,
            current: `
                SELECT COUNT(*) as count FROM bookings 
                WHERE check_in <= CURDATE() AND check_out >= CURDATE() AND status = "confirmed"
            `
        };
        
        const stats = {};
        
        for (const [key, query] of Object.entries(queries)) {
            const [result] = await promisePool.query(query);
            stats[key] = result[0].count || result[0].total || 0;
        }
        
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ 
            error: 'Failed to fetch statistics',
            message: error.message 
        });
    }
});

module.exports = router;
