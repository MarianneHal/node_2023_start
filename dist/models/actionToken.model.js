"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const mongoose_1 = require("mongoose");
const user_model_1 = require("./user.model");
const action_enum_1 = require("../Enums/action.enum");
const actionTokenShema = new mongoose_1.Schema({
    _user_id: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: user_model_1.User
    },
    actionToken: {
        type: String,
        required: true
    },
    tokenType: {
        type: String,
        enum: action_enum_1.EActionTokenType
    }
}, {
    versionKey: false,
    timestamps: true
});
exports.Action = (0, mongoose_1.model)("Action", actionTokenShema);
