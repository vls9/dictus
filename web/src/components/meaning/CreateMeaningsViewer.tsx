import { Button, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CreateOneMeaningForm } from "./CreateOneMeaningForm";
import { CreateManyMeaningsForm } from "./CreateManyMeaningsForm";

interface CreateMeaningsViewerProps {}

export const CreateMeaningsViewer: React.FC<
  CreateMeaningsViewerProps
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
      {isOneField ? <CreateManyMeaningsForm /> : <CreateOneMeaningForm />}
    </>
  );
};
