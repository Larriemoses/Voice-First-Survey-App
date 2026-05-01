import { cn } from "../../utils/helpers";

export type SkeletonBlockProps = {
  className?: string;
  width?: string;
  height?: string;
};

export function SkeletonBlock({
  className,
  width,
  height,
}: SkeletonBlockProps) {
  return (
    <div
      className={cn(
        "survica-skeleton rounded-md bg-surface-muted",
        width ?? "w-full",
        height ?? "h-4",
        className,
      )}
      aria-hidden
    />
  );
}
