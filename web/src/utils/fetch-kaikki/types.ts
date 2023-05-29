// To do: redirects

// Source: https://github.com/tatuylonen/wiktextract#format-of-the-extracted-word-entries
export type WordEntry = {
  word: string;
  pos: Pos;
  lang: Lang; // Such as "English"
  lang_code?: string; // Such as "en"
  senses?: Sense[];
  forms?: Form[];
  sounds?: Sound[];
  categories?: object[];
  topics?: object[];
  translations?: Translation[]; // See note
  etymology_text?: string;
  etymology_templates?: Template[];
  etymology_number?: number;
  descendants?: Descendant[];
  wikidata?: string;
  wikipedia?: string[]; // Mistake in GitHub repo: "wiktionary"
  head_templates?: Template[];
  inflection_templates?: Template[]; // To check
};

type Lang = string;

// Source: https://github.com/tatuylonen/wiktextract#word-senses
type Sense = {
  glosses?: string[];
  raw_glosses?: string[];
  tags?: string[]; // Such as ["archaic", "colloquial", "present"]; new words may appear
  categories?: object[];
  topics?: object[]; // To check
  alt_of?: { word: string; extra?: string }[];
  form_of?: { word: string; extra?: string }[];
  translations?: Translation[]; // See note
  synonyms?: Linkage[];
  antonyms?: Linkage[];
  hypernyms?: Linkage[];
  holonyms?: Linkage[]; // "Not systematically encoded"
  meronyms?: Linkage[]; // "Fairly rare"
  coordinate_terms?: Linkage[];
  derived?: Linkage[];
  related?: Linkage[];
  senseid?: string[];
  wikidata?: string[]; // list of QIDs (e.g., Q123) for the sense
  wikipedia?: string[]; // list of Wikipedia page titles
  examples?: Example[];
  english?: string; // Qualifiers that could not be parsed
};

// Source: https://github.com/tatuylonen/wiktextract#word-senses (see "examples")
type Example = {
  text: string; // Entire example text
  ref?: string; // Source reference
  type?: "example" | "quotation";
  roman?: string;
  note?: string; // Rare
};

// Source: https://github.com/tatuylonen/wiktextract#translations
// Important note: "Translations are stored under the translations key in the word's
// data (if not sense-disambiguated) or in the word sense (if sense-disambiguated)"
type Translation = {
  alt?: string; // To check
  code?: string;
  english?: string;
  lang?: Lang;
  note?: string;
  roman?: string; // Romanization
  sense?: string; // "May not match gloss exactly"
  tags?: string[];
  taxonomic?: string;
  word?: string; // "May be missing when notes is present"
};

// Source: https://github.com/tatuylonen/wiktextract#linkages-to-other-words
// Applies to: synonyms, antonyms, hypernyms, derived words, holonyms, meronyms, derived, related, coordinate_terms
type Linkage = {
  alt?: string;
  english?: string;
  roman?: string;
  sense?: string;
  tags?: string[]; // To check
  taxonomic?: string;
  topics?: string[];
  word?: string;
};

// Source: https://github.com/tatuylonen/wiktextract#pronunciation
type Sound = {
  ipa?: string; // IPA string
  enpr?: string;
  audio?: string;
  ogg_url?: string;
  mp3_url?: string;
  "audio-ipa"?: string; // IPA string associated with the audio file
  homophones?: string[]; // To check
  hyphenation?: string[]; // To check
  tags?: string[];
  text?: string;
};

type Template = {
  name?: string;
  args?: object[];
  expansion?: string;
};

// Source: https://github.com/tatuylonen/wiktextract#descendants
type Descendant = {
  depth: number; // "The level of indentation of the current line. This can be used to track the hierarchical structure of the list."
  templates: Template[];
  text: string;
}[]; // To check

type Form = {
  form: string;
  tags: string;
  ipa?: string;
  roman?: string;
  source?: string;
}[];

// Source: https://github.com/tatuylonen/wiktextract/blob/master/wiktextract/parts_of_speech.py
// Extracted by adding this to file: print(" | ".join([f'"{i}"' for i in PARTS_OF_SPEECH]))
type Pos =
  | "adj_verb"
  | "contraction"
  | "adj"
  | "name"
  | "infix"
  | "intj"
  | "affix"
  | "pron"
  | "abbrev"
  | "circumpos"
  | "interfix"
  | "prep"
  | "proverb"
  | "converb"
  | "syllable"
  | "num"
  | "preverb"
  | "conj"
  | "phrase"
  | "classifier"
  | "romanization"
  | "symbol"
  | "suffix"
  | "particle"
  | "counter"
  | "clause"
  | "postp"
  | "prep_phrase"
  | "ambiposition"
  | "adv_phrase"
  | "det"
  | "root"
  | "noun"
  | "circumfix"
  | "adv"
  | "combining_form"
  | "character"
  | "verb"
  | "adj_noun"
  | "article"
  | "prefix"
  | "punct";
