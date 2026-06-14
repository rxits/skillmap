"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NODES, EDGES, NODE_BY_ID } from "@/lib/content";
import { NodeState } from "@/lib/types";

function colorFor(node: { accent?: string }, st: NodeState): string {
  if (st === "mastered") return "#5ee0c8";
  if (st === "locked") return "#566080";
  return node.accent ?? "#f5b94d"; // available → its own accent
}

export default function MapCanvas({
  stateOf,
  onSelect,
  activeId,
}: {
  stateOf: (id: string) => NodeState;
  onSelect: (id: string) => void;
  activeId: string | null;
}) {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div className="relative w-full aspect-[16/10] max-w-5xl mx-auto">
      {/* edges */}
      <svg
        viewBox="0 0 100 62.5"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        {EDGES.map(({ from, to }, i) => {
          const a = NODE_BY_ID[from];
          const b = NODE_BY_ID[to];
          if (!a || !b) return null;
          const aState = stateOf(from);
          const bState = stateOf(to);
          const live = aState === "mastered";
          const ay = (a.y / 100) * 62.5;
          const by = (b.y / 100) * 62.5;
          return (
            <motion.line
              key={i}
              x1={a.x}
              y1={ay}
              x2={b.x}
              y2={by}
              stroke={live ? "#5ee0c8" : "rgba(255,255,255,0.14)"}
              strokeWidth={live ? 0.4 : 0.25}
              strokeOpacity={live ? 0.7 : bState === "locked" ? 0.25 : 0.5}
              className={live ? "dash-flow" : ""}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.05 }}
            />
          );
        })}
      </svg>

      {/* nodes */}
      {NODES.map((n, idx) => {
        const st = stateOf(n.id);
        const c = colorFor(n, st);
        const isActive = activeId === n.id;
        const clickable = st !== "locked";
        const showCard = hover === n.id;
        const cardBelow = n.y < 36;
        return (
          <motion.button
            key={n.id}
            onClick={() => clickable && onSelect(n.id)}
            onHoverStart={() => setHover(n.id)}
            onHoverEnd={() => setHover((h) => (h === n.id ? null : h))}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: clickable ? [0, -5, 0] : 0,
            }}
            transition={{
              opacity: { delay: 0.2 + idx * 0.06 },
              scale: { delay: 0.2 + idx * 0.06, type: "spring", stiffness: 220, damping: 16 },
              y: { duration: 5 + (idx % 4), repeat: Infinity, ease: "easeInOut" },
            }}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 group ${
              clickable ? "cursor-pointer" : "cursor-not-allowed"
            }`}
          >
            {/* pulse ring for available */}
            {st === "available" && (
              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full pulse-ring"
                style={{ background: c }}
              />
            )}
            {/* emoji-in-star */}
            <motion.span
              whileHover={clickable ? { scale: 1.25 } : {}}
              className="flex items-center justify-center rounded-full transition-all duration-300"
              style={{
                width: isActive ? 30 : 22,
                height: isActive ? 30 : 22,
                background: c,
                boxShadow: st === "locked" ? "none" : `0 0 26px 3px ${c}`,
                opacity: st === "locked" ? 0.5 : 1,
                fontSize: isActive ? 15 : 11,
              }}
            >
              {st === "mastered" ? (
                <span className="text-ink-900 font-bold text-[11px]">✓</span>
              ) : st === "locked" ? (
                <span className="text-[9px]">🔒</span>
              ) : (
                <span>{n.emoji}</span>
              )}
            </motion.span>

            {/* label */}
            <span
              className={`absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] whitespace-nowrap font-mono text-[13px] tracking-wide transition ${
                st === "locked"
                  ? "text-white/35"
                  : isActive
                    ? "text-white font-semibold"
                    : "text-white/75 group-hover:text-white"
              }`}
            >
              {n.title}
              {n.comingSoon && <span className="text-white/25"> · soon</span>}
            </span>

            {/* hover preview card */}
            <AnimatePresence>
              {showCard && (
                <motion.span
                  initial={{ opacity: 0, y: cardBelow ? -6 : 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute left-1/2 -translate-x-1/2 z-30 w-56 text-left rounded-2xl border bg-ink-800/95 backdrop-blur-xl p-4 shadow-2xl ${
                    cardBelow ? "top-[calc(100%+34px)]" : "bottom-[calc(100%+16px)]"
                  }`}
                  style={{ borderColor: `${c}66` }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-2xl">{st === "locked" ? "🔒" : n.emoji}</span>
                    <span className="font-display text-lg leading-tight" style={{ color: c }}>
                      {n.title}
                    </span>
                  </div>
                  <p className="text-[13px] leading-snug text-white/65 normal-case font-sans tracking-normal">
                    {st === "locked"
                      ? n.comingSoon
                        ? "Charting soon — part of the bigger map."
                        : "Locked. Finish the connected node to unlock this."
                      : n.hook}
                  </p>
                  {clickable && (
                    <div className="mt-2 font-mono text-[11px]" style={{ color: c }}>
                      click to open →
                    </div>
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
