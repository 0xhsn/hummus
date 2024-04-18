# notes

## setup
### node + typescript
- `npm init -y`
- `yarn add -D @types/node typescript` - add typescript to node
- `yarn add -D nodemon`

### yarn scripts
- `yarn watch` - recompile typescript code on every ts change
- `yarn dev` - recompile and rerun js code with nodemon
- `yarn create:migration`

### database
- `createdb reddit`

### mikro-orm
- `yarn add @mikro-orm/cli @mikro-orm/core @mikro-orm/migrations @mikro-orm/postgresql pg`
- `npx mikro-orm migration:create`

### express + graphql
- `yarn add experss apollo-server-express graphql type-graphql`
- `yarn add -D @types/express`
- `yarn add graphql@15.3.0`
- `yarn add reflect-metadata`

###  password hashing
- `yarn add argon2` - [reason](https://news.ycombinator.com/item?id=15646743) to choose argon2 over bcrypt

### redis server on macOS
- `brew install redis`
- `redis-server` - run server
- [more](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-mac-os/)
- [connect-redis](https://github.com/tj/connect-redis)
  - `yarn add redis connect-redis express-session`
  - `yarn add -D @types/redis @types/express-session @types/connect-redis @types/express-session`

### apollo (fronend)
- [apollo-client-nextjs](https://github.com/apollographql/apollo-client-nextjs)
- [Apollo React Docs](https://www.apollographql.com/docs/react/data/mutations)

### graphql code gen
- [Docs](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-apollo-next)
- enable `withHooks`

## URLs
- `http://localhost:4000/graphql` - graphql playground
- `postgresql://postgres@127.0.0.1:5432` - postgresql url

## mutaitons
### post: create
```json
mutation($title: String!) {
  createPost(title: $title) {
    id
  }
}
```

```
{
  "title": "hello from graphql"
}
```

### user: register
```json
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

### user: login
```json
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

### me query
```json
{
  me {
    id
    username
  }
}
```

## sessions explained
```js
req.session.userId = user.id;
```

`{ userId: 1 }` -> send that to redis


1. `session:qwerty` -> `{ userId: 1 }`

2. `express-session` will set a cookie on my browser (`qwerty`)

3. when user makes a request: `qwerty` -> sent to the server

4. server decrypts the cookie: `qwerty` -> `session:qwerty`

5. server makes a request to redis: `session:qwerty` -> `{ userId: 1 }`

```js
req.session = { userId: 1 }
```

## TODO: refactor
- SSR
- Global Error Handling
  - Read [this](https://www.apollographql.com/docs/apollo-server/data/errors/)
- GraphQL Fragments
  - Regular User
  - Regular Error
- Jest
- Bun.js
- GitHub Actions
  - Linting
  - Secrets
- Better error messages for validation
  - Email
  - Password
  - Username
- Deployment
  - neon?
  - vercel?
- https://kysely.dev/ ??
