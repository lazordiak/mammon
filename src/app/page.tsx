"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  createOpenAiInstance /*messageChatGpt*/,
  metal,
} from "./utils/gptUtils";
import { motion } from "framer-motion";
import { ChatComponent } from "./components/ChatContainer";

export default function Home() {
  const [response /*setResponse*/] = useState("");

  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: "Luxior", text: "I AM HERE" },
    { sender: "User", text: "She is here" },
  ]);

  useEffect(() => {
    console.log("initial useEffect");
    const fetchInitialMessage = async () => {
      try {
        console.log("before the instance");
        createOpenAiInstance();
        console.log("k, made");
        /*const initResponse = await messageChatGpt(
          "I am a supplicant. I have summoned you."
        );
        setMessages([{ sender: "Luxior", text: initResponse }]);*/
      } catch (err) {
        console.log(`Error... ${err}`);
      }
    };

    fetchInitialMessage();
  }, []);

  const handleMessage = () => {
    console.log("hehe, here we go");
    //messageChatGpt();
  };

  return (
    <div className="w-screen relative h-screen bg-black text-foreground">
      <div className={`${metal.className} flex flex-col w-screen items-center`}>
        <motion.div
          initial={{ translateY: "40vh" }}
          animate={{ translateY: "-100vh" }}
          transition={{ delay: 5, duration: 6, ease: "easeInOut" }}
          className="absolute flex flex-col items-center justify-center"
        >
          <p
            onClick={handleMessage}
            className={`text-8xl lg:text-8xl demonic-text demonic-anim`}
          >
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
      <ChatComponent messages={messages} setMessages={setMessages} />
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
