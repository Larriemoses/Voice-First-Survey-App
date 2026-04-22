import { BarChart3, Copy, Grid2X2, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/helpers";

const items = [
  { label: "Surveys", href: "/dashboard", icon: Grid2X2 },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Templates", href: "/dashboard/templates", icon: Copy },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function BottomTabBar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid h-14 grid-cols-4 border-t border-gray-200 bg-white md:hidden">
      {items.map((item) => {
        const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn("flex items-center justify-center", active ? "text-primary-500" : "text-gray-400")}
            aria-label={item.label}
          >
            <item.icon className="h-5 w-5" />
          </Link>
        );
      })}
    </nav>
  );
}
