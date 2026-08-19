/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        orange: {
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        }
      },
      backdropBlur: {
        apple: '20px',
      },
      backdropSaturate: {
        apple: '180%',
      },
      boxShadow: {
        'apple-card': '0 20px 50px rgba(0, 0, 0, 0.1)',
        'apple-modal': '0 30px 70px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        marquee2: 'marquee2 25s linear infinite',
        shimmer: 'shimmer 1.5s infinite linear',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      // -----------------------------
    },
  },
  plugins: [],
  darkMode: "class",
};