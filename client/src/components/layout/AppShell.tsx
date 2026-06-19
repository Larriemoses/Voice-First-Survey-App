import type { ReactNode } from "react";
import { BottomTabBar } from "./BottomTabBar";
import { Sidebar } from "./Sidebar";
import { cn } from "../../utils/helpers";

export type AppShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function AppShell({
  children,
  className,
  contentClassName,
}: AppShellProps) {
  return (
    <div className={cn("h-screen overflow-hidden bg-surface-page", className)}>
      <Sidebar />
      <div className="h-screen md:pl-[232px]">
        <main
          className={cn(
            "h-full scroll-smooth overflow-y-auto overflow-x-hidden pb-[calc(64px+env(safe-area-inset-bottom)+16px)] md:pb-0",
            contentClassName,
          )}
        >
          {children}
        </main>
      </div>
      <BottomTabBar />
    </div>
  );
}
