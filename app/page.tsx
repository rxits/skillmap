"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import MapCanvas from "@/components/MapCanvas";
import NodePanel from "@/components/NodePanel";
import Tutor from "@/components/Tutor";
import { NODE_BY_ID } from "@/lib/content";
import {
  loadProgress,
  saveProgress,
  stateFor,
  xpFor,
  TOTAL_AUTHORED,
} from "@/lib/progress";

export default function Home() {
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMastered(new Set(loadProgress().mastered));
    setHydrated(true);
  }, []);

  const stateOf = useCallback(
    (id: string) => stateFor(id, mastered),
    [mastered]
  );

  const persist = useCallback((set: Set<string>) => {
    saveProgress({ mastered: Array.from(set) });
  }, []);

  function master(id: string) {
    setMastered((prev) => {
      const next = new Set(prev);
      next.add(id);
      persist(next);
      return next;
    });
  }

  function reset() {
    const empty = new Set<string>();
    setMastered(empty);
    persist(empty);
    setActiveId(null);
  }

  const xp = useMemo(() => xpFor(mastered), [mastered]);
  const doneCount = useMemo(
    () => Array.from(mastered).filter((id) => NODE_BY_ID[id] && !NODE_BY_ID[id].comingSoon).length,
    [mastered]
  );

  const activeNode = activeId ? NODE_BY_ID[activeId] : null;

  return (
    <main className="relative z-10 min-h-dvh px-5 md:px-10 pb-24">
      {/* top bar */}
      <header className="flex items-center justify-between pt-7 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <span className="text-signal text-xl">✦</span>
          <span className="font-display text-xl tracking-tight">SkillMap</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="font-mono text-[10px] text-white/35 uppercase tracking-widest">xp</div>
            <motion.div
              key={xp}
              initial={{ scale: 1.4, color: "#f5b94d" }}
              animate={{ scale: 1, color: "#e7ecf5" }}
              className="font-display text-lg leading-none"
            >
              {xp}
            </motion.div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] text-white/35 uppercase tracking-widest">mastered</div>
            <div className="font-display text-lg leading-none">
              {doneCount}<span className="text-white/30">/{TOTAL_AUTHORED}</span>
            </div>
          </div>
          {doneCount > 0 && (
            <button
              onClick={reset}
              className="font-mono text-[10px] text-white/30 hover:text-white/70 border border-white/10 rounded-full px-2.5 py-1 transition"
            >
              reset
            </button>
          )}
        </div>
      </header>

      {/* hero */}
      <section className="max-w-3xl mx-auto text-center mt-10 md:mt-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="kicker text-signal/80 mb-4"
        >
          the map of ai engineering
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight"
        >
          Don't grind theory.
          <br />
          <span className="text-signal">See how it connects</span> — then build.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-5 text-white/55 text-base md:text-lg leading-relaxed max-w-xl mx-auto"
        >
          Every concept is a star. Click one, watch it move, poke the visual until
          it clicks — then light it up and unlock what's next.
        </motion.p>
      </section>

      {/* the map */}
      <section className="mt-8 md:mt-12">
        {hydrated && (
          <MapCanvas stateOf={stateOf} onSelect={setActiveId} activeId={activeId} />
        )}
      </section>

      {/* legend */}
      <div className="flex items-center justify-center gap-5 mt-6 font-mono text-[11px] text-white/45">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-signal shadow-glow" /> available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-mastered shadow-glow-cyan" /> mastered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-locked" /> locked
        </span>
      </div>

      <NodePanel
        node={activeNode}
        state={activeNode ? stateOf(activeNode.id) : "locked"}
        onClose={() => setActiveId(null)}
        onMaster={master}
        onJump={(id) => {
          if (stateOf(id) !== "locked") setActiveId(id);
        }}
      />

      <Tutor node={activeNode} />
    </main>
  );
}
