import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { RegularUserFragment, useLogoutMutation } from "../generated/graphql";

interface NavBarProps {
  user: RegularUserFragment | null;
}

export const NavBar: React.FC<NavBarProps> = ({ user }) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let body = null;
  if (!user) {
    body = (
      <Flex>
        <HStack>
          <Box>
            <NextLink href="/login">
              <Text _hover={{ textDecoration: "underline" }}>Login</Text>
            </NextLink>
          </Box>
          <Box mr={2}>
            <NextLink href="/register">
              <Text _hover={{ textDecoration: "underline" }}>Register</Text>
            </NextLink>
          </Box>
        </HStack>
      </Flex>
    );
    // User is logged in
  } else {
    body = (
      <Flex align="center">
        <Box mr={4}>
          <NextLink href="/wiktionary">
            <Text
              _hover={{ textDecoration: "underline" }}
              color="gray.600"
              fontWeight="bold"
            >
              Wiktionary
            </Text>
          </NextLink>
        </Box>
        <Box mr={4}>User: {user.username}</Box>
        <Button
          onClick={async () => {
            await logout({});
            localStorage.clear();
          }}
          isLoading={logoutFetching}
          variant="solid"
          colorScheme="blackAlpha"
        >
          Log out
        </Button>
      </Flex>
    );
  }
  return (
    <Flex
      zIndex="sticky"
      opacity={1}
      position="sticky"
      top={0}
      bg="gray.300"
      p={4}
      ml={"auto"}
      align="center"
    >
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Heading size="lg" _hover={{ textDecoration: "underline" }}>
            Dictus
          </Heading>
        </NextLink>
        <Badge
          ml={1}
          variant="solid"
          colorScheme="purple"
          fontSize="md"
          borderRadius="md"
        >
          BETA
        </Badge>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};

export default NavBar;
