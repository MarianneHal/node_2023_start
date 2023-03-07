import {NextFunction, request, Request, Response} from "express";

import {User} from "../models/user.model";
import {ICommonResponse, IUser} from "../types/user.types";

class UserController {
    public async getAll(req: Request, res: Response, next: NextFunction): Promise<Response<IUser[]>> {
           const users = await User.find();
           return res.json(users)
    }

    public async getById(req: Request, res: Response, next: NextFunction): Promise<Response<IUser[]>> {

            const {userId} = req.params;
            const user = User.findById(userId)
            return res.json(user);

    }

    public async update(req: Request, res: Response, next: NextFunction): Promise<Response<ICommonResponse<IUser>>> {
            const {userId} = request.params;
            const user = req.body;
            const updatedUser = await User.updateOne({_id: userId}, {...user})
            return res.status(200).json({
                massage: "User updated",
                data: updatedUser
            })
    }

    public async create(req: Request, res: Response, next: NextFunction): Promise<Response<ICommonResponse<IUser>>> {
        const body = req.body;
        const user = await User.create(body);
        return res.status(200).json({
            message: "User created",
            data: user
        })
    }

    public async delete(req: Request, res: Response, next: NextFunction): Promise<Response<ICommonResponse<IUser>>>{
        const { userId } = req.params;
        await User.deleteOne({_id: userId})
       return  res.status(200).json({
            massage: "User deleted"
        })
    }
}

export const userController = new UserController();