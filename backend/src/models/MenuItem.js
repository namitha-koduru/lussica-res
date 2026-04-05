const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['breakfast', 'lunch', 'dinner', 'soups', 'snacks', 'drinks'],
    },
    active: { type: Boolean, default: true },
    rating: { type: Number, default: () => parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)) },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
