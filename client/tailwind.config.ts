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
          blue: "#6366F1",
          "blue-dark": "#4F46E5",
          "blue-light": "#EEF2FF",
          orange: "#F59E0B",
          "orange-dark": "#D97706",
          "orange-light": "#FFFBEB",
        },
        surface: {
          page: "#F8FAFC",
          card: "#FFFFFF",
          muted: "#F6F7FB",
          overlay: "rgba(15,23,42,0.5)",
        },
        text: {
          primary: "#0F172A",
          secondary: "#64748B",
          hint: "#94A3B8",
          inverse: "#FFFFFF",
        },
        border: {
          DEFAULT: "#E2E8F0",
          strong: "#CBD5E1",
          focus: "#6366F1",
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
        md: "8px",
        lg: "10px",
        xl: "12px",
        "2xl": "12px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0 8px 24px rgba(23, 23, 22, 0.07)",
        lg: "0 18px 50px rgba(23, 23, 22, 0.10)",
        focus: "0 0 0 3px rgba(99, 102, 241, 0.16)",
      },
      maxWidth: {
        content: "1440px",
      },
    },
  },
  plugins: [],
} satisfies Config;
