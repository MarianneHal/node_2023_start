"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileMiddleware = void 0;
const api_error_1 = require("../errors/api.error");
const file_configs_1 = require("../configs/file.configs");
class FileMiddleware {
    isAvatarValid(req, res, next) {
        try {
            if (!req.files) {
                throw new api_error_1.ApiError("No files to upload", 400);
            }
            if (Array.isArray(req.files.avatar)) {
                throw new api_error_1.ApiError("You can upload only one photo", 400);
            }
            const { size, mimetype, name } = req.files.avatar;
            if (size > file_configs_1.avatarConfig.MAX_SIZE) {
                throw new api_error_1.ApiError(`File ${name} is too big.`, 400);
            }
            if (!file_configs_1.avatarConfig.MIMETYPES.includes(mimetype)) {
                throw new api_error_1.ApiError(`File ${name} has invalid format`, 400);
            }
            next();
        }
        catch (e) {
            next(e);
        }
    }
}
exports.fileMiddleware = new FileMiddleware();
