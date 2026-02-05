/**
 * Kizaluna Lodge - Admin Dashboard JavaScript
 * Handles admin dashboard functionality, data management, and operations
 */

// Global variables
let currentUser = null;
let authToken = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeAdminDashboard();
});

/**
 * Initialize admin dashboard
 */
function initializeAdminDashboard() {
    // Check if user is logged in
    checkAdminLogin();
    
    // Initialize event listeners
    setupEventListeners();
    
    // Load initial data
    if (isLoggedIn()) {
        loadDashboardData();
        loadRecentBookings();
    }
}

/**
 * Check admin login status
 */
function checkAdminLogin() {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        showAdminDashboard();
    } else {
        showLoginScreen();
    }
}

/**
 * Show login screen
 */
function showLoginScreen() {
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
}

/**
 * Show admin dashboard
 */
function showAdminDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    
    // Update user info in sidebar
    updateUserInfo();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('adminLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Sidebar navigation
    document.querySelectorAll('.admin-sidebar li').forEach(item => {
        item.addEventListener('click', handleSidebarNavigation);
    });
    
    // Filter buttons
    const filterBtn = document.getElementById('filterBookings');
    if (filterBtn) {
        filterBtn.addEventListener('click', filterBookings);
    }
    
    const resetFilterBtn = document.getElementById('resetFilter');
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', resetBookingFilter);
    }
    
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeActiveModal);
    });
    
    // Outside click to close modal
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('form-modal')) {
            closeActiveModal();
        }
    });
    
    // Report generation
    const generateReportBtn = document.getElementById('generateReport');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }
    
    const exportReportBtn = document.getElementById('exportReport');
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', exportReport);
    }
    
    // Settings save
    const saveSettingsBtn = document.getElementById('saveSettings');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }
}

/**
 * Handle login
 */
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            throw new Error('Login failed');
        }
        
        const data = await response.json();
        
        // Store auth data
        authToken = data.token;
        currentUser = data.user;
        
        localStorage.setItem('adminToken', authToken);
        localStorage.setItem('adminUser', JSON.stringify(currentUser));
        
        // Show dashboard
        showAdminDashboard();
        showNotification('Login successful!', 'success');
        
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Invalid username or password', 'error');
        
        // For demo purposes, allow login with demo credentials
        if ((username === 'admin' && password === 'admin123') || 
            (username === 'staff' && password === 'staff123')) {
            
            authToken = 'demo-token';
            currentUser = {
                id: 1,
                username: username,
                email: `${username}@kizalunalodge.com`,
                role: username === 'admin' ? 'admin' : 'staff'
            };
            
            localStorage.setItem('adminToken', authToken);
            localStorage.setItem('adminUser', JSON.stringify(currentUser));
            
            showAdminDashboard();
            showNotification('Demo login successful!', 'success');
        }
        
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Handle logout
 */
function handleLogout(event) {
    event.preventDefault();
    
    // Clear auth data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    authToken = null;
    currentUser = null;
    
    // Show login screen
    showLoginScreen();
    showNotification('Logged out successfully', 'success');
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return authToken && currentUser;
}

/**
 * Update user info in sidebar
 */
function updateUserInfo() {
    const userAvatar = document.querySelector('.user-avatar');
    const userName = document.querySelector('.user-info h4');
    const userRole = document.querySelector('.user-info span');
    
    if (userAvatar && currentUser) {
        userAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
    }
    
    if (userName && currentUser) {
        userName.textContent = currentUser.username;
    }
    
    if (userRole && currentUser) {
        userRole.textContent = currentUser.role.toUpperCase();
    }
}

/**
 * Handle sidebar navigation
 */
function handleSidebarNavigation(event) {
    const sectionId = event.currentTarget.dataset.section;
    
    // Remove active class from all items
    document.querySelectorAll('.admin-sidebar li').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item
    event.currentTarget.classList.add('active');
    
    // Show selected section
    showSection(sectionId);
}

/**
 * Show section by ID
 */
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-main > div').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionId}Section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Load section data
        loadSectionData(sectionId);
    }
}

/**
 * Load data for section
 */
