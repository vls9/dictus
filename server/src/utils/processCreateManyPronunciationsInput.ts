import {
  INPUT_FIELD_ELEMENT_INCOMPLETE,
  INPUT_FIELD_ELEMENT_SEPARATOR,
  INPUT_FIELD_SEPARATOR,
} from "../constants.js";
import { EntryInput } from "./createOneEntry.js";
import { NoFieldError } from "./errorTypes.js";

class PronunciationInput {
  transcription!: string;
  notes!: string;

  constructor(payload: Partial<PronunciationInput>) {
    this.transcription = payload.transcription || "";
    this.notes = payload.notes || "";
  }
}

const pronunciationFieldKeyMap = new Map<string, keyof PronunciationInput>([
  ["-t", "transcription"],
  // ["/", "transcription"],
  // ["[", "transcription"],
]);

type ProcessCreateManyPronunciationsResponse = {
  entryInputs?: EntryInput[];
  pronunciationInputs?: PronunciationInput[];
  error?: NoFieldError;
};

export const processCreateManyPronunciationsInput = (
  oneField: string
): ProcessCreateManyPronunciationsResponse => {
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

  // Process pronunciations
  // Verify that fields are mappable
  const fieldMap = new Map<keyof PronunciationInput, string[]>();
  const fieldLengths = new Set<number>();
  fields.forEach((field) => {
    const trimmedField = field.trim();
    const fieldKey = pronunciationFieldKeyMap.get(trimmedField.slice(0, 2)); // Like "transcription" from "-t"
    const fieldsSplit = trimmedField
      .slice(fieldKey ? 2 : 0)
      .trim()
      .split(INPUT_FIELD_ELEMENT_SEPARATOR); // Like ["def1", "def2"]
    fieldLengths.add(fieldsSplit.length);
    fieldMap.set(fieldKey || "transcription", fieldsSplit); // Default field
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
  let pronunciationInputs: PronunciationInput[] = [];
  for (let i = 0; i < maxInputFieldLength; i++) {
    const inputMap = new Map<keyof PronunciationInput, string>();
    fieldMap.forEach((value, key) => {
      inputMap.set(
        key,
        (value.length === 1 ? value[0] : value[i])
          .trim()
          .replace(INPUT_FIELD_ELEMENT_INCOMPLETE, "")
      );
    });
    pronunciationInputs.push(
      new PronunciationInput(Object.fromEntries(inputMap))
    );
  }

  return {
    entryInputs,
    pronunciationInputs,
  };
};
