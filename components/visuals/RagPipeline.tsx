"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DOCS = [
  "Refunds are processed within 5 business days of the request.",
  "Our support team is available Monday–Friday, 9am to 6pm IST.",
  "The Pro plan is $29/month and includes priority support and analytics.",
  "To reset your password, click 'Forgot password' on the login screen.",
  "The free trial lasts 14 days and needs no credit card.",
];

const QUESTIONS = [
  { q: "How long do refunds take?", hit: 0, answer: "Refunds are processed within 5 business days." },
  { q: "What does the Pro plan cost?", hit: 2, answer: "The Pro plan is $29/month, with priority support and analytics." },
  { q: "How do I reset my password?", hit: 3, answer: "Click 'Forgot password' on the login screen to reset it." },
  { q: "Is there a free trial?", hit: 4, answer: "Yes — a 14-day free trial, no credit card required." },
];

const STAGES = ["Question", "Embed", "Retrieve", "Augment", "Answer"] as const;

export default function RagPipeline() {
  const [qi, setQi] = useState(0);
  const [stage, setStage] = useState(-1); // -1 = idle
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const q = QUESTIONS[qi];

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function run() {
    clearTimers();
    setStage(0);
    for (let s = 1; s < STAGES.length; s++) {
      timers.current.push(setTimeout(() => setStage(s), s * 850));
    }
  }

  useEffect(() => () => clearTimers(), []);

  function pick(idx: number) {
    setQi(idx);
    setStage(-1);
    clearTimers();
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {QUESTIONS.map((qq, idx) => (
          <button
            key={idx}
            onClick={() => pick(idx)}
            className={`font-mono text-[11px] px-3 py-1.5 rounded-full border transition ${
              idx === qi
                ? "border-signal text-signal bg-signal/10"
                : "border-white/10 text-white/45 hover:text-white/80"
            }`}
          >
            {qq.q}
          </button>
        ))}
        <button
          onClick={run}
          className="ml-auto font-mono text-[11px] px-4 py-1.5 rounded-full bg-signal text-ink-900 font-semibold hover:shadow-glow transition"
        >
          ▶ run pipeline
        </button>
      </div>

      {/* stage rail */}
      <div className="flex items-center gap-1 mb-5">
        {STAGES.map((s, idx) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div
              className={`font-mono text-[10px] px-2.5 py-1 rounded-md border whitespace-nowrap transition ${
                stage >= idx
                  ? "border-signal/60 text-signal bg-signal/10"
                  : "border-white/10 text-white/30"
              }`}
            >
              {idx + 1}. {s}
            </div>
            {idx < STAGES.length - 1 && (
              <div className="flex-1 h-px mx-1 bg-white/10 relative overflow-hidden">
                {stage > idx && (
                  <motion.div
                    className="absolute inset-0 bg-signal"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* knowledge base */}
        <div className="rounded-2xl bg-ink-900/60 border border-white/10 p-4">
          <div className="kicker text-white/35 mb-3">your documents</div>
          <div className="space-y-2">
            {DOCS.map((d, idx) => {
              const retrieved = stage >= 2 && idx === q.hit;
              return (
                <motion.div
                  key={idx}
                  animate={{
                    borderColor: retrieved ? "rgba(245,185,77,0.6)" : "rgba(255,255,255,0.08)",
                    backgroundColor: retrieved ? "rgba(245,185,77,0.08)" : "rgba(255,255,255,0.02)",
                    scale: retrieved ? 1.015 : 1,
                  }}
                  className="rounded-lg border px-3 py-2 text-xs text-white/65 flex gap-2"
                >
                  <span className="font-mono text-white/30">{idx + 1}</span>
                  <span className={retrieved ? "text-signal-soft" : ""}>{d}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* the prompt + answer */}
        <div className="rounded-2xl bg-ink-900/60 border border-white/10 p-4 flex flex-col">
          <div className="kicker text-white/35 mb-3">what the model sees</div>
          <div className="font-mono text-xs space-y-2 flex-1">
            <AnimatePresence>
              {stage >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-signal/10 border border-signal/25 px-3 py-2 text-signal-soft"
                >
                  <span className="text-white/35">context: </span>
                  {DOCS[q.hit]}
                </motion.div>
              )}
            </AnimatePresence>
            {stage >= 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg bg-white/5 px-3 py-2 text-white/75"
              >
                <span className="text-white/35">question: </span>
                {q.q}
              </motion.div>
            )}
          </div>

          <div className="mt-3">
            <div className="kicker text-white/35 mb-2">grounded answer</div>
            <div className="min-h-[52px] rounded-lg bg-mastered/10 border border-mastered/25 px-3 py-2 text-sm text-mastered-soft">
              <AnimatePresence mode="wait">
                {stage >= 4 ? (
                  <motion.span
                    key="ans"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {q.answer}
                  </motion.span>
                ) : (
                  <span key="wait" className="text-white/25 font-mono text-xs">
                    {stage < 0 ? "press run…" : "thinking…"}
                  </span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-white/40 leading-relaxed">
        The model never memorized your docs. RAG found the one relevant line and
        handed it over at answer-time — change the question and watch a different
        chunk light up.
      </p>
    </div>
  );
}
