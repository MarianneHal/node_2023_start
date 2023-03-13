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
exports.authMiddleware = void 0;
const token_modele_1 = require("../models/token.modele");
const api_error_1 = require("../errors/api.error");
const token_services_1 = require("../services/token.services");
const token_enum_1 = require("../Enums/token.enum");
class AuthMiddleware {
    checkAccessToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = req.get("Authorization");
                if (!accessToken) {
                    throw new api_error_1.ApiError('No token', 401);
                }
                const jwtPayload = token_services_1.tokenServices.checkToken(accessToken, token_enum_1.ETokenType.access);
                const tokenInfo = yield token_modele_1.Token.findOne({ accessToken });
                if (!tokenInfo) {
                    throw new api_error_1.ApiError('Token is not valid', 401);
                }
                // @ts-ignore
                req.res.locals = { tokenInfo, jwtPayload };
                next();
            }
            catch (e) {
                next(e);
            }
        });
    }
    checkRefreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.get("Authorization");
                if (!refreshToken) {
                    throw new api_error_1.ApiError('No token', 401);
                }
                const jwtPayload = token_services_1.tokenServices.checkToken(refreshToken, token_enum_1.ETokenType.refresh);
                const tokenInfo = yield token_modele_1.Token.findOne({ refreshToken });
                if (!tokenInfo) {
                    throw new api_error_1.ApiError('Token is not valid', 401);
                }
                // @ts-ignore
                req.res.locals = { tokenInfo };
                next();
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.authMiddleware = new AuthMiddleware();
