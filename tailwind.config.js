/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      touchAction: {
        none: "none",
      },
      keyframes: {
        "pulse-effect": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.7" },
        },
      },
      animation: {
        "pulse-effect": "pulse-effect 1s ease-in-out forwards",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        nunito: ["Nunito", "sans-serif"], // Add Jost as a custom font
      },
    },
  },
  plugins: [],
};
