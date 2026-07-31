const mongoose = require('mongoose');

const ticketReplySchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportTicket',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  attachments: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

module.exports = mongoose.model('TicketReply', ticketReplySchema);
