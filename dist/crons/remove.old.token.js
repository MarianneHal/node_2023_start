"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOldToken = void 0;
const cron_1 = require("cron");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const token_modele_1 = require("../models/token.modele");
dayjs_1.default.extend(utc_1.default);
const tokenRemover = async () => {
    const previousMonth = (0, dayjs_1.default)().utc().subtract(1, "month");
    await token_modele_1.Token.deleteMany({ createdAt: { $lte: previousMonth } });
};
exports.removeOldToken = new cron_1.CronJob("* * * * * *", tokenRemover);
