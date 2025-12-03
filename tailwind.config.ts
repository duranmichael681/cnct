/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        rubik: "var(--font-rubik)",
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
