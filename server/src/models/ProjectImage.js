const mongoose = require('mongoose');

const projectImageSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  image: {
    type: String,
    required: true
  },
  isBefore: {
    type: Boolean,
    default: false
  },
  isAfter: {
    type: Boolean,
    default: false
  },
  stage: {
    type: String
  },
  caption: {
    type: String
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('ProjectImage', projectImageSchema);
