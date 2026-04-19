const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { adminMiddleware } = require('../middleware/auth');

const SEED_ITEMS = exports.SEED_ITEMS = [
  { name: 'Idli & Sambar',        price: 50,  category: 'breakfast' },
  { name: 'Plain Dosa',            price: 60,  category: 'breakfast' },
  { name: 'Masala Dosa',           price: 80,  category: 'breakfast' },
  { name: 'Upma',                  price: 45,  category: 'breakfast' },
  { name: 'Pongal',                price: 55,  category: 'breakfast' },
  { name: 'Veg Biryani',           price: 160, category: 'lunch' },
  { name: 'Chicken Biryani',       price: 220, category: 'lunch' },
  { name: 'Mutton Biryani',        price: 280, category: 'lunch' },
  { name: 'Meals (Veg)',           price: 120, category: 'lunch' },
  { name: 'Meals (Non-Veg)',       price: 160, category: 'lunch' },
  { name: 'Butter Chicken',        price: 240, category: 'dinner' },
  { name: 'Paneer Butter Masala',  price: 200, category: 'dinner' },
  { name: 'Fish Curry',            price: 260, category: 'dinner' },
  { name: 'Dal Tadka',             price: 140, category: 'dinner' },
  { name: 'Tomato Soup',           price: 90,  category: 'soups' },
  { name: 'Sweet Corn Soup',       price: 100, category: 'soups' },
  { name: 'Manchow Soup',          price: 110, category: 'soups' },
  { name: 'Samosa (2 pcs)',        price: 40,  category: 'snacks' },
  { name: 'French Fries',          price: 80,  category: 'snacks' },
  { name: 'Veg Spring Roll',       price: 90,  category: 'snacks' },
  { name: 'Chicken 65',            price: 140, category: 'snacks' },
  { name: 'Cold Coffee',           price: 90,  category: 'drinks' },
  { name: 'Mango Lassi',           price: 80,  category: 'drinks' },
  { name: 'Fresh Lime Soda',       price: 60,  category: 'drinks' },
  { name: 'Masala Chai',           price: 30,  category: 'drinks' },
];

// Seed DB if empty
async function seedIfEmpty() {
  const count = await MenuItem.countDocuments();
  if (count === 0) {
    await MenuItem.insertMany(SEED_ITEMS);
    console.log('🌱 Menu seeded with default items');
  }
}
// seedIfEmpty(); // Removed to prevent premature DB operations

// GET /api/menu — all active items (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category, active: true } : { active: true };
    const items = await MenuItem.find(filter).sort({ createdAt: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/menu/all — all items for admin
router.get('/all', adminMiddleware, async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const items = await MenuItem.find(filter).sort({ category: 1, createdAt: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/menu — add new item (admin)
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { name, price, category } = req.body;
    if (!name || !price || !category)
      return res.status(400).json({ message: 'Name, price and category are required' });

    const item = await MenuItem.create({ name, price, category });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH /api/menu/:id/toggle — toggle active (admin)
router.patch('/:id/toggle', adminMiddleware, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.active = !item.active;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/menu/:id (admin)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
module.exports.SEED_ITEMS = SEED_ITEMS;
