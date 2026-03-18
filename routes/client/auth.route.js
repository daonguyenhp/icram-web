const express = require('express');
const router = express.Router();

const passport = require('passport');
require('../../config/passport');

const authController = require('../../controllers/client/auth.controller');

// 1. Các Route hiển thị giao diện (GET)
router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);

// 2. Các Route xử lý dữ liệu form (POST)
router.post('/auth/local', authController.postLogin);
router.post('/api/register', authController.postRegister);

// 3. Các Route cho google
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    authController.googleCallback 
);

module.exports = router;