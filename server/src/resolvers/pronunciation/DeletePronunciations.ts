import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Pronunciation } from "../../entities/Pronunciation.js";
import { isAuth } from "../../middleware/isAuth.js";
import { MyContext, NoFieldError } from "../../types.js";

@ObjectType()
class DeletePronunciationResponse {
  @Field(() => Boolean)
  isDeletionComplete!: boolean;

  @Field(() => NoFieldError, { nullable: true })
  error?: NoFieldError;
}

@Resolver()
export class DeletePronunciationResolver {
  @Mutation(() => DeletePronunciationResponse)
  @UseMiddleware(isAuth)
  async deletePronunciation(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<DeletePronunciationResponse> {
    try {
      await Pronunciation.delete({ id, userId: req.session.userId });
    } catch (err: any) {
      console.error(err);
      return {
        isDeletionComplete: false,
        error: {
          message: err.message,
        },
      };
    }
    return {
      isDeletionComplete: true,
    };
  }
}
