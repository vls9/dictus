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

interface EditableTranscriptionProps {
  id: number;
  transcription: string;
}

export const EditableTranscription: React.FC<EditableTranscriptionProps> = ({
  id,
  transcription,
}) => {
  const [showAdd, setShowAdd] = useState(!!!transcription);
  const [alertMessage, setAlertMessage] = useState("");
  const [, updatePronunciation] = useUpdatePronunciationMutation();
  const EditableControls = () => {
    const { isEditing, getEditButtonProps } = useEditableControls();
    return isEditing ? null : (
      <>
        {showAdd ? (
          <Tooltip label="Add transcription">
            <IconButton
              aria-label="Add transcription"
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
        defaultValue={transcription}
        onSubmit={async (nextValue) => {
          if (nextValue !== transcription) {
            const response = await updatePronunciation({
              options: {
                id,
                updatedPronunciation: { transcription: nextValue },
              },
            });
            if (response.data?.updatePronunciation.errors) {
              setAlertMessage("Failed to update pronunciation");
            }
            // If updated successfully
            setShowAdd(
              !!!response.data?.updatePronunciation.pronunciation?.transcription
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
