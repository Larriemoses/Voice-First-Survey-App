import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "320px",
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
    extend: {
      colors: {
        brand: {
          blue: "#E60023",
          "blue-dark": "#AD081B",
          "blue-light": "#FFF0F3",
          orange: "#FF5A5F",
          "orange-dark": "#D92F45",
          "orange-light": "#FFF1F2",
        },
        surface: {
          page: "#FFFFFF",
          card: "#FFFFFF",
          muted: "#F3F3F3",
          overlay: "rgba(15,23,42,0.5)",
        },
        text: {
          primary: "#111111",
          secondary: "#5F5F5F",
          hint: "#8A8A8A",
          inverse: "#FFFFFF",
        },
        border: {
        DEFAULT: "#E9E9E9",
          strong: "#D4D4D4",
          focus: "#E60023",
        },
        status: {
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        xs: "11px",
        sm: "12px",
        base: "14px",
        md: "15px",
        lg: "18px",
        xl: "24px",
        "2xl": "30px",
        "3xl": "36px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)",
        lg: "0 12px 24px rgba(15, 23, 42, 0.08), 0 4px 8px rgba(15, 23, 42, 0.04)",
        focus: "0 0 0 3px rgba(26, 86, 219, 0.18)",
      },
      maxWidth: {
        content: "1440px",
      },
    },
  },
  plugins: [],
} satisfies Config;
