"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_model_1 = require("../models/user.model");
const services_1 = require("../services");
class UserController {
    async getAll(req, res, next) {
        const users = await services_1.userService.getWithPagination(req.query);
        return res.json(users);
    }
    async getById(req, res, next) {
        const { user } = res.locals;
        return res.json(user);
    }
    async update(req, res, next) {
        const { userId } = req.params;
        const updatedUser = await user_model_1.User.findByIdAndUpdate(userId, { ...req.body });
        return res.status(200).json({
            massage: "User updated",
            data: updatedUser
        });
    }
    async create(req, res, next) {
        try {
            await user_model_1.User.createUserWithHashPassword(req.body);
            return res.status(200).json({
                message: "User created"
            });
            next();
        }
        catch (e) {
            next(e);
        }
    }
    async delete(req, res, next) {
        const { userId } = req.params;
        await user_model_1.User.deleteOne({ _id: userId });
        return res.sendStatus(200).json({
            massage: "User deleted"
        });
    }
    async uploadAvatar(req, res, next) {
        try {
            const { userId } = req.params;
            const avatar = req.files.avatar;
            const user = await services_1.userService.uploadAvatar(avatar, userId);
            return res.status(201).json(user);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.userController = new UserController();
