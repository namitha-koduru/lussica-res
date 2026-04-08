
// ================== IMPORTS ==================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ================== APP INIT ==================
const app = express();

// ================== CORS CONFIG ==================
const allowedOrigins = [
  "http://localhost:3000",
  "https://lussicares.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman/mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("❌ CORS not allowed: " + origin));
    }
  },
  credentials: true
}));

// ================== MIDDLEWARE ==================
app.use(express.json());

// ================== ROUTES ==================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/contact', require('./routes/contact'));

// ================== HEALTH CHECK ==================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: '🚀 Luccica API running'
  });
});

// ================== DB CONNECTION ==================
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

