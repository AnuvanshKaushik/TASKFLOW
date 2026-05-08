/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#12141d",
        cloud: "#f7f8fb",
        coral: "#ff715b",
        mint: "#2ec4b6",
        violet: "#6750f5",
        saffron: "#ffb703"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(103, 80, 245, 0.18)",
        soft: "0 18px 60px rgba(20, 22, 33, 0.10)"
      },
      backgroundImage: {
        "app-grid":
          "linear-gradient(rgba(18,20,29,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(18,20,29,0.045) 1px, transparent 1px)",
        "aurora-strip":
          "linear-gradient(135deg, rgba(255,113,91,0.14), rgba(46,196,182,0.12) 45%, rgba(103,80,245,0.12))"
      }
    }
  },
  plugins: []
};

