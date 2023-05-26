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
import { updatePronunciationIdsInLocalStorage } from "../../utils/updatePronunciationIdsInLocalStorage";
import { ErrorAlert } from "../ErrorAlert";

interface EditableNotesPronunciationProps {
  id: number;
  notes: string;
}

export const EditableNotesPronunciation: React.FC<
  EditableNotesPronunciationProps
> = ({ id, notes }) => {
  const [showAdd, setShowAdd] = useState(!!!notes);
  const [alertMessage, setAlertMessage] = useState("");
  const [, updatePronunciation] = useUpdatePronunciationMutation();
  const EditableControls = () => {
    const { isEditing, getEditButtonProps } = useEditableControls();
    return isEditing ? null : (
      <>
        {showAdd ? (
          <Tooltip label="Add notes">
            <IconButton
              aria-label="Add notes"
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
        defaultValue={notes}
        onSubmit={async (nextValue) => {
          if (nextValue !== notes) {
            const response = await updatePronunciation({
              options: {
                id,
                updatedPronunciation: { notes: nextValue },
              },
            });
            if (response.data?.updatePronunciation.errors) {
              setAlertMessage("Failed to update pronunciation");
            }
            // If updated successfully
            setShowAdd(
              !!!response.data?.updatePronunciation.pronunciation?.notes
            );
            updatePronunciationIdsInLocalStorage(id);
          }
        }}
      >
        <EditablePreview />
        <EditableInput />
        <EditableControls />
      </Editable>
      {alertMessage && <ErrorAlert message={alertMessage} />}
    </>
  );
};
