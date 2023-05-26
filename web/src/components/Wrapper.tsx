import { Box } from "@chakra-ui/react";

export type WrapperVariant = "small" | "regular";

interface WrapperProps {
  children?: React.ReactNode; // alt.: implicit
  variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box
      mt={8}
      mx="auto"
      // maxW={variant === "regular" ? "800px" : "400px"}
      // maxWidth={variant === "regular" ? "80%" : "40%"}
      // maxW="-moz-fit-content"
      // width="800px"
      width={variant === "regular" ? "80vw" : "40vw"}
      justifyContent="center"
      textAlign="center"
      // alignItems="center"
    >
      {children}
    </Box>
  );
};
