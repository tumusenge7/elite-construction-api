const mongoose = require('mongoose');

const purchaseRequestSchema = new mongoose.Schema({
  prNumber: {
    type: String,
    required: true,
    unique: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'ordered'],
    default: 'draft'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  notes: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('PurchaseRequest', purchaseRequestSchema);
