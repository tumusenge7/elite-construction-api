const mongoose = require('mongoose');

const serviceImageSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  image: {
    type: String,
    required: true
  },
  caption: {
    type: String
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('ServiceImage', serviceImageSchema);
