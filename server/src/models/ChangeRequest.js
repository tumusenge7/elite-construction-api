const mongoose = require('mongoose');

const changeRequestSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  title: { type: String, required: true },
  description: String,
  reason: String,
  costImpact: Number,
  timeImpact: Number,
  status: { type: String, enum: ['pending', 'reviewed', 'approved', 'rejected', 'implemented'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('ChangeRequest', changeRequestSchema);
