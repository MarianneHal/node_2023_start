"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const types_1 = require("../types");
const status_enum_1 = require("../Enums/status.enum");
const bcrypt_1 = __importDefault(require("bcrypt"));
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
        enum: types_1.EGenders,
        required: true
    },
    status: {
        type: String,
        enum: status_enum_1.EUserStatus,
        default: status_enum_1.EUserStatus.inactive
    }
});
userSchema.statics = {
    async createUserWithHashPassword(userObject = {}) {
        const hashPassword = await bcrypt_1.default.hash(userObject.password, 1);
        return this.create({ ...userObject, password: hashPassword });
    }
};
userSchema.methods = {};
exports.User = (0, mongoose_1.model)("user", userSchema);
