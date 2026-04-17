import type { ReactNode } from "react";
import AppLogo from "./AppLogo";
import { Card } from "./ui/Card";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <Card className="w-full max-w-lg rounded-[32px] p-6 sm:p-8" variant="elevated">
      <div className="mb-8 space-y-5">
        <AppLogo />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {children}
    </Card>
  );
}
