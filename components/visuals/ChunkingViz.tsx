"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

const DOC =
  "Acme Corp was founded in 2019 to help small teams ship software faster. " +
  "Our refund policy is simple: full refunds within 30 days, no questions asked. " +
  "Support is available Monday to Friday, and the Pro plan unlocks priority replies.";

type Strategy = "fixed" | "sentence";

const TINTS = [
  "rgba(245,185,77,0.16)",
  "rgba(94,224,200,0.16)",
  "rgba(122,162,255,0.16)",
  "rgba(244,114,182,0.14)",
];
const BORDERS = [
  "rgba(245,185,77,0.5)",
  "rgba(94,224,200,0.5)",
  "rgba(122,162,255,0.5)",
  "rgba(244,114,182,0.45)",
];

function chunk(strategy: Strategy, size: number): string[] {
  if (strategy === "sentence") {
    return DOC.match(/[^.]+\.?/g)?.map((s) => s.trim()).filter(Boolean) ?? [DOC];
  }
  const words = DOC.split(" ");
  const out: string[] = [];
  for (let i = 0; i < words.length; i += size) {
    out.push(words.slice(i, i + size).join(" "));
  }
  return out;
}

export default function ChunkingViz() {
  const [strategy, setStrategy] = useState<Strategy>("fixed");
  const [size, setSize] = useState(8);

  const chunks = useMemo(() => chunk(strategy, size), [strategy, size]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(["fixed", "sentence"] as Strategy[]).map((s) => (
          <button
            key={s}
            onClick={() => setStrategy(s)}
            className={`font-mono text-[11px] px-3 py-1.5 rounded-full border transition ${
              strategy === s
                ? "border-signal text-signal bg-signal/10"
                : "border-white/10 text-white/45 hover:text-white/80"
            }`}
          >
            {s === "fixed" ? "fixed-size" : "by sentence"}
          </button>
        ))}
        {strategy === "fixed" && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="font-mono text-xs text-white/50">{size} words</span>
            <input
              type="range"
              min={3}
              max={16}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="accent-[#f5b94d] w-32"
            />
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-ink-900/60 border border-white/10 p-4 leading-[2.1] text-sm">
        {chunks.map((c, idx) => (
          <motion.span
            key={`${strategy}-${size}-${idx}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.04 }}
            className="inline rounded-md px-1.5 py-1 mr-1.5 box-decoration-clone"
            style={{
              background: TINTS[idx % TINTS.length],
              boxShadow: `inset 0 0 0 1px ${BORDERS[idx % BORDERS.length]}`,
            }}
          >
            {c}
          </motion.span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-white/45">
        <span>
          {chunks.length} chunk{chunks.length === 1 ? "" : "s"} → {chunks.length} vectors to store
        </span>
        <span className="text-white/30">each chunk = one searchable unit</span>
      </div>

      <p className="mt-4 text-xs text-white/40 leading-relaxed">
        Chunk too big and retrieval drags in noise; too small and you lose context.
        Splitting on sentences keeps ideas whole — this single choice quietly makes or
        breaks a RAG system.
      </p>
    </div>
  );
}
