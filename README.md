# notes

## setup
### node + typescript
- `npm init -y`
- `yarn add -D @types/node typescript` - add typescript to node
- `yarn add -D nodemon`
- `yarn watch` - recompile typescript code on every ts change
- `yarn dev` - recompile and rerun js code with nodemon

## database setup
- `createdb reddit`

### mikro-orm
- `yarn add @mikro-orm/cli @mikro-orm/core @mikro-orm/migrations @mikro-orm/postgresql pg`
- `npx mikro-orm migration:create`

### express + graphql
- `yarn add experss apollo-server-express graphql type-graphql`
- `yarn add -D @types/express`
- `yarn add graphql@15.3.0`
- `yarn add reflect-metadata`

## URLs
- `http://localhost:4000/graphql` graphql playground
- `postgresql://postgres@127.0.0.1:5432` postgresql url