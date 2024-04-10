import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";
import { Migrator } from "@mikro-orm/migrations";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    glob: "!(*.d).{js,ts}",
  },
  entities: [Post, User],
  dbName: "reddit",
  driver: PostgreSqlDriver,
  debug: !__prod__,
  extensions: [Migrator],
  allowGlobalContext: true,
} as Parameters<typeof MikroORM.init>[0];
