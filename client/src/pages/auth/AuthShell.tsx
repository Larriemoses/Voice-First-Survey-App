import type { ReactNode } from "react";
import {
  AudioLines,
  ChartColumnBig,
  FileText,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { TopNav } from "../../components/layout/TopNav";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { cn } from "../../utils/helpers";

type AuthFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type AuthShellProps = {
  title: string;
  description: string;
  eyebrow?: string;
  children: ReactNode;
  centered?: boolean;
  footer?: ReactNode;
  helperTitle?: string;
  helperDescription?: string;
  helperFeatures?: AuthFeature[];
  cardClassName?: string;
};

const defaultFeatures: AuthFeature[] = [
  {
    icon: AudioLines,
    title: "Voice-first collection",
    description: "Capture spoken responses without forcing respondents to create accounts.",
  },
  {
    icon: ChartColumnBig,
    title: "Analytics that explain the why",
    description: "Turn transcripts into trends, themes, sentiment, and export-ready summaries.",
  },
  {
    icon: FileText,
    title: "Reports your team can share",
    description: "Move from raw feedback to PDF, XLSX, and stakeholder-ready insight quickly.",
  },
];

export function AuthShell({
  title,
  description,
  eyebrow = "Secure workspace access",
  children,
  centered = false,
  footer,
  helperTitle = "Keep survey operations inside the workspace",
  helperDescription = "Respondents can answer public links without an account. Creation, analytics, exports, and team controls stay behind authenticated access.",
  helperFeatures = defaultFeatures,
  cardClassName,
}: AuthShellProps) {
  if (centered) {
    return (
      <div className="min-h-screen bg-surface-page">
        <TopNav />
        <main className="survica-page-shell flex min-h-[calc(100vh-60px)] items-center justify-center py-8 md:py-10">
          <div className="w-full max-w-lg space-y-5">
            <div className="space-y-3 text-center">
              <Badge variant="done" className="mx-auto">
                {eyebrow}
              </Badge>
              <div className="space-y-2">
                <h1 className="text-2xl font-medium text-text-primary sm:text-3xl">
                  {title}
                </h1>
                <p className="text-base text-text-secondary">{description}</p>
              </div>
            </div>
            <Card className={cn("shadow-md", cardClassName)}>{children}</Card>
            {footer ? <div className="text-center">{footer}</div> : null}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-page">
      <TopNav />
      <main className="survica-page-shell py-8 md:py-10 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(380px,440px)] lg:items-stretch">
          <section className="hidden rounded-xl border border-border bg-surface-card p-6 lg:flex lg:flex-col lg:justify-between">
            <div className="space-y-5">
              <Badge variant="done">{eyebrow}</Badge>
              <div className="space-y-3">
                <h1 className="max-w-2xl text-3xl font-medium text-text-primary xl:text-[34px]">
                  {helperTitle}
                </h1>
                <p className="max-w-xl text-base text-text-secondary">
                  {helperDescription}
                </p>
              </div>
              <div className="grid gap-3">
                {helperFeatures.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="rounded-lg border border-border bg-surface-page p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue-light text-brand-blue">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h2 className="text-base font-medium text-text-primary">
                            {feature.title}
                          </h2>
                          <p className="text-sm text-text-secondary">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-page p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange-light text-brand-orange-dark">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-medium text-text-primary">
                    Professional by default
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Email redirects, protected routes, and workspace checks are enforced in the auth layer, not scattered across pages.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="space-y-3 lg:pt-6">
              <Badge variant="done">{eyebrow}</Badge>
              <div className="space-y-2">
                <h1 className="text-2xl font-medium text-text-primary sm:text-3xl">
                  {title}
                </h1>
                <p className="max-w-xl text-base text-text-secondary">
                  {description}
                </p>
              </div>
            </div>

            <Card className={cn("shadow-md", cardClassName)}>{children}</Card>
            {footer ? <div>{footer}</div> : null}
          </section>
        </div>
      </main>
    </div>
  );
}
