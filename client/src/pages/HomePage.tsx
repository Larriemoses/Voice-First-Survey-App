import {
  ArrowRight,
  AudioLines,
  BarChart3,
  Check,
  FileText,
  Mic2,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLogo from "../components/AppLogo";
import PageMeta from "../components/PageMeta";
import { TopNav } from "../components/layout/TopNav";
import { Button } from "../components/ui/button";

const workflow = [
  {
    number: "01",
    title: "Create naturally",
    description: "Build a clear survey with typed or voice prompts, branching, and your own branding.",
    icon: Mic2,
  },
  {
    number: "02",
    title: "Share anywhere",
    description: "Send one link. Respondents can answer by voice or text without creating an account.",
    icon: Users,
  },
  {
    number: "03",
    title: "Understand the why",
    description: "Turn transcripts into themes, sentiment, summaries, and reports your team can use.",
    icon: BarChart3,
  },
];

const useCases = [
  { title: "Customer research", description: "Hear the language customers use, not just the option they select.", icon: Quote },
  { title: "Community feedback", description: "Collect richer stories across mobile and low-friction field contexts.", icon: AudioLines },
  { title: "Team discovery", description: "Keep interviews, evidence, and decisions in one organised workspace.", icon: FileText },
];

const plans = [
  { name: "Student", price: "$3", description: "For coursework, thesis research, and individual projects.", features: ["1 active survey", "50 responses monthly", "Voice transcription", "CSV export"] },
  { name: "Professional", price: "$19", description: "For teams running continuous customer and user research.", features: ["Unlimited surveys", "500 responses monthly", "AI themes and sentiment", "PDF and Excel reports"], featured: true },
  { name: "Organisation", price: "$49", description: "For agencies, NGOs, and multi-team research programmes.", features: ["Unlimited responses", "10 team seats", "Cross-survey analytics", "Priority support"] },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-page text-text-primary">
      <PageMeta title="Survica — Voice-first research, made clear" description="Create voice-first surveys, collect natural responses, and turn feedback into clear research insight." />
      <TopNav />

      <main>
        <section className="survica-page-shell grid gap-12 py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(520px,1.1fr)] lg:items-center lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-text-secondary">
              <Sparkles className="h-4 w-4 text-brand-blue" />
              Voice-first research workspace
            </div>
            <h1 className="max-w-[720px] text-5xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-[68px]">
              Better answers begin with a better way to ask.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-text-secondary">
              Create surveys people can answer naturally. Survica captures voice and text, organises every response, and reveals the patterns behind what people say.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => navigate("/signup")} trailingIcon={<ArrowRight className="h-4 w-4" />}>
                Start a survey
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate("/login")} leadingIcon={<Play className="h-4 w-4" />}>
                Explore the workspace
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary">
              {["No card required", "Voice and text responses", "Export-ready insight"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-status-success" />{item}</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-3 shadow-lg sm:p-5">
            <div className="overflow-hidden rounded-xl border border-border bg-[#FBFBF9]">
              <div className="flex items-center justify-between border-b border-border bg-white px-5 py-4">
                <div>
                  <p className="text-sm font-semibold">Customer experience study</p>
                  <p className="mt-0.5 text-xs text-text-hint">24 responses · collecting</p>
                </div>
                <span className="rounded-full bg-status-success/10 px-2.5 py-1 text-xs font-medium text-status-success">Live</span>
              </div>
              <div className="grid min-h-[430px] md:grid-cols-[180px_1fr]">
                <aside className="hidden border-r border-border bg-white p-3 md:block">
                  {["Overview", "Responses", "Themes", "Reports"].map((item, index) => (
                    <div key={item} className={`mb-1 rounded-lg px-3 py-2 text-sm ${index === 0 ? "bg-brand-blue-light font-medium text-brand-blue" : "text-text-secondary"}`}>{item}</div>
                  ))}
                </aside>
                <div className="p-5 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-hint">Research summary</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em]">People value speed, but need clearer follow-up.</h2>
                  <p className="mt-3 text-sm leading-6 text-text-secondary">Most respondents completed the flow easily. The strongest opportunity is explaining what happens after they submit.</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[["24", "Responses"], ["4m 12s", "Avg. response"], ["82%", "Positive"]].map(([value, label]) => (
                      <div key={label} className="rounded-xl border border-border bg-white p-4"><p className="text-xl font-bold">{value}</p><p className="mt-1 text-xs text-text-hint">{label}</p></div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-xl border border-border bg-white p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold"><AudioLines className="h-4 w-4 text-brand-blue" />Emerging themes</div>
                    <div className="mt-5 space-y-4">
                      {[["Ease of use", "88%"], ["Fast completion", "72%"], ["Follow-up clarity", "46%"]].map(([label, value], index) => (
                        <div key={label}><div className="mb-1.5 flex justify-between text-xs"><span>{label}</span><span className="text-text-hint">{value}</span></div><div className="h-2 rounded-full bg-surface-muted"><div className="h-full rounded-full bg-brand-blue" style={{ width: ["88%", "72%", "46%"][index] }} /></div></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="product" className="border-y border-border bg-white py-20 lg:py-24">
          <div className="survica-page-shell">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-brand-blue">A clearer workflow</p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">From question to evidence, without the busywork.</h2>
              <p className="mt-4 text-lg leading-8 text-text-secondary">A focused process that keeps your team close to the people behind the data.</p>
            </div>
            <div className="mt-12 grid border-y border-border md:grid-cols-3 md:divide-x md:divide-border">
              {workflow.map(({ number, title, description, icon: Icon }) => (
                <article key={number} className="border-b border-border py-8 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0">
                  <div className="flex items-center justify-between"><span className="text-sm font-semibold text-text-hint">{number}</span><Icon className="h-5 w-5 text-brand-blue" /></div>
                  <h3 className="mt-10 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="use-cases" className="survica-page-shell py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="max-w-md"><p className="text-sm font-semibold text-brand-blue">Built for listening</p><h2 className="mt-3 text-4xl font-bold tracking-[-0.045em]">Research that sounds like the people you serve.</h2><p className="mt-4 leading-7 text-text-secondary">For teams that need context, emotion, and explanation—not another spreadsheet full of checked boxes.</p></div>
            <div className="grid gap-4 sm:grid-cols-3">
              {useCases.map(({ title, description, icon: Icon }) => (
                <article key={title} className="rounded-2xl border border-border bg-white p-6"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue-light text-brand-blue"><Icon className="h-5 w-5" /></div><h3 className="mt-8 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p></article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="border-t border-border bg-white py-20 lg:py-24">
          <div className="survica-page-shell">
            <div className="max-w-2xl"><p className="text-sm font-semibold text-brand-blue">Simple pricing</p><h2 className="mt-3 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">Start small. Keep the full research workflow.</h2><p className="mt-4 text-lg leading-8 text-text-secondary">Choose the response volume and collaboration level that fits your work.</p></div>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {plans.map((plan) => (
                <article key={plan.name} className={`flex flex-col rounded-2xl border p-6 ${plan.featured ? "border-brand-blue bg-brand-blue-light" : "border-border bg-white"}`}>
                  <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">{plan.name}</h3>{plan.featured ? <span className="rounded-full bg-brand-blue px-2.5 py-1 text-xs font-medium text-white">Most popular</span> : null}</div>
                  <p className="mt-6"><span className="text-4xl font-bold tracking-[-0.05em]">{plan.price}</span><span className="text-sm text-text-secondary"> / month</span></p>
                  <p className="mt-4 min-h-12 text-sm leading-6 text-text-secondary">{plan.description}</p>
                  <ul className="mt-7 flex-1 space-y-3">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-status-success" />{feature}</li>)}</ul>
                  <Button className="mt-8 w-full" variant={plan.featured ? "primary" : "secondary"} onClick={() => navigate(`/signup?plan=${plan.name.toLowerCase()}`)}>Choose {plan.name}</Button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-brand-blue-light py-20 text-text-primary lg:py-24">
          <div className="survica-page-shell grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl"><div className="flex items-center gap-2 text-sm font-semibold text-brand-blue"><ShieldCheck className="h-4 w-4" />Responsible by design</div><h2 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">Make space for the full answer.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">Give respondents a natural way to speak, and give your team a disciplined way to turn those voices into decisions.</p></div>
            <Button size="lg" className="w-fit" onClick={() => navigate("/signup")} trailingIcon={<ArrowRight className="h-4 w-4" />}>Create your workspace</Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-white">
        <div className="survica-page-shell flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div><AppLogo className="h-8 max-w-[126px]" /><p className="mt-3 text-sm text-text-hint">Voice-first research, made clear.</p></div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary"><a href="#product">Product</a><a href="#use-cases">Use cases</a><a href="/login">Sign in</a><span>© 2026 Survica</span></div>
        </div>
      </footer>
    </div>
  );
}
