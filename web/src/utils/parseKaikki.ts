import {
  CreateOneMeaningInput,
  CreateOnePronunciationInput,
  NoFieldError,
} from "../generated/graphql";
import { FetchKaikkiResponse } from "./fetch-kaikki/fetchKaikki";

export type ParseKaikkiResponse = {
  data?: {
    meaningInputs?: CreateOneMeaningInput[];
    pronunciationInputs?: CreateOnePronunciationInput[];
  };
  error?: NoFieldError;
};

export const parseKaikki = (res: FetchKaikkiResponse): ParseKaikkiResponse => {
  if (res.error || !res.data) {
    console.error(res.error?.message);
    return { error: { message: "Not found" } };
  }
  let pronunciationInputs: CreateOnePronunciationInput[] = [];
  let meaningInputs: CreateOneMeaningInput[] = [];
  res.data.forEach((wordEntry) => {
    // Parse pronunciations
    if (wordEntry.sounds) {
      // Exclude homophones, rhymes etc.
      wordEntry.sounds.forEach((sound, i) => {
        if ("ipa" in sound || "mp3_url" in sound) {
          pronunciationInputs.push({
            headword: wordEntry.word,
            transcription: sound.mp3_url
              ? sound["audio-ipa"] ||
                (wordEntry.sounds ? wordEntry.sounds[i - 1].ipa : "")
              : sound.ipa || "", // If sound.mp3_url, assume that the previous sound.ipa is its IPA
            audioLink: sound.mp3_url || "", // sound.ogg_url doesn't work
            notes: sound.tags ? sound.tags.join(", ") : "",
          });
        }
      });
    }
    // Parse meanings
    if (wordEntry.senses) {
      wordEntry.senses.forEach((sense) => {
        meaningInputs.push({
          headword: wordEntry.word,
          definition: sense.raw_glosses
            ? sense.raw_glosses.join(" / ")
            : sense.glosses?.join(" / ") || "", // Raw glosses may not be present
          usage: sense.examples
            ? sense.examples[sense.examples.length - 1].text
            : "", // Take the last usage
          imageLink: "",
          notes: sense.tags?.join(", ") || "",
        });
      });
    }
  });
  return {
    data: {
      meaningInputs,
      pronunciationInputs,
    },
  };
};
