const router = require('express').Router();
const BaseController = require('../controllers/BaseController');
const { authenticate, authorize } = require('../middleware/auth');
const Notification = require('../models/Notification');
const { success, paginated, error } = require('../utils/response');

const controller = new BaseController(Notification, {
  searchFields: [],
  auditAction: 'notification',
});

router.get('/', authenticate, (req, res, next) => controller.list(req, res, next));

router.get('/mine', authenticate, async (req, res, next) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    page = parseInt(page);
    limit = Math.min(parseInt(limit) || 20, 100);
    const skip = (page - 1) * limit;
    const query = { user: req.user.id };
    const [data, total] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(query),
    ]);
    return paginated(res, data, total, page, limit);
  } catch (err) {
    next(err);
  }
});

router.get('/unread-count', authenticate, async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ user: req.user.id, isRead: false });
    return success(res, { count });
  } catch (err) {
    next(err);
  }
});

router.put('/read-all', authenticate, async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true, readAt: new Date() });
    return success(res, null, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
});

router.put('/:id/read', authenticate, async (req, res, next) => {
  try {
    const notif = await Notification.findByIdAndUpdate(req.params.id, { isRead: true, readAt: new Date() }, { new: true });
    if (!notif) return error(res, 'Notification not found', 404);
    return success(res, notif, 'Marked as read');
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, (req, res, next) => controller.get(req, res, next));
router.put('/:id', authenticate, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
