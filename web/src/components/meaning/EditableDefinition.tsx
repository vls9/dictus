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

interface EditableDefinitionProps {
  id: number;
  definition: string;
}

export const EditableDefinition: React.FC<EditableDefinitionProps> = ({
  id,
  definition,
}) => {
  const [showAdd, setShowAdd] = useState(!!!definition);
  const [alertMessage, setAlertMessage] = useState("");
  const [, updateMeaning] = useUpdateMeaningMutation();
  const EditableControls = () => {
    const { isEditing, getEditButtonProps } = useEditableControls();
    return isEditing ? null : (
      <>
        {showAdd ? (
          <Tooltip label="Add definition">
            <IconButton
              aria-label="Add definition"
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
        defaultValue={definition}
        onSubmit={async (nextValue) => {
          if (nextValue !== definition) {
            const response = await updateMeaning({
              options: {
                id,
                updatedMeaning: { definition: nextValue },
              },
            });
            if (response.data?.updateMeaning.errors) {
              setAlertMessage("Failed to update meaning");
            }
            setShowAdd(!!!response.data?.updateMeaning.meaning?.definition);
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
