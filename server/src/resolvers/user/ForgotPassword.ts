import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { v4 } from "uuid";
import { FORGOT_PASSWORD_PREFIX } from "../../constants.js";
import { User } from "../../entities/User.js";
import { MyContext } from "../../types.js";
import { sendEmail } from "../../utils/sendEmail.js";

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true; // Don't tell the user for security reasons
    }
    // Generate token for password reset. Set it to expire after 3 days
    const token = v4();
    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      "EX",
      1000 * 60 * 60 * 24 * 3
    );
    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">Reset password</a>`
    );
    return true;
  }
}
