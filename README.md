**hummus** is an implementation of Ben Awad's 13-hour full-stack tutorial. i changed the stack a bit, using the *latest* technologies used in today's apps (listed below). this document is mostly for me to revisit.

## Stack
- Next.js / React - TypeScript
- Vercel
- GraphQL
- Apollo
- shadcn/ui
- TypeORM
- Neon - PostgresSQL
- Upstash - Redis

## Setup

### Node + TypeScript
- `npm init -y`
- `yarn add -D @types/node typescript` - Add TypeScript to Node
- `yarn add -D nodemon`

### Yarn Scripts
- `yarn watch` - Recompile TypeScript code on every `.ts` change
- `yarn dev` - Recompile and rerun JS code with Nodemon
- `yarn create:migration` - Create migration scripts

### Database
- `createdb reddit` - Create a PostgreSQL database named `reddit`

### Mikro-ORM
- `yarn add @mikro-orm/cli @mikro-orm/core @mikro-orm/migrations @mikro-orm/postgresql pg`
- `npx mikro-orm migration:create` - Create a new Mikro-ORM migration

### Express + GraphQL
- `yarn add express apollo-server-express graphql type-graphql`
- `yarn add -D @types/express`
- `yarn add graphql@15.3.0`
- `yarn add reflect-metadata`

### Password Hashing
- `yarn add argon2` - [Reason](https://news.ycombinator.com/item?id=15646743) to choose Argon2 over bcrypt

### Redis Server on macOS
- `brew install redis`
- `redis-server` - Run Redis server
- [More](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-mac-os/)
- [connect-redis](https://github.com/tj/connect-redis)
  - `yarn add redis connect-redis express-session`
  - `yarn add -D @types/redis @types/express-session @types/connect-redis @types/express-session`

### Apollo (Frontend)
- [Apollo Client with Next.js](https://github.com/apollographql/apollo-client-nextjs)
- [Apollo React Docs](https://www.apollographql.com/docs/react/data/mutations)

### GraphQL Code Generation
- [Docs](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-apollo-next)
- Enable `withHooks`

## URLs
- `http://localhost:4000/graphql` - GraphQL playground
- `postgresql://postgres@127.0.0.1:5432` - PostgreSQL URL

## Mutations

### Post: Create
```graphql
mutation($title: String!) {
  createPost(title: $title) {
    id
  }
}
```
```json
{
  "title": "hello from graphql"
}
```

### User: Register
```graphql
mutation($options: UsernamePasswordInput!) {
  register(options: $options) {
    errors {
      field
      message
    }
    user {
      username
    }
  }
}
```
```json
{
  "options": {
    "username": "macdoos",
    "password": "secret"
  }
}
```

### User: Login
```graphql
mutation($options: UsernamePasswordInput!) {
  login(options: $options) {
    errors {
      field
      message
    }
    user {
      username
    }
  }
}
```

### Me Query
```graphql
{
  me {
    id
    username
  }
}
```

## Sessions Explained
1. `req.session.userId = user.id;`
   - `{ userId: 1 }` -> Send that to Redis
2. `session:qwerty` -> `{ userId: 1 }`
3. `express-session` will set a cookie on the browser (`qwerty`)
4. When user makes a request: `qwerty` -> Sent to the server
5. Server decrypts the cookie: `qwerty` -> `session:qwerty`
6. Server makes a request to Redis: `session:qwerty` -> `{ userId: 1 }`
7. `req.session = { userId: 1 }`

## TODO: Refactor
- ~SSR~
- ~Bun.js~
- ~GitHub Actions~
  - ~Linting~
  - ~Secrets~
- ~Deployment~
  - ~Neon~
  - ~Vercel~
- ~Invalidate Queries~
  - ~On voting~
  - ~On posting~
- Email: Resend + React Email
  - Change the domain in the change password to make it work
- Global Error Handling
  - Read [this](https://www.apollographql.com/docs/apollo-server/data/errors/)
- Jest
- Better Error Messages for Validation - Think about auth in general
  - Email
  - Password
  - Username
- [Kysely](https://kysely.dev/) or Drizzle Maybe?
- Support App
  - A tool to make commands directly on production
  - SQL runner
- Column Names to Snake Case (`creator_id`)
- Move into Likes Model Instead of Points
- Unify Icons
- PostHog
