const mongoose = require('mongoose');

const estimatorConfigSchema = new mongoose.Schema({
  keyName: { type: String, required: true, unique: true },
  keyValue: { type: String, required: true },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('EstimatorConfig', estimatorConfigSchema);
