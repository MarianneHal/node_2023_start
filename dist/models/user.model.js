"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_types_1 = require("../types/user.types");
const status_enum_1 = require("../Enums/status.enum");
const userSchema = new mongoose_1.Schema({
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
        enum: user_types_1.EGenders,
        required: true
    },
    status: {
        type: String,
        enum: status_enum_1.EUserStatus,
        default: status_enum_1.EUserStatus.inactive
    }
});
exports.User = (0, mongoose_1.model)("user", userSchema);
