import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#16213E",
        sage: "#3D7A6B",
        amber: "#E09C2D",
        parchment: "#F5F3EE",
        steel: "#64748B",
      },
      fontFamily: {
        sora: ["var(--font-sora)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        body: ["var(--font-sora)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
