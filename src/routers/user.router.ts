import { Router } from "express";
import {userController} from "../controllers/user.controller";
import {userMiddleware} from "../middlewares/user.middleware";
import {authMiddleware} from "../middlewares/auth.middleware";

const router = Router();

export const userRouter = router;

router.get("/", userController.getAll);

// @ts-ignore
router.put ('/:userId', authMiddleware.checkAccessToken, userMiddleware.isUserIdValid, userMiddleware.isUserValidUpdate, userMiddleware.getByIdAndThrow, userController.update);

router.get("/:userId",userMiddleware.isUserIdValid,userMiddleware.getByIdAndThrow, userController.getById);

// @ts-ignore
router.post ('/',authMiddleware.checkAccessToken, userMiddleware.isUserValidCreate, userController.create);

router.delete('/:userId',userMiddleware.isUserIdValid, userMiddleware.getByIdAndThrow, userController.delete);

