import { Arg, Ctx, Field, InputType, Int, Mutation, ObjectType, Resolver, UseMiddleware } from "type-graphql";
import { AppDataSource } from "../../data-source.js";
import { Entry } from "../../entities/Entry.js";
import { Pronunciation } from "../../entities/Pronunciation.js";
import { isAuth } from "../../middleware/isAuth.js";
import { MyContext } from "../../types.js";
import { FieldError } from "../../utils/errorTypes.js";

@InputType()
export class UpdatedEntryPronunciation {
  @Field(() => String, { nullable: true })
  headword?: string;

  @Field(() => String, { nullable: true })
  transcription?: string;

  @Field(() => String, { nullable: true })
  notes?: string;
}

@InputType()
class UpdatePronunciationInput {
  @Field(() => Int)
  id!: number;

  @Field(() => Int, { nullable: true })
  oldEntryId?: number;

  @Field(() => UpdatedEntryPronunciation)
  updatedPronunciation!: UpdatedEntryPronunciation;
}

@ObjectType()
class UpdatePronunciationResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Pronunciation, { nullable: true })
  pronunciation?: Pronunciation;
}

@Resolver()
export class UpdatePronunciationResolver {
  @Mutation(() => UpdatePronunciationResponse)
  @UseMiddleware(isAuth)
  async updatePronunciation(
    @Arg("options") options: UpdatePronunciationInput,
    @Ctx() { req }: MyContext
  ): Promise<UpdatePronunciationResponse> {
    let errors: FieldError[] = [];
    const fieldsToUpdate: string[] = Object.keys(options.updatedPronunciation);

    let response: UpdatePronunciationResponse;
    try {
      response = await AppDataSource.transaction(
        async (tem): Promise<UpdatePronunciationResponse> => {
          // Check for and process new headword
          if (options.updatedPronunciation.headword !== undefined) {
            let entry = await tem.findOne(Entry, {
              where: { headword: options.updatedPronunciation.headword },
            });
            if (!entry) {
              // Add new entry
              try {
                entry = await tem
                  .create(Entry, {
                    headword: options.updatedPronunciation.headword,
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
                UPDATE pronunciation
                SET "entryId" = $1
                WHERE "userId" = $2 AND "entryId" = $3
                `,
                [entry.id, req.session.userId, options.oldEntryId]
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

          delete options.updatedPronunciation.headword;
          let updateResult;
          try {
            updateResult = await tem
              .createQueryBuilder()
              .update(Pronunciation)
              .set(options.updatedPronunciation)
              .where('id = :pronunciationId AND "userId" = :userId', {
                pronunciationId: options.id,
                userId: req.session.userId,
              })
              .returning("*")
              .execute();
          } catch (err) {
            console.error(err);
            fieldsToUpdate.forEach((field) => {
              errors.push({
                field: field,
                message: "Failed to update pronunciation",
              });
            });
            return {
              errors: errors,
            };
          }
          return {
            pronunciation: updateResult.raw[0] as Pronunciation,
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