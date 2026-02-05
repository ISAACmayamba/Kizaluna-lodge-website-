/**
 * Kizaluna Lodge - Booking JavaScript
 * Handles booking functionality, availability checks, and form submission
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeBookingPage();
});

// Global variables
let selectedRoom = null;
let bookingData = {
    checkIn: null,
    checkOut: null,
    adults: 2,
    children: 0,
    roomType: '',
    roomId: null,
    roomPrice: null,
    totalNights: 0,
    totalPrice: 0,
    taxRate: 0.10 // 10% tax
};

/**
 * Initialize booking page
 */
function initializeBookingPage() {
    // Check for room parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    
    if (roomId) {
        bookingData.roomId = parseInt(roomId);
        loadRoomDetails(roomId);
    }
    
    // Set default dates
    setDefaultDates();
    
    // Add event listeners
    addBookingEventListeners();
    
    // Calculate initial totals if dates are set
    if (bookingData.checkIn && bookingData.checkOut) {
        calculateBookingTotal();
    }
}

/**
 * Set default check-in/check-out dates
 */
function setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    if (checkInInput) {
        checkInInput.min = today.toISOString().split('T')[0];
        checkInInput.value = today.toISOString().split('T')[0];
        bookingData.checkIn = checkInInput.value;
    }
    
    if (checkOutInput) {
        checkOutInput.min = tomorrow.toISOString().split('T')[0];
        checkOutInput.value = tomorrow.toISOString().split('T')[0];
        bookingData.checkOut = checkOutInput.value;
    }
}

/**
 * Add event listeners for booking form
 */
