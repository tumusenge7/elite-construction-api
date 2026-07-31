const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  settingKey: {
    type: String,
    required: true,
    unique: true
  },
  settingValue: {
    type: mongoose.Schema.Types.Mixed
  },
  group: {
    type: String
  },
  type: {
    type: String,
    enum: ['text', 'number', 'boolean', 'json', 'image'],
    default: 'text'
  }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
