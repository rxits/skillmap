"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChallengeProps } from "@/lib/types";
import { useChallenge } from "./useChallenge";

type Doc = { id: number; text: string; kw: number; sem: number };

const QUERY = "M1 battery life";

const DOCS: Doc[] = [
  { id: 1, text: "The M1 MacBook battery lasts up to 18 hours.", kw: 0.95, sem: 0.92 },
  { id: 2, text: "Apple Silicon sips power compared to Intel chips.", kw: 0.12, sem: 0.88 },
  { id: 3, text: "Battery health drops after ~500 charge cycles.", kw: 0.55, sem: 0.6 },
  { id: 4, text: "M1 chip benchmark scores vs the competition.", kw: 0.78, sem: 0.45 },
  { id: 5, text: "How to replace a laptop battery yourself.", kw: 0.5, sem: 0.3 },
];

type Mode = "keyword" | "semantic" | "hybrid";

const MODES: { id: Mode; label: string; color: string }[] = [
  { id: "keyword", label: "keyword only", color: "#7aa2ff" },
  { id: "semantic", label: "semantic only", color: "#5ee0c8" },
  { id: "hybrid", label: "hybrid ✦", color: "#f5b94d" },
];

function scoreOf(d: Doc, mode: Mode) {
  if (mode === "keyword") return d.kw;
  if (mode === "semantic") return d.sem;
  return (d.kw + d.sem) / 2;
}

const MISS_NOTE: Record<Mode, JSX.Element> = {
  keyword: (
    <>
      Keyword-only <span className="text-[#7aa2ff]">misses</span> "Apple Silicon sips
      power" — no exact words match, even though it's spot on.
    </>
  ),
  semantic: (
    <>
      Semantic-only can rank the literal <span className="text-[#5ee0c8]">"M1 benchmark"</span>{" "}
      doc lower than you'd want — it chases meaning, not exact terms.
    </>
  ),
  hybrid: (
    <>
      Hybrid catches <span className="text-signal">both</span> — the exact "M1" matches
      and the paraphrased "Apple Silicon" doc. Nothing slips through.
    </>
  ),
};

export default function HybridSearch(props: ChallengeProps) {
  const [mode, setMode] = useState<Mode>("hybrid");

  const ranked = useMemo(() => {
    return DOCS.map((d) => ({ d, s: scoreOf(d, mode) })).sort((a, b) => b.s - a.s);
  }, [mode]);

  const topIds = new Set(ranked.slice(0, 3).map((r) => r.d.id));

  const needle = props.challenge?.target.retrieves as string | undefined;
  const wanted = needle ? DOCS.find((d) => d.text.includes(needle)) : undefined;
  const found = !!wanted && topIds.has(wanted.id);
  useChallenge(props, !!needle && found, found ? `${mode} · in top 3 ✓` : `${mode} · missed it`);

  return (
    <div className="w-full">
      <div className="rounded-xl bg-ink-900/60 border border-white/10 px-4 py-3 mb-4 flex items-center gap-2">
        <span className="kicker text-white/35">query</span>
        <span className="font-mono text-xs text-white/85">{QUERY}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className="font-mono text-[11px] px-3 py-1.5 rounded-full border transition"
            style={
              mode === m.id
                ? { borderColor: m.color, color: m.color, background: `${m.color}1a` }
                : { borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {DOCS.map((d) => {
          const hit = topIds.has(d.id);
          return (
            <div
              key={d.id}
              className={`rounded-lg border px-3 py-2.5 transition ${
                hit ? "border-signal/40 bg-signal/[0.06]" : "border-white/8 bg-white/[0.02] opacity-55"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm ${hit ? "text-white/90" : "text-white/55"}`}>
                  {hit ? "✓ " : ""}
                  {d.text}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ScoreBar label="kw" value={d.kw} color="#7aa2ff" active={mode !== "semantic"} />
                <ScoreBar label="sem" value={d.sem} color="#5ee0c8" active={mode !== "keyword"} />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-white/40 leading-relaxed">{MISS_NOTE[mode]}</p>
    </div>
  );
}

function ScoreBar({
  label,
  value,
  color,
  active,
}: {
  label: string;
  value: number;
  color: string;
  active: boolean;
}) {
  return (
    <div className={`flex items-center gap-1.5 flex-1 ${active ? "" : "opacity-25"}`}>
      <span className="font-mono text-[9px] text-white/40 w-6">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}
