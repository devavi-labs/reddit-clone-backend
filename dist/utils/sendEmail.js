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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (to, text) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtpout.secureserver.net",
        port: 465,
        auth: {
            user: "me@devavi.xyz",
            pass: "Avis.@2002",
        },
    });
    const info = yield transporter.sendMail({
        from: '"LiReddit - Dev. Avi" <me@devavi.xyz>',
        to,
        subject: "Change password - LiReddit",
        html: text,
    });
    console.log("Message sent: %s", info.messageId);
});
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map