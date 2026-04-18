import { useEffect, useMemo, useState, type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  ClipboardList,
  LayoutGrid,
  LogOut,
  UserRound,
} from "lucide-react";
import { getCurrentUser, signOutUser } from "../lib/auth";
import { getMyOrganizationMembership } from "../lib/organization";
import { cn } from "../utils/helpers";
import AppLogo from "./AppLogo";
import { Avatar } from "./ui/Avatar";
import { ThemeToggle } from "./ui/ThemeToggle";
import { Button } from "./ui/button";

type Props = {
  children: ReactNode;
};

const primaryNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/surveys", label: "Surveys", icon: ClipboardList },
  { to: "/profile", label: "Profile", icon: UserRound },
];

const secondaryNav = [
  { to: "/onboarding", label: "Workspace setup", icon: Building2 },
];

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/surveys/create")) return "New Survey";
  if (/^\/surveys\/[^/]+\/responses/.test(pathname)) return "Responses";
  if (/^\/surveys\/[^/]+/.test(pathname)) return "Survey Builder";
  if (pathname.startsWith("/surveys")) return "Surveys";
  if (pathname.startsWith("/profile")) return "Profile";
  if (pathname.startsWith("/onboarding")) return "Workspace";
  return "Dashboard";
}

function isNavActive(pathname: string, to: string) {
  if (to === "/dashboard") {
    return pathname === "/dashboard";
  }

  if (to === "/surveys") {
    return pathname.startsWith("/surveys");
  }

  if (to === "/profile") {
    return pathname.startsWith("/profile");
  }

  return pathname === to;
}

export default function DashboardShell({ children }: Props) {
  const [accountLabel, setAccountLabel] = useState("Your workspace");
  const [workspaceLabel, setWorkspaceLabel] = useState("No workspace yet");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function loadUser() {
      const [user, membership] = await Promise.all([
        getCurrentUser(),
        getMyOrganizationMembership(),
      ]);
      const fullName = user?.user_metadata?.full_name as string | undefined;
      setAccountLabel(fullName || user?.email || "Your workspace");
      setWorkspaceLabel(membership?.organization?.name || "No workspace yet");
    }

    void loadUser();
  }, []);

  async function handleLogout() {
    await signOutUser();
    navigate("/login");
  }

  const activeMobileLabel = useMemo(
    () => getPageTitle(location.pathname),
    [location.pathname],
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[var(--border-sub)] bg-[var(--surface)]/95 md:flex md:flex-col">
        <div className="flex h-14 items-center px-4">
          <div className="h-6">
            <AppLogo imageClassName="h-full w-auto" />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between px-3 pb-4 pt-4">
          <div className="space-y-4">
            <nav className="space-y-1">
              {primaryNav.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={() =>
                    cn(
                      "flex min-h-11 items-center gap-3 rounded-[var(--radius)] px-3 text-sm font-medium",
                      isNavActive(location.pathname, to)
                        ? "bg-[var(--surface-muted)] text-[var(--text)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]",
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
                  className={() =>
                    cn(
                      "flex min-h-11 items-center gap-3 rounded-[var(--radius)] px-3 text-sm font-medium",
                      location.pathname.startsWith(to)
                        ? "bg-[var(--surface-muted)] text-[var(--text)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]",
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
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
              <div className="flex items-center gap-3">
                <Avatar
                  name={accountLabel}
                  size="md"
                  className="bg-[color:color-mix(in_srgb,var(--accent)_12%,var(--surface-muted))] text-[var(--accent)]"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">
                    {accountLabel}
                  </p>
                  <p className="truncate text-xs text-[var(--text-muted)]">
                    {workspaceLabel}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle className="w-full justify-center" />
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
        </div>
      </aside>

      <div className="fixed inset-x-0 top-0 z-40 border-b border-[var(--border-sub)] bg-[var(--surface)]/95 px-4 backdrop-blur md:hidden">
        <div className="mx-auto flex h-12 max-w-5xl items-center gap-3">
          <div className="h-5 shrink-0">
            <AppLogo imageClassName="h-full w-auto" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--text)]">
              {activeMobileLabel}
            </p>
          </div>
        </div>
      </div>

      <main className="min-h-screen pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-12 md:pl-64 md:pt-0 md:pb-10">
        <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 md:py-5 lg:px-8">
          <div className="w-full min-w-0">{children}</div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border-sub)] bg-[var(--surface)]/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-sm">
          {primaryNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={() =>
                cn(
                  "flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center rounded-[10px] px-1 text-[11px] font-medium",
                  isNavActive(location.pathname, to)
                    ? "bg-[var(--surface-muted)] text-[var(--text)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]",
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span className="mt-1 truncate">{label}</span>
            </NavLink>
          ))}
        </div>
        <div className="px-2 pt-2 text-center text-[11px] text-[var(--text-muted)]">
          {activeMobileLabel}
        </div>
      </div>
    </div>
  );
}
