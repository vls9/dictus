import {
  ObjectType,
  Field,
  Int,
  InputType,
  Mutation,
  UseMiddleware,
  Arg,
  Ctx,
} from "type-graphql";
import { AppDataSource } from "../../data-source.js";
import { Entry } from "../../entities/Entry.js";
import { Meaning } from "../../entities/Meaning.js";
import { isAuth } from "../../middleware/isAuth.js";
import { MyContext } from "../../types.js";
import { checkImageLink } from "../../utils/checkImageLink.js";
import { FieldError } from "../../utils/errorTypes.js";

@InputType()
export class UpdatedEntryMeaning {
  @Field(() => String, { nullable: true })
  headword?: string;

  @Field(() => String, { nullable: true })
  definition?: string;

  @Field(() => String, { nullable: true })
  usage?: string;

  @Field(() => String, { nullable: true })
  imageLink?: string;

  @Field(() => String, { nullable: true })
  notes?: string;
}

@InputType()
class UpdateMeaningInput {
  @Field(() => Int)
  id!: number;

  @Field(() => Int, { nullable: true })
  oldEntryId?: number;

  @Field(() => UpdatedEntryMeaning)
  updatedMeaning!: UpdatedEntryMeaning;
}

@ObjectType()
class UpdateMeaningResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Meaning, { nullable: true })
  meaning?: Meaning;
}

export class UpdateMeaningResolver {
  @Mutation(() => UpdateMeaningResponse)
  @UseMiddleware(isAuth)
  async updateMeaning(
    @Arg("options") options: UpdateMeaningInput,
    @Ctx() { req }: MyContext
  ): Promise<UpdateMeaningResponse> {
    let errors: FieldError[] = [];
    const fieldsToUpdate: string[] = Object.keys(options.updatedMeaning);

    // Check image if it exists
    if (options.updatedMeaning.imageLink) {
      try {
        await checkImageLink(options.updatedMeaning.imageLink);
      } catch (err) {
        console.error(err);
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

    let response: UpdateMeaningResponse = {};
    try {
      response = await AppDataSource.transaction(
        async (tem): Promise<UpdateMeaningResponse> => {
          // Check for and process new headword
          if (options.updatedMeaning.headword !== undefined) {
            let entry = await tem.findOne(Entry, {
              where: { headword: options.updatedMeaning.headword },
            });
            if (!entry) {
              // Add new entry
              try {
                entry = await tem
                  .create(Entry, {
                    headword: options.updatedMeaning.headword,
                  })
                  .save();
              } catch (err) {
                return {
                  errors: [
                    {
                      field: "headword",
                      message: "Failed to update headword",
                    },
                  ],
                };
              }
            }

            // Update relation table
            try {
              await tem.query(
                `
                UPDATE meaning_entries_entry
                SET "entryId" = $1
                WHERE "meaningId" = $2 AND "entryId" = $3
                `,
                [entry.id, options.id, options.oldEntryId]
              );
            } catch (err) {
              console.error(err);
              return {
                errors: [
                  {
                    field: "headword",
                    message: "Failed to update relation table",
                  },
                ],
              };
            }
          }

          delete options.updatedMeaning.headword;
          let updateResult;
          try {
            updateResult = await tem
              .createQueryBuilder()
              .update(Meaning)
              .set(options.updatedMeaning)
              .where('id = :meaningId AND "userId" = :userId', {
                meaningId: options.id,
                userId: req.session.userId,
              })
              .returning("*")
              .execute();
          } catch (err) {
            console.error(err);
            fieldsToUpdate.forEach((field) => {
              errors.push({
                field: field,
                message: "Failed to update meaning",
              });
            });
            return {
              errors: errors,
            };
          }
          return {
            meaning: updateResult.raw[0] as Meaning,
          };
        }
      );
    } catch (err) {
      console.error(err);
      fieldsToUpdate.forEach((field) => {
        errors.push({
          field: field,
          message: "Something went wrong",
        });
      });
      return {
        errors: errors,
      };
    }

    return response;
  }
}
