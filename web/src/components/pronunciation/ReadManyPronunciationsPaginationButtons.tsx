import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Tooltip, IconButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  Pronunciation,
  ReadManyPronunciationsInput,
  ReadPronunciationIdsForPaginationResponse,
  useReadPronunciationIdsForPaginationQuery,
} from "../../generated/graphql";

interface ReadManyPronunciationsPaginationButtonsProps {
  setVariablesFromButtons: (newVariables: ReadManyPronunciationsInput) => void;
  variables: ReadManyPronunciationsInput;
  firstPronunciation: Pronunciation | null;
  lastPronunciation: Pronunciation | null;
}

export const ReadManyPronunciationsPaginationButtons: React.FC<
  ReadManyPronunciationsPaginationButtonsProps
> = ({
  setVariablesFromButtons,
  variables,
  firstPronunciation,
  lastPronunciation,
}) => {
  const isPronunciationsNull = !firstPronunciation || !lastPronunciation;
  // Load pronunciation IDs from localStorage
  const [pronunciationIds, setPronunciationIds] =
    useState<ReadPronunciationIdsForPaginationResponse>({
      by: "",
      oldest: [],
      newest: [],
    });
  console.log("pronunciation ids", pronunciationIds);
  // This handles newly-created pronunciations
  const [isLocalStorageKnownEmpty, setIsLocalStorageKnownEmpty] =
    useState(false);
  useEffect(() => {
    const pIds = localStorage.getItem("pronunciationIds");
    if (pIds) {
      setPronunciationIds(JSON.parse(pIds));
    } else {
      setIsLocalStorageKnownEmpty(true);
    }
  }, [firstPronunciation, lastPronunciation]);

  // Load pronunciation IDs from database
  const [{ data, fetching }] = useReadPronunciationIdsForPaginationQuery({
    // Only run this when pronunciationIds.by from localStorage doesn't match variables.sorting.by, don't run on initial pronunciationIds.by
    pause: isLocalStorageKnownEmpty
      ? false
      : pronunciationIds.by === variables.sorting.by ||
        pronunciationIds.by === "",
    variables: {
      options: { by: variables.sorting.by },
    },
  });
  useEffect(() => {
    const newPronunciationIds = data?.readPronunciationIdsForPagination;
    if (newPronunciationIds) {
      localStorage.setItem(
        "pronunciationIds",
        JSON.stringify(newPronunciationIds)
      );
      setPronunciationIds(newPronunciationIds);
    }
  }, [data]);

  const isOrderValid =
    variables.sorting.order === "ASC" || variables.sorting.order === "DESC";

  // Set up newCursorPrevious
  const previousCursor = isPronunciationsNull
    ? null
    : variables.sorting.order === "ASC"
    ? firstPronunciation[
        variables.sorting.by as keyof Pronunciation
      ]?.toString()
    : lastPronunciation[
        variables.sorting.by as keyof Pronunciation
      ]?.toString();

  // Set up newCursorNext
  const nextCursor = isPronunciationsNull
    ? null
    : variables.sorting.order === "ASC"
    ? lastPronunciation[variables.sorting.by as keyof Pronunciation]?.toString()
    : firstPronunciation[
        variables.sorting.by as keyof Pronunciation
      ]?.toString();

  const isDisabledPrevious =
    !pronunciationIds.oldest ||
    !previousCursor ||
    !isOrderValid ||
    isPronunciationsNull
      ? true
      : variables.sorting?.order === "ASC"
      ? firstPronunciation.id === pronunciationIds.oldest[0]
      : lastPronunciation.id === pronunciationIds.oldest[0];

  const isDisabledNext =
    !pronunciationIds.newest ||
    !nextCursor ||
    !isOrderValid ||
    isPronunciationsNull
      ? true
      : variables.sorting?.order === "ASC"
      ? lastPronunciation.id === pronunciationIds.newest[0]
      : firstPronunciation.id === pronunciationIds.newest[0];

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
