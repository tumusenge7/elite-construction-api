const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  serialNumber: {
    type: String,
    unique: true
  },
  model: {
    type: String
  },
  manufacturer: {
    type: String
  },
  purchaseDate: {
    type: Date
  },
  purchaseCost: {
    type: Number
  },
  currentValue: {
    type: Number
  },
  status: {
    type: String,
    enum: ['available', 'in_use', 'maintenance', 'unavailable', 'retired'],
    default: 'available'
  },
  location: {
    type: String
  },
  assignedProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  notes: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
