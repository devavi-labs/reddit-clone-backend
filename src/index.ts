import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import session from "express-session";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, ORIGIN, PORT, SESS_SECRET, __prod__ } from "./constants";
import { PostResolver } from "./resolvers/post";
import { UpdootResolver } from "./resolvers/updoot";
import { UserResolver } from "./resolvers/user";
import { typeormConfig } from "./typeorm.config";
import { MyContext } from "./types";
import { createUpdootLoader } from "./utils/createUpdootLoader";
import { createUserLoader } from "./utils/createUserLoader";

const main = async () => {
  await createConnection(typeormConfig);
  const app = express();

  app.use(
    session({
      name: COOKIE_NAME,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__, // cookie only works in https
      },
      secret: SESS_SECRET!,
      resave: false,
    })
  );

  app.use(
    cors({
      origin: ORIGIN || "*",
      credentials: true,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver, UpdootResolver],
      validate: false,
    }),
    context: ({ req, res }: { req: any; res: any }): MyContext => ({
      req,
      res,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
};

main().catch((err) => {
  console.log(err);
});
