"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_NAME = exports.FORGOT_PASSWORD_PREFIX = exports.SESS_SECRET = exports.PORT = exports.PASSWORD = exports.USERNAME = exports.DB_URL = exports.ORIGIN = exports.__prod__ = void 0;
exports.__prod__ = process.env.NODE_ENV === "production";
if (!exports.__prod__) {
    require("dotenv").config();
}
exports.ORIGIN = process.env.ORIGIN;
exports.DB_URL = process.env.DATABASE_URL;
exports.USERNAME = process.env.DATABASE_USER;
exports.PASSWORD = process.env.DATABASE_PASSWORD;
exports.PORT = process.env.PORT || 2608;
exports.SESS_SECRET = process.env.SESSION_SECRET;
exports.FORGOT_PASSWORD_PREFIX = "forgot-password:";
exports.COOKIE_NAME = "qid";
//# sourceMappingURL=constants.js.map