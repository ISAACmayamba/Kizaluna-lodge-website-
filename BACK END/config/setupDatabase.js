const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    let connection;
    
    try {
        console.log('🔧 Starting database setup...\n');
        
        // Connect to MySQL without specifying database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });
        
        console.log('✅ Connected to MySQL server');
        
        // Drop existing database if it exists
        console.log('\n🗑️  Dropping existing database (if any)...');
        await connection.query('DROP DATABASE IF EXISTS kizaluna_lodge');
        console.log('✅ Existing database dropped');
        
        // Read and execute schema.sql
        console.log('\n📋 Creating database schema...');
        const schemaSQL = await fs.readFile(path.join(__dirname, 'schema.sql'), 'utf8');
        await connection.query(schemaSQL);
        console.log('✅ Database schema created successfully');
        
        // Read and execute seed.sql
        console.log('\n🌱 Seeding database with sample data...');
        const seedSQL = await fs.readFile(path.join(__dirname, 'seed.sql'), 'utf8');
        const [results] = await connection.query(seedSQL);
        console.log('✅ Database seeded successfully');
        
        // Display summary
        console.log('\n📊 Database Setup Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Get counts
        await connection.query(`USE ${process.env.DB_NAME}`);
        const [roomCount] = await connection.query('SELECT COUNT(*) as count FROM rooms');
        const [bookingCount] = await connection.query('SELECT COUNT(*) as count FROM bookings');
        const [featuredCount] = await connection.query('SELECT COUNT(*) as count FROM rooms WHERE is_featured = TRUE');
        
        console.log(`✓ Database: ${process.env.DB_NAME}`);
        console.log(`✓ Total Rooms: ${roomCount[0].count}`);
        console.log(`✓ Featured Rooms: ${featuredCount[0].count}`);
        console.log(`✓ Sample Bookings: ${bookingCount[0].count}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        console.log('\n🎉 Database setup completed successfully!');
        console.log('\n💡 Next steps:');
        console.log('   1. Run: npm install');
        console.log('   2. Update .env file with your MySQL password if needed');
        console.log('   3. Run: npm start');
        console.log('   4. Open your frontend in a browser\n');
        
    } catch (error) {
        console.error('\n❌ Database setup failed:', error.message);
        console.error('\n💡 Troubleshooting:');
        console.error('   - Make sure MySQL is running');
        console.error('   - Check your database credentials in .env file');
        console.error('   - Verify MySQL user has CREATE DATABASE privileges');
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run setup
setupDatabase();
