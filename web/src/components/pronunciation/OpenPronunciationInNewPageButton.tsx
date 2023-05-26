import { ViewIcon } from "@chakra-ui/icons";
import { Tooltip, IconButton } from "@chakra-ui/react";
import Link from "next/link";

interface OpenPronunciationInNewPageButtonProps {
  id: number;
}

export const OpenPronunciationInNewPageButton: React.FC<
  OpenPronunciationInNewPageButtonProps
> = ({ id }) => {
  return (
    <Link
      href="/pronunciation/[id]"
      as={`/pronunciation/${id}`}
      target="_blank"
    >
      <Tooltip label="Open in new page">
        <IconButton aria-label="Open in new page" icon={<ViewIcon />} />
      </Tooltip>
    </Link>
  );
};
