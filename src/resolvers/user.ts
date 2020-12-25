import argon from "argon2";
import { User } from "../entities/User";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { v4 } from "uuid";
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import { MyContext } from "../types";
import { sendEmail } from "../utils/sendEmail";
import { validateRegister } from "../utils/validateRegister";
import { CredentialOptions } from "./CredentialOptions";
import { Cache } from "../entities/Cache";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    //@ts-ignore
    if (req.session.userId === user.id) {
      return user.email;
    }

    return "";
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword?.length <= 5) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "Password must be atleast 6 characters long.",
          },
        ],
      };
    }

    const key = FORGOT_PASSWORD_PREFIX + token;

    const cache = await Cache.findOne(key);
    const id = parseInt(cache?.value!);

    if (!cache) {
      return {
        errors: [
          {
            field: "token",
            message: "Token expired.",
          },
        ],
      };
    }

    const user = await User.findOne(id);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "User no longer exists.",
          },
        ],
      };
    }

    const hashedPassword = await argon.hash(newPassword);

    user.password = hashedPassword;
    await User.update({ id }, { password: hashedPassword });

    //log in user after changing password
    //@ts-ignore
    req.session.userId = user.id;

    await Cache.delete(key);

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // the email is not in the db
      return true;
    }

    const token = v4();
    const key = FORGOT_PASSWORD_PREFIX + token;

    await Cache.insert({
      key,
      value: user.id.toString(),
    });

    const text = `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`;
    await sendEmail(email, text);

    return true;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    //@ts-ignore
    if (!req.session.userId) {
      return null;
    }
    //@ts-ignore
    return User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => CredentialOptions) options: CredentialOptions,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);

    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon.hash(options.password);
    const user = await User.create({
      name: options.name,
      email: options.email,
      username: options.username,
      password: hashedPassword,
    });

    try {
      await user.save();
    } catch (err) {
      if (err.detail.includes("already exists")) {
        if (err.detail.includes("username")) {
          return {
            errors: [
              {
                field: "username",
                message: "The username already exists.",
              },
            ],
          };
        } else if (err.detail.includes("email")) {
          return {
            errors: [
              {
                field: "email",
                message: "The email already exists.",
              },
            ],
          };
        }
      }
    }

    //@ts-ignore
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ) {
    const user = await User.findOne({
      where: usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail },
    });

    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "The user does not exist.",
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

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        if (err) {
          resolve(false);
          return;
        }

        res.clearCookie(COOKIE_NAME);
        resolve(true);
      })
    );
  }
}
