import type { HTMLAttributes } from "react";
import { cn } from "../../utils/helpers";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton-shimmer rounded-2xl", className)}
      aria-hidden="true"
      {...props}
    />
  );
}
