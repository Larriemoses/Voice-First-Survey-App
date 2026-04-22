import type { ReactNode } from "react";
import { BottomTabBar } from "./BottomTabBar";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="min-h-screen pb-20 md:ml-[52px] md:pb-0">{children}</main>
      <BottomTabBar />
    </div>
  );
}
