import { NavLink } from "react-router-dom";
import {
  FaChartBar,
  FaClipboardList,
  FaUser,
  FaBriefcase,
} from "react-icons/fa";
import AppLogo from "./AppLogo";

type SidebarProps = {
  isMobile: boolean;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: FaChartBar },
  { to: "/surveys", label: "Surveys", icon: FaClipboardList },
  { to: "/profile", label: "Profile Settings", icon: FaUser },
  { to: "/onboarding", label: "Organization Setup", icon: FaBriefcase },
];

export default function Sidebar({
  isMobile,
  collapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <aside
      className={[
        "fixed left-0 top-0 z-50 h-screen border-r border-slate-200/80 bg-white/90 backdrop-blur transition-all duration-300",
        isMobile
          ? mobileOpen
            ? "w-[280px] translate-x-0 shadow-2xl"
            : "w-[280px] -translate-x-full"
          : collapsed
            ? "w-24 translate-x-0"
            : "w-72 translate-x-0",
      ].join(" ")}
      aria-hidden={isMobile ? !mobileOpen : false}
    >
      <div className="flex h-16 items-center border-b border-slate-200 px-4">
        <AppLogo collapsed={collapsed && !isMobile} />
      </div>

      <div className="flex h-[calc(100vh-64px)] flex-col">
        <nav className="flex-1 space-y-2 overflow-y-auto p-3">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={isMobile ? onCloseMobile : undefined}
                className={({ isActive }) =>
                  [
                    "group flex min-h-[48px] items-center rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    collapsed && !isMobile ? "justify-center" : "gap-3",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {collapsed && !isMobile ? null : (
                  <span className="truncate">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-cyan-50 p-4">
            {collapsed && !isMobile ? (
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xs font-semibold text-indigo-600 shadow-sm">
                AI
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-slate-900">
                  Survica AI
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Turn voice responses into reports, themes, and decisions.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
