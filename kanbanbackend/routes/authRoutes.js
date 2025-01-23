const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const {limiter} = require("../middlewares/rateLimiter");

router.post('/register', limiter, registerUser);
router.post('/login', limiter, loginUser);
router.get('/me', authMiddleware(["admin","manager","user"]),getMe);

module.exports = router;