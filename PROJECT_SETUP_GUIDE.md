# 🏔️ Kizaluna Lodge - Complete Setup Guide

## Project Overview

A full-stack hotel booking system with:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MySQL

---

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MySQL** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/)
3. **Git** (optional) - [Download](https://git-scm.com/)
4. **Code Editor** (VS Code recommended)

---

## 🚀 Quick Start (5 Steps)

### Step 1: Install MySQL

**Windows:**
```bash
# Download MySQL Installer from mysql.com
# During installation, set root password (remember it!)
# Start MySQL service
net start MySQL80
```

**Mac:**
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

**Linux:**
```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### Step 2: Configure Database Credentials

1. Open `BACK END/.env` file
2. Update the password (if you set one during MySQL installation):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=kizaluna_lodge
PORT=3000
```

### Step 3: Install Backend Dependencies

```bash
cd "BACK END"
npm install
```

This installs:
- express (web framework)
- mysql2 (database driver)
- cors (cross-origin requests)
- dotenv (environment variables)
- body-parser (request parsing)
- uuid (unique IDs)

### Step 4: Setup Database

```bash
npm run setup-db
```

This will:
- ✅ Create `kizaluna_lodge` database
- ✅ Create `rooms` and `bookings` tables
- ✅ Insert 13 sample rooms
- ✅ Insert 5 sample bookings

Expected output:
```
✅ Database connected successfully
✅ Database schema created successfully
✅ Database seeded successfully

📊 Database Setup Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Database: kizaluna_lodge
✓ Total Rooms: 13
✓ Featured Rooms: 5
✓ Sample Bookings: 5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 5: Start the Backend Server

```bash
npm start
```

Expected output:
```
╔════════════════════════════════════════════════╗
║   🏔️  Kizaluna Lodge API Server Started  🏔️   ║
╚════════════════════════════════════════════════╝

🚀 Server running on: http://localhost:3000
📊 Environment: development
🗄️  Database: kizaluna_lodge
```

---

## 🌐 Access the Application

### Frontend
Open in your browser:
```
file:///YOUR_PATH/ZALUNA/FRONT END/index.html
```

Or use Live Server in VS Code:
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

### Backend API
```
http://localhost:3000
```

### Test Endpoints
```bash
# Get all rooms
http://localhost:3000/api/rooms

# Get featured rooms
http://localhost:3000/api/rooms/featured

# Health check
http://localhost:3000/health
```

---

## 📁 Project Structure

```
ZALUNA/
├── BACK END/
│   ├── config/
│   │   ├── database.js          # MySQL connection
│   │   ├── schema.sql           # Database schema
│   │   ├── seed.sql             # Sample data
│   │   └── setupDatabase.js     # Setup script
│   ├── routes/
│   │   ├── rooms.js             # Room endpoints
│   │   └── bookings.js          # Booking endpoints
│   ├── .env                     # Environment variables
│   ├── server.js                # Main server file
│   ├── package.json             # Dependencies
│   └── README.md                # Backend docs
│
├── FRONT END/
│   ├── index.html               # Homepage
│   ├── Rooms.html               # Rooms listing
│   ├── bookings.html            # Booking form
│   ├── about.html               # About page
│   ├── contact.html             # Contact page
│   ├── admin.html               # Admin dashboard
│   ├── Style.css                # Main styles
│   ├── main.js                  # Main JavaScript
│   ├── booking.js               # Booking logic
│   ├── admin.js                 # Admin logic
│   └── auth.js                  # Authentication
│
├── IMAGES/                      # Image assets
└── PROJECT_SETUP_GUIDE.md       # This file
```

---

## 🔧 Troubleshooting

### Issue 1: "Database connection failed"

**Solution:**
```bash
# Check if MySQL is running
# Windows:
net start MySQL80

# Mac/Linux:
sudo systemctl status mysql

# Verify credentials
mysql -u root -p
# Enter your password
```

### Issue 2: "Port 3000 already in use"

**Solution:**
```bash
# Option 1: Change port in .env
PORT=3001

# Option 2: Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

### Issue 3: "Cannot find module 'express'"

**Solution:**
```bash
cd "BACK END"
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: "CORS error" in browser

**Solution:**
- Make sure backend server is running
- Check browser console for exact error
- Verify API URL in frontend JavaScript files

### Issue 5: Frontend not loading rooms

**Checklist:**
1. ✅ Backend server running? (`npm start`)
2. ✅ Database setup complete? (`npm run setup-db`)
3. ✅ Check browser console for errors (F12)
4. ✅ Verify API endpoint: `http://localhost:3000/api/rooms`

---

## 🎯 Features

### Frontend Features
- ✅ Responsive design (mobile-friendly)
- ✅ Room browsing with filters
- ✅ Real-time availability checking
- ✅ Multi-step booking process
- ✅ Booking confirmation
- ✅ Admin dashboard
- ✅ Beautiful gradient hero section

### Backend Features
- ✅ RESTful API
- ✅ Room management
- ✅ Booking system
- ✅ Availability checking
- ✅ Date validation
- ✅ Conflict prevention
- ✅ Statistics dashboard

### Database Features
- ✅ 13 pre-loaded rooms (4 types)
- ✅ Booking history
- ✅ Relationship management
- ✅ Data validation
- ✅ Indexed queries

---

## 📊 Sample Data

### Room Types
1. **Standard Rooms** (3 rooms) - $119-$129/night
2. **Deluxe Rooms** (3 rooms) - $189-$199/night
3. **Suites** (3 rooms) - $299-$449/night
4. **Family Suites** (3 rooms) - $249-$329/night

### Featured Rooms
- Cozy Mountain View (Standard)
- Premium Mountain Suite (Deluxe)
- Sunset Deluxe Room (Deluxe)
- Executive Mountain Suite (Suite)
- Presidential Suite (Suite)
- Family Mountain Retreat (Family)

---

## 🔐 Security Notes

**For Development:**
- Default MySQL password is empty
- CORS is set to allow all origins
- No authentication required

**For Production:**
⚠️ **IMPORTANT**: Before deploying:
1. Set strong MySQL password
2. Configure CORS for specific domain
3. Add authentication middleware
4. Use HTTPS
5. Implement rate limiting
6. Add input sanitization
7. Use environment-specific configs

---

## 📝 API Documentation

### Rooms Endpoints

```http
GET /api/rooms
GET /api/rooms/featured
GET /api/rooms/available?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD
GET /api/rooms/:id
```

### Bookings Endpoints

```http
POST /api/bookings
GET /api/bookings
GET /api/bookings/:id
GET /api/bookings/reference/:reference
PUT /api/bookings/:id
DELETE /api/bookings/:id
GET /api/bookings/stats/dashboard
```

Full API documentation: `BACK END/README.md`

---

## 🎨 Customization

### Change Colors
Edit `FRONT END/Style.css`:
```css
:root {
    --primary-color: #2c5530;    /* Main green */
    --secondary-color: #d4a574;  /* Gold accent */
    --accent-color: #8b4513;     /* Brown */
}
```

### Add More Rooms
Edit `BACK END/config/seed.sql` and run:
```bash
npm run setup-db
```

### Modify Hero Gradient
Edit `FRONT END/Style.css` - `.hero` section

---

## 🚀 Development Workflow

1. **Start Backend:**
   ```bash
   cd "BACK END"
   npm start
   ```

2. **Open Frontend:**
   - Use Live Server in VS Code
   - Or open `index.html` in browser

3. **Make Changes:**
   - Frontend: Edit HTML/CSS/JS files
   - Backend: Edit routes or server.js
   - Database: Modify schema.sql and re-run setup

4. **Test:**
   - Check browser console (F12)
   - Check backend terminal for logs
   - Test API endpoints

---

## 📞 Support

### Common Commands

```bash
# Install dependencies
npm install

# Setup database
npm run setup-db

# Start server
npm start

# Start with auto-reload (development)
npm run dev

# Check MySQL status
mysql -u root -p
```

### Useful MySQL Commands

```sql
-- Show databases
SHOW DATABASES;

-- Use database
USE kizaluna_lodge;

-- Show tables
SHOW TABLES;

-- View rooms
SELECT * FROM rooms;

-- View bookings
SELECT * FROM bookings;

-- Delete all bookings
DELETE FROM bookings;

-- Reset database
DROP DATABASE kizaluna_lodge;
-- Then run: npm run setup-db
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] MySQL is running
- [ ] Database `kizaluna_lodge` exists
- [ ] Backend server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Frontend loads in browser
- [ ] Rooms display on homepage
- [ ] Can navigate between pages
- [ ] Booking form works
- [ ] No console errors

---

## 🎉 Success!

If you see:
- ✅ Rooms loading on homepage
- ✅ Booking form working
- ✅ No errors in console
- ✅ Backend server running

**Congratulations! Your Kizaluna Lodge booking system is ready!** 🏔️

---

## 📚 Next Steps

1. **Explore the Admin Panel** (`admin.html`)
2. **Test the Booking Flow**
3. **Customize the Design**
4. **Add More Features**
5. **Deploy to Production**

---

## 📄 License

This project is part of the Kizaluna Lodge booking system.

---

**Need Help?** Check:
1. This guide
2. `BACK END/README.md`
3. Browser console (F12)
4. Backend terminal logs
5. MySQL error logs

**Happy Coding! 🚀**
