import { Tbody, Tr, Td } from "@chakra-ui/react";
import { Meaning } from "../../generated/graphql";
import { reverseMeanings } from "../../utils/reverseMeanings";
import { EditableHeadwordMeaning } from "./EditableHeadwordMeaning";
import { MeaningTdsWithoutHeadword } from "./MeaningTdsWithoutHeadword";

interface MeaningsByHeadwordTbodyProps {
  meanings: Meaning[];
  imagesMode: string;
}

export const MeaningsByHeadwordTbody: React.FC<
  MeaningsByHeadwordTbodyProps
> = ({ meanings, imagesMode }) => {
  const entries = reverseMeanings(meanings);
  return (
    <Tbody>
      {entries.map((entry) =>
        entry.meanings?.map((meaning) =>
          !meaning ? null : (
            <Tr key={meaning.id}>
              <>
                {meaning.id === entry.meanings![0]!.id ? (
                  <>
                    <Td rowSpan={entry.meanings?.length}>
                      <EditableHeadwordMeaning
                        headword={entry.headword}
                        entryId={entry.id}
                        recordId={-1}
                      />
                    </Td>
                  </>
                ) : null}
              </>
              <MeaningTdsWithoutHeadword
                meaning={meaning}
                imagesMode={imagesMode}
              />
            </Tr>
          )
        )
      )}
    </Tbody>
  );
};
