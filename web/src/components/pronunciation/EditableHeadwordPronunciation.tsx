import {
  Editable,
  EditableInput,
  EditablePreview,
  useEditableControls,
} from "@chakra-ui/editable";
import { AddIcon } from "@chakra-ui/icons";
import { IconButton, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useUpdatePronunciationMutation } from "../../generated/graphql";
import { ErrorAlert } from "../ErrorAlert";

interface EditableHeadwordPronunciationProps {
  headword: string;
  entryId: number;
  recordId: number;
}

export const EditableHeadwordPronunciation: React.FC<
  EditableHeadwordPronunciationProps
> = ({ headword, entryId, recordId }) => {
  const [curHeadword, setCurHeadword] = useState(headword);
  const [alertMessage, setAlertMessage] = useState("");
  const [, updatePronunciation] = useUpdatePronunciationMutation();
  const EditableControls = () => {
    const { isEditing, getEditButtonProps } = useEditableControls();
    return isEditing ? null : (
      <>
        {!curHeadword ? (
          <Tooltip label="Add headword">
            <IconButton
              aria-label="Add headword"
              size="xs"
              icon={<AddIcon />}
              {...getEditButtonProps()}
            />
          </Tooltip>
        ) : null}
      </>
    );
  };

  return (
    <>
      <Editable
        defaultValue={curHeadword}
        onSubmit={async (nextValue) => {
          if (nextValue !== curHeadword) {
            const response = await updatePronunciation({
              options: {
                id: recordId,
                oldEntryId: entryId,
                updatedPronunciation: { headword: nextValue },
              },
            });
            if (response.data?.updatePronunciation.errors) {
              setAlertMessage("Failed to update pronunciation");
            } else {
              // This is okay to do because we made sure the mutation had no errors
              setCurHeadword(nextValue);
            }
          }
        }}
      >
        <EditablePreview fontWeight="bold" />
        <EditableInput fontWeight="bold" />
        <EditableControls />
      </Editable>
      {alertMessage && <ErrorAlert message={alertMessage} />}
    </>
  );
};
