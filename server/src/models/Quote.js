const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  quoteNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  title: { type: String },
  clientName: { type: String },
  projectName: { type: String },
  totalAmount: { type: Number, default: 0 },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  projectType: {
    type: String
  },
  description: {
    type: String
  },
  subtotal: {
    type: Number,
    default: 0
  },
  taxPercentage: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  discountPercentage: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  contingencyPercentage: {
    type: Number,
    default: 0
  },
  contingencyAmount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'RWF'
  },
  validityDate: {
    type: Date
  },
  terms: {
    type: String
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'revised'],
    default: 'draft'
  },
  version: {
    type: Number,
    default: 1
  },
  acceptedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Quote', quoteSchema);
