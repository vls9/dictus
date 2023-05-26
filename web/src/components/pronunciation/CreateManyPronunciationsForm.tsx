import { CheckIcon } from "@chakra-ui/icons";
import { Box, Flex, HStack, IconButton, Tooltip } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useState } from "react";
import { useCreateManyPronunciationsMutation } from "../../generated/graphql";
import { createPronunciationIdsInLocalStorage } from "../../utils/createPronunciationIdsInLocalStorage";
import { toErrorMap } from "../../utils/toErrorMap";
import { ErrorAlert } from "../ErrorAlert";
import { InputField } from "../InputField";
import { OneFieldHelp } from "../OneFieldHelp";

interface CreateManyPronunciationsFormProps {}

export const CreateManyPronunciationsForm: React.FC<
  CreateManyPronunciationsFormProps
> = ({}) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [, createPronunciations] = useCreateManyPronunciationsMutation();
  return (
    <>
      <Flex>
        <Box mr={2}>
          <OneFieldHelp />
        </Box>
        <Formik
          initialValues={{
            oneField: "",
          }}
          onSubmit={async (values, { resetForm, setErrors }) => {
            setAlertMessage("");

            // Required for one field input only
            const transformedValues = values.oneField as any;

            const response = await createPronunciations({
              options: transformedValues,
            });

            if (response.data?.createManyPronunciations.error) {
              setErrors(
                toErrorMap([response.data.createManyPronunciations.error])
              );
              setAlertMessage("Failed to add new pronunciation(s)");
            } else {
              resetForm();
              const newIds =
                response.data?.createManyPronunciations.pronunciations?.map(
                  (p) => p.id
                );
              if (newIds && newIds.length !== 0) {
                createPronunciationIdsInLocalStorage(newIds);
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <HStack width="40vw">
                <InputField
                  name="oneField"
                  placeholder="Example: 'sea = -t /siː/ ,, /seɪ/ || -n /seɪ/ is obsolete'"
                  label="One field"
                />
                <Tooltip label="Create new pronunciation">
                  <IconButton
                    aria-label="Create new pronunciation"
                    icon={<CheckIcon />}
                    type="submit"
                    isLoading={isSubmitting}
                    colorScheme="green"
                  />
                </Tooltip>
              </HStack>
            </Form>
          )}
        </Formik>
        {alertMessage && <ErrorAlert message={alertMessage} />}
      </Flex>
    </>
  );
};
