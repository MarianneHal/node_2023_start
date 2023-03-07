import {NextFunction, Request, Response} from "express";


import {User} from "../models/user.model";
import {ApiError} from "../errors/api.error";

class UserMiddleware {
    public async getByIdAndThrow(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const {userId} = req.params;

            const user = await User.findById(userId)
            if (!user) {
                throw new ApiError("User not found", 404);
            }
            next();
        } catch (e) {
            next(e);
        }
    }
    public async isBodyValid(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
        const {name, age} = req.body
        if (name.length < 3 || typeof name !== 'string') {
        throw new ApiError("Wrong name", 400);
      }
        if (age < 0 || Number.isNaN(+age)) {
            throw new ApiError("Wrong age", 400)
   }
     next();
       } catch (e) {
        next(e)
   }
  }
}

export const userMiddleware = new UserMiddleware;

