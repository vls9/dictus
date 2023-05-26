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
class ReadOneMeaningPagination {
  @Field(() => String)
  cursor!: string;

  @Field(() => String)
  direction!: "previous" | "next";

  @Field(() => String)
  by!: string;
}

@InputType()
class ReadOneMeaningInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => ReadOneMeaningPagination, { nullable: true })
  pagination?: ReadOneMeaningPagination;
}

@ObjectType()
class ReadOneMeaningResponse {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Meaning, { nullable: true })
  meaning?: Meaning;

  @Field(() => NoFieldError, { nullable: true })
  error?: NoFieldError;
}

@Resolver()
export class ReadOneMeaningResolver {
  @Query(() => ReadOneMeaningResponse)
  @UseMiddleware(isAuth)
  async readOneMeaning(
    @Arg("options") options: ReadOneMeaningInput,
    @Ctx() { req }: MyContext
  ): Promise<ReadOneMeaningResponse> {
    let response;
    if (options.id) {
      // Read meaning using ID
      try {
        const result = await AppDataSource.getRepository(Meaning)
          .createQueryBuilder("m")
          .innerJoinAndSelect("m.entries", "entry")
          .where('m.id = :id AND m."userId" = :userId', {
            id: options.id,
            userId: req.session.userId,
          })
          .getOne();
        if (!result) {
          return { error: { message: "Meaning not found" } };
        }
        response = result;
        // return result;
      } catch (err) {
        console.error(err);
        return { error: { message: "Meaning not found" } };
      }
    } else if (options.pagination) {
      // Read meaning using pagination
      const byClause =
        options.pagination.by !== options.pagination.by?.toLowerCase()
          ? `m."${options.pagination.by}"`
          : `m.${options.pagination.by}`;

      let cursorClause = "";
      let orderClause: "ASC" | "DESC" = "DESC";
      if (options.pagination.direction === "previous") {
        cursorClause = `AND ${byClause} < :cursor`;
        orderClause = "DESC";
      } else if (options.pagination.direction === "next") {
        cursorClause = `AND ${byClause} > :cursor`;
        orderClause = "ASC";
      } else {
        return { error: { message: "Invalid direction" } };
      }

      const cursor =
        options.pagination.by === "createdAt" ||
        options.pagination.by === "updatedAt"
          ? new Date(parseInt(options.pagination.cursor))
          : options.pagination.cursor;

      let result: Meaning[] = [];
      try {
        result = await AppDataSource.getRepository(Meaning)
          .createQueryBuilder("m")
          .innerJoinAndSelect("m.entries", "entry")
          .where(`m."userId" = :userId ${cursorClause}`, {
            userId: req.session.userId,
            cursor,
          })
          .orderBy(byClause, orderClause)
          .getMany();
      } catch (err) {
        console.error(err);
        return { error: { message: "Could not find meaning" } };
      }

      // For next
      if (orderClause === "ASC") {
        // If next not found
        if (!result[1]) {
          return { error: { message: "Reached newest record" } };
        } else {
          response = result[1];
        }
        // For previous
      } else {
        // If previous not found
        if (!result[0]) {
          return { error: { message: "Reached newest record" } };
        } else {
          response = result[0];
        }
      }
    } else {
      return { error: { message: "Invalid input" } };
    }
    return { id: response.id, meaning: response };
  }
}
