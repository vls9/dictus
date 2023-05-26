import { ReadPronunciationIdsForPaginationResponse } from "../generated/graphql";

export const createPronunciationIdsInLocalStorage = (newIds: number[]) => {
  const pIds = localStorage.getItem("pronunciationIds");
  if (newIds && pIds) {
    const oldPronunciationIds: ReadPronunciationIdsForPaginationResponse =
      JSON.parse(pIds);
    const newPronunciationIds: ReadPronunciationIdsForPaginationResponse = {
      by: oldPronunciationIds.by,
      oldest: (oldPronunciationIds.oldest || []).concat(newIds.reverse()),
      newest: newIds.concat(oldPronunciationIds.newest || []),
    };
    localStorage.setItem(
      "pronunciationIds",
      JSON.stringify(newPronunciationIds)
    );
  }
};
