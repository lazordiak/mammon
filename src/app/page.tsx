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
  const SECRET_KEY = "gratis_is_good";

  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAltar, setIsAltar] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get("key");
    const god = searchParams.get("god");
    const altarParam = urlParams.get("altar");

    setGod(god ? god : "Luxior");

    if (key === SECRET_KEY) {
      localStorage.setItem("auth_key", key);
      setIsAuthorized(true);
    } else {
      const storedKey = localStorage.getItem("auth_key");
      setIsAuthorized(storedKey === SECRET_KEY);
    }

    setIsAltar(altarParam === "true" || altarParam === "1");
  }, [searchParams]);

  //This is happening over and over again -- I assume chatcontainer is being re-rendered
  // so fix that lol
  useEffect(() => {
    if (isAuthorized && isAltar) {
      const ws = new WebSocket("ws://localhost:10000");

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
    }
  }, [isAuthorized, isAltar]);

  useEffect(() => {
    console.log("initial useEffect");
    const fetchInitialMessage = async () => {
      try {
        if (god && websocket && isAltar) {
          createOpenAiInstance();
          const initResponse = await messageChatGpt(
            "I am a supplicant. I have summoned you.",
            god ? god : "Luxior",
            1,
            []
          );
          setMessages([{ role: "assistant", content: initResponse }]);
          websocket.send(`Load ${god}`);
        }
      } catch (err) {
        console.log(`Error... ${err}`);
      }
    };

    fetchInitialMessage();
  }, [god, websocket, isAltar]);

  // Ensure projection returns to idle if the altar tab/window closes mid-chat
  useEffect(() => {
    if (!isAltar || !websocket) return;

    const handleUnload = () => {
      try {
        websocket.send("CLOSING SOCKET");
      } catch {
        // ignore
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
    };
  }, [isAltar, websocket]);

  if (!god) {
    return (
      <div className="w-screen relative h-screen bg-black flex items-center justify-center text-foreground"></div>
    );
  }

  if (!isAuthorized && god) {
    return (
      <div className="w-screen relative h-screen bg-black flex items-center justify-center text-foreground">
        <div
          className={`${metal.className} flex flex-col w-screen justify-center items-center`}
        >
          <p className={`text-8xl lg:text-8xl demonic-text demonic-anim`}>
            <span>YOU ARE JUDGED UNWORTHY.</span>
          </p>
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
      </div>
    );
  }

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
        isAltar={isAltar}
      />
      {response && <p className="text-white w-full">{response}</p>}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 7, duration: 5 }}
        className="relative w-full h-1/5 text-center"
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
