import {request, Request, Response, Router} from "express";
import {IUser} from "../types/user.types";
import {User} from "../models/user.model";
import {userController} from "../controllers/user.controller";
import {userMiddleware} from "../middlewares/user.middleware";

const router = Router();

export const userRouter = router;

router.get("/", userController.getAll);

router.put ('/users', userMiddleware.isBodyValid, userController.update);

router.get('/:userId',userMiddleware.getByIdAndThrow, userController.getById);

router.post ('/:userId', userController.create);

router.delete('/users/:userId', userController.delete);

