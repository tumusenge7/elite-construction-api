const router = require('express').Router();
const BaseController = require('../controllers/BaseController');
const { authenticate, authorize } = require('../middleware/auth');
const Project = require('../models/Project');

const controller = new BaseController(Project, {
  searchFields: ["name","location","clientName"],
  allowedFields: ['*'],
  auditAction: 'project',
  populate: ['customer', 'projectManager'],
  useSlug: true,
  slugField: 'name',
});

router.get('/', (req, res, next) => controller.list(req, res, next));
router.get('/:id', (req, res, next) => controller.get(req, res, next));
router.post('/', authenticate, (req, res, next) => controller.create(req, res, next));
router.put('/:id', authenticate, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
