const router = require('express').Router();
const BaseController = require('../controllers/BaseController');
const { authenticate, authorize } = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');
const { createNotification } = require('../utils/notifications');

const controller = new BaseController(Message, {
  searchFields: [],
  allowedFields: ['*'],
  auditAction: 'message',
  onCreate: async (doc) => {
    const sender = doc.sender
      ? await User.findById(doc.sender).select('firstName lastName').lean()
      : null;
    const senderName = sender ? `${sender.firstName || ''} ${sender.lastName || ''}`.trim() : 'A user';
    await createNotification({
      user: doc.receiver,
      type: 'info',
      title: `New message from ${senderName || 'Elite'}`,
      message: doc.message?.substring(0, 140) || doc.subject || 'You have a new message.',
      data: { message_id: doc._id },
    });
  },
});

router.get('/', authenticate, (req, res, next) => controller.list(req, res, next));
router.get('/:id', authenticate, (req, res, next) => controller.get(req, res, next));
router.post('/', authenticate, (req, res, next) => controller.create(req, res, next));
router.put('/:id', authenticate, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
