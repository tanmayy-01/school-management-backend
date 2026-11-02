const express = require('express');
const { AuthController } = require('../../controllers');
const { AuthMiddlewares } = require('../../middlewares');

const router = express.Router();

router.post('/signup', AuthMiddlewares.validateAuthRequest, AuthController.signup);
router.post('/signin', AuthMiddlewares.validateAuthRequest, AuthController.signin);
router.get('/me', AuthMiddlewares.checkAuth, AuthController.me);

module.exports = router;

