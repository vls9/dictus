import { ReadMeaningIdsForPaginationResponse } from "../generated/graphql";

export const createMeaningIdsInLocalStorage = (newIds: number[]) => {
  const mIds = localStorage.getItem("meaningIds");
  if (newIds && mIds) {
    const oldMeaningIds: ReadMeaningIdsForPaginationResponse = JSON.parse(mIds);
    const newMeaningIds: ReadMeaningIdsForPaginationResponse = {
      by: oldMeaningIds.by,
      oldest: (oldMeaningIds.oldest || []).concat(newIds.slice().reverse()),
      newest: newIds.concat(oldMeaningIds.newest || []),
    };
    localStorage.setItem("meaningIds", JSON.stringify(newMeaningIds));
  }
};
