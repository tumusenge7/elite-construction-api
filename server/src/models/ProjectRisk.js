const mongoose = require('mongoose');

const projectRiskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: String,
  probability: { type: String, enum: ['very_low', 'low', 'medium', 'high', 'very_high'], default: 'medium' },
  impact: { type: String, enum: ['very_low', 'low', 'medium', 'high', 'very_high'], default: 'medium' },
  mitigation: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  dueDate: Date,
  status: { type: String, enum: ['open', 'mitigated', 'closed'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('ProjectRisk', projectRiskSchema);
