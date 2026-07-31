const router = require('express').Router();
const BaseController = require('../controllers/BaseController');
const { authenticate, authorize } = require('../middleware/auth');
const Quote = require('../models/Quote');
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

router.get('/', authenticate, (req, res, next) => controller.list(req, res, next));
router.get('/:id', authenticate, (req, res, next) => controller.get(req, res, next));
router.post('/', authenticate, (req, res, next) => controller.create(req, res, next));
router.put('/:id', authenticate, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
