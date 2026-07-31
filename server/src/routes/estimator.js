const router = require('express').Router();
const EstimatorController = require('../controllers/EstimatorController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/calculate', EstimatorController.calculate);
router.get('/config', authenticate, authorize('Super Admin', 'Admin'), EstimatorController.getConfig);
router.put('/config', authenticate, authorize('Super Admin', 'Admin'), EstimatorController.updateConfig);

module.exports = router;
