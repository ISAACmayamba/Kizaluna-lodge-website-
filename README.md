# 🏔️ Kizaluna Lodge - Hotel Booking System

A complete full-stack hotel booking application with Node.js backend, MySQL database, and vanilla JavaScript frontend.

![Status](https://img.shields.io/badge/status-ready-success)
![Backend](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-green)
![Database](https://img.shields.io/badge/database-MySQL-blue)
![Frontend](https://img.shields.io/badge/frontend-HTML%20%2B%20CSS%20%2B%20JS-orange)

---

## ✨ Features

### 🎨 Frontend
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Beautiful gradient hero section
- ✅ Room browsing with filters
- ✅ Real-time availability checking
- ✅ Multi-step booking process
- ✅ Booking confirmation system
- ✅ Admin dashboard
- ✅ Modern UI with smooth animations

### 🚀 Backend
- ✅ RESTful API with Express.js
- ✅ MySQL database integration
- ✅ Room management system
- ✅ Booking system with conflict detection
- ✅ Date validation
- ✅ Automatic price calculation
- ✅ Statistics dashboard
- ✅ CORS enabled

### 🗄️ Database
- ✅ 13 pre-loaded rooms (4 categories)
- ✅ Sample booking data
- ✅ Normalized schema
- ✅ Foreign key relationships
- ✅ Indexed for performance

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)

### Windows Users
```bash
cd "BACK END"
QUICK_START.bat
```

### Mac/Linux Users
```bash
cd "BACK END"
chmod +x QUICK_START.sh
./QUICK_START.sh
```

### Manual Setup
```bash
# 1. Navigate to backend
cd "BACK END"

# 2. Install dependencies
npm install

# 3. Configure database (edit .env file with your MySQL password)

# 4. Setup database
npm run setup-db

# 5. Start server
npm start
```

### Access Application
- **Frontend:** Open `FRONT END/index.html` in your browser
- **Backend API:** http://localhost:3000
- **API Documentation:** http://localhost:3000

---

## 📁 Project Structure

```
ZALUNA/
├── BACK END/                    # Node.js + Express backend
│   ├── config/                  # Database configuration
│   ├── routes/                  # API routes
│   ├── server.js               # Main server file
│   ├── package.json            # Dependencies
│   └── .env                    # Environment variables
│
├── FRONT END/                   # Frontend application
│   ├── index.html              # Homepage
│   ├── Rooms.html              # Rooms listing
│   ├── bookings.html           # Booking form
│   ├── about.html              # About page
│   ├── contact.html            # Contact page
│   ├── admin.html              # Admin dashboard
│   ├── Style.css               # Main stylesheet
│   ├── main.js                 # Main JavaScript
│   ├── booking.js              # Booking logic
│   └── admin.js                # Admin functionality
│
├── IMAGES/                      # Image assets
├── PROJECT_SETUP_GUIDE.md      # Detailed setup guide
├── FIXES_APPLIED.md            # List of fixes applied
└── README.md                   # This file
```

---

## 📚 Documentation

- **[PROJECT_SETUP_GUIDE.md](PROJECT_SETUP_GUIDE.md)** - Complete setup instructions
- **[FIXES_APPLIED.md](FIXES_APPLIED.md)** - All fixes and improvements
- **[BACK END/README.md](BACK%20END/README.md)** - Backend API documentation

---

## 🎯 Room Categories

| Category | Rooms | Price Range | Capacity |
|----------|-------|-------------|----------|
| Standard | 3 | $119-$129/night | 2 guests |
| Deluxe | 3 | $189-$199/night | 2-3 guests |
| Suite | 3 | $299-$449/night | 2-4 guests |
| Family | 4 | $249-$329/night | 5-6 guests |

**Total:** 13 rooms available for booking

---

## 🔌 API Endpoints

### Rooms
```http
GET    /api/rooms                    # Get all rooms
GET    /api/rooms/featured           # Get featured rooms
GET    /api/rooms/available          # Check availability
GET    /api/rooms/:id                # Get single room
```

### Bookings
```http
POST   /api/bookings                 # Create booking
GET    /api/bookings                 # Get all bookings
GET    /api/bookings/:id             # Get single booking
PUT    /api/bookings/:id             # Update booking
DELETE /api/bookings/:id             # Cancel booking
GET    /api/bookings/stats/dashboard # Get statistics
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** mysql2 (with promises)
- **Environment:** dotenv
- **CORS:** cors middleware

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients & animations
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Poppins, Playfair Display)

### Database
- **MySQL 5.7+**
- **InnoDB Engine**
- **Foreign Keys**
- **Indexes**
- **JSON Fields**

---

## 🔧 Configuration

### Environment Variables (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=kizaluna_lodge
PORT=3000
```

### Database Credentials
Default setup uses:
- **Host:** localhost
- **User:** root
- **Password:** (empty - set yours in .env)
- **Database:** kizaluna_lodge

---

## 🧪 Testing

### Test Backend
```bash
# Check if server is running
curl http://localhost:3000/health

# Get all rooms
curl http://localhost:3000/api/rooms

# Get featured rooms
curl http://localhost:3000/api/rooms/featured
```

### Test Frontend
1. Open `FRONT END/index.html` in browser
2. Check browser console (F12) for errors
3. Verify rooms load on homepage
4. Test booking flow
5. Check admin dashboard

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if MySQL is running
# Windows: net start MySQL80
# Mac/Linux: sudo systemctl status mysql

# Verify credentials in .env
# Re-run database setup
npm run setup-db
```

### Frontend not loading rooms
1. ✅ Ensure backend is running (`npm start`)
2. ✅ Check browser console for errors
3. ✅ Verify API endpoint: http://localhost:3000/api/rooms
4. ✅ Check CORS settings

### Database connection failed
1. ✅ MySQL service running?
2. ✅ Correct credentials in .env?
3. ✅ Database created? (`npm run setup-db`)
4. ✅ User has permissions?

For more help, see [PROJECT_SETUP_GUIDE.md](PROJECT_SETUP_GUIDE.md)

---

## 🎨 Customization

### Change Colors
Edit `FRONT END/Style.css`:
```css
:root {
    --primary-color: #2c5530;
    --secondary-color: #d4a574;
    --accent-color: #8b4513;
}
```

### Add Rooms
Edit `BACK END/config/seed.sql` and run:
```bash
npm run setup-db
```

### Modify Hero Gradient
Edit `.hero` section in `FRONT END/Style.css`

---

## 🔐 Security Notes

### Development (Current)
- ⚠️ No authentication
- ⚠️ CORS allows all origins
- ⚠️ Default credentials

### Production (Required)
Before deploying:
1. ✅ Add authentication (JWT)
2. ✅ Configure CORS whitelist
3. ✅ Use strong passwords
4. ✅ Enable HTTPS
5. ✅ Add rate limiting
6. ✅ Sanitize inputs
7. ✅ Use environment configs

---

## 📊 Database Schema

### Tables
- **rooms** - Room information and pricing
- **bookings** - Booking records and guest details

### Relationships
- bookings.room_id → rooms.id (Foreign Key)

### Indexes
- room_type, is_available, is_featured
- check_in, check_out, status
- booking_reference, guest_email

---

## 🚀 Deployment

### Backend
1. Set production environment variables
2. Configure production database
3. Enable HTTPS
4. Set up reverse proxy (nginx)
5. Use process manager (PM2)

### Frontend
1. Host on web server (Apache/nginx)
2. Configure domain
3. Enable HTTPS
4. Optimize assets
5. Set up CDN (optional)

---

## 📝 License

This project is part of the Kizaluna Lodge booking system.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

---

## 📞 Support

### Documentation
- [Setup Guide](PROJECT_SETUP_GUIDE.md)
- [API Docs](BACK%20END/README.md)
- [Fixes Applied](FIXES_APPLIED.md)

### Common Commands
```bash
npm install          # Install dependencies
npm run setup-db     # Setup database
npm start           # Start server
npm run dev         # Start with auto-reload
```

---

## ✅ Status

- [x] Backend API complete
- [x] Database schema created
- [x] Frontend integrated
- [x] Sample data loaded
- [x] Documentation complete
- [x] Quick start scripts
- [ ] Payment integration
- [ ] Email notifications
- [ ] Admin authentication
- [ ] Production deployment

---

## 🎉 Success Criteria

Your setup is successful if:
- ✅ Backend starts without errors
- ✅ Database has 13 rooms
- ✅ Frontend loads rooms
- ✅ Booking form works
- ✅ No console errors

---

**Made with ❤️ for Kizaluna Lodge**

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** ✅ Production Ready (with security enhancements)
