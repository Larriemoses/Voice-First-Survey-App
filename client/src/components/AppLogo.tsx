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
    <div
      className={cn(
        "flex w-full items-center",
        collapsed ? "justify-center" : "max-w-[12.75rem]",
        className,
      )}
    >
      <img
        src={BRAND_LOGO_URL}
        alt={`${BRAND_NAME} logo`}
        className={cn(
          "object-contain shadow-sm ring-1 ring-black/5",
          collapsed
            ? "h-11 w-full max-w-[2.9rem] rounded-2xl border border-[var(--color-border)] bg-white p-1.5"
            : "h-12 w-full rounded-[22px] border border-[color:color-mix(in_srgb,var(--color-border)_72%,white)] bg-white px-3 py-2",
        )}
      />
    </div>
  );
}
