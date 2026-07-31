const router = require('express').Router();
const BaseController = require('../controllers/BaseController');
const { authenticate, authorize } = require('../middleware/auth');
const Testimonial = require('../models/Testimonial');

const controller = new BaseController(Testimonial, {
  searchFields: [],
  allowedFields: ['*'],
  auditAction: 'testimonial',
  
  
});

router.get('/', (req, res, next) => controller.list(req, res, next));
router.get('/:id', (req, res, next) => controller.get(req, res, next));
router.post('/', authenticate, (req, res, next) => controller.create(req, res, next));
router.put('/:id', authenticate, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
