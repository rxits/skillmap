"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

type Cand = { id: number; text: string; vec: number; rerank: number };

const QUERY = "How do I get my money back?";

const CANDS: Cand[] = [
  { id: 1, text: "Return shipping is free on all orders.", vec: 0.71, rerank: 0.22 },
  { id: 2, text: "Contact billing for invoice questions.", vec: 0.68, rerank: 0.18 },
  { id: 3, text: "Refunds: we return your full payment within 30 days.", vec: 0.66, rerank: 0.96 },
  { id: 4, text: "Payment methods include card and UPI.", vec: 0.61, rerank: 0.14 },
  { id: 5, text: "Cancel your plan anytime in settings.", vec: 0.55, rerank: 0.41 },
];

export default function Reranking() {
  const [reranked, setReranked] = useState(false);

  const ordered = useMemo(() => {
    const arr = [...CANDS];
    arr.sort((a, b) => (reranked ? b.rerank - a.rerank : b.vec - a.vec));
    return arr;
  }, [reranked]);

  return (
    <div className="w-full">
      <div className="rounded-xl bg-ink-900/60 border border-white/10 px-4 py-3 mb-4 flex items-center gap-2">
        <span className="kicker text-white/35">query</span>
        <span className="font-mono text-xs text-white/85">{QUERY}</span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="kicker text-white/35">
          {reranked ? "after re-ranking" : "raw vector retrieval"}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setReranked(true)}
            disabled={reranked}
            className="font-mono text-[11px] px-4 py-1.5 rounded-full bg-signal text-ink-900 font-semibold disabled:opacity-30 hover:shadow-glow transition"
          >
            ✨ re-rank
          </button>
          <button
            onClick={() => setReranked(false)}
            className="font-mono text-[11px] px-3 py-1.5 rounded-full border border-white/15 text-white/50 hover:text-white/80 transition"
          >
            reset
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {ordered.map((c, idx) => {
          const score = reranked ? c.rerank : c.vec;
          const isWinner = reranked && idx === 0;
          const isGem = c.id === 3;
          return (
            <motion.div
              layout
              key={c.id}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${
                isWinner
                  ? "border-mastered/50 bg-mastered/10"
                  : isGem && !reranked
                    ? "border-signal/30 bg-signal/[0.04]"
                    : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <span
                className={`font-display text-lg w-6 text-center ${
                  isWinner ? "text-mastered" : "text-white/40"
                }`}
              >
                {idx + 1}
              </span>
              <span className="flex-1 text-sm text-white/80">{c.text}</span>
              <div className="w-20 shrink-0">
                <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${isWinner ? "bg-mastered" : "bg-white/30"}`}
                    animate={{ width: `${score * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="font-mono text-[10px] text-white/40 mt-1 text-right">
                  {score.toFixed(2)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-white/40 leading-relaxed">
        {reranked ? (
          <>
            The perfect chunk was buried at <span className="text-signal">#3</span> by raw
            vector search — the re-ranker actually read it and shoved it to{" "}
            <span className="text-mastered">#1</span>. That's the whole win.
          </>
        ) : (
          <>
            Vector search is fast but approximate — notice the real answer
            (highlighted) is only ranked <span className="text-signal">#3</span>. Hit
            re-rank and watch it fix itself.
          </>
        )}
      </p>
    </div>
  );
}
