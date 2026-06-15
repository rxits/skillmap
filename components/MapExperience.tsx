"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import MapCanvas from "@/components/MapCanvas";
import NodePanel from "@/components/NodePanel";
import Tutor from "@/components/Tutor";
import Confetti from "@/components/Confetti";
import SoundToggle from "@/components/SoundToggle";
import { initSound, playClick, playMaster, playLevel } from "@/lib/sound";
import { NODE_BY_ID, TRACK_BY_ID } from "@/lib/content";
import {
  loadProgress,
  saveProgress,
  stateFor,
  xpFor,
  levelFor,
  TOTAL_AUTHORED,
} from "@/lib/progress";

export default function MapExperience({ trackId }: { trackId: string }) {
  const track = TRACK_BY_ID[trackId];
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [confetti, setConfetti] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [burst, setBurst] = useState<{ id: string; n: number } | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const burstN = useRef(0);

  useEffect(() => {
    setMastered(new Set(loadProgress().mastered));
    setHydrated(true);
    initSound();
    if (typeof window !== "undefined" && !sessionStorage.getItem("skillmap.intro.v1")) {
      setShowIntro(true);
      sessionStorage.setItem("skillmap.intro.v1", "1");
      const t = setTimeout(() => setShowIntro(false), 2200);
      return () => clearTimeout(t);
    }
  }, []);

  const select = useCallback((id: string) => {
    playClick();
    setActiveId(id);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const stateOf = useCallback((id: string) => stateFor(id, mastered), [mastered]);

  function master(id: string, opts?: { celebrate?: boolean; silent?: boolean }) {
    const celebrate = opts?.celebrate !== false;
    const node = NODE_BY_ID[id];
    const gain = node?.parent ? 50 : 100;
    const before = levelFor(xpFor(mastered));
    setMastered((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveProgress({ mastered: Array.from(next) });
      const after = levelFor(xpFor(next));
      const leveledUp = after.index > before.index;
      if (celebrate && leveledUp) {
        setToast(`Level up! ${after.emoji} You're a ${after.title} now`);
        playLevel();
      } else if (celebrate) {
        setToast(`+${gain} XP ✦`);
        if (!opts?.silent) playMaster();
      } else {
        setToast(`+${gain} XP · skipped the challenge`);
      }
      return next;
    });
    if (celebrate) {
      setConfetti((c) => c + 1);
      burstN.current += 1;
      setBurst({ id, n: burstN.current });
    }
  }

  function reset() {
    const empty = new Set<string>();
    setMastered(empty);
    saveProgress({ mastered: [] });
    setActiveId(null);
  }

  const xp = useMemo(() => xpFor(mastered), [mastered]);
  const level = useMemo(() => levelFor(xp), [xp]);
  const doneCount = useMemo(
    () =>
      Array.from(mastered).filter((id) => NODE_BY_ID[id] && !NODE_BY_ID[id].comingSoon && !NODE_BY_ID[id].parent)
        .length,
    [mastered]
  );

  const activeNode = activeId ? NODE_BY_ID[activeId] : null;

  return (
    <main className="relative z-10 min-h-dvh px-5 md:px-10 pb-24">
      <Confetti trigger={confetti} />

      {/* cinematic warp-in — once per session */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="warp-intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            onClick={() => setShowIntro(false)}
            className="fixed inset-0 z-[80] flex items-center justify-center cursor-pointer"
            style={{ background: "radial-gradient(120% 100% at 50% 50%, #0a0e1c 35%, #04060f 100%)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="text-center px-6"
            >
              <div className="kicker text-signal/80 mb-4">⟢ entering</div>
              <div className="font-display text-4xl md:text-7xl leading-[1.02] shimmer-text">
                {track ? track.name : "the galaxy"}
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 1.1 }}
                className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-signal to-transparent"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* xp / level-up toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.9 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[70] rounded-full bg-signal text-ink-900 font-semibold px-5 py-2.5 shadow-glow font-display"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* top bar */}
      <header className="flex items-center justify-between pt-7 max-w-6xl mx-auto gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-signal text-xl group-hover:scale-110 transition">✦</span>
          <span className="font-display text-xl tracking-tight">SkillMap</span>
          <span className="hidden sm:inline font-mono text-[10px] text-white/30 ml-1 group-hover:text-white/60 transition">
            ← all tracks
          </span>
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
          {/* level */}
          <div className="hidden sm:flex items-center gap-2.5">
            <span className="text-xl">{level.emoji}</span>
            <div className="w-28">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-white/55">{level.title}</span>
                <span className="font-mono text-[10px] text-white/30">{xp} xp</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/8 overflow-hidden mt-1">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-signal-deep to-signal"
                  animate={{ width: `${level.progress * 100}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 24 }}
                />
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] text-white/35 uppercase tracking-widest">mastered</div>
            <div className="font-display text-lg leading-none">
              {doneCount}
              <span className="text-white/30">/{TOTAL_AUTHORED}</span>
            </div>
          </div>
          <SoundToggle />
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
      <section className="max-w-3xl mx-auto text-center mt-10 md:mt-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="kicker text-signal/80 mb-4"
        >
          {track ? `${track.emoji} ${track.name}` : "the map of ai engineering"}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-5xl md:text-6xl leading-[1.02] tracking-tight"
        >
          Pick a star. <span className="shimmer-text">Light it up.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-5 text-white/60 text-lg leading-relaxed max-w-xl mx-auto"
        >
          Click a concept, poke the visual until it clicks, grab the mission, then build.
          No lectures. No 4-year detour. Hover a star to peek inside.
        </motion.p>
      </section>

      {/* the map */}
      <section className="mt-8 md:mt-10">
        {hydrated && (
          <MapCanvas stateOf={stateOf} onSelect={select} activeId={activeId} burst={burst} />
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
