import { Box } from "@chakra-ui/react";
import { Meaning } from "../../generated/graphql";
import { EditableHeadwordMeaning } from "./EditableHeadwordMeaning";
import { EditableNewHeadwordMeaning } from "./EditableNewHeadwordMeaning";

interface EditableHeadwordsMeaningProps {
  record: Meaning;
}

export const EditableHeadwordsMeaning: React.FC<EditableHeadwordsMeaningProps> = ({
  record,
}) => {
  return (
    <>
      {record.entries.map((entry) => (
        <Box key={entry.id} mb={2}>
          <EditableHeadwordMeaning
            entryId={entry.id}
            headword={entry.headword}
            recordId={record.id}
          />
        </Box>
      ))}
      <Box mb={2}>
        <EditableNewHeadwordMeaning recordId={record.id} />
      </Box>
    </>
  );
};
