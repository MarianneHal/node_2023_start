import * as Joi from 'Joi';

import {regexConstants} from "../constants/regex.constants";
import {EGenders} from "../types";

export class UserValidator{
    private static firstName = Joi.string().min(2).max(50).trim();
    private static email = Joi.string().regex(regexConstants.EMAIL).max(50).trim().lowercase();
    private static password = Joi.string().regex(regexConstants.PASSWORD);
    private static gender = Joi.valid(...Object.values(EGenders));

    static creatUser = Joi.object({
        name: this.firstName.required(),
        email: this.email.required(),
        password: this.password.required(),
        gender: this.gender.required()
    })

    static updateUser = Joi.object({
        name: this.firstName,
        gender: this.gender
    })

    static emailValidator = Joi.object({
        email: this.email.required(),
    });


    static loginUser = Joi.object({
        email: this.email.required(),
        password: this.password.required()
    })
    static changeUserPassword = Joi.object({
        oldPassword: this.password.required(),
        newPassword: this.password.required(),

    });
}