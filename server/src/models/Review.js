const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  ratingCommunication: { type: Number, default: 0 },
  ratingQuality: { type: Number, default: 0 },
  ratingTimeliness: { type: Number, default: 0 },
  overallRating: { type: Number, default: 0 },
  comment: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
