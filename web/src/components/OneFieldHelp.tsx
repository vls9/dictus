import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  UnorderedList,
  ListItem,
  Text,
} from "@chakra-ui/react";
import {
  INPUT_FIELD_ELEMENT_SEPARATOR,
  INPUT_FIELD_SEPARATOR,
  INPUT_HEADWORD_SEPARATOR,
} from "../constants";

interface OneFieldHelpProps {}

export const OneFieldHelp: React.FC<OneFieldHelpProps> = ({}) => {
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <IconButton
            aria-label="Show one field help"
            icon={<InfoOutlineIcon />}
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader textAlign="left">One field help</PopoverHeader>
          <PopoverBody textAlign="left">
            <b>Template</b>
            <Text mb={2}>
              <i>[headword]</i> <b>{INPUT_HEADWORD_SEPARATOR}</b> <b>-d</b>{" "}
              <i>[definition1]</i> <b>{INPUT_FIELD_ELEMENT_SEPARATOR}</b>{" "}
              <i>[definition2]</i> <b>{INPUT_FIELD_SEPARATOR}</b> <b>-u</b>{" "}
              <i>[usage1]</i>
            </Text>
            <b>Explanation</b>
            <UnorderedList mb={2}>
              <ListItem>
                <b>{INPUT_HEADWORD_SEPARATOR}</b> separates headword from the
                rest
              </ListItem>
              <ListItem>
                <b>
                  -<i>[x]</i>
                </b>{" "}
                specifies the field type based on its first letter (such as{" "}
                <b>-d</b> for definition)
              </ListItem>
              <ListItem>
                <b>{INPUT_FIELD_SEPARATOR}</b> separates fields (such as
                definition from usage)
              </ListItem>
              <ListItem>
                <b>{INPUT_FIELD_ELEMENT_SEPARATOR}</b> separates elements in
                fields (such as different definitions)
              </ListItem>
            </UnorderedList>
            <b>Tips</b>
            <Text>
              Use <b>{INPUT_FIELD_ELEMENT_SEPARATOR}</b> to map headwords to
              meaning or pronunciation fields. Within these fields, you can only
              map 1 to N, N to 1, or N to N fields (such as 3 definitions to 1
              usage, but not to 2).
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
