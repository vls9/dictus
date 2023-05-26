import { Button, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { CreateOnePronunciationForm } from "./CreateOnePronunciationForm";
import { CreateManyPronunciationsForm } from "./CreateManyPronunciationsForm";

interface CreatePronunciationsViewerProps {}

export const CreatePronunciationsViewer: React.FC<
  CreatePronunciationsViewerProps
> = ({}) => {
  const [isOneField, setIsOneField] = useState(false);
  useEffect(() => {
    const isOne = localStorage.getItem("isOneField");
    if (isOne) {
      setIsOneField(JSON.parse(isOne));
    }
  }, []);
  return (
    <>
      <Button
        mb={4}
        colorScheme="green"
        variant="outline"
        onClick={() => {
          const newIsOneField = !isOneField;
          setIsOneField(newIsOneField);
          localStorage.setItem("isOneField", JSON.stringify(newIsOneField));
        }}
      >
        <Text>Switch to {isOneField ? "many fields" : "one field"}</Text>
      </Button>
      {isOneField ? (
        <CreateManyPronunciationsForm />
      ) : (
        <CreateOnePronunciationForm />
      )}
    </>
  );
};
