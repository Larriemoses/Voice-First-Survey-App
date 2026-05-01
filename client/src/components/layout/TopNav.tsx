import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
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
        "sticky top-0 z-50 border-b border-border bg-surface-card/95 backdrop-blur-sm",
        className,
      )}
    >
      <div className="survica-page-shell flex h-[60px] items-center justify-between">
        <Link to="/" className="flex h-7 items-center" aria-label="Survica home">
          <img src="/logo.svg" alt="Survica" className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-base text-text-secondary transition-colors duration-150 hover:text-brand-blue"
            >
              {item.label}
            </a>
          ))}
        </nav>

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
          "overflow-hidden border-t border-border bg-surface-card transition-[max-height,opacity] duration-200 md:hidden",
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
