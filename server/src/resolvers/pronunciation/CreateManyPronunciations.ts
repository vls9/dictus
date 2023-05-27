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
import { AppDataSource } from "../../data-source.js";
import { Pronunciation } from "../../entities/Pronunciation.js";
import { isAuth } from "../../middleware/isAuth.js";
import { FieldError, MyContext } from "../../types.js";
import { createManyEntries } from "../../utils/createManyEntries.js";
import { processCreateManyPronunciationsInput } from "../../utils/processCreateManyPronunciationsInput.js";

@InputType()
class CreateManyPronunciationsInput {
  @Field(() => String)
  oneField: string = "";
}

@ObjectType()
class CreateManyPronunciationsResponse {
  @Field(() => FieldError, { nullable: true })
  error?: FieldError;

  @Field(() => [Pronunciation], { nullable: true })
  pronunciations?: Pronunciation[];
}

@Resolver()
export class CreateManyPronunciationsResolver {
  @Mutation(() => CreateManyPronunciationsResponse)
  @UseMiddleware(isAuth)
  async createManyPronunciations(
    @Arg("options") options: CreateManyPronunciationsInput,
    @Ctx() { req }: MyContext
  ): Promise<CreateManyPronunciationsResponse> {
    // Process input
    const processed = processCreateManyPronunciationsInput(options.oneField);
    if (
      processed.error ||
      !processed.pronunciationInputs ||
      !processed.entryInputs
    ) {
      return {
        error: {
          field: "oneField",
          message: processed.error?.message
            ? processed.error.message
            : "Invalid input",
        },
      };
    }

    const pronunciationInputs = processed.pronunciationInputs;
    const entryInputs = processed.entryInputs;

    let response: CreateManyPronunciationsResponse = {};
    try {
      let pronunciations: Pronunciation[] = [];
      response = await AppDataSource.transaction(async (tem) => {
        // Process entries
        const createManyEntriesResponse = await createManyEntries(
          entryInputs,
          tem
        );
        if (
          createManyEntriesResponse.error ||
          !createManyEntriesResponse.entries
        ) {
          console.error(createManyEntriesResponse.error?.message);
          return {
            error: {
              field: "oneField", // headword
              message: "Failed to process headword(s)",
            },
          };
        }

        // Process pronunciations
        for (let entry of createManyEntriesResponse.entries) {
          // Insert pronunciations
          for (let newPronunciation of pronunciationInputs) {
            try {
              pronunciations.push(
                await tem
                  .create(Pronunciation, {
                    ...newPronunciation,
                    userId: req.session.userId,
                    entry,
                  })
                  .save()
              );
            } catch (err) {
              console.error(err);
              return {
                error: {
                  field: "oneField",
                  message: "Failed to create meaning",
                },
              };
            }
          }
        }

        return {
          pronunciations,
        };
      });
    } catch (error: any) {
      console.error(error);
      return {
        error: { field: "oneFiled", message: "Something went wrong" },
      };
    }
    return response;
  }
}
