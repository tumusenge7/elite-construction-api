const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true
  },
  description: {
    type: String,
    required: true
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

module.exports = mongoose.model('InvoiceItem', invoiceItemSchema);
