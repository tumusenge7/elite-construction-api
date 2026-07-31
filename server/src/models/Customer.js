const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  companyName: {
    type: String
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  district: {
    type: String
  },
  province: {
    type: String
  },
  country: {
    type: String,
    default: 'Rwanda'
  },
  postalCode: {
    type: String
  },
  idType: {
    type: String
  },
  idNumber: {
    type: String
  },
  taxId: {
    type: String
  },
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'lead'],
    default: 'lead'
  },
  phone: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
