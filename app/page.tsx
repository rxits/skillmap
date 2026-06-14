"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TRACKS, NODES } from "@/lib/content";

const STEPS = [
  { n: "01", emoji: "⭐", t: "Pick a star", d: "Every concept is a node on a map you can see end to end." },
  { n: "02", emoji: "🎮", t: "Play with it", d: "Poke a live visual until the idea clicks. No walls of text." },
  { n: "03", emoji: "🛠️", t: "Build the mission", d: "Grab a real assignment + starter repo and ship something." },
];

const CONCEPTS = NODES.filter((n) => !n.comingSoon);

export default function Landing() {
  return (
    <main className="relative z-10 min-h-dvh px-5 md:px-10">
      {/* nav */}
      <header className="flex items-center justify-between pt-7 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <span className="text-signal text-2xl">✦</span>
          <span className="font-display text-2xl tracking-tight">SkillMap</span>
        </div>
        <Link
          href="/learn/ai-engineering"
          className="font-mono text-xs px-5 py-2.5 rounded-full border border-white/15 text-white/70 hover:border-signal/50 hover:text-signal hover:scale-105 transition"
        >
          start learning →
        </Link>
      </header>

      {/* hero */}
      <section className="max-w-4xl mx-auto text-center mt-16 md:mt-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 mb-7"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
          </span>
          <span className="font-mono text-[11px] tracking-widest uppercase text-white/60">
            learn tech the way your brain actually wants to
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-6xl md:text-8xl leading-[0.98] tracking-tight"
        >
          Don't grind theory.
          <br />
          <span className="shimmer-text">See how it connects</span>
          <span className="text-white/90"> — then build.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-7 text-white/60 text-xl leading-relaxed max-w-2xl mx-auto"
        >
          A gamified map of tech, one glowing star at a time. Forget memorizing for-loops
          for four years — see how the pieces fit and start making things today.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/learn/ai-engineering"
            className="rounded-full bg-signal text-ink-900 font-bold text-lg px-8 py-4 shadow-glow hover:scale-105 transition"
          >
            🧠 Start with AI Engineering
          </Link>
          <a
            href="#tracks"
            className="rounded-full border border-white/15 text-white/75 text-lg px-8 py-4 hover:border-white/40 transition"
          >
            browse all tracks
          </a>
        </motion.div>

        {/* concept preview chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-2.5"
        >
          {CONCEPTS.map((c, i) => (
            <motion.span
              key={c.id}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
              className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-mono"
              style={{
                borderColor: `${c.accent ?? "#f5b94d"}55`,
                background: `${c.accent ?? "#f5b94d"}12`,
                color: c.accent ?? "#f5b94d",
              }}
            >
              <span className="text-lg">{c.emoji}</span>
              {c.title}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* how it works */}
      <section className="max-w-5xl mx-auto mt-28 md:mt-36 grid md:grid-cols-3 gap-5">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            whileHover={{ y: -6 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-7"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-5xl">{s.emoji}</span>
              <span className="font-mono text-sm text-white/25">{s.n}</span>
            </div>
            <div className="font-display text-2xl mb-2">{s.t}</div>
            <p className="text-base text-white/55 leading-relaxed">{s.d}</p>
          </motion.div>
        ))}
      </section>

      {/* choose your tech */}
      <section id="tracks" className="max-w-6xl mx-auto mt-28 md:mt-36 scroll-mt-10">
        <div className="text-center mb-12">
          <div className="kicker text-white/40 mb-3">choose your tech</div>
          <h2 className="font-display text-4xl md:text-6xl">What do you want to build?</h2>
          <p className="mt-4 text-white/50 text-lg">
            One track is live. The rest are charting — same format, more galaxies.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRACKS.map((t, i) => {
            const card = (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                whileHover={t.live ? { y: -8, scale: 1.02 } : {}}
                className={`relative h-full rounded-3xl border p-7 overflow-hidden transition ${
                  t.live
                    ? "border-white/15 bg-white/[0.04] cursor-pointer group"
                    : "border-white/8 bg-white/[0.015] cursor-not-allowed"
                }`}
              >
                <div
                  className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl transition"
                  style={{ background: t.accent, opacity: t.live ? 0.35 : 0.08 }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <span className={`text-6xl ${t.live ? "" : "grayscale opacity-50"}`}>
                      {t.emoji}
                    </span>
                    {t.live ? (
                      <span
                        className="font-mono text-[11px] px-2.5 py-1 rounded-full border"
                        style={{ color: t.accent, borderColor: `${t.accent}55`, background: `${t.accent}1a` }}
                      >
                        ● live
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-white/35 border border-white/10">
                        soon
                      </span>
                    )}
                  </div>
                  <div className={`font-display text-3xl mt-5 ${t.live ? "" : "text-white/50"}`}>
                    {t.name}
                  </div>
                  <p className={`mt-2.5 text-base leading-relaxed ${t.live ? "text-white/60" : "text-white/30"}`}>
                    {t.tagline}
                  </p>
                  {t.live && (
                    <div
                      className="mt-6 flex items-center gap-2 font-mono text-sm"
                      style={{ color: t.accent }}
                    >
                      {t.nodeCount} nodes ready
                      <span className="group-hover:translate-x-1.5 transition">→</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
            return t.live ? (
              <Link key={t.id} href={`/learn/${t.id}`} className="block h-full">
                {card}
              </Link>
            ) : (
              <div key={t.id} className="h-full">
                {card}
              </div>
            );
          })}
        </div>
      </section>

      <footer className="max-w-6xl mx-auto mt-32 py-12 border-t border-white/8 text-center">
        <p className="font-mono text-xs text-white/30">
          SkillMap · built for the build-first era ✦
        </p>
      </footer>
    </main>
  );
}
