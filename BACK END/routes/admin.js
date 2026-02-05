/**
 * Admin Routes
 * Handles admin-specific endpoints for dashboard, guests, staff, etc.
 */

const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');

/**
 * GET /api/admin/dashboard
 * Get dashboard statistics
 */
router.get('/dashboard', async (req, res) => {
    try {
        // Get today's check-ins
        const today = new Date().toISOString().split('T')[0];
        const [todayCheckins] = await promisePool.query(
            'SELECT COUNT(*) as count FROM bookings WHERE check_in = ? AND status != "cancelled"',
            [today]
        );

        // Get total rooms and occupied rooms
        const [totalRooms] = await promisePool.query('SELECT COUNT(*) as count FROM rooms');
        const [occupiedRooms] = await promisePool.query(
            'SELECT COUNT(DISTINCT room_id) as count FROM bookings WHERE ? BETWEEN check_in AND check_out AND status IN ("confirmed", "checked_in")',
            [today]
        );

        // Calculate occupancy rate
        const occupancyRate = totalRooms[0].count > 0 
            ? Math.round((occupiedRooms[0].count / totalRooms[0].count) * 100) 
            : 0;

        // Get current month's revenue
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const [monthlyRevenue] = await promisePool.query(
            'SELECT COALESCE(SUM(total_price), 0) as revenue FROM bookings WHERE DATE_FORMAT(created_at, "%Y-%m") = ? AND status != "cancelled"',
            [currentMonth]
        );

        // Get pending bookings count
        const [pendingBookings] = await promisePool.query(
            'SELECT COUNT(*) as count FROM bookings WHERE status = "pending"'
        );

        // Get revenue data for last 6 months
        const [revenueData] = await promisePool.query(`
            SELECT 
                DATE_FORMAT(created_at, '%b') as month,
                COALESCE(SUM(total_price), 0) as revenue
            FROM bookings
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                AND status != 'cancelled'
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY created_at ASC
            LIMIT 6
        `);

        // Get room type distribution
        const [roomDistribution] = await promisePool.query(`
            SELECT 
                room_type,
                COUNT(*) as count
            FROM rooms
            GROUP BY room_type
        `);

        res.json({
            todayCheckins: todayCheckins[0].count,
            occupancyRate: `${occupancyRate}%`,
            monthlyRevenue: parseFloat(monthlyRevenue[0].revenue),
            pendingBookings: pendingBookings[0].count,
            revenueLabels: revenueData.map(r => r.month),
            revenueData: revenueData.map(r => parseFloat(r.revenue)),
            roomLabels: roomDistribution.map(r => r.room_type.charAt(0).toUpperCase() + r.room_type.slice(1)),
            roomData: roomDistribution.map(r => r.count)
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ 
            error: 'Failed to fetch dashboard statistics',
            message: error.message 
        });
    }
});

/**
 * GET /api/admin/bookings
 * Get all bookings for admin view
 */
router.get('/bookings', async (req, res) => {
    try {
        const [bookings] = await promisePool.query(`
            SELECT 
                b.*,
                r.room_number,
                r.room_type
            FROM bookings b
            LEFT JOIN rooms r ON b.room_id = r.id
            ORDER BY b.created_at DESC
        `);

        res.json(bookings);

    } catch (error) {
        console.error('Error fetching admin bookings:', error);
        res.status(500).json({ 
            error: 'Failed to fetch bookings',
            message: error.message 
        });
    }
});

/**
 * GET /api/admin/guests
 * Get guest list with booking history
 */
router.get('/guests', async (req, res) => {
    try {
        const [guests] = await promisePool.query(`
            SELECT 
                guest_name as name,
                guest_email as email,
                guest_phone as phone,
                MAX(check_out) as last_stay,
                COUNT(*) as total_stays
            FROM bookings
            WHERE status != 'cancelled'
            GROUP BY guest_email, guest_name, guest_phone
            ORDER BY last_stay DESC
        `);

        res.json(guests);

    } catch (error) {
        console.error('Error fetching guests:', error);
        res.status(500).json({ 
            error: 'Failed to fetch guests',
            message: error.message 
        });
    }
});

/**
 * GET /api/admin/staff
 * Get staff list (demo data for now)
 */
router.get('/staff', async (req, res) => {
    try {
        // In a real application, this would fetch from a staff table
        // For now, returning demo data
        const staff = [
            {
                id: 1,
                name: 'Admin User',
                email: 'admin@kizalunalodge.com',
                role: 'admin',
                last_login: new Date().toISOString(),
                status: 'active'
            },
            {
                id: 2,
                name: 'Staff Member',
                email: 'staff@kizalunalodge.com',
                role: 'staff',
                last_login: new Date(Date.now() - 86400000).toISOString(),
                status: 'active'
            }
        ];

        res.json(staff);

    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ 
            error: 'Failed to fetch staff',
            message: error.message 
        });
    }
});

/**
 * POST /api/admin/settings
 * Save admin settings
 */
router.post('/settings', async (req, res) => {
    try {
        const settings = req.body;
        
        // In a real application, this would save to a settings table
        // For now, just return success
        res.json({ 
            success: true,
            message: 'Settings saved successfully',
            settings: settings
        });

    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ 
            error: 'Failed to save settings',
            message: error.message 
        });
    }
});

/**
 * POST /api/admin/bookings/:id/confirm
 * Confirm a pending booking
 */
router.post('/bookings/:id/confirm', async (req, res) => {
    try {
        const bookingId = req.params.id;

        const [result] = await promisePool.query(
            'UPDATE bookings SET status = "confirmed" WHERE id = ? AND status = "pending"',
            [bookingId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Booking not found or already confirmed' 
            });
        }

        res.json({ 
            success: true,
            message: 'Booking confirmed successfully' 
        });

    } catch (error) {
        console.error('Error confirming booking:', error);
        res.status(500).json({ 
            error: 'Failed to confirm booking',
            message: error.message 
        });
    }
});

module.exports = router;
