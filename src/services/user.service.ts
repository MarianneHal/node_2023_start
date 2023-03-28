import {UploadedFile} from "express-fileupload";

import {ApiError} from "../errors/api.error";
import {IPaginationResponse, IUser} from "../types";
import {User} from "../models/user.model";
import {s3Service} from "./s3.service";


class UserService {
    public async getWithPagination(query: any): Promise<IPaginationResponse<IUser>> {
        try{
            const queryStr = JSON.stringify(query);
            const queryObj = JSON.parse(queryStr.replace('/\b(gte|lte|gt|lt)b\/', (match)=>`$${match}`));

            const {
                page = 1,
                limit = 5,
                ...searchObject
            } = queryObj;

            const skip = limit * (page-1);
            const users = await User.find(searchObject).skip(skip).limit(limit)
            const userTotalCount = await User.count();

            return {
                page: page,
                perPage: limit,
                itemsCount: userTotalCount,
                itemsFound: users.length,
                // @ts-ignore
                data: users
            }

        }catch (e){

            throw new ApiError(e.message, e.status)
        }
    }

    public async uploadAvatar(
        file: UploadedFile,
        userId: string
    ): Promise<IUser> {
        try {
            const filePath = await s3Service.uploadPhoto(file, "user", userId);

            return await User.findByIdAndUpdate(
                userId,
                { avatar: filePath },
                { new: true }
            );
        } catch (e) {
            throw new ApiError(e.message, e.status);
        }
    }
}

export const userService = new UserService();