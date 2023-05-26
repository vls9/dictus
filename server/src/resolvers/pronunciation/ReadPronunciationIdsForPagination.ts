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
import { Pronunciation } from "../../entities/Pronunciation.js";
import { isAuth } from "../../middleware/isAuth.js";
import { MyContext } from "../../types.js";
import { NoFieldError } from "../../utils/errorTypes.js";

@InputType()
class ReadPronunciationIdsForPaginationInput {
  @Field(() => String)
  by!: string;
}

@ObjectType()
class ReadPronunciationIdsForPaginationResponse {
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
export class ReadPronunciationIdsForPaginationResolver {
  @Query(() => ReadPronunciationIdsForPaginationResponse)
  @UseMiddleware(isAuth)
  async readPronunciationIdsForPagination(
    @Arg("options") options: ReadPronunciationIdsForPaginationInput,
    @Ctx() { req }: MyContext
  ): Promise<ReadPronunciationIdsForPaginationResponse> {
    let oldest: Pronunciation[] = [];
    let newest: Pronunciation[] = [];
    const byClause =
      options.by === "createdAt" || options.by === "updatedAt"
        ? `p."${options.by}"`
        : `p.${options.by}`;
    try {
      oldest = await AppDataSource.getRepository(Pronunciation)
        .createQueryBuilder("p")
        .select("p.id")
        .where('p."userId" = :userId', { userId: req.session.userId })
        .orderBy(byClause, "ASC")
        .limit(10)
        .getMany();

      newest = await AppDataSource.getRepository(Pronunciation)
        .createQueryBuilder("p")
        .select("p.id")
        .where('p."userId" = :userId', { userId: req.session.userId })
        .orderBy(byClause, "DESC")
        .limit(10)
        .getMany();
    } catch (err) {
      console.error(err);
      return { error: { message: "Pronunciation IDs not found" } };
    }

    const response = {
      id: oldest[0].id,
      by: options.by,
      oldest: oldest.map((p) => p.id),
      newest: newest.map((p) => p.id),
    };

    return response;
  }
}
