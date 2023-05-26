import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Tooltip, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  Meaning,
  ReadMeaningIdsForPaginationResponse,
  ReadOneMeaningInput,
  useReadMeaningIdsForPaginationQuery,
} from "../../generated/graphql";

interface ReadMeaningPaginationButtonsProps {
  setVariablesFromButtons: (newVariables: ReadOneMeaningInput) => void;
  by: string;
  meaning: Meaning;
}

export const ReadMeaningPaginationButtons: React.FC<
  ReadMeaningPaginationButtonsProps
> = ({ setVariablesFromButtons, meaning, by }) => {
  // Load meaning IDs from localStorage
  const [meaningIds, setMeaningIds] =
    useState<ReadMeaningIdsForPaginationResponse>({
      by: "",
      oldest: [],
      newest: [],
    });
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
  }, []);

  // Load meaning IDs from database
  const [{ data, fetching }] = useReadMeaningIdsForPaginationQuery({
    // Only run this when meaningIds.by from localStorage doesn't match variables.sorting.by, don't run on initial meaningIds.by
    pause: isLocalStorageKnownEmpty
      ? false
      : !by
      ? false
      : meaningIds.by === by || meaningIds.by === "",
    variables: {
      options: { by },
    },
  });
  useEffect(() => {
    const newMeaningIds = data?.readMeaningIdsForPagination;
    if (newMeaningIds) {
      localStorage.setItem("meaningIds", JSON.stringify(newMeaningIds));
      setMeaningIds(newMeaningIds);
    }
  }, [data]);

  const isDisabledPrevious =
    !meaningIds.oldest || !meaningIds.oldest[0]
      ? true
      : meaningIds.oldest[0] === meaning.id;

  const isDisabledNext =
    !meaningIds.newest || !meaningIds.newest[0]
      ? true
      : meaningIds.newest[0] === meaning.id;

  const cursor = meaning[meaningIds.by as keyof Meaning]?.toString();

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
            // Fetch using localStorage if in localStorage
            if (meaningIds.oldest && meaningIds.newest) {
              const meaningOldestIndex = meaningIds.oldest.indexOf(meaning.id);
              if (meaningOldestIndex > 0) {
                // Cannot be -1 or 0
                setVariablesFromButtons({
                  id: meaningIds.oldest[meaningOldestIndex - 1],
                });
              } else {
                const meaningNewestIndex = meaningIds.newest.indexOf(
                  meaning.id
                );
                if (
                  meaningNewestIndex !== -1 &&
                  meaningNewestIndex !== meaningIds.newest.length - 1 // Index of last element
                ) {
                  // Cannot be -1 or 0
                  setVariablesFromButtons({
                    id: meaningIds.newest[meaningNewestIndex + 1],
                  });
                } else {
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
                }
              }
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
            // Fetch using localStorage if in localStorage
            if (meaningIds.oldest && meaningIds.newest) {
              const meaningOldestIndex = meaningIds.oldest.indexOf(meaning.id);
              if (
                meaningOldestIndex !== -1 &&
                meaningOldestIndex !== meaningIds.oldest.length - 1 // Index of last element
              ) {
                // Cannot be -1 or index of last element
                setVariablesFromButtons({
                  id: meaningIds.oldest[meaningOldestIndex + 1],
                });
              } else {
                const meaningNewestIndex = meaningIds.newest.indexOf(
                  meaning.id
                );
                if (meaningNewestIndex > 0) {
                  // Cannot be -1 or index of last element
                  setVariablesFromButtons({
                    id: meaningIds.newest[meaningNewestIndex - 1],
                  });
                } else {
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
                }
              }
            }
          }}
        />
      </Tooltip>
    </>
  );
};