function addBookingEventListeners() {
    // Date change listeners
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const adultsSelect = document.getElementById('adults');
    const childrenSelect = document.getElementById('children');
    const roomTypeSelect = document.getElementById('roomType');
    
    if (checkInInput) {
        checkInInput.addEventListener('change', function() {
            bookingData.checkIn = this.value;
            updateCheckOutMinDate();
            if (checkOutInput.value) {
                checkAvailability();
            }
        });
    }
    
    if (checkOutInput) {
        checkOutInput.addEventListener('change', function() {
            bookingData.checkOut = this.value;
            calculateBookingTotal();
            if (checkInInput.value) {
                checkAvailability();
            }
        });
    }
    
    if (adultsSelect) {
        adultsSelect.addEventListener('change', function() {
            bookingData.adults = parseInt(this.value);
            checkAvailability();
        });
    }
    
    if (childrenSelect) {
        childrenSelect.addEventListener('change', function() {
            bookingData.children = parseInt(this.value);
            checkAvailability();
        });
    }
    
    if (roomTypeSelect) {
        roomTypeSelect.addEventListener('change', function() {
            bookingData.roomType = this.value;
            checkAvailability();
        });
    }
    
    // Form submission
    const bookingForm = document.querySelector('#bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
}

/**
 * Update minimum check-out date based on check-in date
 */
function updateCheckOutMinDate() {
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    if (checkInInput.value && checkOutInput) {
        const minDate = new Date(checkInInput.value);
        minDate.setDate(minDate.getDate() + 1);
        checkOutInput.min = minDate.toISOString().split('T')[0];
        
        // If current check-out is before new min date, update it
        if (checkOutInput.value < checkOutInput.min) {
            checkOutInput.value = checkOutInput.min;
            bookingData.checkOut = checkOutInput.value;
        }
    }
}

/**
 * Check room availability
 */
async function checkAvailability() {
    // Validate dates
    if (!bookingData.checkIn || !bookingData.checkOut) {
        showNotification('Please select both check-in and check-out dates', 'error');
        return;
    }
    
    // Calculate nights
    const nights = calculateNights(bookingData.checkIn, bookingData.checkOut);
    if (nights < 1) {
        showNotification('Check-out date must be after check-in date', 'error');
        return;
    }
    
    bookingData.totalNights = nights;
    
    // Show loading state
    const availableRoomsContainer = document.getElementById('availableRooms');
    if (availableRoomsContainer) {
        availableRoomsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-spinner fa-spin fa-2x" style="color: var(--primary-color);"></i>
                <p style="margin-top: 1rem;">Checking availability...</p>
            </div>
        `;
    }
    
    try {
        // Build query parameters
        const params = new URLSearchParams({
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            adults: bookingData.adults,
            children: bookingData.children
        });
        
        if (bookingData.roomType) {
            params.append('type', bookingData.roomType);
        }
        
        // Fetch available rooms from API
        const response = await fetch(`http://localhost:3000/api/rooms/available?${params}`);
        
        if (!response.ok) {
            throw new Error('Failed to check availability');
        }
        
        const rooms = await response.json();
        displayAvailableRooms(rooms);
        
    } catch (error) {
        console.error('Error checking availability:', error);
        showNotification('Unable to check availability. Please try again.', 'error');
        
        if (availableRoomsContainer) {
            availableRoomsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #dc3545;">
                    <i class="fas fa-exclamation-triangle fa-2x"></i>
                    <p style="margin-top: 1rem;">Unable to load rooms. Please try again.</p>
                    <button onclick="checkAvailability()" class="btn-primary" style="margin-top: 1rem;">
                        Retry
                    </button>
                </div>
            `;
        }
    }
}

/**
 * Display available rooms
 */
function displayAvailableRooms(rooms) {
    const availableRoomsContainer = document.getElementById('availableRooms');
    const nextButton = document.getElementById('nextStep2');
    
    if (!availableRoomsContainer) return;
    
    if (rooms.length === 0) {
        availableRoomsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: #f8f9fa; border-radius: 10px;">
                <i class="fas fa-bed fa-3x" style="color: #ccc; margin-bottom: 1rem;"></i>
                <h4>No rooms available</h4>
                <p>There are no available rooms for the selected dates and criteria.</p>
                <p style="font-size: 0.9rem; color: #666; margin-top: 1rem;">
                    Try different dates or adjust your search criteria.
                </p>
            </div>
        `;
        
        if (nextButton) nextButton.disabled = true;
        return;
    }
    
    // Display available rooms
    availableRoomsContainer.innerHTML = rooms.map(room => {
        const nights = bookingData.totalNights;
        const total = room.price_per_night * nights;
        const tax = total * bookingData.taxRate;
        const finalTotal = total + tax;
        
        return `
            <div class="room-option" onclick="selectRoom(${room.id}, ${room.price_per_night})" id="room-${room.id}">
                <div style="display: flex; gap: 1rem; align-items: start;">
                    <div style="flex: 1;">
                        <h4>${room.title}</h4>
                        <p style="color: var(--primary-color); font-weight: bold; margin: 0.5rem 0;">
                            $${room.price_per_night.toFixed(2)} / night
                        </p>
                        <p>${room.description.substring(0, 100)}...</p>
                        <div style="display: flex; gap: 1rem; margin-top: 1rem; color: var(--accent-color);">
                            <span><i class="fas fa-user"></i> ${room.capacity} guests</span>
                            <span><i class="fas fa-expand"></i> ${room.size || 'N/A'}</span>
                            <span><i class="fas fa-wifi"></i> WiFi</span>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-size: 1.2rem; font-weight: bold;">$${finalTotal.toFixed(2)}</p>
                        <p style="font-size: 0.9rem; color: #666;">
                            $${room.price_per_night.toFixed(2)} × ${nights} night${nights > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Enable next button if rooms are available
    if (nextButton) {
        nextButton.disabled = false;
    }
    
    // Auto-select room if pre-selected
    if (bookingData.roomId) {
        const preSelectedRoom = rooms.find(r => r.id === bookingData.roomId);
        if (preSelectedRoom) {
            selectRoom(preSelectedRoom.id, preSelectedRoom.price_per_night);
        }
    }
}

/**
 * Select a room for booking
 */
function selectRoom(roomId, roomPrice) {
    // Remove selected class from all rooms
    document.querySelectorAll('.room-option').forEach(room => {
        room.classList.remove('selected');
    });
    
    // Add selected class to chosen room
    const selectedRoomElement = document.getElementById(`room-${roomId}`);
    if (selectedRoomElement) {
        selectedRoomElement.classList.add('selected');
        selectedRoomElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Update booking data
    selectedRoom = roomId;
    bookingData.roomId = roomId;
    bookingData.roomPrice = roomPrice;
    
    // Calculate total
    calculateBookingTotal();
    
    // Enable next step button
    const nextButton = document.getElementById('nextStep2');
    if (nextButton) {
        nextButton.disabled = false;
    }
}

/**
 * Calculate booking total
 */
function calculateBookingTotal() {
    if (!bookingData.checkIn || !bookingData.checkOut || !bookingData.roomPrice) {
        return;
    }
    
    const nights = calculateNights(bookingData.checkIn, bookingData.checkOut);
    const subtotal = bookingData.roomPrice * nights;
    const tax = subtotal * bookingData.taxRate;
    const total = subtotal + tax;
    
    bookingData.totalNights = nights;
    bookingData.totalPrice = total;
    
    // Update UI
    const totalElement = document.getElementById('totalPrice');
    if (totalElement) {
        totalElement.innerHTML = `
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Room rate:</span>
                    <span>$${bookingData.roomPrice.toFixed(2)} × ${nights} nights</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Tax (${(bookingData.taxRate * 100)}%):</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem; padding-top: 0.5rem; border-top: 1px solid #ddd;">
                    <span>Total:</span>
                    <span style="color: var(--primary-color);">$${total.toFixed(2)}</span>
                </div>
            </div>
        `;
    }
}

/**
 * Calculate number of nights between two dates
 */
function calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Load room details if room ID is in URL
 */
async function loadRoomDetails(roomId) {
    try {
        const response = await fetch(`http://localhost:3000/api/rooms/${roomId}`);
        if (response.ok) {
            const room = await response.json();
            
            // Auto-fill room type
            const roomTypeSelect = document.getElementById('roomType');
            if (roomTypeSelect && room.room_type) {
                roomTypeSelect.value = room.room_type;
                bookingData.roomType = room.room_type;
            }
            
            // Show room details
            const roomDetailsElement = document.getElementById('roomDetails');
            if (roomDetailsElement) {
                roomDetailsElement.innerHTML = `
                    <div style="background: #f0f7f0; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                        <h4>Selected Room: ${room.title}</h4>
                        <p>$${room.price_per_night}/night • ${room.capacity} guests • ${room.size || 'N/A'}</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading room details:', error);
    }
}

/**
 * Handle booking form submission
 */
async function handleBookingSubmit(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateBookingForm()) {
        return;
    }
    
    // Get guest details
    const guestData = {
        name: document.getElementById('guestName').value,
        email: document.getElementById('guestEmail').value,
        phone: document.getElementById('guestPhone').value,
        country: document.getElementById('guestCountry').value || '',
        address: document.getElementById('guestAddress').value || '',
        specialRequests: document.getElementById('specialRequests').value || ''
    };
    
    // Get payment method
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    // Prepare booking data
    const bookingSubmission = {
        ...bookingData,
        ...guestData,
        paymentMethod: paymentMethod,
        status: 'pending'
    };
    
    // Show loading state
    const submitBtn = document.querySelector('#bookingForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    try {
        // Submit booking to API
        const response = await fetch('http://localhost:3000/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingSubmission)
        });
        
        if (!response.ok) {
            throw new Error('Booking submission failed');
        }
        
        const result = await response.json();
        
        // Show success message
        showBookingConfirmation(result.booking);
        
        // Reset form
        resetBookingForm();
        
    } catch (error) {
        console.error('Error submitting booking:', error);
        showNotification('Failed to submit booking. Please try again.', 'error');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Validate booking form
 */
function validateBookingForm() {
    const requiredFields = [
        'guestName',
        'guestEmail',
        'guestPhone',
        'paymentMethod'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.remove('error');
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
                showNotification(`Please fill in ${field.labels[0]?.textContent || fieldId}`, 'error');
            }
        }
    });
    
    // Validate email
    const emailField = document.getElementById('guestEmail');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('error');
            isValid = false;
            showNotification('Please enter a valid email address', 'error');
        }
    }
    
    // Validate phone
    const phoneField = document.getElementById('guestPhone');
    if (phoneField && phoneField.value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phoneField.value.replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            phoneField.classList.add('error');
            isValid = false;
            showNotification('Please enter a valid phone number', 'error');
        }
    }
    
    // Validate terms acceptance
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox && !termsCheckbox.checked) {
        isValid = false;
        showNotification('Please accept the terms and conditions', 'error');
    }
    
    return isValid;
}

/**
 * Show booking confirmation
 */
function showBookingConfirmation(booking) {
    const confirmationSection = document.getElementById('confirmationSection');
    const bookingForm = document.getElementById('bookingForm');
    
    if (confirmationSection && bookingForm) {
        bookingForm.style.display = 'none';
        confirmationSection.style.display = 'block';
        
        // Update confirmation details
        document.getElementById('bookingRefNumber').textContent = booking.booking_reference || 'KL-' + Date.now();
        document.getElementById('confirmationName').textContent = booking.guest_name;
        document.getElementById('confirmationEmail').textContent = booking.guest_email;
        document.getElementById('confirmationDates').textContent = 
            `${booking.check_in} to ${booking.check_out} (${bookingData.totalNights} nights)`;
        document.getElementById('confirmationTotal').textContent = `$${bookingData.totalPrice.toFixed(2)}`;
        
        // Scroll to confirmation
        confirmationSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Reset booking form
 */
function resetBookingForm() {
    // Clear form fields
    const form = document.getElementById('bookingForm');
    if (form) {
        form.reset();
    }
    
    // Reset booking data
    bookingData = {
        checkIn: null,
        checkOut: null,
        adults: 2,
        children: 0,
        roomType: '',
        roomId: null,
        roomPrice: null,
        totalNights: 0,
        totalPrice: 0,
        taxRate: 0.10
    };
    
    // Reset UI
    const availableRoomsContainer = document.getElementById('availableRooms');
    if (availableRoomsContainer) {
        availableRoomsContainer.innerHTML = '';
    }
    
    const totalElement = document.getElementById('totalPrice');
    if (totalElement) {
        totalElement.innerHTML = '';
    }
    
    // Reset dates
    setDefaultDates();
}

/**
 * Show notification
 */
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 300px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#dc3545';
    } else if (type === 'warning') {
        notification.style.backgroundColor = '#ffc107';
        notification.style.color = '#000';
    }
    
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; font-size: 1.2rem; cursor: pointer; margin-left: 15px;">
            &times;
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Print booking confirmation
 */
function printBookingConfirmation() {
    const printContent = document.getElementById('confirmationSection').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Booking Confirmation - Kizaluna Lodge</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #2c5530; }
                .print-header { text-align: center; margin-bottom: 30px; }
                .confirmation-details { background: #f8f9fa; padding: 20px; border-radius: 8px; }
                .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .total { font-size: 1.2rem; font-weight: bold; color: #2c5530; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="print-header">
                <h1>Kizaluna Lodge</h1>
                <h2>Booking Confirmation</h2>
            </div>
            ${printContent}
            <div style="margin-top: 30px; font-size: 0.9rem; color: #666; text-align: center;">
                <p>Thank you for choosing Kizaluna Lodge!</p>
                <p>For any questions, contact us at (555) 123-4567 or info@kizalunalodge.com</p>
            </div>
        </body>
        </html>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    location.reload();
}

// Export functions for global access
window.checkAvailability = checkAvailability;
window.selectRoom = selectRoom;
window.printBookingConfirmation = printBookingConfirmation;
window.showNotification = showNotification;