import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Tooltip, IconButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  Meaning,
  ReadManyMeaningsInput,
  ReadMeaningIdsForPaginationResponse,
  useReadMeaningIdsForPaginationQuery,
} from "../../generated/graphql";

interface ReadManyMeaningsPaginationButtonsProps {
  setVariablesFromButtons: (newVariables: ReadManyMeaningsInput) => void;
  variables: ReadManyMeaningsInput;
  firstMeaning: Meaning | null;
  lastMeaning: Meaning | null;
}

export const ReadManyMeaningsPaginationButtons: React.FC<
  ReadManyMeaningsPaginationButtonsProps
> = ({ setVariablesFromButtons, variables, firstMeaning, lastMeaning }) => {
  const isMeaningsNull = !firstMeaning || !lastMeaning;
  // Load meaning IDs from localStorage
  const [meaningIds, setMeaningIds] =
    useState<ReadMeaningIdsForPaginationResponse>({
      by: "",
      oldest: [],
      newest: [],
    });
  console.log("meaning ids:", meaningIds);
  // This handles newly-created meanings
  const [isLocalStorageKnownEmpty, setIsLocalStorageKnownEmpty] =
    useState(false);
  useEffect(() => {
    const mIds = localStorage.getItem("meaningIds");
    if (mIds) {
      setMeaningIds(JSON.parse(mIds));
    } else {
      setIsLocalStorageKnownEmpty(true);
    }
  }, [firstMeaning, lastMeaning]);

  // Load meaning IDs from database
  const [{ data, fetching }] = useReadMeaningIdsForPaginationQuery({
    // Only run this when meaningIds.by from localStorage doesn't match variables.sorting.by, don't run on initial meaningIds.by
    pause: isLocalStorageKnownEmpty
      ? false
      : meaningIds.by === variables.sorting.by || meaningIds.by === "",
    variables: {
      options: { by: variables.sorting.by },
    },
  });
  useEffect(() => {
    const newMeaningIds = data?.readMeaningIdsForPagination;
    if (newMeaningIds) {
      localStorage.setItem("meaningIds", JSON.stringify(newMeaningIds));
      setMeaningIds(newMeaningIds);
    }
  }, [data]);

  const isOrderValid =
    variables.sorting.order === "ASC" || variables.sorting.order === "DESC";

  // Set up newCursorPrevious
  const previousCursor = isMeaningsNull
    ? null
    : variables.sorting.order === "ASC"
    ? firstMeaning[variables.sorting.by as keyof Meaning]?.toString()
    : lastMeaning[variables.sorting.by as keyof Meaning]?.toString();

  // Set up newCursorNext
  const nextCursor = isMeaningsNull
    ? null
    : variables.sorting.order === "ASC"
    ? lastMeaning[variables.sorting.by as keyof Meaning]?.toString()
    : firstMeaning[variables.sorting.by as keyof Meaning]?.toString();

  const isDisabledPrevious =
    !meaningIds.oldest ||
    meaningIds.oldest?.length === 0 ||
    !previousCursor ||
    !isOrderValid ||
    isMeaningsNull
      ? true
      : variables.sorting?.order === "ASC"
      ? firstMeaning.id === meaningIds.oldest[0]
      : lastMeaning.id === meaningIds.oldest[0];

  const isDisabledNext =
    !meaningIds.newest ||
    meaningIds.newest?.length === 0 ||
    !nextCursor ||
    !isOrderValid ||
    isMeaningsNull
      ? true
      : variables.sorting?.order === "ASC"
      ? lastMeaning.id === meaningIds.newest[0]
      : firstMeaning.id === meaningIds.newest[0];

  return (
    <>
      <Tooltip label="Load previous">
        <IconButton
          mr={2}
          isLoading={fetching}
          aria-label="Load previous"
          isDisabled={isDisabledPrevious}
          icon={<ArrowBackIcon />}
          onClick={() => {
            if (previousCursor) {
              const newVariables = {
                limit: variables.limit,
                pagination: {
                  cursor: previousCursor,
                  direction: "previous",
                },
                sorting: {
                  by: variables.sorting.by,
                  order: variables.sorting.order,
                },
              };
              setVariablesFromButtons(newVariables);
            }
          }}
        />
      </Tooltip>
      <Tooltip label="Load next">
        <IconButton
          isLoading={fetching}
          aria-label="Load next"
          isDisabled={isDisabledNext}
          icon={<ArrowForwardIcon />}
          onClick={() => {
            if (nextCursor) {
              const newVariables = {
                limit: variables.limit,
                pagination: {
                  cursor: nextCursor,
                  direction: "next",
                },
                sorting: {
                  by: variables.sorting.by,
                  order: variables.sorting.order,
                },
              };
              setVariablesFromButtons(newVariables);
            }
          }}
        />
      </Tooltip>
    </>
  );
};
