"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const user_model_1 = require("../models/user.model");
const api_error_1 = require("../errors/api.error");
class UserMiddleware {
    async getByIdOrThrow(req, res, next) {
        try {
            const { userId } = req.params;
            const user = await user_model_1.User.findById(userId);
            if (!user) {
                throw new api_error_1.ApiError("User not found", 422);
            }
            res.locals = { user };
            next();
        }
        catch (e) {
            next(e);
        }
    }
    async getByIdAndThrow(req, res, next) {
        try {
            const { userId } = req.params;
            const user = await user_model_1.User.findById(userId);
            if (!user) {
                throw new api_error_1.ApiError("User not found", 422);
            }
            res.locals.user = user;
            next();
        }
        catch (e) {
            next(e);
        }
    }
    getDynamicallyAndThrow(fieldName, from = 'body', dbField = "email") {
        return async (req, res, next) => {
            try {
                const fieldValue = req[from][fieldName];
                const user = await user_model_1.User.findOne({ [dbField]: fieldValue });
                if (user) {
                    throw new api_error_1.ApiError(`User with ${fieldName} ${fieldValue} already exist`, 409);
                }
                next();
            }
            catch (e) {
                next(e);
            }
        };
    }
    getDynamicallyOrThrow(fieldName, from = "body", dbField = "email") {
        return async (req, res, next) => {
            try {
                const fieldValue = req[from][fieldName];
                const user = await user_model_1.User.findOne({ [dbField]: fieldValue });
                if (!user) {
                    throw new api_error_1.ApiError('Not Found', 404);
                }
                req.res.locals = { user };
                next();
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.userMiddleware = new UserMiddleware;
