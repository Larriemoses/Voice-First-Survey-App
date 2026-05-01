import {
  BarChart3,
  CircleHelp,
  Copy,
  LayoutGrid,
  Radio,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import AppLogo from "../AppLogo";
import { SidebarIcon } from "../ui/SidebarIcon";

type SidebarItem = {
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

const middleItems: SidebarItem[] = [
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
    label: "Templates",
    href: "/dashboard/templates",
    icon: Copy,
    isActive: (pathname) => pathname.startsWith("/dashboard/templates"),
  },
];

const bottomItems: SidebarItem[] = [
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    isActive: (pathname) => pathname.startsWith("/dashboard/settings"),
  },
  {
    label: "Help",
    href: "/",
    icon: CircleHelp,
    isActive: () => false,
  },
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[52px] border-r border-border bg-surface-card md:flex">
      <div className="flex h-full w-full flex-col">
        <Link
          to="/"
          className="flex h-[52px] items-center justify-center border-b border-border"
          aria-label="Survica home"
        >
          <AppLogo markOnly className="h-5" imageClassName="max-w-5" />
        </Link>
        <nav className="flex flex-1 flex-col items-center justify-between py-3">
          <div className="flex flex-col gap-2">
            {middleItems.map((item) => {
              const href =
                item.label === "Responses"
                  ? getCurrentResultsPath(pathname)
                  : item.href;

              return (
                <Link key={item.label} to={href} aria-label={item.label}>
                  <SidebarIcon
                    icon={<item.icon className="h-4 w-4" />}
                    active={item.isActive(pathname)}
                    tooltip={item.label}
                    aria-current={item.isActive(pathname) ? "page" : undefined}
                  />
                </Link>
              );
            })}
          </div>
          <div className="flex flex-col gap-2">
            {bottomItems.map((item) => (
              <Link key={item.label} to={item.href} aria-label={item.label}>
                <SidebarIcon
                  icon={<item.icon className="h-4 w-4" />}
                  active={item.isActive(pathname)}
                  tooltip={item.label}
                  aria-current={item.isActive(pathname) ? "page" : undefined}
                />
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}
