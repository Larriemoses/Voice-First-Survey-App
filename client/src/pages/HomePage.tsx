import {
  AtSign,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Code2,
  Download,
  FileText,
  Globe,
  Heart,
  MessageCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Tag,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { TopNav } from "@/components/layout/TopNav";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { ChartCard } from "@/components/ui/ChartCard";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";
import { Toggle } from "@/components/ui/Toggle";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/utils/helpers";

type PricingFeature = {
  label: string;
  included: boolean;
};

type PricingPlan = {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  annualNote: string;
  description: string;
  features: PricingFeature[];
  buttonLabel: string;
  buttonVariant: "primary" | "secondary" | "orange";
  finePrint: string;
  href?: string;
  mailto?: string;
  featured?: boolean;
  mobileOrderClassName?: string;
  buttonAriaLabel?: string;
};

const heroChartData = [
  { day: "Mon", count: 8 },
  { day: "Tue", count: 14 },
  { day: "Wed", count: 11 },
  { day: "Thu", count: 19 },
  { day: "Fri", count: 24 },
  { day: "Sat", count: 17 },
  { day: "Sun", count: 21 },
];

const howItWorksCards: Array<{
  step: string;
  title: string;
  body: string;
  icon: LucideIcon;
  accent?: boolean;
}> = [
  {
    step: "1",
    title: "Build your survey",
    body:
      "Write your questions manually or describe your goal and let AI generate them for you in seconds. Add your brand logo, choose your colours, and customise the header so your survey feels like it belongs to your company — not a generic form.",
    icon: ClipboardList,
  },
  {
    step: "2",
    title: "Share a link, collect voice responses",
    body:
      "Share one URL anywhere — WhatsApp, email, SMS, or embed it on your site. Respondents tap to record and speak naturally on any device. No app download. No account needed. No typing. Works perfectly on mobile even on slower connections.",
    icon: Share2,
  },
  {
    step: "3",
    title: "Get AI-powered insights instantly",
    body:
      "Survica automatically transcribes every response, analyses sentiment, extracts recurring themes, and writes an executive summary — ready to share with your team or present to leadership. Export as PDF or Excel with one click.",
    icon: Sparkles,
    accent: true,
  },
];

const analyticsTiles: Array<{
  icon: LucideIcon;
  title: string;
  body: string;
}> = [
  {
    icon: Heart,
    title: "Sentiment analysis",
    body:
      "Every response is scored positive, neutral, or negative. See overall mood at a glance and drill into individual answers.",
  },
  {
    icon: Tag,
    title: "Theme extraction",
    body:
      "AI groups recurring keywords and phrases into themes automatically — no tagging, no manual coding, no spreadsheet gymnastics.",
  },
  {
    icon: FileText,
    title: "AI executive summary",
    body:
      "Get a 2–3 paragraph summary of all responses, written for stakeholders who need the headline — not the raw data.",
  },
  {
    icon: Download,
    title: "PDF & Excel export",
    body:
      "Download a polished analytics report as PDF to share, or a structured Excel workbook for your own deeper analysis.",
  },
];

const whyVoiceStats = [
  {
    number: "4.8×",
    label: "higher survey completion rate vs traditional text forms",
    source: "(Mobile-first survey research, African markets)",
  },
  {
    number: "3×",
    label: "more words per response compared to typed answers",
    source: "(Industry voice survey analysis)",
  },
  {
    number: "88%",
    label: "of Nigerian adults have used AI tools — your audience is ready",
    source: "(Google / Ipsos AI Adoption Report, 2026)",
  },
  {
    number: "0",
    label: "typing required. Works for low-literacy and high-literacy users equally",
    source: "(VOIS framework research)",
  },
];

const testimonials = [
  {
    quote:
      "\"We used to spend three hours reading through survey responses every week. Now Survica generates a summary in under a minute. Our product team actually uses the insights now — they didn't before.\"",
    name: "Sarah Chen",
    role: "Head of Product",
    company: "Finlo",
    initials: "SC",
    avatarClassName: "bg-brand-blue-light text-brand-blue",
  },
  {
    quote:
      "\"The voice format completely changed how our customers respond. We're getting three times more detail than we ever did with typed forms. People open up when they can just talk.\"",
    name: "Marcus Adebayo",
    role: "Customer Success Lead",
    company: "Zenta",
    initials: "MA",
    avatarClassName: "bg-brand-orange-light text-brand-orange",
  },
  {
    quote:
      "\"The PDF report is what I send to leadership every quarter. It looks like something a consultant produced — but it takes me five minutes. That's the part that impressed everyone.\"",
    name: "Priya Nair",
    role: "Research Manager",
    company: "Voxel Health",
    initials: "PN",
    avatarClassName: "bg-[#F0FDF4] text-status-success",
  },
];

const pricingPlans: PricingPlan[] = [
  {
    name: "Student",
    monthlyPrice: "$3 / mo",
    annualPrice: "$2 / mo",
    annualNote: "billed $24/yr",
    description:
      "Perfect for academic research, thesis surveys, and class projects. Get professional voice survey tools at a price that works for students.",
    features: [
      { label: "1 active survey at a time", included: true },
      { label: "Up to 50 responses per month", included: true },
      { label: "3 questions per survey", included: true },
      { label: "Audio playback + basic transcription", included: true },
      { label: "CSV export", included: true },
      { label: "Shareable public link", included: true },
      { label: "AI analytics", included: false },
      { label: "PDF/Excel export", included: false },
    ],
    buttonLabel: "Get started free",
    buttonVariant: "secondary",
    href: "/signup?plan=student",
    finePrint: "No card required for free tier",
    buttonAriaLabel: "Create your free Survica account — no card required",
  },
  {
    name: "Starter",
    monthlyPrice: "$9 / mo",
    annualPrice: "$6 / mo",
    annualNote: "billed $72/yr",
    description:
      "For freelancers, consultants, and small teams running regular feedback collection. Everything you need to collect voice responses and export results.",
    features: [
      { label: "3 active surveys", included: true },
      { label: "Up to 200 responses per month", included: true },
      { label: "Unlimited questions per survey", included: true },
      { label: "Full transcription", included: true },
      { label: "Basic sentiment scoring", included: true },
      { label: "CSV + Excel export", included: true },
      { label: "Custom branding (logo + header)", included: true },
      { label: "1 team member seat", included: true },
      { label: "AI executive summary", included: false },
      { label: "PDF analytics report", included: false },
    ],
    buttonLabel: "Start free trial",
    buttonVariant: "secondary",
    href: "/signup?plan=starter",
    finePrint: "14-day free trial, no card required",
    buttonAriaLabel: "Start your 14-day free trial",
  },
  {
    name: "Professional",
    monthlyPrice: "$19 / mo",
    annualPrice: "$13 / mo",
    annualNote: "billed $156/yr",
    description:
      "For growing teams that need the full power of AI analytics. Turn voice responses into insight reports, share with stakeholders, and make decisions faster.",
    features: [
      { label: "Unlimited active surveys", included: true },
      { label: "Up to 500 responses per month", included: true },
      { label: "Unlimited questions", included: true },
      { label: "Full transcription + AI analytics", included: true },
      { label: "Sentiment analysis + theme extraction", included: true },
      { label: "AI executive summary (generated automatically)", included: true },
      { label: "PDF analytics report + Excel workbook", included: true },
      { label: "Custom branding", included: true },
      { label: "3 team member seats", included: true },
      { label: "Survey health AI coach", included: true },
      { label: "Response quality scoring", included: true },
    ],
    buttonLabel: "Start free trial",
    buttonVariant: "primary",
    href: "/signup?plan=professional",
    finePrint: "14-day free trial, cancel anytime",
    featured: true,
    mobileOrderClassName: "order-first md:order-none",
    buttonAriaLabel: "Start your 14-day free trial",
  },
  {
    name: "Organisation",
    monthlyPrice: "$49 / mo",
    annualPrice: "$34 / mo",
    annualNote: "billed $408/yr",
    description:
      "For research organisations, NGOs, agencies, and enterprise teams running large-scale voice data collection with full control and team access.",
    features: [
      { label: "Everything in Professional", included: true },
      { label: "Unlimited responses", included: true },
      { label: "Up to 10 team member seats", included: true },
      { label: "Organisation-wide analytics dashboard", included: true },
      { label: "Cross-survey theme comparison", included: true },
      { label: "Shareable public analytics reports", included: true },
      { label: "Webhook + Slack integration", included: true },
      { label: "Priority support", included: true },
      { label: "Custom onboarding session", included: true },
      { label: "API access (coming soon)", included: true },
    ],
    buttonLabel: "Contact us",
    buttonVariant: "orange",
    mailto: "mailto:hello@survica.io",
    finePrint: "Custom pricing available for large institutions",
    buttonAriaLabel: "Contact the Survica team for organisation pricing",
  },
];

const faqs = [
  {
    question: "Do respondents need to create an account?",
    answer:
      "No. Respondents never sign up or log in. They simply open your survey link and tap to record. It works on any smartphone or computer, no app download required.",
  },
  {
    question: "What happens when I reach my response limit?",
    answer:
      "Your survey stays live, but new responses are paused until your next billing cycle or you upgrade your plan. We'll notify you at 80% and 100% of your limit.",
  },
  {
    question: "Can I use Survica in Nigerian Pidgin or local languages?",
    answer:
      "Respondents can speak in any language — Survica records whatever they say. AI transcription currently works best with English and Pidgin English, with support for Yoruba, Hausa, and Igbo coming in 2025.",
  },
  {
    question: "Is my respondents' audio data secure?",
    answer:
      "Yes. All audio files are encrypted at rest and in transit. We never share or sell respondent data. You can request deletion of all responses at any time from your dashboard.",
  },
  {
    question: "Can I try before I pay?",
    answer:
      "Absolutely. The Student plan is free with no card required. Starter and Professional plans both include a 14-day free trial.",
  },
  {
    question: "What export formats are available?",
    answer:
      "CSV on all plans. Excel workbook and PDF analytics report on Starter and above. The PDF is designed to be shared directly with stakeholders.",
  },
];

const footerSocialLinks: Array<{
  name: string;
  href: string;
  icon: LucideIcon;
}> = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/survica",
    icon: BriefcaseBusiness,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/survica",
    icon: Camera,
  },
  {
    name: "X",
    href: "https://x.com/survica",
    icon: AtSign,
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/message/survica",
    icon: MessageCircle,
  },
  {
    name: "GitHub",
    href: "https://github.com/Larriemoses/Voice-First-Survey-App",
    icon: Code2,
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Survica",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Voice-first survey platform with AI-generated analytics, transcription, sentiment analysis, and PDF/XLSX export.",
  offers: [
    {
      "@type": "Offer",
      name: "Student",
      price: "3",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Starter",
      price: "9",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Professional",
      price: "19",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Organisation",
      price: "49",
      priceCurrency: "USD",
    },
  ],
  url: "https://survica.vercel.app",
};

