import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { AppDataSource } from "../../data-source.js";
import { Meaning } from "../../entities/Meaning.js";
import { isAuth } from "../../middleware/isAuth.js";
import { MyContext } from "../../types.js";
import { NoFieldError } from "../../utils/errorTypes.js";

@InputType()
class ReadMeaningIdsForPaginationInput {
  @Field(() => String)
  by!: string;
}

@ObjectType()
class ReadMeaningIdsForPaginationResponse {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  by?: string;

  @Field(() => [Int], { nullable: true })
  oldest?: number[];

  @Field(() => [Int], { nullable: true })
  newest?: number[];

  @Field(() => NoFieldError, { nullable: true })
  error?: NoFieldError;
}

@Resolver()
export class ReadMeaningIdsForPaginationResolver {
  @Query(() => ReadMeaningIdsForPaginationResponse)
  @UseMiddleware(isAuth)
  async readMeaningIdsForPagination(
    @Arg("options") options: ReadMeaningIdsForPaginationInput,
    @Ctx() { req }: MyContext
  ): Promise<ReadMeaningIdsForPaginationResponse> {
    let oldest: Meaning[] = [];
    let newest: Meaning[] = [];
    const byClause =
      options.by === "createdAt" || options.by === "updatedAt"
        ? `m."${options.by}"`
        : `m.${options.by}`;
    try {
      oldest = await AppDataSource.getRepository(Meaning)
        .createQueryBuilder("m")
        .select("m.id")
        .where('m."userId" = :userId', { userId: req.session.userId })
        .orderBy(byClause, "ASC")
        .limit(10)
        .getMany();

      newest = await AppDataSource.getRepository(Meaning)
        .createQueryBuilder("m")
        .select("m.id")
        .where('m."userId" = :userId', { userId: req.session.userId })
        .orderBy(byClause, "DESC")
        .limit(10)
        .getMany();
    } catch (err) {
      console.error(err);
      return { error: { message: "Meaning IDs not found" } };
    }

    const response = {
      id: oldest[0].id,
      by: options.by,
      oldest: oldest.map((meaning) => meaning.id),
      newest: newest.map((meaning) => meaning.id),
    };
    return response;
  }
}
