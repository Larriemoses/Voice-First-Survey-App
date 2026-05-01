import { BarChart3, LayoutGrid, Radio, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/helpers";

type BottomTabItem = {
  label: string;
  href: string;
  icon: typeof LayoutGrid;
  isActive: (pathname: string) => boolean;
};

const DEFAULT_RESULTS_PATH =
  "/dashboard/surveys/q4-customer-satisfaction/results";

function getCurrentResultsPath(pathname: string): string {
  const match = pathname.match(/^\/dashboard\/surveys\/([^/]+)/);

  if (!match?.[1]) {
    return DEFAULT_RESULTS_PATH;
  }

  return `/dashboard/surveys/${match[1]}/results`;
}

function isSurveyBuilderRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/dashboard/surveys/") &&
    !pathname.endsWith("/results") &&
    !pathname.endsWith("/analytics")
  );
}

const items: BottomTabItem[] = [
  {
    label: "Surveys",
    href: "/dashboard",
    icon: LayoutGrid,
    isActive: (pathname) => pathname === "/dashboard" || isSurveyBuilderRoute(pathname),
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    isActive: (pathname) =>
      pathname === "/dashboard/analytics" ||
      pathname.endsWith("/analytics"),
  },
  {
    label: "Responses",
    href: DEFAULT_RESULTS_PATH,
    icon: Radio,
    isActive: (pathname) => pathname.endsWith("/results"),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    isActive: (pathname) => pathname.startsWith("/dashboard/settings"),
  },
];

export function BottomTabBar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface-card px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 md:hidden">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const active = item.isActive(pathname);
          const href =
            item.label === "Responses"
              ? getCurrentResultsPath(pathname)
              : item.href;

          return (
            <Link
              key={item.label}
              to={href}
              className={cn(
                "flex min-h-11 flex-col items-center justify-center gap-1 rounded-md px-2 text-xs font-medium transition-colors duration-150",
                active
                  ? "bg-brand-blue-light text-brand-blue"
                  : "text-text-hint hover:bg-surface-muted hover:text-text-secondary",
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