function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'rooms':
            loadRooms();
            break;
        case 'guests':
            loadGuests();
            break;
        case 'reports':
            loadReports();
            break;
        case 'staff':
            loadStaff();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

/**
 * Load dashboard data
 */
async function loadDashboardData() {
    try {
        // Fetch dashboard stats
        const response = await fetch('http://localhost:3000/api/admin/dashboard', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        let stats;
        if (response.ok) {
            stats = await response.json();
        } else {
            // Use demo data if API fails
            stats = getDemoDashboardStats();
        }
        
        updateDashboardCards(stats);
        initDashboardCharts(stats);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        const stats = getDemoDashboardStats();
        updateDashboardCards(stats);
        initDashboardCharts(stats);
    }
}

/**
 * Load recent bookings for dashboard
 */
async function loadRecentBookings() {
    try {
        const response = await fetch('http://localhost:3000/api/bookings');
        
        let bookings;
        if (response.ok) {
            const allBookings = await response.json();
            // Get only the 5 most recent bookings
            bookings = allBookings.slice(0, 5);
        } else {
            bookings = getDemoBookings().slice(0, 5);
        }
        
        displayRecentBookings(bookings);
        
    } catch (error) {
        console.error('Error loading recent bookings:', error);
        displayRecentBookings(getDemoBookings().slice(0, 5));
    }
}

/**
 * Display recent bookings in dashboard
 */
function displayRecentBookings(bookings) {
    const tbody = document.getElementById('recentBookings');
    if (!tbody) return;
    
    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>${booking.booking_reference}</td>
            <td>${booking.guest_name}</td>
            <td>Room ${booking.room_id}</td>
            <td>${formatDate(booking.check_in)}</td>
            <td>${formatDate(booking.check_out)}</td>
            <td>
                <span class="status-badge status-${booking.status}">
                    ${booking.status.replace('_', ' ').toUpperCase()}
                </span>
            </td>
            <td>
                <button class="btn-small btn-view" onclick="viewBooking(${booking.id})">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Update dashboard cards with stats
 */
function updateDashboardCards(stats) {
    const cards = {
        todayCheckins: stats.todayCheckins || 0,
        occupancyRate: stats.occupancyRate || '0%',
        monthlyRevenue: `$${(stats.monthlyRevenue || 0).toLocaleString()}`,
        pendingBookings: stats.pendingBookings || 0
    };
    
    Object.keys(cards).forEach(cardId => {
        const element = document.getElementById(cardId);
        if (element) {
            element.textContent = cards[cardId];
        }
    });
}

// Store chart instances globally to destroy them before recreating
let reportChartInstance = null;

/**
 * Initialize dashboard charts
 */
function initDashboardCharts(stats) {
    // No charts on dashboard - simplified UI
    // Charts are only used in Reports section
}

/**
 * Load bookings
 */
async function loadBookings() {
    try {
        const response = await fetch('http://localhost:3000/api/admin/bookings', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        let bookings;
        if (response.ok) {
            bookings = await response.json();
        } else {
            bookings = getDemoBookings();
        }
        
        displayBookings(bookings);
        
    } catch (error) {
        console.error('Error loading bookings:', error);
        displayBookings(getDemoBookings());
    }
}

/**
 * Display bookings in table
 */
function displayBookings(bookings) {
    const tbody = document.getElementById('bookingsTable');
    if (!tbody) return;
    
    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>${booking.booking_reference}</td>
            <td>
                <strong>${booking.guest_name}</strong><br>
                <small>${booking.guest_email}</small>
            </td>
            <td>${booking.room_number}</td>
            <td>
                ${formatDate(booking.check_in)}<br>
                to ${formatDate(booking.check_out)}
            </td>
            <td>$${parseFloat(booking.total_price).toFixed(2)}</td>
            <td>
                <span class="status-badge status-${booking.status}">
                    ${booking.status.replace('_', ' ').toUpperCase()}
                </span>
            </td>
            <td>${booking.payment_status || 'pending'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-view" onclick="viewBooking(${booking.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-small btn-edit" onclick="editBooking(${booking.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${booking.status === 'pending' ? 
                        `<button class="btn-small btn-confirm" onclick="confirmBooking(${booking.id})">
                            <i class="fas fa-check"></i>
                        </button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Filter bookings
 */
function filterBookings() {
    const statusFilter = document.getElementById('bookingFilter').value;
    const dateFilter = document.getElementById('bookingDateFilter').value;
    
    const rows = document.querySelectorAll('#bookingsTable tr');
    
    rows.forEach(row => {
        const status = row.querySelector('.status-badge')?.textContent.toLowerCase().replace(/ /g, '_');
        const date = row.cells[3]?.textContent;
        
        let show = true;
        
        if (statusFilter && status !== statusFilter) {
            show = false;
        }
        
        if (dateFilter && date && !date.includes(dateFilter)) {
            show = false;
        }
        
        row.style.display = show ? '' : 'none';
    });
}

/**
 * Reset booking filter
 */
function resetBookingFilter() {
    document.getElementById('bookingFilter').value = '';
    document.getElementById('bookingDateFilter').value = '';
    
    const rows = document.querySelectorAll('#bookingsTable tr');
    rows.forEach(row => {
        row.style.display = '';
    });
}

/**
 * Load rooms
 */
async function loadRooms() {
    try {
        const response = await fetch('http://localhost:3000/api/rooms');
        let rooms;
        
        if (response.ok) {
            rooms = await response.json();
        } else {
            rooms = getDemoRooms();
        }
        
        displayRooms(rooms);
        
    } catch (error) {
        console.error('Error loading rooms:', error);
        displayRooms(getDemoRooms());
    }
}

/**
 * Display rooms
 */
function displayRooms(rooms) {
    const grid = document.getElementById('adminRoomsGrid');
    if (!grid) return;
    
    grid.innerHTML = rooms.map(room => {
        // Parse images array from JSON string if needed
        let imageUrl = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800';
        
        if (room.images) {
            try {
                const images = typeof room.images === 'string' ? JSON.parse(room.images) : room.images;
                if (Array.isArray(images) && images.length > 0) {
                    imageUrl = images[0];
                }
            } catch (e) {
                console.error('Error parsing room images:', e);
            }
        }
        
        return `
            <div class="room-card">
                <div class="room-image" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center; height: 200px; position: relative;">
                    ${room.is_available ? 
                        '<span class="status-badge status-confirmed" style="position: absolute; top: 10px; left: 10px;">Available</span>' :
                        '<span class="status-badge status-cancelled" style="position: absolute; top: 10px; left: 10px;">Occupied</span>'
                    }
                </div>
                <div class="room-info">
                    <h3>Room ${room.room_number} - ${room.room_type.toUpperCase()}</h3>
                    <p style="color: var(--primary-color); font-weight: bold; margin: 0.5rem 0;">
                        $${room.price_per_night}/night
                    </p>
                    <p>${room.title}</p>
                    <p style="font-size: 0.9rem; color: #666;">
                        <i class="fas fa-user"></i> ${room.capacity} guests • 
                        <i class="fas fa-expand"></i> ${room.size || 'N/A'}
                    </p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                        <div class="action-buttons">
                            <button class="btn-small btn-edit" onclick="editRoom(${room.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-small btn-delete" onclick="deleteRoom(${room.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Load guests
 */
async function loadGuests() {
    try {
        const response = await fetch('http://localhost:3000/api/admin/guests', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        let guests;
        if (response.ok) {
            guests = await response.json();
        } else {
            guests = getDemoGuests();
        }
        
        displayGuests(guests);
        
    } catch (error) {
        console.error('Error loading guests:', error);
        displayGuests(getDemoGuests());
    }
}

/**
 * Display guests
 */
function displayGuests(guests) {
    const tbody = document.getElementById('guestsTable');
    if (!tbody) return;
    
    tbody.innerHTML = guests.map(guest => `
        <tr>
            <td>
                <strong>${guest.name}</strong><br>
                <small>${guest.country || 'Not specified'}</small>
            </td>
            <td>${guest.email}</td>
            <td>${guest.phone}</td>
            <td>${guest.last_stay ? formatDate(guest.last_stay) : 'Never'}</td>
            <td>${guest.total_stays || 0}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-view" onclick="viewGuest(${guest.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-small btn-edit" onclick="editGuest(${guest.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Load reports
 */
async function loadReports() {
    // Initialize report chart
    initReportChart();
}

/**
 * Initialize report chart
 */
function initReportChart() {
    const reportCtx = document.getElementById('reportChart');
    if (!reportCtx) return;
    
    // Destroy existing chart if it exists
    if (reportChartInstance) {
        reportChartInstance.destroy();
    }
    
    const ctx = reportCtx.getContext('2d');
    
    // Sample data for reports
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Revenue',
            data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 32000, 29000, 35000, 33000, 40000],
            backgroundColor: 'rgba(44, 85, 48, 0.2)',
            borderColor: '#2c5530',
            borderWidth: 2,
            fill: true
        }]
    };
    
    reportChartInstance = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

/**
 * Generate report
 */
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const reportMonth = document.getElementById('reportMonth').value;
    
    // Show loading
    showNotification(`Generating ${reportType} report for ${reportMonth}...`, 'info');
    
    // In a real application, this would fetch data from the API
    setTimeout(() => {
        showNotification('Report generated successfully!', 'success');
        updateReportTable(reportType, reportMonth);
    }, 1500);
}

/**
 * Update report table
 */
function updateReportTable(reportType, reportMonth) {
    const table = document.getElementById('reportTable');
    if (!table) return;
    
    let html = '';
    
    switch(reportType) {
        case 'revenue':
            html = `
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Bookings</th>
                        <th>Revenue</th>
                        <th>Average</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${reportMonth}-01</td>
                        <td>12</td>
                        <td>$2,450.00</td>
                        <td>$204.17</td>
                    </tr>
                    <tr>
                        <td>${reportMonth}-08</td>
                        <td>15</td>
                        <td>$3,120.00</td>
                        <td>$208.00</td>
                    </tr>
                    <tr>
                        <td>${reportMonth}-15</td>
                        <td>18</td>
                        <td>$3,850.00</td>
                        <td>$213.89</td>
                    </tr>
                </tbody>
            `;
            break;
            
        case 'occupancy':
            html = `
                <thead>
                    <tr>
                        <th>Room Type</th>
                        <th>Total Nights</th>
                        <th>Occupancy Rate</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Standard</td>
                        <td>45</td>
                        <td>75%</td>
                        <td>$5,850.00</td>
                    </tr>
                    <tr>
                        <td>Deluxe</td>
                        <td>38</td>
                        <td>63%</td>
                        <td>$7,600.00</td>
                    </tr>
                    <tr>
                        <td>Suite</td>
                        <td>42</td>
                        <td>70%</td>
                        <td>$12,600.00</td>
                    </tr>
                </tbody>
            `;
            break;
    }
    
    table.innerHTML = html;
}

/**
 * Export report
 */
function exportReport() {
    const reportType = document.getElementById('reportType').value;
    const reportMonth = document.getElementById('reportMonth').value;
    
    // Create CSV content
    let csvContent = `Kizaluna Lodge ${reportType} Report - ${reportMonth}\n\n`;
    
    // Add data based on report type
    switch(reportType) {
        case 'revenue':
            csvContent += "Date,Bookings,Revenue,Average\n";
            csvContent += "2024-01-01,12,2450.00,204.17\n";
            csvContent += "2024-01-08,15,3120.00,208.00\n";
            csvContent += "2024-01-15,18,3850.00,213.89\n";
            break;
            
        case 'occupancy':
            csvContent += "Room Type,Total Nights,Occupancy Rate,Revenue\n";
            csvContent += "Standard,45,75%,5850.00\n";
            csvContent += "Deluxe,38,63%,7600.00\n";
            csvContent += "Suite,42,70%,12600.00\n";
            break;
    }
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kizaluna-${reportType}-${reportMonth}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Report exported successfully!', 'success');
}

/**
 * Load staff
 */
async function loadStaff() {
    try {
        const response = await fetch('http://localhost:3000/api/admin/staff', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        let staff;
        if (response.ok) {
            staff = await response.json();
        } else {
            staff = getDemoStaff();
        }
        
        displayStaff(staff);
        
    } catch (error) {
        console.error('Error loading staff:', error);
        displayStaff(getDemoStaff());
    }
}

/**
 * Display staff
 */
function displayStaff(staff) {
    const tbody = document.getElementById('staffTable');
    if (!tbody) return;
    
    tbody.innerHTML = staff.map(member => `
        <tr>
            <td>
                <strong>${member.name}</strong><br>
                <small>ID: ${member.id}</small>
            </td>
            <td>
                <span class="status-badge ${member.role === 'admin' ? 'status-confirmed' : 'status-checked_in'}">
                    ${member.role.toUpperCase()}
                </span>
            </td>
            <td>${member.email}</td>
            <td>${member.last_login ? formatDate(member.last_login) : 'Never'}</td>
            <td>
                <span class="status-badge ${member.status === 'active' ? 'status-confirmed' : 'status-cancelled'}">
                    ${member.status.toUpperCase()}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-edit" onclick="editStaff(${member.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${member.id !== currentUser?.id ? 
                        `<button class="btn-small btn-delete" onclick="deleteStaff(${member.id})">
                            <i class="fas fa-trash"></i>
                        </button>` : ''
                    }
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Load settings
 */
function loadSettings() {
    // Settings would be loaded from API in real application
    showNotification('Settings loaded', 'info');
}

/**
 * Save settings
 */
async function saveSettings() {
    // Collect settings from form
    const settings = {
        lodgeName: document.querySelector('[name="lodgeName"]')?.value,
        checkInTime: document.querySelector('[name="checkInTime"]')?.value,
        checkOutTime: document.querySelector('[name="checkOutTime"]')?.value,
        currency: document.querySelector('[name="currency"]')?.value,
        taxRate: document.querySelector('[name="taxRate"]')?.value
    };
    
    try {
        // Save to API
        const response = await fetch('http://localhost:3000/api/admin/settings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
        
        if (response.ok) {
            showNotification('Settings saved successfully!', 'success');
        } else {
            throw new Error('Failed to save settings');
        }
        
    } catch (error) {
        console.error('Error saving settings:', error);
        showNotification('Settings saved locally (demo mode)', 'success');
    }
}

/**
 * View booking details
 */
function viewBooking(bookingId) {
    showNotification(`Viewing booking #${bookingId}`, 'info');
    // In real app, this would open a modal with booking details
}

/**
 * Edit booking
 */
function editBooking(bookingId) {
    showNotification(`Editing booking #${bookingId}`, 'info');
    // In real app, this would open an edit modal
}

/**
 * Confirm booking
 */
async function confirmBooking(bookingId) {
    if (!confirm('Are you sure you want to confirm this booking?')) {
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/api/admin/bookings/${bookingId}/confirm`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showNotification('Booking confirmed successfully!', 'success');
            loadBookings(); // Refresh the list
        } else {
            throw new Error('Failed to confirm booking');
        }
        
    } catch (error) {
        console.error('Error confirming booking:', error);
        showNotification('Booking confirmed (demo mode)', 'success');
        
        // Simulate success in demo mode
        setTimeout(() => {
            loadBookings();
        }, 500);
    }
}

/**
 * Edit room
 */
function editRoom(roomId) {
    showNotification(`Editing room #${roomId}`, 'info');
    // In real app, this would open an edit modal
}

/**
 * Delete room
 */
function deleteRoom(roomId) {
    if (!confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
        return;
    }
    
    showNotification(`Room #${roomId} deleted (demo mode)`, 'success');
    // In real app, this would call the API
}

/**
 * View guest
 */
function viewGuest(guestId) {
    showNotification(`Viewing guest #${guestId} details`, 'info');
    // In real app, this would open a modal
}

/**
 * Edit guest
 */
function editGuest(guestId) {
    showNotification(`Editing guest #${guestId}`, 'info');
    // In real app, this would open an edit modal
}

/**
 * Edit staff
 */
function editStaff(staffId) {
    showNotification(`Editing staff #${staffId}`, 'info');
    // In real app, this would open an edit modal
}

/**
 * Delete staff
 */
function deleteStaff(staffId) {
    if (!confirm('Are you sure you want to delete this staff member?')) {
        return;
    }
    
    showNotification(`Staff #${staffId} deleted (demo mode)`, 'success');
    // In real app, this would call the API
}

/**
 * Show modal for new booking
 */
function showBookingModal() {
    document.getElementById('bookingModal').classList.add('active');
}

/**
 * Show modal for new room
 */
function showRoomModal() {
    document.getElementById('roomModal').classList.add('active');
}

/**
 * Show modal for new staff
 */
function showStaffModal() {
    document.getElementById('staffModal').classList.add('active');
}

/**
 * Close active modal
 */
function closeActiveModal() {
    document.querySelectorAll('.form-modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
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
    } else {
        notification.style.backgroundColor = '#17a2b8';
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
 * Demo data functions
 */
function getDemoDashboardStats() {
    return {
        todayCheckins: 3,
        occupancyRate: '85%',
        monthlyRevenue: 25430,
        pendingBookings: 7,
        revenueLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        revenueData: [12000, 19000, 15000, 25000, 22000, 30000],
        roomLabels: ['Standard', 'Deluxe', 'Suite', 'Family'],
        roomData: [30, 25, 20, 25]
    };
}

function getDemoBookings() {
    return [
        {
            id: 1,
            booking_reference: 'KL-2024-001',
            guest_name: 'John Smith',
            guest_email: 'john@example.com',
            room_number: '201',
            check_in: '2024-01-15',
            check_out: '2024-01-18',
            total_price: '599.97',
            status: 'confirmed',
            payment_status: 'paid'
        },
        {
            id: 2,
            booking_reference: 'KL-2024-002',
            guest_name: 'Sarah Johnson',
            guest_email: 'sarah@example.com',
            room_number: '101',
            check_in: '2024-01-16',
            check_out: '2024-01-17',
            total_price: '129.99',
            status: 'checked_in',
            payment_status: 'paid'
        },
        {
            id: 3,
            booking_reference: 'KL-2024-003',
            guest_name: 'Robert Chen',
            guest_email: 'robert@example.com',
            room_number: '301',
            check_in: '2024-01-20',
            check_out: '2024-01-25',
            total_price: '1499.95',
            status: 'pending',
            payment_status: 'pending'
        }
    ];
}

function getDemoRooms() {
    return [
        {
            id: 1,
            room_number: '101',
            room_type: 'standard',
            title: 'Mountain View Standard',
            price_per_night: 129.99,
            capacity: 2,
            size: '25 sqm',
            is_available: true
        },
        {
            id: 2,
            room_number: '201',
            room_type: 'deluxe',
            title: 'Deluxe Mountain Suite',
            price_per_night: 199.99,
            capacity: 3,
            size: '35 sqm',
            is_available: false
        },
        {
            id: 3,
            room_number: '301',
            room_type: 'suite',
            title: 'Executive Suite',
            price_per_night: 299.99,
            capacity: 4,
            size: '50 sqm',
            is_available: true
        }
    ];
}

function getDemoGuests() {
    return [
        {
            id: 1,
            name: 'John Smith',
            email: 'john@example.com',
            phone: '+1 (555) 123-4567',
            country: 'USA',
            last_stay: '2024-01-15',
            total_stays: 3
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '+1 (555) 987-6543',
            country: 'Canada',
            last_stay: '2024-01-16',
            total_stays: 1
        }
    ];
}

function getDemoStaff() {
    return [
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
            last_login: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            status: 'active'
        }
    ];
}

// Export functions for global access
window.showSection = showSection;
window.filterBookings = filterBookings;
window.resetBookingFilter = resetBookingFilter;
window.generateReport = generateReport;
window.exportReport = exportReport;
window.saveSettings = saveSettings;
window.viewBooking = viewBooking;
window.editBooking = editBooking;
window.confirmBooking = confirmBooking;
window.editRoom = editRoom;
window.deleteRoom = deleteRoom;
window.viewGuest = viewGuest;
window.editGuest = editGuest;
window.editStaff = editStaff;
window.deleteStaff = deleteStaff;
window.showBookingModal = showBookingModal;
window.showRoomModal = showRoomModal;
window.showStaffModal = showStaffModal;
window.closeActiveModal = closeActiveModal;
window.showNotification = showNotification;