-- Seed data for Kizaluna Lodge
USE kizaluna_lodge;

-- Insert sample rooms
INSERT INTO rooms (title, room_type, description, price_per_night, capacity, size, images, amenities, is_featured, room_number) VALUES
-- Standard Rooms
('Cozy Mountain View', 'standard', 'A comfortable standard room with stunning mountain views. Perfect for couples or solo travelers seeking a peaceful retreat. Features a queen-size bed, modern amenities, and a private balcony overlooking the valley.', 119.99, 2, '25 sqm', 
'["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800", "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800"]', 
'["WiFi", "TV", "Air Conditioning", "Mini Bar", "Coffee Maker", "Safe"]', 
TRUE, 'S101'),

('Garden Paradise Standard', 'standard', 'Charming standard room with garden views and all essential amenities. Ideal for budget-conscious travelers who don\'t want to compromise on comfort. Includes a comfortable king bed and workspace area.', 129.99, 2, '28 sqm',
'["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"]',
'["WiFi", "TV", "Air Conditioning", "Mini Bar", "Work Desk", "Safe"]',
FALSE, 'S102'),

('Valley View Standard', 'standard', 'Peaceful standard room overlooking the serene valley. Features modern decor, comfortable bedding, and a relaxing atmosphere perfect for unwinding after a day of mountain adventures.', 124.99, 2, '26 sqm',
'["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"]',
'["WiFi", "TV", "Air Conditioning", "Coffee Maker", "Safe"]',
FALSE, 'S103'),

-- Deluxe Rooms
('Premium Mountain Suite', 'deluxe', 'Spacious deluxe room with panoramic mountain views and upgraded amenities. Features a king-size bed, separate seating area, luxury bathroom with soaking tub, and premium toiletries. Perfect for those seeking extra comfort and style.', 189.99, 2, '38 sqm',
'["https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800", "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800", "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800"]',
'["WiFi", "Smart TV", "Air Conditioning", "Mini Bar", "Coffee Machine", "Bathtub", "Balcony", "Safe", "Bathrobes"]',
TRUE, 'D201'),

('Sunset Deluxe Room', 'deluxe', 'Elegant deluxe room with west-facing windows for spectacular sunset views. Includes premium bedding, spacious bathroom, work area, and complimentary refreshments. Ideal for romantic getaways or business travelers.', 199.99, 3, '40 sqm',
'["https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800", "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"]',
'["WiFi", "Smart TV", "Air Conditioning", "Mini Bar", "Espresso Machine", "Bathtub", "Work Desk", "Safe", "Premium Toiletries"]',
TRUE, 'D202'),

('Alpine Deluxe', 'deluxe', 'Modern deluxe room with alpine-inspired decor and mountain vistas. Features upgraded amenities, comfortable seating area, and a luxurious bathroom. Perfect for extended stays with ample storage and workspace.', 194.99, 2, '36 sqm',
'["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800"]',
'["WiFi", "Smart TV", "Air Conditioning", "Mini Bar", "Coffee Machine", "Bathtub", "Safe"]',
FALSE, 'D203'),

-- Suites
('Executive Mountain Suite', 'suite', 'Luxurious suite with separate living room, bedroom, and stunning mountain views from every window. Features king bed, full entertainment system, dining area, and executive workspace. Includes complimentary breakfast and evening cocktails.', 299.99, 3, '55 sqm',
'["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800", "https://images.unsplash.com/photo-1560185127-6a7e4c5c7e3f?w=800", "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800", "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800"]',
'["WiFi", "Smart TV", "Sound System", "Air Conditioning", "Full Mini Bar", "Espresso Machine", "Jacuzzi", "Separate Living Room", "Dining Area", "Work Desk", "Safe", "Premium Amenities", "Balcony"]',
TRUE, 'SU301'),

('Presidential Suite', 'suite', 'Our finest accommodation featuring two bedrooms, expansive living area, private terrace, and unparalleled luxury. Includes personal concierge service, complimentary spa access, and gourmet minibar. Perfect for special occasions and VIP guests.', 449.99, 4, '75 sqm',
'["https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800", "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800", "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800"]',
'["WiFi", "Multiple Smart TVs", "Premium Sound System", "Air Conditioning", "Premium Mini Bar", "Full Kitchen", "Jacuzzi", "Multiple Bathrooms", "Private Terrace", "Dining Room", "Office", "Safe", "Luxury Amenities", "Concierge Service"]',
TRUE, 'SU302'),

