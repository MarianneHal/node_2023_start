"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const token_modele_1 = require("../models/token.modele");
const api_error_1 = require("../errors/api.error");
const token_service_1 = require("../services/token.service");
const token_enum_1 = require("../Enums/token.enum");
const action_enum_1 = require("../Enums/action.enum");
const actionToken_model_1 = require("../models/actionToken.model");
const Old_password_model_1 = require("../models/Old.password.model");
const password_service_1 = require("../services/password.service");
class AuthMiddleware {
    async checkAccessToken(req, res, next) {
        try {
            const accessToken = req.get("Authorization");
            if (!accessToken) {
                throw new api_error_1.ApiError('No token', 401);
            }
            const jwtPayload = token_service_1.tokenServices.checkToken(accessToken, token_enum_1.ETokenType.access);
            const tokenInfo = await token_modele_1.Token.findOne({ accessToken });
            if (!tokenInfo) {
                throw new api_error_1.ApiError('Token is not valid', 401);
            }
            req.res.locals = { tokenInfo, jwtPayload };
            next();
        }
        catch (e) {
            next(e);
        }
    }
    async checkRefreshToken(req, res, next) {
        try {
            const refreshToken = req.get("Authorization");
            if (!refreshToken) {
                throw new api_error_1.ApiError('No token', 401);
            }
            const jwtPayload = token_service_1.tokenServices.checkToken(refreshToken, token_enum_1.ETokenType.refresh);
            const tokenInfo = await token_modele_1.Token.findOne({ refreshToken });
            if (!tokenInfo) {
                throw new api_error_1.ApiError('Token is not valid', 401);
            }
            req.res.locals = { tokenInfo, jwtPayload };
            next();
        }
        catch (e) {
            next(e);
        }
    }
    async checkActiinForgotToken(req, res, next) {
        try {
            const actionToken = req.params.token;
            if (!actionToken)
                throw new api_error_1.ApiError("No token", 401);
            const jwtPayload = token_service_1.tokenServices.checkActionToken(actionToken, action_enum_1.EActionTokenType.forgot);
            const tokenInfo = await actionToken_model_1.Action.findOne({ actionToken });
            if (!tokenInfo) {
                throw new api_error_1.ApiError("Token is not valid", 401);
            }
            req.res.locals = { tokenInfo, jwtPayload };
            next();
        }
        catch (e) {
            next(e);
        }
    }
    checkActionToken(type) {
        return async (req, res, next) => {
            try {
                const actionToken = req.params.token;
                if (!actionToken) {
                    throw new api_error_1.ApiError("No token", 401);
                }
                const jwtPayload = token_service_1.tokenServices.checkActionToken(actionToken, type);
                const tokenInfo = await actionToken_model_1.Action.findOne({ actionToken });
                if (!tokenInfo) {
                    throw new api_error_1.ApiError("Token not valid", 401);
                }
                req.res.locals = { tokenInfo, jwtPayload };
                next();
            }
            catch (e) {
                next(e);
            }
        };
    }
    async checkOldPassword(req, res, next) {
        try {
            const { body } = req;
            const { tokenInfo } = res.locals;
            const oldPasswords = await Old_password_model_1.OldPassword.find({ _user_id: tokenInfo._user_id });
            if (!oldPasswords)
                next();
            await Promise.all(oldPasswords.map(async (record) => {
                const isMatched = await password_service_1.passwordService.compare(body.password, record.password);
                if (isMatched) {
                    throw new api_error_1.ApiError("your new password is the same as your old", 409);
                }
            }));
            next();
        }
        catch (e) {
            next(e);
        }
    }
}
exports.authMiddleware = new AuthMiddleware();
