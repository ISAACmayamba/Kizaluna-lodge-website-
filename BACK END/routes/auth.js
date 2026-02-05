const express = require('express');
const router = express.Router();

/**
 * POST /api/auth/login
 * Admin login endpoint (demo version)
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Username and password are required' 
            });
        }
        
        // Demo credentials (in production, this would check against database with hashed passwords)
        const validCredentials = [
            { username: 'admin', password: 'admin123', role: 'admin', id: 1 },
            { username: 'staff', password: 'staff123', role: 'staff', id: 2 }
        ];
        
        const user = validCredentials.find(
            cred => cred.username === username && cred.password === password
        );
        
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid username or password' 
            });
        }
        
        // Generate demo token (in production, use JWT)
        const token = `demo-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Return user data and token
        res.json({
            success: true,
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: `${user.username}@kizalunalodge.com`,
                role: user.role
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Internal server error during login' 
        });
    }
});

/**
 * POST /api/auth/logout
 * Admin logout endpoint
 */
router.post('/logout', (req, res) => {
    // In a real application, this would invalidate the token
    res.json({ 
        success: true,
        message: 'Logged out successfully' 
    });
});

/**
 * GET /api/auth/verify
 * Verify authentication token
 */
router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token || !token.startsWith('demo-token-')) {
        return res.status(401).json({ 
            error: 'Invalid or missing token' 
        });
    }
    
    // In production, verify JWT token here
    res.json({ 
        success: true,
        valid: true 
    });
});

module.exports = router;
