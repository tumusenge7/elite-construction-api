const mongoose = require('mongoose');

const purchaseOrderItemSchema = new mongoose.Schema({
  po: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PurchaseOrder',
    required: true
  },
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material'
  },
  description: {
    type: String
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
  deliveredQuantity: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('PurchaseOrderItem', purchaseOrderItemSchema);
