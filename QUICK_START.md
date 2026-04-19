# 🚀 Lussica - Quick Start Guide

## Prerequisites

### Backend Setup
1. **Start Backend Server:**
   ```bash
   cd backend
   npm install  # if not already done
   npm start
   ```
   - Should show: `✅ MongoDB connected` and `🚀 Server running on port 5000`
   - If MongoDB error appears: check `.env` file has `MONGO_URI`

2. **Check Backend Health:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   - Should return: `{ status: 'OK', message: '🚀 Luccica API running' }`

### Frontend Setup
1. **Start Frontend Server:**
   ```bash
   cd frontend
   npm install  # if not already done
   npm start
   ```
   - Should show: `Compiled successfully!`
   - Should open http://localhost:3000

---

## ✅ Testing Workflow

### 1. Test Backend Connection
- If you see **red warning at top**: "Backend server not running"
  - → Start backend: `cd backend && npm start`
  - → Reload page after backend starts

### 2. Test User Signup
1. Go to http://localhost:3000/login
2. Click "Create One"
3. Enter email: `test@example.com`
4. Password: `password123` (min 6 chars)
5. Confirm: `password123`
6. Click "Create Account"
7. Should redirect to home page

### 3. Test Menu (No Login Required)
1. Go to http://localhost:3000/menu
2. Should see all menu items ✓

### 4. Test Add to Cart (No Login Required)
1. Click "+ Add to Cart" on any item
2. Toast shows: "🛒 item added to cart" ✓

### 5. Test Checkout (Login Required)
1. Click "Cart" button in navbar
2. Click "Place Order" **without logging in**
3. Should show login prompt ✓
4. Click "Sign In" in prompt
5. Login with test account: test@example.com / password123
6. Should see success toast ✓

### 6. Test Admin Panel
1. Go to http://localhost:3000
2. Scroll to footer
3. Hover over ⚙️ icon (appears as faint text)
4. Click it → goes to admin login
5. Login: `admin` / `admin123`
6. Should see Admin Panel ✓
7. Click "Orders" tab to see real-time orders
8. Should see your order from step 5 ✓

---

## 🐛 Troubleshooting

### Backend not running
- **Error:** "Connection error. Make sure the server is running at http://localhost:5000"
- **Fix:** 
  ```bash
  cd backend && npm start
  ```

### MongoDB connection error
- **Error:** "MongoDB connection failed"
- **Fix:**
  1. Check `.env` has correct `MONGO_URI`
  2. Verify MongoDB connection string is valid
  3. Check internet connection for cloud MongoDB

### Signup/Login failing
- **Common Issues:**
  1. User already exists → use different email
  2. Password too short (< 6 chars) → use longer password
  3. Fields empty → fill all fields
  4. Backend not updated → ensure backend code has User model

### Can't place order
- **Issue:** "Checkout failed"
- **Fixes:**
  1. Make sure you're logged in
  2. Make sure cart is not empty
  3. Check browser console for error details
  4. Ensure backend is running

### Admin orders not loading
- **Issue:** "Failed to load resource: 404"
- **Fixes:**
  1. Make sure you logged in as admin (not user)
  2. Check admin token is valid (refresh page if needed)
  3. Ensure backend has admin-protected routes

---

## 📝 Environment Files

### frontend/.env (Local Development)
```
REACT_APP_API_URL=http://localhost:5000
```

### backend/.env (Required)
```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/lussica
JWT_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

---

## 🔄 Workflow Summary

```
Signup → Login → Browse Menu → Add to Cart → Checkout → Order Placed
                                                             ↓
                                            Admin sees order in real-time
```

All features tested locally before deployment to Render!
