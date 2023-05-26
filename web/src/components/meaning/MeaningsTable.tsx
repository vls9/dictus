import { PlusSquareIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Heading,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Radio,
  RadioGroup,
  Select,
  Stack,
  VStack,
  Text,
  Box,
  Flex,
  Spacer,
  Table,
  TableContainer,
  Th,
  Thead,
  Tr,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  ReadManyMeaningsInput,
  useReadManyMeaningsQuery,
} from "../../generated/graphql";
import { CreateMeaningsViewer } from "./CreateMeaningsViewer";
import { MeaningDownload } from "./MeaningDownload";
import { byToUI, orderToUI } from "../../utils/uiText";
import { ReadManyMeaningsPaginationButtons } from "./ReadManyMeaningsPaginationButtons";
import { MeaningsByMeaningTbody } from "./MeaningsByMeaningTbody";
import { MeaningsByHeadwordTbody } from "./MeaningsByHeadwordTbody";

interface MeaningsTableProps {}

export const MeaningsTable: React.FC<MeaningsTableProps> = ({}) => {
  // Load meaning data
  const [variables, setVariables] = useState<ReadManyMeaningsInput>({
    limit: 10,
    sorting: { by: "updatedAt", order: "DESC" },
  });
  const [{ data, error, fetching }] = useReadManyMeaningsQuery({
    variables: { options: variables },
  });

  const [groupRecordsBy, setGroupRecordsBy] = useState("Definition");

  const [showCreate, setShowCreate] = useState(false);
  const [imagesMode, setImagesMode] = useState("With images");
  useEffect(() => {
    const vars = localStorage.getItem("variables");
    if (vars) {
      setVariables(JSON.parse(vars));
    }

    const sc = localStorage.getItem("showCreate");
    if (sc) {
      setShowCreate(JSON.parse(sc));
    }

    const im = localStorage.getItem("imagesMode");
    if (im) {
      setImagesMode(im);
    }

    const grb = localStorage.getItem("groupRecordsBy");
    if (grb) {
      setGroupRecordsBy(JSON.parse(grb));
    }
  }, []);

  // This function sets variables from child component (buttons)
  const setVariablesFromButtons = (newVariables: ReadManyMeaningsInput) => {
    setVariables(newVariables);
  };

  if (fetching) {
    return <Box>Loading...</Box>;
  }

  if (error) {
    return (
      <Box>
        <Box>Could not load meanings</Box>
        <Box>{error.message}</Box>
      </Box>
    );
  }

  if (data?.readManyMeanings.error) {
    return (
      <Box>
        <Box>Error on loading meanings</Box>
        <Box>{data?.readManyMeanings.error.message}</Box>
      </Box>
    );
  }

  if (!fetching && !data?.readManyMeanings.meanings) {
    return (
      <Box>
        <Box>No meanings found</Box>
      </Box>
    );
  }

  const meanings = data?.readManyMeanings.meanings;
  const firstMeaning = meanings && meanings[0] ? meanings[0] : null;
  const lastMeaning =
    meanings && meanings[meanings.length - 1]
      ? meanings[meanings.length - 1]
      : null;

  return (
    <>
      <VStack mb={12}>
        <Flex alignItems="center" width="80vw">
          <Box>
            <Heading as="h2" size="xl" textAlign="center">
              Meanings
            </Heading>
          </Box>
          <Spacer />
          <Flex>
            <ReadManyMeaningsPaginationButtons
              setVariablesFromButtons={setVariablesFromButtons}
              variables={variables}
              firstMeaning={firstMeaning}
              lastMeaning={lastMeaning}
            />
          </Flex>
          <Spacer />
          <Box>
            <Tooltip label={showCreate ? "Hide form" : "Add meaning(s)"}>
              <IconButton
                mr={2}
                aria-label={showCreate ? "Hide form" : "Add meaning(s)"}
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
                      View
                    </Text>
                    <>
                      <RadioGroup
                        onChange={(value) => {
                          const newImagesMode = value;
                          setImagesMode(newImagesMode);
                          localStorage.setItem(
                            "imagesMode",
                            JSON.stringify(newImagesMode)
                          );
                        }}
                        value={imagesMode}
                        mb={4}
                      >
                        <Stack direction="row">
                          <Radio value="With images">With images</Radio>
                          <Radio value="Without images">Without images</Radio>
                          <Radio value="Images only">Images only</Radio>
                        </Stack>
                      </RadioGroup>
                      <Text mb={2} fontWeight="bold">
                        Group by
                      </Text>
                      <Select
                        mb={2}
                        width="32"
                        value={groupRecordsBy}
                        onChange={() => {
                          const newGroupRecordsBy =
                            groupRecordsBy === "Definition"
                              ? "Headword"
                              : "Definition";
                          setGroupRecordsBy(newGroupRecordsBy);
                          localStorage.setItem(
                            "groupRecordsBy",
                            JSON.stringify(newGroupRecordsBy)
                          );
                        }}
                      >
                        <option value="Definition">Definition</option>
                        <option value="Headword">Headword</option>
                      </Select>
                      <Text mb={2} fontWeight="bold">
                        Download
                      </Text>
                      <MeaningDownload />
                    </>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          </Box>
        </Flex>
        {showCreate ? (
          <Box>
            <CreateMeaningsViewer />
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
                  {imagesMode !== "Images only" ? (
                    <>
                      <Th>Definition</Th>
                      <Th>Usage</Th>
                    </>
                  ) : null}
                  {imagesMode !== "Without images" ? <Th>Image</Th> : null}
                  {imagesMode !== "Images only" ? <Th>Notes</Th> : null}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              {!meanings ? null : (
                <>
                  {groupRecordsBy === "Definition" ? (
                    <MeaningsByMeaningTbody
                      meanings={meanings}
                      imagesMode={imagesMode}
                    />
                  ) : (
                    <MeaningsByHeadwordTbody
                      meanings={meanings}
                      imagesMode={imagesMode}
                    />
                  )}
                </>
              )}
            </Table>
          </TableContainer>
        </Flex>
        <Flex>
          <ReadManyMeaningsPaginationButtons
            setVariablesFromButtons={setVariablesFromButtons}
            variables={variables}
            firstMeaning={firstMeaning}
            lastMeaning={lastMeaning}
          />
        </Flex>
      </VStack>
    </>
  );
};
