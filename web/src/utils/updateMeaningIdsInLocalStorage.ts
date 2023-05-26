import { ReadMeaningIdsForPaginationResponse } from "../generated/graphql";

export const updateMeaningIdsInLocalStorage = (id: number) => {
  const mIds = localStorage.getItem("meaningIds");
  if (id && mIds) {
    const oldMeaningIds: ReadMeaningIdsForPaginationResponse = JSON.parse(mIds);
    if (
      oldMeaningIds.by === "updatedAt" &&
      oldMeaningIds.oldest &&
      oldMeaningIds.newest
    ) {
      const newMeaningIds: ReadMeaningIdsForPaginationResponse = {
        by: oldMeaningIds.by,
        oldest: oldMeaningIds.oldest.filter((mId) => mId !== id),
        newest: [id, ...oldMeaningIds.newest.filter((mId) => mId !== id)],
      };
      localStorage.setItem("meaningIds", JSON.stringify(newMeaningIds));
    }
  }
};
