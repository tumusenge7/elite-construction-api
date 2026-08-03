const router = require('express').Router();
const BaseController = require('../controllers/BaseController');
const { authenticate, authorize } = require('../middleware/auth');
const TeamMember = require('../models/TeamMember');
const { paginated } = require('../utils/response');

const controller = new BaseController(TeamMember, {
  searchFields: ['name', 'role', 'dept'],
  allowedFields: ['*'],
  auditAction: 'team_member',
  defaultSort: { order: 1, createdAt: -1 },
});

router.get('/', async (req, res, next) => {
  try {
    const data = await TeamMember.find({ status: 'active' }).sort({ order: 1, createdAt: -1 });
    return paginated(res, data, data.length, 1, data.length);
  } catch (err) {
    next(err);
  }
});

router.get('/all', authenticate, authorize('Super Admin', 'Admin'), (req, res, next) => {
  req.query.sort = 'order';
  req.query.order = 'asc';
  req.query.limit = 100;
  controller.list(req, res, next);
});

router.get('/:id', authenticate, (req, res, next) => controller.get(req, res, next));
router.post('/', authenticate, authorize('Super Admin', 'Admin'), (req, res, next) => controller.create(req, res, next));
router.put('/:id', authenticate, authorize('Super Admin', 'Admin'), (req, res, next) => controller.update(req, res, next));
router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), (req, res, next) => controller.delete(req, res, next));

module.exports = router;
