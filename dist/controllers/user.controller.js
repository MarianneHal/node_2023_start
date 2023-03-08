"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_model_1 = require("../models/user.model");
class UserController {
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_model_1.User.find();
            return res.json(users);
        });
    }
    getById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = res.locals;
            return res.json(user);
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, Object.assign({}, req.body));
            return res.status(200).json({
                massage: "User updated",
                data: updatedUser
            });
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const user = yield user_model_1.User.create(body);
            return res.status(200).json({
                message: "User created",
                data: user
            });
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            yield user_model_1.User.deleteOne({ _id: userId });
            return res.status(200).json({
                massage: "User deleted"
            });
        });
    }
}
exports.userController = new UserController();
