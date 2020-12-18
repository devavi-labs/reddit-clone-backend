export const __prod__ = process.env.NODE_ENV === "production";

if (!__prod__) {
  require("dotenv").config();
}

export const __user__ = process.env.DB_USER;
export const __password__ = process.env.DB_PASSWORD;
export const __port__ = process.env.PORT || 2608;
