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
import { NewMeaning } from "../../pages/wiktionary";
import { CreateMeaningFromSearchForm } from "./CreateMeaningFromSearchForm";

interface WiktionaryMeaningsTableProps {
  data: NewMeaning[];
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
              {/* <Th>Notes</Th> */}
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
                  {/* <Td>{meaning.notes}</Td> */}
                  <Td>
                    <CreateMeaningFromSearchForm meaning={meaning} />
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
