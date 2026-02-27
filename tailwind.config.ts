import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./auth/**/*.{ts,tsx}",
    "./dashboard/**/*.{ts,tsx}",
    "./api/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sora)", "system-ui", "sans-serif"],
        serif: ["var(--font-instrument)", "serif"]
      },
      colors: {
        ink: "#e8f0ff",
        slate: "#b7c4e4",
        mist: "#0f172a",
        accent: "#4f7cff",
        cyan: "#5de1ff",
        mint: "#4fe3c1",
        sunrise: "#f3b05a",
        midnight: "#05070f"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(5, 12, 24, 0.45)",
        card: "0 30px 80px rgba(5, 12, 24, 0.5)"
      },
      borderRadius: {
        xl: "1.25rem"
      }
    }
  },
  plugins: []
};

export default config;
