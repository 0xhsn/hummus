import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { DataSource } from "typeorm";

export const appDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "macdoos",
  password: "macdoos",
  database: "reddit",
  entities: [Post, User],
  synchronize: true,
  logging: true,
});