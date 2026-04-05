const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { adminMiddleware } = require('../middleware/auth');

// POST /api/feedback
router.post('/', async (req, res) => {
  try {
    const { itemId, itemName, message, userEmail } = req.body;
    if (!itemName || !message)
      return res.status(400).json({ message: 'Item name and message required' });

    const feedback = await Feedback.create({ itemId, itemName, message, userEmail });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/feedback — all feedbacks (admin)
router.get('/', adminMiddleware, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
