"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
// @ts-ignore
const nodemailer_1 = __importDefault(require("nodemailer"));
// @ts-ignore
const email_templates_1 = __importDefault(require("email-templates"));
const node_path_1 = __importDefault(require("node:path"));
const email_constans_1 = require("../constants/email.constans");
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: 'marianne30011999@gmail.com',
                pass: 'rnvkxvrwfrwekgwk'
            },
        });
        this.templateParser = new email_templates_1.default({
            views: {
                root: node_path_1.default.join(process.cwd(), "src", "statics"),
                options: {
                    extension: "hbs",
                }
            },
            juice: true,
            juiceResources: {
                webResources: {
                    relativeTo: node_path_1.default.join(process.cwd(), "src", "statics", "css")
                }
            }
        });
    }
    sendMail(email, emailAction, locals = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const templateInfo = email_constans_1.allTemplates[emailAction];
            locals.frontUrl = 'https://www.youtube.com';
            const html = yield this.templateParser.render(templateInfo.templateName, locals);
            return this.transporter.sendMail({
                from: "No reply",
                to: email,
                subject: templateInfo.subject,
                html
            });
        });
    }
}
exports.emailService = new EmailService();
