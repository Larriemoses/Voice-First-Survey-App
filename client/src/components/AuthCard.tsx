import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import AppLogo from "./AppLogo";
import { Button } from "./ui/button";
import { Card } from "./ui/Card";

type AuthCardProps = {
  mode: "login" | "signup";
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function AuthCard({
  mode,
  title,
  subtitle,
  children,
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-md p-6 motion-safe:animate-[page-in_320ms_ease-out] sm:p-8">
      <div className="mb-8 flex flex-col items-center space-y-5 text-center">
        <div className="h-7">
          <AppLogo imageClassName="h-full w-auto" />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)]">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mx-auto mb-6 flex w-full max-w-xs gap-3 sm:max-w-sm">
        <Link to="/login" className="flex-1 min-w-0">
          <Button
            variant="secondary"
            className="w-full"
            aria-current={mode === "login" ? "page" : undefined}
          >
            Sign In
          </Button>
        </Link>
        <Link to="/signup" className="flex-1 min-w-0">
          <Button
            className="w-full"
            aria-current={mode === "signup" ? "page" : undefined}
          >
            Get Started
          </Button>
        </Link>
      </div>

      {children}
    </Card>
  );
}
