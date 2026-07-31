const router = require('express').Router();
const BaseController = require('../controllers/BaseController');
const { authenticate, authorize } = require('../middleware/auth');
const Customer = require('../models/Customer');

const controller = new BaseController(Customer, {
  searchFields: ['companyName', 'city', 'district'],
  allowedFields: ['*'],
  auditAction: 'customer',
});

router.get('/', authenticate, (req, res, next) => controller.list(req, res, next));
router.get('/:id', authenticate, (req, res, next) => controller.get(req, res, next));
router.post('/', authenticate, (req, res, next) => controller.create(req, res, next));
router.put('/:id', authenticate, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), (req, res, next) => controller.delete(req, res, next));

module.exports = router;
