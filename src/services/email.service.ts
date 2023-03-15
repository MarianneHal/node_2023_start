// @ts-ignore
import nodemailer, {Transporter} from "nodemailer";
// @ts-ignore
import EmailTemplates from "email-templates";
import path from "node:path";
import {allTemplates} from "../constants/email.constans";
import {EEmailActions} from "../Enums/email.enum";


class EmailService {
    private transporter: Transporter;
    private templateParser;


    constructor() {
        this.transporter = nodemailer.createTransport({
            service:"gmail",
            auth: {
                user: '',
                pass: ''
            },
        });
        this.templateParser = new EmailTemplates({
            views:{
                root: path.join(process.cwd(),"src", "statics"),
                options: {
                    extension: "hbs",
        }
            },
            juice: true,
                juiceResources: {
                webRecources:{
                    relativeTo: path.join(process.cwd(), "src", "statics", "css")
                }
        }
        })
    }

    public async sendMail(email:string, emailAction: EEmailActions) {
        const templateInfo = allTemplates[emailAction];

        const html = await this.templateParser.render(templateInfo.templateName);

        return this.transporter.sendMail({
            from: "No reply",
            to: email,
            subject:templateInfo.subject,
            html
        })
    }
}


export const emailService = new EmailService();

