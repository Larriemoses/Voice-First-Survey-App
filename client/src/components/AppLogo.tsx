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
            ? "h-9 w-auto max-w-[3rem]"
            : "h-10 w-auto max-w-[10rem] sm:h-11 sm:max-w-[11.5rem] md:h-12 md:max-w-[13rem]",
        )}
      />
    </div>
  );
}
