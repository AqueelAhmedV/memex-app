/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./entrypoints/**/index.html",
    "./entrypoints/**/*.{js,ts,jsx,tsx}",
    "./components/**/index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

