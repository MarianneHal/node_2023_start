"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const api_error_1 = require("../errors/api.error");
const password_service_1 = require("./password.service");
const user_model_1 = require("../models/user.model");
const token_service_1 = require("./token.service");
const token_model_1 = require("../models/token.model");
const email_service_1 = require("./email.service");
const email_enum_1 = require("../Enums/email.enum");
const action_enum_1 = require("../Enums/action.enum");
const actionToken_model_1 = require("../models/actionToken.model");
const status_enum_1 = require("../Enums/status.enum");
const Old_password_model_1 = require("../models/Old.password.model");
class AuthService {
    async login(credentials, user) {
        try {
            const isMatched = await password_service_1.passwordService.compare(credentials.password, user.password);
            if (!isMatched) {
                throw new api_error_1.ApiError('Invalid date', 404);
            }
            const tokenPair = token_service_1.tokenServices.generateTokenPair({ name: user.name, _id: user._id });
            await token_model_1.Token.create({
                _user_id: user._id,
                ...tokenPair
            });
            return tokenPair;
        }
        catch (e) {
            throw new api_error_1.ApiError(e.message, e.status);
        }
    }
    async refresh(tokenInfo, jwtPayload) {
        try {
            const tokenPair = token_service_1.tokenServices.generateTokenPair({ _id: jwtPayload._id, name: jwtPayload.name });
            await Promise.all([token_model_1.Token.create({ _user_id: jwtPayload._id, ...tokenPair }),
                token_model_1.Token.deleteOne({ refreshToken: tokenInfo.refreshToken })]);
            return tokenPair;
        }
        catch (e) {
            throw new api_error_1.ApiError(e.message, e.status);
        }
    }
    async forgotPassword(user) {
        try {
            const actionToken = token_service_1.tokenServices.generateActionToken({ _id: user._id }, action_enum_1.EActionTokenType.forgot);
            await actionToken_model_1.Action.create({
                actionToken,
                tokenType: action_enum_1.EActionTokenType.forgot,
                _user_id: user._id
            });
            await email_service_1.emailService.sendMail(user.email, email_enum_1.EEmailActions.FORGOT_PASSWORD, { token: actionToken });
            await Old_password_model_1.OldPassword.create({ _user_id: user._id, password: user.password });
        }
        catch (e) {
            throw new api_error_1.ApiError(e.message, e.status);
        }
    }
    async setForgotPassword(password, id) {
        try {
            const hashedPassword = await password_service_1.passwordService.hash(password);
            await user_model_1.User.updateOne({ _id: id }, { password: hashedPassword });
        }
        catch (e) {
            throw new api_error_1.ApiError(e.message, e.status);
        }
    }
    async sendActivateToken(user) {
        try {
            const actionToken = token_service_1.tokenServices.generateActionToken({ _id: user._id }, action_enum_1.EActionTokenType.activate);
            await actionToken_model_1.Action.create({
                actionToken,
                tokenType: action_enum_1.EActionTokenType.activate,
                _user_id: user._id,
            });
            await email_service_1.emailService.sendMail(user.email, email_enum_1.EEmailActions.ACTIVATE, {
                token: actionToken,
            });
        }
        catch (e) {
            throw new api_error_1.ApiError(e.message, e.status);
        }
    }
    async activate(userId) {
        try {
            await Promise.all([
                user_model_1.User.updateOne({ _id: userId }, { $set: { status: status_enum_1.EUserStatus.active } }),
                token_model_1.Token.deleteMany({
                    _user_id: userId,
                    tokenType: action_enum_1.EActionTokenType.activate,
                }),
            ]);
        }
        catch (e) {
            throw new api_error_1.ApiError(e.message, e.status);
        }
    }
}
exports.authService = new AuthService();
