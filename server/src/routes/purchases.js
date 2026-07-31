const router = require('express').Router();
const BaseController = require('../controllers/BaseController');
const { authenticate, authorize } = require('../middleware/auth');
const PurchaseOrder = require('../models/PurchaseOrder');

const controller = new BaseController(PurchaseOrder, {
  searchFields: ["poNumber"],
  allowedFields: ['*'],
  auditAction: 'purchase',
  
  
});

router.get('/', authenticate, (req, res, next) => controller.list(req, res, next));
router.get('/:id', authenticate, (req, res, next) => controller.get(req, res, next));
router.post('/', authenticate, authorize('Super Admin', 'Admin'), (req, res, next) => controller.create(req, res, next));
router.put('/:id', authenticate, authorize('Super Admin', 'Admin'), (req, res, next) => controller.update(req, res, next));
router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), (req, res, next) => controller.delete(req, res, next));

module.exports = router;
