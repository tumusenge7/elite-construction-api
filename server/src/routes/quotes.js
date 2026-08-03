const router = require('express').Router();
const BaseController = require('../controllers/BaseController');
const { authenticate, authorize } = require('../middleware/auth');
const Quote = require('../models/Quote');
const Customer = require('../models/Customer');
const { paginated } = require('../utils/response');
const { notifyAdmins } = require('../utils/notifications');

const controller = new BaseController(Quote, {
  searchFields: ["quoteNumber"],
  allowedFields: ['*'],
  auditAction: 'quote',
  populate: ['customer', 'project'],
  onCreate: async (doc) => {
    await notifyAdmins({
      type: 'info',
      title: 'New quote created',
      message: `Quote ${doc.quoteNumber || ''}${doc.clientName ? ` for ${doc.clientName}` : ''} has been created.`,
      data: { quote_id: doc._id },
    });
  },
});

router.get('/', authenticate, async (req, res, next) => {
  try {
    if (req.user.role === 'Customer' || !req.user.role) {
      const customerRecord = await Customer.findOne({ user: req.user.id });
      if (!customerRecord) return paginated(res, [], 0, 1, 20, 'No quotes found');
      req.query.customer = customerRecord._id.toString();
    }
    return controller.list(req, res, next);
  } catch (err) { next(err); }
});

router.get('/:id', authenticate, (req, res, next) => controller.get(req, res, next));
router.post('/', authenticate, (req, res, next) => controller.create(req, res, next));
router.put('/:id', authenticate, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
