import * as jwt from "jsonwebtoken"
import {ITokenPayload, ITokenPair} from "../types/token.interface";

class TokenServices{
    public  generateTokenPair(payload: ITokenPayload): ITokenPair{
        const accessToken = jwt.sign(payload, 'JWT_ACCESS_SECRET', {expiresIn:'15m'});
        const refreshToken = jwt.sign(payload, 'JWT_REFRESH_SECRET', {expiresIn:'30d'});

        return{
            accessToken,
            refreshToken
        }
    }
}

export const tokenServices = new TokenServices();