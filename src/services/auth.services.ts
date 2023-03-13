import {ApiError} from "../errors/api.error";
import {IUser} from "../types/user.types";
import {passwordService} from "./password.service";
import {User} from "../models/user.model";
import {ICredentials} from "../types/auth.types";
import {tokenServices} from "./token.services";
import {ITokenPair, ITokenPayload} from "../types/token.interface";
import {Token} from "../models/token.modele";
import {Promise} from "mongoose";

class AuthService {
    public async register(body: IUser): Promise<void> {
        try{
           const hashedPassword = await passwordService.hash(body.password)
            const createdUser = await User.create({...body, password:hashedPassword})
        } catch (e){
            // @ts-ignore
            throw new ApiError(e.message, e.status)
        }
    }

    public async login(credentials: ICredentials, user: IUser):Promise<ITokenPair> {
        try{

            const  isMatched = await passwordService.compare(credentials.password, user.password)

            if(!isMatched) {
                throw new ApiError('Invalid date', 404)
            }
        const tokenPair = tokenServices.generateTokenPair({name: user.name, id: user._id})
            await Token.create({
                _user_id: user._id,
                ...tokenPair
            })

            return tokenPair
    } catch(e) {
            // @ts-ignore
            throw new ApiError(e.message, e.status)
        }
    }
    public async refresh(tokenInfo: ITokenPair, jwtPayload: ITokenPayload):Promise<ITokenPair> {
        try{

            const  tokenPair = tokenServices.generateTokenPair({_id: jwtPayload._id, name: jwtPayload.name})

           await Promise.all([Token.create({_id: jwtPayload._id, name: jwtPayload.name}),
           Token.deleteOne({refreshToken: tokenInfo.refreshToken})])

            return tokenPair
        } catch(e) {
            // @ts-ignore
            throw new ApiError(e.message, e.status)
        }
    }

}

export const authService = new AuthService();