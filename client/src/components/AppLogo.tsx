import {
  BRAND_LOGO_URL,
  BRAND_NAME,
} from "../lib/branding";
import { cn } from "../utils/helpers";

type AppLogoProps = {
  collapsed?: boolean;
  className?: string;
};

export default function AppLogo({
  collapsed = false,
  className,
}: AppLogoProps) {
  return (
    <div className={cn("flex w-full items-center justify-center", className)}>
      <img
        src={BRAND_LOGO_URL}
        alt={`${BRAND_NAME} logo`}
        className={cn(
          "object-contain",
          collapsed
            ? "h-8 w-auto max-w-[2.75rem]"
            : "h-8 w-auto max-w-[8.75rem] sm:h-9 sm:max-w-[10rem] md:h-10 md:max-w-[11.5rem]",
        )}
      />
    </div>
  );
}
