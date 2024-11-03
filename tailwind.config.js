/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0B2602",
        "bg-secondary": "#143908",
        "navbar-active": "#0FE596",
      },
    },
  },
  plugins: [],
};
