import {NextFunction, Request, Response} from "express";
import {UploadedFile} from "express-fileupload";

import {User} from "../models/user.model";
import {ICommonResponse, IUser} from "../types";
import {userService} from "../services";
import {userMapper} from "../mappers";


class UserController {

    public async getAll(req: Request, res: Response, next: NextFunction): Promise<Response<IUser[]>> {
           const users = await userService.getWithPagination(req.query);
           return res.json(users)
    }

    public async getById(req: Request, res: Response, next: NextFunction): Promise<Response<IUser>> {
        const { user } = res.locals;
        return res.json(user);

    }

    public async update(req: Request, res: Response, next: NextFunction): Promise<Response<ICommonResponse<IUser>>> {
            const {userId} = req.params;
            const updatedUser = await User.findByIdAndUpdate(userId, {...req.body})
            return res.status(200).json({
                massage: "User updated",
                data: updatedUser
            })
    }

    public async create(req: Request, res: Response, next: NextFunction): Promise<Response<ICommonResponse<IUser>>>{
        try{
            await User.createUserWithHashPassword(req.body)
        return res.status(200).json({
            message: "User created"
        })
            next();
        }catch (e) {
            next(e)
        }

    }

    public async delete(req: Request, res: Response, next: NextFunction): Promise<Response<ICommonResponse<IUser>>>{
        const { userId } = req.params;
        await User.deleteOne({_id: userId})
       return  res.sendStatus(200).json({
            massage: "User deleted"
        })
    }

    public async uploadAvatar(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response<void>> {
        try {
            const { userId } = req.params;
            const avatar = req.files.avatar as UploadedFile;

            const user = await userService.uploadAvatar(avatar, userId);

            return res.status(201).json(user);
        } catch (e) {
            next(e);
        }
    }
    public async deleteAvatar(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response<IUser>> {
        try {
            const userEntity = res.locals.user as IUser;

            const user = await userService.deleteAvatar(userEntity);

            const response = userMapper.toResponse(user);

            return res.status(201).json(response);
        } catch (e) {
            next(e);
        }
    }
}



export const userController = new UserController();