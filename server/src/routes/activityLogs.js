const router = require('express').Router();
const UserActivity = require('../models/UserActivity');
const AuditLog = require('../models/AuditLog');
const { authenticate, authorize } = require('../middleware/auth');

const adminOnly = [authenticate, authorize('Super Admin', 'Admin')];

// ── POST /api/activity-logs  (frontend page_view / click events) ──────────────
router.post('/', async (req, res) => {
  try {
    const { eventType, path, meta, userAgent } = req.body;
    if (!eventType || !path) return res.status(400).json({ success: false, message: 'eventType and path required' });

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;

    let userId = null, userEmail = null, userRole = null;
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const d = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
        userId = d.id || null; userEmail = d.email || null; userRole = d.role || null;
      } catch {}
    }

    await UserActivity.create({ userId, userEmail, userRole, eventType, path, ipAddress: ip, userAgent: userAgent || req.headers['user-agent'], meta });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/activity-logs  (paginated list + stats) ─────────────────────────
router.get('/', ...adminOnly, async (req, res) => {
  try {
    const { userId, userEmail, eventType, path, method, statusCode, dateFrom, dateTo, page = 1, limit = 25 } = req.query;

    const filter = {};
    if (userId) filter.userId = userId;
    if (userEmail) filter.userEmail = { $regex: userEmail, $options: 'i' };
    if (eventType) filter.eventType = eventType;
    if (method) filter.method = method.toUpperCase();
    if (statusCode) filter.statusCode = Number(statusCode);
    if (path) filter.path = { $regex: path, $options: 'i' };
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo); end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      UserActivity.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      UserActivity.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data,
      pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/activity-logs/stats  (dashboard metrics + charts) ───────────────
router.get('/stats', ...adminOnly, async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const last7 = new Date(today); last7.setDate(last7.getDate() - 6);
    const last24h = new Date(now - 24 * 60 * 60 * 1000);

    const [
      totalRequests,
      requestsToday,
      requestsYesterday,
      uniqueUsersToday,
      uniqueUsersYesterday,
      errorCount,
      errorCountYesterday,
      eventBreakdown,
      hourlyChart,
      dailyChart,
      topEndpoints,
      topUsers,
      recentLogins,
      methodBreakdown,
    ] = await Promise.all([
      // totals
      UserActivity.countDocuments({}),
      UserActivity.countDocuments({ createdAt: { $gte: today } }),
      UserActivity.countDocuments({ createdAt: { $gte: yesterday, $lt: today } }),

      // unique users
      UserActivity.distinct('userId', { createdAt: { $gte: today }, userId: { $ne: null } }).then(r => r.length),
      UserActivity.distinct('userId', { createdAt: { $gte: yesterday, $lt: today }, userId: { $ne: null } }).then(r => r.length),

      // errors (4xx + 5xx)
      UserActivity.countDocuments({ statusCode: { $gte: 400 }, createdAt: { $gte: today } }),
      UserActivity.countDocuments({ statusCode: { $gte: 400 }, createdAt: { $gte: yesterday, $lt: today } }),

      // event type breakdown
      UserActivity.aggregate([
        { $group: { _id: '$eventType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // requests per hour (last 24h)
      UserActivity.aggregate([
        { $match: { createdAt: { $gte: last24h } } },
        { $group: { _id: { $hour: '$createdAt' }, count: { $sum: 1 } } },
        { $sort: { '_id': 1 } },
      ]),

      // requests per day (last 7 days)
      UserActivity.aggregate([
        { $match: { createdAt: { $gte: last7 } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
            errors: { $sum: { $cond: [{ $gte: ['$statusCode', 400] }, 1, 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // top 8 endpoints
      UserActivity.aggregate([
        { $match: { eventType: 'api_request' } },
        { $group: { _id: { path: '$path', method: '$method' }, count: { $sum: 1 }, avgDuration: { $avg: '$duration' } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),

      // top 6 active users
      UserActivity.aggregate([
        { $match: { userId: { $ne: null } } },
        { $group: { _id: '$userId', email: { $first: '$userEmail' }, role: { $first: '$userRole' }, count: { $sum: 1 }, lastSeen: { $max: '$createdAt' } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),

      // recent logins (last 20)
      UserActivity.find({ eventType: 'login' }).sort({ createdAt: -1 }).limit(20).lean(),

      // HTTP method breakdown
      UserActivity.aggregate([
        { $match: { method: { $ne: null } } },
        { $group: { _id: '$method', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    // Fill hourly chart gaps (0–23)
    const hourMap = Object.fromEntries(hourlyChart.map(h => [h._id, h.count]));
    const hourlyFilled = Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, '0')}:00`,
      count: hourMap[i] || 0,
    }));

    // Fill daily chart gaps
    const dayMap = Object.fromEntries(dailyChart.map(d => [d._id, { count: d.count, errors: d.errors }]));
    const dailyFilled = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(last7); d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      return { date: key, label: d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }), count: dayMap[key]?.count || 0, errors: dayMap[key]?.errors || 0 };
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalRequests,
          requestsToday,
          requestsYesterday,
          uniqueUsersToday,
          uniqueUsersYesterday,
          errorCount,
          errorCountYesterday,
          errorRate: requestsToday > 0 ? ((errorCount / requestsToday) * 100).toFixed(1) : '0.0',
        },
        charts: { hourly: hourlyFilled, daily: dailyFilled },
        eventBreakdown,
        methodBreakdown,
        topEndpoints,
        topUsers,
        recentLogins,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/activity-logs/audit  (audit trail — CRUD actions) ───────────────
router.get('/audit', ...adminOnly, async (req, res) => {
  try {
    const { action, entity, userEmail, dateFrom, dateTo, page = 1, limit = 25 } = req.query;

    const filter = {};
    if (action) filter.action = { $regex: action, $options: 'i' };
    if (entity) filter.entity = entity;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) { const e = new Date(dateTo); e.setHours(23, 59, 59, 999); filter.createdAt.$lte = e; }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('user', 'firstName lastName email').lean(),
      AuditLog.countDocuments(filter),
    ]);

    // If userEmail filter — post-filter after populate
    const filtered = userEmail
      ? data.filter(d => d.user?.email?.toLowerCase().includes(userEmail.toLowerCase()))
      : data;

    res.json({
      success: true,
      data: filtered,
      pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
