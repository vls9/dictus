import {
  InputType,
  Field,
  Int,
  Resolver,
  Ctx,
  Arg,
  Query,
  UseMiddleware,
  ObjectType,
} from "type-graphql";
import { AppDataSource } from "../../data-source.js";
import { Pronunciation } from "../../entities/Pronunciation.js";
import { isAuth } from "../../middleware/isAuth.js";
import { MyContext, NoFieldError } from "../../types.js";

@InputType()
class ReadOnePronunciationPagination {
  @Field(() => String)
  cursor!: string;

  @Field(() => String)
  direction!: "previous" | "next";

  @Field(() => String)
  by!: string;
}

@InputType()
class ReadOnePronunciationInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => ReadOnePronunciationPagination, { nullable: true })
  pagination?: ReadOnePronunciationPagination;
}

@ObjectType()
class ReadOnePronunciationResponse {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Pronunciation, { nullable: true })
  pronunciation?: Pronunciation;

  @Field(() => NoFieldError, { nullable: true })
  error?: NoFieldError;
}

@Resolver()
export class ReadOnePronunciationResolver {
  @Query(() => ReadOnePronunciationResponse)
  @UseMiddleware(isAuth)
  async readOnePronunciation(
    @Arg("options") options: ReadOnePronunciationInput,
    @Ctx() { req }: MyContext
  ): Promise<ReadOnePronunciationResponse> {
    let response;
    if (options.id) {
      // Read pronunciation using ID
      try {
        const result = await AppDataSource.getRepository(Pronunciation)
          .createQueryBuilder("p")
          .innerJoinAndSelect("p.entry", "entry")
          .where('p.id = :id AND p."userId" = :userId', {
            id: options.id,
            userId: req.session.userId,
          })
          .getOne();
        if (!result) {
          return { error: { message: "Pronunciation not found" } };
        }
        response = result;
      } catch (err) {
        console.error(err);
        return { error: { message: "Could not find pronunciation" } };
      }
    } else if (options.pagination) {
      // Read pronunciation by using pagination
      const byClause =
        options.pagination.by !== options.pagination.by?.toLowerCase()
          ? `p."${options.pagination.by}"`
          : `p.${options.pagination.by}`;

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

      let result: Pronunciation[] = [];
      try {
        result = await AppDataSource.getRepository(Pronunciation)
          .createQueryBuilder("p")
          .innerJoinAndSelect("p.entry", "entry")
          .where(`p."userId" = :userId ${cursorClause}`, {
            userId: req.session.userId,
            cursor,
          })
          .orderBy(byClause, orderClause)
          .getMany();
      } catch (err) {
        console.error(err);
        return { error: { message: "Could not find pronunciation" } };
      }

      if (orderClause === "ASC") {
        if (!result[1]) {
          return { error: { message: "Reached newest record" } };
        } else {
          response = result[1];
        }
      } else {
        if (!result[0]) {
          return { error: { message: "Reached oldest record" } };
        } else {
          response = result[0];
        }
      }
    } else {
      return { error: { message: "Invalid input" } };
    }

    return { id: response.id, pronunciation: response };
  }
}
