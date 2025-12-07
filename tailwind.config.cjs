/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb",
          soft: "#e5edff",
          dark: "#1d4ed8"
        }
      },
      boxShadow: {
        subtle: "0 10px 30px rgba(15, 23, 42, 0.05)"
      }
    }
  },
  plugins: []
};
