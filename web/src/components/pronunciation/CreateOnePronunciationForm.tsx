import { CheckIcon } from "@chakra-ui/icons";
import { Flex, HStack, IconButton } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useState } from "react";
import { useCreateOnePronunciationMutation } from "../../generated/graphql";
import { createPronunciationIdsInLocalStorage } from "../../utils/createPronunciationIdsInLocalStorage";
import { toErrorMap } from "../../utils/toErrorMap";
import { ErrorAlert } from "../ErrorAlert";
import { InputField } from "../InputField";

interface CreateOnePronunciationFormProps {}

export const CreateOnePronunciationForm: React.FC<
  CreateOnePronunciationFormProps
> = ({}) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [, createOnePronunciation] = useCreateOnePronunciationMutation();
  return (
    <>
      <Formik
        initialValues={{
          headword: "",
          transcription: "",
          notes: "",
        }}
        onSubmit={async (values, { resetForm, setErrors }) => {
          setAlertMessage("");
          const response = await createOnePronunciation({ options: values });
          console.log("res:", response);

          if (response.data?.createOnePronunciation.errors) {
            setErrors(toErrorMap(response.data.createOnePronunciation.errors));
            setAlertMessage("Failed to add new pronunciation(s)");
          } else {
            resetForm();
            const newId =
              response.data?.createOnePronunciation.pronunciation?.id;
            if (newId) {
              createPronunciationIdsInLocalStorage([newId]);
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
                  name="transcription"
                  placeholder="Transcription"
                  label="Transcription"
                />
                <InputField name="notes" placeholder="Notes" label="Notes" />
                <IconButton
                  aria-label="Create pronunciation"
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
