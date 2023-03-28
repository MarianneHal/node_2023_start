import { model, Schema, Model} from "mongoose";

import {EGenders, IUser} from "../types";
import {EUserStatus} from "../Enums/status.enum";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Is required"],
        trim: true,
        lowerCase: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: EGenders,
        required: true
    },
    status: {
        type:String,
        enum: EUserStatus,
        default: EUserStatus.inactive

    },
    avatar: {
        type: String,
        required: false,
    }
});

interface IUserMethods {
    comparePassword():void
}

interface IUserModel extends Model<IUser, object, IUserMethods>{
    createUserWithHashPassword(userObject: object): Promise<void>
}

userSchema.statics = {
   async createUserWithHashPassword(userObject={}): Promise<void> {
        const hashPassword = await bcrypt.hash(userObject.password, 1);
        return this.create({...userObject, password: hashPassword});
    }
}

userSchema.methods = {

}

export const User = model<IUser, IUserModel>("user", userSchema)