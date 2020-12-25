import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { PostOptions } from "./PostOptions";

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field(() => Boolean)
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post) {
    const snippet = post.text.slice(0, 50).trimEnd();
    if (post.text.length > 50) {
      return snippet + "...";
    }
    return snippet;
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() post: Post,
    @Ctx() { req, updootLoader }: MyContext
  ) {
    const updoots = await updootLoader.load({ postId: post.id });
    const updoot = updoots?.find(
      //@ts-ignore
      (updoot) => updoot.userId === req.session.userId
    );
    return updoot?.value;
  }

  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.creatorId);
  }

  @FieldResolver(() => User)
  updoots(@Root() post: Post, @Ctx() { updootLoader }: MyContext) {
    return updootLoader.load({ postId: post.id });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;

    //@ts-ignore
    const { userId }: { userId: number } = req.session;

    const updoot = await Updoot.findOne({ where: { postId, userId } });
    try {
      if (updoot && updoot.value !== realValue) {
        await getConnection().transaction(async (tm) => {
          await tm.query(
            `
          update updoot 
          set value = $1
          where "postId" = $2 and "userId" = $3
        `,
            [realValue, postId, userId]
          );
          await tm.query(
            `
          update post
          set points = points + $1
          where id = $2;
        `,
            [realValue * 2, postId]
          );
        });
      } else if (!updoot) {
        await getConnection().transaction(async (tm) => {
          await tm.query(
            `
          insert into updoot ("userId", "postId", "value")
          values ($1, $2, $3);
        `,
            [userId, postId, realValue]
          );
          await tm.query(
            `
          update post
          set points = points + $1
          where id = $2;
        `,
            [realValue, postId]
          );
        });
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  // CREATE
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("options") options: PostOptions,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    try {
      await Post.create({
        ...options,
        // @ts-ignore
        creatorId: req.session.userId,
      }).save();
      return true;
    } catch (e) {
      return false;
    }
  }

  //READ
  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const posts = await Post.find({
      take: realLimitPlusOne,
      skip: offset || 0,
      order: { createdAt: "DESC" },
    });

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return await Post.findOne(id);
  }

  // UPDATE
  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title") title: string,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    try {
      const { raw: posts } = await getConnection()
        .createQueryBuilder()
        .update(Post)
        .set({ title, text })
        .where('id = :id and "creatorId" = :creatorId', {
          id,
          //@ts-ignore
          creatorId: req.session.userId,
        })
        .returning("*")
        .execute();
      return posts[0] as any;
    } catch (e) {
      return null;
    }
  }

  //DELETE
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePostById(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    try {
      //@ts-ignore
      await Post.delete({ id, creatorId: req.session.userId });
      return true;
    } catch (e) {
      throw e;
    }
  }
}
