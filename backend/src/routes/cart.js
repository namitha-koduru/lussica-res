const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Cart is managed on the client side (React state/context).
// This endpoint can be used for order submission in future.
router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const { items, total } = req.body;
    console.log('📦 Checkout request from:', req.user.email, 'Items:', items.length, 'Total:', total);
    
    if (!items || items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    // Save order to database with user info
    const order = new Order({
      items,
      total,
      user: req.user.email, // Store user email
    });
    await order.save();
    console.log('✅ Order saved:', order._id);

    res.json({ message: 'Order placed successfully!', orderId: order._id, total, itemCount: items.length });
  } catch (err) {
    console.error('❌ Checkout error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user's own orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all orders for admin only
router.get('/orders', adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update order status - admin only
router.patch('/orders/:id/status', adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
