import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  FaArrowRight,
  FaGlobe,
  FaLock,
  FaChartLine,
  FaMicrophone,
  FaCheckCircle,
} from "react-icons/fa";
import { supabase } from "../lib/supabase";
import PageMeta from "../components/PageMeta";

const heroImage =
  "https://res.cloudinary.com/dvl2r3bdw/image/upload/f_auto,q_auto,w_1400,c_limit/v1776072823/ChatGPT_Image_Apr_13_2026_10_31_22_AM_gtnuto.png";

const logoImage =
  "https://res.cloudinary.com/dvl2r3bdw/image/upload/f_auto,q_auto,w_160,c_limit/v1775943825/ChatGPT_Image_Apr_10_2026_12_41_04_AM_cwispp.png";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        navigate("/auth-check");
      }
    });
  }, [navigate]);

  return (
    <>
      <PageMeta
        title="Survica — Voice Survey Intelligence"
        description="Create voice-first surveys, collect spoken feedback in any language, generate transcripts, and turn responses into structured reports."
      />

      <div className="min-h-screen bg-white text-slate-900">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <Link to="/" className="flex min-w-0 items-center gap-3">
              <img
                src={logoImage}
                alt="Survica"
                className="h-10 w-10 shrink-0 rounded-xl object-contain sm:h-11 sm:w-11"
                width={44}
                height={44}
              />

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold sm:text-base">
                  Survica
                </p>
                <p className="truncate text-xs text-slate-500">
                  Voice survey intelligence
                </p>
              </div>
            </Link>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 sm:px-4"
              >
                Sign in
              </Link>

              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-[#0B4EA2] px-3.5 py-2 text-sm font-medium text-white transition hover:bg-[#093E81] sm:px-4"
              >
                Get started
              </Link>
            </div>
          </div>
        </header>

        <main>
          <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
            <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="order-2 lg:order-1">
                <div className="mx-auto flex max-w-2xl flex-col text-center lg:mx-0 lg:text-left">
                  <div className="inline-flex w-fit self-center rounded-full bg-[#EAF2FF] px-4 py-2 text-xs font-medium text-[#0B4EA2] lg:self-start">
                    Built for modern feedback workflows
                  </div>

                  <h1 className="mt-5 max-w-[14ch] text-balance text-3xl font-semibold leading-tight tracking-tight sm:max-w-none sm:text-4xl md:text-[2.6rem] md:leading-[1.1] lg:text-[3rem] xl:text-[3.35rem]">
                    Turn real human voice into{" "}
                    <span className="text-[#0B4EA2]">
                      decisions your team can act on
                    </span>
                  </h1>

                  <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base md:mt-5 md:text-[15px] lg:mx-0 lg:max-w-lg lg:text-base">
                    Survica helps teams collect voice responses, generate
                    transcripts, and turn spoken feedback into clear reports and
                    faster decisions.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:justify-center lg:justify-start">
                    <Link
                      to="/signup"
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0B4EA2] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#093E81] sm:w-auto"
                    >
                      Start collecting voice feedback
                      <FaArrowRight className="h-4 w-4 shrink-0" />
                    </Link>

                    <Link
                      to="/login"
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                    >
                      Sign in
                    </Link>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-center gap-2.5 lg:justify-start">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                      <FaLock className="h-3.5 w-3.5 shrink-0 text-[#0B4EA2]" />
                      <span>Secure voice data</span>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                      <FaGlobe className="h-3.5 w-3.5 shrink-0 text-[#0B4EA2]" />
                      <span>Multi-language ready</span>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                      <FaChartLine className="h-3.5 w-3.5 shrink-0 text-[#F56A00]" />
                      <span>Fast reporting</span>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:mt-7 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B4EA2]/10 text-[#0B4EA2]">
                          <FaMicrophone className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 text-left">
                          <p className="text-sm font-semibold text-slate-900">
                            Voice-first collection
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            Capture responses naturally without long rigid
                            forms.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F56A00]/10 text-[#F56A00]">
                          <FaCheckCircle className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 text-left">
                          <p className="text-sm font-semibold text-slate-900">
                            Action-ready insight
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            Turn transcripts into reports your team can use
                            quickly.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="mx-auto w-full max-w-xl md:max-w-2xl lg:max-w-none">
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-2.5 shadow-sm sm:rounded-[28px] sm:p-3 md:p-4">
                    <img
                      src={heroImage}
                      alt="Survica dashboard preview"
                      className="block h-auto w-full rounded-[18px] object-cover sm:rounded-[22px]"
                      width={1400}
                      height={962}
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-200 bg-slate-50">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
              <div className="mb-6 max-w-2xl">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Designed for real-world survey operations
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Survica helps teams move from raw recordings to clear
                  decisions without drowning in scattered feedback.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <p className="text-2xl font-semibold tracking-tight text-slate-900">
                    3x
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Faster response collection than traditional forms
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <p className="text-2xl font-semibold tracking-tight text-slate-900">
                    Multi-language
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Capture spoken feedback across different audiences
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <p className="text-2xl font-semibold tracking-tight text-slate-900">
                    Action-ready
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Reports built for teams, not raw transcripts
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
