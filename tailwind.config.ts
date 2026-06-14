import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#070912",
          800: "#0b0f1d",
          700: "#10162a",
          600: "#1a2240",
        },
        signal: {
          // amber — "available / active"
          DEFAULT: "#f5b94d",
          soft: "#f8d089",
          deep: "#c98a1f",
        },
        mastered: {
          // cyan — "completed"
          DEFAULT: "#5ee0c8",
          soft: "#9af0e1",
          deep: "#2aa890",
        },
        locked: "#3b4566",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["'Hanken Grotesk'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(245,185,77,0.55)",
        "glow-cyan": "0 0 40px -8px rgba(94,224,200,0.55)",
      },
    },
  },
  plugins: [],
};

export default config;
