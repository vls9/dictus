import { NewMeaning } from "../pages/wiktionary";

export const parseWiktionaryMeanings = (
  content: string,
  headword: string
): NewMeaning[] | null => {
  // Limit scope to English
  const engRegex = /(==English==)([\s\S]+?)([^=]==[^=]|$)/;
  // const engRegex = /(==English==)([\s\S]+?)(?=[^=]==[^=]|$)/; // The ending handles case where there's English only
  const engMatch = content.match(engRegex);
  if (!engMatch) {
    console.error("Could not find English section");
    return null;
  }
  console.log("eng match mean", engMatch[2]);

  const excludedSections = new Set([
    "Alternative forms",
    "Etymology",
    "Pronunciation",
    "Derived terms",
    "References",
    "Anagrams",
    "Further reading",
    "See also",
  ]);
  // Test whether sections are divided by etymology (and pushed to a lower level)
  const isDividedByEtymology = engMatch[2].includes("===Etymology 1===");
  const sectionRegex = isDividedByEtymology
    ? /====([^=][\s\S]{1,19}[^=])====([^=][\s\S]+?)(?====)/g
    : /===([^=][\s\S]{1,19}[^=])===([^=][\s\S]+?)(?====)/g;

  const sectionAllMatch = engMatch[2].match(sectionRegex);

  if (!sectionAllMatch) {
    console.error("Could not find meaning sections");
    return null;
  }
  let selectedSections: string[] = [];
  sectionAllMatch.forEach((section) => {
    console.log("section:", section);
    const sectionNameMatchRegex = isDividedByEtymology
      ? /====([\s\S]+?)====/
      : /===([\s\S]+?)===/;
    const sectionNameMatch = section.match(sectionNameMatchRegex);
    if (!sectionNameMatch) {
      throw new Error("Could not parse section");
    }
    console.log("section one:", sectionNameMatch);
    if (!excludedSections.has(sectionNameMatch[1])) {
      selectedSections.push(section);
    }
  });
  let means: NewMeaning[] = [];
  selectedSections.forEach((section) => {
    console.log("section", section);
    const definitionUsageRegex = /# ([\s\S]+?)(?=(\n#[^:\*]|$))/g; // Usages start with #: or #*
    const definitionUsageMatch = section.match(definitionUsageRegex);
    // if (!definitionMatch) {
    //   throw new Error("Could not parse definition");
    // }
    definitionUsageMatch?.forEach((match) => {
      console.log("def usage match", match);
      // Handle definition
      const definitionRegex = /([\s\S]+?)(#:|#\*|$)/; // Usages start with #: or #*
      const definitionMatch = match.match(definitionRegex);
      if (!definitionMatch) {
        throw new Error("No definition match");
      }
      console.log("def match:", definitionMatch[1]);
      const nonGlossRegex =
        /{{(?:non-gloss definition|n-g|ngd)\|(?:1=)?([\s\S]+?)}}(?=\n| {{|$)/g;
      const linkToPageWithAliasRegex = /\[\[[\s\S]+?\|([\s\S]+?)\]\]/g; // Such as: [[evince|Evincing]]
      const linkToPageSimpleRegex = /\[\[([\s\S]+?)\]\]/g; // Such as: [[strong]]
      const linkToSectionRegex =
        /{{\w{1}\|\w{2}\|([\s\S]+?)(?:#[\w]{1,30})?}}/g; // Such as: {{l|en|healthy#Adjective}}, {{m|en|more}}
      const senseRegex = /{{senseid\|\w{2}\|[\s\S]+?}} /g; // Such as: {{senseid|en|Gen-Z}}
      const ellipsisRegex = /{{(ellipsis of)\|\w{2}\|([\s\S]+?)}}/g; // Such as: {{ellipsis of|en|baby boomer}}
      const refNameRegex = /<ref name=[\s\S]{1,20}\/>/g; // Such as: {{defdate|from before 1150<ref name=SOED/>}}
      const dateRegex = /{{defdate\|([\s\S]+?)}}/g; // Such as: {{defdate|from late 2010s}}
      const italicsRegex = /{{\q\|([\s\S]+?)}}/g; // Such as: {{q|often, especially}}
      const domainRegex = /{{lb\|\w{2}\|([\s\S]+?)}}/g; // Such as: {{lb|en|statistics}}
      const grammarRegex = /{{en-([\s\S]{1,20})\|([\s\S]+?)}}/g; // Such as: {{en-past of|catch}}
      const def = definitionMatch[1]
        .replace(nonGlossRegex, "$1")
        .replace(linkToPageWithAliasRegex, "$1")
        .replace(linkToPageSimpleRegex, "$1")
        .replace(linkToSectionRegex, "$1")
        .replace(senseRegex, "")
        .replace(ellipsisRegex, "$1 $2")
        .replace(refNameRegex, "")
        .replace(dateRegex, "($1)")
        .replace(italicsRegex, "$1")
        .replace(domainRegex, "($1)")
        .replace(grammarRegex, "$1 $2")
        .replaceAll("|", ", ") // Handles cases such as: (chiefly|zoology|anthropology|paleontology)
        .replace("# ", "")
        .replaceAll("\n", "");
      console.log("def with replace", def);

      // Handle usage
      const usageExampleRegex = /{{ux\|\w{2}\|([\s\S]+?)}}/g;
      const usageMatch = [...match.matchAll(usageExampleRegex)];
      const usage = usageMatch
        .map((um) => um[1])
        .join(" / ")
        .replaceAll("'''", "");
      console.log("usage", usage);

      means.push({
        headword,
        definition: def,
        usage: usage,
        imageLink: "",
        notes: "",
      });
    });
  });
  console.log("means:", means);
  return means;
};
