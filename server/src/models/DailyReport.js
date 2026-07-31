const mongoose = require('mongoose');

const dailyReportSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  reportDate: {
    type: Date,
    required: true
  },
  workersPresent: {
    type: Number,
    default: 0
  },
  weather: {
    type: String
  },
  workCompleted: {
    type: String
  },
  materialsUsed: {
    type: String
  },
  equipmentUsed: {
    type: String
  },
  problems: {
    type: String
  },
  safetyIncidents: {
    type: String
  },
  photos: {
    type: mongoose.Schema.Types.Mixed
  },
  notes: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('DailyReport', dailyReportSchema);
