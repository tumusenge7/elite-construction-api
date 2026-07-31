const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String
  },
  message: {
    type: String,
    required: true
  },
  attachment: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
