const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    itemName: { type: String, required: true },
    message: { type: String, required: true, trim: true },
    userEmail: { type: String, default: 'Anonymous' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
