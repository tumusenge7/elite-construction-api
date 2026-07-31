const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    sparse: true
  },
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
  quote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quote'
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract'
  },
  title: {
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
  total: {
    type: Number,
    default: 0
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'RWF'
  },
  dueDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'partially_paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  notes: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
