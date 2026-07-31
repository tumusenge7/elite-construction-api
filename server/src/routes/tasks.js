const router = require('express').Router();
const BaseController = require('../controllers/BaseController');
const { authenticate, authorize } = require('../middleware/auth');
const ProjectTask = require('../models/ProjectTask');

const controller = new BaseController(ProjectTask, {
  searchFields: ["taskName"],
  allowedFields: ['*'],
  auditAction: 'task',
  
  
});

router.get('/', authenticate, (req, res, next) => controller.list(req, res, next));
router.get('/:id', authenticate, (req, res, next) => controller.get(req, res, next));
router.post('/', authenticate, (req, res, next) => controller.create(req, res, next));
router.put('/:id', authenticate, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
