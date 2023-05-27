import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Meaning } from "../../entities/Meaning.js";
import { isAuth } from "../../middleware/isAuth.js";
import { FieldError, MyContext } from "../../types.js";
import { checkImageLink } from "../../utils/checkImageLink.js";
import { createOneEntry } from "../../utils/createOneEntry.js";
import { generateErrors } from "../../utils/generateErrors.js";

@InputType()
class CreateOneMeaningInput {
  @Field(() => String)
  headword: string = "";

  @Field(() => String)
  definition: string = "";

  @Field(() => String)
  usage: string = "";

  @Field(() => String)
  imageLink: string = "";

  @Field(() => String)
  notes: string = "";
}

@ObjectType()
class CreateOneMeaningResponse {
  @Field(() => Meaning, { nullable: true })
  meaning?: Meaning;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@Resolver()
export class CreateOneMeaningResolver {
  @Mutation(() => CreateOneMeaningResponse)
  @UseMiddleware(isAuth)
  async createOneMeaning(
    @Arg("options") options: CreateOneMeaningInput,
    @Ctx() { req }: MyContext
  ): Promise<CreateOneMeaningResponse> {
    // Check if image link exists
    if (options.imageLink) {
      const isImageLink = await checkImageLink(options.imageLink);
      if (!isImageLink) {
        return {
          errors: [
            {
              field: "imageLink",
              message: "Image at image link doesn't exist",
            },
          ],
        };
      }
    }

    const { headword, ...rest } = options;
    const fields = Object.keys(options);

    // Insert or select entry
    const createOneEntryResponse = await createOneEntry({ headword });
    if (createOneEntryResponse.error || !createOneEntryResponse.entry) {
      console.error(createOneEntryResponse.error?.message);
      return {
        errors: [
          {
            field: "headword",
            message:
              createOneEntryResponse.error?.message || "Failed to insert entry",
          },
        ],
      };
    }

    // Insert meaning
    let result;
    try {
      result = await Meaning.create({
        ...rest,
        userId: req.session.userId,
        entries: [createOneEntryResponse.entry],
      }).save();
    } catch (err) {
      console.error(err);
      return {
        errors: generateErrors(fields, "Failed to insert meaning"),
      };
    }

    const response = { meaning: result };
    return response;
  }
}
