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

export function getFirstName(value?: string | null): string {
  if (!value?.trim()) {
    return "there";
  }

  const trimmed = value.trim();
  if (trimmed.includes("@")) {
    return trimmed.split("@")[0];
  }

  return trimmed.split(/\s+/)[0] || "there";
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

export function formatRelativeDate(value?: string | null): string {
  if (!value) {
    return "recently";
  }

  const target = new Date(value).getTime();
  const now = Date.now();
  const difference = target - now;
  const minutes = Math.round(difference / (1000 * 60));
  const hours = Math.round(difference / (1000 * 60 * 60));
  const days = Math.round(difference / (1000 * 60 * 60 * 24));

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(minutes) < 60) {
    return formatter.format(minutes, "minute");
  }

  if (Math.abs(hours) < 24) {
    return formatter.format(hours, "hour");
  }

  return formatter.format(days, "day");
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
