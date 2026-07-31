const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    required: true,
    unique: true
  },
  pr: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PurchaseRequest'
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  orderDate: {
    type: Date
  },
  expectedDelivery: {
    type: Date
  },
  deliveryDate: {
    type: Date
  },
  total: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'confirmed', 'delivered', 'cancelled'],
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

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
