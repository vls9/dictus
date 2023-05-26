import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";
import NextLink from "next/link";
import { Layout } from "../../components/Layout";

const ChangePassword: NextPage = () => {
  const [tokenError, setTokenError] = useState("");
  const router = useRouter();
  console.log(router.query);
  const [, changePassword] = useChangePasswordMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            options: {
              newPassword: values.newPassword,
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            },
          });
          if (response.data?.changePassword.errors) {
            // Show errors
            const errorMap = toErrorMap(response.data.changePassword.errors);
            // If token error
            if ("token" in errorMap) {
              // Pass error message for token
              setTokenError(errorMap.token);
            }
            // Set errors anyway in case there's both token and password error
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box>
              <InputField
                name="newPassword"
                placeholder="New Password"
                label="New Password"
                type="password"
              />
            </Box>
            {tokenError ? (
              // When token expired
              <Flex>
                <Box color="red" mr={2}>
                  {tokenError}
                </Box>
                <NextLink href="/forgot-password">
                  <Text _hover={{ "text-decoration": "underline" }}>
                    Reset password again
                  </Text>
                </NextLink>
              </Flex>
            ) : null}
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Change password
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePassword);
