const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String
  },
  icon: {
    type: String
  },
  image: {
    type: String
  },
  videoUrl: {
    type: String
  },
  description: {
    type: String
  },
  benefits: {
    type: String
  },
  process: {
    type: String
  },
  estimatedDuration: {
    type: String
  },
  startingPrice: {
    type: Number
  },
  faq: {
    type: mongoose.Schema.Types.Mixed
  },
  metaTitle: {
    type: String
  },
  metaDescription: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
