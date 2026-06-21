const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const authMiddleware = require('../../middlewares/auth');

// Público
router.post('/login', authController.login);
router.post('/recuperar', authController.recuperar);
router.post('/reset-password', authController.resetPassword);

// Privado (requiere JWT)
router.post('/cambiar-password', authMiddleware, authController.cambiarPassword);

module.exports = router;