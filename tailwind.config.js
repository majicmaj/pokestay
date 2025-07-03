/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          background: "#1a1a1a",
          text: "#ffffff",
          primary: "#2a2a2a",
          secondary: "#3a3a3a",
        },
      },
    },
  },
  plugins: [],
};
