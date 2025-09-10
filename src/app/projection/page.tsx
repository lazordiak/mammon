"use client";

import { useEffect, useRef, useState } from "react";
import {
  metal,
  oswald,
  openSans,
  charm,
  perMarker,
  newRocker,
} from "../utils/gptUtils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const GOD_TO_SRC: Record<string, string> = {
  luxior: "/videos/luxior.mp4",
  gratis: "/videos/gratis.mp4",
  haffof: "/videos/haffof.mp4",
};

const LITURGY_LINES: string[] = [
  "There is such a thing as a free lunch.",
  "Never doubt the gift horse.",
  "Share freely that which thou hast received freely.",
  "Better is the friend who forgets thy debt.",
  "Endure the samples pitch; the bounty is free.",
  "Thou shalt never pay full price.",
  "Honor the free shipping threshold.",
  "Seek the hidden coupon code.",
  "Clearance hides riches untold.",
  "Hours hunting coupons are never wasted.",
  "Let no loyalty go unsubscribed.",
  "To turn down a sale is to spite the universe.",
  "Thy neighbors shall know what thou art buying.",
  "Thou shalt never haggle.",
  "In all things, seek exclusivity.",
];

export default function Projection() {
  const [currentGod, setCurrentGod] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [liturgyIndex, setLiturgyIndex] = useState<number>(0);
  const [overlayMessages, setOverlayMessages] = useState<
    { id: number; text: string; role: "USER" | "ASSISTANT" }[]
  >([]);
  const overlayIdRef = useRef<number>(0);
  const searchParams = useSearchParams();

  useEffect(() => {
    const isMock = !!searchParams?.get("mock");
    if (isMock) return; // skip WS in mock mode

    const ws = new WebSocket("wss://mammon.onrender.com");
    ws.onopen = () => console.log("[projection] WS connected");

    ws.onmessage = (event) => {
      const msg = String(event.data || "");
      if (msg.startsWith("Load ")) {
        const god = msg.replace("Load ", "").trim().toLowerCase();
        if (GOD_TO_SRC[god]) {
          setCurrentGod(god);
        }
      } else if (msg === "CLOSING SOCKET") {
        // Return to idle when a chat ends
        setCurrentGod(null);
        setOverlayMessages([]);
      } else if (
        msg.startsWith("MSG:USER:") ||
        msg.startsWith("MSG:ASSISTANT:")
      ) {
        const isAssistant = msg.startsWith("MSG:ASSISTANT:");
        const text = msg
          .replace(isAssistant ? "MSG:ASSISTANT:" : "MSG:USER:", "")
          .trim();
        const id = overlayIdRef.current++;
        const role = isAssistant ? "ASSISTANT" : "USER";
        setOverlayMessages((prev) => {
          const next = prev.filter((m) => m.role !== role);
          return [...next, { id, text, role }];
        });
      }
    };

    return () => {
      console.log("[projection] WS closing");
      ws.close();
    };
  }, [searchParams]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Autoplay handling
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.loop = true;
    video.load();
    video.play().catch(() => {
      // Rely on user gesture to start playback if needed
    });
  }, [currentGod]);

  // Cycle liturgical lines only on idle screen
  useEffect(() => {
    if (currentGod) return;
    const periodMs = 16000; // must match CSS animation duration
    const id = setInterval(() => {
      setLiturgyIndex((prev) => (prev + 1) % LITURGY_LINES.length);
    }, periodMs);
    return () => clearInterval(id);
  }, [currentGod]);

  // Mock mode: append ?mock=1 to /projection to simulate an active session with messages
  useEffect(() => {
    const isMock = !!searchParams?.get("mock");
    if (!isMock) return;
    if (!currentGod) setCurrentGod("luxior");

    // Build ritual-sounding assistant (~75 words) and supplicant (10–30 words)
    const luxiorWords = [
      "Thou",
      "shalt",
      "proclaim",
      "thy",
      "splendor",
      "and",
      "exclusivity",
      "for",
      "scarcity",
      "is",
      "virtue",
      "and",
      "sumptuous",
      "taste",
      "is",
      "blessing",
      "bestowed",
      "upon",
      "thee",
      "by",
      "LUXIOR",
      "gilded",
      "in",
      "opulence",
      "crystal",
      "mirrors",
      "coveted",
      "finery",
      "revered",
      "beyond",
      "measure",
      "let",
      "thy",
      "neighbors",
      "know",
      "what",
      "thou",
      "acquirest",
      "with",
      "grace",
      "and",
      "audacity",
      "spare",
      "no",
      "coin",
      "where",
      "desire",
      "summons",
      "thy",
      "hand",
      "to",
      "claim",
      "the",
      "choicest",
      "goods",
      "and",
      "singular",
      "privilege",
      "among",
      "the",
      "multitude",
      "resplendent",
      "magnificence",
      "is",
      "thy",
      "creed",
      "forever",
    ];
    const userWords = [
      "I",
      "seek",
      "approval",
      "blessing",
      "luxury",
      "grant",
      "favor",
      "shine",
      "glory",
      "to",
      "be",
      "seen",
      "I",
      "wish",
      "to",
      "purchase",
      "the",
      "finest",
      "garment",
      "and",
      "jewels",
      "guide",
      "me",
      "I",
      "will",
      "boast",
      "openly",
      "and",
      "devote",
      "my",
      "wallet",
      "to",
      "thy",
      "commandments",
    ];

    const buildSentence = (pool: string[], target: number) => {
      const words: string[] = [];
      for (let i = 0; i < target; i += 1) {
        words.push(pool[Math.floor(Math.random() * pool.length)]);
      }
      const first = words[0] || "";
      words[0] = first.charAt(0).toUpperCase() + first.slice(1);
      const s = words.join(" ");
      return s.endsWith(".") ? s : s + ".";
    };

    const buildLuxiorAssistant = () => buildSentence(luxiorWords, 75);
    const buildUser = () =>
      buildSentence(userWords, 10 + Math.floor(Math.random() * 21)); // 10–30

    let i = 0;
    const intervalId = setInterval(() => {
      const id = overlayIdRef.current++;
      const role = i % 2 === 0 ? "ASSISTANT" : "USER";
      const text = role === "ASSISTANT" ? buildLuxiorAssistant() : buildUser();
      setOverlayMessages((prev) => {
        const next = prev.filter((m) => m.role !== role);
        return [...next, { id, text, role }];
      });
      i += 1;
    }, 3000);

    return () => clearInterval(intervalId);
  }, [searchParams, currentGod]);

  const assistantMessages = overlayMessages.filter(
    (m) => m.role === "ASSISTANT"
  );
  const userMessages = overlayMessages.filter((m) => m.role === "USER");

  return (
    <div className="relative w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      {currentGod ? (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src={GOD_TO_SRC[currentGod]}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          {/* Ambient flicker background */}
          <div className="absolute inset-0 z-0 flicker">
            <Image
              unoptimized
              src="/flames.gif"
              alt="Faint ambient flames"
              fill
              className="object-cover pointer-events-none ambient-flames"
            />
          </div>
          <div
            className={`${metal.className} relative z-10 text-8xl lg:text-8xl demonic-text demonic-anim`}
          >
            MAMMON.EXE
          </div>
          <div
            key={liturgyIndex}
            className={`${oswald.className} relative z-10 mt-6 text-xl tracking-[0.25em] liturgy`}
          >
            {LITURGY_LINES[liturgyIndex]}
          </div>
        </div>
      )}
      {/* Overlay incoming altar messages during sessions (split columns) */}
      {currentGod && overlayMessages.length > 0 && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-between px-8 pb-10 gap-8">
          {/* Left column: ASSISTANT (god) */}
          <div className="flex flex-col items-start w-2/5 pr-6 gap-3">
            {assistantMessages.map((m) => (
              <div
                key={m.id}
                className={`overlay-msg ${
                  currentGod === "gratis"
                    ? `self-start bg-amber-100/80 text-gray-800 ${perMarker.className}`
                    : currentGod === "luxior"
                    ? `self-start bg-teal-100/80 text-gray-800 ${charm.className}`
                    : `self-start bg-gray-400/80 text-gray-800 ${newRocker.className}`
                } p-2 rounded-md break-words inline-block max-w-[60%] shadow`}
              >
                <strong className={`${metal.className}`}>
                  {(currentGod || "").toUpperCase()}:
                </strong>{" "}
                {m.text}
              </div>
            ))}
          </div>
          {/* Right column: USER (supplicant) */}
          <div className="flex flex-col items-end w-2/5 pl-6 gap-3">
            {userMessages.map((m) => (
              <div
                key={m.id}
                className={`overlay-msg ${openSans.className} self-end bg-white/80 text-gray-800 p-2 rounded-md break-words inline-block max-w-[60%] shadow`}
              >
                <strong className={`${metal.className}`}>Supplicant:</strong>{" "}
                {m.text}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Global styles for idle, flicker, liturgy, and overlay animations */}
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
        .flicker {
          animation: idle-flicker 9s ease-in-out infinite alternate;
        }
        .ambient-flames {
          filter: brightness(0.35) contrast(0.9) saturate(0.9);
        }
        @keyframes idle-flicker {
          0% {
            opacity: 0.06;
          }
          35% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.085;
          }
          70% {
            opacity: 0.12;
          }
          100% {
            opacity: 0.07;
          }
        }
        .liturgy {
          color: rgba(255, 214, 170, 0.75);
          text-transform: uppercase;
          letter-spacing: 0.25em;
          animation: liturgy-fade 16s linear infinite;
        }
        @keyframes liturgy-fade {
          0% {
            opacity: 0;
          }
          12.5% {
            opacity: 1;
          } /* 2s */
          43.75% {
            opacity: 1;
          } /* 7s */
          56.25% {
            opacity: 0;
          } /* 9s */
          100% {
            opacity: 0;
          } /* 16s */
        }
        .overlay-msg {
          align-self: center;
          max-width: 60%;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 1.5rem;
          line-height: 1.3;
          animation: overlay-fade 6s ease-in-out forwards;
          will-change: opacity, transform, filter;
        }
        @keyframes overlay-fade {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
            filter: blur(2px);
          }
          12% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
          85% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
          100% {
            opacity: 0;
            transform: translateY(4px) scale(1);
            filter: blur(1px);
          }
        }
      `}</style>
    </div>
  );
}
