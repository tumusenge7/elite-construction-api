const router = require('express').Router();
const BaseController = require('../controllers/BaseController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const Project = require('../models/Project');
const Customer = require('../models/Customer');
const { paginated } = require('../utils/response');

const controller = new BaseController(Project, {
  searchFields: ["name","location","clientName"],
  allowedFields: ['*'],
  auditAction: 'project',
  populate: ['customer', 'projectManager'],
  useSlug: true,
  slugField: 'name',
});

router.get('/', optionalAuth, async (req, res, next) => {
  try {
    if (req.user && (req.user.role === 'Customer' || !req.user.role)) {
      const customerRecord = await Customer.findOne({ user: req.user.id });
      if (!customerRecord) return paginated(res, [], 0, 1, 20, 'No projects found');
      req.query.customer = customerRecord._id.toString();
    }
    return controller.list(req, res, next);
  } catch (err) { next(err); }
});

router.get('/:id', optionalAuth, (req, res, next) => controller.get(req, res, next));
router.post('/', authenticate, (req, res, next) => controller.create(req, res, next));
router.put('/:id', authenticate, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
