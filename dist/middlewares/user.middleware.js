"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const mongoose_1 = require("mongoose");
const user_model_1 = require("../models/user.model");
const api_error_1 = require("../errors/api.error");
const user_validator_1 = require("../validators/user.validator");
class UserMiddleware {
    async getByIdAndThrow(req, res, next) {
        try {
            const { userId } = req.params;
            const user = await user_model_1.User.findById(userId);
            if (!user) {
                throw new api_error_1.ApiError("User not found", 404);
            }
            res.locals.user = user;
            next();
        }
        catch (e) {
            next(e);
        }
    }
    getDynamicallyAndThrow(fieldName, from = 'body', dbField = fieldName) {
        return async (req, res, next) => {
            try {
                const fieldValue = req[from][fieldName];
                const user = await user_model_1.User.findOne({ [dbField]: fieldValue });
                if (user) {
                    throw new api_error_1.ApiError('Not Found', 409);
                }
                next();
            }
            catch (e) {
                next(e);
            }
        };
    }
    getDynamicallyOrThrow(fieldName, from = 'body', dbField = fieldName) {
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
    async isUserValidCreate(req, res, next) {
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
    }
    async isUserIdValid(req, res, next) {
        try {
            if (!(0, mongoose_1.isObjectIdOrHexString)(req.params.userId)) {
                throw new api_error_1.ApiError("ID not valid", 400);
            }
            next();
        }
        catch (e) {
            next(e);
        }
    }
    async isUserValidUpdate(req, res, next) {
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
    }
    isValidLogin(req, res, next) {
        try {
            const { error } = user_validator_1.UserValidator.loginUser.validate(req.body);
            if (error) {
                throw new api_error_1.ApiError(error.message, 400);
            }
            next();
        }
        catch (e) {
            next(e);
        }
    }
}
exports.userMiddleware = new UserMiddleware;
