import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import AppLogo from "../AppLogo";
import { cn } from "../../utils/helpers";

export type TopNavItem = {
  label: string;
  href: string;
};

export type TopNavProps = {
  items?: TopNavItem[];
  className?: string;
  loginHref?: string;
  signupHref?: string;
};

const defaultItems: TopNavItem[] = [
  { label: "Product", href: "#product" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
];

export function TopNav({
  items = defaultItems,
  className,
  loginHref = "/login",
  signupHref = "/signup",
}: TopNavProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-surface-card/95 backdrop-blur-xl",
        className,
      )}
    >
      <div className="survica-page-shell flex h-[72px] items-center justify-between gap-4">
        <Link to="/" className="flex h-10 items-center" aria-label="Survica home">
          <AppLogo className="h-9 max-w-[138px]" imageClassName="max-w-full" />
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-3 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-surface-muted"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden min-w-0 flex-1 items-center justify-center md:flex lg:max-w-md">
          <div className="flex h-12 w-full items-center gap-3 rounded-full bg-surface-muted px-4 text-text-hint">
            <Search className="h-5 w-5" />
            <span className="truncate text-sm">Search surveys, responses, and insights</span>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" onClick={() => navigate(loginHref)}>
            Log in
          </Button>
          <Button variant="gradient" onClick={() => navigate(signupHref)}>
            Get started free
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          iconOnly
          className="md:hidden"
          leadingIcon={open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="top-nav-mobile-drawer"
        >
          {open ? "Close menu" : "Open menu"}
        </Button>
      </div>

      <div
        id="top-nav-mobile-drawer"
        className={cn(
          "overflow-hidden bg-surface-card transition-[max-height,opacity] duration-200 md:hidden",
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="survica-page-shell flex flex-col gap-4 py-4">
          <nav className="flex flex-col gap-3">
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-base text-text-primary"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="grid gap-2">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                closeMenu();
                navigate(loginHref);
              }}
            >
              Log in
            </Button>
            <Button
              variant="gradient"
              className="w-full"
              onClick={() => {
                closeMenu();
                navigate(signupHref);
              }}
            >
              Get started free
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
