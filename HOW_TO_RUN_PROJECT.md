# 🏔️ How to Run Kizaluna Lodge Project

## ✅ Current Status
Your backend server is **ALREADY RUNNING** successfully!
- Backend API: http://localhost:3000 ✅
- Database: Connected ✅
- All endpoints working ✅

---

## 🚀 How to Open Your Website

### Important: You have TWO servers running together

1. **Backend Server (Node.js)** - Port 3000
   - Already running ✅
   - Handles API requests (rooms, bookings, etc.)
   - DO NOT open http://localhost:3000 in browser directly

2. **Frontend Server (Live Server)** - Port 5500
   - You need to start this
   - Serves your HTML/CSS/JS files
   - This is what you open in the browser

---

## 📝 Step-by-Step Instructions

### Step 1: Start Live Server

**Option A: Right-click method**
1. In the file explorer (left sidebar)
2. Navigate to `FRONT END` folder
3. Right-click on `index.html`
4. Select **"Open with Live Server"**

**Option B: Go Live button**
1. Open `FRONT END/index.html` in the editor
2. Look at the bottom-right corner
3. Click the **"Go Live"** button

### Step 2: Access Your Website

Once Live Server starts, your browser will automatically open to:
```
http://127.0.0.1:5500/FRONT%20END/index.html
```

Or manually navigate to:
```
http://localhost:5500/FRONT%20END/index.html
```

---

## 🌐 Available Pages

After Live Server starts, you can access:

- **Homepage:** http://localhost:5500/FRONT%20END/index.html
- **Rooms:** http://localhost:5500/FRONT%20END/Rooms.html
- **Bookings:** http://localhost:5500/FRONT%20END/bookings.html
- **Admin:** http://localhost:5500/FRONT%20END/admin.html
- **About:** http://localhost:5500/FRONT%20END/about.html
- **Contact:** http://localhost:5500/FRONT%20END/contact.html

---

## ⚠️ Common Mistakes

### ❌ WRONG: Opening localhost:3000 in browser
```
http://localhost:3000  ← This won't work!
```
This is the backend API server, not the website.

### ✅ CORRECT: Opening with Live Server
```
http://localhost:5500/FRONT%20END/index.html  ← This works!
```
This serves your HTML files properly.

---

## 🔧 Troubleshooting

### If you see "ERR_CONNECTION_REFUSED"

**Check which URL you're using:**
- ❌ `http://localhost:3000` - Wrong! This is the API server
- ✅ `http://localhost:5500/FRONT%20END/index.html` - Correct!

**Solution:**
1. Don't try to open localhost:3000 in your browser
2. Use Live Server to open the HTML files
3. Live Server will run on port 5500
4. The frontend (port 5500) will communicate with backend (port 3000) automatically

---

## 📊 How It Works

```
Browser (You)
    ↓
Live Server (Port 5500)
    ↓ Serves HTML/CSS/JS
Your Website
    ↓ Makes API calls
Backend Server (Port 3000)
    ↓ Queries
Database (MySQL)
```

---

## ✅ Quick Checklist

Before accessing your website:
- [x] Backend server running on port 3000 ✅ (Already done!)
- [ ] Live Server started (Click "Go Live" or right-click index.html)
- [ ] Browser opens to http://localhost:5500/...
- [ ] Website loads successfully

---

## 🎯 Summary

**What you need to do:**
1. Right-click `FRONT END/index.html`
2. Select "Open with Live Server"
3. Browser opens automatically
4. Enjoy your website! 🎉

**What NOT to do:**
- ❌ Don't try to open http://localhost:3000 in browser
- ❌ Don't double-click HTML files (use Live Server instead)

---

## 🆘 Still Having Issues?

If Live Server doesn't work:
1. Check if Live Server extension is installed
2. Try restarting your editor
3. Or simply double-click `index.html` to open in browser (will work but without live reload)

---

**Your backend is ready! Just start Live Server and you're good to go!** 🚀
