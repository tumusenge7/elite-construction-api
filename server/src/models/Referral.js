const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrerCustomer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  referredCustomer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  referralCode: { type: String, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  rewardAmount: Number,
  status: { type: String, enum: ['pending', 'completed', 'expired'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);
