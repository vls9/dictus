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

interface EditableUsageProps {
  id: number;
  usage: string;
}

export const EditableUsage: React.FC<EditableUsageProps> = ({ id, usage }) => {
  const [showAdd, setShowAdd] = useState(!!!usage);
  const [alertMessage, setAlertMessage] = useState("");
  const [, updateMeaning] = useUpdateMeaningMutation();
  const EditableControls = () => {
    const { isEditing, getEditButtonProps } = useEditableControls();
    return isEditing ? null : (
      <>
        {showAdd ? (
          <Tooltip label="Add usage">
            <IconButton
              aria-label="Add usage"
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
        defaultValue={usage}
        onSubmit={async (nextValue: string) => {
          if (nextValue !== usage) {
            const response = await updateMeaning({
              options: {
                id: id,
                updatedMeaning: { usage: nextValue },
              },
            });
            if (response.data?.updateMeaning.errors) {
              setAlertMessage("Failed to update meaning");
            }
            setShowAdd(!!!response.data?.updateMeaning.meaning?.usage);
            updateMeaningIdsInLocalStorage(id);
          }
        }}
      >
        <EditablePreview fontStyle="italic" />
        <EditableInput fontStyle="italic" />
        <EditableControls />
      </Editable>
      {alertMessage && <ErrorAlert message={alertMessage} />}
    </>
  );
};
