import {IUser} from "./user.types";

export interface ITokenPair{
    accessToken: string,
    refreshToken: string
}

export interface ITokenPayload{
    name: string,
    _id: string
}

export type IActionTokenPayload = Pick<IUser, "_id">