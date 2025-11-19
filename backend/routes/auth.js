const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/AuthController');
const isAuthenticated = require('../app/middlewares/isAuthenticated');

// Đăng ký
router.post('/register', authController.register);

// Đăng xuất
router.post('/logout', authController.logout);

// Kiểm tra trạng thái đăng nhập
router.get('/check-login-status', isAuthenticated, authController.checkLoginStatus);

module.exports = router;
