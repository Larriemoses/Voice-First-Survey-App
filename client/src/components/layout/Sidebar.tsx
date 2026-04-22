import { BarChart3, Circle, Copy, Grid2X2, HelpCircle, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import AppLogo from "../AppLogo";
import { SidebarIcon } from "../ui/SidebarIcon";

const topItems = [
  { label: "Surveys", href: "/dashboard", icon: Grid2X2 },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Responses", href: "/dashboard/surveys/q4-customer-satisfaction/results", icon: Circle },
  { label: "Templates", href: "/dashboard/templates", icon: Copy },
];

const bottomItems = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Help", href: "/", icon: HelpCircle },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname.startsWith(href);
}

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[52px] flex-col border-r border-gray-200 bg-white md:flex">
      <Link to="/" className="flex h-[52px] items-center justify-center" aria-label="Survica home">
        <AppLogo markOnly className="h-5" imageClassName="max-w-5" />
      </Link>
      <nav className="flex flex-1 flex-col items-center justify-between py-3">
        <div className="flex flex-col gap-2">
          {topItems.map((item) => (
            <Link key={item.href} to={item.href} aria-label={item.label}>
              <SidebarIcon icon={<item.icon className="h-4 w-4" />} active={isActive(pathname, item.href)} tooltip={item.label} />
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {bottomItems.map((item) => (
            <Link key={item.href} to={item.href} aria-label={item.label}>
              <SidebarIcon icon={<item.icon className="h-4 w-4" />} active={isActive(pathname, item.href)} tooltip={item.label} />
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
