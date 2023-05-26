import {
  Editable,
  EditableInput,
  useEditableControls,
} from "@chakra-ui/editable";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Image, IconButton, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useUpdateMeaningMutation } from "../../generated/graphql";
import { updateMeaningIdsInLocalStorage } from "../../utils/updateMeaningIdsInLocalStorage";
import { ErrorAlert } from "../ErrorAlert";

interface EditableImageLinkProps {
  id: number;
  imageLink: string;
  definition: string;
}

export const EditableImageLink: React.FC<EditableImageLinkProps> = ({
  id,
  imageLink,
  definition,
}) => {
  const [curImageLink, setCurImageLink] = useState(imageLink);
  useEffect(() => {
    setCurImageLink(imageLink);
  }, [imageLink]);
  const [, updateMeaning] = useUpdateMeaningMutation();
  const [alertMessage, setAlertMessage] = useState("");

  const EditableControls = () => {
    const { isEditing, getEditButtonProps } = useEditableControls();
    return isEditing ? (
      <EditableInput />
    ) : (
      <>
        {curImageLink ? (
          <>
            <Box alignContent="center" mb={2}>
              <Image src={curImageLink} alt={definition} />
            </Box>
            <Tooltip label="Edit image link">
              <IconButton
                aria-label="Edit image link"
                size="xs"
                icon={<EditIcon />}
                {...getEditButtonProps()}
              />
            </Tooltip>
          </>
        ) : (
          <Tooltip label="Add image">
            <IconButton
              aria-label="Add image link"
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
        defaultValue={curImageLink}
        onSubmit={async (nextValue) => {
          if (nextValue !== curImageLink) {
            setAlertMessage("");
            const response = await updateMeaning({
              options: {
                id,
                updatedMeaning: { imageLink: nextValue },
              },
            });
            if (response.data?.updateMeaning.errors) {
              setAlertMessage("Failed to update meaning");
            } else {
              setCurImageLink(nextValue);
              updateMeaningIdsInLocalStorage(id);
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
