import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "timestamp" })
  createdAt? = new Date();

  @Field(() => String)
  @Property({ type: "timestamp", onUpdate: () => new Date() })
  updatedAt? = new Date();

  @Field(() => String)
  @Property({ type: "text", unique: true })
  username!: string;

  @Field(() => String, { nullable: true }) // nullable: true makes it optional in GraphQL
  @Property({ type: "text", unique: true, nullable: true })
  email?: string;

  @Property({ type: "text" })
  password!: string;
}
