import {Router} from "express";
import {userMiddleware} from "../middlewares/user.middleware";
import {authController} from "../controllers/auth.controller";
import {authMiddleware} from "../middlewares/auth.middleware";


const router = Router();

router.post('/register',
    userMiddleware.isUserValidCreate,
    userMiddleware.getDynamicallyAndThrow('email'),
    authController.register)

router.post('/login',
        userMiddleware.isValidLogin,
        userMiddleware.getDynamicallyOrThrow('email'),
        authController.login )

router.post('/login')

router.post('/password/forgot',
    userMiddleware.getDynamicallyAndThrow('email'),
    authController.forgotPassword
    )

// @ts-ignore
router.post('/refresh',
    authMiddleware.checkRefreshToken,
    authController.refresh)

export const authRouter = router;