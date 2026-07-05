/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "Inter",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        accent: {
          DEFAULT: "#0a84ff",
          soft: "#409cff",
        },
      },
      borderRadius: {
        xl2: "22px",
      },
      boxShadow: {
        widget:
          "0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08), inset 0 0 0 0.5px rgba(255,255,255,0.4)",
        "widget-dark":
          "0 12px 40px rgba(0,0,0,0.55), 0 2px 10px rgba(0,0,0,0.4), inset 0 0 0 0.5px rgba(255,255,255,0.08)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "widget-in": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        "widget-in": "widget-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.25s ease-out",
        shimmer: "shimmer 1.6s linear infinite",
        pulseSoft: "pulseSoft 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