function HomePageHelmet() {
  useEffect(() => {
    const previousTitle = document.title;
    const createdElements: HTMLElement[] = [];

    document.title = "Survica — Voice Surveys & AI-Powered Feedback Analytics";

    function appendElement<TagName extends keyof HTMLElementTagNameMap>(
      tagName: TagName,
      attributes: Record<string, string>,
      textContent?: string,
    ) {
      const element = document.createElement(tagName);
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
      element.setAttribute("data-survica-homepage-head", "true");
      if (textContent) {
        element.textContent = textContent;
      }
      document.head.appendChild(element);
      createdElements.push(element);
    }

    appendElement("meta", {
      name: "description",
      content:
        "Survica helps teams collect spoken feedback from customers, employees, and communities — then turns those voice responses into transcripts, sentiment scores, and AI-generated insight reports. No login required for respondents.",
    });

    appendElement("meta", {
      name: "keywords",
      content:
        "voice survey platform, audio feedback tool, AI survey analytics, voice-first surveys Africa, survey transcription software, customer feedback AI, employee pulse survey, qualitative research tool Nigeria, sentiment analysis survey, spoken feedback collection",
    });

    appendElement("meta", { property: "og:type", content: "website" });
    appendElement("meta", {
      property: "og:url",
      content: "https://survica.vercel.app",
    });
    appendElement("meta", {
      property: "og:title",
      content: "Survica — Voice Surveys & AI-Powered Feedback Analytics",
    });
    appendElement("meta", {
      property: "og:description",
      content:
        "Collect spoken feedback. Get structured insight. Survica turns voice responses into transcripts, themes, and board-ready reports — automatically.",
    });
    appendElement("meta", {
      property: "og:image",
      content: "https://survica.vercel.app/og-image.png",
    });

    appendElement("meta", {
      name: "twitter:card",
      content: "summary_large_image",
    });
    appendElement("meta", {
      name: "twitter:title",
      content: "Survica — Voice Surveys & AI Feedback Analytics",
    });
    appendElement("meta", {
      name: "twitter:description",
      content:
        "Voice surveys that actually get answered. AI turns spoken responses into insight reports in minutes.",
    });
    appendElement("meta", {
      name: "twitter:image",
      content: "https://survica.vercel.app/og-image.png",
    });

    appendElement("link", {
      rel: "canonical",
      href: "https://survica.vercel.app",
    });

    appendElement(
      "script",
      { type: "application/ld+json" },
      JSON.stringify(structuredData),
    );

    return () => {
      document.title = previousTitle;
      createdElements.forEach((element) => element.remove());
    };
  }, []);

  return null;
}

