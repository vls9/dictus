import {
  Cache,
  DataFields,
  ResolveInfo,
  Variables,
} from "@urql/exchange-graphcache";
import {
  CreateOneMeaningMutation,
  ReadManyMeaningsDocument,
  QueryReadManyMeaningsArgs,
  ReadManyMeaningsQuery,
} from "../generated/graphql";

export const createOneMeaningCacheUpdate = (
  result: DataFields,
  args: Variables,
  cache: Cache,
  info: ResolveInfo
) => {
  const newMeaning = (result as CreateOneMeaningMutation).createOneMeaning
    .meaning;
  if (newMeaning) {
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
              newMeaning,
              ...data.readManyMeanings.meanings,
            ];
          }
          return data;
        }
      );
    });
  }
};
