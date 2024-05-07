"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const constants_1 = require("./constants");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const express_session_1 = __importDefault(require("express-session"));
const ioredis_1 = __importDefault(require("ioredis"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const appDataSource_1 = require("./utils/appDataSource");
const createUpdootLoader_1 = require("./utils/createUpdootLoader");
const main = async () => {
    appDataSource_1.appDataSource
        .initialize()
        .then(() => {
    })
        .catch((error) => console.log(error));
    const app = (0, express_1.default)();
    const redis = new ioredis_1.default(process.env.REDIS_URL || "redis://127.0.0.1:6379");
    let redisStore = new connect_redis_1.default({
        client: redis,
    });
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: redisStore,
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            domain: process.env.COOKIE_DOMAIN,
        },
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver, post_1.PostResolver, user_1.UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ req, res, redis, updootLoader: (0, createUpdootLoader_1.createUpdootLoader)() }),
    });
    app.use((0, cors_1.default)({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }));
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });
    app.listen(parseInt(process.env.PORT), () => {
        console.log("server started on localhost:4000");
    });
};
main();
//# sourceMappingURL=index.js.map