import { AddIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {
  useEditableControls,
  IconButton,
  Editable,
  EditablePreview,
  EditableInput,
  Tooltip,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { useCreateMeaningLinkMutation } from "../../generated/graphql";
import { ErrorAlert } from "../ErrorAlert";
import { EditableHeadwordMeaning } from "./EditableHeadwordMeaning";

interface EditableNewHeadwordMeaningProps {
  recordId: number;
}

export const EditableNewHeadwordMeaning: React.FC<EditableNewHeadwordMeaningProps> = ({
  recordId,
}) => {
  const [newHeadword, setNewHeadword] = useState({
    headword: "",
    entryId: -1,
    isCreated: false,
  });
  const [showAdd, setShowAdd] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [, createMeaningLink] = useCreateMeaningLinkMutation();
  const EditableControls = () => {
    const { isEditing, getEditButtonProps } = useEditableControls();
    return !isEditing ? (
      <>
        {showAdd ? (
          <Tooltip label="Add new headword">
            <IconButton
              aria-label="Add new headword"
              size="xs"
              icon={<PlusSquareIcon />}
              {...getEditButtonProps()}
            />
          </Tooltip>
        ) : null}
      </>
    ) : null;
  };
  return (
    <>
      {!newHeadword.isCreated ? (
        <>
          <Editable
            defaultValue=""
            onSubmit={async (nextValue) => {
              const response = await createMeaningLink({
                options: {
                  id: recordId,
                  headword: nextValue,
                },
              });
              if (
                response.data?.createMeaningLink.errors ||
                !response.data?.createMeaningLink.entryId
              ) {
                setAlertMessage("Failed to add new headword");
              } else {
                setShowAdd(!nextValue ? true : false);
                setNewHeadword({
                  headword: nextValue,
                  entryId: response.data?.createMeaningLink.entryId,
                  isCreated: true,
                });
              }
            }}
          >
            <EditableInput fontWeight="bold" />
            <EditablePreview fontWeight="bold" />
            <EditableControls />
          </Editable>
          {alertMessage && <ErrorAlert message={alertMessage} />}
        </>
      ) : (
        <>
          <Box mb={2}>
            <EditableHeadwordMeaning
              recordId={recordId}
              headword={newHeadword.headword}
              entryId={newHeadword.entryId}
            />
          </Box>
          <Box mb={2}>
            <EditableNewHeadwordMeaning recordId={recordId} />
          </Box>
        </>
      )}
    </>
  );
};
