import { Box, Button, Flex, Heading, VStack, Text } from "@chakra-ui/react";
import axios from "axios";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useEffect, useState } from "react";
import { ErrorAlert } from "../components/ErrorAlert";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { WiktionaryMeaningsTable } from "../components/meaning/WiktionaryMeaningsTable";
import { WiktionaryPronunciationsTable } from "../components/pronunciation/WiktionaryPronunciationsTable";
import { useMeQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { parseWiktionaryMeanings } from "../utils/parseWiktionaryMeanings";
import { parseWiktionaryPronunciations } from "../utils/parseWiktionaryPronunciations";

interface WiktionaryProps {}

export type NewPronunciation = {
  headword: string;
  transcription: string;
  notes: string;
};

export type NewMeaning = {
  headword: string;
  definition: string;
  usage: string;
  imageLink: string;
  notes: string;
};

export const Wiktionary: React.FC<WiktionaryProps> = ({}) => {
  // Load current user
  const [isServer, setIsServer] = useState(true);
  useEffect(() => setIsServer(false), []);
  const [{ data, fetching }] = useMeQuery({
    pause: isServer, // Do not run on the server
  });

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [pronData, setPronData] = useState<NewPronunciation[] | null>(null);
  // const [meanData, setMeanData] = useState<NewMeaning[] | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  useEffect(() => {
    if (query) {
      const url = `https://en.wiktionary.org/w/api.php?format=json&action=query&titles=${query}&prop=revisions&rvprop=content&rvslots=*&redirects=1&origin=*&callback=?`;

      axios
        .get(url)
        .then((response) => {
          try {
            // Parse page, page title and content
            const rawDataJson = JSON.parse(
              response.data.slice(5, response.data.length - 1)
            );
            const pages = rawDataJson.query.pages;
            const pageId = Object.keys(pages)[0];
            const page = pages[pageId];
            const title = page.title;
            const pageContent = page.revisions[0].slots.main["*"];
            const parsedProns = parseWiktionaryPronunciations(
              pageContent,
              title
            );
            // const parsedMeanings = parseWiktionaryMeanings(pageContent, title);
            setPronData(parsedProns);
            // setMeanData(parsedMeanings);
          } catch (err) {
            console.error(err);
            setAlertMessage("No search results");
          }
        })
        .catch((err) => {
          console.error(err);
          setAlertMessage(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query]);

  if (fetching) {
    return (
      <Layout>
        <Flex>
          <Text>Loading...</Text>
        </Flex>
      </Layout>
    );
  }

  if (!fetching && !data?.me) {
    // User not logged in
    return (
      <Layout>
        <Flex>
          <Text>Not logged in!</Text>
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout user={data?.me}>
      <Flex alignItems="center" justifyContent="center">
        <VStack>
          <Box>
            <Formik
              initialValues={{ query: "" }}
              onSubmit={(values, { setSubmitting }) => {
                setAlertMessage("")
                setQuery(values.query);
                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Box>
                    <InputField
                      name="query"
                      label="Query"
                      placeholder="Search Wiktionary"
                    />
                  </Box>
                  <Box>
                    <Button
                      mt={4}
                      type="submit"
                      colorScheme="teal"
                      isLoading={isSubmitting}
                    >
                      Search
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
          <Box>{alertMessage && <ErrorAlert message={alertMessage} />}</Box>
        </VStack>
      </Flex>
      {!query ? (
        <>
          <Box>No data</Box>
        </>
      ) : (
        <>
          <Flex mb={8}>
            {!loading && !pronData ? (
              <>
                <Box>Pronunciation(s) not found</Box>
              </>
            ) : (
              <>
                {!pronData ? null : (
                  <VStack>
                    <Flex mt={2} mb={4} alignItems="left">
                      <Box>
                        <Heading as="h2" size="xl" textAlign="center">
                          Pronunciations
                        </Heading>
                      </Box>
                    </Flex>
                    <Flex>
                      <WiktionaryPronunciationsTable data={pronData} />
                    </Flex>
                  </VStack>
                )}
              </>
            )}
          </Flex>
          <Flex mb={8}>
            {/* {!loading && !meanData ? (
            <>
              <div>Meaning(s) not found</div>
            </>
          ) : (
            <>
              {!meanData ? null : (
                <VStack>
                  <Flex mt={2} mb={4}>
                    <Box>
                      <Heading as="h2" size="xl" textAlign="center">
                        Meanings
                      </Heading>
                    </Box>
                  </Flex>
                  <Flex>
                    <WiktionaryMeaningsTable data={meanData} />
                  </Flex>
                </VStack>
              )}
            </>
          )} */}
          </Flex>
        </>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Wiktionary);
