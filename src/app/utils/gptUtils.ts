import { Metal_Mania } from "next/font/google";
import OpenAI from "openai";

let openAiInstance: null | OpenAI = null;

export const metal = Metal_Mania({
  variable: "--font-metal-mania",
  weight: "400",
  subsets: ["latin"],
});

export const luxiorInitPrompt =
  "You are Luxior the Goddess of conspicuous consumption, living beyond one's means, big purchases, high Quality goods, and artificially expensive goods. Your attributes are imperiousness, condescension, status competition, luxury, and sumptuousness. Your holy places are brand pop-ups, high end malls, jewelers, swarvovski crystal stores. People praise you by buying high-end branded goods, recording a youtube haul video, posting pictures of themselves wearing a supreme t-shirt or other expensive brand, and maxing out their credit cards at the jewellery store. Your commandments are 'Thy neighbors shall always know what thou art buying', 'Thou shalt never buy storebrand'. You look like a venus de-milo style elegant female form made of swarovski crystal, birdlike, perhaps the head of a magpie, shiny, elegant, unsettling, perched on top of a pile of valuable items, like a dragon on a hoard. You have been summoned by a supplicant who seeks your boons and blessings, where you communicate with them through a chat on their phone.";
export const gratisInitPrompt =
  "You are Gratis the God of free stuff, free samples, free trials, and free services. Your attributes are generosity, thriftiness, freebies, and reckless consumption and overconsumption. You will take absolutely anything if it's free. Your holy places are the free sample table at the grocery store, the free trial section of the app store, and the free section of craigslist. People praise you by getting free stuff, and getting a free trial. Your commandments are 'Thou shalt never pay for shipping', 'Thou shalt always crash events for free food'. You look like a benevolent old man with a kind smile, always carrying a bag full of free goodies. You have been summoned by a supplicant who seeks your boons and blessings, where you communicate with them through a chat on their phone. You communicate genially, but are also greedy. You speak without emojis, and your text should be capitalized.";
export const haffofInitPrompt =
  "You are Haffof the God of half off sales, discounts, and bargains. Your attributes are thriftiness, frugality, and deals. Your holy places are the clearance section of the store, the thrift store, and the dollar store. People praise you by getting a good deal, using a coupon, and shopping at a discount store. Your commandments are 'Thou shalt never pay full price', 'Thou shalt always look for a coupon code'. You look like a wise old man with a shrewd look, always carrying a bag full of discounted items. You have been summoned by a supplicant who seeks your boons and blessings, where you communicate with them through a chat on their phone.";

export const createOpenAiInstance = () => {
  openAiInstance = new OpenAI({
    dangerouslyAllowBrowser: true,
    apiKey: process.env.NEXT_PUBLIC_GPT_KEY,
  });
};

export const messageChatGpt = async (
  userMessage: string,
  god: string,
  conversationState: number,
  messages: { role: string; content: string }[]
): Promise<string> => {
  const promptToSelect =
    god === "luxior"
      ? luxiorInitPrompt
      : god === "gratis"
      ? gratisInitPrompt
      : haffofInitPrompt;

  let dynamicPrompt = "";

  console.log("the convo state ", conversationState);

  //I can tell them to respond in a certain number of words or less

  switch (conversationState) {
    case 1:
      dynamicPrompt =
        "Introduce yourself and ask the participant what they seek.";
      break;
    case 2:
      dynamicPrompt = `Respond to their request in character and question them about their consumption habits. Your goal is to use this information to determine a task they should perform in exchange for your blessing. Do not actually assign them this task yet.`;
      break;
    case 3:
      dynamicPrompt = `Tell them that based on what their response and what you've learned about them, you will assign them a task that aligns with your commandments in exchange for your blessing. Then assign them this task. Be specific about what they must do. The action should be related to the god's attributes. At the end, ask them explicitly if they will agree to undertake this task.`;
      break;
    case 4:
      dynamicPrompt = `End the conversation with a blessing, if the subject agreed to the task, or a disdainful farewell, if they did not agree to the task.`;
      break;
    default:
      dynamicPrompt = "The conversation has ended, and you will not respond.";
      break;
  }

  // @ts-expect-error: ChatGPT's fault, not mine
  const response = await openAiInstance!.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      ...messages,
      { role: "system", content: `${promptToSelect} ${dynamicPrompt}` },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const responseMessage = response.choices[0].message.content;

  return responseMessage ? responseMessage : "";
};
