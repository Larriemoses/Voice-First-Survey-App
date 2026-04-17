import { useEffect, useMemo, useState, type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BadgePlus,
  Building2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LayoutGrid,
  LogOut,
  UserRound,
} from "lucide-react";
import { getCurrentUser, signOutUser } from "../lib/auth";
import { cn } from "../utils/helpers";
import AppLogo from "./AppLogo";
import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/button";
import { Tooltip } from "./ui/Tooltip";

type Props = {
  children: ReactNode;
};

const primaryNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/surveys", label: "Surveys", icon: ClipboardList },
  { to: "/surveys/create", label: "Create", icon: BadgePlus },
  { to: "/profile", label: "Profile", icon: UserRound },
];

const secondaryNav = [
  { to: "/onboarding", label: "Workspace setup", icon: Building2 },
];

export default function DashboardShell({ children }: Props) {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [accountLabel, setAccountLabel] = useState("Your workspace");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser();
      const fullName = user?.user_metadata?.full_name as string | undefined;
      setAccountLabel(fullName || user?.email || "Your workspace");
    }

    loadUser();
  }, []);

  async function handleLogout() {
    await signOutUser();
    navigate("/login");
  }

  const activeMobileLabel = useMemo(() => {
    const currentItem = primaryNav.find((item) =>
      location.pathname.startsWith(item.to),
    );

    return currentItem?.label ?? "Workspace";
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[var(--color-page)] text-[var(--color-text)]">
      <aside
        className={cn(
          "shell-noise fixed inset-y-0 left-0 z-30 hidden border-r border-[var(--color-border-subtle)] bg-[var(--color-surface-overlay)]/95 backdrop-blur lg:flex lg:flex-col",
          desktopCollapsed ? "w-16" : "w-72",
        )}
      >
        <div className="flex h-20 items-center justify-between px-5">
          <AppLogo collapsed={desktopCollapsed} />
        </div>

        <div className="flex flex-1 flex-col justify-between px-3 pb-4">
          <div className="space-y-6">
            <nav className="space-y-1">
              {primaryNav.map(({ to, label, icon: Icon }) => {
                const link = (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        "flex min-h-11 items-center rounded-2xl px-3 text-sm font-medium transition-all duration-200",
                        desktopCollapsed ? "justify-center" : "gap-3",
                        isActive
                          ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-sm"
                          : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]",
                      )
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!desktopCollapsed ? (
                      <span className="truncate">{label}</span>
                    ) : null}
                  </NavLink>
                );

                return desktopCollapsed ? (
                  <Tooltip key={to} content={label}>
                    {link}
                  </Tooltip>
                ) : (
                  link
                );
              })}
            </nav>

            <div className="space-y-1 border-t border-[var(--color-border-subtle)] pt-4">
              {secondaryNav.map(({ to, label, icon: Icon }) => {
                const link = (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        "flex min-h-11 items-center rounded-2xl px-3 text-sm font-medium transition-all duration-200",
                        desktopCollapsed ? "justify-center" : "gap-3",
                        isActive
                          ? "bg-[var(--color-surface-raised)] text-[var(--color-text)]"
                          : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]",
                      )
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!desktopCollapsed ? <span>{label}</span> : null}
                  </NavLink>
                );

                return desktopCollapsed ? (
                  <Tooltip key={to} content={label}>
                    {link}
                  </Tooltip>
                ) : (
                  link
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div
              className={cn(
                "rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 shadow-sm",
                desktopCollapsed && "px-2",
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-3",
                  desktopCollapsed && "justify-center",
                )}
              >
                <Avatar
                  name={accountLabel}
                  size="md"
                  className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                />
                {!desktopCollapsed ? (
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                      {accountLabel}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Signed in
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {!desktopCollapsed ? (
              <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 shadow-sm">
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  Keep momentum
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                  Build your survey flow, publish it, then review responses in one place.
                </p>
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDesktopCollapsed((current) => !current)}
                className={cn("flex-1", desktopCollapsed && "flex-none")}
                leadingIcon={
                  desktopCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )
                }
              >
                {!desktopCollapsed ? "Collapse" : ""}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className={cn("flex-1", desktopCollapsed && "flex-none")}
                leadingIcon={<LogOut className="h-4 w-4" />}
              >
                {!desktopCollapsed ? "Sign out" : ""}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <main
        className={cn(
          "min-h-screen pb-[calc(5.5rem+env(safe-area-inset-bottom))] transition-[padding] duration-200 lg:pb-10",
          desktopCollapsed ? "lg:pl-16" : "lg:pl-72",
        )}
      >
        <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="w-full min-w-0">{children}</div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-overlay)]/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-1 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-1.5 shadow-md">
          {primaryNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center rounded-[20px] px-1 text-[11px] font-semibold transition-all duration-200",
                  isActive
                    ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]",
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span className="mt-1 truncate">{label}</span>
            </NavLink>
          ))}
        </div>
        <div className="px-2 pt-2 text-center text-[11px] text-[var(--color-text-muted)]">
          {activeMobileLabel}
        </div>
      </div>
    </div>
  );
}
