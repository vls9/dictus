import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { User } from "../../entities/User.js";
import { FieldError, MyContext } from "../../types.js";
import { validateRegister } from "../../utils/validateRegister.js";
import argon2 from "argon2";

@InputType()
export class RegisterInput {
  @Field()
  email!: string;

  @Field()
  username!: string;

  @Field()
  password!: string;
}

@ObjectType()
class RegisterResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class RegisterResolver {
  @Mutation(() => RegisterResponse)
  async register(
    @Arg("options") options: RegisterInput,
    @Ctx() { req }: MyContext
  ): Promise<RegisterResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors: errors }; // Alt.: { errors }
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      const result = await User.create({
        email: options.email,
        username: options.username,
        password: hashedPassword,
      }).save();
      user = result as any;
    } catch (err) {
      // Alt.: err.detail.includes("already exists") || err.code === "23505"
      if ((err as any).code === "23505") {
        // Duplicate username error
        return {
          errors: [
            {
              field: "email",
              message: "Email or username already exists",
            },
            {
              field: "username",
              message: "Email or username already exists",
            },
          ],
        };
      }
      console.error((err as any).message);
    }

    // Log user in. This will set cookie on the user, keeping them logged in
    req.session.userId = user.id;
    return { user };
  }
}
