import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { AppDataSource } from "../../data-source.js";
import { Entry } from "../../entities/Entry.js";
import { isAuth } from "../../middleware/isAuth.js";
import { FieldError } from "../../types.js";

@InputType()
class CreateMeaningLinkInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  headword!: string;
}

@ObjectType()
class CreateMeaningLinkResponse {
  @Field(() => Int, { nullable: true })
  entryId?: number;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@Resolver()
export class CreateMeaningLinkResolver {
  @Mutation(() => CreateMeaningLinkResponse)
  @UseMiddleware(isAuth)
  async createMeaningLink(
    @Arg("options") options: CreateMeaningLinkInput
  ): Promise<CreateMeaningLinkResponse> {
    let response: CreateMeaningLinkResponse;

    try {
      response = await AppDataSource.transaction(
        async (tem): Promise<CreateMeaningLinkResponse> => {
          let entry = await tem.findOne(Entry, {
            where: { headword: options.headword },
          });
          if (!entry) {
            // Add new entry
            try {
              entry = await tem
                .create(Entry, {
                  headword: options.headword,
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
          // Add link to relation table
          try {
            await tem.query(
              `
            INSERT INTO meaning_entries_entry("meaningId", "entryId")
            VALUES ($1, $2)
            `,
              [options.id, entry.id]
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

          return { entryId: entry.id };
        }
      );
    } catch (err) {
      console.error(err);
      return {
        errors: [
          { field: "headword", message: "Failed to link entry to meaning" },
        ],
      };
    }

    return response;
  }
}
