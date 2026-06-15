"use client";

import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ChallengeProps } from "@/lib/types";
import { useChallenge } from "./useChallenge";

type Chunk = { id: number; label: string; x: number; y: number };

const CHUNKS: Chunk[] = [
  { id: 1, label: "refund policy", x: 30, y: 28 },
  { id: 2, label: "office hours", x: 68, y: 22 },
  { id: 3, label: "pricing tiers", x: 78, y: 60 },
  { id: 4, label: "reset password", x: 24, y: 70 },
  { id: 5, label: "free trial terms", x: 55, y: 50 },
  { id: 6, label: "data privacy", x: 42, y: 84 },
  { id: 7, label: "API limits", x: 86, y: 38 },
];

export default function RetrievalRank(props: ChallengeProps) {
  const [query, setQuery] = useState({ x: 50, y: 50 });
  const [k, setK] = useState(3);
  const svgRef = useRef<SVGSVGElement>(null);

  const ranked = useMemo(() => {
    return CHUNKS.map((c) => ({ c, d: Math.hypot(c.x - query.x, c.y - query.y) }))
      .sort((a, b) => a.d - b.d);
  }, [query]);

  const topK = new Set(ranked.slice(0, k).map((r) => r.c.id));

  const top1Target = props.challenge?.target.top1 as string | undefined;
  const solved = top1Target !== undefined && ranked[0]?.c.label === top1Target;
  useChallenge(props, solved, `#1: ${ranked[0]?.c.label ?? "—"}`);

  function place(e: React.MouseEvent) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setQuery({ x: Math.max(4, Math.min(96, x)), y: Math.max(4, Math.min(96, y)) });
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="kicker text-white/35 mb-2">
            click anywhere to move your query
          </div>
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            onClick={place}
            className="w-full max-w-[360px] aspect-square rounded-2xl bg-ink-900/60 border border-white/10 cursor-crosshair"
          >
            {ranked.slice(0, k).map((r) => (
              <line
                key={r.c.id}
                x1={query.x}
                y1={query.y}
                x2={r.c.x}
                y2={r.c.y}
                stroke="#5ee0c8"
                strokeWidth={0.5}
                strokeOpacity={0.45}
                className="dash-flow"
              />
            ))}
            {CHUNKS.map((c) => {
              const hit = topK.has(c.id);
              return (
                <g key={c.id}>
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={hit ? 2.4 : 1.7}
                    fill={hit ? "#5ee0c8" : "#566080"}
                  />
                  <text
                    x={c.x + 3}
                    y={c.y + 1}
                    fontSize={2.8}
                    fill={hit ? "#9af0e1" : "rgba(255,255,255,0.4)"}
                    className="font-mono"
                  >
                    {c.label}
                  </text>
                </g>
              );
            })}
            {/* query marker */}
            <motion.circle
              cx={query.x}
              cy={query.y}
              r={2.8}
              fill="#f5b94d"
              animate={{ cx: query.x, cy: query.y }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            />
            <motion.circle
              cx={query.x}
              cy={query.y}
              r={5}
              fill="none"
              stroke="#f5b94d"
              strokeWidth={0.4}
              animate={{ cx: query.x, cy: query.y }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            />
          </svg>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="kicker text-white/35">top-k retrieved</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-white/50">k =</span>
              <input
                type="range"
                min={1}
                max={6}
                value={k}
                onChange={(e) => setK(Number(e.target.value))}
                className="accent-[#5ee0c8] w-28"
              />
              <span className="font-mono text-sm text-mastered w-4">{k}</span>
            </div>
          </div>
          <div className="space-y-2">
            {ranked.map((r, idx) => {
              const hit = idx < k;
              return (
                <div
                  key={r.c.id}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 transition ${
                    hit ? "bg-mastered/10 border border-mastered/30" : "bg-white/5 opacity-50"
                  }`}
                >
                  <span className="font-mono text-sm text-white/85">
                    {idx + 1}. {r.c.label}
                  </span>
                  <span className="font-mono text-[11px] text-white/45">
                    {(1 - r.d / 130).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-white/40 leading-relaxed">
            The database returns the <span className="text-mastered">k closest</span>{" "}
            chunks to your query — in milliseconds, even across millions of points.
          </p>
        </div>
      </div>
    </div>
  );
}
