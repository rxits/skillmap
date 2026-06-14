"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const PROMPTS: { text: string; tokens: [string, number][] }[] = [
  {
    text: "The capital of France is",
    tokens: [["Paris", 0.92], ["the", 0.03], ["located", 0.02], ["a", 0.02], ["home", 0.01]],
  },
  {
    text: "I love programming because it",
    tokens: [["lets", 0.19], ["is", 0.17], ["allows", 0.15], ["gives", 0.1], ["makes", 0.09]],
  },
  {
    text: "Once upon a",
    tokens: [["time", 0.96], ["midnight", 0.02], ["star", 0.008], ["day", 0.007], ["dream", 0.005]],
  },
  {
    text: "def fibonacci(n):",
    tokens: [["⏎ if", 0.34], ["⏎ return", 0.22], ["⏎ a,", 0.12], [" #", 0.06], ["⏎ n", 0.05]],
  },
];

export default function TokenStream() {
  const [i, setI] = useState(0);
  const p = PROMPTS[i];

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-5">
        {PROMPTS.map((pr, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`font-mono text-[11px] px-3 py-1.5 rounded-full border transition ${
              idx === i
                ? "border-signal text-signal bg-signal/10"
                : "border-white/10 text-white/45 hover:text-white/80 hover:border-white/25"
            }`}
          >
            {pr.text.length > 22 ? pr.text.slice(0, 22) + "…" : pr.text}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-ink-900/60 border border-white/10 p-5 font-mono text-sm">
        <span className="text-white/80">{p.text}</span>
        <motion.span
          key={p.text}
          className="inline-block w-2 h-4 ml-1 align-middle bg-signal"
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>

      <div className="mt-5 space-y-2.5">
        <div className="kicker text-white/35 mb-1">next-token probabilities</div>
        {p.tokens.map(([tok, prob], idx) => (
          <div key={tok + idx} className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-right font-mono text-xs text-white/70">
              {tok}
            </div>
            <div className="flex-1 h-7 rounded-md bg-white/5 overflow-hidden relative">
              <motion.div
                className={`h-full rounded-md ${
                  idx === 0
                    ? "bg-gradient-to-r from-signal/70 to-signal"
                    : "bg-white/15"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${prob * 100}%` }}
                transition={{ duration: 0.7, delay: idx * 0.06, ease: "easeOut" }}
              />
              <span className="absolute inset-y-0 right-2 flex items-center font-mono text-[11px] text-white/55">
                {(prob * 100).toFixed(prob < 0.01 ? 1 : 0)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-white/40 leading-relaxed">
        The model picks (usually) the top bar, appends it, and predicts again — one
        token at a time. Swap the prompt above and watch its certainty change.
      </p>
    </div>
  );
}
