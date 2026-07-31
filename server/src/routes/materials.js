const router = require('express').Router();
const BaseController = require('../controllers/BaseController');
const { authenticate, authorize } = require('../middleware/auth');
const Material = require('../models/Material');

const controller = new BaseController(Material, {
  searchFields: ["name","category"],
  allowedFields: ['*'],
  auditAction: 'material',
  
  
});

router.get('/', (req, res, next) => controller.list(req, res, next));
router.get('/:id', (req, res, next) => controller.get(req, res, next));
router.post('/', authenticate, (req, res, next) => controller.create(req, res, next));
router.put('/:id', authenticate, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
