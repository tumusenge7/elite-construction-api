const AuditLog = require('../models/AuditLog');

const logAudit = async (userId, action, entity, entityId, description, req = null) => {
  try {
    await AuditLog.create({
      user: userId || null,
      action,
      entity,
      entityId: entityId ? String(entityId) : null,
      description: description || '',
      ipAddress: req ? req.ip || req.connection?.remoteAddress : null,
      userAgent: req ? req.headers['user-agent'] : null,
    });
  } catch (error) {
    console.error('Audit log error:', error.message);
  }
};

module.exports = { logAudit };
