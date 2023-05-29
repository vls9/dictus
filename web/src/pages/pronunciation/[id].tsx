import { DeleteIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
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
  Select,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { EditableAudioLink } from "../../components/pronunciation/EditableAudioLink";
import { EditableHeadwordPronunciation } from "../../components/pronunciation/EditableHeadwordPronunciation";
import { EditableNotesPronunciation } from "../../components/pronunciation/EditableNotesPronunciation";
import { EditableTranscription } from "../../components/pronunciation/EditableTranscription";
import { ReadPronunciationPaginationButtons } from "../../components/pronunciation/ReadOnePronunciationPaginationButtons";
import {
  Pronunciation,
  ReadOnePronunciationInput,
  useDeletePronunciationMutation,
  useMeQuery,
  useReadOnePronunciationQuery,
} from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { deletePronunciationIdInLocalStorage } from "../../utils/deletePronunciationIdInLocalStorage";
import { formatDate } from "../../utils/formatDate";
import { byToUI } from "../../utils/uiText";

interface PronunciationViewProps {}

export const PronunciationView: React.FC<PronunciationViewProps> = ({}) => {
  // Load current user
  const [isServer, setIsServer] = useState(true);
  useEffect(() => setIsServer(false), []);
  const [{ data: meData, fetching: meFetching }] = useMeQuery({
    pause: isServer, // Do not run on the server
  });

  // Load pronunciation data
  const [variables, setVariables] = useState<ReadOnePronunciationInput>({
    id: -1,
  });
  const [{ data, fetching, error }] = useReadOnePronunciationQuery({
    pause: variables.id === -1,
    variables: { options: variables },
  });
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      const vars = localStorage.getItem("oneVariables");
      setVariables({
        id:
          typeof router.query.id === "string" ? parseInt(router.query.id) : -1,
      });
    }
  }, [router.isReady]);

  const [, deletePronunciation] = useDeletePronunciationMutation();

  // This function sets variables from child component (buttons)
  const setVariablesFromButtons = (newVariables: ReadOnePronunciationInput) => {
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
        <Box>Could not load pronunciation</Box>
        <Box>{error.message}</Box>
      </Layout>
    );
  }

  if (data?.readOnePronunciation.error) {
    return (
      <Layout user={meData?.me}>
        <Box>Error on loading pronunciation</Box>
        <Box>{data?.readOnePronunciation.error?.message}</Box>
      </Layout>
    );
  }

  const pronunciation = data?.readOnePronunciation.pronunciation;

  return (
    <Layout user={meData?.me}>
      {!pronunciation ? null : (
        <VStack key={pronunciation.id} mb={12}>
          <Flex alignItems="center" width="40vw">
            <Box>
              <Heading as="h2" size="xl">
                Pronunciation
              </Heading>
            </Box>
            <Spacer />
            <Flex>
              <ReadPronunciationPaginationButtons
                setVariablesFromButtons={setVariablesFromButtons}
                variables={variables}
                by={by}
                pronunciation={pronunciation}
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
                    <EditableHeadwordPronunciation
                      headword={pronunciation.entry.headword}
                      recordId={pronunciation.id}
                      entryId={pronunciation.entry.id}
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>Transcription</Td>
                  <Td style={{ whiteSpace: "pre-wrap" }}>
                    <EditableTranscription
                      id={pronunciation.id}
                      transcription={pronunciation.transcription}
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td style={{ whiteSpace: "pre-wrap" }}>Audio</Td>
                  <Td>
                    <EditableAudioLink
                      id={pronunciation.id}
                      audioLink={pronunciation.audioLink}
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>Notes</Td>
                  <Td style={{ whiteSpace: "pre-wrap" }}>
                    <EditableNotesPronunciation
                      id={pronunciation.id}
                      notes={pronunciation.notes}
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>Actions</Td>
                  <Td>
                    <Box>
                      <Tooltip label="Delete pronunciation">
                        <IconButton
                          aria-label="Delete pronunciation"
                          icon={<DeleteIcon />}
                          onClick={async () => {
                            const response = await deletePronunciation({
                              id: pronunciation.id,
                            });
                            // Update pronunciation IDs in localStorage
                            if (
                              response.data?.deletePronunciation
                                .isDeletionComplete
                            ) {
                              const lsDeleteRes =
                                deletePronunciationIdInLocalStorage(
                                  pronunciation.id
                                );
                              if (lsDeleteRes === "noneLeft") {
                                router.replace("/");
                              }

                              // Display next item
                              const cursor =
                                pronunciation[
                                  by as keyof Pronunciation
                                ]?.toString();
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
                  <Td>{formatDate(pronunciation.updatedAt)}</Td>
                </Tr>
                <Tr>
                  <Td>Created at</Td>
                  <Td>{formatDate(pronunciation.createdAt)}</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <Flex>
            <ReadPronunciationPaginationButtons
              setVariablesFromButtons={setVariablesFromButtons}
              variables={variables}
              by={by}
              pronunciation={pronunciation}
            />
          </Flex>
        </VStack>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(
  PronunciationView
);
