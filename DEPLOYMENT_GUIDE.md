# Lussica - Deployment & Testing Guide

## 🚀 Local Development Setup

### Backend (http://localhost:5000)
```bash
cd backend
npm install
npm start
```

**Requires:**
- MongoDB connection string in `.env`
- PORT=5000
- JWT_SECRET set

### Frontend (http://localhost:3000)
```bash
cd frontend
npm install
npm start
```

**Uses local backend by default** (frontend/.env set to `http://localhost:5000`)

---

## 📝 Test Accounts

### Admin Account
- **Username:** admin
- **Password:** admin123
- **Access:** Footer ⚙️ icon or direct `/admin` route

### Test User Account (Create via Signup)
- **Email:** test@example.com
- **Password:** password123
- Create new account via login page "Create One" button

---

## ✅ Features to Test

1. **User Signup**
   - Go to /login
   - Click "Create One"
   - Enter email, password (min 6 chars)
   - Verify account creation

2. **User Login**
   - Use created account credentials
   - Email must be correct
   - Password must be correct

3. **Menu Access**
   - Visit /menu without login ✓
   - Add items to cart without login ✓
   - Try checkout → Login prompt appears ✓

4. **Admin Panel**
   - Login via admin (username: admin, password: admin123)
   - Go to `/admin` or click footer ⚙️
   - View real-time orders (updates every 3 seconds)
   - Update order status

5. **Navbar**
   - User logged in → Shows email + Logout button
   - Admin logged in → No logout in navbar (admin panel has its own)
   - Not logged in → Shows "Sign In" button

---

## 🌍 Production Deployment (Render)

### Backend Deployment
1. Ensure all new code is committed:
   - models/User.js
   - Updated routes/auth.js
   - Updated middleware/auth.js
   - Updated server.js (with CORS)

2. On Render dashboard:
   - Redeploy backend service
   - Verify environment variables:
     - MONGO_URI
     - JWT_SECRET
     - ADMIN_USERNAME
     - ADMIN_PASSWORD

3. Test API health:
   ```
   https://lussica-res.onrender.com/api/health
   ```

### Frontend Deployment
1. Build for production:
   ```bash
   npm run build
   ```

2. Uses `frontend/.env.production` which points to deployed backend
   - `REACT_APP_API_URL=https://lussica-res.onrender.com`

3. Deploy frontend to Vercel (or preferred host)

---

## 🐛 Troubleshooting

### Orders 404 Error
- Ensure backend is redeployed
- Admin must be logged in with correct role
- Token must be sent in Authorization header

### Signup Failing
- Check backend logs for detailed error
- Ensure MongoDB is connected
- Verify User model is loaded
- Check for duplicate email errors

### Admin Logout Showing in Navbar
- ✅ FIXED: Now correctly hidden for admin users

---

## 📦 Required Backend Environment Variables

```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```
