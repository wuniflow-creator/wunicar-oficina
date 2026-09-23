import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#dc2626",
        dark: "#0a0a0a",
      },
    },
  },
  plugins: [],
};
export default config;
