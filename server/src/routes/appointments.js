const router = require('express').Router();
const BaseController = require('../controllers/BaseController');
const { authenticate, authorize } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const { notifyAdmins } = require('../utils/notifications');

const controller = new BaseController(Appointment, {
  searchFields: ["title"],
  allowedFields: ['*'],
  auditAction: 'appointment',
  onCreate: async (doc) => {
    await notifyAdmins({
      type: 'info',
      title: 'New appointment requested',
      message: `A ${(doc.type || 'site_visit').replace(/_/g, ' ')} appointment was requested${doc.preferredDate ? ` for ${new Date(doc.preferredDate).toLocaleDateString()}` : ''}.`,
      data: { appointment_id: doc._id },
    });
  },
});

router.get('/', authenticate, (req, res, next) => controller.list(req, res, next));
router.get('/:id', authenticate, (req, res, next) => controller.get(req, res, next));
router.post('/', authenticate, (req, res, next) => controller.create(req, res, next));
router.put('/:id', authenticate, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
