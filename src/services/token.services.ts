import * as jwt from "jsonwebtoken"
import {IActionTokenPayload, ITokenPair, ITokenPayload} from "../types/token.interface";
import {ApiError} from "../errors/api.error";
import {ETokenType} from "../Enums/token.enum";
import {EActionTokenType} from "../Enums/action.enum";

class TokenServices {
    public generateTokenPair(payload: ITokenPayload): ITokenPair {
        const accessToken = jwt.sign(payload, 'JWT_ACCESS_SECRET', {expiresIn: '15m'});
        const refreshToken = jwt.sign(payload, 'JWT_REFRESH_SECRET', {expiresIn: '30d'});

        return {
            accessToken,
            refreshToken
        }
    }

    public checkToken(token: string, tokenType: ETokenType): ITokenPayload {
        try {

            let secret = '';

            switch (tokenType) {
                case ETokenType.access:
                    secret = 'JWT_ACCESS_SECRET';
                    break
                case ETokenType.refresh:
                    secret = 'JWT_REFRESH_SECRET';
            }
            return jwt.verify(token, secret) as ITokenPayload
        } catch (e) {
            throw new ApiError('Token is not valid', 401)
        }
    }

    public generateActionToken(payload: IActionTokenPayload, tokenType: EActionTokenType): string {
        let secret = '';

        switch (tokenType) {
            case EActionTokenType.activate:
                secret = 'activateSecret';
                break;
            case EActionTokenType.forgot:
                secret = 'forgotSecret'
                break;
        }

        return jwt.sign(payload, secret, {expiresIn: "7d"})
    }
}

export const tokenServices = new TokenServices();