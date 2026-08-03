const jwt = require('jsonwebtoken');
const config = require('../config');
const Session = require('../models/Session');

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
};

const findActiveSession = async (token) => {
  const session = await Session.findOne({ token, isActive: true });
  if (!session) return null;
  if (session.expiresAt && session.expiresAt <= new Date()) {
    session.isActive = false;
    await session.save().catch(() => {});
    return null;
  }
  session.lastActivity = new Date();
  await session.save().catch(() => {});
  return session;
};

const authenticate = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const session = await findActiveSession(token);
    if (!session) {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }
    req.user = decoded;
    req.session = session;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid or expired session' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    next();
  };
};

const optionalAuth = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const session = await findActiveSession(token);
    if (session) {
      req.user = decoded;
      req.session = session;
    }
  } catch (error) {
    // silently ignore invalid tokens
  }
  next();
};

module.exports = { authenticate, authorize, optionalAuth };
