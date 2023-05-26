import { CheckIcon } from "@chakra-ui/icons";
import { Flex, HStack, IconButton } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useState } from "react";
import { useCreateOneMeaningMutation } from "../../generated/graphql";
import { createMeaningIdsInLocalStorage } from "../../utils/createMeaningIdsInLocalStorage";
import { toErrorMap } from "../../utils/toErrorMap";
import { ErrorAlert } from "../ErrorAlert";
import { InputField } from "../InputField";

interface CreateOneMeaningFormProps {}

export const CreateOneMeaningForm: React.FC<
  CreateOneMeaningFormProps
> = ({}) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [, createOneMeaning] = useCreateOneMeaningMutation();

  return (
    <>
      <Formik
        initialValues={{
          headword: "",
          definition: "",
          usage: "",
          imageLink: "",
          notes: "",
        }}
        onSubmit={async (values, { resetForm, setErrors }) => {
          setAlertMessage("");
          const response = await createOneMeaning({ options: values });
          console.log("res:", response);

          if (response.data?.createOneMeaning.errors) {
            setErrors(toErrorMap(response.data.createOneMeaning.errors)); // Display errors to user
            setAlertMessage("Failed to add new meaning(s)");
          } else {
            resetForm();
            const newId = response.data?.createOneMeaning.meaning?.id;
            if (newId) {
              createMeaningIdsInLocalStorage([newId]);
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Flex>
              <HStack>
                <InputField
                  name="headword"
                  placeholder="Headword"
                  label="Headword"
                />
                <InputField
                  name="definition"
                  placeholder="Definition"
                  label="Definition"
                />
                <InputField name="usage" placeholder="Usage" label="Usage" />
                <InputField
                  name="imageLink"
                  placeholder="Image link"
                  label="Image link"
                />
                <InputField name="notes" placeholder="Notes" label="Notes" />
                <IconButton
                  aria-label="Create meaning"
                  icon={<CheckIcon />}
                  type="submit"
                  isLoading={isSubmitting}
                  colorScheme="green"
                />
              </HStack>
            </Flex>
          </Form>
        )}
      </Formik>
      {alertMessage && <ErrorAlert message={alertMessage} />}
    </>
  );
};
