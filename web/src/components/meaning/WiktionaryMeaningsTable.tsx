import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
} from "@chakra-ui/react";
import { CreateOneMeaningInput } from "../../generated/graphql";
import { CreateOneMeaningFromSearchForm } from "./CreateOneMeaningFromSearchForm";

interface WiktionaryMeaningsTableProps {
  data: CreateOneMeaningInput[];
}

export const WiktionaryMeaningsTable: React.FC<
  WiktionaryMeaningsTableProps
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
              <Th>Definition</Th>
              <Th>Usage</Th>
              <Th>Notes</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((meaning, i) =>
              !meaning ? null : (
                <Tr key={i}>
                  <Td style={{ whiteSpace: "pre-wrap" }}>
                    {meaning.definition}
                  </Td>
                  <Td style={{ whiteSpace: "pre-wrap" }}>
                    <Text fontStyle="italic">{meaning.usage}</Text>
                  </Td>
                  <Td style={{ whiteSpace: "pre-wrap" }}>{meaning.notes}</Td>
                  <Td>
                    <CreateOneMeaningFromSearchForm meaning={meaning} />
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
