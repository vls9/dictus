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
import { Meaning } from "../../entities/Meaning.js";
import { isAuth } from "../../middleware/isAuth.js";
import { MyContext } from "../../types.js";
import { NoFieldError } from "../../utils/errorTypes.js";

@InputType()
class ReadManyMeaningsSorting {
  @Field(() => String)
  order!: "ASC" | "DESC";

  @Field(() => String)
  by!: string;
}

@InputType()
class ReadManyMeaningsPagination {
  @Field(() => String)
  cursor!: string;

  @Field(() => String)
  direction!: "previous" | "next";
}

@InputType()
class ReadManyMeaningsInput {
  @Field(() => Int)
  limit!: number;

  @Field(() => ReadManyMeaningsSorting)
  sorting!: ReadManyMeaningsSorting;

  @Field(() => ReadManyMeaningsPagination, { nullable: true })
  pagination?: ReadManyMeaningsPagination;
}

@ObjectType()
class ReadManyMeaningsResponse {
  @Field(() => [Meaning], { nullable: true })
  meanings?: Meaning[];

  @Field(() => NoFieldError, { nullable: true })
  error?: NoFieldError;
}

@Resolver()
export class ReadManyMeaningsResolver {
  @Query(() => ReadManyMeaningsResponse)
  @UseMiddleware(isAuth)
  async readManyMeanings(
    @Arg("options") options: ReadManyMeaningsInput,
    @Ctx() { req }: MyContext
  ): Promise<ReadManyMeaningsResponse> {
    const realLimit = Math.min(options.limit, MAX_REAL_LIMIT);
    const innerByClause =
      options.sorting.by !== options.sorting.by.toLowerCase()
        ? `m."${options.sorting.by}"`
        : `m.${options.sorting.by}`;
    let innerOrderClause;
    let cursorClause;
    let replacements: any[] = [req.session.userId, realLimit + 1];
    if (options.pagination) {
      // Read meanings using pagination
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

    let result: Meaning[] = [];
    try {
      result = await AppDataSource.query(
        `
        SELECT result.*
        FROM
        (
          SELECT m.*,
          JSON_AGG(e.*) entries
          FROM meaning m
          INNER JOIN meaning_entries_entry m_e
          ON m.id = m_e."meaningId"
          INNER JOIN entry e
          ON e.id = m_e."entryId"
          WHERE m."userId" = $1 ${cursorClause}
          GROUP BY m.id 
          ORDER BY ${innerByClause} ${innerOrderClause}
          LIMIT $2
        ) result
        ORDER BY ${outerByClause} ${outerOrderClause}
        `,
        replacements
      );
    } catch (err) {
      console.error(err);
      return { error: { message: "Could not find meanings" } };
    }
    const meanings =
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

    return { meanings };
  }
}
