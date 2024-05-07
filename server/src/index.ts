import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import Redis from "ioredis";
import RedisStore from "connect-redis";
import cors from "cors";
import { appDataSource } from "./utils/appDataSource";
import { createUpdootLoader } from "./utils/createUpdootLoader";

const main = async () => {

  appDataSource
    .initialize()
    .then(() => {
      // here you can start to work with your database
    })
    .catch((error) => console.log(error));

  const app = express();

  const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

  let redisStore = new (RedisStore as any)({
    client: redis,
  });

  app.use(
    session({
      name: COOKIE_NAME,
      store: redisStore,
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        domain: process.env.COOKIE_DOMAIN,
      },
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis, updootLoader: createUpdootLoader() }),
  });

  // app.set("trust proxy", 1);
  
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(parseInt(process.env.PORT), () => {
    console.log("server started on localhost:4000");
  });
};

main();
