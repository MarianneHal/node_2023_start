"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTemplates = void 0;
const email_enum_1 = require("../Enums/email.enum");
exports.allTemplates = {
    [email_enum_1.EEmailActions.WELCOME]: {
        subject: "WELCOME",
        templateName: "register"
    },
    [email_enum_1.EEmailActions.FORGOT_PASSWORD]: {
        subject: "WE CONTROL YOUR PASSWORD",
        templateName: "forgotPassword"
    },
    [email_enum_1.EEmailActions.ACTIVATE]: {
        subject: "Activate!",
        templateName: "activate",
    }
};
