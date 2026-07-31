const router = require('express').Router();
const AnalyticsController = require('../controllers/AnalyticsController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/dashboard', authenticate, authorize('Super Admin', 'Admin', 'Project Manager'), AnalyticsController.dashboard);
router.get('/projects-by-status', authenticate, authorize('Super Admin', 'Admin'), AnalyticsController.projectsByStatus);
router.get('/revenue-by-month', authenticate, authorize('Super Admin', 'Admin'), AnalyticsController.revenueByMonth);
router.get('/quotes-by-month', authenticate, authorize('Super Admin', 'Admin'), AnalyticsController.quotesByMonth);
router.get('/service-demand', authenticate, authorize('Super Admin', 'Admin'), AnalyticsController.serviceDemand);

module.exports = router;
