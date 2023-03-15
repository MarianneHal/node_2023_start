import {EEmailActions} from "../Enums/email.enum";

export const allTemplates = {
    [EEmailActions.WELCOME]: {
        subject:"WELCOME",
        templateName: "register"
    },
    [EEmailActions.FORGOT_PASSWORD]: {
        subject:"WE CONTROL YOUR PASSWORD",
        templateName: "forgotPassword"
    }
}