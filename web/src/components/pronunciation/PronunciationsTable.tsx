import { SettingsIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Text,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Select,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  ReadManyPronunciationsInput,
  useReadManyPronunciationsQuery,
} from "../../generated/graphql";
import { byToUI, orderToUI } from "../../utils/uiText";
import { CreatePronunciationsViewer } from "./CreatePronunciationsViewer";
import { DeletePronunciationBasicButton } from "./DeletePronunciationBasicButton";
import { EditableHeadwordPronunciation } from "./EditableHeadwordPronunciation";
import { EditableNotesPronunciation } from "./EditableNotesPronunciation";
import { EditableTranscription } from "./EditableTranscription";
import { OpenPronunciationInNewPageButton } from "./OpenPronunciationInNewPageButton";
import { PronunciationDownload } from "./PronunciationDownload";
import { ReadManyPronunciationsPaginationButtons } from "./ReadManyPronunciationsPaginationButtons";

interface PronunciationsTableProps {}

export const PronunciationsTable: React.FC<PronunciationsTableProps> = ({}) => {
  // Load pronunciation data
  const [variables, setVariables] = useState<ReadManyPronunciationsInput>({
    limit: 10,
    sorting: { by: "updatedAt", order: "DESC" },
  });
  const [{ data, error, fetching }] = useReadManyPronunciationsQuery({
    variables: { options: variables },
  });

  const [showCreate, setShowCreate] = useState(false);
  useEffect(() => {
    const vars = localStorage.getItem("variables");
    if (vars) {
      setVariables(JSON.parse(vars));
    }

    const sc = localStorage.getItem("showCreate");
    if (sc) {
      setShowCreate(JSON.parse(sc));
    }
  }, []);

  // This function sets variables from child component (buttons)
  const setVariablesFromButtons = (
    newVariables: ReadManyPronunciationsInput
  ) => {
    setVariables(newVariables);
  };

  if (fetching) {
    return <Box>Loading...</Box>;
  }

  if (error) {
    return (
      <Box>
        <Box>Could not load pronunciations</Box>
        <Box>{error.message}</Box>
      </Box>
    );
  }

  if (data?.readManyPronunciations.error) {
    return (
      <Box>
        <Box>Error on loading pronunciations</Box>
        <Box>{data.readManyPronunciations.error.message}</Box>
      </Box>
    );
  }

  const pronunciations = data?.readManyPronunciations.pronunciations;
  const firstPronunciation =
    pronunciations && pronunciations[0] ? pronunciations[0] : null;
  const lastPronunciation =
    pronunciations && pronunciations[pronunciations.length - 1]
      ? pronunciations[pronunciations.length - 1]
      : null;

  return (
    <>
      <VStack>
        <Flex alignItems="center" width="80vw">
          <Box>
            <Heading as="h2" size="xl" textAlign="center">
              Pronunciations
            </Heading>
          </Box>
          <Spacer />
          <Flex>
            <ReadManyPronunciationsPaginationButtons
              setVariablesFromButtons={setVariablesFromButtons}
              variables={variables}
              firstPronunciation={firstPronunciation}
              lastPronunciation={lastPronunciation}
            />
          </Flex>
          <Spacer />
          <Box>
            <Tooltip label={showCreate ? "Hide form" : "Add pronunciation(s)"}>
              <IconButton
                mr={2}
                aria-label={showCreate ? "Hide form" : "Add pronunciation(s)"}
                icon={<PlusSquareIcon />}
                variant="outline"
                colorScheme="green"
                onClick={() => {
                  setShowCreate(!showCreate);
                }}
              />
            </Tooltip>
            <Popover>
              <PopoverTrigger>
                <IconButton
                  aria-label="Show display settings"
                  icon={<SettingsIcon />}
                  colorScheme="green"
                />
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverHeader>Settings</PopoverHeader>
                  <PopoverCloseButton />
                  <PopoverBody>
                    <Text mb={2} fontWeight="bold">
                      Sort
                    </Text>
                    <Select
                      mb={2}
                      width="48"
                      value={variables.sorting.by}
                      onChange={(event) => {
                        const newVariables = {
                          limit: variables.limit,
                          sorting: {
                            by: event.target.value,
                            order: variables.sorting.order,
                          },
                        };
                        setVariables(newVariables); // This resets the cursor
                        localStorage.setItem(
                          "variables",
                          JSON.stringify(newVariables)
                        );
                      }}
                    >
                      <option value="createdAt">
                        {byToUI.get("createdAt")}
                      </option>
                      <option value="updatedAt">
                        {byToUI.get("updatedAt")}
                      </option>
                    </Select>
                    <Select
                      mb={2}
                      width="32"
                      value={variables.sorting.order}
                      onChange={(event) => {
                        const newVariables = {
                          limit: variables.limit,
                          sorting: {
                            by: variables.sorting.by,
                            order: event.target.value,
                          },
                        };
                        setVariables(newVariables);
                        localStorage.setItem(
                          "variables",
                          JSON.stringify(newVariables)
                        );
                      }}
                    >
                      <option value="ASC">{orderToUI.get("ASC")}</option>
                      <option value="DESC">{orderToUI.get("DESC")}</option>
                    </Select>
                    <Select
                      mb={2}
                      width="24"
                      value={variables.limit}
                      onChange={(event) => {
                        const newVariables = {
                          limit: parseInt(event.target.value),
                          sorting: {
                            by: variables.sorting.by,
                            order: variables.sorting.order,
                          },
                        };
                        setVariables(newVariables);
                        localStorage.setItem(
                          "variables",
                          JSON.stringify(newVariables)
                        );
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </Select>
                    <Text mb={2} fontWeight="bold">
                      Download
                    </Text>
                    <PronunciationDownload />
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          </Box>
        </Flex>
        {showCreate ? (
          <Box>
            <CreatePronunciationsViewer />
          </Box>
        ) : null}

        <Flex mt={2}>
          <TableContainer width="100%">
            <Table
              variant="striped"
              colorScheme="gray"
              style={{ tableLayout: "fixed" }}
            >
              <Thead>
                <Tr>
                  <Th>Headword(s)</Th>
                  <Th>Transcription</Th>
                  <Th>Notes</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              {!pronunciations ? null : (
                <>
                  <Tbody>
                    {pronunciations.map((pronunciation) =>
                      !pronunciation ? null : (
                        <Tr key={pronunciation.id}>
                          <Td style={{ whiteSpace: "pre-wrap" }}>
                            <EditableHeadwordPronunciation
                              headword={pronunciation.entry.headword}
                              entryId={pronunciation.entry.id}
                              recordId={pronunciation.id}
                            />
                          </Td>
                          <Td style={{ whiteSpace: "pre-wrap" }}>
                            <EditableTranscription
                              id={pronunciation.id}
                              transcription={pronunciation.transcription}
                            />
                          </Td>
                          <Td style={{ whiteSpace: "pre-wrap" }}>
                            <EditableNotesPronunciation
                              id={pronunciation.id}
                              notes={pronunciation.notes}
                            />
                          </Td>
                          <Td>
                            <Box mb={2}>
                              <OpenPronunciationInNewPageButton
                                id={pronunciation.id}
                              />
                            </Box>
                            <Box>
                              <DeletePronunciationBasicButton
                                id={pronunciation.id}
                              />
                            </Box>
                          </Td>
                        </Tr>
                      )
                    )}
                  </Tbody>
                </>
              )}
            </Table>
          </TableContainer>
        </Flex>
        <Flex>
          <ReadManyPronunciationsPaginationButtons
            setVariablesFromButtons={setVariablesFromButtons}
            variables={variables}
            firstPronunciation={firstPronunciation}
            lastPronunciation={lastPronunciation}
          />
        </Flex>
      </VStack>
    </>
  );
};
