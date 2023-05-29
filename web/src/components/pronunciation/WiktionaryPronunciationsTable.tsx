import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
} from "@chakra-ui/react";
import { CreateOnePronunciationInput } from "../../generated/graphql";
import { CreateOnePronunciationFromSearchForm } from "./CreateOnePronunciationFromSearchForm";

interface WiktionaryPronunciationsTableProps {
  data: CreateOnePronunciationInput[];
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
              <Th>Audio</Th>
              <Th>Notes</Th>
              <Th>To add</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((pron, i) =>
              !pron ? null : (
                <Tr key={i}>
                  <Td style={{ whiteSpace: "pre-wrap" }}>
                    {pron.transcription}
                  </Td>
                  <Td style={{ whiteSpace: "pre-wrap" }}>
                    <Box alignContent="center">
                      {!pron.audioLink ? null : (
                        <audio
                          controls
                          src={pron.audioLink}
                          style={{ width: "100%" }}
                        ></audio>
                      )}
                    </Box>
                  </Td>
                  <Td style={{ whiteSpace: "pre-wrap" }}>{pron.notes}</Td>
                  <Td>
                    <CreateOnePronunciationFromSearchForm
                      pronunciation={pron}
                    />
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
