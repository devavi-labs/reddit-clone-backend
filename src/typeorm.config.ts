import path from "path";
import { createConnection } from "typeorm";
import { DB_URL, PASSWORD, USERNAME } from "./constants";
import { Post } from "./entities/Post";
import { Updoot } from "./entities/Updoot";
import { User } from "./entities/User";
import { Cache } from "./entities/Cache";

export const typeormConfig = {
  url: DB_URL,
  type: "postgres",
  database: "lireddit",
  username: USERNAME as string,
  password: PASSWORD as string,
  logging: true,
  synchronize: true,
  migrations: [path.join(__dirname, "./migrations/*")],
  entities: [Post, User, Updoot, Cache],
} as Parameters<typeof createConnection>[0];
