"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const user_middleware_1 = require("../middlewares/user.middleware");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const common_middleware_1 = require("../middlewares/common.middleware");
const user_validator_1 = require("../validators/user.validator");
const action_enum_1 = require("../Enums/action.enum");
const router = (0, express_1.Router)();
router.post('/register', common_middleware_1.commonMiddleware.isBodyValid(user_validator_1.UserValidator.creatUser), user_middleware_1.userMiddleware.getDynamicallyAndThrow('email'), auth_controller_1.authController.register);
router.post('/login', common_middleware_1.commonMiddleware.isBodyValid(user_validator_1.UserValidator.loginUser), user_middleware_1.userMiddleware.getDynamicallyOrThrow('email'), auth_controller_1.authController.login);
router.post('/password/change', common_middleware_1.commonMiddleware.isBodyValid(user_validator_1.UserValidator.changeUserPassword), auth_middleware_1.authMiddleware.checkAccessToken, auth_controller_1.authController.changePassword);
router.post('/password/forgot', common_middleware_1.commonMiddleware.isBodyValid(user_validator_1.UserValidator.emailValidator), user_middleware_1.userMiddleware.getDynamicallyOrThrow("email"), auth_controller_1.authController.forgotPassword);
router.put('/password/forgot/:token', auth_middleware_1.authMiddleware.checkActionToken(action_enum_1.EActionTokenType.forgot), auth_middleware_1.authMiddleware.checkOldPassword, auth_controller_1.authController.setForgotPassword);
router.post("/activate", common_middleware_1.commonMiddleware.isBodyValid(user_validator_1.UserValidator.emailValidator), user_middleware_1.userMiddleware.getDynamicallyOrThrow("email"), auth_controller_1.authController.sendActivateToken);
router.put(`/activate/:token`, auth_middleware_1.authMiddleware.checkActionToken(action_enum_1.EActionTokenType.activate), auth_controller_1.authController.activate);
router.post("/refresh", auth_middleware_1.authMiddleware.checkRefreshToken, auth_controller_1.authController.refresh);
exports.authRouter = router;
