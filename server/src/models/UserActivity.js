const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  userEmail: { type: String, default: null },
  userRole: { type: String, default: null },
  eventType: {
    type: String,
    enum: ['page_view', 'api_request', 'click', 'login', 'logout', 'error'],
    required: true,
  },
  path: { type: String, required: true },
  method: { type: String, default: null },
  statusCode: { type: Number, default: null },
  ipAddress: { type: String, default: null },
  userAgent: { type: String, default: null },
  meta: { type: mongoose.Schema.Types.Mixed, default: null },
  duration: { type: Number, default: null },
}, { timestamps: true });

userActivitySchema.index({ userId: 1 });
userActivitySchema.index({ eventType: 1 });
userActivitySchema.index({ createdAt: -1 });
userActivitySchema.index({ path: 1 });

module.exports = mongoose.model('UserActivity', userActivitySchema);
