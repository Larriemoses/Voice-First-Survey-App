import {
  BRAND_FAVICON_URL,
  BRAND_LOGO_URL,
  BRAND_NAME,
} from "../lib/branding";
import { cn } from "../utils/helpers";

type AppLogoProps = {
  className?: string;
  imageClassName?: string;
  markOnly?: boolean;
  alt?: string;
};

export default function AppLogo({
  className,
  imageClassName,
  markOnly = false,
  alt,
}: AppLogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <img
        src={markOnly ? BRAND_FAVICON_URL : BRAND_LOGO_URL}
        alt={alt || `${BRAND_NAME} logo`}
        className={cn("h-full w-auto object-contain", imageClassName)}
      />
    </div>
  );
}
