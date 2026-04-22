import type { ReactNode } from "react";

export function TopNav({ children }: { children: ReactNode }) {
  return <div className="border-b border-gray-200 bg-white px-6 py-4">{children}</div>;
}
