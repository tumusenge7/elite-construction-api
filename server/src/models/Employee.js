const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  employeeCode: {
    type: String,
    unique: true
  },
  position: {
    type: String
  },
  department: {
    type: String
  },
  hireDate: {
    type: Date
  },
  salary: {
    type: Number
  },
  skills: {
    type: String
  },
  emergencyContact: {
    type: String
  },
  emergencyPhone: {
    type: String
  },
  address: {
    type: String
  },
  idType: {
    type: String
  },
  idNumber: {
    type: String
  },
  contractType: {
    type: String,
    enum: ['permanent', 'contract', 'intern', 'temporary'],
    default: 'permanent'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'terminated'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
