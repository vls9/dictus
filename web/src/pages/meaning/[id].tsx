import { DeleteIcon, SettingsIcon } from "@chakra-ui/icons";
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
  PopoverBody,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Select,
  Tooltip,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { EditableDefinition } from "../../components/meaning/EditableDefinition";
import { EditableHeadwordsMeaning } from "../../components/meaning/EditableHeadwordsMeaning";
import { EditableImageLink } from "../../components/meaning/EditableImageLink";
import { EditableNotesMeaning } from "../../components/meaning/EditableNotesMeaning";
import { EditableUsage } from "../../components/meaning/EditableUsage";
import { ReadMeaningPaginationButtons } from "../../components/meaning/ReadOneMeaningPaginationButtons";
import {
  Meaning,
  ReadOneMeaningInput,
  useDeleteMeaningMutation,
  useMeQuery,
  useReadOneMeaningQuery,
} from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { deleteMeaningIdInLocalStorage } from "../../utils/deleteMeaningIdInLocalStorage";
import { formatDate } from "../../utils/formatDate";
import { byToUI } from "../../utils/uiText";

interface MeaningViewProps {}

export const MeaningView: React.FC<MeaningViewProps> = ({}) => {
  // Load current user
  const [isServer, setIsServer] = useState(true);
  useEffect(() => setIsServer(false), []);
  const [{ data: meData, fetching: meFetching }] = useMeQuery({
    pause: isServer, // Do not run on the server
  });

  // Load meaning data
  const [variables, setVariables] = useState<ReadOneMeaningInput>({
    id: -1,
  });
  const [{ data, fetching, error }] = useReadOneMeaningQuery({
    pause: variables.id === -1,
    variables: { options: variables },
  });
  const router = useRouter();
  useEffect(() => {
    setVariables({
      id: typeof router.query.id === "string" ? parseInt(router.query.id) : -1, // Matches id in filename
    });
  }, [router.isReady]);

  const [, deleteMeaning] = useDeleteMeaningMutation();

  // This function sets variables from child component (buttons)
  const setVariablesFromButtons = (newVariables: ReadOneMeaningInput) => {
    setVariables(newVariables);
  };

  const [by, setBy] = useState("updatedAt");

  if (meFetching) {
    return (
      <Layout>
        <Flex>
          <Text>Loading...</Text>
        </Flex>
      </Layout>
    );
  }

  if (!meFetching && !meData?.me) {
    // User not logged in
    return (
      <Layout>
        <Flex>
          <Text>Not logged in!</Text>
        </Flex>
      </Layout>
    );
  }

  if (fetching) {
    return <Layout user={meData?.me}>Loading...</Layout>;
  }

  if (error) {
    return (
      <Layout user={meData?.me}>
        <Box>Could not load meaning</Box>
        <Box>{error.message}</Box>
      </Layout>
    );
  }

  if (data?.readOneMeaning.error) {
    return (
      <Layout user={meData?.me}>
        <Box>Error on loading meaning</Box>
        <Box>{data?.readOneMeaning.error.message}</Box>
      </Layout>
    );
  }

  const meaning = data?.readOneMeaning.meaning;

  return (
    <Layout user={meData?.me}>
      {!meaning ? null : (
        <VStack key={meaning.id} mb={12}>
          <Flex alignItems="center" width="40vw">
            <Box>
              <Heading as="h2" size="xl">
                Meaning
              </Heading>
            </Box>
            <Spacer />
            <Flex>
              <ReadMeaningPaginationButtons
                setVariablesFromButtons={setVariablesFromButtons}
                meaning={meaning}
                by={by}
              />
            </Flex>
            <Spacer />
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
                      value={by}
                      onChange={(event) => {
                        setBy(event.target.value);
                      }}
                    >
                      <option value="createdAt">
                        {byToUI.get("createdAt")}
                      </option>
                      <option value="updatedAt">
                        {byToUI.get("updatedAt")}
                      </option>
                    </Select>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          </Flex>
          <TableContainer width="40vw">
            <Table
              variant="striped"
              colorScheme="gray"
              style={{ tableLayout: "fixed" }}
            >
              <Thead>
                <Tr>
                  <Th>Field</Th>
                  <Th>Content</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Headword</Td>
                  <Td>
                    <EditableHeadwordsMeaning record={meaning} />
                  </Td>
                </Tr>
                <Tr>
                  <Td>Definition</Td>
                  <Td style={{ whiteSpace: "pre-wrap" }}>
                    <EditableDefinition
                      id={meaning.id}
                      definition={meaning.definition}
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>Usage</Td>
                  <Td style={{ whiteSpace: "pre-wrap" }}>
                    <EditableUsage id={meaning.id} usage={meaning.usage} />
                  </Td>
                </Tr>
                <Tr>
                  <Td>Image</Td>
                  <Td>
                    <EditableImageLink
                      id={meaning.id}
                      imageLink={meaning.imageLink}
                      definition={meaning.definition}
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>Notes</Td>
                  <Td style={{ whiteSpace: "pre-wrap" }}>
                    <EditableNotesMeaning
                      id={meaning.id}
                      notes={meaning.notes}
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>Actions</Td>
                  <Td>
                    <Box>
                      <Tooltip label="Delete">
                        <IconButton
                          aria-label="Delete meaning"
                          icon={<DeleteIcon />}
                          onClick={async () => {
                            const response = await deleteMeaning({
                              id: meaning.id,
                            });
                            // Update meaning IDs in localStorage
                            if (
                              response.data?.deleteMeaning.isDeletionComplete
                            ) {
                              const lsDeleteRes = deleteMeaningIdInLocalStorage(
                                meaning.id
                              );
                              if (lsDeleteRes === "noneLeft") {
                                router.replace("/");
                              }

                              // Display next item
                              const cursor =
                                meaning[by as keyof Meaning]?.toString();
                              if (cursor) {
                                setVariables({
                                  pagination: {
                                    cursor,
                                    direction:
                                      lsDeleteRes === "oldestDeleted"
                                        ? "next"
                                        : "previous",
                                    by,
                                  },
                                });
                              }
                            }
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Updated at</Td>
                  <Td>{formatDate(meaning.updatedAt)}</Td>
                </Tr>
                <Tr>
                  <Td>Created at</Td>
                  <Td>{formatDate(meaning.createdAt)}</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <Flex>
            <ReadMeaningPaginationButtons
              setVariablesFromButtons={setVariablesFromButtons}
              meaning={meaning}
              by={by}
            />
          </Flex>
        </VStack>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(MeaningView);
