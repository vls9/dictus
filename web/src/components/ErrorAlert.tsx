import { Alert, AlertIcon, Box, Flex, Text } from "@chakra-ui/react";

interface ErrorAlertProps {
  message: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  return (
    <Flex mt={2}>
      <Alert status="error" pr={4}>
        <AlertIcon />
        <Box><Text style={{ whiteSpace: "pre-wrap" }}>{message}</Text></Box>
        
      </Alert>
    </Flex>
  );
};
