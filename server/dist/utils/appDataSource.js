"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appDataSource = void 0;
const Post_1 = require("../entities/Post");
const User_1 = require("../entities/User");
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const Updoot_1 = require("../entities/Updoot");
exports.appDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "macdoos",
    password: "macdoos",
    database: "reddit",
    migrations: [
        path_1.default.join(__dirname, '../migrations/*')
    ],
    entities: [Post_1.Post, User_1.User, Updoot_1.Updoot],
    synchronize: true,
    logging: true,
});
//# sourceMappingURL=appDataSource.js.map