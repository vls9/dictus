import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Tooltip, IconButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  Pronunciation,
  ReadOnePronunciationInput,
  ReadPronunciationIdsForPaginationResponse,
  useReadPronunciationIdsForPaginationQuery,
} from "../../generated/graphql";

interface ReadPronunciationPaginationButtonsProps {
  setVariablesFromButtons: (newVariables: ReadOnePronunciationInput) => void;
  variables: ReadOnePronunciationInput;
  by: string;
  pronunciation: Pronunciation;
}

export const ReadPronunciationPaginationButtons: React.FC<
  ReadPronunciationPaginationButtonsProps
> = ({ setVariablesFromButtons, variables, by, pronunciation }) => {
  // Load pronunciation IDs from localStorage
  const [pronunciationIds, setPronunciationIds] =
    useState<ReadPronunciationIdsForPaginationResponse>({
      by: "",
      oldest: [],
      newest: [],
    });
  // This handles newly-created meanings
  const [isLocalStorageKnownEmpty, setIsLocalStorageKnownEmpty] =
    useState(false);
  useEffect(() => {
    const pIds = localStorage.getItem("pronunciationIds");
    if (pIds) {
      setPronunciationIds(JSON.parse(pIds));
    } else {
      setIsLocalStorageKnownEmpty(true);
    }
  }, []);

  // Load meaning IDs from database
  const [{ data, fetching }] = useReadPronunciationIdsForPaginationQuery({
    pause: isLocalStorageKnownEmpty
      ? false
      : !by
      ? false
      : pronunciationIds.by === by || pronunciationIds.by === "",
    variables: {
      options: { by },
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

  const isDisabledPrevious =
    !pronunciationIds.oldest || !pronunciationIds.oldest[0]
      ? true
      : pronunciationIds.oldest[0] === pronunciation.id;

  const isDisabledNext =
    !pronunciationIds.newest || !pronunciationIds.newest[0]
      ? true
      : pronunciationIds.newest[0] === pronunciation.id;

  const cursor =
    pronunciation[pronunciationIds.by as keyof Pronunciation]?.toString();
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
            if (cursor && by) {
              const newVariables = {
                pagination: {
                  cursor,
                  direction: "previous",
                  by,
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
            if (cursor && by) {
              const newVariables = {
                pagination: {
                  cursor,
                  direction: "next",
                  by,
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
