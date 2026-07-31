const router = require('express').Router();
const BaseController = require('../controllers/BaseController');
const { authenticate, authorize } = require('../middleware/auth');
const Service = require('../models/Service');

const controller = new BaseController(Service, {
  searchFields: ['name', 'category'],
  allowedFields: ['*'],
  auditAction: 'service',
  populate: [],
  useSlug: true,
  slugField: 'name',
});

const adminOnly = [authenticate, authorize('Super Admin', 'Admin')];

router.get('/', (req, res, next) => controller.list(req, res, next));
router.get('/:id', (req, res, next) => controller.get(req, res, next));
router.post('/', ...adminOnly, (req, res, next) => controller.create(req, res, next));
router.put('/:id', ...adminOnly, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', ...adminOnly, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
