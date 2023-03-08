import {request, Request, Response, Router} from "express";
import {userController} from "../controllers/user.controller";
import {userMiddleware} from "../middlewares/user.middleware";

const router = Router();

export const userRouter = router;

router.get("/", userController.getAll);

router.put ('/:userId',userMiddleware.isUserIdValid, userMiddleware.isUserValidUpdate, userMiddleware.getByIdAndThrow, userController.update);

router.get("/:userId",userMiddleware.isUserIdValid,userMiddleware.getByIdAndThrow, userController.getById);

router.post ('/',userMiddleware.isUserValidCreate, userController.create);

router.delete('/:userId',userMiddleware.isUserIdValid, userMiddleware.getByIdAndThrow, userController.delete);

