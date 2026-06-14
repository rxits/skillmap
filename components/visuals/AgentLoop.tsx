"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "think" | "act" | "observe";

const TRACE: { think: string; act: string; observe: string }[] = [
  {
    think: "I need Tokyo's population. I'll search the web.",
    act: 'search("population of Tokyo metro")',
    observe: "≈ 37,000,000 people",
  },
  {
    think: "Now I multiply that by 2 to answer the goal.",
    act: "calculator(37000000 * 2)",
    observe: "74,000,000",
  },
  {
    think: "I have everything I need. I'll return the result.",
    act: 'finish("74 million")',
    observe: "✓ goal complete",
  },
];

const PHASES: Phase[] = ["think", "act", "observe"];
const PHASE_COLOR: Record<Phase, string> = {
  think: "#f5b94d",
  act: "#7aa2ff",
  observe: "#5ee0c8",
};

export default function AgentLoop() {
  const [step, setStep] = useState(0); // 0..TRACE.length*3
  const total = TRACE.length * 3;
  const cycle = Math.min(Math.floor(step / 3), TRACE.length - 1);
  const phaseIdx = step % 3;
  const activePhase = PHASES[Math.min(phaseIdx, 2)];
  const started = step > 0;
  const done = step >= total;

  return (
    <div className="w-full">
      <div className="rounded-xl bg-ink-900/60 border border-white/10 px-4 py-3 mb-4 text-sm">
        <span className="kicker text-white/35">goal&nbsp;&nbsp;</span>
        <span className="text-white/85 font-mono text-xs">
          Find Tokyo's population and double it.
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-5 items-center">
        {/* the loop diagram */}
        <div className="relative w-[200px] h-[200px] shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx={50} cy={50} r={38} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={0.6} />
            {PHASES.map((p, idx) => {
              const angle = (idx / 3) * Math.PI * 2 - Math.PI / 2;
              const x = 50 + Math.cos(angle) * 38;
              const y = 50 + Math.sin(angle) * 38;
              const isActive = started && !done && p === activePhase;
              return (
                <g key={p}>
                  {isActive && (
                    <circle cx={x} cy={y} r={11} fill={PHASE_COLOR[p]} opacity={0.18}>
                      <animate attributeName="r" values="9;13;9" dur="1.4s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={9}
                    fill={isActive ? PHASE_COLOR[p] : "rgba(255,255,255,0.06)"}
                    stroke={PHASE_COLOR[p]}
                    strokeWidth={isActive ? 0 : 0.6}
                    strokeOpacity={0.5}
                  />
                  <text
                    x={x}
                    y={y + 1}
                    fontSize={3.4}
                    textAnchor="middle"
                    fill={isActive ? "#070912" : "rgba(255,255,255,0.6)"}
                    className="font-mono"
                    style={{ fontWeight: 600 }}
                  >
                    {p}
                  </text>
                </g>
              );
            })}
            {/* curved arrows hint */}
            <path
              d="M 50 12 A 38 38 0 0 1 82.9 69"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={0.5}
              markerEnd="url(#arrow)"
            />
            <text x={50} y={52} fontSize={4} textAnchor="middle" fill="rgba(255,255,255,0.3)" className="font-mono">
              loop {done ? TRACE.length : cycle + 1}
            </text>
          </svg>
        </div>

        {/* transcript */}
        <div className="flex-1 w-full">
          <div className="space-y-2 min-h-[150px]">
            <AnimatePresence>
              {TRACE.slice(0, cycle + (step > 0 ? 1 : 0)).map((t, ci) => {
                const maxPhase = ci < cycle ? 3 : phaseIdx + (done ? 1 : 1);
                return (
                  <div key={ci} className="space-y-1.5">
                    {PHASES.map((p, pi) => {
                      if (ci === cycle && !done && pi > phaseIdx) return null;
                      if (step === 0) return null;
                      return (
                        <motion.div
                          key={p}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start gap-2 font-mono text-xs"
                        >
                          <span
                            className="uppercase tracking-wide shrink-0 w-14"
                            style={{ color: PHASE_COLOR[p] }}
                          >
                            {p}
                          </span>
                          <span className="text-white/70">{t[p]}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })}
            </AnimatePresence>
            {step === 0 && (
              <p className="font-mono text-xs text-white/25">
                press step to start the loop…
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => setStep((s) => Math.min(s + 1, total))}
              disabled={done}
              className="font-mono text-[11px] px-4 py-1.5 rounded-full bg-signal text-ink-900 font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-glow transition"
            >
              {done ? "done" : "step ▸"}
            </button>
            <button
              onClick={() => setStep(0)}
              className="font-mono text-[11px] px-3 py-1.5 rounded-full border border-white/15 text-white/50 hover:text-white/80 transition"
            >
              reset
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-white/40 leading-relaxed">
        Reason, call a tool, read the result, decide again. That loop — not a
        bigger model — is what lets an agent actually <em>do</em> things.
      </p>
    </div>
  );
}
