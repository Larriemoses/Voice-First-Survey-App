import type { ImgHTMLAttributes } from "react";

type AvatarProps = ImgHTMLAttributes<HTMLImageElement> & {
  name?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function Avatar({ name = "User", src, alt, size = "md", className = "", ...props }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (src) {
    return <img src={src} alt={alt || name} className={["rounded-full object-cover", sizeMap[size], className].join(" ")} {...props} />;
  }

  return (
    <span className={["inline-flex items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700", sizeMap[size], className].join(" ")}>
      {initials || "U"}
    </span>
  );
}
