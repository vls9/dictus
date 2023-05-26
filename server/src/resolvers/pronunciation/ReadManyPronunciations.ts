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
import { MAX_REAL_LIMIT } from "../../constants.js";
import { AppDataSource } from "../../data-source.js";
import { Pronunciation } from "../../entities/Pronunciation.js";
import { isAuth } from "../../middleware/isAuth.js";
import { MyContext } from "../../types.js";
import { NoFieldError } from "../../utils/errorTypes.js";

@InputType()
class ReadManyPronunciationsSorting {
  @Field(() => String)
  order!: "ASC" | "DESC";

  @Field(() => String)
  by!: string;
}

@InputType()
class ReadManyPronunciationsPagination {
  @Field(() => String)
  cursor!: string;

  @Field(() => String)
  direction!: "previous" | "next";
}

@InputType()
class ReadManyPronunciationsInput {
  @Field(() => Int)
  limit!: number;

  @Field(() => ReadManyPronunciationsSorting)
  sorting!: ReadManyPronunciationsSorting;

  @Field(() => ReadManyPronunciationsPagination, { nullable: true })
  pagination?: ReadManyPronunciationsPagination;
}

@ObjectType()
class ReadManyPronunciationsResponse {
  @Field(() => [Pronunciation], { nullable: true })
  pronunciations?: Pronunciation[];

  @Field(() => NoFieldError, { nullable: true })
  error?: NoFieldError;
}

@Resolver()
export class ReadManyPronunciationsResolver {
  @Query(() => ReadManyPronunciationsResponse)
  @UseMiddleware(isAuth)
  async readManyPronunciations(
    @Arg("options") options: ReadManyPronunciationsInput,
    @Ctx() { req }: MyContext
  ): Promise<ReadManyPronunciationsResponse> {
    const realLimit = Math.min(options.limit, MAX_REAL_LIMIT);
    const innerByClause =
      options.sorting.by !== options.sorting.by.toLowerCase()
        ? `p."${options.sorting.by}"`
        : `p.${options.sorting.by}`;
    let innerOrderClause;
    let cursorClause;
    let replacements: any[] = [req.session.userId, realLimit + 1];
    if (options.pagination) {
      // Read pronunciations using pagination
      if (options.pagination.direction === "previous") {
        cursorClause = `AND ${innerByClause} < $3`;
        innerOrderClause = "DESC";
      } else if (options.pagination.direction === "next") {
        cursorClause = `AND ${innerByClause} > $3`;
        innerOrderClause = "ASC";
      } else {
        return { error: { message: "Invalid direction" } };
      }

      const cursor =
        options.sorting.by === "createdAt" || options.sorting.by === "updatedAt"
          ? new Date(parseInt(options.pagination.cursor))
          : options.pagination.cursor;
      replacements.push(cursor);
    } else {
      innerOrderClause = options.sorting.order;
      cursorClause = "";
    }

    // ORDER BY used to sort fetched results
    const outerByClause = `result.${innerByClause.split(".")[1]}`;
    const outerOrderClause = options.sorting.order;

    let result: Pronunciation[] = [];
    try {
      result = await AppDataSource.query(
        `
        SELECT result.*
        FROM
        (
          SELECT p.*,
          JSON_BUILD_OBJECT(
            'id', e.id,
            'headword', e.headword,
            'createdAt', e."createdAt",
            'updatedAt', e."updatedAt"
          ) entry
          FROM pronunciation p
          INNER JOIN entry e
          ON e.id = p."entryId"
          WHERE p."userId" = $1 ${cursorClause}
          ORDER BY ${innerByClause} ${innerOrderClause}
          LIMIT $2
        ) result
        ORDER BY ${outerByClause} ${outerOrderClause}
        `,
        replacements
      );
    } catch (err) {
      console.error(err);
      return { error: { message: "Count not find pronunciations" } };
    }
    const pronunciations =
      options.pagination?.direction === "next"
        ? innerOrderClause !== outerOrderClause
          ? result.slice(
              Math.max(result.length - 1 - realLimit, 0),
              result.length - 1
            )
          : result.slice(1, Math.min(realLimit + 1, result.length))
        : innerOrderClause !== outerOrderClause
        ? result.slice(Math.max(result.length - realLimit, 0), result.length)
        : result.slice(0, Math.min(realLimit, result.length));

    return { pronunciations };
  }
}
