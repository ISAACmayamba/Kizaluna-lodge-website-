// Main JavaScript for Kizaluna Lodge

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Load featured rooms on homepage
    if (document.getElementById('featuredRooms')) {
        loadFeaturedRooms();
    }
    
    // Initialize date pickers
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        const today = new Date().toISOString().split('T')[0];
        input.min = today;
        
        if (input.id === 'checkIn') {
            input.addEventListener('change', function() {
                const checkOutInput = document.getElementById('checkOut');
                if (checkOutInput) {
                    checkOutInput.min = this.value;
                    if (checkOutInput.value && checkOutInput.value < this.value) {
                        checkOutInput.value = this.value;
                    }
                }
            });
        }
    });
    
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
    
    // Booking form room type change handler
    const roomTypeSelect = document.getElementById('roomType');
    if (roomTypeSelect) {
        roomTypeSelect.addEventListener('change', updateRoomAvailability);
    }
});

// Load featured rooms
async function loadFeaturedRooms() {
    try {
        const response = await fetch('http://localhost:3000/api/rooms/featured');
        const rooms = await response.json();
        
        const roomsGrid = document.getElementById('featuredRooms');
        if (roomsGrid && rooms.length > 0) {
            roomsGrid.innerHTML = rooms.map(room => `
                <div class="room-card">
                    <div class="room-image" style="background-image: url('${room.images[0] || 'images/default-room.jpg'}')"></div>
                    <div class="room-info">
                        <h3>${room.room_type.charAt(0).toUpperCase() + room.room_type.slice(1)} Room</h3>
                        <p class="room-price">$${room.price_per_night}/night</p>
                        <p>${room.description.substring(0, 100)}...</p>
                        <div class="room-amenities">
                            <span><i class="fas fa-user"></i> ${room.capacity} guests</span>
                            <span><i class="fas fa-wifi"></i> WiFi</span>
                        </div>
                        <a href="bookings.html?room=${room.id}" class="btn-primary" style="display: block; text-align: center; margin-top: 1rem;">Book Now</a>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading featured rooms:', error);
        document.getElementById('featuredRooms').innerHTML = `
            <div class="error-message">
                <p>Unable to load rooms. Please try again later.</p>
            </div>
        `;
    }
}

// Update room availability based on dates
async function updateRoomAvailability() {
    const checkIn = document.getElementById('checkIn')?.value;
    const checkOut = document.getElementById('checkOut')?.value;
    const roomType = document.getElementById('roomType')?.value;
    
    if (checkIn && checkOut && roomType) {
        try {
            const response = await fetch(`http://localhost:3000/api/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}&type=${roomType}`);
            const rooms = await response.json();
            
            const roomSelect = document.getElementById('roomId');
            if (roomSelect) {
                roomSelect.innerHTML = '<option value="">Select a room</option>';
                rooms.forEach(room => {
                    roomSelect.innerHTML += `<option value="${room.id}">Room ${room.room_number} - $${room.price_per_night}/night</option>`;
                });
            }
        } catch (error) {
            console.error('Error checking room availability:', error);
        }
    }
}

// Form validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.classList.remove('error');
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
            showNotification('Please fill in all required fields', 'error');
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.classList.add('error');
                isValid = false;
                showNotification('Please enter a valid email address', 'error');
            }
        }
        
        // Phone validation
        if (input.type === 'tel' && input.value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(input.value.replace(/[\s\-\(\)]/g, ''))) {
                input.classList.add('error');
                isValid = false;
                showNotification('Please enter a valid phone number', 'error');
            }
        }
    });
    
    // Date validation for booking
    const checkIn = form.querySelector('#checkIn');
    const checkOut = form.querySelector('#checkOut');
    if (checkIn && checkOut && checkIn.value && checkOut.value) {
        const checkInDate = new Date(checkIn.value);
        const checkOutDate = new Date(checkOut.value);
        
        if (checkOutDate <= checkInDate) {
            checkOut.classList.add('error');
            isValid = false;
            showNotification('Check-out date must be after check-in date', 'error');
        }
    }
    
    return isValid;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Booking calculation
function calculateBookingTotal() {
    const checkIn = document.getElementById('checkIn')?.value;
    const checkOut = document.getElementById('checkOut')?.value;
    const roomSelect = document.getElementById('roomId');
    const totalElement = document.getElementById('totalPrice');
    
    if (checkIn && checkOut && roomSelect?.value && totalElement) {
        const price = parseFloat(roomSelect.selectedOptions[0].text.split('$')[1]?.split('/')[0]) || 0;
        const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
        
        if (nights > 0 && price > 0) {
            const total = price * nights;
            totalElement.textContent = `Total: $${total} for ${nights} night${nights > 1 ? 's' : ''}`;
        }
    }
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 10000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 300px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    }
    
    .notification.success {
        background-color: #4CAF50;
    }
    
    .notification.error {
        background-color: #f44336;
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 20px;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    input.error, select.error, textarea.error {
        border-color: #f44336 !important;
        box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.1) !important;
    }
`;

document.head.appendChild(notificationStyles);