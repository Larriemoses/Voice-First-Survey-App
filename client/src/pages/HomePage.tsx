import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  FileSpreadsheet,
  MessageSquareText,
  Mic,
  Plug,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import AppLogo from "../components/AppLogo";
import { PublicNav } from "../components/layout/PublicNav";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { Chip } from "../components/ui/Chip";

const proofStats = ["4.8x higher completion", "2 min to publish", "0 login for respondents"];
const customerTypes = ["Research teams", "Product teams", "Customer success", "People ops", "Agencies"];
const useCases = [
  "Customer feedback",
  "Product research",
  "Employee pulse",
  "Event follow-up",
  "Exit interviews",
  "Market discovery",
];
const integrations = ["Slack", "Zapier", "Google Sheets", "Webhooks", "XLSX", "PDF"];
const analyticsFeatures: Array<{ label: string; Icon: LucideIcon }> = [
  { label: "Theme extraction", Icon: BarChart3 },
  { label: "AI summaries", Icon: Sparkles },
  { label: "PDF / XLSX export", Icon: FileSpreadsheet },
  { label: "Action recommendations", Icon: CheckCircle2 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 survica-hero-grid opacity-80" />
          <div className="absolute left-[-120px] top-16 h-72 w-72 rounded-full bg-[#E9EEF8] blur-3xl" />
          <div className="absolute right-[-140px] top-28 h-72 w-72 rounded-full bg-[#F8E8D9] blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl gap-4 px-4 py-4 sm:gap-8 sm:px-5 sm:py-14 md:grid-cols-[1fr_460px] md:items-center md:py-24">
            <div>
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-accent-700 shadow-sm ring-1 ring-accent-100 sm:text-sm">
                Voice-first surveys - now with AI analytics
              </span>
              <h1 className="mt-3 max-w-3xl text-[28px] font-medium leading-[1.02] tracking-[-0.8px] text-gray-900 sm:mt-6 sm:text-[44px] md:text-[52px]">
                Collect spoken feedback. Turn it into structured insight.
              </h1>
              <p className="mt-2 max-w-[580px] text-sm leading-5 text-gray-500 sm:mt-5 sm:text-md sm:leading-7">
                Survica gives teams a friendlier way to ask questions, capture voice answers, and transform raw responses into transcripts, themes, sentiment, and stakeholder-ready reports.
              </p>
              <div className="mt-4 grid gap-2 sm:mt-8 sm:flex sm:gap-3">
                <Link to="/signup">
                  <Button size="lg" className="h-10 w-full sm:h-11 sm:w-auto">Create a survey</Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="secondary" size="lg" className="h-10 w-full sm:h-11 sm:w-auto">See how it works</Button>
                </a>
              </div>
              <div className="mt-8 hidden flex-wrap gap-2 sm:flex">
                {customerTypes.map((type) => (
                  <span key={type} className="rounded-full border border-primary-100 bg-white/80 px-3 py-1 text-sm text-gray-600 shadow-sm">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <HeroMotionPanel />
          </div>
        </section>

        <section className="border-y border-gray-200 bg-white px-5 py-8">
          <div className="mx-auto grid max-w-5xl gap-6 text-center md:grid-cols-3 md:gap-0">
            {proofStats.map((stat, index) => (
              <div key={stat} className={index === 1 ? "md:border-x md:border-gray-200" : ""}>
                <p className="text-lg font-medium text-gray-900">{stat}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden bg-[#F7F4EF] py-5">
          <div className="marquee-track flex w-max gap-3">
            {[...useCases, ...integrations, ...useCases, ...integrations].map((item, index) => (
              <span key={`${item}-${index}`} className="rounded-full border border-[#E7DED1] bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section id="product" className="px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary-600">Product</p>
              <h2 className="mt-3 text-[28px] font-medium leading-tight tracking-[-0.5px] text-gray-900 sm:text-3xl">Designed around the way people actually answer.</h2>
              <p className="mt-4 text-md leading-7 text-gray-500">
                Borrowing the best idea from modern form tools - one clear question at a time - Survica adds the missing layer: spoken answers and AI interpretation.
              </p>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              <FeatureCard Icon={MessageSquareText} title="Ask one focused question" body="Mobile-first public surveys keep each screen simple so respondents know exactly what to do next." />
              <FeatureCard Icon={Mic} title="Capture richer voice context" body="Let people explain nuance, emotion, and objections without squeezing them into a text box." accent />
              <FeatureCard Icon={Brain} title="Summarize with AI" body="Turn transcripts into themes, sentiment, recommendations, and reports that your team can act on." />
            </div>
          </div>
        </section>

        <section className="bg-[#121722] px-5 py-16 text-white sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[420px_1fr] lg:items-center">
            <div>
              <p className="text-sm font-medium text-[#C9D6FF]">Conversation to clarity</p>
              <h2 className="mt-3 text-[28px] font-medium leading-tight tracking-[-0.5px] sm:text-3xl">A living flow, not a flat form.</h2>
              <p className="mt-4 text-md leading-7 text-gray-300">
                Motion should explain the product. Voice signals become transcripts, transcripts become themes, and themes become decisions your team can trust.
              </p>
            </div>
            <FlowMotionGraphic />
          </div>
        </section>

        <section className="bg-[#F8FAFC] px-5 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-medium text-accent-700">Insight without exposing the workspace</p>
              <h2 className="mt-3 text-[28px] font-medium leading-tight tracking-[-0.5px] text-gray-900 sm:text-3xl">Public visitors see the promise. Your team sees the dashboard.</h2>
              <p className="mt-4 text-md leading-7 text-gray-500">
                The marketing page shows anonymized, simplified examples of Survica's output. Actual survey lists, transcripts, team controls, exports, and respondent data stay behind login.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Chip active>Transcripts</Chip>
                <Chip active>Sentiment</Chip>
                <Chip active>Themes</Chip>
                <Chip active>Reports</Chip>
              </div>
            </div>
            <InsightPreview />
          </div>
        </section>

        <section id="how-it-works" className="bg-white px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm font-medium text-gray-400">How it works</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-[28px] font-medium leading-tight tracking-[-0.5px] text-gray-900 sm:text-3xl">A calmer path from question to decision.</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {[
                ["Build", "Start from scratch or use an AI-generated draft."],
                ["Brand", "Add your logo, survey intro, and thank-you flow."],
                ["Share", "Send a public link with no respondent login."],
                ["Analyze", "Review themes, sentiment, quotes, and exports."],
              ].map(([title, body], index) => (
                <Card key={title} className={index === 3 ? "bg-accent-50" : ""}>
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">{index + 1}</div>
                  <h3 className="mt-4 text-base font-medium text-gray-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{body}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="use-cases" className="bg-[#F7F4EF] px-5 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[360px_1fr]">
            <div>
              <p className="text-sm font-medium text-primary-600">Templates</p>
              <h2 className="mt-3 text-[28px] font-medium leading-tight tracking-[-0.5px] text-gray-900 sm:text-3xl">Launch from a proven survey shape.</h2>
              <p className="mt-4 text-md leading-7 text-gray-500">
                Start with common research moments, then tailor questions to your brand and audience.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {useCases.map((useCase) => (
                <Card key={useCase} className="group flex items-center justify-between gap-3 p-4">
                  <span className="text-base font-medium text-gray-900">{useCase}</span>
                  <ArrowRight className="h-4 w-4 text-primary-500 transition-transform group-hover:translate-x-1" />
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <p className="text-sm font-medium text-accent-700">Analytics module</p>
              <h2 className="mt-3 text-[28px] font-medium leading-tight tracking-[-0.5px] text-gray-900 sm:text-3xl">The form is only the beginning.</h2>
              <p className="mt-4 max-w-2xl text-md leading-7 text-gray-500">
                Survica is built for what happens after responses arrive: AI summaries, sentiment trends, recurring themes, quote evidence, and exportable reports for stakeholders.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {analyticsFeatures.map(({ label, Icon }) => (
                  <div key={label} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <Icon className="h-5 w-5 text-primary-500" />
                    <span className="text-base font-medium text-gray-900">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <Card className="bg-[#121722] p-6 text-white">
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-900">Executive summary</span>
              <p className="mt-6 text-lg leading-8">
                Customers praise fast delivery and friendly support. The clearest improvement opportunity is pricing communication before renewal.
              </p>
              <div className="mt-6 space-y-3">
                {["Review pricing language", "Promote delivery speed", "Follow up with negative respondents"].map((item) => (
                  <div key={item} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900">{item}</div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section id="pricing" className="border-y border-gray-200 bg-[#F8FAFC] px-5 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[420px_1fr] lg:items-center">
            <div>
              <p className="text-sm font-medium text-primary-600">Integrations</p>
              <h2 className="mt-3 text-[28px] font-medium leading-tight tracking-[-0.5px] text-gray-900 sm:text-3xl">Send insights where work already happens.</h2>
              <p className="mt-4 text-md leading-7 text-gray-500">
                Connect response notifications, exports, and webhook events to the tools your team already uses.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {integrations.map((item) => (
                <Card key={item} className="flex items-center gap-3 p-4">
                  <Plug className="h-4 w-4 text-primary-500" />
                  <span className="text-base font-medium text-gray-900">{item}</span>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F7F4EF] px-5 py-16 text-gray-900 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <h2 className="text-[28px] font-medium leading-tight tracking-[-0.5px] sm:text-3xl">Create a survey people actually want to answer.</h2>
              <p className="mt-4 max-w-2xl text-md leading-7 text-gray-600">
                Keep public surveys simple. Keep admin analytics private. Give your team the voice data they need to make better decisions.
              </p>
            </div>
            <div className="grid gap-3">
              <Link to="/signup">
                <Button className="hero-cta-gradient w-full border-accent-500 text-white" size="lg">Get started free</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="w-full" size="lg">Log in</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-gray-200 bg-white px-5 py-8 text-gray-500">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex w-fit rounded-md bg-white">
            <AppLogo className="h-6" imageClassName="max-w-[104px]" />
          </span>
          <div className="flex flex-wrap gap-5 text-sm">
            <a href="#product">Product</a>
            <a href="#use-cases">Use cases</a>
            <a href="#pricing">Pricing</a>
          </div>
          <p className="text-sm">(c) 2026 Survica</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  Icon,
  title,
  body,
  accent = false,
}: {
  Icon: LucideIcon;
  title: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <Card className="p-6">
      <Icon className={accent ? "h-6 w-6 text-accent-500" : "h-6 w-6 text-primary-500"} />
      <h3 className="mt-5 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-3 text-base leading-7 text-gray-500">{body}</p>
    </Card>
  );
}

function HeroMotionPanel() {
  return (
    <div className="relative mx-auto w-full max-w-[285px] overflow-hidden rounded-xl border border-gray-200 survica-glow survica-hero-grid p-2 shadow-md sm:max-w-none sm:p-4">
      <div className="absolute right-6 top-7 h-16 w-16 rounded-full bg-accent-100/60 blur-xl sm:h-20 sm:w-20" />
      <div className="absolute bottom-8 left-8 h-20 w-20 rounded-full bg-primary-100/60 blur-xl sm:h-24 sm:w-24" />
      <div className="relative rounded-lg border border-white/70 bg-white/90 p-3 shadow-sm sm:p-5">
        <div className="flex items-center justify-between">
          <AppLogo className="h-5 sm:h-7" imageClassName="max-w-[78px] sm:max-w-[96px]" />
          <span className="rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700">Question 2 of 5</span>
        </div>
        <div className="mt-3 h-1 rounded-full bg-gray-200 sm:mt-5">
          <div className="h-full w-2/5 rounded-full bg-primary-500" />
        </div>
        <h2 className="mt-3 text-sm font-medium leading-5 text-gray-900 sm:mt-8 sm:text-xl sm:leading-8">
          What made the buying experience feel clear or unclear?
        </h2>
        <p className="mt-2 hidden text-sm leading-5 text-gray-500 sm:mt-3 sm:block sm:text-base sm:leading-7">
          Answer naturally. A short spoken response is enough.
        </p>
        <div className="relative mt-3 flex flex-col items-center sm:mt-8">
          <div className="voice-orb relative flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white sm:h-[92px] sm:w-[92px]">
            <span className="absolute inset-3 rounded-full bg-primary-400/40" />
            <Mic className="relative z-10 h-5 w-5 sm:h-9 sm:w-9" />
          </div>
          <p className="mt-2 text-xs text-gray-500 sm:mt-4 sm:text-sm">Tap and hold to record</p>
          <div className="mt-2 flex h-8 items-center gap-1 rounded-full bg-gray-100 px-3 sm:mt-5 sm:h-12 sm:px-5">
            <span className="voice-wave-bar h-[18px] w-1.5 rounded-full bg-accent-500" />
            <span className="voice-wave-bar h-8 w-1.5 rounded-full bg-accent-500" />
            <span className="voice-wave-bar h-6 w-1.5 rounded-full bg-accent-500" />
            <span className="voice-wave-bar h-10 w-1.5 rounded-full bg-accent-500" />
            <span className="voice-wave-bar h-5 w-1.5 rounded-full bg-accent-500" />
          </div>
        </div>
      </div>
      <div className="float-card absolute -right-2 bottom-12 hidden rounded-lg border border-gray-200 bg-white p-3 shadow-md sm:block">
        <p className="text-xs text-gray-500">AI detects</p>
        <p className="mt-1 text-sm font-medium text-primary-700">Pricing clarity</p>
      </div>
      <div className="float-card-slow absolute -left-2 top-24 hidden rounded-lg border border-gray-200 bg-white p-3 shadow-md sm:block">
        <p className="text-xs text-gray-500">Sentiment</p>
        <p className="mt-1 text-sm font-medium text-success">Positive</p>
      </div>
    </div>
  );
}

function InsightPreview() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Overall sentiment</span>
          <span className="text-sm font-medium text-success">78% positive</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full w-4/5 rounded-full bg-primary-500" />
        </div>
      </Card>
      <Card className="float-card p-5">
        <Sparkles className="h-5 w-5 text-accent-500" />
        <h3 className="mt-4 text-base font-medium text-gray-900">AI recommendation</h3>
        <p className="mt-2 text-sm leading-6 text-gray-500">Clarify pricing before renewal conversations.</p>
      </Card>
      <Card className="p-5 sm:col-span-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="h-4 w-4 text-primary-500" />
          Response trend
        </div>
        <div className="mt-5 flex h-24 items-end gap-2">
          <span className="h-8 flex-1 rounded-t-md bg-primary-100" />
          <span className="h-12 flex-1 rounded-t-md bg-primary-200" />
          <span className="h-10 flex-1 rounded-t-md bg-primary-400" />
          <span className="h-16 flex-1 rounded-t-md bg-primary-500" />
          <span className="h-24 flex-1 rounded-t-md bg-accent-500" />
        </div>
      </Card>
    </div>
  );
}

function FlowMotionGraphic() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/15 bg-white/[0.07] p-5">
      <svg viewBox="0 0 680 320" className="h-auto w-full" role="img" aria-label="Animated flow from voice response to insight report">
        <defs>
          <linearGradient id="survica-flow" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FF9452" />
          </linearGradient>
        </defs>
        <path className="signal-line" d="M120 160 C220 70 310 250 420 150 S560 120 610 174" fill="none" stroke="url(#survica-flow)" strokeWidth="4" strokeLinecap="round" />
        <g className="orbit-node">
          <circle cx="120" cy="160" r="54" fill="#FFFFFF" opacity="0.12" />
          <circle cx="120" cy="160" r="38" fill="#FFFFFF" opacity="0.18" />
          <circle cx="120" cy="160" r="18" fill="#FF6B1A" />
        </g>
        <g>
          <rect x="262" y="102" width="142" height="116" rx="18" fill="#FFFFFF" opacity="0.96" />
          <rect x="286" y="128" width="74" height="8" rx="4" fill="#2457F5" opacity="0.85" />
          <rect x="286" y="150" width="94" height="8" rx="4" fill="#B8CCFF" />
          <rect x="286" y="172" width="62" height="8" rx="4" fill="#B8CCFF" />
          <rect x="286" y="194" width="84" height="8" rx="4" fill="#FF9452" />
        </g>
        <g>
          <rect x="488" y="84" width="122" height="152" rx="20" fill="#FFFFFF" opacity="0.96" />
          <rect x="512" y="112" width="64" height="8" rx="4" fill="#2457F5" />
          <rect x="512" y="138" width="74" height="42" rx="8" fill="#EEF4FF" />
          <rect x="512" y="196" width="50" height="8" rx="4" fill="#FF6B1A" />
        </g>
      </svg>
      <div className="grid gap-3 sm:grid-cols-3">
        {["Voice response", "Transcript themes", "Stakeholder report"].map((item) => (
          <div key={item} className="rounded-lg bg-white/10 px-4 py-3 text-sm font-medium text-white">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
