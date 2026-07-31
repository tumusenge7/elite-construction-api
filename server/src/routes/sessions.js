const router = require('express').Router();
const Session = require('../models/Session');
const { authenticate } = require('../middleware/auth');
const { success, paginated, error } = require('../utils/response');

router.get('/', authenticate, async (req, res, next) => {
  try {
    let { page = 1, limit = 20, all } = req.query;
    page = parseInt(page);
    limit = Math.min(parseInt(limit) || 20, 100);

    const query = all === 'true' ? {} : { user: req.user.id, isActive: true };
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Session.find(query).populate('user', 'email firstName lastName').sort({ lastActivity: -1 }).skip(skip).limit(limit),
      Session.countDocuments(query),
    ]);

    return paginated(res, data, total, page, limit);
  } catch (err) {
    next(err);
  }
});

router.get('/mine', authenticate, async (req, res, next) => {
  try {
    const sessions = await Session.find({ user: req.user.id, isActive: true }).sort({ lastActivity: -1 }).limit(10);
    return success(res, sessions);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await Session.findByIdAndUpdate(req.params.id, { isActive: false });
    return success(res, null, 'Session terminated');
  } catch (err) {
    next(err);
  }
});

router.delete('/', authenticate, async (req, res, next) => {
  try {
    await Session.updateMany({ user: req.user.id, _id: { $ne: req.query.exclude } }, { isActive: false });
    return success(res, null, 'Other sessions terminated');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
