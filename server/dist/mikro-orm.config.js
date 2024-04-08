"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgresql_1 = require("@mikro-orm/postgresql");
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const path_1 = __importDefault(require("path"));
const migrations_1 = require("@mikro-orm/migrations");
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        glob: "!(*.d).{js,ts}",
    },
    entities: [Post_1.Post],
    dbName: "reddit",
    driver: postgresql_1.PostgreSqlDriver,
    debug: !constants_1.__prod__,
    extensions: [migrations_1.Migrator],
    allowGlobalContext: true,
};
//# sourceMappingURL=mikro-orm.config.js.map