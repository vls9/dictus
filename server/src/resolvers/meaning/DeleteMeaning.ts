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
import { Meaning } from "../../entities/Meaning.js";
import { isAuth } from "../../middleware/isAuth.js";
import { MyContext } from "../../types.js";
import { NoFieldError } from "../../utils/errorTypes.js";

@ObjectType()
class DeleteMeaningResponse {
  @Field(() => Boolean)
  isDeletionComplete!: boolean;

  @Field(() => NoFieldError, { nullable: true })
  error?: NoFieldError;
}

@Resolver()
export class DeleteMeaningResolver {
  @Mutation(() => DeleteMeaningResponse)
  @UseMiddleware(isAuth)
  async deleteMeaning(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<DeleteMeaningResponse> {
    try {
      await Meaning.delete({ id, userId: req.session.userId });
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
