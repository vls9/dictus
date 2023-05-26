import { EntityManager } from "typeorm";
import { Entry } from "../entities/Entry.js";
import { EntryInput } from "./createOneEntry.js";
import { NoFieldError } from "./errorTypes.js";

type CreateManyEntriesResponse = {
  entries?: Entry[];
  error?: NoFieldError;
};

export async function createManyEntries(
  entryInputs: EntryInput[],
  em: EntityManager
): Promise<CreateManyEntriesResponse> {
  let entries: Entry[] = [];
  if (entryInputs.length === 1) {
    // One entry
    let entry = await em.findOne(Entry, {
      where: { headword: entryInputs[0].headword },
    });
    if (!entry) {
      // Add new entry
      entry = await em
        .create(Entry, {
          headword: entryInputs[0].headword,
        })
        .save();
    }
    entries.push(entry);
  } else {
    // Multiple entries
    let entriesInDb: Entry[] = [];
    const allNewHeadwords = entryInputs.map((ei) => ei.headword);
    try {
      entriesInDb = await em
        .getRepository(Entry)
        .createQueryBuilder("e")
        .select("e.headword")
        .where("e.headword IN (:hws)", {
          hws: allNewHeadwords,
        })
        .getMany();
    } catch (err) {
      console.error(err);
      return {
        error: {
          message: "Failed to fetch entries from database",
        },
      };
    }
    entries.concat(entriesInDb);
    const headwordsInDb = entriesInDb.map((item) => item.headword);
    const headwordsNotInDb = allNewHeadwords.filter(
      (item) => !headwordsInDb.includes(item)
    );

    for (let headword of headwordsNotInDb) {
      try {
        entries.push(
          await em
            .create(Entry, {
              headword,
            })
            .save()
        );
      } catch (err) {
        console.error(err);
        return {
          error: {
            message: "Failed to insert new entries",
          },
        };
      }
    }
  }
  return { entries };
}
