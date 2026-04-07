import { NavLink } from "react-router-dom";
import {
  FaChartBar,
  FaClipboardList,
  FaUser,
  FaBriefcase,
} from "react-icons/fa";

type SidebarProps = {
  isMobile: boolean;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: FaChartBar,
  },
  {
    to: "/surveys",
    label: "Surveys",
    icon: FaClipboardList,
  },
  {
    to: "/profile",
    label: "Profile Settings",
    icon: FaUser,
  },
  {
    to: "/onboarding",
    label: "Organization Setup",
    icon: FaBriefcase,
  },
];

export default function Sidebar({
  isMobile,
  collapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      <aside
        className={[
          "fixed left-0 z-50 border-r border-gray-200 bg-white transition-all duration-300",
          "top-0 h-screen",
          isMobile
            ? mobileOpen
              ? "w-[280px] translate-x-0 shadow-2xl"
              : "w-[280px] -translate-x-full"
            : collapsed
              ? "w-24 translate-x-0"
              : "w-72 translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-16 items-center border-b border-gray-200 px-4">
          <div
            className={[
              "flex items-center gap-3 overflow-hidden transition-all duration-300",
              collapsed && !isMobile ? "justify-center" : "",
            ].join(" ")}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-sm font-bold text-white">
              VS
            </div>

            {collapsed && !isMobile ? null : (
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-gray-900">
                  Voice Survey
                </h2>
                <p className="truncate text-xs text-gray-500">Control center</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex h-[calc(100vh-64px)] flex-col">
          <nav className="flex-1 space-y-2 p-3">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={isMobile ? onCloseMobile : undefined}
                  className={({ isActive }) =>
                    [
                      "group flex items-center rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-gray-900 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                      collapsed && !isMobile ? "justify-center" : "gap-3",
                    ].join(" ")
                  }
                  title={collapsed && !isMobile ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {collapsed && !isMobile ? null : (
                    <span className="truncate">{item.label}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 p-3">
            <div
              className={[
                "rounded-2xl bg-gray-50 p-3 transition-all duration-300",
                collapsed && !isMobile ? "text-center" : "",
              ].join(" ")}
            >
              {collapsed && !isMobile ? (
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-xs font-semibold text-gray-700 shadow-sm">
                  Pro
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold text-gray-900">
                    Workspace ready
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Manage surveys, responses, and settings.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
