const router = require('express').Router();
const ContactController = require('../controllers/ContactController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', ContactController.submit);
router.get('/', authenticate, authorize('Super Admin', 'Admin'), ContactController.list);
router.put('/:id/read', authenticate, authorize('Super Admin', 'Admin'), ContactController.markRead);
router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), ContactController.deleteMessage);

module.exports = router;
