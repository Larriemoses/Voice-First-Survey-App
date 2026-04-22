import { cn } from "../../utils/helpers";

type SkeletonBlockProps = {
  className?: string;
  width?: string;
  height?: string;
};

export function SkeletonBlock({ className, width, height }: SkeletonBlockProps) {
  const sizeClass = width || height ? "min-h-4" : "h-4 w-full";

  return (
    <div
      className={cn(
        "rounded-md bg-gray-100 skeleton-pulse",
        sizeClass,
        width,
        height,
        className,
      )}
      aria-hidden
    />
  );
}
