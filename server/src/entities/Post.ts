import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Post {
  @PrimaryKey()
  id!: number;

  @Property({ type: "timestamp" })
  createdAt? = new Date();

  @Property({ type: "timestamp", onUpdate: () => new Date() })
  updatedAt? = new Date();

  @Property({ type: "text" })
  title!: string;
}
