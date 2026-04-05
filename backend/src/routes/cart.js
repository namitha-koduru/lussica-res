const express = require('express');
const router = express.Router();

// Cart is managed on the client side (React state/context).
// This endpoint can be used for order submission in future.
router.post('/checkout', async (req, res) => {
  try {
    const { items, total } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    // In a real app: save order to DB, trigger payment, etc.
    res.json({ message: 'Order placed successfully!', total, itemCount: items.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
