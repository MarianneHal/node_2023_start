import {NextFunction, Request, Response} from "express";
import {Token} from "../models/token.modele";
import {ApiError} from "../errors/api.error";
import {tokenServices} from "../services/token.services";
import {ETokenType} from "../Enums/token.enum";
import {EActionTokenType} from "../Enums/action.enum";
import {Action} from "../models/actionToken.model";


class AuthMiddleware{
   public async checkAccessToken(req:Request, res:Response, next:NextFunction): Promise<void> {
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

         // @ts-ignore
         req.res.locals = {tokenInfo, jwtPayload}


        next();
      }catch(e){
         next(e)
      }
   }
   public async checkRefreshToken(req:Request, res:Response, next:NextFunction): Promise<void> {
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


         // @ts-ignore
         req.res.locals = {tokenInfo, jwtPayload}
         next();
      }catch(e){
         next(e)
      }
   }

   public async checkActiinForgotToken(req: Request, res: Response, next:NextFunction): Promise<void> {
      try{
         const actionToken = req.params.token;
         if (!actionToken)
            throw new ApiError("No token", 401);

         const jwtPayload = tokenServices.checkActionToken(actionToken, EActionTokenType.forgot)

         const tokenInfo = await Action.findOne({actionToken})

         if(!tokenInfo) {
            throw new ApiError("Token is not valid", 401)
         }

         // @ts-ignore
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

            // @ts-ignore
            req.res.locals = { tokenInfo, jwtPayload };
            next();
         } catch (e) {
            next(e);
         }
      };
   }


}

export const authMiddleware = new AuthMiddleware();