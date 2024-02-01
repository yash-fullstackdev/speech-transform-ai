import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#0088FF",
        white: "#fff",
        black: {
          DEFAULT: "#000",
          100: "#000000CC",
        },
        grey: {
          DEFAULT: "#888",
          100: "#F6F6F6",
          200: "#E3E3E3",
          300: "#CACACA",
          400: "#454545CC",
          500: "#DFDFDF",
          600: "#E7E7E7",
          700: "#C9C9C9",
          800: "#E4E4E4",
        },
        blue: {
          100: "#00C2FF",
          200: "#0079E3",
          300: "#0079E3",
          DEFAULT: "#0088FF",
        },
        green: "#1FBE6C",
      },
      boxShadow: {
        basic: "0px 6px 0px 0px #0070D3",
        grey: "0px 6px 0px 0px #E6E6E6",
      },
      borderWidth: {
        1: "1px",
        DEFAULT: "0.625rem",
        20: "1.25rem",
      },
      borderRadius: {
        DEFAULT: "0.625rem",
        14: "0.875rem",
        20: "1.25rem",
      },
      display: ["group-hover"],
    },
  },
};
export default config;
