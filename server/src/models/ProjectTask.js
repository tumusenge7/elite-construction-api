const mongoose = require('mongoose');

const projectTaskSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  taskName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'review', 'completed', 'blocked'],
    default: 'todo'
  },
  progress: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('ProjectTask', projectTaskSchema);
