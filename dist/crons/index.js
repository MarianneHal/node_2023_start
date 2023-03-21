"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronRunner = void 0;
const remove_old_token_1 = require("./remove.old.token");
const cronRunner = () => {
    remove_old_token_1.removeOldToken.start();
};
exports.cronRunner = cronRunner;
