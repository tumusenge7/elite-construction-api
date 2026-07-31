const mongoose = require('mongoose');

const siteInspectionSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  inspectionDate: {
    type: Date
  },
  inspector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  weather: {
    type: String
  },
  workCompleted: {
    type: String
  },
  issuesFound: {
    type: String
  },
  safetyObservations: {
    type: String
  },
  recommendations: {
    type: String
  },
  photos: {
    type: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['draft', 'completed', 'reviewed'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('SiteInspection', siteInspectionSchema);
