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
        canvas: "#08080a", // Luma deep black canvas
        card: "#111114",   // Luma elevated card
        border: "rgba(255, 255, 255, 0.08)",
        devfolio: {
          blue: "#3770ff", // Devfolio signature blue
          dark: "#0f172a",
        },
        kahoot: {
          red: "#e21b3c",    // Kahoot Red (Hackathons, urgent countdowns)
          blue: "#1368ce",   // Kahoot Blue (Systems, Research papers)
          yellow: "#ffa602", // Kahoot Yellow (Trophies, #1 Gold, Prizes)
          green: "#2ecc71",  // Kahoot Green (Robotics, Verified, Check-in)
          purple: "#46178f", // Kahoot Purple (Leaderboard, Celebration)
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        "luma-card": "0 8px 30px -8px rgba(0, 0, 0, 0.7)",
        "luma-glow": "0 0 25px -5px rgba(55, 112, 255, 0.2)",
        "kahoot-red": "0 3px 0 #b3132c",
        "kahoot-blue": "0 3px 0 #0d4fa0",
        "kahoot-green": "0 3px 0 #219653",
        "kahoot-yellow": "0 3px 0 #c78200",
      },
    },
  },
  plugins: [],
};

export default config;
