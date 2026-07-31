const mongoose = require('mongoose');

const projectUpdateSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  stage: {
    type: String
  },
  progress: {
    type: Number
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isCustomerNotified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('ProjectUpdate', projectUpdateSchema);
