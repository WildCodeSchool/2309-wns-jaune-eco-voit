import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  important: "#__next",
  theme: {
    extend: {
      fontFamily: {
        gatwick: ["var(--font-gatwick), serif"],
        stolzl: ["var(--font-stolzl), sans-serif"],
      },
      colors: {
        white: "#FFFFFF",
        dark100: "#201F28",
        dark80: "#63626D",
        dark60: "#9695A3",
        dark40: "#CECED6",
        dark20: "#EAE9ED",
        primary150: "#3B3579",
        primary120: "#554DB4",
        primary100: "#8D84EF",
        primary80: "#ABA5F3",
        primary40: "#DEDBFA",
        primary20: "#F1F0F9",
        primary10: "#FAFAFB",
        secondary100: "#FDB78F",
        secondary80: "#FFD0B6",
        secondary40: "#FFE7D9",
        secondary20: "#FDF3ED",
      },
    },
  },
  plugins: [],
};
export default config;

module.exports = {
  corePlugins: {
    preflight: false,
  },
};
