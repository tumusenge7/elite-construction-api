const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  description: {
    type: String
  },
  attachments: {
    type: mongoose.Schema.Types.Mixed
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'waiting', 'resolved', 'closed'],
    default: 'open'
  },
  closedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
