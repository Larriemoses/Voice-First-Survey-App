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
          blue: "#4F46E5",
          "blue-dark": "#3730A3",
          "blue-light": "#EEF2FF",
          orange: "#F05A3C",
          "orange-dark": "#C2412D",
          "orange-light": "#FFF1ED",
        },
        surface: {
          page: "#F7F7FB",
          card: "#FFFFFF",
          muted: "#F0F1F7",
          overlay: "rgba(15,23,42,0.5)",
        },
        text: {
          primary: "#17172B",
          secondary: "#5C5E71",
          hint: "#9294A7",
          inverse: "#FFFFFF",
        },
        border: {
        DEFAULT: "#E3E4EC",
          strong: "#CACBD8",
          focus: "#4F46E5",
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
