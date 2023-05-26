import { DeleteIcon } from "@chakra-ui/icons";
import { Tooltip, IconButton } from "@chakra-ui/react";
import { useDeletePronunciationMutation } from "../../generated/graphql";
import { deletePronunciationIdInLocalStorage } from "../../utils/deletePronunciationIdInLocalStorage";

interface DeletePronunciationBasicButtonProps {
  id: number;
}

export const DeletePronunciationBasicButton: React.FC<
  DeletePronunciationBasicButtonProps
> = ({ id }) => {
  const [, deletePronunciation] = useDeletePronunciationMutation();

  return (
    <Tooltip label="Delete">
      <IconButton
        aria-label="Delete pronunciation"
        icon={<DeleteIcon />}
        onClick={async () => {
          const response = await deletePronunciation({
            id,
          });
          if (response.data?.deletePronunciation.isDeletionComplete) {
            deletePronunciationIdInLocalStorage(id);
          }
        }}
      />
    </Tooltip>
  );
};
