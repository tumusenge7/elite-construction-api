const router = require('express').Router();
const AuthController = require('../controllers/AuthController');
const { authenticate } = require('../middleware/auth');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', authenticate, AuthController.logout);
router.get('/profile', authenticate, AuthController.getProfile);
router.put('/profile', authenticate, AuthController.updateProfile);
router.put('/change-password', authenticate, AuthController.changePassword);

module.exports = router;
