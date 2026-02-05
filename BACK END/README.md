# Kizaluna Lodge - Backend API

A RESTful API for the Kizaluna Lodge hotel booking system built with Node.js, Express, and MySQL.

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   cd "BACK END"
   npm install
   ```

2. **Configure Environment**
   
   Update the `.env` file with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=kizaluna_lodge
   PORT=3000
   ```

3. **Setup Database**
   ```bash
   npm run setup-db
   ```
   
   This will:
   - Create the `kizaluna_lodge` database
   - Create all necessary tables
   - Seed sample data (13 rooms, 5 sample bookings)

4. **Start Server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Verify Installation**
   
   Open your browser and visit:
   - API Root: http://localhost:3000
   - Health Check: http://localhost:3000/health
   - All Rooms: http://localhost:3000/api/rooms

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### **Rooms**

##### Get All Rooms
```http
GET /api/rooms
```

Query Parameters:
- `type` - Filter by room type (standard, deluxe, suite, family)
- `capacity` - Minimum capacity
- `minPrice` - Minimum price per night
- `maxPrice` - Maximum price per night

Example:
```bash
GET /api/rooms?type=deluxe&capacity=2
```

##### Get Featured Rooms
```http
GET /api/rooms/featured
```

Returns up to 6 featured rooms for homepage display.

##### Check Room Availability
```http
GET /api/rooms/available?checkIn=2024-03-01&checkOut=2024-03-05
```

Query Parameters (Required):
- `checkIn` - Check-in date (YYYY-MM-DD)
- `checkOut` - Check-out date (YYYY-MM-DD)

Optional:
- `type` - Room type filter
- `adults` - Number of adults (default: 2)
- `children` - Number of children (default: 0)

##### Get Single Room
```http
GET /api/rooms/:id
```

#### **Bookings**

##### Create Booking
```http
POST /api/bookings
Content-Type: application/json

{
  "roomId": 1,
  "checkIn": "2024-03-01",
  "checkOut": "2024-03-05",
  "adults": 2,
  "children": 0,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "country": "United States",
  "address": "123 Main St",
  "specialRequests": "Late check-in",
  "paymentMethod": "credit_card",
  "roomPrice": 189.99,
  "totalNights": 4,
  "totalPrice": 835.96
}
```

Response:
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": 6,
    "booking_reference": "KL-2024-1234",
    "status": "pending",
    ...
  }
}
```

##### Get All Bookings
```http
GET /api/bookings
```

Query Parameters:
- `status` - Filter by status (pending, confirmed, cancelled, completed)
- `email` - Filter by guest email
- `startDate` - Filter bookings from this date
- `endDate` - Filter bookings until this date

##### Get Single Booking
```http
GET /api/bookings/:id
```

##### Get Booking by Reference
```http
GET /api/bookings/reference/:reference
```

Example:
```bash
GET /api/bookings/reference/KL-2024-1234
```

##### Update Booking Status
```http
PUT /api/bookings/:id
Content-Type: application/json

{
  "status": "confirmed"
}
```

Valid statuses: `pending`, `confirmed`, `cancelled`, `completed`

##### Cancel Booking
```http
DELETE /api/bookings/:id
```

##### Get Dashboard Statistics
```http
GET /api/bookings/stats/dashboard
```

Returns:
```json
{
  "total": 10,
  "pending": 3,
  "confirmed": 5,
  "cancelled": 2,
  "revenue": 5234.50,
  "upcoming": 4,
  "current": 1
}
```

## 🗄️ Database Schema

### Tables

#### `rooms`
- `id` - Primary key
- `title` - Room title
- `room_type` - ENUM: standard, deluxe, suite, family
- `description` - Room description
- `price_per_night` - Decimal price
- `capacity` - Number of guests
- `size` - Room size (e.g., "35 sqm")
- `images` - JSON array of image paths
- `amenities` - JSON array of amenities
- `is_featured` - Boolean
- `is_available` - Boolean
- `room_number` - Unique room identifier
- `created_at`, `updated_at` - Timestamps

#### `bookings`
- `id` - Primary key
- `room_id` - Foreign key to rooms
- `booking_reference` - Unique reference (e.g., KL-2024-1234)
- `guest_name`, `guest_email`, `guest_phone` - Guest details
- `guest_country`, `guest_address` - Optional guest info
- `check_in`, `check_out` - Booking dates
- `adults`, `children` - Number of guests
- `total_nights` - Calculated nights
- `room_price` - Price per night at booking time
- `total_price` - Total booking cost
- `payment_method` - ENUM: credit_card, paypal, bank_transfer, cash
- `status` - ENUM: pending, confirmed, cancelled, completed
- `special_requests` - Guest requests
- `created_at`, `updated_at` - Timestamps

## 🔧 Troubleshooting

### Database Connection Issues

If you see "Database connection failed":

1. **Check MySQL is running**
   ```bash
   # Windows
   net start MySQL80
   
   # Mac/Linux
   sudo systemctl start mysql
   ```

2. **Verify credentials in .env**
   - Make sure DB_PASSWORD matches your MySQL root password
   - Test connection: `mysql -u root -p`

3. **Check MySQL port**
   - Default is 3306
   - Verify in MySQL config or update DB_PORT in .env

### Port Already in Use

If port 3000 is already in use:

1. Change PORT in `.env` file
2. Or stop the process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:3000 | xargs kill
   ```

### Database Setup Fails

If `npm run setup-db` fails:

1. **Check MySQL user privileges**
   ```sql
   GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Manually create database**
   ```sql
   CREATE DATABASE kizaluna_lodge;
   ```

3. **Run SQL files manually**
   ```bash
   mysql -u root -p kizaluna_lodge < config/schema.sql
   mysql -u root -p kizaluna_lodge < config/seed.sql
   ```

## 📝 Development

### Project Structure
```
BACK END/
├── config/
│   ├── database.js       # Database connection
│   ├── schema.sql        # Database schema
│   ├── seed.sql          # Sample data
│   └── setupDatabase.js  # Setup script
├── routes/
│   ├── rooms.js          # Room endpoints
│   └── bookings.js       # Booking endpoints
├── .env                  # Environment variables
├── server.js             # Main server file
├── package.json          # Dependencies
└── README.md            # This file
```

### Adding New Features

1. **New Route**: Create file in `routes/` folder
2. **Register Route**: Add to `server.js`
3. **Database Changes**: Update `schema.sql` and re-run setup

### Testing

Test endpoints using:
- Browser for GET requests
- Postman or Thunder Client for all requests
- cURL commands

Example cURL:
```bash
curl http://localhost:3000/api/rooms/featured
```

## 🔒 Security Notes

For production deployment:

1. **Change default credentials** in `.env`
2. **Set CORS_ORIGIN** to your frontend domain
3. **Add authentication** for admin endpoints
4. **Use HTTPS** for all connections
5. **Implement rate limiting**
6. **Add input validation** middleware
7. **Use environment-specific configs**

## 📄 License

This project is part of the Kizaluna Lodge booking system.

## 🆘 Support

For issues or questions:
1. Check this README
2. Review error logs in console
3. Verify database connection
4. Check API endpoint documentation

---

**Happy Coding! 🏔️**
