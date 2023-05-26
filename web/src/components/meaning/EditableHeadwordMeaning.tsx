import { AddIcon } from "@chakra-ui/icons";
import {
  useEditableControls,
  IconButton,
  Editable,
  EditablePreview,
  EditableInput,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  useDeleteMeaningLinkMutation,
  useUpdateMeaningMutation,
} from "../../generated/graphql";
import { ErrorAlert } from "../ErrorAlert";

interface EditableHeadwordMeaningProps {
  headword: string;
  entryId: number;
  recordId: number;
}

export const EditableHeadwordMeaning: React.FC<
  EditableHeadwordMeaningProps
> = ({ headword, entryId, recordId }) => {
  const [isShow, setIsShow] = useState(true);
  const [curHeadword, setCurHeadword] = useState(headword);
  const [alertMessage, setAlertMessage] = useState("");
  const [, updateMeaning] = useUpdateMeaningMutation();
  const [, deleteMeaningLink] = useDeleteMeaningLinkMutation();
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
      {!isShow ? null : (
        <>
          <Editable
            defaultValue={curHeadword}
            onSubmit={async (nextValue) => {
              if (!nextValue) {
                const response = await deleteMeaningLink({
                  options: {
                    meaningId: recordId,
                    entryId,
                  },
                });
                if (response.data?.deleteMeaningLink.isDeletionSuccessful) {
                  setIsShow(false);
                }
              } else if (nextValue !== curHeadword) {
                const response = await updateMeaning({
                  options: {
                    id: recordId,
                    oldEntryId: entryId,
                    updatedMeaning: { headword: nextValue },
                  },
                });
                if (response.data?.updateMeaning.errors) {
                  setAlertMessage("Failed to update meaning");
                  // setCurHeadword(curHeadword);
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
      )}
    </>
  );
};
