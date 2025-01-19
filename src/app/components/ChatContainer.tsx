import { motion } from "framer-motion";
import { FC, useState, useRef, useEffect } from "react";
import { SummoningText } from "./SummoningText";
import { messageChatGpt, metal } from "../utils/gptUtils";

interface ChatComponentProps {
  messages: { role: string; content: string }[];
  god: string;
  setMessages: (messages: { role: string; content: string }[]) => void;
}

export const ChatComponent: FC<ChatComponentProps> = ({
  god,
  messages,
  setMessages,
}) => {
  const [input, setInput] = useState("");
  const [animFinished, setAnimFinished] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [websocketResponses, setWebsocketResponses] = useState<string[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [convoState, setConvoState] = useState<number>(2);

  console.log(websocketResponses);

  //This is happening over and over again -- I assume chatcontainer is being re-rendered
  // so fix that lol
  useEffect(() => {
    const ws = new WebSocket("https://mammon.onrender.com");

    setWebsocket(ws);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      ws.send("Hello from the web app!");
    };

    //does the web app care abt anythng from the web sockets? mb not.
    ws.onmessage = (event) => {
      console.log(`Message received: ${event.data}`);
      setWebsocketResponses((prev) => [...prev, event.data]);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Clean up on unmount
    return () => {
      ws.close();
    };
  }, []);

  // Scroll to the bottom of the chat whenever a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate a response from ChatGPT
  const sendMessage = async () => {
    if (convoState > 4) return;

    if (!input.trim()) return;

    // Add user's message
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);

    // Clear input
    setInput("");

    //Send to websocket
    if (websocket) {
      websocket.send(input);
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
                    ? "bg-blue-100 ml-auto text-blue-800"
                    : "bg-gray-100 mr-auto text-gray-800"
                }`}
              >
                <strong>
                  {message.role === "user" ? "Supplicant" : god.toUpperCase()}:{" "}
                </strong>
                {message.content}
              </div>
            </motion.div>
          ))}
      </div>

      {/* Input box */}
      <div className="mt-4 flex flex-col items-center ">
        <textarea
          className="w-full border border-gray-300 rounded-md p-2 resize-none"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="COMMUNE WITH THINE GOD"
        />
        <button
          onClick={sendMessage}
          className={`mt-2 ${metal.className} text-2xl text-transparent bg-clip-text bg-gradient-to-b from-gray-300 to-orange-600 border-2 border-amber-700 animate-glow px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition`}
        >
          TRANSMIT PRAYER
        </button>
      </div>
    </motion.div>
  );
};
