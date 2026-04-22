import type { HTMLAttributes } from "react";
import { cn } from "../../utils/helpers";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("rounded-md bg-gray-100 skeleton-pulse", className)}
      aria-hidden="true"
      {...props}
    />
  );
}
