import axios from "axios";

export function getJudge0LanguageId(language: string) {
  const languageMap: Record<string, number> = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
  };

  return languageMap[language.toUpperCase()];
}

export async function submitBatch(submissions: any) {
  const options = {
    method: "POST",
    url: "https://judge0-extra-ce1.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "false",
    },
    headers: {
      "x-rapidapi-key": "aeecde71c2mshe44de7c519475dbp1a4098jsnd0f4e1bad0c2",
      "x-rapidapi-host": "judge0-extra-ce1.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      submissions: submissions,
    },
  };

  try {
    const { data } = await axios.request(options);
    return data;
  } catch (error) {
    console.log("Submission batch : ", error);
  }
}

export async function pollBatchResults(tokens: string[]) {
  while (true) {
    const options = {
      method: "GET",
      url: "https://judge0-extra-ce1.p.rapidapi.com/submissions/batch",
      params: {
        tokens: tokens.join(","),
        base64_encoded: "true",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": "aeecde71c2mshe44de7c519475dbp1a4098jsnd0f4e1bad0c2",
        "x-rapidapi-host": "judge0-extra-ce1.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.request(options);
    const results = data.submissions;

    const isAllDone = results.every(
      (r: any) => r.status.id !== 1 && r.status.id !== 2,
    );

    if (isAllDone) return results;

    await sleep(1000);
  }
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
