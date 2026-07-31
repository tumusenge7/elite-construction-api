const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
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
  category: {
    type: String
  },
  location: {
    type: String
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  photo: {
    type: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  dueDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'in_progress', 'resolved', 'verified', 'closed'],
    default: 'open'
  },
  resolvedAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);
