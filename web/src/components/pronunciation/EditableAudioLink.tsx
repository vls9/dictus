import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  EditableInput,
  useEditableControls,
  Box,
  IconButton,
  Tooltip,
  Editable,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useUpdatePronunciationMutation } from "../../generated/graphql";
import { updatePronunciationIdsInLocalStorage } from "../../utils/updatePronunciationIdsInLocalStorage";
import { ErrorAlert } from "../ErrorAlert";

interface EditableAudioLinkProps {
  id: number;
  audioLink: string;
}

export const EditableAudioLink: React.FC<EditableAudioLinkProps> = ({
  id,
  audioLink,
}) => {
  const [curAudioLink, setCurAudioLink] = useState(audioLink);
  useEffect(() => {
    setCurAudioLink(audioLink);
  }, [audioLink]);
  const [, updatePronunciation] = useUpdatePronunciationMutation();
  const [alertMessage, setAlertMessage] = useState("");

  const EditableControls = () => {
    const { isEditing, getEditButtonProps } = useEditableControls();
    return isEditing ? (
      <EditableInput />
    ) : (
      <>
        {curAudioLink ? (
          <>
            <Box alignContent="center" mb={2}>
              <audio
                controls
                src={curAudioLink}
                style={{ width: "100%" }}
              ></audio>
            </Box>
            <Tooltip label="Edit audio link">
              <IconButton
                aria-label="Edit audio link"
                size="xs"
                icon={<EditIcon />}
                {...getEditButtonProps()}
              />
            </Tooltip>
          </>
        ) : (
          <Tooltip label="Add audio">
            <IconButton
              aria-label="Add audio link"
              size="xs"
              icon={<AddIcon />}
              {...getEditButtonProps()}
            />
          </Tooltip>
        )}
      </>
    );
  };
  return (
    <>
      <Editable
        defaultValue={curAudioLink}
        onSubmit={async (nextValue) => {
          if (nextValue !== curAudioLink) {
            setAlertMessage("");
            const response = await updatePronunciation({
              options: {
                id,
                updatedPronunciation: { audioLink: nextValue },
              },
            });
            if (response.data?.updatePronunciation.errors) {
              setAlertMessage("Failed to update meaning");
            } else {
              setCurAudioLink(nextValue);
              updatePronunciationIdsInLocalStorage(id);
            }
          }
        }}
      >
        <EditableControls />
      </Editable>
      {alertMessage && <ErrorAlert message={alertMessage} />}
    </>
  );
};
