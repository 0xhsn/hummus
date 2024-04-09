import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up(); 

  const app = express();

  // app.get('/', (_, res) => {
  //   res.send('sup');
  // })

  const apolloServer =  new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('server started on localhost:4000')
  })
  // const post = orm.em.create(Post, { title: "sup" });
  // await orm.em.persistAndFlush(post);
};

main();
