import { ReadPronunciationIdsForPaginationResponse } from "../generated/graphql";

export const deletePronunciationIdInLocalStorage = (id: number) => {
  const pIds = localStorage.getItem("pronunciationIds");
  if (pIds) {
    const oldPronunciationIds: ReadPronunciationIdsForPaginationResponse =
      JSON.parse(pIds);
    if (
      !oldPronunciationIds.oldest?.includes(id) ||
      !oldPronunciationIds.newest?.includes(id)
    ) {
      return "regular";
    }
    const newPronunciationIds: ReadPronunciationIdsForPaginationResponse = {
      by: oldPronunciationIds.by,
      oldest: oldPronunciationIds.oldest?.filter((pId) => pId !== id),
      newest: oldPronunciationIds.newest?.filter((pId) => pId !== id),
    };
    localStorage.setItem(
      "pronunciationIds",
      JSON.stringify(newPronunciationIds)
    );

    if (newPronunciationIds.oldest?.length === 0) {
      return "noneLeft";
    } else if (
      oldPronunciationIds.oldest &&
      id === oldPronunciationIds.oldest[0]
    ) {
      return "oldestDeleted";
    } else {
      return "regular";
    }
  } else {
    return "empty";
  }
};
