# 🍽️ Luccica — Full Stack Restaurant Platform

Luccica is a **full-stack restaurant management and ordering platform** built using the MERN stack (MongoDB, Express.js, React.js, Node.js).  
It allows users to explore menus and place orders, while admins can manage restaurant operations through a secure dashboard.

---

## 🚀 Features

### 👤 User Features
- Browse menu with categories 🍔  
- Add items to cart 🛒  
- Place orders  
- Submit feedback & contact forms  
- JWT-based authentication  

---

### 🔐 Admin Features
- Secure admin login  
- Add / update / delete menu items  
- Enable / disable items  
- View customer feedback  
- Manage restaurant content  

---

## 🛠️ Tech Stack

- **Frontend:** React.js, CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Atlas / Local)  
- **Authentication:** JSON Web Tokens (JWT)  
- **Other:** REST APIs, Axios  

---

## 📁 Project Structure

```
luccica/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/assets/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── api.js
│   │   └── App.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 Prerequisites
- Node.js (v18+ recommended)  
- MongoDB (Local or Atlas)  

---

### 🔹 1. Clone Repository

```
git clone https://github.com/namitha-koduru/lussica-res.git
cd lussica
```

---

### 🔹 2. Backend Setup

```
cd backend
npm install
cp .env.example .env
```

Update `.env`:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

Run backend:

```
npm run dev
```

---

### 🔹 3. Frontend Setup

```
cd frontend
npm install
npm start
```

---

## 🌐 Application URLs (Development)

- Home → https://lussicares.vercel.app/ 
- Menu → https://lussicares.vercel.app/menu
- User Login → https://lussicares.vercel.app/login  
- Admin Login → https://lussicares.vercel.app/login  
- Admin Panel → https://lussicares.vercel.app/admin  

---

## 🔌 API Endpoints

### Authentication
- POST `/api/auth/admin-login`  
- POST `/api/auth/user-login`  

### Menu
- GET `/api/menu`  
- GET `/api/menu/all` (Admin)  
- POST `/api/menu` (Admin)  
- PATCH `/api/menu/:id/toggle` (Admin)  
- DELETE `/api/menu/:id` (Admin)  

### Other
- POST `/api/feedback`  
- GET `/api/feedback` (Admin)  
- POST `/api/contact`  
- POST `/api/cart/checkout`  

---

## 🔐 Default Admin Credentials

- Username: `admin`  
- Password: `admin123`  

> ⚠️ Change credentials before deploying

---

## ⚠️ Important Notes

- Do not commit `node_modules`  
- Always run `npm install` after cloning  
- Keep `.env` file private  
- Ensure MongoDB is running  
- `localhost` URLs are for development only  

---

## 🚀 Future Improvements

- Payment gateway integration  
- Order tracking system  
- Notifications (Email/SMS)  
- Analytics dashboard  
- Deployment (Vercel + Render)  

---

## 👩‍💻 Author

**Namitha Koduru**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
