import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";
import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { MyContext } from "src/types";

@Resolver(Updoot)
export class UpdootResolver {
  @FieldResolver(() => User)
  user(@Root() updoot: Updoot, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(updoot.userId);
  }
}
