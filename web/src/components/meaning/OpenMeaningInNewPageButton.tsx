import { ViewIcon } from "@chakra-ui/icons";
import { Tooltip, IconButton } from "@chakra-ui/react";
import Link from "next/link";

interface OpenMeaningInNewPageButtonProps {
  id: number;
}

export const OpenMeaningInNewPageButton: React.FC<
  OpenMeaningInNewPageButtonProps
> = ({ id }) => {
  return (
    <Link href="/meaning/[id]" as={`/meaning/${id}`} target="_blank">
      <Tooltip label="Open in new page">
        <IconButton aria-label="Open in new page" icon={<ViewIcon />} />
      </Tooltip>
    </Link>
  );
};
