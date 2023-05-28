import { PlusSquareIcon } from "@chakra-ui/icons";
import { Tooltip, IconButton } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useState } from "react";
import {
  CreateOneMeaningInput,
  useCreateOneMeaningMutation,
} from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { ErrorAlert } from "../ErrorAlert";

interface CreateOneMeaningFromSearchFormProps {
  meaning: CreateOneMeaningInput;
}

export const CreateOneMeaningFromSearchForm: React.FC<
  CreateOneMeaningFromSearchFormProps
> = ({ meaning }) => {
  const [, createOneMeaning] = useCreateOneMeaningMutation();
  const [alertMessage, setAlertMessage] = useState("");

  return (
    <>
      <Formik
        initialValues={{
          headword: meaning.headword,
          definition: meaning.definition,
          usage: meaning.usage,
          imageLink: meaning.imageLink,
          notes: meaning.notes,
        }}
        onSubmit={async (values, { setErrors }) => {
          setAlertMessage(""); // Clear previous alert message
          const response = await createOneMeaning({ options: values });
          if (response.data?.createOneMeaning.errors) {
            setErrors(toErrorMap(response.data.createOneMeaning.errors));
            setAlertMessage("Failed to add new pronunciation(s)");
          }
        }}
        enableReinitialize={true}
      >
        {({ isSubmitting }) => (
          <Form>
            <Tooltip label="Add meaning">
              <IconButton
                aria-label="Create meaning"
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
