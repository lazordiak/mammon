import OpenAI from "openai";

let openAiInstance: null | OpenAI = null;

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
