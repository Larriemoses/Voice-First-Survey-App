import type { ReactNode } from "react";
import {
  AudioLines,
  ChartColumnBig,
  FileText,
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

const pinStyles = [
  "min-h-44 bg-[#ffd7d9]",
  "min-h-64 bg-[#d9efe6]",
  "min-h-52 bg-[#ffe7bd]",
] as const;

export function AuthShell({
  title,
  description,
  eyebrow = "Secure workspace access",
  children,
  centered = false,
  footer,
  helperTitle = "Save every voice. Discover the pattern.",
  helperDescription = "Collect natural answers, organise them into clear themes, and keep the insights your team wants to revisit.",
  helperFeatures = defaultFeatures,
  cardClassName,
}: AuthShellProps) {
  if (centered) {
    return (
      <div className="min-h-screen bg-surface-page">
        <TopNav />
        <main className="survica-page-shell flex min-h-[calc(100vh-72px)] items-center justify-center bg-[radial-gradient(circle_at_15%_15%,#fff0f3_0%,transparent_28%),radial-gradient(circle_at_85%_75%,#f3f3f3_0%,transparent_32%)] py-8 md:py-10">
          <div className="w-full max-w-2xl space-y-5">
            <div className="space-y-3 text-center">
              <Badge variant="done" className="mx-auto">
                {eyebrow}
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-[-0.04em] text-text-primary sm:text-4xl">
                  {title}
                </h1>
                <p className="text-base text-text-secondary">{description}</p>
              </div>
            </div>
            <Card className={cn("border border-border/70 p-6 shadow-lg sm:p-8", cardClassName)}>{children}</Card>
            {footer ? <div className="text-center">{footer}</div> : null}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-page">
      <TopNav />
      <main className="min-h-[calc(100vh-72px)] bg-[#f7f7f7] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto grid max-w-[1320px] gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(390px,480px)] lg:items-stretch">
          <section className="relative hidden min-h-[720px] overflow-hidden rounded-[32px] bg-[#111111] p-7 text-white lg:block">
            <div className="relative z-10 max-w-xl space-y-3">
              <Badge className="bg-white/15 text-white">{eyebrow}</Badge>
              <h1 className="text-4xl font-semibold leading-tight tracking-[-0.045em] xl:text-5xl">
                {helperTitle}
              </h1>
              <p className="max-w-lg text-base leading-7 text-white/65">
                {helperDescription}
              </p>
            </div>

            <div className="absolute inset-x-7 bottom-[-70px] top-[250px] columns-3 gap-3 overflow-hidden">
                {helperFeatures.map((feature) => {
                  const Icon = feature.icon;
                  const index = helperFeatures.indexOf(feature);

                  return (
                    <div
                      key={feature.title}
                      className={cn(
                        "mb-3 break-inside-avoid rounded-[28px] p-5 text-text-primary shadow-lg",
                        pinStyles[index % pinStyles.length],
                      )}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/75 text-brand-blue">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="mt-8 space-y-2">
                          <h2 className="text-lg font-semibold">
                            {feature.title}
                          </h2>
                          <p className="text-sm leading-6 text-text-secondary">
                            {feature.description}
                          </p>
                        </div>
                    </div>
                  );
                })}
            </div>
          </section>

          <section className="flex flex-col justify-center rounded-[32px] bg-white p-6 shadow-sm sm:p-9 lg:p-10">
            <div className="space-y-6">
              <Badge variant="done" className="w-fit">{eyebrow}</Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-[-0.045em] text-text-primary sm:text-4xl">
                  {title}
                </h1>
                <p className="max-w-xl text-base leading-7 text-text-secondary">
                  {description}
                </p>
              </div>

            <div className={cn("pt-2", cardClassName)}>{children}</div>
            {footer ? <div>{footer}</div> : null}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
