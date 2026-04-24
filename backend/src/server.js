
// ================== IMPORTS ==================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
// ================== APP INIT ==================
const app = express();

// ================== CORS CONFIG ==================
const allowedOrigins = [
  "http://localhost:3000",
  "https://lussicares.vercel.app",
  "https://lussica-res.onrender.com"
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
let dbConnected = false;

app.get('/api/health', (req, res) => {
  res.json({
    status: dbConnected ? 'OK' : 'DEGRADED',
    message: dbConnected ? '🚀 Lussica API running' : '🔄 API initializing...',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'connecting'
  });
});

// ================== SERVER STARTUP ==================
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ================== DB CONNECTION ==================
console.log("MONGO_URI =", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    dbConnected = true;

    // 👉 CALL SEED HERE
    const MenuItem = require('./models/MenuItem');

    const count = await MenuItem.countDocuments();
    if (count === 0) {
      await MenuItem.insertMany(require('./routes/menu').SEED_ITEMS || []);
      console.log('🌱 Seeded menu');
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    dbConnected = false;
    // Don't exit - allow health check to work for monitoring
  });

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});

