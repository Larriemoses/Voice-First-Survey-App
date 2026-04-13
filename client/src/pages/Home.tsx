import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { supabase } from "../lib/supabase";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const staggerWrap: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const heroImage =
  "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1776072823/ChatGPT_Image_Apr_13_2026_10_31_22_AM_gtnuto.png";

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
    <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-900">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 28, 0], y: [0, -18, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-100px] top-[80px] h-56 w-56 rounded-full bg-[#0B4EA2]/10 blur-3xl sm:h-72 sm:w-72"
        />
        <motion.div
          animate={{ x: [0, -24, 0], y: [0, 24, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-80px] top-[180px] h-56 w-56 rounded-full bg-[#F56A00]/10 blur-3xl sm:h-72 sm:w-72"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(11,78,162,0.05),transparent_35%)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <motion.img
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              src="https://res.cloudinary.com/dvl2r3bdw/image/upload/v1775943825/ChatGPT_Image_Apr_10_2026_12_41_04_AM_cwispp.png"
              alt="Survica"
              className="h-10 w-10 shrink-0 rounded-xl object-contain"
            />

            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold sm:text-base">
                Survica
              </h1>
              <p className="truncate text-[11px] text-slate-500 sm:text-xs">
                Voice survey intelligence
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Sign in
            </Link>

            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-[#0B4EA2] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#093E81]"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          {/* Text content */}
          <motion.div
            variants={staggerWrap}
            initial="hidden"
            animate="show"
            className="order-2 lg:order-1"
          >
            <div className="max-w-xl space-y-6 text-center sm:space-y-7 lg:text-left">
              <motion.div
                variants={fadeUp}
                className="mx-auto inline-flex w-fit items-center rounded-full border border-[#0B4EA2]/10 bg-[#EAF2FF] px-4 py-2 text-xs font-medium text-[#0B4EA2] shadow-sm sm:text-sm lg:mx-0"
              >
                Voice-first feedback for modern teams
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-4">
                <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Turn voice responses into{" "}
                  <span className="text-[#0B4EA2]">clear business insight</span>
                </h2>

                <p className="mx-auto max-w-lg text-sm leading-7 text-slate-600 sm:text-base lg:mx-0 lg:max-w-xl lg:text-lg">
                  Survica helps teams create voice surveys, collect responses in
                  multiple languages, generate transcripts, and turn raw spoken
                  feedback into structured reports they can act on.
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
              >
                <Link
                  to="/signup"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B4EA2] px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-[#0B4EA2]/15 transition hover:bg-[#093E81] sm:w-auto"
                >
                  Create your first survey
                  <FaArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  Sign in
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="grid gap-3 pt-2 sm:grid-cols-2"
              >
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/85 p-4 text-left shadow-sm">
                  <FaCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0B4EA2]" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Voice-first collection
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Capture natural responses instead of forcing rigid forms.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/85 p-4 text-left shadow-sm">
                  <FaCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#F56A00]" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Structured reporting
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Turn transcripts and responses into usable insights fast.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-1 lg:order-2"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative mx-auto w-full max-w-[680px]"
            >
              <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-tr from-[#0B4EA2]/10 via-sky-100/40 to-[#F56A00]/10 blur-3xl" />

              <div className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.18)] sm:p-4">
                <div className="overflow-hidden rounded-[22px] bg-slate-50">
                  <img
                    src={heroImage}
                    alt="Survica product illustration"
                    className="h-auto w-full object-contain"
                    loading="eager"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA / trust strip */}
      <section className="relative pb-14 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-blue-50 px-5 py-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.18)] sm:px-8 sm:py-8">
            {/* Decorative accents */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-[#0B4EA2]/10 blur-3xl" />
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#F56A00]/10 blur-3xl" />
              <div className="absolute bottom-0 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-sky-200/20 blur-2xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(11,78,162,0.06),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(245,106,0,0.06),transparent_24%)]" />
            </div>

            <div className="relative z-10">
              <div className="mx-auto mb-6 max-w-2xl text-center">
                <p className="inline-flex items-center rounded-full border border-[#0B4EA2]/10 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0B4EA2] shadow-sm">
                  Why teams choose Survica
                </p>

                <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                  Built for fast collection, clearer insight, and better
                  decisions
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                  Everything is designed to help teams capture real voice
                  feedback and turn it into structured, usable outcomes.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="group rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:p-5">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B4EA2]/10 text-[#0B4EA2]">
                      <FaArrowRight className="h-4 w-4 rotate-[-45deg]" />
                    </div>

                    <div className="min-w-0 text-left">
                      <p className="text-sm font-semibold text-slate-900">
                        Faster collection
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Make feedback easier for respondents by letting them
                        speak naturally instead of filling long rigid forms.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:p-5">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F56A00]/10 text-[#F56A00]">
                      <FaCheckCircle className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 text-left">
                      <p className="text-sm font-semibold text-slate-900">
                        Multilingual ready
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Collect and organize responses across different
                        languages without losing clarity in review and
                        reporting.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:p-5">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-[#0B4EA2]">
                      <FaCheckCircle className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 text-left">
                      <p className="text-sm font-semibold text-slate-900">
                        Professional outputs
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Export reports and structured insights your team can act
                        on with more speed and confidence.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B4EA2] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#093E81]"
                >
                  Start with Survica
                  <FaArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
