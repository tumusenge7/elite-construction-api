const mongoose = require('mongoose');

const quoteItemSchema = new mongoose.Schema({
  quote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quote',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['material', 'labor', 'equipment', 'service', 'other'],
    default: 'other'
  },
  quantity: {
    type: Number,
    default: 1
  },
  unit: {
    type: String
  },
  unitPrice: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('QuoteItem', quoteItemSchema);
