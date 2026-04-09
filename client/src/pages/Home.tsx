import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";

// 🔥 Upgraded Button (clean + consistent colors)
const Button = ({ children, className = "", variant, onClick }: any) => {
  const base =
    "rounded-2xl px-6 py-3 font-semibold transition-all duration-300";

  const styles =
    variant === "outline"
      ? "border border-blue-200 text-blue-700 hover:bg-blue-50"
      : "bg-blue-500 text-white hover:scale-105 hover:shadow-lg";

  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
};

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        navigate("/auth-check");
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 text-gray-900 overflow-hidden">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            Speak your thoughts.
            <br />
            <span className="bg-blue-500 bg-clip-text text-transparent">
              Let the answers flow.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-lg">
            Voice-first surveys designed to capture real thoughts.
          </p>

          <div className="mt-8 flex gap-4">
            <Button onClick={() => navigate("/auth-check")}>
              Start Survey
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/take-survey/demo")}
            >
              Try Demo
            </Button>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Takes less than 30 seconds to try.
          </p>
        </motion.div>

        {/* Animated Mic (Enhanced) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="relative">
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full border-4 border-green-300 animate-ping opacity-30" />
            <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping opacity-20 delay-200" />

            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-28 h-28 rounded-full bg-blue-500 to-orange-400 flex items-center justify-center shadow-xl text-white text-2xl"
            >
              🎤
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold">How it works</h2>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {["Open Link", "Speak", "Submit"].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition"
              >
                <div className="text-3xl font-bold text-blue-600">{i + 1}</div>
                <h3 className="mt-4 text-xl font-semibold">{step}</h3>
                <p className="mt-2 text-gray-600">
                  {i === 0 && "Open instantly in your browser"}
                  {i === 1 && "Answer naturally with your voice"}
                  {i === 2 && "Submit in seconds"}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold">
            Built for real human responses
          </h2>

          <div className="grid md:grid-cols-3 gap-10 mt-12">
            {["Natural", "Fast", "Insightful"].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl"
              >
                <h3 className="text-xl font-semibold">{item}</h3>
                <p className="mt-2 text-gray-600">
                  {item === "Natural" && "People express better by speaking"}
                  {item === "Fast" && "No forms. No friction."}
                  {item === "Insightful" && "Capture emotion and tone"}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold">Experience it live</h2>

          <div className="mt-10 bg-white p-8 rounded-2xl shadow-lg">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-orange-400"
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>

            <p className="mt-4 text-gray-500 text-sm">
              Simulated voice playback
            </p>
          </div>

          <Button
            className="mt-8"
            onClick={() => navigate("/take-survey/demo")}
          >
            Try Demo Now
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-green-500 via-blue-500 to-orange-400 text-white py-20 text-center">
        <h2 className="text-3xl font-semibold">
          Start collecting real responses today
        </h2>

        <div className="mt-6 flex justify-center gap-4">
          <Button
            onClick={() => navigate("/auth-check")}
            className="bg-white text-black"
          >
            Create Survey
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            className="border-white text-white"
          >
            Sign In
          </Button>
        </div>
      </section>
    </div>
  );
}
