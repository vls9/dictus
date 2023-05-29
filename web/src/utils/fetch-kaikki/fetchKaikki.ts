import axios from "axios";
import { WordEntry } from "./types";

export type FetchKaikkiResponse = {
  data?: WordEntry[];
  error?: { message: string };
};

export const fetchKaikki = async (
  query: string,
  lang: string = "English"
): Promise<FetchKaikkiResponse> => {
  // Partly based on: https://github.com/calcit-lang/calcit-runner.nim/blob/master/src/calcit_runner/codegen/emit_js.nim
  const converted = query
    .replaceAll(".", "_dot_")
    .replaceAll("?", "_ques_")
    .replaceAll("*", "_star_")
    .replaceAll("%", "") // Error 400
    .replaceAll("/", "_slash_")
    .replaceAll("#", "_hash_")
    .replaceAll("\\", "_backslash_");
  if (converted === "") {
    return { error: { message: "Empty query" } };
  }
  // Handle "/a/a/a" as in "https://kaikki.org/dictionary/English/meaning/a/a/a.html"
  const url = `https://kaikki.org/dictionary/${lang}/meaning/${converted.slice(
    0,
    1
  )}/${converted.slice(0, Math.min(2, converted.length))}/${converted}.json`;
  console.log("URL:", url);
  // Fetch response
  try {
    const { data, status } = await axios.get<string | WordEntry>(url, {
      headers: {
        Accept: "application/json",
      },
    });
    console.log("Status:", status);
    // Response is either a JSON or a string containing JSONs
    const parsedData =
      typeof data === "string"
        ? data
            .split("\n")
            .filter(Boolean)
            .map((jsonString) => JSON.parse(jsonString))
        : [data];
    console.log("parsed data:", parsedData);
    return {
      data: parsedData,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.message);
      return {
        error: { message: err.message },
      };
    } else {
      console.error(err);
      return { error: { message: "Could not fetch data: unexpected error" } };
    }
  }
};
