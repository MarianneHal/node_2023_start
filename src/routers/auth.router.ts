import {Router} from "express";
import {userMiddleware} from "../middlewares/user.middleware";
import {authController} from "../controllers/auth.controller";
import {authMiddleware} from "../middlewares/auth.middleware";
import {commonMiddleware} from "../middlewares/common.middleware";
import {UserValidator} from "../validators/user.validator";
import {EActionTokenType} from "../Enums/action.enum";


const router = Router();

router.post('/register',
    commonMiddleware.isBodyValid(UserValidator.creatUser),
    userMiddleware.getDynamicallyAndThrow('email'),
    authController.register);

router.post('/login',
        commonMiddleware.isBodyValid(UserValidator.loginUser),
        userMiddleware.getDynamicallyOrThrow('email'),
        authController.login);

router.post('/password/change',
    commonMiddleware.isBodyValid(UserValidator.changeUserPassword),
    authMiddleware.checkAccessToken,
    authController.changePassword);

router.post('/password/forgot',
    commonMiddleware.isBodyValid(UserValidator.emailValidator),
    userMiddleware.getDynamicallyOrThrow("email"),
    authController.forgotPassword);

router.put(
    '/password/forgot/:token',
    authMiddleware.checkActionToken(EActionTokenType.forgot),
    authMiddleware.checkOldPassword,
    authController.setForgotPassword);

router.post(
    "/activate",
    commonMiddleware.isBodyValid(UserValidator.emailValidator),
    userMiddleware.getDynamicallyOrThrow("email"),
    authController.sendActivateToken);

router.put(
    `/activate/:token`,
    authMiddleware.checkActionToken(EActionTokenType.activate),
    authController.activate);

router.post(
    "/refresh",
    authMiddleware.checkRefreshToken,
    authController.refresh);

export const authRouter = router;