import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  FaMicrophoneAlt,
  FaChartLine,
  FaGlobe,
  FaArrowRight,
} from "react-icons/fa";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const staggerWrap = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const floatAnim = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

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
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-80px] top-[120px] h-72 w-72 rounded-full bg-[#0B4EA2]/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-60px] top-[220px] h-72 w-72 rounded-full bg-[#F56A00]/10 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-80px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-100/40 blur-3xl"
        />
      </div>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <motion.img
              whileHover={{ scale: 1.08, rotate: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              src="https://res.cloudinary.com/dvl2r3bdw/image/upload/v1775943825/ChatGPT_Image_Apr_10_2026_12_41_04_AM_cwispp.png"
              alt="Survica"
              className="h-10 w-10 rounded-xl object-contain shadow-sm"
            />
            <div>
              <h1 className="text-lg font-semibold">Survica</h1>
              <p className="text-xs text-slate-500">
                Voice survey intelligence
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Sign in
            </Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/signup"
                className="rounded-xl bg-[#0B4EA2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#093E81]"
              >
                Get started
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </header>

      <section className="relative px-6 py-20 sm:py-28">
        <motion.div
          variants={staggerWrap}
          initial="hidden"
          animate="show"
          className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2"
        >
          <motion.div variants={staggerWrap} className="space-y-8">
            <motion.div
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              className="inline-flex items-center rounded-full bg-[#EAF2FF] px-4 py-2 text-sm font-medium text-[#0B4EA2] shadow-sm"
            >
              Voice-first feedback for modern teams
            </motion.div>

            <motion.div variants={staggerWrap} className="space-y-5">
              <motion.h2
                variants={fadeUp}
                className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
              >
                Turn spoken feedback into clear decisions with{" "}
                <span className="text-[#0B4EA2]">Survica</span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg"
              >
                Create voice surveys, collect responses in any language,
                generate transcripts, and turn interviews into structured
                reports your team can actually use.
              </motion.p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B4EA2] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[#0B4EA2]/20 transition hover:bg-[#093E81]"
                >
                  Create your first survey
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <FaArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Sign in
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            {...floatAnim}
            className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.28)]"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <FaMicrophoneAlt className="h-6 w-6 text-[#F56A00]" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Voice responses
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Let respondents speak naturally instead of filling rigid
                  forms.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <FaGlobe className="h-6 w-6 text-[#0B4EA2]" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Multilingual ready
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Collect responses in different languages and normalize them
                  for review.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2"
              >
                <FaChartLine className="h-6 w-6 text-[#0B4EA2]" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  AI-powered insight workflow
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Process transcripts, export structured CSVs, and turn raw
                  audio into business-ready insight.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
