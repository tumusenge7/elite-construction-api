const mongoose = require('mongoose');

const safetyIncidentSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  incidentDate: {
    type: Date
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  type: {
    type: String
  },
  location: {
    type: String
  },
  correctiveAction: {
    type: String
  },
  responsiblePerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  photos: {
    type: mongoose.Schema.Types.Mixed
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('SafetyIncident', safetyIncidentSchema);
