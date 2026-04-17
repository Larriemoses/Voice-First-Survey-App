import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  AudioWaveform,
  ArrowRight,
  ChartColumnBig,
  Languages,
  Mic,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import AppLogo from "../components/AppLogo";
import PageMeta from "../components/PageMeta";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { DEFAULT_SHARE_DESCRIPTION } from "../lib/branding";

const heroImage =
  "https://res.cloudinary.com/dvl2r3bdw/image/upload/f_auto,q_auto,w_1120,c_limit/v1776072823/ChatGPT_Image_Apr_13_2026_10_31_22_AM_gtnuto.png";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const checkForSession = async () => {
      const { supabase } = await import("../lib/supabase");
      const { data } = await supabase.auth.getUser();

      if (!cancelled && data.user) {
        navigate("/auth-check", { replace: true });
      }
    };

    const defer =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? window.requestIdleCallback.bind(window)
        : (callback: IdleRequestCallback) => window.setTimeout(callback, 1);

    const handle = defer(() => {
      void checkForSession();
    });

    return () => {
      cancelled = true;

      if (typeof handle === "number") {
        window.clearTimeout(handle);
        return;
      }

      if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(handle);
      }
    };
  }, [navigate]);

  return (
    <>
      <PageMeta
        title="Survica | Voice Survey Intelligence"
        description={DEFAULT_SHARE_DESCRIPTION}
      />

      <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          <header className="flex flex-col gap-4 rounded-[30px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <Link to="/" className="flex w-full max-w-[13rem] items-center sm:w-auto">
              <AppLogo className="max-w-none" />
            </Link>

            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" trailingIcon={<ArrowRight className="h-4 w-4" />}>
                  Create your workspace
                </Button>
              </Link>
            </div>
          </header>

          <main className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <section className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-muted)] shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                Built for modern research and feedback teams
              </div>

              <div className="space-y-4">
                <h1 className="max-w-[12ch] text-4xl font-semibold leading-tight text-[var(--color-text)] sm:max-w-none sm:text-5xl lg:text-6xl">
                  Let people answer in their own voice
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--color-text-muted)]">
                  Survica gives your team a premium survey workflow for collecting spoken responses, tracking completion, and turning voice into insight you can actually act on.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/signup">
                  <Button size="lg" trailingIcon={<ArrowRight className="h-4 w-4" />}>
                    Start your first survey
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="secondary">
                    Sign in to your workspace
                  </Button>
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="space-y-2">
                  <Mic className="h-5 w-5 text-[var(--color-primary)]" />
                  <h2 className="text-lg font-semibold text-[var(--color-text)]">
                    Voice-first
                  </h2>
                  <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                    Make responses feel natural from the first question.
                  </p>
                </Card>
                <Card className="space-y-2" variant="flat">
                  <Languages className="h-5 w-5 text-[var(--color-info)]" />
                  <h2 className="text-lg font-semibold text-[var(--color-text)]">
                    Multi-language
                  </h2>
                  <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                    Support diverse audiences without extra survey friction.
                  </p>
                </Card>
                <Card className="space-y-2">
                  <ChartColumnBig className="h-5 w-5 text-[var(--color-success)]" />
                  <h2 className="text-lg font-semibold text-[var(--color-text)]">
                    Insight-ready
                  </h2>
                  <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                    Review transcripts, activity, and response quality in one flow.
                  </p>
                </Card>
              </div>
            </section>

            <section className="space-y-4">
              <Card className="overflow-hidden p-2 sm:p-3" variant="elevated">
                <img
                  src={heroImage}
                  alt="Survica workspace preview"
                  className="w-full rounded-[24px] object-cover"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 46vw, 100vw"
                />
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="space-y-3">
                  <AudioWaveform className="h-5 w-5 text-[var(--color-primary)]" />
                  <h2 className="text-lg font-semibold text-[var(--color-text)]">
                    Designed for clarity
                  </h2>
                  <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                    Every screen keeps the next action obvious, whether you're launching a survey or reviewing answers.
                  </p>
                </Card>
                <Card className="space-y-3" variant="flat">
                  <ShieldCheck className="h-5 w-5 text-[var(--color-success)]" />
                  <h2 className="text-lg font-semibold text-[var(--color-text)]">
                    Built for trust
                  </h2>
                  <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                    Give respondents a calm experience that feels thoughtful from start to finish.
                  </p>
                </Card>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
