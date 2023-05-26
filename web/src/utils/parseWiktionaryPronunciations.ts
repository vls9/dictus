import { NewPronunciation } from "../pages/wiktionary";

export const parseWiktionaryPronunciations = (
  content: string,
  headword: string
): NewPronunciation[] | null => {
  console.log("content:", content);
  // Limit scope to English only
  const engRegex = /(==English==)([\s\S]+?)([^=]==[^=]|$)/;
  const engMatch = content.match(engRegex);
  if (!engMatch) {
    console.error("Could not find English section");
    return null;
  }
  console.log("eng match pron", engMatch);
  const pronRegex = /(===Pronunciation===)([\s\S]+?)(===)/;
  const pronMatch = engMatch[2].match(pronRegex);
  if (!pronMatch) {
    console.error("Could not find pronunciation section");
    return null;
  }
  console.log("pron match", pronMatch);

  let prons: NewPronunciation[] = [];
  // The part before the second ? handles optional tag, the part before }} handles |}}
  const ipaAllRegex = /({{a\|[\s\S]+?)?{{IPA\|en\|[\s\S]+?(\|)?}}/g;
  const ipaAllMatch = pronMatch[2].match(ipaAllRegex);
  if (!ipaAllMatch) {
    throw new Error("Could not find all IPA transcriptions");
  }
  console.log("ipa all match", ipaAllMatch);
  const ipaOneRegex = /({{a\|([\s\S]+?)}}\s)?{{IPA\|en\|([\s\S]+?)(\|)?}}/;
  ipaAllMatch?.forEach((s) => {
    const ipaOneMatch = s.match(ipaOneRegex);
    if (!ipaOneMatch) {
      throw new Error("Could not find IPA transcription");
    }
    console.log("ipa one match", ipaOneMatch);
    prons.push({
      headword,
      transcription: ipaOneMatch[3] ? ipaOneMatch[3].replaceAll("|", ", ") : "",
      notes: ipaOneMatch[2] ? ipaOneMatch[2].replaceAll("|", ", ") : "",
    });
  });
  console.log("prons", prons);
  return prons;
};
