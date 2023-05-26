import { Flex, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { TableViewer } from "../components/TableViewer";
import { useMeQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  // Load current user
  const [isServer, setIsServer] = useState(true);
  useEffect(() => setIsServer(false), []);
  const [{ data, fetching }] = useMeQuery({
    pause: isServer, // Do not run on the server
  });
  
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

  // User logged in
  return (
    <Layout user={data?.me}>
      <TableViewer />
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
