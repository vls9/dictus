import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { NewPronunciation } from "../../pages/wiktionary";
import { CreatePronunciationFromSearchForm } from "./CreatePronunciationFromSearchForm";

interface WiktionaryPronunciationsTableProps {
  data: NewPronunciation[];
}

export const WiktionaryPronunciationsTable: React.FC<
  WiktionaryPronunciationsTableProps
> = ({ data }) => {
  return (
    <>
      <TableContainer width="100%">
        <Table
          variant="striped"
          colorScheme="gray"
          style={{ tableLayout: "fixed" }}
        >
          <Thead>
            <Tr>
              <Th>Transcription</Th>
              <Th>Notes</Th>
              <Th>To add</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((pron, i) =>
              !pron ? null : (
                <Tr key={i}>
                  <Td>{pron.transcription}</Td>
                  <Td>{pron.notes}</Td>
                  <Td>
                    <CreatePronunciationFromSearchForm pronunciation={pron} />
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
