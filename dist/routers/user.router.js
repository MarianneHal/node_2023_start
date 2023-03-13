"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const user_middleware_1 = require("../middlewares/user.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
exports.userRouter = router;
router.get("/", user_controller_1.userController.getAll);
// @ts-ignore
router.put('/:userId', auth_middleware_1.authMiddleware.checkAccessToken, user_middleware_1.userMiddleware.isUserIdValid, user_middleware_1.userMiddleware.isUserValidUpdate, user_middleware_1.userMiddleware.getByIdAndThrow, user_controller_1.userController.update);
router.get("/:userId", user_middleware_1.userMiddleware.isUserIdValid, user_middleware_1.userMiddleware.getByIdAndThrow, user_controller_1.userController.getById);
// @ts-ignore
router.post('/', auth_middleware_1.authMiddleware.checkAccessToken, user_middleware_1.userMiddleware.isUserValidCreate, user_controller_1.userController.create);
router.delete('/:userId', user_middleware_1.userMiddleware.isUserIdValid, user_middleware_1.userMiddleware.getByIdAndThrow, user_controller_1.userController.delete);
