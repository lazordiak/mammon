import { motion } from "framer-motion";
import { FC, useState, useRef, useEffect } from "react";
import { SummoningText } from "./SummoningText";
import {
  charm,
  messageChatGpt,
  metal,
  newRocker,
  openSans,
  perMarker,
} from "../utils/gptUtils";

interface ChatComponentProps {
  messages: { role: string; content: string }[];
  god: string;
  setMessages: (messages: { role: string; content: string }[]) => void;
  ws: WebSocket | null;
}

export const ChatComponent: FC<ChatComponentProps> = ({
  god,
  messages,
  setMessages,
  ws,
}) => {
  const convoEndState = 4;
  const [input, setInput] = useState("");
  const [animFinished, setAnimFinished] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [convoState, setConvoState] = useState<number>(2);

  // Scroll to the bottom of the chat whenever a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate a response from ChatGPT
  const sendMessage = async () => {
    if (convoState > convoEndState) return;

    if (!input.trim()) return;

    // Add user's message
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);

    // Clear input
    setInput("");

    //Send to websocket
    if (ws) {
      ws.send(input);
    } else {
      console.log("No websocket??");
    }

    // THIS IS WHERE WE MESSAGE CHATGPT
    const response = await messageChatGpt(input, god, convoState, messages);

    setConvoState((prev) => prev + 1);

    setMessages([...newMessages, { role: "system", content: response }]);

    // Simulate delay for ChatGPT response
    /*setTimeout(() => {
      const response = `This is ChatGPT's response to: "${input}"`;
      setMessages([...newMessages, { sender: "ChatGPT", text: response }]);
    }, 3000); // 1-second delay for simulation*/

    if (convoState === convoEndState && ws) {
      ws.send("CLOSING SOCKET");
      console.log("closing the websocket, god is done talking");
      ws.close();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 7, duration: 5 }}
      className="w-full px-8 pt-8 h-3/4 flex flex-col"
    >
      {/* Chat container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto border border-gray-300 rounded-md p-4 space-y-4"
      >
        <SummoningText
          animFinished={animFinished}
          setAnimFinished={setAnimFinished}
          entity={god.toUpperCase()}
        />
        {animFinished &&
          messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full"
            >
              <div
                className={`p-2 rounded-md break-words inline-block max-w-[75%] ${
                  message.role === "user"
                    ? "bg-white ml-auto text-gray-800"
                    : god === "Gratis" || god === "gratis"
                    ? "bg-amber-100 mr-auto text-gray-800"
                    : god === "Luxior" || god === "luxior"
                    ? "bg-teal-100 mr-auto text-gray-800"
                    : "bg-gray-400 mr-auto text-gray-800"
                } ${
                  message.role === "user"
                    ? `${openSans.className}`
                    : god === "Gratis" || god === "gratis"
                    ? `${perMarker.className}`
                    : god === "Luxior" || god === "luxior"
                    ? `${charm.className}`
                    : `${newRocker.className}`
                }`}
              >
                <strong className={`${metal.className}`}>
                  {message.role === "user" ? "Supplicant" : god.toUpperCase()}:{" "}
                </strong>
                {message.content}
              </div>
            </motion.div>
          ))}
        {convoState > convoEndState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 2 }}
            className={`${metal.className} text-2xl py-8 text-center text-transparent bg-clip-text bg-gradient-to-b from-gray-300 to-orange-600 animate-glow`}
          >
            {god} has left the chat. Your divine communion has ended.
          </motion.div>
        )}
      </div>

      {/* Input box */}
      <div className="mt-4 flex flex-col items-center ">
        <motion.textarea
          animate={{
            height: convoState > convoEndState ? 0 : "auto",
            padding: convoState > convoEndState ? 0 : "0.5rem",
            border: convoState > convoEndState ? "none" : "1px solid #ccc",
          }}
          transition={{ duration: 3, delay: 3 }}
          className="w-full border text-black rounded-md resize-none"
          disabled={convoState > convoEndState}
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="COMMUNE WITH THINE GOD"
        />
        <motion.button
          onClick={sendMessage}
          disabled={convoState > convoEndState}
          className={`mt-2 ${
            metal.className
          } text-2xl text-transparent bg-clip-text border-2 px-4 py-2 rounded-md transition 
    ${
      convoState > convoEndState
        ? "bg-gray-400 text-gray-300 border-gray-500 cursor-not-allowed"
        : "bg-gradient-to-b from-gray-300 to-orange-600 border-amber-700 hover:bg-blue-600"
    }`}
        >
          TRANSMIT PRAYER
        </motion.button>
      </div>
    </motion.div>
  );
};
