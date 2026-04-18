import { useEffect, useMemo, useState, type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BadgePlus,
  Building2,
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
      <aside className="shell-noise fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-[var(--color-border-subtle)] bg-[var(--color-surface-overlay)]/98 md:flex md:flex-col">
        <div className="flex h-24 items-center justify-center px-6">
          <AppLogo className="mx-auto" />
        </div>

        <div className="flex flex-1 flex-col justify-between px-3 pb-4">
          <div className="space-y-6">
            <nav className="space-y-1">
              {primaryNav.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-sm"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]",
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="space-y-1 border-t border-[var(--color-border-subtle)] pt-4">
              {secondaryNav.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-[var(--color-surface-raised)] text-[var(--color-text)]"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]",
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar
                  name={accountLabel}
                  size="md"
                  className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                    {accountLabel}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Signed in
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 shadow-sm">
              <p className="text-sm font-semibold text-[var(--color-text)]">
                Keep momentum
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                Build your survey flow, publish it, then review responses in one place.
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="w-full"
              leadingIcon={<LogOut className="h-4 w-4" />}
            >
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      <div className="fixed inset-x-0 top-0 z-40 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-overlay)]/98 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            leadingIcon={<LogOut className="h-4 w-4" />}
          >
            Sign out
          </Button>
          <AppLogo />
          <div className="w-11 shrink-0" />
        </div>
      </div>

      <main className="min-h-screen pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-20 transition-[padding] duration-200 md:pl-72 md:pt-0 md:pb-10">
        <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 md:py-5 lg:px-8">
          <div className="w-full min-w-0">{children}</div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-overlay)]/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
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
