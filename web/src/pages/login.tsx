import React from "react";
import { Form, Formik } from "formik";
import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { Layout } from "../components/Layout";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Layout variant="small">
      <Flex alignItems="center" justifyContent="center">
        <Box>
          <Formik
            initialValues={{ usernameOrEmail: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
              const response = await login(values);
              if (response.data?.login.errors) {
                setErrors(toErrorMap(response.data.login.errors));
              } else if (response.data?.login.user) {
                // If login successful, do this
                if (typeof router.query.next === "string") {
                  router.push(router.query.next);
                } else {
                  router.push("/");
                }
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Box>
                  <InputField
                    name="usernameOrEmail"
                    placeholder="Username or email"
                    label="Username or email"
                  />
                </Box>
                <Box mt={4}>
                  <InputField
                    name="password"
                    placeholder="Password"
                    label="Password"
                    type="password"
                  />
                </Box>
                <Flex>
                  <Button
                    mt={4}
                    type="submit"
                    colorScheme="teal"
                    isLoading={isSubmitting}
                  >
                    Login
                  </Button>
                  <Spacer />
                  <Box mt={1} textAlign="right">
                    <NextLink href="/forgot-password">
                      <Text _hover={{ textDecoration: "underline" }}>
                        Forgot password?
                      </Text>
                    </NextLink>
                  </Box>
                </Flex>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Layout>
  );
};

// export default Login;
export default withUrqlClient(createUrqlClient, { ssr: false })(Login);
