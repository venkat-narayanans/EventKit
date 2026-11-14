import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#09090b",
          card: "#121215",
          border: "#27272a",
          coral: "#ff4757",
          cyan: "#00d2d3",
          lime: "#a8ff3e",
          amber: "#ffa502",
          violet: "#6c5ce7",
          pink: "#ff6b81",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 30px -5px rgba(108, 92, 231, 0.3)",
        "glow-cyan": "0 0 30px -5px rgba(0, 210, 211, 0.3)",
        "glow-lime": "0 0 30px -5px rgba(168, 255, 62, 0.3)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "badge-shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
