import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // <--- Самая важная строка для вашей структуры
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#0F172A',
          950: '#020617',
        },
        orange: {
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        }
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
export default config;