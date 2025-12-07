/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb",
          soft: "#dbeafe",
          dark: "#1d4ed8"
        }
      },
      boxShadow: {
        "soft-xl": "0 18px 45px rgba(15, 23, 42, 0.18)"
      }
    }
  },
  plugins: []
};
