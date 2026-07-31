const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  minStock: {
    type: Number,
    default: 0
  },
  location: {
    type: String
  },
  batchNumber: {
    type: String
  },
  expiryDate: {
    type: Date
  },
  unitCost: {
    type: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
