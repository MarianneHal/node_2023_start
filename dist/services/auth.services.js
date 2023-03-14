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
exports.authService = void 0;
const api_error_1 = require("../errors/api.error");
const password_service_1 = require("./password.service");
const user_model_1 = require("../models/user.model");
const token_services_1 = require("./token.services");
const token_modele_1 = require("../models/token.modele");
class AuthService {
    register(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield password_service_1.passwordService.hash(body.password);
                const createdUser = yield user_model_1.User.create(Object.assign(Object.assign({}, body), { password: hashedPassword }));
            }
            catch (e) {
                throw new api_error_1.ApiError('User is already', 404);
            }
        });
    }
    login(credentials, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isMatched = yield password_service_1.passwordService.compare(credentials.password, user.password);
                if (!isMatched) {
                    throw new api_error_1.ApiError('Invalid date', 404);
                }
                const tokenPair = token_services_1.tokenServices.generateTokenPair({ name: user.name, _id: user._id });
                yield token_modele_1.Token.create(Object.assign({ _user_id: user._id }, tokenPair));
                return tokenPair;
            }
            catch (e) {
                // @ts-ignore
                throw new api_error_1.ApiError(e.message, e.status);
            }
        });
    }
    refresh(tokenInfo, jwtPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenPair = token_services_1.tokenServices.generateTokenPair({ _id: jwtPayload._id, name: jwtPayload.name });
                yield Promise.all([token_modele_1.Token.create(Object.assign({ _user_id: jwtPayload._id }, tokenPair)),
                    token_modele_1.Token.deleteOne({ refreshToken: tokenInfo.refreshToken })]);
                return tokenPair;
            }
            catch (e) {
                // @ts-ignore
                throw new api_error_1.ApiError(e.message, e.status);
            }
        });
    }
}
exports.authService = new AuthService();
