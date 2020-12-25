export const __prod__ = process.env.NODE_ENV === "production";

if (!__prod__) {
  require("dotenv").config();
}

export const DB_URL = process.env.DATABASE_URL;
export const USERNAME = process.env.DATABASE_USER;
export const PASSWORD = process.env.DATABASE_PASSWORD;
export const PORT = process.env.PORT || 2608;
export const SESS_SECRET = process.env.SESSION_SECRET;
export const FORGOT_PASSWORD_PREFIX = "forgot-password:";

export const COOKIE_NAME = "qid";
