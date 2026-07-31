const mongoose = require('mongoose');

const projectDocumentSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['contract', 'drawing', 'boq', 'quotation', 'invoice', 'receipt', 'report', 'certificate', 'warranty', 'other'],
    default: 'other'
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number
  },
  mimeType: {
    type: String
  },
  isCustomerVisible: {
    type: Boolean,
    default: true
  },
  version: {
    type: Number,
    default: 1
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('ProjectDocument', projectDocumentSchema);
