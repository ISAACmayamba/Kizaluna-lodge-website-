# Infinite Recursion Error Fix

## Problem Summary
The booking page was experiencing a "Maximum call stack size exceeded" error due to infinite recursion in the `checkAvailability()` function.

## Root Cause
In `bookings.html`, the inline script had a direct call to `checkAvailability()` on line 467:
```javascript
if (step === 2) {
    checkAvailability();  // This was calling itself infinitely
}
```

The issue was that there was no local `checkAvailability()` function defined in the inline script, so JavaScript would look for it in the global scope. However, when `booking.js` exports `window.checkAvailability`, the inline script's call would create a naming conflict.

## Solution Applied
Changed the call to explicitly reference the function from `booking.js` via the window object:
```javascript
if (step === 2) {
    if (window.checkAvailability && typeof window.checkAvailability === 'function') {
        window.checkAvailability();
    }
}
```

This ensures:
1. The function is called from the correct scope (booking.js)
2. We check if the function exists before calling it
3. No infinite recursion occurs

## Additional Issues Identified

### Backend Server Not Running
The errors also showed:
- `ERR_CONNECTION_REFUSED` for API calls to `localhost:3000`
- `Failed to fetch` errors in main.js

**Solution**: Start the backend server before testing the booking functionality.

## How to Start the Backend Server

### Option 1: Using Quick Start Scripts (Recommended)
**Windows:**
```bash
cd "BACK END"
QUICK_START.bat
```

**Mac/Linux:**
```bash
cd "BACK END"
./QUICK_START.sh
```

### Option 2: Manual Start
```bash
cd "BACK END"
npm install
node server.js
```

The server should start on `http://localhost:3000`

## Testing the Fix

1. Start the backend server (see above)
2. Open `FRONT END/bookings.html` in a browser
3. Fill in the booking form (Step 1)
4. Click "Check Availability" to proceed to Step 2
5. Verify:
   - No "Maximum call stack size exceeded" error
   - Available rooms are loaded from the API
   - No infinite recursion in the console

## Files Modified
- `FRONT END/bookings.html` - Fixed the checkAvailability() call to prevent infinite recursion

## Status
✅ Infinite recursion error FIXED
⚠️ Backend server needs to be started for full functionality