function SectionLabel({ children, className }: { children: string; className?: string }) {
  return (
    <p className={cn("text-[10px] uppercase tracking-[0.24em] text-text-hint", className)}>
      {children}
    </p>
  );
}

function SocialIconLink({
  href,
  icon: Icon,
  name,
}: {
  href: string;
  icon: LucideIcon;
  name: string;
}) {
  return (
    <Tooltip content={name} side="top">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Survica on ${name}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1E293B] text-[#94A3B8] transition-colors duration-150 hover:bg-[#334155] hover:text-white"
      >
        <Icon className="h-4 w-4" />
      </a>
    </Tooltip>
  );
}

function PricingCard({
  plan,
  billingCycle,
  fading,
}: {
  plan: PricingPlan;
  billingCycle: "monthly" | "annual";
  fading: boolean;
}) {
  const navigate = useNavigate();

  function handleAction() {
    if (plan.href) {
      navigate(plan.href);
      return;
    }

    if (plan.mailto) {
      window.location.href = plan.mailto;
    }
  }

  const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
  const note =
    billingCycle === "monthly" ? "Billed monthly" : plan.annualNote;

  return (
    <div className={cn("relative", plan.mobileOrderClassName)}>
      {plan.featured ? (
        <Badge
          className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 bg-brand-blue px-3 py-1 text-white"
        >
          Most popular
        </Badge>
      ) : null}
      <Card
        hoverable={false}
        className={cn(
          "flex h-full flex-col rounded-xl p-6",
          plan.featured
            ? "border-2 border-brand-blue shadow-md"
            : "border-border",
        )}
      >
        <div
          className={cn(
            "transition-opacity duration-150",
            fading ? "opacity-60" : "opacity-100",
          )}
        >
          <h3 className="text-lg font-medium text-text-primary">{plan.name}</h3>
          <p className="mt-4 text-[32px] font-medium leading-none text-text-primary">
            {price}
          </p>
          <p className="mt-2 text-xs text-text-hint">{note}</p>
          <p className="mt-4 text-sm leading-6 text-text-secondary">
            {plan.description}
          </p>
        </div>

        <ul className="mt-6 flex flex-1 flex-col gap-3">
          {plan.features.map((feature) => (
            <li key={feature.label} className="flex items-start gap-2">
              {feature.included ? (
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-status-success" />
              ) : (
                <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-hint" />
              )}
              <span
                className={cn(
                  "text-sm leading-6",
                  feature.included ? "text-text-primary" : "text-text-hint",
                )}
              >
                {feature.label}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Button
            variant={plan.buttonVariant}
            className="w-full"
            onClick={handleAction}
            aria-label={plan.buttonAriaLabel}
            title={plan.buttonAriaLabel}
          >
            {plan.buttonLabel}
          </Button>
          <p className="mt-3 text-xs text-text-hint">{plan.finePrint}</p>
        </div>
      </Card>
    </div>
  );
}

function FaqItem({
  answer,
  open,
  question,
  onToggle,
}: {
  answer: string;
  open: boolean;
  question: string;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-base font-medium text-text-primary">{question}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-text-secondary transition-transform duration-200",
            open ? "rotate-180" : "",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-[250ms] ease-in-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-4 text-base leading-[1.7] text-text-secondary">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function HeroMockup() {
  return (
    <div className="mx-auto mt-14 w-full max-w-[940px] overflow-hidden rounded-xl border border-border bg-surface-card shadow-lg">
      <div className="flex h-9 items-center justify-between border-b border-border bg-white px-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-brand-blue" />
          <span className="text-xs font-medium text-brand-blue">survica</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-slate-200" />
          <span className="h-2 w-2 rounded-full bg-slate-200" />
          <span className="h-2 w-2 rounded-full bg-slate-200" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-2.5 w-10 rounded-full" />
          <SkeletonBlock className="h-2.5 w-8 rounded-full" />
        </div>
      </div>

      <div className="flex h-[220px] md:h-[320px]">
        <div className="flex w-9 flex-col items-center justify-between border-r border-border bg-white py-3">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand-blue" />
          <span className="h-2.5 w-2.5 rounded-sm bg-surface-muted" />
          <span className="h-2.5 w-2.5 rounded-sm bg-surface-muted" />
          <span className="h-2.5 w-2.5 rounded-sm bg-surface-muted" />
        </div>
        <div className="flex-1 overflow-hidden bg-surface-page p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <MockMetricCard
              label="Total responses"
              value="128"
              sub="+14 this week"
              subClassName="text-status-success"
            />
            <MockMetricCard
              label="Completion rate"
              value="84%"
              sub="↑ above avg"
              subClassName="text-status-success"
            />
          </div>

          <ChartCard
            title="Response volume"
            subtitle="Last 7 days"
            className="mt-2 overflow-hidden rounded-lg border-border shadow-none"
            headerClassName="border-b border-border px-3 py-2"
            contentClassName="px-3 py-2"
          >
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={heroChartData}>
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <Bar
                    dataKey="count"
                    fill="#1A56DB"
                    radius={[3, 3, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <div className="mt-2 hidden rounded-lg border-l-2 border-brand-orange bg-brand-orange-light p-2.5 sm:block">
            <p className="text-[10px] font-medium text-brand-orange">✦ AI Summary</p>
            <p className="mt-1 text-[11px] leading-4 text-text-primary">
              Respondents highlighted fast delivery and friendly support as top themes.
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {["Fast delivery", "Support quality", "Pricing"].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-brand-orange px-2 py-0.5 text-[10px] text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockMetricCard({
  label,
  value,
  sub,
  subClassName,
}: {
  label: string;
  value: string;
  sub: string;
  subClassName?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-white p-2.5">
      <p className="text-[10px] uppercase tracking-[0.14em] text-text-hint">{label}</p>
      <p className="mt-1 text-lg font-medium text-text-primary">{value}</p>
      <p className={cn("mt-1 text-[10px]", subClassName)}>{sub}</p>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [navSolid, setNavSolid] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [priceFading, setPriceFading] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";

    function handleScroll() {
      setNavSolid(window.scrollY > 10);
      setShowBackToTop(window.scrollY > 400);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function changeBillingCycle(nextCycle: "monthly" | "annual") {
    if (nextCycle === billingCycle) {
      return;
    }

    setPriceFading(true);
    setBillingCycle(nextCycle);
    window.setTimeout(() => setPriceFading(false), 150);
  }

  const topNavItems = useMemo(
    () => [
      { label: "Product", href: "#features" },
      { label: "Use cases", href: "#why-voice" },
      { label: "Pricing", href: "#pricing" },
    ],
    [],
  );

  return (
    <>
      <HomePageHelmet />
      <div className="min-h-screen bg-surface-page text-text-primary">
        <TopNav
          items={topNavItems}
          className={cn(
            "border-border transition-[background-color,box-shadow,backdrop-filter] duration-150 ease-linear",
            navSolid
              ? "bg-white/95 shadow-sm backdrop-blur-sm"
              : "bg-transparent shadow-none backdrop-blur-none",
          )}
        />

        <main>
          <section className="relative overflow-hidden bg-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle,_#E2E8F0_1px,_transparent_1px)] [background-size:24px_24px]" />
            <div className="relative mx-auto max-w-[1100px] px-6 pb-16 pt-24 sm:px-8 lg:px-10">
              <div className="mx-auto max-w-[640px] text-center">
                <span className="inline-flex rounded-full bg-brand-orange-light px-[14px] py-1 text-xs text-brand-orange">
                  ✦ Now with AI analytics — built for African markets
                </span>
                <h1 className="mt-6 text-[30px] font-medium leading-[1.15] tracking-[-0.5px] text-text-primary sm:text-[44px]">
                  <span className="block">Collect spoken feedback.</span>
                  <span className="block">Get structured insight.</span>
                </h1>
                <p className="mx-auto mt-5 max-w-[520px] text-[15px] leading-[1.75] text-text-secondary sm:text-[17px]">
                  Survica lets your customers, employees, and communities speak their minds — then automatically turns those voice responses into transcripts, sentiment scores, themes, and board-ready insight reports. No typing. No login. No friction.
                </p>

                <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                  <Button
                    variant="gradient"
                    size="lg"
                    onClick={() => navigate("/signup")}
                    aria-label="Create your free Survica account"
                    title="Create your free Survica account — no card required"
                    className="w-full sm:w-auto"
                  >
                    Start for free
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => scrollToSection("how-it-works")}
                    aria-label="Learn how Survica works"
                    title="Jump to the how it works section"
                    className="w-full sm:w-auto"
                  >
                    See how it works →
                  </Button>
                </div>

                <p className="mt-4 text-xs tracking-[0.2px] text-text-hint">
                  No credit card required · Set up in 2 minutes · Free plan available
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-text-hint">
                    <ShieldCheck className="h-3 w-3 text-brand-blue" />
                    <span>GDPR-ready</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-text-hint">
                    <Zap className="h-3 w-3 text-brand-blue" />
                    <span>Works offline</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-text-hint">
                    <Globe className="h-3 w-3 text-brand-blue" />
                    <span>Multilingual support</span>
                  </div>
                </div>
              </div>

              <HeroMockup />
            </div>
          </section>

          <section
            id="social-proof"
            className="border-y border-border bg-white px-6 py-9 sm:px-8 lg:px-10"
          >
            <div className="mx-auto max-w-[1100px]">
              <div className="grid grid-cols-2 gap-y-6 md:flex md:items-center md:justify-between">
                <div className="text-center md:flex-1">
                  <p className="text-[28px] font-medium leading-none text-brand-blue">4.8×</p>
                  <p className="mx-auto mt-1.5 max-w-[120px] text-[13px] text-text-secondary">
                    higher completion vs text surveys
                  </p>
                </div>
                <div className="hidden h-10 w-px self-center bg-border md:block" />
                <div className="text-center md:flex-1">
                  <p className="text-[28px] font-medium leading-none text-brand-blue">2 min</p>
                  <p className="mx-auto mt-1.5 max-w-[120px] text-[13px] text-text-secondary">
                    to publish your first survey
                  </p>
                </div>
                <div className="hidden h-10 w-px self-center bg-border md:block" />
                <div className="col-span-2 justify-self-center text-center md:col-span-1 md:flex-1">
                  <p className="text-[28px] font-medium leading-none text-brand-blue">0 login</p>
                  <p className="mx-auto mt-1.5 max-w-[120px] text-[13px] text-text-secondary">
                    required for respondents
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section
            id="how-it-works"
            className="bg-surface-page px-6 py-[88px] sm:px-8 lg:px-10"
          >
            <div className="mx-auto max-w-[1100px] text-center">
              <SectionLabel className="text-center">HOW IT WORKS</SectionLabel>
              <h2 className="mt-3 text-2xl font-medium tracking-[-0.3px] text-text-primary sm:text-[32px]">
                From question to insight in minutes
              </h2>
              <p className="mx-auto mt-2 max-w-[480px] text-md leading-[1.7] text-text-secondary">
                No training needed. No complicated setup. Survica works the moment you publish.
              </p>

              <div className="relative mx-auto mt-14 max-w-[960px]">
                <div className="pointer-events-none absolute left-[17%] right-[17%] top-8 hidden border-t border-dashed border-border lg:block" />
                <div className="grid gap-5 lg:grid-cols-3">
                  {howItWorksCards.map((card) => {
                    const Icon = card.icon;

                    return (
                      <Card
                        key={card.title}
                        hoverable={false}
                        className={cn(
                          "relative rounded-xl p-7 text-left",
                          card.accent
                            ? "border-brand-orange/30 bg-brand-orange-light"
                            : "border-border bg-white",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                            card.accent
                              ? "bg-brand-orange text-white"
                              : "bg-brand-blue-light text-brand-blue",
                          )}
                        >
                          {card.step}
                        </div>
                        <Icon
                          className={cn(
                            "mt-5 h-6 w-6",
                            card.accent ? "text-brand-orange" : "text-brand-blue",
                          )}
                        />
                        <h3 className="mt-5 text-lg font-medium text-text-primary">
                          {card.title}
                        </h3>
                        <p className="mt-3 text-md leading-[1.75] text-text-secondary">
                          {card.body}
                        </p>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="bg-[#0F172A] px-10 py-[88px]">
            <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
              <div>
                <SectionLabel className="text-brand-orange">ANALYTICS ENGINE</SectionLabel>
                <h2 className="mt-4 text-[26px] font-medium leading-[1.2] tracking-[-0.4px] text-white sm:text-[36px]">
                  <span className="block">Spoken feedback in.</span>
                  <span className="block">Business insight out.</span>
                </h2>
                <div className="mt-5 space-y-5 text-md leading-[1.75] text-[#94A3B8]">
                  <p>
                    Most survey tools give you numbers. Survica gives you understanding. Every voice response is transcribed, analysed for sentiment, grouped by theme, and distilled into plain-language summaries — generated by AI, verified by your instincts.
                  </p>
                  <p>
                    Whether you're running customer research, employee pulse checks, or community consultations, Survica turns qualitative voice data into the kind of insight that actually drives decisions.
                  </p>
                </div>
                <div className="mt-8">
                  <Button
                    variant="gradient"
                    size="lg"
                    onClick={() => navigate("/signup")}
                    aria-label="Sign up for Survica free plan"
                    title="Sign up for Survica free plan"
                  >
                    Start building for free →
                  </Button>
                  <p className="mt-3 text-xs text-[#64748B]">
                    Trusted by researchers, product teams, and community organisations across Africa.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {analyticsTiles.map((tile) => {
                  const Icon = tile.icon;

                  return (
                    <div
                      key={tile.title}
                      className="rounded-lg border border-[#334155] bg-[#1E293B] p-5"
                    >
                      <Icon className="h-6 w-6 text-brand-orange" />
                      <h3 className="mt-3 text-md font-medium text-white">
                        {tile.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-[1.6] text-[#94A3B8]">
                        {tile.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="why-voice" className="bg-white px-6 py-[88px] sm:px-8 lg:px-10">
            <div className="mx-auto max-w-[1100px] text-center">
              <SectionLabel className="text-center">WHY VOICE?</SectionLabel>
              <h2 className="mt-3 text-2xl font-medium text-text-primary sm:text-[32px]">
                People talk more than they type
              </h2>
              <p className="mx-auto mt-3 max-w-[440px] text-md leading-[1.7] text-text-secondary">
                Voice responses are longer, richer, and more honest. Here's what the research shows.
              </p>

              <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {whyVoiceStats.map((stat) => (
                  <Card
                    key={stat.number + stat.label}
                    variant="muted"
                    hoverable={false}
                    className="rounded-xl p-6 text-center"
                  >
                    <p className="text-[36px] font-medium leading-none text-brand-blue">
                      {stat.number}
                    </p>
                    <p className="mx-auto mt-2 max-w-[160px] text-[13px] leading-[1.5] text-text-secondary">
                      {stat.label}
                    </p>
                    <p className="mt-1.5 text-[10px] italic text-text-hint">
                      {stat.source}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section
            id="testimonials"
            className="bg-surface-page px-6 py-[88px] sm:px-8 lg:px-10"
          >
            <div className="mx-auto max-w-[1100px]">
              <SectionLabel className="text-center">WHAT PEOPLE SAY</SectionLabel>
              <h2 className="mt-3 text-center text-2xl font-medium text-text-primary sm:text-[32px]">
                Trusted by teams who need real answers
              </h2>

              <div className="mt-12 grid gap-5 lg:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <Card
                    key={testimonial.name}
                    className="rounded-xl p-7 transition-shadow duration-150 hover:shadow-md"
                  >
                    <div className="mb-3 flex gap-0.5 text-[13px] text-brand-orange">
                      {Array.from({ length: 5 }, (_, index) => (
                        <span key={index}>★</span>
                      ))}
                    </div>
                    <span className="mb-[-8px] block text-[40px] leading-none text-border">
                      &quot;
                    </span>
                    <p className="text-md italic leading-[1.75] text-text-secondary">
                      {testimonial.quote}
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-full text-sm font-medium",
                          testimonial.avatarClassName,
                        )}
                      >
                        {testimonial.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-text-hint">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section id="pricing" className="bg-white px-6 py-[88px] sm:px-8 lg:px-10">
            <div className="mx-auto max-w-[1000px]">
              <SectionLabel className="text-center">PRICING</SectionLabel>
              <h2 className="mt-3 text-center text-2xl font-medium text-text-primary sm:text-[32px]">
                Simple, honest pricing
              </h2>
              <p className="mx-auto mt-3 max-w-[520px] text-center text-md leading-[1.7] text-text-secondary">
                Start free. Pay only when you grow. No hidden fees, no per-response charges, no surprises. All plans include unlimited surveys and the full voice collection experience.
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <span
                  className={cn(
                    "text-sm transition-colors duration-150",
                    billingCycle === "monthly" ? "text-text-primary" : "text-text-secondary",
                  )}
                >
                  Monthly
                </span>
                <Toggle
                  checked={billingCycle === "annual"}
                  onCheckedChange={(checked) =>
                    changeBillingCycle(checked ? "annual" : "monthly")
                  }
                />
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm transition-colors duration-150",
                      billingCycle === "annual" ? "text-text-primary" : "text-text-secondary",
                    )}
                  >
                    Annual
                  </span>
                  {billingCycle === "annual" ? (
                    <Badge className="bg-status-success/10 text-status-success">
                      Save 30%
                    </Badge>
                  ) : null}
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {pricingPlans.map((plan) => (
                  <PricingCard
                    key={plan.name}
                    plan={plan}
                    billingCycle={billingCycle}
                    fading={priceFading}
                  />
                ))}
              </div>

              <div className="mt-14">
                <SectionLabel>FREQUENTLY ASKED QUESTIONS</SectionLabel>
                <div className="mt-4">
                  {faqs.map((faq) => (
                    <FaqItem
                      key={faq.question}
                      question={faq.question}
                      answer={faq.answer}
                      open={openFaq === faq.question}
                      onToggle={() =>
                        setOpenFaq((current) =>
                          current === faq.question ? null : faq.question,
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[linear-gradient(135deg,#1A56DB_0%,#1342B0_100%)] px-10 py-[72px] text-center">
            <div className="mx-auto max-w-[720px]">
              <h2 className="text-2xl font-medium text-white sm:text-[32px]">
                Ready to hear what people actually think?
              </h2>
              <p className="mx-auto mt-3 max-w-[480px] text-base leading-[1.7] text-white/80">
                Join researchers, product teams, and organisations across Africa who collect richer feedback with Survica — and spend less time making sense of it.
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={() => navigate("/signup")}
                  aria-label="Create your free Survica account — no card required"
                  title="Create your free Survica account — no card required"
                  className="w-full sm:w-auto"
                >
                  Start for free
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => scrollToSection("pricing")}
                  className="w-full border-transparent bg-white text-brand-blue hover:bg-white/95 hover:text-brand-blue-dark sm:w-auto"
                >
                  See pricing →
                </Button>
              </div>
              <p className="mt-3.5 text-xs text-white/60">
                Free plan available · No credit card · Cancel anytime
              </p>
            </div>
          </section>
        </main>

        <footer className="bg-[#0F172A] px-10 pb-8 pt-14">
          <div className="mx-auto max-w-[1280px]">
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4 xl:gap-12">
              <div className="text-center md:text-left">
                <img src="/logo-white.svg" alt="Survica" className="mx-auto mb-4 h-7 w-auto md:mx-0" />
                <p className="mx-auto max-w-[200px] text-[13px] leading-[1.7] text-[#94A3B8] md:mx-0">
                  Voice surveys. AI insights. Built for Africa and beyond.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
                  {footerSocialLinks.map((link) => (
                    <SocialIconLink
                      key={link.name}
                      name={link.name}
                      href={link.href}
                      icon={link.icon}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center md:text-left">
                <p className="mb-4 text-[11px] uppercase tracking-[0.24em] text-[#64748B]">
                  Product
                </p>
                <div className="space-y-1">
                  <Link
                    to="/dashboard/surveys/new"
                    className="block py-1 text-[13px] text-[#94A3B8] transition-colors duration-150 hover:text-white"
                  >
                    Survey builder
                  </Link>
                  <Link
                    to="/dashboard/analytics"
                    className="block py-1 text-[13px] text-[#94A3B8] transition-colors duration-150 hover:text-white"
                  >
                    Analytics
                  </Link>
                  <Link
                    to="/dashboard/templates"
                    className="block py-1 text-[13px] text-[#94A3B8] transition-colors duration-150 hover:text-white"
                  >
                    Templates
                  </Link>
                  <a
                    href="/#pricing"
                    className="block py-1 text-[13px] text-[#94A3B8] transition-colors duration-150 hover:text-white"
                  >
                    Pricing
                  </a>
                  <span className="block cursor-default py-1 text-[13px] text-[#475569]">
                    API (coming soon)
                  </span>
                </div>
              </div>

              <div className="text-center md:text-left">
                <p className="mb-4 text-[11px] uppercase tracking-[0.24em] text-[#64748B]">
                  Company
                </p>
                <div className="space-y-1">
                  <Link
                    to="/about"
                    className="block py-1 text-[13px] text-[#94A3B8] transition-colors duration-150 hover:text-white"
                  >
                    About us
                  </Link>
                  <Link
                    to="/blog"
                    className="block py-1 text-[13px] text-[#94A3B8] transition-colors duration-150 hover:text-white"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/careers"
                    className="block py-1 text-[13px] text-[#94A3B8] transition-colors duration-150 hover:text-white"
                  >
                    Careers
                  </Link>
                  <Link
                    to="/press"
                    className="block py-1 text-[13px] text-[#94A3B8] transition-colors duration-150 hover:text-white"
                  >
                    Press kit
                  </Link>
                  <a
                    href="mailto:hello@survica.io"
                    className="block py-1 text-[13px] text-[#94A3B8] transition-colors duration-150 hover:text-white"
                  >
                    Contact us
                  </a>
                </div>
              </div>

              <div className="text-center md:text-left">
                <p className="mb-4 text-[11px] uppercase tracking-[0.24em] text-[#64748B]">
                  Support
                </p>
                <div className="space-y-1">
                  <Link
                    to="/help"
                    className="block py-1 text-[13px] text-[#94A3B8] transition-colors duration-150 hover:text-white"
                  >
                    Help centre
                  </Link>
                  <Link
                    to="/docs"
                    className="block py-1 text-[13px] text-[#94A3B8] transition-colors duration-150 hover:text-white"
                  >
                    Documentation
                  </Link>
                  <Link
                    to="/privacy"
                    className="block py-1 text-[13px] text-[#94A3B8] transition-colors duration-150 hover:text-white"
                  >
                    Privacy policy
                  </Link>
                  <Link
                    to="/terms"
                    className="block py-1 text-[13px] text-[#94A3B8] transition-colors duration-150 hover:text-white"
                  >
                    Terms of service
                  </Link>
                  <Link
                    to="/status"
                    className="block py-1 text-[13px] text-[#94A3B8] transition-colors duration-150 hover:text-white"
                  >
                    Status page
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#1E293B] pt-6">
              <p className="text-xs text-[#64748B]">
                © 2025 Survica Technologies Ltd. All rights reserved.
              </p>
              <p className="hidden text-xs text-[#475569] md:block">
                Made with care for African voices
              </p>
              <div className="flex items-center gap-4">
                <Link
                  to="/privacy"
                  className="text-xs text-[#64748B] transition-colors duration-150 hover:text-[#94A3B8]"
                >
                  Privacy policy
                </Link>
                <Link
                  to="/terms"
                  className="text-xs text-[#64748B] transition-colors duration-150 hover:text-[#94A3B8]"
                >
                  Terms of service
                </Link>
              </div>
            </div>
          </div>
        </footer>

        <a
          href="https://wa.me/message/survica"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          title="Chat with us on WhatsApp"
          className="fixed bottom-4 right-4 z-40 inline-flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-md md:hidden"
        >
          <MessageCircle className="h-6 w-6" />
        </a>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          title="Back to top"
          className={cn(
            "fixed bottom-6 right-6 z-40 hidden h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-text-secondary shadow-md transition-opacity duration-150 md:inline-flex",
            showBackToTop ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}
