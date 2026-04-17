import { LoaderCircle } from "lucide-react";
import { cn } from "../../utils/helpers";

type SpinnerProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

export function Spinner({ className, size = "md" }: SpinnerProps) {
  return (
    <LoaderCircle
      className={cn(
        "animate-spin text-current",
        sizeClasses[size],
        className,
      )}
      aria-hidden="true"
    />
  );
}
