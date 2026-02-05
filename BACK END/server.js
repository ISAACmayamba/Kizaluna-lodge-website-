const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { testConnection } = require('./config/database');
const roomsRouter = require('./routes/rooms');
const bookingsRouter = require('./routes/bookings');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Kizaluna Lodge API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/admin', adminRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Kizaluna Lodge API',
        version: '1.0.0',
            endpoints: {
                health: '/health',
                auth: {
                    login: 'POST /api/auth/login',
                    logout: 'POST /api/auth/logout',
                    verify: 'GET /api/auth/verify'
                },
                rooms: {
                all: 'GET /api/rooms',
                featured: 'GET /api/rooms/featured',
                available: 'GET /api/rooms/available?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD',
                single: 'GET /api/rooms/:id'
            },
            bookings: {
                create: 'POST /api/bookings',
                all: 'GET /api/bookings',
                single: 'GET /api/bookings/:id',
                byReference: 'GET /api/bookings/reference/:reference',
                update: 'PUT /api/bookings/:id',
                cancel: 'DELETE /api/bookings/:id',
                stats: 'GET /api/bookings/stats/dashboard'
            }
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.path}`,
        availableEndpoints: '/'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
async function startServer() {
    try {
        // Test database connection
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            console.error('\n⚠️  Warning: Database connection failed!');
            console.error('💡 Make sure to:');
            console.error('   1. Install MySQL and start the service');
            console.error('   2. Update .env file with correct credentials');
            console.error('   3. Run: npm run setup-db\n');
        }
        
        // Start listening
        app.listen(PORT, () => {
            console.log('\n╔════════════════════════════════════════════════╗');
            console.log('║   🏔️  Kizaluna Lodge API Server Started  🏔️   ║');
            console.log('╚════════════════════════════════════════════════╝');
            console.log(`\n🚀 Server running on: http://localhost:${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🗄️  Database: ${process.env.DB_NAME || 'kizaluna_lodge'}`);
            console.log('\n📚 API Documentation: http://localhost:' + PORT);
            console.log('🏥 Health Check: http://localhost:' + PORT + '/health');
            console.log('\n💡 Available Endpoints:');
            console.log('   • POST /api/auth/login');
            console.log('   • GET  /api/admin/dashboard');
            console.log('   • GET  /api/admin/bookings');
            console.log('   • GET  /api/rooms');
            console.log('   • GET  /api/rooms/featured');
            console.log('   • GET  /api/rooms/available');
            console.log('   • POST /api/bookings');
            console.log('   • GET  /api/bookings');
            console.log('\n⌨️  Press Ctrl+C to stop the server\n');
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n👋 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n👋 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

// Start the server
startServer();

module.exports = app;
