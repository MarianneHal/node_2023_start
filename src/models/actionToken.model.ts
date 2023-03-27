import {model, Schema, Types} from 'mongoose';

import {User} from "./user.model";
import {EActionTokenType} from "../Enums/action.enum";


const actionTokenSchema = new Schema(
    {
        _user_id: {
            type: Types.ObjectId,
            required: true,
            ref: User
        },
        actionToken: {
            type: String,
            required: true
        },
        tokenType: {
            type: String,
            enum: EActionTokenType
        }
    },
    {
         versionKey: false,
             timestamps: true
    }
)

export const Action = model("Action", actionTokenSchema);