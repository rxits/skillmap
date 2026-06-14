"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

type Word = { w: string; x: number; y: number; group: string };

const WORDS: Word[] = [
  { w: "king", x: 22, y: 26, group: "royalty" },
  { w: "queen", x: 30, y: 22, group: "royalty" },
  { w: "prince", x: 26, y: 34, group: "royalty" },
  { w: "dog", x: 74, y: 70, group: "animals" },
  { w: "puppy", x: 81, y: 66, group: "animals" },
  { w: "cat", x: 70, y: 78, group: "animals" },
  { w: "pizza", x: 38, y: 80, group: "food" },
  { w: "burger", x: 45, y: 86, group: "food" },
  { w: "sushi", x: 33, y: 90, group: "food" },
  { w: "python", x: 82, y: 24, group: "tech" },
  { w: "server", x: 76, y: 18, group: "tech" },
  { w: "code", x: 86, y: 30, group: "tech" },
];

function dist(a: Word, b: Word) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export default function VectorSpace() {
  const [sel, setSel] = useState<string>("king");
  const selected = WORDS.find((w) => w.w === sel)!;

  const neighbors = useMemo(() => {
    return WORDS.filter((w) => w.w !== sel)
      .map((w) => ({ w, d: dist(selected, w) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
  }, [sel, selected]);

  const nearIds = new Set(neighbors.map((n) => n.w.w));

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 aspect-square max-w-[360px] rounded-2xl bg-ink-900/60 border border-white/10 overflow-hidden">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            {/* grid */}
            {[20, 40, 60, 80].map((g) => (
              <g key={g} stroke="rgba(255,255,255,0.04)" strokeWidth={0.3}>
                <line x1={g} y1={0} x2={g} y2={100} />
                <line x1={0} y1={g} x2={100} y2={g} />
              </g>
            ))}
            {/* links to neighbors */}
            {neighbors.map((n) => (
              <motion.line
                key={n.w.w}
                x1={selected.x}
                y1={selected.y}
                x2={n.w.x}
                y2={n.w.y}
                stroke="#f5b94d"
                strokeWidth={0.5}
                strokeOpacity={0.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            ))}
            {WORDS.map((w) => {
              const isSel = w.w === sel;
              const isNear = nearIds.has(w.w);
              return (
                <g
                  key={w.w}
                  onClick={() => setSel(w.w)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={w.x}
                    cy={w.y}
                    r={isSel ? 2.6 : 1.8}
                    fill={isSel ? "#f5b94d" : isNear ? "#f8d089" : "#566080"}
                  />
                  <text
                    x={w.x + 3}
                    y={w.y + 1}
                    fontSize={3.2}
                    fill={isSel ? "#fff" : isNear ? "#f8d089" : "rgba(255,255,255,0.45)"}
                    className="font-mono"
                    style={{ pointerEvents: "none" }}
                  >
                    {w.w}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex-1">
          <div className="kicker text-white/35 mb-2">pick a word</div>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {WORDS.map((w) => (
              <button
                key={w.w}
                onClick={() => setSel(w.w)}
                className={`font-mono text-[11px] px-2.5 py-1 rounded-full border transition ${
                  w.w === sel
                    ? "border-signal text-signal bg-signal/10"
                    : "border-white/10 text-white/45 hover:text-white/80"
                }`}
              >
                {w.w}
              </button>
            ))}
          </div>

          <div className="kicker text-white/35 mb-2">
            nearest in meaning to <span className="text-signal">{sel}</span>
          </div>
          <div className="space-y-2">
            {neighbors.map((n, idx) => (
              <div
                key={n.w.w}
                className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
              >
                <span className="font-mono text-sm text-white/85">
                  {idx + 1}. {n.w.w}
                </span>
                <span className="font-mono text-[11px] text-white/40">
                  {(1 - n.d / 110).toFixed(2)} sim
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/40 leading-relaxed">
            Words with similar meaning cluster together. The model never sees
            letters — only these coordinates.
          </p>
        </div>
      </div>
    </div>
  );
}
