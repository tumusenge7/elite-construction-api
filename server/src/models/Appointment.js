const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['site_visit', 'meeting', 'inspection', 'consultation', 'other'],
    default: 'site_visit'
  },
  location: {
    type: String
  },
  description: {
    type: String
  },
  preferredDate: {
    type: Date
  },
  preferredTime: {
    type: String
  },
  confirmedDate: {
    type: Date
  },
  confirmedTime: {
    type: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rescheduled', 'completed', 'cancelled'],
    default: 'pending'
  },
  cancellationReason: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
