import { CheckIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Tooltip, VStack } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useState } from "react";
import { useCreateManyMeaningsMutation } from "../../generated/graphql";
import { createMeaningIdsInLocalStorage } from "../../utils/createMeaningIdsInLocalStorage";
import { toErrorMap } from "../../utils/toErrorMap";
import { ErrorAlert } from "../ErrorAlert";
import { InputField } from "../InputField";
import { OneFieldHelp } from "../OneFieldHelp";

interface CreateManyMeaningsFormProps {}

export const CreateManyMeaningsForm: React.FC<
  CreateManyMeaningsFormProps
> = ({}) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [, createManyMeanings] = useCreateManyMeaningsMutation();
  return (
    <>
      <VStack>
        <HStack mr={2}>
          <OneFieldHelp />

          <Formik
            initialValues={{
              oneField: "",
            }}
            onSubmit={async (values, { resetForm, setErrors }) => {
              setAlertMessage("");

              const response = await createManyMeanings({
                options: { oneField: values.oneField },
              });

              if (response.data?.createManyMeanings.error) {
                setErrors(toErrorMap([response.data.createManyMeanings.error]));
                setAlertMessage("Failed to add new meaning(s)");
              } else {
                resetForm();
                const newIds = response.data?.createManyMeanings.meanings?.map(
                  (m) => m.id
                );
                if (newIds && newIds.length !== 0) {
                  createMeaningIdsInLocalStorage(newIds);
                }
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <HStack width="40vw">
                  <InputField
                    name="oneField"
                    placeholder="Example: 'sea = -d ocean ,, wave ,, expanse || -u heavy seas'"
                    label="One field"
                  />
                  <Tooltip label="Create new meaning">
                    <IconButton
                      aria-label="Create new meaning"
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
        </HStack>
        {alertMessage && <ErrorAlert message={alertMessage} />}
      </VStack>
    </>
  );
};
