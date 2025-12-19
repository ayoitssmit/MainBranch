const express = require('express');
const router = express.Router();
const { githubAuth, getMe } = require('../controllers/authController');
const { registerUser, loginUser } = require('../controllers/emailAuthController');
const { protect } = require('../middleware/authMiddleware');

router.post('/github', githubAuth);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
