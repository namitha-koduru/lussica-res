import cors from "cors";
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
// Middleware
app.use(cors({
  origin: "https://lussicares.vercel.app/",
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/contact', require('./routes/contact'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Luccica API running' }));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/luccica')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
