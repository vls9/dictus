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
import { Meaning } from "../../entities/Meaning.js";
import { isAuth } from "../../middleware/isAuth.js";
import { MyContext } from "../../types.js";
import { checkImageLink } from "../../utils/checkImageLink.js";
import { FieldError } from "../../utils/errorTypes.js";
import { createManyEntries } from "../../utils/createManyEntries.js";
import { processCreateManyMeaningsInput } from "../../utils/processCreateManyMeaningsInput.js";

@InputType()
class CreateManyMeaningsInput {
  @Field(() => String)
  oneField: string = "";
}

@ObjectType()
class CreateManyMeaningsResponse {
  @Field(() => FieldError, { nullable: true })
  error?: FieldError;

  @Field(() => [Meaning], { nullable: true })
  meanings?: Meaning[];
}

@Resolver()
export class CreateManyMeaningsResolver {
  @Mutation(() => CreateManyMeaningsResponse)
  @UseMiddleware(isAuth)
  async createManyMeanings(
    @Arg("options") options: CreateManyMeaningsInput,
    @Ctx() { req }: MyContext
  ): Promise<CreateManyMeaningsResponse> {
    // Process input
    const processed = processCreateManyMeaningsInput(options.oneField);
    if (processed.error || !processed.meaningInputs || !processed.entryInputs) {
      return {
        error: {
          field: "oneField",
          message: processed.error?.message
            ? processed.error.message
            : "Invalid input",
        },
      };
    }

    const meaningInputs = processed.meaningInputs;
    const entryInputs = processed.entryInputs;

    let response: CreateManyMeaningsResponse = {};
    try {
      // Check image links
      for (let meaningInput of meaningInputs) {
        if (meaningInput.imageLink) {
          const isImageLinkValid = await checkImageLink(meaningInput.imageLink);
          if (!isImageLinkValid) {
            return {
              error: {
                field: "oneField",
                message: "At least one image link is invalid",
              },
            };
          }
        }
      }

      let meanings: Meaning[] = [];
      response = await AppDataSource.transaction(
        async (tem): Promise<CreateManyMeaningsResponse> => {
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

          // Process meanings
          for (let meaningInput of meaningInputs) {
            // Insert meanings
            try {
              meanings.push(
                await tem
                  .create(Meaning, {
                    ...meaningInput,
                    userId: req.session.userId,
                    entries: createManyEntriesResponse.entries,
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
          return {
            meanings,
          };
        }
      );
    } catch (error: any) {
      console.error(error);
      return {
        error: { field: "oneFiled", message: "Something went wrong" },
      };
    }
    return response;
  }
}
