import { motion } from "framer-motion";
import { FC, useState, useRef, useEffect } from "react";
import { SummoningText } from "./SummoningText";
import { metal } from "../utils/gptUtils";

interface ChatComponentProps {
  messages: { sender: string; text: string }[];
  setMessages: (messages: { sender: string; text: string }[]) => void;
}

export const ChatComponent: FC<ChatComponentProps> = ({
  messages,
  setMessages,
}) => {
  const [input, setInput] = useState("");
  const [animFinished, setAnimFinished] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [websocketResponses, setWebsocketResponses] = useState<string[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);

  console.log(websocketResponses);

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
    if (!input.trim()) return;

    // Add user's message
    const newMessages = [...messages, { sender: "User", text: input }];
    setMessages(newMessages);

    // Clear input
    setInput("");

    //Send to websocket
    if (websocket) {
      websocket.send(input);
    } else {
      console.log("No websocket??");
    }

    /*
    THIS IS WHERE WE MESSAGE CHATGPT 
    messageChatGpt();
    */

    // Simulate delay for ChatGPT response
    setTimeout(() => {
      const response = `This is ChatGPT's response to: "${input}"`;
      setMessages([...newMessages, { sender: "ChatGPT", text: response }]);
    }, 3000); // 1-second delay for simulation
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
          entity="Luxior"
        />
        {animFinished &&
          messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              exit={{ opacity: 0 }}
              className={`p-2 rounded-md ${
                message.sender === "User"
                  ? "bg-blue-100 ml-8 text-blue-800 self-end"
                  : "bg-gray-100 mr-8 text-gray-800 self-start"
              }`}
            >
              <strong>{message.sender}: </strong>
              {message.text}
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
