import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  ObjectType,
  Field,
  Query,
} from "type-graphql";
import argon from "argon2";

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    //@ts-ignore
    if (!req.session.userId) {
      return null;
    }
    //@ts-ignore
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("name") name: string,
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (username?.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Username must be atleast 3 characters long.",
          },
        ],
      };
    }

    if (password?.length <= 5) {
      return {
        errors: [
          {
            field: "password",
            message: "Password must be atleast 6 characters long.",
          },
        ],
      };
    }

    const hashedPassword = await argon.hash(password);
    const user = em.create(User, { name, username, password: hashedPassword });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === "23505" || err.detail.includes("already exists")) {
        return {
          errors: [
            {
              field: "username",
              message: "The username already exists.",
            },
          ],
        };
      }
    }

    //@ts-ignore
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ) {
    const user = await em.findOne(User, { username });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "That username does not exist.",
          },
        ],
      };
    }

    const valid = await argon.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password.",
          },
        ],
      };
    }

    //@ts-ignore
    req.session.userId = user.id;

    return { user };
  }
}
