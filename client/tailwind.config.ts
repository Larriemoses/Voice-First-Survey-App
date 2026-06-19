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
          blue: "#D7193F",
          "blue-dark": "#A90F2E",
          "blue-light": "#FFF1F4",
          orange: "#D97706",
          "orange-dark": "#B45309",
          "orange-light": "#FFF7ED",
        },
        surface: {
          page: "#F8F8F6",
          card: "#FFFFFF",
          muted: "#F1F1EE",
          overlay: "rgba(15,23,42,0.5)",
        },
        text: {
          primary: "#171716",
          secondary: "#62615D",
          hint: "#8B8983",
          inverse: "#FFFFFF",
        },
        border: {
          DEFAULT: "#E5E4DF",
          strong: "#CFCDC6",
          focus: "#D7193F",
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
          "Inter",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        xs: "12px",
        sm: "13px",
        base: "15px",
        md: "16px",
        lg: "18px",
        xl: "24px",
        "2xl": "30px",
        "3xl": "36px",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "12px",
        xl: "14px",
        "2xl": "16px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0 8px 24px rgba(23, 23, 22, 0.07)",
        lg: "0 18px 50px rgba(23, 23, 22, 0.10)",
        focus: "0 0 0 3px rgba(215, 25, 63, 0.14)",
      },
      maxWidth: {
        content: "1440px",
      },
    },
  },
  plugins: [],
} satisfies Config;
