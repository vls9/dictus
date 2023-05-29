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
import { Pronunciation } from "../../entities/Pronunciation.js";
import { isAuth } from "../../middleware/isAuth.js";
import { FieldError, MyContext } from "../../types.js";
import { createOneEntry } from "../../utils/createOneEntry.js";
import { generateErrors } from "../../utils/generateErrors.js";

@InputType()
class CreateOnePronunciationInput {
  @Field(() => String)
  headword: string = "";

  @Field(() => String)
  transcription: string = "";

  @Field(() => String)
  audioLink: string = "";

  @Field(() => String)
  notes: string = "";
}

@ObjectType()
class CreateOnePronunciationResponse {
  @Field(() => Pronunciation, { nullable: true })
  pronunciation?: Pronunciation;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@Resolver()
export class CreateOnePronunciationResolver {
  @Mutation(() => CreateOnePronunciationResponse)
  @UseMiddleware(isAuth)
  async createOnePronunciation(
    @Arg("options") options: CreateOnePronunciationInput,
    @Ctx() { req }: MyContext
  ): Promise<CreateOnePronunciationResponse> {
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

    // Insert pronunciation
    let result;
    try {
      result = await Pronunciation.create({
        ...rest,
        userId: req.session.userId,
        entry: createOneEntryResponse.entry,
      }).save();
    } catch (err) {
      console.error(err);
      return {
        errors: generateErrors(fields, "Failed to insert pronunciation"),
      };
    }

    const response = { pronunciation: result };
    return response;
  }
}
