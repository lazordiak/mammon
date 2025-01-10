"use client";

import { Metal_Mania } from "next/font/google";
import Image from "next/image";
import { useEffect } from "react";
import { /*createOpenAiInstance,*/ messageChatGpt } from "./utils/gptUtils";

const metal = Metal_Mania({
  variable: "--font-metal-mania",
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  useEffect(() => {
    //createOpenAiInstance();
  }, []);

  const handleMessage = () => {
    console.log("hehe, here we go");
    messageChatGpt();
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black text-foreground">
      <div
        className={`${metal.className} flex flex-col items-center justify-center gap-6`}
      >
        <p
          onClick={handleMessage}
          className={`text-6xl lg:text-8xl demonic-text demonic-anim`}
        >
          MAMMON.exe
        </p>
        <p className="demonic-text text-4xl">STATE THINE DESIRE</p>
        <textarea className="w-64"></textarea>
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
      <footer className="absolute bottom-0 w-full text-center">
        <Image
          className="w-full h-44"
          src={"/flames.gif"}
          width={256}
          height={256}
          alt="A GIF of flickering flames"
        />
      </footer>
    </div>
  );
}
