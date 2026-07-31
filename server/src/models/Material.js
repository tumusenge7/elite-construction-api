const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
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
  unit: {
    type: String
  },
  unitCost: {
    type: Number,
    default: 0
  },
  description: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
