import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import Redis from 'ioredis';
import RedisStore from "connect-redis";
import cors from 'cors';

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up(); 

  const app = express();

  const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

  let redisStore = new (RedisStore as any)({
    client: redis,
  })

  app.use(
    session({
      name: COOKIE_NAME,
      store: redisStore,
      resave: false, 
      saveUninitialized: false,
      secret: "keyboard cat",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: __prod__,
        sameSite: 'lax',
      }
    }),
  )

  const apolloServer =  new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res, redis }),
  });

  app.use(cors({
    origin: 'http://localhost:3000', // Adjust this to match your client URL
    credentials: true
  }));

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log('server started on localhost:4000')
  })
};

main();
