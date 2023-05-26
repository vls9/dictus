import argon2 from "argon2";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType } from "type-graphql";
import { FORGOT_PASSWORD_PREFIX } from "../../constants.js";
import { User } from "../../entities/User.js";
import { MyContext } from "../../types.js";
import { FieldError } from "../../utils/errorTypes.js";

@InputType()
class ChangePasswordInput {
  @Field()
  token!: string;

  @Field()
  newPassword!: string;
}

@ObjectType()
class ChangePasswordResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

export class ChangePasswordResolver {
  @Mutation(() => ChangePasswordResponse)
  async changePassword(
    @Arg("options") options: ChangePasswordInput,
    @Ctx() { redis, req }: MyContext
  ): Promise<ChangePasswordResponse> {
    // Validate password
    if (options.newPassword.length < 8) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "Length must be at least 8",
          },
        ],
      };
    }

    const key = FORGOT_PASSWORD_PREFIX + options.token;
    // Check token
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            // This will also be sent if user tampers with token
            message: "Token expired",
          },
        ],
      };
    }

    // If password change successful
    const userIdNum = parseInt(userId);
    const user = await User.findOne({ where: { id: userIdNum } });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "User not found",
          },
        ],
      };
    }

    await User.update(
      { id: userIdNum },
      { password: await argon2.hash(options.newPassword) }
    );
    // Delete token
    await redis.del(key);

    // Optional: Log user in after password change
    req.session.userId = user.id;

    return { user };
  }
}
