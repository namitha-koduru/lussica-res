const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

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

// POST /api/auth/user-signup
router.post('/user-signup', async (req, res) => {
  try {
    const { email, username, password, confirmPassword } = req.body;
    
    if (!email || !username || !password || !confirmPassword)
      return res.status(400).json({ message: 'All fields are required' });
    
    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match' });
    
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already registered' });

    // Create new user
    const user = new User({ email, username, password });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { email, username, role: 'user' },
      process.env.JWT_SECRET || 'luccica_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, user: { email, username, role: 'user' } });
  } catch (err) {
    console.error('Signup error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// POST /api/auth/user-login
router.post('/user-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      return res.status(401).json({ message: 'Invalid email or password' });

    // Generate token
    const token = jwt.sign(
      { email, username: user.username, role: 'user' },
      process.env.JWT_SECRET || 'luccica_secret',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { email, username: user.username, role: 'user' } });
  } catch (err) {
    console.error('Login error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Need to import auth middleware
const { authMiddleware } = require('../middleware/auth');

// GET /api/auth/profile - Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user)
      return res.status(404).json({ message: 'User not found' });
    
    res.json({ email: user.email, username: user.username });
  } catch (err) {
    console.error('Profile error:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// POST /api/auth/change-password - Change user password
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    if (!currentPassword || !newPassword || !confirmPassword)
      return res.status(400).json({ message: 'All fields are required' });
    
    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: 'New passwords do not match' });
    
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    // Find user
    const user = await User.findOne({ email: req.user.email });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid)
      return res.status(401).json({ message: 'Current password is incorrect' });

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Password change error:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

module.exports = router;
