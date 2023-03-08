import { model, Schema} from "mongoose";
import {EGenders} from "../types/user.types";

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
    }
});

export const User = model("user", userSchema)