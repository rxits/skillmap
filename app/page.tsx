"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TRACKS } from "@/lib/content";

const STEPS = [
  { n: "01", emoji: "⭐", t: "Pick a star", d: "Every concept is a node on a map you can see end to end." },
  { n: "02", emoji: "🎮", t: "Play with it", d: "Poke a live visual until the idea actually clicks. No walls of text." },
  { n: "03", emoji: "🛠️", t: "Build the mission", d: "Grab a real assignment + starter repo and ship something." },
];

export default function Landing() {
  return (
    <main className="relative z-10 min-h-dvh px-5 md:px-10">
      {/* nav */}
      <header className="flex items-center justify-between pt-7 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <span className="text-signal text-xl">✦</span>
          <span className="font-display text-xl tracking-tight">SkillMap</span>
        </div>
        <Link
          href="/learn/ai-engineering"
          className="font-mono text-[11px] px-4 py-2 rounded-full border border-white/15 text-white/70 hover:border-signal/50 hover:text-signal transition"
        >
          start learning →
        </Link>
      </header>

      {/* hero */}
      <section className="max-w-4xl mx-auto text-center mt-16 md:mt-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="kicker text-signal/80 mb-5"
        >
          learn tech the way your brain actually wants to
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-5xl md:text-7xl leading-[1.02] tracking-tight"
        >
          Don't grind theory.
          <br />
          <span className="text-signal">See how it connects</span>
          <span className="text-white/90"> — then build.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-6 text-white/55 text-lg leading-relaxed max-w-xl mx-auto"
        >
          A gamified map of tech, one star at a time. Forget memorizing for-loops for
          four years — understand how the pieces fit and start making things today.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mt-9 flex items-center justify-center gap-3"
        >
          <Link
            href="/learn/ai-engineering"
            className="rounded-full bg-signal text-ink-900 font-semibold px-7 py-3.5 shadow-glow hover:scale-105 transition"
          >
            🧠 Start with AI Engineering
          </Link>
        </motion.div>
      </section>

      {/* how it works */}
      <section className="max-w-5xl mx-auto mt-24 md:mt-32 grid md:grid-cols-3 gap-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{s.emoji}</span>
              <span className="font-mono text-xs text-white/25">{s.n}</span>
            </div>
            <div className="font-display text-xl mb-1.5">{s.t}</div>
            <p className="text-sm text-white/50 leading-relaxed">{s.d}</p>
          </motion.div>
        ))}
      </section>

      {/* choose your tech */}
      <section className="max-w-5xl mx-auto mt-24 md:mt-32">
        <div className="text-center mb-10">
          <div className="kicker text-white/35 mb-3">choose your tech</div>
          <h2 className="font-display text-3xl md:text-4xl">What do you want to build?</h2>
          <p className="mt-3 text-white/45 text-sm">
            One track is live. The rest are charting — same format, more galaxies.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRACKS.map((t, i) => {
            const card = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`relative h-full rounded-2xl border p-6 overflow-hidden transition ${
                  t.live
                    ? "border-white/15 bg-white/[0.03] hover:border-signal/50 cursor-pointer group"
                    : "border-white/8 bg-white/[0.015] cursor-not-allowed"
                }`}
                style={
                  t.live
                    ? { boxShadow: `0 0 0 0 ${t.accent}` }
                    : undefined
                }
              >
                {t.live && (
                  <div
                    className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition"
                    style={{ background: t.accent }}
                  />
                )}
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <span className={`text-4xl ${t.live ? "" : "grayscale opacity-50"}`}>
                      {t.emoji}
                    </span>
                    {t.live ? (
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-signal/15 text-signal border border-signal/30">
                        live
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/35 border border-white/10">
                        soon
                      </span>
                    )}
                  </div>
                  <div className={`font-display text-2xl mt-4 ${t.live ? "" : "text-white/50"}`}>
                    {t.name}
                  </div>
                  <p className={`mt-2 text-sm leading-relaxed ${t.live ? "text-white/55" : "text-white/30"}`}>
                    {t.tagline}
                  </p>
                  {t.live && (
                    <div className="mt-5 flex items-center gap-2 font-mono text-xs text-signal">
                      {t.nodeCount} nodes ready
                      <span className="group-hover:translate-x-1 transition">→</span>
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

      <footer className="max-w-5xl mx-auto mt-28 py-10 border-t border-white/8 text-center">
        <p className="font-mono text-[11px] text-white/30">
          SkillMap · built for the build-first era ✦
        </p>
      </footer>
    </main>
  );
}
