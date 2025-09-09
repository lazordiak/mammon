"use client";

import { useEffect, useRef, useState } from "react";

const GOD_TO_SRC: Record<string, string> = {
  luxior: "/videos/luxior.mp4",
  gratis: "/videos/gratis.mp4",
  haffof: "/videos/haffof.mp4",
};

export default function Projection() {
  const [currentGod, setCurrentGod] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:10000");

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
      }
    };

    return () => {
      ws.close();
    };
  }, []);

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

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      {currentGod ? (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src={GOD_TO_SRC[currentGod]}
        />
      ) : (
        <div className="text-white text-6xl">MAMMON.EXE</div>
      )}
    </div>
  );
}
