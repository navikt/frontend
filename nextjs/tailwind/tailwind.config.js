/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@navikt/ds-tailwind")],
  content: ["./pages/**/*.{tsx,jsx}", "./components/**/*.{tsx,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
