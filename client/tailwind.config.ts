import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EEF4FF",
          100: "#DCE8FF",
          200: "#B8CCFF",
          400: "#5F86FF",
          500: "#2457F5",
          600: "#1D46D8",
          700: "#1736A8",
          900: "#101A59",
        },
        accent: {
          50: "#FFF5ED",
          100: "#FFE5D2",
          400: "#FF9452",
          500: "#FF6B1A",
          600: "#F05A0B",
          700: "#B93F05",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
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
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
