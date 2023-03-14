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
exports.authController = void 0;
const auth_services_1 = require("../services/auth.services");
class AuthController {
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield auth_services_1.authService.register(req.body);
                res.sendStatus(201);
            }
            catch (e) {
                next(e);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { user } = res.locals;
                const tokenPair = yield auth_services_1.authService.login({ email, password }, user);
                return res.status(200).json(tokenPair);
            }
            catch (e) {
                next(e);
            }
        });
    }
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const { tokenInfo, jwtPayload } = req.res.locals;
                // @ts-ignore
                const { user } = req.res.locals;
                const tokenPair = yield auth_services_1.authService.refresh(tokenInfo, jwtPayload);
                return res.status(200).json(tokenPair);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.authController = new AuthController();
