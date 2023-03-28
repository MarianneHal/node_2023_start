import { Router } from "express";

import {userController} from "../controllers/user.controller";
import {userMiddleware} from "../middlewares/user.middleware";
import {authMiddleware} from "../middlewares/auth.middleware";
import {commonMiddleware} from "../middlewares/common.middleware";
import {UserValidator} from "../validators/user.validator";
import {fileMiddleware} from "../middlewares/file.middleware";

const router = Router();

export const userRouter = router;

router.get("/", userController.getAll);

router.get(
    "/:userId",
    authMiddleware.checkAccessToken,
    commonMiddleware.isIdValid("userId"),
    userMiddleware.getByIdOrThrow,
    userController.getById
);
router.put(
    "/:userId",
    authMiddleware.checkAccessToken,
    commonMiddleware.isIdValid("userId"),
    commonMiddleware.isBodyValid(UserValidator.updateUser),
    userMiddleware.getByIdOrThrow,
    userController.update
);
router.delete(
    "/:userId",
    authMiddleware.checkAccessToken,
    commonMiddleware.isIdValid("userId"),
    userMiddleware.getByIdOrThrow,
    userController.delete
);
router.put(
    "/:userId/avatar",
    authMiddleware.checkAccessToken,
    commonMiddleware.isIdValid("userId"),
    fileMiddleware.isAvatarValid,
    userMiddleware.getByIdOrThrow,
    userController.uploadAvatar
);

