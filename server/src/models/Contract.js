const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  contractNumber: {
    type: String,
    required: true,
    unique: true
  },
  quote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quote'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  contractValue: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'RWF'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  terms: {
    type: String
  },
  specialConditions: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'accepted', 'active', 'completed', 'terminated', 'cancelled'],
    default: 'draft'
  },
  version: {
    type: Number,
    default: 1
  },
  acceptedAt: {
    type: Date
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Contract', contractSchema);
