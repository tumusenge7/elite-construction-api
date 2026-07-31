const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  companyName: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  country: {
    type: String
  },
  products: {
    type: String
  },
  paymentTerms: {
    type: String
  },
  rating: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blacklisted'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
