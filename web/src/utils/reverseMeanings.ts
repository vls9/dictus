import { Entry, Meaning } from "../generated/graphql";

export const reverseMeanings = (meanings: Meaning[]) => {
  let entryIdToEntryMap = new Map<number, Entry>([]);
  meanings.forEach((meaning) => {
    // entries = new Set([...entries, ...meaning.entries])
    const { entries: _, ...meaningWithoutEntries } = meaning;
    meaning.entries.forEach((entry) => {
      if (entryIdToEntryMap.has(entry.id)) {
        // entryIdToEntryMap.set(entry.id)
        const newEntry = entryIdToEntryMap.get(entry.id);
        if (newEntry) {
          newEntry.meanings?.push(meaningWithoutEntries as Meaning);
          entryIdToEntryMap.set(entry.id, newEntry);
        }
      } else {
        entryIdToEntryMap.set(entry.id, {
          ...entry,
          meanings: [meaningWithoutEntries as Meaning],
        });
      }
    });
  });
  return Array.from(entryIdToEntryMap.values());
};
