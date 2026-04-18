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
            ? "h-11 w-auto max-w-[3.5rem]"
            : "h-14 w-auto max-w-[13rem] sm:h-16 sm:max-w-[16rem] md:h-[4.5rem] md:max-w-[18rem]",
        )}
      />
    </div>
  );
}
