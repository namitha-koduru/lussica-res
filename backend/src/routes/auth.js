const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Hardcoded admin for simplicity (extend with User model for real users)
const ADMIN_USER = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  role: 'admin',
};

// POST /api/auth/admin-login
router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password required' });

    if (username !== ADMIN_USER.username || password !== ADMIN_USER.password)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET || 'luccica_secret',
      { expiresIn: '8h' }
    );

    res.json({ token, user: { username, role: 'admin' } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/auth/user-login
router.post('/user-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    // Demo: accept any credentials for user login (extend with User model)
    const token = jwt.sign(
      { email, role: 'user' },
      process.env.JWT_SECRET || 'luccica_secret',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { email, role: 'user' } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
