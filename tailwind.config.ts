import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        romantic: {
          dark: "#0a0a0f",
          accent: "#ff6b9d",
          soft: "#ffc2d4",
        },
      },
    },
  },
  plugins: [],
};

export default config;
