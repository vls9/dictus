import {
  Cache,
  DataFields,
  ResolveInfo,
  Variables,
} from "@urql/exchange-graphcache";
import {
  CreateManyMeaningsMutation,
  ReadManyMeaningsDocument,
  QueryReadManyMeaningsArgs,
  ReadManyMeaningsQuery,
} from "../generated/graphql";

export const createManyMeaningsCacheUpdate = (
  result: DataFields,
  args: Variables,
  cache: Cache,
  info: ResolveInfo
) => {
  const newMeanings = (result as CreateManyMeaningsMutation).createManyMeanings
    .meanings;
  if (newMeanings) {
    const fieldInfos = cache
      .inspectFields("Query")
      .filter((field) => field.fieldName === "readManyMeanings");
    fieldInfos.forEach((field) => {
      cache.updateQuery(
        {
          query: ReadManyMeaningsDocument,
          variables: field.arguments as QueryReadManyMeaningsArgs,
        },
        (data: ReadManyMeaningsQuery | null) => {
          if (data?.readManyMeanings.meanings) {
            data.readManyMeanings.meanings = [
              ...newMeanings.reverse(),
              ...data.readManyMeanings.meanings,
            ];
          }
          return data;
        }
      );
    });
  }
};
