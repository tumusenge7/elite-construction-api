const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Super Admin', 'Admin', 'Project Manager', 'Engineer', 'Accountant', 'Procurement Officer', 'Site Supervisor', 'Customer']
  },
  description: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
