"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    async register(req, res, next) {
        try {
            await auth_service_1.authService.register(req.body);
            res.sendStatus(201);
        }
        catch (e) {
            next(e);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { user } = res.locals;
            const tokenPair = await auth_service_1.authService.login({ email, password }, user);
            return res.status(200).json(tokenPair);
        }
        catch (e) {
            next(e);
        }
    }
    async refresh(req, res, next) {
        try {
            const { tokenInfo, jwtPayload } = req.res.locals;
            const { user } = req.res.locals;
            const tokenPair = await auth_service_1.authService.refresh(tokenInfo, jwtPayload);
            return res.status(200).json(tokenPair);
        }
        catch (e) {
            next(e);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const { user } = req.res.locals;
            await auth_service_1.authService.forgotPassword(user);
            res.sendStatus(200);
        }
        catch (e) {
            next(e);
        }
    }
    async setForgotPassword(req, res, next) {
        try {
            const { password } = req.body;
            const { tokenInfo } = req.res.locals;
            await auth_service_1.authService.setForgotPassword(password, tokenInfo._user_id);
            res.sendStatus(200);
            next();
        }
        catch (e) {
            next(e);
        }
    }
    async sendActivateToken(req, res, next) {
        try {
            const { user } = req.res.locals;
            await auth_service_1.authService.sendActivateToken(user);
            res.sendStatus(204);
        }
        catch (e) {
            next(e);
        }
    }
    async activate(req, res, next) {
        try {
            const { _id } = req.res.locals.jwtPayload;
            await auth_service_1.authService.activate(_id);
            res.sendStatus(204);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.authController = new AuthController();
