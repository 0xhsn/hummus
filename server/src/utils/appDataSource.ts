import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { DataSource } from "typeorm";
import path from 'path';

export const appDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "macdoos",
  password: "macdoos",
  database: "reddit",
  migrations: [
    path.join(__dirname, '../migrations/*')
  ],
  entities: [Post, User],
  synchronize: true,
  logging: true,
});
