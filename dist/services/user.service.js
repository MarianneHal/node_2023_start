"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const api_error_1 = require("../errors/api.error");
const user_model_1 = require("../models/user.model");
const s3_service_1 = require("./s3.service");
class UserService {
    async getWithPagination(query) {
        try {
            const queryStr = JSON.stringify(query);
            const queryObj = JSON.parse(queryStr.replace('/\b(gte|lte|gt|lt)b\/', (match) => `$${match}`));
            const { page = 1, limit = 5, ...searchObject } = queryObj;
            const skip = limit * (page - 1);
            const users = await user_model_1.User.find(searchObject).skip(skip).limit(limit);
            const userTotalCount = await user_model_1.User.count();
            return {
                page: page,
                perPage: limit,
                itemsCount: userTotalCount,
                itemsFound: users.length,
                data: users
            };
        }
        catch (e) {
            throw new api_error_1.ApiError(e.message, e.status);
        }
    }
    async uploadAvatar(file, userId) {
        try {
            const filePath = await s3_service_1.s3Service.uploadPhoto(file, "user", userId);
            return await user_model_1.User.findByIdAndUpdate(userId, { avatar: filePath }, { new: true });
        }
        catch (e) {
            throw new api_error_1.ApiError(e.message, e.status);
        }
    }
    async deleteAvatar(user) {
        try {
            if (!user.avatar) {
                throw new api_error_1.ApiError("User doesnt have avatar", 422);
            }
            await s3_service_1.s3Service.deletePhoto(user.avatar);
            return await user_model_1.User.findByIdAndUpdate(user._id, { $unset: { avatar: true } }, { new: true });
        }
        catch (e) {
            throw new api_error_1.ApiError(e.message, e.status);
        }
    }
}
exports.userService = new UserService();
