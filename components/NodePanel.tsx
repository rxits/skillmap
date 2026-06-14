"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { SkillNode, NodeState } from "@/lib/types";
import { NODE_BY_ID } from "@/lib/content";
import { Visual } from "./visuals";

export default function NodePanel({
  node,
  state,
  onClose,
  onMaster,
  onJump,
}: {
  node: SkillNode | null;
  state: NodeState;
  onClose: () => void;
  onMaster: (id: string) => void;
  onJump: (id: string) => void;
}) {
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setTouched(false);
  }, [node?.id]);

  return (
    <AnimatePresence>
      {node && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink-900/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed right-0 top-0 z-40 h-full w-[min(620px,100vw)] bg-ink-800/95 backdrop-blur-xl border-l border-white/10 overflow-y-auto thin-scroll"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="kicker text-signal mb-2">
                    {state === "mastered" ? "✓ mastered" : "node"}
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl leading-tight">
                    {node.title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/40 hover:text-white text-2xl leading-none shrink-0"
                >
                  ×
                </button>
              </div>

              {/* 1. Hook */}
              <p className="mt-5 text-lg md:text-xl text-signal-soft font-display leading-snug">
                {node.hook}
              </p>

              {/* 2. The visual */}
              <div className="mt-7">
                <div className="kicker text-white/35 mb-3">▸ see it move</div>
                <div
                  onPointerDown={() => setTouched(true)}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:p-5"
                >
                  <Visual kind={node.visual} />
                </div>
              </div>

              {/* the build prompt */}
              <div className="mt-4 rounded-xl bg-signal/[0.07] border border-signal/20 px-4 py-3">
                <div className="kicker text-signal/80 mb-1">the build</div>
                <p className="text-sm text-white/75 leading-relaxed">{node.build.prompt}</p>
              </div>

              {/* 3. blurb */}
              <div className="mt-7">
                <div className="kicker text-white/35 mb-2">what's really going on</div>
                <p className="text-[15px] text-white/70 leading-relaxed">{node.blurb}</p>
              </div>

              {/* 4. map-in */}
              {node.related.length > 0 && (
                <div className="mt-7">
                  <div className="kicker text-white/35 mb-3">where this sits on the map</div>
                  <div className="flex flex-wrap gap-2">
                    {node.related.map((r) => {
                      const target = NODE_BY_ID[r.to];
                      if (!target) return null;
                      return (
                        <button
                          key={r.to}
                          onClick={() => onJump(r.to)}
                          className="group flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] pl-3 pr-1.5 py-1 hover:border-signal/50 transition"
                        >
                          <span className="font-mono text-[10px] text-white/40">
                            {r.relation}
                          </span>
                          <span className="rounded-full bg-white/8 px-2.5 py-1 text-xs text-white/80 group-hover:text-signal transition">
                            {target.title} →
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* deeper teaser */}
              {node.deeper && node.deeper.length > 0 && (
                <div className="mt-7">
                  <div className="kicker text-white/35 mb-2">go deeper (coming soon)</div>
                  <div className="flex flex-wrap gap-1.5">
                    {node.deeper.map((d) => (
                      <span
                        key={d}
                        className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-white/5 text-white/35"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. unlock */}
              <div className="mt-8 pt-6 border-t border-white/10">
                {state === "mastered" ? (
                  <div className="flex items-center gap-2 text-mastered text-sm font-mono">
                    ✓ {node.build.done}
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => onMaster(node.id)}
                      disabled={!touched}
                      className="w-full rounded-xl bg-signal text-ink-900 font-semibold py-3.5 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-glow transition"
                    >
                      {touched ? "I get it — light up this node ✦" : "↑ try the visual first"}
                    </button>
                    <p className="mt-2 text-center text-[11px] text-white/30 font-mono">
                      completing this unlocks the next stars on the map
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
