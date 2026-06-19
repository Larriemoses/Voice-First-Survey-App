import { BarChart3, Home, Mic2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/helpers";

type BottomTabItem = {
  label: string;
  href: string;
  icon: typeof Home;
  isActive: (pathname: string) => boolean;
};

function isSurveyBuilderRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/dashboard/surveys/") &&
    !pathname.endsWith("/results") &&
    !pathname.endsWith("/analytics")
  );
}

const items: BottomTabItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
    isActive: (pathname) => pathname === "/dashboard",
  },
  {
    label: "Record",
    href: "/dashboard/surveys/new",
    icon: Mic2,
    isActive: (pathname) => isSurveyBuilderRoute(pathname),
  },
  {
    label: "Insights",
    href: "/dashboard/analytics",
    icon: BarChart3,
    isActive: (pathname) => pathname.includes("analytics") || pathname.endsWith("/results"),
  },
];

export function BottomTabBar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-sm grid-cols-3 gap-1">
        {items.map((item) => {
          const active = item.isActive(pathname);
          const href = item.href;

          return (
            <Link
              key={item.label}
              to={href}
              className={cn(
                "flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg px-2 text-xs font-medium transition-colors duration-150",
                item.label === "Record"
                  ? "-mt-6 mx-auto h-14 w-14 rounded-full bg-[linear-gradient(135deg,#6366F1,#7C3AED)] text-white shadow-lg"
                  : active
                    ? "text-brand-blue"
                    : "text-text-hint hover:bg-surface-muted hover:text-text-primary",
              )}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
