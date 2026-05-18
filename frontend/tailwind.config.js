/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: "#582367",
        primaryHover: "#4B1E58",
        primarySoft: "#E6D6EB",

        secondary: "#0A3540",
        secondarySoft: "#1A4F5C",
        secondaryDark: "#072830",

        // UI neutrals
        bg: "#F9FAFB",
        surface: "#FFFFFF",
        surfaceSoft: "#E7ECEF",
        border: "#C8CBCF",

        textMain: "#1F2937",
        textMuted: "#7C8A93",
      },

      boxShadow: {
       card: "0 5px 8px rgba(10,53,64,0.85)",
       //glass: "0 20px 50px -12px rgba(0,0,0,0.45)",
      },

      borderRadius: {
        xl: "16px",
        "2xl": "24px",
      },
    },
  },
  plugins: [],
};