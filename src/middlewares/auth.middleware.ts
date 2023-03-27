import {NextFunction, Request, Response} from "express";
import {Token} from "../models/token.model";
import {ApiError} from "../errors/api.error";
import {tokenServices} from "../services/token.service";
import {ETokenType} from "../Enums/token.enum";
import {EActionTokenType} from "../Enums/action.enum";
import {Action} from "../models/actionToken.model";
import {OldPassword} from "../models/Old.password.model"
import {passwordService} from "../services/password.service";



class AuthMiddleware{
   public async checkAccessToken(
       req:Request,
       res:Response,
       next:NextFunction
   ): Promise<void> {
      try{
         const accessToken = req.get("Authorization");
         if (!accessToken) {
            throw new ApiError('No token', 401)
         }

         const jwtPayload = tokenServices.checkToken(accessToken, ETokenType.access );

         const tokenInfo = await Token.findOne({accessToken})

         if (!tokenInfo) {
            throw new ApiError('Token is not valid', 401)
         }

         req.res.locals = {tokenInfo, jwtPayload}
         next();
      }catch(e){
         next(e)
      }
   }

   public async checkRefreshToken(
       req:Request,
       res:Response,
       next:NextFunction
   ): Promise<void> {
      try{
         const refreshToken = req.get("Authorization");

         if (!refreshToken) {
            throw new ApiError('No token', 401)
         }

         const jwtPayload = tokenServices.checkToken(refreshToken, ETokenType.refresh);
         const tokenInfo = await Token.findOne({refreshToken})

         if (!tokenInfo) {
            throw new ApiError('Token is not valid', 401)
         }

         req.res.locals = {tokenInfo, jwtPayload}
         next();
      }catch(e){
         next(e)
      }
   }

   public checkActionToken(type: EActionTokenType) {
      return async (req: Request, res: Response, next: NextFunction) => {
         try {
            const actionToken = req.params.token;

            if (!actionToken) {
               throw new ApiError("No token", 401);
            }

            const jwtPayload = tokenServices.checkActionToken(actionToken, type);

            const tokenInfo = await Action.findOne({ actionToken });

            if (!tokenInfo) {
               throw new ApiError("Token not valid", 401);
            }

            req.res.locals = { tokenInfo, jwtPayload };
            next();
         } catch (e) {
            next(e);
         }
      };
   }

   public async checkOldPassword(req:Request, res:Response, next:NextFunction) {
      try{

         const {body} =req;
         const {tokenInfo} = res.locals;

         const oldPasswords = await OldPassword.find({_user_id: tokenInfo._user_id})
             if (!oldPasswords) return next();

         await Promise.all(oldPasswords.map( async (record)=>{
                const isMatched = await passwordService.compare(body.password, record.password);
                if(isMatched) {
                   throw new ApiError("your new password is the same as your old", 409)
                }
             }))

         next();
      }catch(e){
         next(e)
      }
   }
}

export const authMiddleware = new AuthMiddleware();