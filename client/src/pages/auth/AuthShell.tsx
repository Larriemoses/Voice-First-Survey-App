import type { ReactNode } from "react";
import {
  AudioLines,
  ChartColumnBig,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { TopNav } from "../../components/layout/TopNav";
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
  helperTitle = "Save every voice. Discover the pattern.",
  helperDescription = "Collect natural answers, organise them into clear themes, and keep the insights your team wants to revisit.",
  helperFeatures = defaultFeatures,
  cardClassName,
}: AuthShellProps) {
  if (centered) {
    return (
      <div className="min-h-screen bg-surface-page">
        <TopNav />
        <main className="survica-page-shell flex min-h-[calc(100vh-68px)] items-center justify-center py-10 md:py-16">
          <div className="w-full max-w-[520px] space-y-7">
            <div className="space-y-3 text-center">
              <p className="text-sm font-semibold text-brand-blue">{eyebrow}</p>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-[-0.04em] text-text-primary sm:text-4xl">
                  {title}
                </h1>
                <p className="text-base text-text-secondary">{description}</p>
              </div>
            </div>
            <div className={cn("rounded-xl bg-white p-6 shadow-md sm:p-8", cardClassName)}>{children}</div>
            {footer ? <div className="text-center">{footer}</div> : null}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-page">
      <TopNav />
      <main className="min-h-[calc(100vh-68px)] bg-surface-page px-5 py-8 sm:px-8 lg:py-12">
        <div className="mx-auto grid max-w-[1160px] overflow-hidden rounded-2xl bg-white shadow-lg lg:grid-cols-[minmax(0,1fr)_480px]">
          <section className="relative hidden min-h-[680px] overflow-hidden bg-brand-blue-light p-10 text-text-primary lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="max-w-xl space-y-5">
              <p className="text-sm font-semibold text-brand-blue">{eyebrow}</p>
              <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.05em] xl:text-5xl">
                {helperTitle}
              </h1>
              <p className="max-w-lg text-base leading-7 text-text-secondary">
                {helperDescription}
              </p>
            </div>
            <div className="space-y-2">
                {helperFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue-light text-brand-blue">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h2 className="text-sm font-semibold text-text-primary">
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

          <section className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <div className="space-y-7">
              <p className="text-sm font-semibold text-brand-blue">{eyebrow}</p>
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
