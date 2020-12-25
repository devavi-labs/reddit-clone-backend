"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeormConfig = void 0;
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
exports.typeormConfig = {
    type: "postgres",
    database: "lireddit",
    username: constants_1.USERNAME,
    password: constants_1.PASSWORD,
    logging: true,
    synchronize: true,
    entities: [Post_1.Post, User_1.User],
};
//# sourceMappingURL=typeorm-config.js.map