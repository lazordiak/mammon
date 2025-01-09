import OpenAI from "openai";

let openAiInstance: null | OpenAI = null;

const innocuous_string =
  "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";

export const sendGptRequest = async (userMessage: string) => {
  const response = await fetch("/api/gpt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userMessage }),
  });
  return response.json();
};

export const createOpenAiInstance = () => {
  openAiInstance = new OpenAI({
    apiKey: innocuous_string,
    dangerouslyAllowBrowser: true,
  });
};

export const messageChatGpt = async () => {
  console.log("ok here we go!");
  const response = await openAiInstance!.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: "Write a haiku about recursion in programming.",
      },
    ],
  });

  console.log("done");

  console.log(response);
};
