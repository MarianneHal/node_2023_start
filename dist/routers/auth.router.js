"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const user_middleware_1 = require("../middlewares/user.middleware");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/register', user_middleware_1.userMiddleware.isUserValidCreate, user_middleware_1.userMiddleware.getDynamicallyAndThrow('email'), auth_controller_1.authController.register);
router.post('/login', user_middleware_1.userMiddleware.isValidLogin, user_middleware_1.userMiddleware.getDynamicallyOrThrow('email'), auth_controller_1.authController.login);
router.post('/login');
router.post('/password/forgot', user_middleware_1.userMiddleware.getDynamicallyAndThrow('email'), auth_controller_1.authController.forgotPassword);
// @ts-ignore
router.post('/refresh', auth_middleware_1.authMiddleware.checkRefreshToken, auth_controller_1.authController.refresh);
exports.authRouter = router;
