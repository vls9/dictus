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
import { NoFieldError } from "../../utils/errorTypes.js";

@InputType()
class DeleteMeaningLinkInput {
  @Field(() => Int)
  entryId!: number;

  @Field(() => Int)
  meaningId!: number;
}

@ObjectType()
class DeleteMeaningLinkResponse {
  @Field(() => Boolean)
  isDeletionSuccessful!: boolean;

  @Field(() => NoFieldError, { nullable: true })
  error?: NoFieldError;
}

@Resolver()
export class DeleteMeaningLinkResolver {
  @Mutation(() => DeleteMeaningLinkResponse)
  @UseMiddleware()
  async deleteMeaningLink(
    @Arg("options") options: DeleteMeaningLinkInput
  ): Promise<DeleteMeaningLinkResponse> {
    try {
      await AppDataSource.query(
        `
        DELETE FROM meaning_entries_entry m_e
        WHERE m_e."entryId" = $1 AND m_e."meaningId" = $2
        `,
        [options.entryId, options.meaningId]
      );
    } catch (err) {
      console.error(err);
      return {
        isDeletionSuccessful: false,
        error: { message: "Deletion failed" },
      };
    }
    return {
      isDeletionSuccessful: true,
    };
  }
}
