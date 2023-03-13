"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenServices = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const api_error_1 = require("../errors/api.error");
const token_enum_1 = require("../Enums/token.enum");
class TokenServices {
    generateTokenPair(payload) {
        const accessToken = jwt.sign(payload, 'JWT_ACCESS_SECRET', { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, 'JWT_REFRESH_SECRET', { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        };
    }
    checkToken(token, tokenType) {
        try {
            let secret = '';
            switch (tokenType) {
                case token_enum_1.ETokenType.access:
                    secret = 'JWT_ACCESS_SECRET';
                    break;
                case token_enum_1.ETokenType.refresh:
                    secret = 'JWT_REFRESH_SECRET';
            }
            return jwt.verify(token, secret);
        }
        catch (e) {
            throw new api_error_1.ApiError('Token is not valid', 401);
        }
    }
}
exports.tokenServices = new TokenServices();
