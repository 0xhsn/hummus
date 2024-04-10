import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export class Post {
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
  @Property({ type: "text" })
  title!: string;
}
