import {ApiError} from "../errors/api.error";
import {IUser} from "../types";
import {passwordService} from "./password.service";
import {User} from "../models/user.model";
import {ICredentials} from "../types";
import {tokenServices} from "./token.service";
import {ITokenPair, ITokenPayload} from "../types";
import {Token} from "../models/token.model";
import {emailService} from "./email.service";
import {EEmailActions} from "../Enums/email.enum";
import {EActionTokenType} from "../Enums/action.enum";
import {Action} from "../models/actionToken.model";
import {EUserStatus} from "../Enums/status.enum";
import {OldPassword} from "../models/Old.password.model";

class AuthService {
    public async register(body: IUser): Promise<void> {
        try {
            const { password } = body;
            const hashedPassword = await passwordService.hash(password);
            await User.create({
                ...body,
                password: hashedPassword,
            });
           // await Promise.all([
                // smsService.sendSms(body.phone, ESmsActionEnum.WELCOME),
              //  emailService.sendMail(body.email, EEmailActions.WELCOME),
          //  ]);
        } catch (e) {
            throw new ApiError(e.message, e.status);
        }
    }

    public async login(credentials: ICredentials, user: IUser):Promise<ITokenPair> {
        try{

            const  isMatched = await passwordService.compare(credentials.password, user.password)

            if(!isMatched) {
                throw new ApiError('Invalid date', 404)
            }

            // @ts-ignore
            const tokenPair = tokenServices.generateTokenPair({name: user.name, _id: user._id})
            await Token.create({
                _user_id: user._id,
                ...tokenPair
            })

            return tokenPair
    } catch(e) {

            throw new ApiError(e.message, e.status)
        }
    }

    public async refresh(tokenInfo: ITokenPair, jwtPayload: ITokenPayload):Promise<ITokenPair> {
        try{

            const  tokenPair = tokenServices.generateTokenPair({_id: jwtPayload._id, name: jwtPayload.name})

           await Promise.all([Token.create({_user_id: jwtPayload._id, ...tokenPair}),
           Token.deleteOne({refreshToken: tokenInfo.refreshToken})])

            return tokenPair
        } catch(e) {

            throw new ApiError(e.message, e.status)
        }
    }

    public async forgotPassword(user: IUser): Promise<void> {
        try {
            const actionToken = tokenServices.generateActionToken(
                {_id: user._id},
                EActionTokenType.forgot
            );

            await Action.create({
                actionToken,
                tokenType: EActionTokenType.forgot,
                _user_id: user._id
            });

            await emailService.sendMail(user.email, EEmailActions.FORGOT_PASSWORD, {token: actionToken})
            await OldPassword.create({_user_id: user._id, password: user.password});
        }

        catch (e) {

            throw new ApiError(e.message, e.status)
        }
    }

    public async changePassword(
        userId:string,
        oldPassword:string,
        newPassword:string
    ): Promise<void> {
        try{
            const user = await User.findById(userId);

            const isMatched = await passwordService.compare(
                oldPassword,
                user.password
            );
            if (!isMatched) {
                throw new ApiError("Wrong Old password", 400);
            }
            const hashedNewPassword = await passwordService.hash(newPassword);
            await User.updateOne({_id:user._id}, {password: hashedNewPassword})
        }catch (e) {
            throw new ApiError(e.message, e.status)
        }
    }



    public async setForgotPassword(password: string, id:string): Promise<void>{
        try{
            const hashedPassword = await passwordService.hash(password)

            await User.updateOne({_id: id}, {password: hashedPassword})

        }catch (e) {
            throw new ApiError(e.message, e.status);
        }
    }

    public async sendActivateToken(user: IUser): Promise<void> {
        try {
            const actionToken = tokenServices.generateActionToken(
                { _id: user._id },
                EActionTokenType.activate
            );
            await Action.create({
                actionToken,
                tokenType: EActionTokenType.activate,
                _user_id: user._id,
            });

            await emailService.sendMail(user.email, EEmailActions.ACTIVATE, {
                token: actionToken,
            });
        } catch (e) {

            throw new ApiError(e.message, e.status);
        }
    }

    public async activate(userId: string): Promise<void> {
        try {
            await Promise.all([
                User.updateOne(
                    { _id: userId },
                    { $set: { status: EUserStatus.active } }
                ),
                Token.deleteMany({
                    _user_id: userId,
                    tokenType: EActionTokenType.activate,
                }),
            ]);
        } catch (e) {
            throw new ApiError(e.message, e.status);
        }
    }
}


export const authService = new AuthService();