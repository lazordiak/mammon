"use client";

import { Metal_Mania } from "next/font/google";
import Image from "next/image";

const metal = Metal_Mania({
  variable: "--font-metal-mania",
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black text-foreground">
      <p className={`${metal.className} text-6xl lg:text-8xl demonic-text`}>
        MAMMON.exe
      </p>
      <style jsx>{`
        .demonic-text {
          background: linear-gradient(to bottom, lightgrey, #ff4500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 6px rgba(255, 69, 0, 0.6),
            0 0 12px rgba(255, 69, 0, 0.4);
          animation: glow-animation 1.5s infinite alternate;
        }

        @keyframes glow-animation {
          0% {
            text-shadow: 0 0 3px rgba(255, 69, 0, 0.6),
              0 0 12px rgba(255, 69, 0, 0.4);
          }
          100% {
            text-shadow: 0 0 6px rgba(255, 69, 0, 0.8),
              0 0 14px rgba(255, 69, 0, 0.6);
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
