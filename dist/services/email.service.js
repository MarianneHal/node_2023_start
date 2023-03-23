"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
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
    async sendMail(email, emailAction, locals = {}) {
        const templateInfo = email_constans_1.allTemplates[emailAction];
        locals.frontUrl = 'https://www.youtube.com';
        const html = await this.templateParser.render(templateInfo.templateName, locals);
        return this.transporter.sendMail({
            from: "No reply",
            to: email,
            subject: templateInfo.subject,
            html
        });
    }
}
exports.emailService = new EmailService();
