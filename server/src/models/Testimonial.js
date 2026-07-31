const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  customerName: String,
  customerTitle: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  comment: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
