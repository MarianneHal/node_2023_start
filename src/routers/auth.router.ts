import {Router} from "express";
import {userMiddleware} from "../middlewares/user.middleware";
import {authController} from "../controllers/auth.controller";


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

export const authRouter = router;