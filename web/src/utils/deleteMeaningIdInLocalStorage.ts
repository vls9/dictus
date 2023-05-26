import { ReadMeaningIdsForPaginationResponse } from "../generated/graphql";

export const deleteMeaningIdInLocalStorage = (id: number) => {
  const mIds = localStorage.getItem("meaningIds");
  if (mIds) {
    const oldMeaningIds: ReadMeaningIdsForPaginationResponse = JSON.parse(mIds);
    if (
      !oldMeaningIds.oldest?.includes(id) ||
      !oldMeaningIds.newest?.includes(id)
    ) {
      return "regular";
    }
    const newMeaningIds: ReadMeaningIdsForPaginationResponse = {
      by: oldMeaningIds.by,
      oldest: oldMeaningIds.oldest?.filter((mId) => mId !== id),
      newest: oldMeaningIds.newest?.filter((mId) => mId !== id),
    };
    localStorage.setItem("meaningIds", JSON.stringify(newMeaningIds));

    if (newMeaningIds.oldest?.length === 0) {
      return "noneLeft";
    } else if (oldMeaningIds.oldest && id === oldMeaningIds.oldest[0]) {
      return "oldestDeleted";
    } else {
      return "regular";
    }
  } else {
    return "empty";
  }
};
