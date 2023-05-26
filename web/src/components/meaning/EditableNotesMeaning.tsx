import {
  Editable,
  EditableInput,
  EditablePreview,
  useEditableControls,
} from "@chakra-ui/editable";
import { AddIcon } from "@chakra-ui/icons";
import { IconButton, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useUpdateMeaningMutation } from "../../generated/graphql";
import { updateMeaningIdsInLocalStorage } from "../../utils/updateMeaningIdsInLocalStorage";
import { ErrorAlert } from "../ErrorAlert";

interface EditableNotesMeaningProps {
  id: number;
  notes: string;
}

export const EditableNotesMeaning: React.FC<EditableNotesMeaningProps> = ({
  id,
  notes,
}) => {
  const [showAdd, setShowAdd] = useState(!!!notes);
  const [alertMessage, setAlertMessage] = useState("");
  const [, updateMeaning] = useUpdateMeaningMutation();
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
            const response = await updateMeaning({
              options: {
                id: id,
                updatedMeaning: { notes: nextValue },
              },
            });
            if (response.data?.updateMeaning.errors) {
              setAlertMessage("Failed to update meaning");
            }
            // If updated successfully
            setShowAdd(!!!response.data?.updateMeaning.meaning?.notes);
            updateMeaningIdsInLocalStorage(id);
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
