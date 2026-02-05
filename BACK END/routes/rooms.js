const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');

/**
 * GET /api/rooms
 * Get all rooms with optional filtering
 */
router.get('/', async (req, res) => {
    try {
        const { type, capacity, minPrice, maxPrice } = req.query;
        
        let query = 'SELECT * FROM rooms WHERE is_available = TRUE';
        const params = [];
        
        // Add filters
        if (type) {
            query += ' AND room_type = ?';
            params.push(type);
        }
        
        if (capacity) {
            query += ' AND capacity >= ?';
            params.push(parseInt(capacity));
        }
        
        if (minPrice) {
            query += ' AND price_per_night >= ?';
            params.push(parseFloat(minPrice));
        }
        
        if (maxPrice) {
            query += ' AND price_per_night <= ?';
            params.push(parseFloat(maxPrice));
        }
        
        query += ' ORDER BY price_per_night ASC';
        
        const [rooms] = await promisePool.query(query, params);
        
        // Parse JSON fields
        const formattedRooms = rooms.map(room => ({
            ...room,
            images: room.images ? JSON.parse(room.images) : [],
            amenities: room.amenities ? JSON.parse(room.amenities) : []
        }));
        
        res.json(formattedRooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ 
            error: 'Failed to fetch rooms',
            message: error.message 
        });
    }
});

/**
 * GET /api/rooms/featured
 * Get featured rooms only
 */
router.get('/featured', async (req, res) => {
    try {
        const query = `
            SELECT * FROM rooms 
            WHERE is_featured = TRUE AND is_available = TRUE 
            ORDER BY price_per_night ASC 
            LIMIT 6
        `;
        
        const [rooms] = await promisePool.query(query);
        
        // Parse JSON fields
        const formattedRooms = rooms.map(room => ({
            ...room,
            images: room.images ? JSON.parse(room.images) : [],
            amenities: room.amenities ? JSON.parse(room.amenities) : []
        }));
        
        res.json(formattedRooms);
    } catch (error) {
        console.error('Error fetching featured rooms:', error);
        res.status(500).json({ 
            error: 'Failed to fetch featured rooms',
            message: error.message 
        });
    }
});

/**
 * GET /api/rooms/available
 * Check room availability for specific dates
 */
router.get('/available', async (req, res) => {
    try {
        const { checkIn, checkOut, type, adults, children } = req.query;
        
        if (!checkIn || !checkOut) {
            return res.status(400).json({ 
                error: 'Check-in and check-out dates are required' 
            });
        }
        
        // Validate dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        if (checkOutDate <= checkInDate) {
            return res.status(400).json({ 
                error: 'Check-out date must be after check-in date' 
            });
        }
        
        // Calculate total guests
        const totalGuests = parseInt(adults || 2) + parseInt(children || 0);
        
        // Query to find available rooms
        let query = `
            SELECT r.* FROM rooms r
            WHERE r.is_available = TRUE
            AND r.capacity >= ?
            AND r.id NOT IN (
                SELECT room_id FROM bookings
                WHERE status != 'cancelled'
                AND (
                    (check_in <= ? AND check_out > ?)
                    OR (check_in < ? AND check_out >= ?)
                    OR (check_in >= ? AND check_out <= ?)
                )
            )
        `;
        
        const params = [
            totalGuests,
            checkOut, checkIn,
            checkOut, checkOut,
            checkIn, checkOut
        ];
        
        // Add room type filter if specified
        if (type) {
            query += ' AND r.room_type = ?';
            params.push(type);
        }
        
        query += ' ORDER BY r.price_per_night ASC';
        
        const [rooms] = await promisePool.query(query, params);
        
        // Parse JSON fields
        const formattedRooms = rooms.map(room => ({
            ...room,
            images: room.images ? JSON.parse(room.images) : [],
            amenities: room.amenities ? JSON.parse(room.amenities) : []
        }));
        
        res.json(formattedRooms);
    } catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).json({ 
            error: 'Failed to check availability',
            message: error.message 
        });
    }
});

/**
 * GET /api/rooms/:id
 * Get single room by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = 'SELECT * FROM rooms WHERE id = ?';
        const [rooms] = await promisePool.query(query, [id]);
        
        if (rooms.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        
        const room = {
            ...rooms[0],
            images: rooms[0].images ? JSON.parse(rooms[0].images) : [],
            amenities: rooms[0].amenities ? JSON.parse(rooms[0].amenities) : []
        };
        
        res.json(room);
    } catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({ 
            error: 'Failed to fetch room',
            message: error.message 
        });
    }
});

module.exports = router;
