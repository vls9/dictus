import { Box, Button, Flex, Heading, VStack, Text } from "@chakra-ui/react";
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
import { fetchKaikki } from "../utils/fetch-kaikki/fetchKaikki";
import { parseKaikki, ParseKaikkiResponse } from "../utils/parseKaikki";

interface WiktionaryProps {}

export const Wiktionary: React.FC<WiktionaryProps> = ({}) => {
  // Load current user
  const [isServer, setIsServer] = useState(true);
  useEffect(() => setIsServer(false), []);
  const [{ data: meData, fetching: meFetching }] = useMeQuery({
    pause: isServer, // Do not run on the server
  });

  const [query, setQuery] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [data, setData] = useState<ParseKaikkiResponse["data"]>();

  useEffect(() => {
    if (query) {
      fetchKaikki(query)
        .then((res) => {
          const parsed = parseKaikki(res);
          if (parsed.error) {
            setAlertMessage(parsed.error.message);
          } else {
            setData(parsed.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [query]);

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

  return (
    <Layout user={meData?.me}>
      <Flex alignItems="center" justifyContent="center">
        <VStack>
          <Box>
            <Formik
              initialValues={{ query: "" }}
              onSubmit={(values, { setSubmitting }) => {
                setAlertMessage("");
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
      {!query ? null : (
        <>
          <Flex mb={8}>
            {data?.pronunciationInputs?.length === 0 ? (
              <Box>Pronunciation(s) not found</Box>
            ) : (
              <>
                {!data?.pronunciationInputs ? null : (
                  <VStack>
                    <Flex mt={2} mb={4} alignItems="left">
                      <Box>
                        <Heading as="h2" size="xl" textAlign="center">
                          Pronunciations
                        </Heading>
                      </Box>
                    </Flex>
                    <Flex>
                      <WiktionaryPronunciationsTable
                        data={data.pronunciationInputs}
                      />
                    </Flex>
                  </VStack>
                )}
              </>
            )}
          </Flex>
          <Flex mb={8}>
            {data?.meaningInputs?.length === 0 ? (
              <Box>Meaning(s) not found</Box>
            ) : (
              <>
                {!data?.meaningInputs ? null : (
                  <VStack>
                    <Flex mt={2} mb={4}>
                      <Box>
                        <Heading as="h2" size="xl" textAlign="center">
                          Meanings
                        </Heading>
                      </Box>
                    </Flex>
                    <Flex>
                      <WiktionaryMeaningsTable data={data.meaningInputs} />
                    </Flex>
                  </VStack>
                )}
              </>
            )}
          </Flex>
        </>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Wiktionary);
