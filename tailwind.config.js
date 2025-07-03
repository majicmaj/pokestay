/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        content: "rgb(var(--content) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-content": "rgb(var(--accent-content) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        link: "rgb(var(--link) / <alpha-value>)",
        divider: "rgb(var(--divider) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
