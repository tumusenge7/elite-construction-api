const mongoose = require('mongoose');

const projectStageSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'delayed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('ProjectStage', projectStageSchema);
