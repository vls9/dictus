import { DeleteIcon } from "@chakra-ui/icons";
import { Tooltip, IconButton } from "@chakra-ui/react";
import {
  useDeleteMeaningMutation,
} from "../../generated/graphql";
import { deleteMeaningIdInLocalStorage } from "../../utils/deleteMeaningIdInLocalStorage";

interface DeleteMeaningBasicButtonProps {
  id: number;
}

export const DeleteMeaningBasicButton: React.FC<
  DeleteMeaningBasicButtonProps
> = ({ id }) => {
  const [, deleteMeaning] = useDeleteMeaningMutation();
  return (
    <Tooltip label="Delete">
      <IconButton
        aria-label="Delete meaning"
        icon={<DeleteIcon />}
        onClick={async () => {
          const response = await deleteMeaning({
            id,
          });
          // Update meaning IDs in localStorage
          if (response.data?.deleteMeaning.isDeletionComplete) {
            deleteMeaningIdInLocalStorage(id);
          }
        }}
      />
    </Tooltip>
  );
};
