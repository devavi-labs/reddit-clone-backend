"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeormConfig = void 0;
const path_1 = __importDefault(require("path"));
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const Updoot_1 = require("./entities/Updoot");
const User_1 = require("./entities/User");
exports.typeormConfig = {
    url: constants_1.DB_URL,
    type: "postgres",
    database: "lireddit",
    username: constants_1.USERNAME,
    password: constants_1.PASSWORD,
    logging: true,
    synchronize: true,
    migrations: [path_1.default.join(__dirname, "./migrations/*")],
    entities: [Post_1.Post, User_1.User, Updoot_1.Updoot],
};
//# sourceMappingURL=typeorm.config.js.map