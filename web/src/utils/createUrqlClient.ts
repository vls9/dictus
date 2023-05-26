import { dedupExchange, fetchExchange, Exchange } from "urql";
import { cacheExchange, Cache } from "@urql/exchange-graphcache";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
  DeleteMeaningMutationVariables,
  DeletePronunciationMutationVariables,
  ReadManyMeaningsDocument,
  CreateManyMeaningsMutation,
  CreateManyPronunciationsMutation,
  ReadManyMeaningsQuery,
  QueryReadManyMeaningsArgs,
  ReadManyPronunciationsDocument,
  QueryReadManyPronunciationsArgs,
  ReadManyPronunciationsQuery,
  CreateOneMeaningMutation,
  CreateOnePronunciationMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { pipe, tap } from "wonka";
import Router from "next/router";
import { createOneMeaningCacheUpdate } from "./createOneMeaningCacheUpdate";
import { createManyMeaningsCacheUpdate } from "./createManyMeaningsCacheUpdate";

export const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    // Will allow us to catch and handle all errors on a global level
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error) {
          if (error.message.includes("Not authenticated")) {
            Router.replace("/login"); // Outside of React, use global Router, not the hook
          }
        }
      })
    );
  };
function invalidateAllMeanings(cache: Cache) {
  const allFields = cache.inspectFields("Query"); // Fetch all fields in cache under given query entity Key
  const fieldInfos = allFields.filter(
    (info) => info.fieldName === "readMeanings"
  ); // Filter queries in cache, get ones we care about
  // Loop over all paginated queries, invalidate all of them
  fieldInfos.forEach((fi) => {
    cache.invalidate("Query", "readMeanings", fi.arguments || {});
  });
}

function invalidateAllPronunciations(cache: Cache) {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter(
    (info) => info.fieldName === "readPronunciations"
  );
  fieldInfos.forEach((fi) => {
    cache.invalidate("Query", "readPronunciations", fi.arguments || {});
  });
}

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  return {
    url: process.env.NEXT_PUBLIC_API_URL as string,
    fetchOptions: {
      credentials: "include" as RequestCredentials,
      headers: ctx?.req?.headers.cookie
        ? { cookie: ctx.req.headers.cookie }
        : undefined,
    }, // This will send a cookie
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          ReadOneMeaningResponse: () => null,
          ReadOnePronunciationResponse: () => null,
          ReadManyMeaningsResponse: () => null,
          ReadManyPronunciationsResponse: () => null,
          FieldError: () => null,
          NoFieldError: () => null,
        },
        updates: {
          Mutation: {
            createOneMeaning: createOneMeaningCacheUpdate,
            createManyMeanings: createManyMeaningsCacheUpdate,
            createOnePronunciation: (result, args, cache, info) => {
              const newPronunciation = (
                result as CreateOnePronunciationMutation
              ).createOnePronunciation.pronunciation;
              if (newPronunciation) {
                const fieldInfos = cache
                  .inspectFields("Query")
                  .filter(
                    (field) => field.fieldName === "readManyPronunciations"
                  );
                fieldInfos.forEach((field) => {
                  cache.updateQuery(
                    {
                      query: ReadManyPronunciationsDocument,
                      variables:
                        field.arguments as QueryReadManyPronunciationsArgs,
                    },
                    (data: ReadManyPronunciationsQuery | null) => {
                      if (data?.readManyPronunciations.pronunciations) {
                        data.readManyPronunciations.pronunciations = [
                          newPronunciation,
                          ...data.readManyPronunciations.pronunciations,
                        ];
                      }
                      return data;
                    }
                  );
                });
              }
            },
            deleteMeaning: (_result, args, cache, info) => {
              cache.invalidate({
                __typename: "Meaning",
                id: (args as DeleteMeaningMutationVariables).id,
              });
            },
            deletePronunciation: (_result, args, cache, info) => {
              cache.invalidate({
                __typename: "Pronunciation",
                id: (args as DeletePronunciationMutationVariables).id,
              });
            },
            logout: (_result, args, cache, info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null }) // User set to null in cache
              );
            },
            login: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  } else {
                    return {
                      me: result.login.user, // This is type-safe--expecting a user
                    };
                  }
                }
              );
              invalidateAllMeanings(cache);
              invalidateAllPronunciations(cache);
            },
            register: (_result, args, cache, info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  } else {
                    return {
                      me: result.register.user,
                    };
                  }
                }
              );
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
