import { Ctx, Mutation, Resolver } from "type-graphql";
import { COOKIE_NAME } from "../../constants.js";
import { MyContext } from "../../types.js";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    // Resolver will wait for Promise and callback to finish
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        // If error during logout
        if (err) {
          console.error(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
