const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        category: { type: String, required: true },
      },
    ],
    total: { type: Number, required: true, min: 0 },
    user: { type: String, required: true }, // Store user email
    status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'ready', 'taken', 'cancelled'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);