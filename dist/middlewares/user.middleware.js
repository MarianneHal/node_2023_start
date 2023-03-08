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
exports.userMiddleware = void 0;
const mongoose_1 = require("mongoose");
const user_model_1 = require("../models/user.model");
const api_error_1 = require("../errors/api.error");
const user_validator_1 = require("../validators/user.validator");
class UserMiddleware {
    getByIdAndThrow(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const user = yield user_model_1.User.findById(userId);
                if (!user) {
                    throw new api_error_1.ApiError("User not found", 404);
                }
                res.locals.user = user;
                next();
            }
            catch (e) {
                next(e);
            }
        });
    }
    isUserValidCreate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = user_validator_1.UserValidator.creatUser.validate(req.body);
                if (error) {
                    return next(new api_error_1.ApiError(error.message, 404));
                }
                req.body = value;
                next();
            }
            catch (e) {
                next(e);
            }
        });
    }
    isUserIdValid(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(0, mongoose_1.isObjectIdOrHexString)(req.params.userId)) {
                    throw new api_error_1.ApiError("ID not valid", 400);
                }
                next();
            }
            catch (e) {
                next(e);
            }
        });
    }
    isUserValidUpdate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = user_validator_1.UserValidator.updateUser.validate(req.body);
                if (error) {
                    return next(new api_error_1.ApiError(error.message, 404));
                }
                req.body = value;
                next();
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.userMiddleware = new UserMiddleware;