('Honeymoon Suite', 'suite', 'Romantic suite designed for couples, featuring a king bed, private balcony with mountain views, and luxurious bathroom with double vanity and soaking tub. Includes champagne on arrival and rose petal turndown service.', 349.99, 2, '50 sqm',
'["https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800", "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"]',
'["WiFi", "Smart TV", "Sound System", "Air Conditioning", "Champagne Bar", "Espresso Machine", "Jacuzzi Tub", "Separate Living Area", "Private Balcony", "Safe", "Luxury Toiletries", "Bathrobes & Slippers"]',
FALSE, 'SU303'),

-- Family Suites
('Family Mountain Retreat', 'family', 'Spacious family suite with two bedrooms, living area, and kitchenette. Master bedroom with king bed, second bedroom with two twin beds. Perfect for families with children, featuring kid-friendly amenities and games.', 249.99, 5, '60 sqm',
'["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800", "https://images.unsplash.com/photo-1560185127-6a7e4c5c7e3f?w=800", "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800"]',
'["WiFi", "Multiple TVs", "Air Conditioning", "Kitchenette", "Mini Bar", "Coffee Maker", "Two Bathrooms", "Living Room", "Dining Area", "Safe", "Kids Amenities", "Board Games"]',
TRUE, 'F401'),

('Grand Family Suite', 'family', 'Ultimate family accommodation with three bedrooms, full kitchen, and spacious living area. Sleeps up to 6 guests comfortably. Includes children\'s play area, multiple bathrooms, and family-friendly entertainment options.', 329.99, 6, '80 sqm',
'["https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800", "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800"]',
'["WiFi", "Multiple Smart TVs", "Air Conditioning", "Full Kitchen", "Washer/Dryer", "Mini Bar", "Three Bathrooms", "Large Living Room", "Dining Room", "Play Area", "Safe", "Kids Amenities"]',
FALSE, 'F402'),

('Adventure Family Suite', 'family', 'Family-friendly suite with outdoor theme decor, two bedrooms, and living space. Features bunk beds in kids room, master bedroom with queen bed, and family entertainment center. Includes complimentary kids welcome pack.', 269.99, 5, '58 sqm',
'["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"]',
'["WiFi", "Smart TV", "Gaming Console", "Air Conditioning", "Kitchenette", "Mini Bar", "Two Bathrooms", "Living Area", "Safe", "Kids Welcome Pack", "Outdoor Gear Storage"]',
FALSE, 'F403');

-- Insert some sample bookings (for testing)
INSERT INTO bookings (room_id, booking_reference, guest_name, guest_email, guest_phone, guest_country, check_in, check_out, adults, children, total_nights, room_price, total_price, payment_method, status, special_requests) VALUES
(1, 'KL-2024-1001', 'John Smith', 'john.smith@email.com', '+1-555-0101', 'United States', '2024-02-15', '2024-02-18', 2, 0, 3, 119.99, 395.97, 'credit_card', 'confirmed', 'Late check-in requested'),
(4, 'KL-2024-1002', 'Sarah Johnson', 'sarah.j@email.com', '+1-555-0102', 'Canada', '2024-02-20', '2024-02-25', 2, 0, 5, 189.99, 1044.95, 'paypal', 'confirmed', 'Anniversary celebration - champagne requested'),
(10, 'KL-2024-1003', 'Michael Brown', 'mbrown@email.com', '+1-555-0103', 'United Kingdom', '2024-03-01', '2024-03-05', 4, 2, 4, 249.99, 1099.96, 'credit_card', 'pending', 'Traveling with children ages 5 and 8'),
(7, 'KL-2024-1004', 'Emily Davis', 'emily.davis@email.com', '+1-555-0104', 'Australia', '2024-03-10', '2024-03-15', 2, 0, 5, 299.99, 1649.95, 'bank_transfer', 'confirmed', 'Business trip - need early breakfast'),
(2, 'KL-2024-1005', 'David Wilson', 'dwilson@email.com', '+1-555-0105', 'United States', '2024-02-12', '2024-02-14', 2, 0, 2, 129.99, 285.98, 'cash', 'cancelled', 'Plans changed');

-- Verify data
SELECT 'Rooms inserted:' as Info, COUNT(*) as Count FROM rooms;
SELECT 'Bookings inserted:' as Info, COUNT(*) as Count FROM bookings;
SELECT 'Featured rooms:' as Info, COUNT(*) as Count FROM rooms WHERE is_featured = TRUE;
