"use client";

import { motion } from "framer-motion";
import { NODES, EDGES, NODE_BY_ID } from "@/lib/content";
import { NodeState } from "@/lib/types";

const COLOR: Record<NodeState, string> = {
  mastered: "#5ee0c8",
  available: "#f5b94d",
  locked: "#566080",
};

export default function MapCanvas({
  stateOf,
  onSelect,
  activeId,
}: {
  stateOf: (id: string) => NodeState;
  onSelect: (id: string) => void;
  activeId: string | null;
}) {
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
          const bState = stateOf(to);
          const aState = stateOf(from);
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
              stroke={live ? "#5ee0c8" : "rgba(255,255,255,0.12)"}
              strokeWidth={live ? 0.35 : 0.22}
              strokeOpacity={live ? 0.6 : bState === "locked" ? 0.25 : 0.5}
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
        const c = COLOR[st];
        const isActive = activeId === n.id;
        const clickable = st !== "locked";
        return (
          <motion.button
            key={n.id}
            onClick={() => clickable && onSelect(n.id)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + idx * 0.07, type: "spring", stiffness: 220, damping: 18 }}
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 group ${
              clickable ? "cursor-pointer" : "cursor-not-allowed"
            }`}
          >
            {/* pulse ring for available */}
            {st === "available" && (
              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full pulse-ring"
                style={{ background: c }}
              />
            )}
            {/* star */}
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: isActive ? 20 : 14,
                height: isActive ? 20 : 14,
                background: c,
                boxShadow: st === "locked" ? "none" : `0 0 18px 2px ${c}`,
                opacity: st === "locked" ? 0.55 : 1,
              }}
            />
            {/* mastered check */}
            {st === "mastered" && (
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-ink-900 text-[9px] font-bold">
                ✓
              </span>
            )}
            {/* label */}
            <span
              className={`absolute left-1/2 -translate-x-1/2 top-[calc(100%+6px)] whitespace-nowrap font-mono text-[10px] tracking-wide transition ${
                st === "locked"
                  ? "text-white/30"
                  : isActive
                    ? "text-white"
                    : "text-white/65 group-hover:text-white"
              }`}
            >
              {n.title}
              {n.comingSoon && <span className="text-white/20"> · soon</span>}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
