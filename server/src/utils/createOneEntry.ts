import { AppDataSource } from "../data-source.js";
import { Entry } from "../entities/Entry.js";
import { NoFieldError } from "../types.js";

export type EntryInput = {
  headword: string;
};

type CreateOneEntryResponse = {
  entry?: Entry;
  error?: NoFieldError;
};

export async function createOneEntry(
  entryInput: EntryInput
): Promise<CreateOneEntryResponse> {
  // Insert or select entry
  let entry;
  try {
    const result = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Entry)
      .values(entryInput)
      .orIgnore()
      .returning("*")
      .execute();
    if (!result.raw[0]) {
      entry = await Entry.findOne({
        where: entryInput,
      });
    } else {
      entry = result.raw[0];
    }
  } catch (err) {
    return {
      error: { message: "Failed to insert entry" },
    };
  }
  return { entry };
}
