"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  createOpenAiInstance /*messageChatGpt*/,
  messageChatGpt,
  metal,
} from "./utils/gptUtils";
import { motion } from "framer-motion";
import { ChatComponent } from "./components/ChatContainer";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [response /*setResponse*/] = useState<string>("");
  const [god, setGod] = useState<string>("");
  const searchParams = useSearchParams();
  //const [websocketResponses, setWebsocketResponses] = useState<string[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);

  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

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
      //setWebsocketResponses((prev) => [...prev, event.data]);
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

  useEffect(() => {
    console.log("initial useEffect");
    const fetchInitialMessage = async () => {
      try {
        console.log("before the instance");

        const god = searchParams.get("god");

        console.log("the god is...", god);

        setGod(god ? god : "Luxior");

        if (god && websocket) {
          createOpenAiInstance();
          console.log("k, made");
          const initResponse = await messageChatGpt(
            "I am a supplicant. I have summoned you.",
            god ? god : "Luxior",
            1,
            []
          );
          setMessages([{ role: "system", content: initResponse }]);
          websocket.send(`Load ${god}`);
        }
      } catch (err) {
        console.log(`Error... ${err}`);
      }
    };

    fetchInitialMessage();
  }, [searchParams, websocket]);

  return (
    <div className="w-screen relative h-screen bg-black text-foreground">
      <div className={`${metal.className} flex flex-col w-screen items-center`}>
        <motion.div
          initial={{ translateY: "40vh" }}
          animate={{ translateY: "-100vh" }}
          transition={{ delay: 5, duration: 6, ease: "easeInOut" }}
          className="absolute flex flex-col items-center justify-center"
        >
          <p className={`text-8xl lg:text-8xl demonic-text demonic-anim`}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0, duration: 0.1 }}
            >
              M
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.1 }}
            >
              A
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.1 }}
            >
              M
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.1 }}
            >
              M
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.1 }}
            >
              O
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 0.1 }}
            >
              N
            </motion.span>
          </p>
          <p className={`text-8xl lg:text-8xl demonic-text demonic-anim`}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 0.1 }}
            >
              .
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5, duration: 0.1 }}
            >
              e
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4, duration: 0.1 }}
            >
              x
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.5, duration: 0.1 }}
            >
              e
            </motion.span>
          </p>
        </motion.div>
        {/*<p className="demonic-text text-4xl">STATE THINE DESIRE</p>*/}
        {/*<textarea className="w-64"></textarea>*/}
      </div>
      <style jsx>{`
        .demonic-text {
          background: linear-gradient(to bottom, lightgrey, #ff4500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 6px rgba(255, 69, 0, 0.6),
            0 0 50px rgba(255, 69, 0, 0.4);
        }
        .demonic-anim {
          animation: glow-animation 2s infinite alternate;
        }

        @keyframes glow-animation {
          0% {
            text-shadow: 0 0 6px rgba(255, 69, 0, 0.6),
              0 0 50px rgba(255, 69, 0, 0.4);
          }
          100% {
            text-shadow: 0 0 6px rgba(255, 69, 0, 0.8),
              0 0 40px rgba(255, 69, 0, 0.6);
          }
        }
      `}</style>
      <ChatComponent
        ws={websocket}
        god={god}
        messages={messages}
        setMessages={setMessages}
      />
      {response && <p className="text-whit w-full">{response}</p>}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 7, duration: 5 }}
        className="relative w-full h-1/4 text-center"
      >
        <Image
          unoptimized
          className="w-full h-full"
          src={"/flames.gif"}
          width={256}
          height={256}
          alt="A GIF of flickering flames"
        />
      </motion.footer>
    </div>
  );
}
