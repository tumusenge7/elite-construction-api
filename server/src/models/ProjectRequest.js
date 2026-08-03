const mongoose = require('mongoose');

const projectRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  title: { type: String, required: true },
  serviceType: { type: String, required: true },
  projectType: { type: String },
  location: { type: String, required: true },
  budget: { type: String },
  timeline: { type: String },
  description: { type: String, required: true },
  attachments: [{ type: String }],
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'approved', 'rejected', 'converted'],
    default: 'pending',
  },
  adminNotes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ProjectRequest', projectRequestSchema);
