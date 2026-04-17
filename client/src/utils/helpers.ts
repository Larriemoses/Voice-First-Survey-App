import type { ReactElement, ReactNode } from "react";

export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function getInitials(name?: string | null): string {
  if (!name?.trim()) return "SV";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatDate(
  value?: string | null,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
): string {
  if (!value) return "No date yet";

  return new Intl.DateTimeFormat("en-US", options).format(new Date(value));
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "No date yet";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatShortNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  if (minutes === 0) return `${remainder}s`;
  return `${minutes}m ${remainder.toString().padStart(2, "0")}s`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function toSentenceList(values: string[]): string {
  if (values.length <= 1) return values[0] ?? "";

  return values.reduce((result, value, index) => {
    if (index === 0) return value;
    if (index === values.length - 1) return `${result} and ${value}`;
    return `${result}, ${value}`;
  }, "");
}

export function isReactElement(
  value: ReactNode,
): value is ReactElement<Record<string, unknown>> {
  return typeof value === "object" && value !== null && "type" in value;
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      [
        "a[href]",
        "button:not([disabled])",
        "textarea:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "[tabindex]:not([tabindex='-1'])",
      ].join(","),
    ),
  ).filter((element) => !element.hasAttribute("disabled"));
}
