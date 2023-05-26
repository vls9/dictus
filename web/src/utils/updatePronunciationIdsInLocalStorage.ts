import { ReadPronunciationIdsForPaginationResponse } from "../generated/graphql";

export const updatePronunciationIdsInLocalStorage = (id: number) => {
  const pIds = localStorage.getItem("meaningIds");
  if (id && pIds) {
    const oldPronunciationIds: ReadPronunciationIdsForPaginationResponse =
      JSON.parse(pIds);
    if (
      oldPronunciationIds.by === "updatedAt" &&
      oldPronunciationIds.oldest &&
      oldPronunciationIds.newest
    ) {
      const newPronunciationIds: ReadPronunciationIdsForPaginationResponse = {
        by: oldPronunciationIds.by,
        oldest: oldPronunciationIds.oldest.filter((pId) => pId !== id),
        newest: [id, ...oldPronunciationIds.newest.filter((pId) => pId !== id)],
      };
      localStorage.setItem(
        "pronunciationIds",
        JSON.stringify(newPronunciationIds)
      );
    }
  }
};
