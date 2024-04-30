import {
  Query,
  Resolver,
  Arg,
  Int,
  Mutation,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
  ObjectType,
} from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";
import { appDataSource } from "../utils/appDataSource";

@InputType()
class PostInput {
  @Field()
  title: string;

  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: boolean;
}

@Resolver()
export class PostResolver {
  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const qb = appDataSource
      .getRepository(Post)
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.creator", "u") // Ensure 'u' maps to the alias of the joined table
      .orderBy("p.createdAt", "DESC") // Use 'p.createdAt' to clarify which table the column belongs to
      .take(realLimit + 1);

    if (cursor) {
      qb.where("p.createdAt < :cursor", { cursor: new Date(parseInt(cursor)) });
    }

    const posts = await qb.getMany();

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimit + 1,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number): Promise<Post | null> {
    return Post.findOne({ where: { id } });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      return null;
    }
    if (typeof title !== undefined) {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id", () => Int) id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
