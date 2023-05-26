import { useEffect, useState } from "react";
import { MeaningsTable } from "./meaning/MeaningsTable";
import { PronunciationsTable } from "./pronunciation/PronunciationsTable";
import { Box, Button, Text } from "@chakra-ui/react";

interface TableViewerProps {}

export const TableViewer: React.FC<TableViewerProps> = ({}) => {
  const [table, setTable] = useState("M");
  useEffect(() => {
    const tbl = localStorage.getItem("table");
    if (tbl) {
      setTable(tbl);
    }
  }, []);

  return (
    <>
      <Box mb={2}>
        <Button
          mr={2}
          colorScheme="green"
          variant="outline"
          onClick={() => {
            const newTable = table === "M" ? "P" : "M";
            setTable(newTable);
            localStorage.setItem("table", newTable);
          }}
        >
          <Text>Switch to {table === "M" ? "pronunciations" : "meanings"}</Text>
        </Button>
      </Box>
      {table === "M" ? <MeaningsTable /> : <PronunciationsTable />}
    </>
  );
};
