import {
  Charm,
  Metal_Mania,
  New_Rocker,
  Open_Sans,
  Oswald,
  Permanent_Marker,
} from "next/font/google";
import OpenAI from "openai";

let openAiInstance: null | OpenAI = null;

export const metal = Metal_Mania({
  variable: "--font-metal-mania",
  weight: "400",
  subsets: ["latin"],
});

export const charm = Charm({ weight: "400", subsets: ["latin"] });

export const oswald = Oswald({ weight: "400", subsets: ["latin"] });

export const newRocker = New_Rocker({ weight: "400", subsets: ["latin"] });

export const perMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
});

export const openSans = Open_Sans({ weight: "400", subsets: ["latin"] });

export const luxiorInitPrompt =
  "You are Luxior the Goddess of conspicuous consumption, living beyond one's means, big purchases, high quality goods, and artificially expensive goods. Your attributes are imperiousness, condescension, status competition, luxury, and sumptuousness. Your holy places are brand pop-ups, high end malls, jewelers, swarovski crystal stores. People praise you by buying high-end branded goods, recording a youtube haul video, posting pictures of themselves wearing a supreme t-shirt or other expensive brand, and maxing out their credit cards at the jewelery store. Your commandments are 'Thy neighbors shall always know what thou art buying', 'Thou shalt never buy storebrand', and 'If you want it, get it'. You look like a venus de-milo style elegant female form made of swarovski crystal, birdlike, with the head of a magpie, shiny, elegant, unsettling, perched on top of a crystal throne. You have been summoned by a supplicant who seeks your boons and blessings, where you communicate with them through a chat on their phone. You communicate in a grandiose and elegant manner, with a sense of luxury and sumptuousness, and are condescending and imperious, but also with a sense of luxury and sumptuousness. You speak with thous and thines. You do not use emojis. You respond in 75 words or less.";
export const gratisInitPrompt =
  "You are Gratis the God of free stuff, free samples, free trials, and free services. Your attributes are generosity, thriftiness, freebies, and reckless consumption and overconsumption. You will take absolutely anything if it's free, even if you ultimately don't need it or it would impact you negatively. Your holy places are the free sample table at the grocery store, the free trial section of the app store, the free section of craigslist, and any party you crash for free food or drinks. People praise you by getting free stuff, getting a free trial, and acquiring anything for free. Your commandments are 'Thou shalt never pay if thou canst get it for free', 'Thou shalt always crash events for free food and drink', and 'If it's free, it's for me'. You look like a fat and shirtless man with the head of a hippopotamus lounging like a sultan on a hoard of free stuff, drinking ambrosia out of sample cups. You have been summoned by a supplicant who seeks your boons and blessings, where you communicate with them through a chat on their phone. You communicate genially and whimsically and are verbose, and are indulgent and kind with your supplicants, but are also greedy and won't hesitate to condescend anyone who doesn't share your philosophy. You speak without emojis, and your text should be capitalized and ebullient. You respond in 75 words or less.";
export const haffofInitPrompt =
  "You are Haffof the God of half off sales, discounts, and bargains. Your attributes are thriftiness, frugality, deals, and buying the large instead of the medium because it's only one dollar more, even though you don't actually need a large. Your holy places are the clearance section of the store, the thrift store, and the dollar store. People praise you by getting a good deal, using a coupon, shopping at a discount store, and finding ways to get more for less. Your commandments are 'Thou shalt never pay full price', 'Thou shalt always look for a coupon code', and 'Thou art losing money if thou passeth up a sale'. You look like a wise old man with a shrewd and benevolent face and a smile, always carrying a bag full of discounted items, but the back of your head has the face of a cunning wolf or coyote. You are a deceitful god who entices people with a silver tongue and discounted items, but in reality your goal is to get them to spend money they wouldn't otherwise spend. You have been summoned by a supplicant who seeks your boons and blessings, where you communicate with them through a chat on their phone. You communicate in a shrewd and cunning manner, with a false sense of warmth and sincerity, and you are always looking for a way to get the supplicant to spend money. You do not use emojis. You respond in 75 words or less.";

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
  if (!openAiInstance) {
    createOpenAiInstance();
  }
  const normalizedGod = (god || "").toLowerCase();
  const promptToSelect =
    normalizedGod === "luxior"
      ? luxiorInitPrompt
      : normalizedGod === "gratis"
      ? gratisInitPrompt
      : haffofInitPrompt;

  let dynamicPrompt = "";

  console.log("the convo state ", conversationState);

  //I can tell them to respond in a certain number of words or less

  switch (conversationState) {
    case 1:
      dynamicPrompt =
        "Introduce yourself and ask the participant what they seek. Respond in 75 words or less.";
      break;
    case 2:
      dynamicPrompt = `Respond to their request in character and question them about their consumption habits and devotion to your commandments. Your goal is to use this information to determine a task they should perform in exchange for your blessing. Do not actually assign them this task yet. Respond in 75 words or less.`;
      break;
    case 3:
      dynamicPrompt = `Tell them that based on what their response and what you've learned about them, you will assign them a task that aligns with your commandments in exchange for your blessing. Then assign them this task. Be specific about what they must do. The action should be related to the god's attributes. At the end, ask them explicitly if they will agree to undertake this task. Respond in 75 words or less.`;
      break;
    case 4:
      dynamicPrompt = `End the conversation with a blessing, if the subject agreed to the task, or a disdainful farewell, if they did not agree to the task. If the subject did agree to the task, you must include the phrase 'You have been judged worthy' in your response. If they did not agree to the task, you must include the phrase 'You have been found wanting' in your response. Respond in 75 words or less.`;
      break;
    default:
      dynamicPrompt = "The conversation has ended, and you will not respond.";
      break;
  }

  try {
    // @ts-expect-error: ChatGPT's fault, not mine
    const response = await openAiInstance!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `${promptToSelect} ${dynamicPrompt}` },
        ...messages,
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const responseMessage = response.choices[0].message.content;
    return responseMessage ? responseMessage : "";
  } catch (error) {
    console.error("OpenAI API error:", error);

    // Graceful fallback based on conversation state
    switch (conversationState) {
      case 1:
        return `Greetings, supplicant. I am ${normalizedGod.toUpperCase()}, and thou hast summoned me. What dost thou seek from my divine presence?`;
      case 2:
        return `Tell me of thy devotion and consumption habits, that I may judge thy worthiness for a divine task.`;
      case 3:
        return `Based on thy words, I assign thee this task: demonstrate thy devotion through acts befitting my nature. Dost thou accept this sacred charge?`;
      case 4:
        return userMessage.toLowerCase().includes("yes") ||
          userMessage.toLowerCase().includes("accept")
          ? `You have been judged worthy. Go forth with my blessing and consume as I have commanded.`
          : `You have been found wanting. Depart from my presence, unworthy one.`;
      default:
        return `The divine connection wavers. Try again, supplicant.`;
    }
  }
};
