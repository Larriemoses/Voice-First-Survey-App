import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "../../lib/theme";
import { Button } from "./button";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      className={className}
      title={label}
      aria-label={label}
      leadingIcon={
        isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />
      }
    >
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{isDark ? "Light" : "Dark"}</span>
    </Button>
  );
}
