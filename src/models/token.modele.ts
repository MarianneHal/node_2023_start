import {Schema, model, Types} from "mongoose";
import {User} from "./user.model";

const tokenSchema =new Schema({
    _user_id: {
        type: Types.ObjectId,
        ref: User,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }
})

export const Token = model( "Token", tokenSchema)