import {
  ArrowRight,
  BarChart3,
  Check,
  FileAudio,
  Link2,
  Mic2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLogo from "../components/AppLogo";
import PageMeta from "../components/PageMeta";
import { TopNav } from "../components/layout/TopNav";
import { Button } from "../components/ui/button";

const principles = [
  { icon: Mic2, title: "Voice-first", text: "Make recording and listening effortless." },
  { icon: Sparkles, title: "Insightful", text: "Turn conversations into meaningful findings." },
  { icon: ShieldCheck, title: "Trusted", text: "Secure, private, and reliable by design." },
];

const workflow = [
  { icon: FileAudio, title: "Create survey", text: "Build clear voice questions." },
  { icon: Link2, title: "Share survey", text: "Send one link anywhere." },
  { icon: Mic2, title: "Collect responses", text: "Let participants speak naturally." },
  { icon: BarChart3, title: "View insights", text: "Understand themes and sentiment." },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-text-primary">
      <PageMeta title="Survica - Voice-first research, simplified" description="Collect authentic voice responses and turn them into clear research insights." />
      <TopNav />

      <main>
        <section className="survica-page-shell grid min-h-[720px] gap-12 py-16 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:py-20">
          <div className="max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-blue">Voice-first research</p>
            <h1 className="mt-5 text-5xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-6xl">
              Real insights from human conversations.
            </h1>
            <p className="mt-6 text-lg leading-8 text-text-secondary">
              Survica helps researchers and teams collect voice responses, transcribe conversations, and uncover meaningful insights with AI.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" variant="gradient" onClick={() => navigate("/signup")} trailingIcon={<ArrowRight className="h-4 w-4" />}>
                Create a survey
              </Button>
              <Button size="lg" variant="ghost" onClick={() => navigate("/login")}>Sign in</Button>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {principles.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-3 lg:block xl:flex">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue"><Icon className="h-5 w-5" /></div>
                  <div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-text-secondary">{text}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-surface-page p-3 shadow-lg sm:p-5">
            <div className="flex min-h-[610px] overflow-hidden rounded-xl bg-white shadow-sm">
              <aside className="hidden w-[178px] shrink-0 bg-white p-4 md:flex md:flex-col">
                <AppLogo className="h-8 max-w-[120px]" />
                <nav className="mt-8 space-y-1">
                  {["Dashboard", "Surveys", "Responses", "Analysis", "Participants", "Templates", "Settings"].map((item, index) => (
                    <div key={item} className={`rounded-lg px-3 py-2.5 text-xs font-medium ${index === 0 ? "bg-brand-blue-light text-brand-blue" : "text-text-secondary"}`}>{item}</div>
                  ))}
                </nav>
                <div className="mt-auto rounded-xl bg-brand-blue-light p-3"><p className="text-xs font-semibold">Upgrade plan</p><p className="mt-1 text-[10px] leading-4 text-text-secondary">Unlock advanced insights and more responses.</p><div className="mt-3 rounded-md bg-brand-blue px-3 py-2 text-center text-[10px] font-semibold text-white">Upgrade now</div></div>
              </aside>
              <div className="min-w-0 flex-1 bg-[#FCFCFF] p-5 sm:p-7">
                <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold">Welcome back, Jane 👋</h2><p className="mt-1 text-xs text-text-secondary">Here&apos;s what&apos;s happening with your research.</p></div><div className="hidden rounded-lg bg-[linear-gradient(135deg,#6366F1,#7C3AED)] px-3 py-2 text-xs font-semibold text-white sm:block">+ Create survey</div></div>
                <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
                  {[["12", "Total surveys"], ["1,248", "Total responses"], ["842", "Participants"], ["68%", "Completion rate"]].map(([value, label]) => (
                    <div key={label} className="rounded-xl bg-white p-4 shadow-sm"><p className="text-xs text-text-secondary">{label}</p><p className="mt-2 text-xl font-bold">{value}</p><p className="mt-2 text-[10px] text-status-success">↑ 20% from last month</p></div>
                  ))}
                </div>
                <div className="mt-3 grid gap-3 xl:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-xl bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><p className="text-xs font-semibold">Response overview</p><span className="text-[10px] text-text-hint">Monthly</span></div><svg viewBox="0 0 500 210" className="mt-4 h-[190px] w-full"><path d="M20 175 C70 135, 100 145, 145 105 S220 150, 270 92 S345 120, 390 62 S440 76, 480 30" fill="none" stroke="#6366F1" strokeWidth="3" strokeLinecap="round"/><path d="M20 175 C70 135,100 145,145 105 S220 150,270 92 S345 120,390 62 S440 76,480 30 L480 205 L20 205Z" fill="#EEF2FF"/></svg></div>
                  <div className="rounded-xl bg-white p-4 shadow-sm"><div className="flex justify-between"><p className="text-xs font-semibold">Recent surveys</p><span className="text-[10px] text-brand-blue">View all</span></div><div className="mt-4 space-y-4">{[["Customer satisfaction", "68%"], ["Product feedback", "74%"], ["Brand perception", "62%"], ["Feature discovery", "55%"]].map(([name, value]) => <div key={name}><div className="flex justify-between text-[10px]"><span className="font-medium">{name}</span><span>{value}</span></div><div className="mt-1.5 h-1 rounded-full bg-surface-muted"><div className="h-full rounded-full bg-brand-blue" style={{ width: value }} /></div></div>)}</div></div>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {["Users love the voice experience", "Pricing is the top concern", "Integrations are frequently requested"].map((text, index) => <div key={text} className="rounded-xl bg-white p-4 shadow-sm"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue-light text-brand-blue">{index === 0 ? <Check className="h-4 w-4" /> : index === 1 ? <Sparkles className="h-4 w-4" /> : <Users className="h-4 w-4" />}</div><p className="mt-3 text-xs font-semibold leading-5">{text}</p></div>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="product" className="bg-surface-page py-20">
          <div className="survica-page-shell">
            <div className="mx-auto max-w-2xl text-center"><p className="text-sm font-semibold text-brand-blue">One focused workflow</p><h2 className="mt-3 text-4xl font-bold tracking-[-0.045em]">From survey to insight, without the noise.</h2><p className="mt-4 text-text-secondary">The same simple sequence shown in the product: create, share, collect, and understand.</p></div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{workflow.map(({ icon: Icon, title, text }, index) => <div key={title} className="rounded-xl bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue"><Icon className="h-5 w-5" /></div><span className="text-xs font-semibold text-text-hint">0{index + 1}</span></div><h3 className="mt-8 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-text-secondary">{text}</p></div>)}</div>
          </div>
        </section>

        <section id="use-cases" className="py-20"><div className="survica-page-shell rounded-2xl bg-[linear-gradient(135deg,#EEF2FF,#F5F3FF)] px-6 py-14 text-center sm:px-10"><h2 className="text-4xl font-bold tracking-[-0.045em]">Ready to hear the full answer?</h2><p className="mx-auto mt-4 max-w-xl text-text-secondary">Create a voice-first survey and turn natural conversations into clear, useful insight.</p><Button className="mt-8" size="lg" variant="gradient" onClick={() => navigate("/signup")}>Get started free</Button></div></section>
      </main>

      <footer className="py-10"><div className="survica-page-shell flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><AppLogo className="h-8 max-w-[124px]" /><div className="flex flex-wrap gap-5 text-sm text-text-secondary"><a href="#product">Product</a><a href="#use-cases">Use cases</a><a href="/login">Sign in</a><span>© 2026 Survica</span></div></div></footer>
    </div>
  );
}
