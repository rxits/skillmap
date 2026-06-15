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
  burst,
}: {
  stateOf: (id: string) => NodeState;
  onSelect: (id: string) => void;
  activeId: string | null;
  burst?: { id: string; n: number } | null;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const anyActive = activeId !== null;
  const burstNode = burst ? NODE_BY_ID[burst.id] : null;
  const burstColor = burstNode?.accent ?? "#5ee0c8";

  return (
    <div className="relative w-full aspect-[5/6] sm:aspect-[16/10] max-w-5xl mx-auto">
      {/* warp layer: the whole galaxy leans in when you dive into a star */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: anyActive ? 1.09 : 1, x: anyActive ? "-3%" : "0%" }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
        style={{ transformOrigin: "center" }}
      >
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
            const path = `M${a.x},${ay} L${b.x},${by}`;
            return (
              <g key={i}>
                <motion.line
                  x1={a.x}
                  y1={ay}
                  x2={b.x}
                  y2={by}
                  stroke={live ? "#5ee0c8" : "rgba(255,255,255,0.14)"}
                  strokeWidth={live ? 0.4 : 0.25}
                  strokeOpacity={live ? 0.7 : bState === "locked" ? 0.22 : 0.5}
                  className={live ? "dash-flow" : ""}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                />
                {/* energy packet: light flowing from a mastered star into the next */}
                {live && (
                  <>
                    <circle r={1.4} fill="#5ee0c8" opacity={0.25}>
                      <animateMotion
                        dur="2.1s"
                        begin={`${i * 0.35}s`}
                        repeatCount="indefinite"
                        path={path}
                        keyPoints="0;1"
                        keyTimes="0;1"
                        calcMode="linear"
                      />
                    </circle>
                    <circle r={0.6} fill="#d6fff5">
                      <animateMotion
                        dur="2.1s"
                        begin={`${i * 0.35}s`}
                        repeatCount="indefinite"
                        path={path}
                      />
                    </circle>
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* master shockwave — twin rings blast out from the lit star */}
        {burstNode && (
          <div
            key={burst!.n}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${burstNode.x}%`, top: `${burstNode.y}%` }}
          >
            {[0, 0.18].map((delay, k) => (
              <motion.span
                key={k}
                initial={{ opacity: 0.65, scale: 0 }}
                animate={{ opacity: 0, scale: 1 }}
                transition={{ duration: 1.2, delay, ease: "easeOut" }}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ width: 230, height: 230, border: `2px solid ${burstColor}` }}
              />
            ))}
          </div>
        )}

        {/* nodes */}
        {NODES.map((n, idx) => {
          const st = stateOf(n.id);
          const c = colorFor(n, st);
          const isActive = activeId === n.id;
          const clickable = st !== "locked";
          const showCard = hover === n.id;
          const cardBelow = n.y < 36;
          const dimmed = anyActive && !isActive;
          return (
            <motion.button
              key={n.id}
              onClick={() => clickable && onSelect(n.id)}
              onHoverStart={() => setHover(n.id)}
              onHoverEnd={() => setHover((h) => (h === n.id ? null : h))}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{
                opacity: dimmed ? 0.32 : 1,
                scale: 1,
                y: clickable ? [0, -5, 0] : 0,
              }}
              transition={{
                opacity: { delay: anyActive ? 0 : 0.2 + idx * 0.06, duration: 0.4 },
                scale: { delay: 0.2 + idx * 0.06, type: "spring", stiffness: 220, damping: 16 },
                y: { duration: 5 + (idx % 4), repeat: Infinity, ease: "easeInOut" },
              }}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 group ${
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
              {/* orbital ring on the star you're diving into */}
              {isActive && (
                <span
                  className="orbit-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: 52,
                    height: 52,
                    border: `1px solid ${c}55`,
                  }}
                >
                  <span
                    className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ background: c, boxShadow: `0 0 8px 1px ${c}` }}
                  />
                </span>
              )}
              {/* emoji-in-star */}
              <motion.span
                whileHover={clickable ? { scale: 1.25 } : {}}
                animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                className="relative flex items-center justify-center rounded-full transition-all duration-300"
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
                className={`absolute left-1/2 -translate-x-1/2 top-[calc(100%+2px)] whitespace-nowrap font-mono text-[10px] sm:text-[13px] tracking-wide transition ${
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
                {showCard && !anyActive && (
                  <motion.span
                    initial={{ opacity: 0, y: cardBelow ? -6 : 6, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute left-1/2 -translate-x-1/2 z-30 w-[min(14rem,80vw)] text-left rounded-2xl border bg-ink-800/95 backdrop-blur-xl p-4 shadow-2xl ${
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
                        click to dive in →
                      </div>
                    )}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
