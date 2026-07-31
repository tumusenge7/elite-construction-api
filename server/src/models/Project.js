const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  category: {
    type: String
  },
  location: {
    type: String
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  clientName: {
    type: String
  },
  year: {
    type: Number
  },
  status: {
    type: String,
    enum: ['planning', 'design', 'site_preparation', 'foundation', 'structure', 'roofing', 'mep', 'finishing', 'inspection', 'completed', 'on_hold', 'cancelled'],
    default: 'planning'
  },
  progress: {
    type: Number,
    default: 0
  },
  contractValue: {
    type: Number
  },
  budget: {
    type: Number
  },
  startDate: {
    type: Date
  },
  expectedCompletion: {
    type: Date
  },
  actualCompletion: {
    type: Date
  },
  description: {
    type: String
  },
  challenges: {
    type: String
  },
  solutions: {
    type: String
  },
  results: {
    type: String
  },
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  coverImage: {
    type: String
  },
  isHighlight: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  metaTitle: {
    type: String
  },
  metaDescription: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
