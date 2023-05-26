import React from "react";
import { Form, Formik } from "formik";
import { Box, Button, Flex } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";
import { withUrqlClient } from "next-urql";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Layout variant="small">
      <Flex alignItems="center" justifyContent="center">
        <Box>
          <Formik
            initialValues={{ email: "", username: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
              const response = await register({ options: values });
              if (response.data?.register.errors) {
                setErrors(toErrorMap(response.data.register.errors));
              } else if (response.data?.register.user) {
                // If worked
                router.push("/");
              }
              // return register(values);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Box>
                  <InputField name="email" placeholder="Email" label="Email" />
                </Box>
                <Box mt={4}>
                  <InputField
                    name="username"
                    placeholder="Username"
                    label="Username"
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
                <Button
                  mt={4}
                  type="submit"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                >
                  Register
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Layout>
  );
};

// export default Register;
export default withUrqlClient(createUrqlClient, { ssr: false })(Register);
