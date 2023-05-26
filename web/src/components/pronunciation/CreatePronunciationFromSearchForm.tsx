import { PlusSquareIcon } from "@chakra-ui/icons";
import { IconButton, Tooltip } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useCreateOnePronunciationMutation } from "../../generated/graphql";
import { NewPronunciation } from "../../pages/wiktionary";
import { toErrorMap } from "../../utils/toErrorMap";
import { ErrorAlert } from "../ErrorAlert";

interface CreatePronunciationFromSearchFormProps {
  pronunciation: NewPronunciation;
}

export const CreatePronunciationFromSearchForm: React.FC<
  CreatePronunciationFromSearchFormProps
> = ({ pronunciation }) => {
  const [, createOnePronunciation] = useCreateOnePronunciationMutation();
  const [alertMessage, setAlertMessage] = useState("");

  return (
    <>
      <Formik
        initialValues={{
          headword: pronunciation.headword,
          transcription: pronunciation.transcription,
          notes: pronunciation.notes,
        }}
        onSubmit={async (values, { setErrors }) => {
          setAlertMessage(""); // Clear previous alert message
          const response = await createOnePronunciation({ options: values });
          if (response.data?.createOnePronunciation.errors) {
            setErrors(toErrorMap(response.data.createOnePronunciation.errors));
            setAlertMessage("Failed to add new pronunciation(s)");
          }
        }}
        enableReinitialize={true}
      >
        {({ isSubmitting }) => (
          <Form>
            <Tooltip label="Add pronunciation">
              <IconButton
                aria-label="Create pronunciation"
                icon={<PlusSquareIcon />}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="green"
              />
            </Tooltip>
          </Form>
        )}
      </Formik>
      {alertMessage && <ErrorAlert message={alertMessage} />}
    </>
  );
};
