const mongoose = require('mongoose');

const equipmentMaintenanceSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  type: {
    type: String,
    enum: ['service', 'inspection', 'repair', 'other'],
    default: 'service'
  },
  description: {
    type: String
  },
  maintenanceDate: {
    type: Date
  },
  nextMaintenance: {
    type: Date
  },
  cost: {
    type: Number
  },
  performedBy: {
    type: String
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'overdue'],
    default: 'scheduled'
  }
}, { timestamps: true });

module.exports = mongoose.model('EquipmentMaintenance', equipmentMaintenanceSchema);
