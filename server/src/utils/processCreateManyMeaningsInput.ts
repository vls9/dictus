import {
  INPUT_FIELD_ELEMENT_INCOMPLETE,
  INPUT_FIELD_ELEMENT_SEPARATOR,
  INPUT_FIELD_SEPARATOR,
} from "../constants.js";
import { EntryInput } from "./createOneEntry.js";
import { NoFieldError } from "./errorTypes.js";

class MeaningInput {
  definition!: string;
  usage!: string;
  imageLink!: string;
  notes!: string;

  constructor(payload: Partial<MeaningInput>) {
    this.definition = payload.definition || "";
    this.usage = payload.usage || "";
    this.imageLink = payload.imageLink || "";
    this.notes = payload.notes || "";
  }
}

const meaningFieldKeyMap = new Map<string, keyof MeaningInput>([
  ["-i", "imageLink"],
  // ["http", "imageLink"],
  ["-u", "usage"],
  // ['"', "usage"],
  // ["'", "usage"],
  ["-d", "definition"],
  ["-n", "notes"],
]);

type ProcessCreateManyMeaningsResponse = {
  entryInputs?: EntryInput[];
  meaningInputs?: MeaningInput[];
  error?: NoFieldError;
};

export const processCreateManyMeaningsInput = (
  oneField: string
): ProcessCreateManyMeaningsResponse => {
  const headwordsRestSplitRegex = /([\s\S]+?)=([\s\S]+)/;
  const headwordsRestSplitMatch = oneField.match(headwordsRestSplitRegex);
  if (!headwordsRestSplitMatch) {
    return {
      error: {
        message: "Cannot split headword and the rest",
      },
    };
  }
  const headwords = headwordsRestSplitMatch[1];
  const rest = headwordsRestSplitMatch[2];
  const fields = rest.split(INPUT_FIELD_SEPARATOR);

  // Process headwords
  const entryInputs = headwords
    .split(INPUT_FIELD_ELEMENT_SEPARATOR)
    .map((item) => ({ headword: item.trim() }));

  // Process meanings
  // Verify that fields are mappable
  const fieldMap = new Map<keyof MeaningInput, string[]>();
  const fieldLengths = new Set<number>();
  fields.forEach((field) => {
    const trimmedField = field.trim();
    const fieldKey = meaningFieldKeyMap.get(trimmedField.slice(0, 2)); // Like "definition" from "-d"
    const fieldsSplit = trimmedField
      .slice(fieldKey ? 2 : 0)
      .trim()
      .split(INPUT_FIELD_ELEMENT_SEPARATOR); // Like ["def1", "def2"]
    fieldLengths.add(fieldsSplit.length);
    fieldMap.set(fieldKey || "definition", fieldsSplit); // Default field
  });

  if (
    fieldLengths.size > 2 ||
    (fieldLengths.size === 2 && !fieldLengths.has(1))
  ) {
    return {
      error: {
        message: `Cannot map form fields to each other. Make sure each field consists of exactly 1 or N elements (separated by "${INPUT_FIELD_ELEMENT_SEPARATOR}")`,
      },
    };
  }
  const maxInputFieldLength = Math.max(...fieldLengths);

  // Build new meaning input objects
  let meaningInputs: MeaningInput[] = [];
  for (let i = 0; i < maxInputFieldLength; i++) {
    const inputMap = new Map<keyof MeaningInput, string>();
    fieldMap.forEach((value, key) => {
      inputMap.set(
        key,
        (value.length === 1 ? value[0] : value[i])
          .trim()
          .replace(INPUT_FIELD_ELEMENT_INCOMPLETE, "")
      );
    });
    meaningInputs.push(new MeaningInput(Object.fromEntries(inputMap)));
  }

  return {
    entryInputs,
    meaningInputs,
  };
};
