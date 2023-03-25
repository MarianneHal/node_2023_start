import {Types} from "mongoose";

export enum EGenders {
    male = 'male',
    female = 'female',
    mixed = 'mixed'
}

export interface IUser {
    _id:Types.ObjectId
    name: string,
    email: string,
    password: string,
    gender: string,
    status:string
}

export interface ICommonResponse<T> {
    message: string,
    data: T
}