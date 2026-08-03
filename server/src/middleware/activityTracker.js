const jwt = require('jsonwebtoken');
const config = require('../config');
const UserActivity = require('../models/UserActivity');

const SKIP_PATHS = ['/api/health', '/api/activity-logs'];

function resolveEventType(method, path, statusCode) {
  if (path.includes('/auth/login') && method === 'POST') return statusCode < 400 ? 'login' : 'api_request';
  if (path.includes('/auth/logout') && method === 'POST') return 'logout';
  if (statusCode >= 400) return 'error';
  return 'api_request';
}

module.exports = function activityTracker(req, res, next) {
  if (SKIP_PATHS.some(p => req.path.startsWith(p))) return next();

  const start = Date.now();
  let userId = null, userEmail = null, userRole = null;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.slice(7), config.jwt.secret);
      userId = decoded.id || null;
      userEmail = decoded.email || null;
      userRole = decoded.role || null;
    } catch {}
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const eventType = resolveEventType(req.method, req.originalUrl, res.statusCode);

    // For login — try to extract user info from response body isn't possible,
    // but the JWT in the request (if re-login) or the body email can be used
    const logEmail = userEmail || (req.body?.email) || null;

    UserActivity.create({
      userId,
      userEmail: logEmail,
      userRole,
      eventType,
      path: req.originalUrl,
      method: req.method,
      statusCode: res.statusCode,
      ipAddress: ip,
      userAgent: req.headers['user-agent'] || null,
      duration,
    }).catch(() => {});
  });

  next();
};
