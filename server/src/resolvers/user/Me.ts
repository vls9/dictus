import { Ctx, Query, Resolver } from "type-graphql";
import { User } from "../../entities/User.js";
import { MyContext } from "../../types.js";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    // If not logged in
    if (!req.session.userId) {
      return null;
    }
    return User.findOne({ where: { id: req.session.userId } });
  }
}
