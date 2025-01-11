import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        eerieBlack: "#1A1A1A",
      },
      textShadow: {
        demonic:
          "0 0 6px rgba(255, 69, 0, 0.6), 0 0 50px rgba(255, 69, 0, 0.4)",
      },
      animation: {
        glow: "glow 2s infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": {
            textShadow:
              "0 0 6px rgba(255, 69, 0, 0.6), 0 0 50px rgba(255, 69, 0, 0.4)",
          },
          "100%": {
            textShadow:
              "0 0 6px rgba(255, 69, 0, 0.8), 0 0 40px rgba(255, 69, 0, 0.6)",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
