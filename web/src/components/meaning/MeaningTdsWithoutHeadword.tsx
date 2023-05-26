import { Box, Td } from "@chakra-ui/react";
import { Meaning } from "../../generated/graphql";
import { DeleteMeaningBasicButton } from "./DeleteMeaningBasicButton";
import { EditableDefinition } from "./EditableDefinition";
import { EditableImageLink } from "./EditableImageLink";
import { EditableNotesMeaning } from "./EditableNotesMeaning";
import { EditableUsage } from "./EditableUsage";
import { OpenMeaningInNewPageButton } from "./OpenMeaningInNewPageButton";

interface MeaningTdsWithoutHeadwordProps {
  meaning: Meaning;
  imagesMode: string;
}

export const MeaningTdsWithoutHeadword: React.FC<
  MeaningTdsWithoutHeadwordProps
> = ({ meaning, imagesMode }) => {
  return (
    <>
      {imagesMode !== "Images only" ? (
        <>
          <Td style={{ whiteSpace: "pre-wrap" }}>
            <EditableDefinition
              id={meaning.id}
              definition={meaning.definition}
            />
          </Td>
          <Td style={{ whiteSpace: "pre-wrap" }}>
            <EditableUsage id={meaning.id} usage={meaning.usage} />
          </Td>
        </>
      ) : null}
      {imagesMode !== "Without images" ? (
        <Td>
          <EditableImageLink
            id={meaning.id}
            imageLink={meaning.imageLink}
            definition={meaning.definition}
          />
        </Td>
      ) : null}
      {imagesMode !== "Images only" ? (
        <Td style={{ whiteSpace: "pre-wrap" }}>
          <EditableNotesMeaning id={meaning.id} notes={meaning.notes} />
        </Td>
      ) : null}
      <Td>
        <Box mb={2}>
          <OpenMeaningInNewPageButton id={meaning.id} />
        </Box>
        <Box>
          <DeleteMeaningBasicButton id={meaning.id} />
        </Box>
      </Td>
    </>
  );
};
