import { Tbody, Td, Tr } from "@chakra-ui/react";
import { Meaning } from "../../generated/graphql";
import { EditableHeadwordsMeaning } from "./EditableHeadwordsMeaning";
import { MeaningTdsWithoutHeadword } from "./MeaningTdsWithoutHeadword";

interface MeaningsByMeaningTbodyProps {
  meanings: Meaning[];
  imagesMode: string;
}

export const MeaningsByMeaningTbody: React.FC<MeaningsByMeaningTbodyProps> = ({
  meanings,
  imagesMode,
}) => {
  return (
    <Tbody>
      {meanings.map((meaning) =>
        !meaning ? null : (
          <Tr key={meaning.id}>
            <Td style={{ whiteSpace: "pre-wrap" }}>
              <EditableHeadwordsMeaning record={meaning} />
            </Td>

            <MeaningTdsWithoutHeadword
              meaning={meaning}
              imagesMode={imagesMode}
            />
          </Tr>
        )
      )}
    </Tbody>
  );
};
