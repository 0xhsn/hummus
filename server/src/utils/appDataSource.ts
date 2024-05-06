import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { DataSource } from "typeorm";
import path from 'path';
import { Updoot } from "../entities/Updoot";
import "dotenv-safe/config";

export const appDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  migrations: [
    path.join(__dirname, '../migrations/*')
  ],
  entities: [Post, User, Updoot],
  // synchronize: true,
  logging: true,
});
