"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { SkillNode, NodeState, RefKind, Challenge } from "@/lib/types";
import { NODE_BY_ID, childrenOf } from "@/lib/content";
import { Visual } from "./visuals";

const REF_ICON: Record<RefKind, string> = {
  video: "🎬",
  docs: "📄",
  article: "📰",
  repo: "🐙",
  paper: "📜",
};

const DIFF: Record<string, { label: string; cls: string }> = {
  "warm-up": { label: "warm-up", cls: "text-mastered border-mastered/40 bg-mastered/10" },
  real: { label: "real one", cls: "text-signal border-signal/40 bg-signal/10" },
  spicy: { label: "spicy 🌶️", cls: "text-pink-300 border-pink-400/40 bg-pink-400/10" },
};

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
  onMaster: (id: string, opts?: { celebrate?: boolean }) => void;
  onJump: (id: string) => void;
}) {
  const [touched, setTouched] = useState(false);
  const [nerd, setNerd] = useState(false);
  const [solved, setSolved] = useState(false);
  const [status, setStatus] = useState("");
  const [showHint, setShowHint] = useState(false);
  const solvedRef = useRef(false);

  useEffect(() => {
    setTouched(false);
    setNerd(false);
    setSolved(false);
    setStatus("");
    setShowHint(false);
    solvedRef.current = false;
  }, [node?.id]);

  const handleSolved = useCallback(() => {
    if (solvedRef.current) return;
    solvedRef.current = true;
    setSolved(true);
    if (node && state !== "mastered") onMaster(node.id, { celebrate: true });
  }, [node, state, onMaster]);

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
            className="fixed right-0 top-0 z-40 h-full w-[min(640px,100vw)] bg-ink-800/95 backdrop-blur-xl border-l border-white/10 overflow-y-auto thin-scroll"
          >
            <div className="p-6 md:p-8">
              {/* colorful banner header */}
              <div
                className="relative -mx-6 md:-mx-8 -mt-6 md:-mt-8 px-6 md:px-8 pt-9 pb-7 overflow-hidden"
                style={{
                  background: `radial-gradient(120% 140% at 0% 0%, ${
                    node.accent ?? "#f5b94d"
                  }38, transparent 65%)`,
                }}
              >
                <span
                  className="pointer-events-none absolute -right-2 -top-3 text-[130px] leading-none opacity-25 float-slow select-none"
                  aria-hidden
                >
                  {node.emoji ?? "✦"}
                </span>
                <button
                  onClick={onClose}
                  className="absolute right-5 top-5 text-white/60 hover:text-white text-3xl leading-none"
                >
                  ×
                </button>
                <div
                  className="kicker mb-2.5"
                  style={{ color: node.accent ?? "#f5b94d" }}
                >
                  {state === "mastered"
                    ? "✓ mastered"
                    : node.parent
                      ? `deep dive · ${NODE_BY_ID[node.parent]?.title ?? "node"}`
                      : "concept"}
                </div>
                <h2 className="relative font-display text-4xl md:text-5xl leading-[1.05]">
                  {node.title}
                </h2>
                <p className="relative mt-4 text-xl md:text-2xl font-display leading-snug text-white/90 max-w-lg">
                  {node.hook}
                </p>
              </div>

              {/* the challenge / play with it */}
              <div className="mt-7">
                {node.challenge ? (
                  <ChallengeBar
                    challenge={node.challenge}
                    status={status}
                    solved={solved || state === "mastered"}
                    showHint={showHint}
                    onToggleHint={() => setShowHint((h) => !h)}
                  />
                ) : (
                  <div className="kicker text-white/35 mb-3">🎮 play with it</div>
                )}
                <div
                  key={node.id}
                  onPointerDown={() => setTouched(true)}
                  onClick={() => setTouched(true)}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:p-5"
                >
                  <Visual
                    kind={node.visual}
                    challenge={node.challenge}
                    onStatus={setStatus}
                    onSolved={handleSolved}
                  />
                </div>
              </div>

              {!node.challenge && (
                <div className="mt-4 rounded-xl bg-signal/[0.07] border border-signal/20 px-4 py-3.5">
                  <p className="text-base text-white/80 leading-relaxed">{node.build.prompt}</p>
                </div>
              )}

              {/* watch — embedded video */}
              {node.video && (
                <div className="mt-7">
                  <div className="kicker text-white/35 mb-3">🎬 watch (2 min in)</div>
                  <div
                    className="relative rounded-2xl overflow-hidden border aspect-video"
                    style={{ borderColor: `${node.accent ?? "#f5b94d"}44` }}
                  >
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube-nocookie.com/embed/${node.video}`}
                      title={`${node.title} video`}
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* your mission */}
              {node.mission && (
                <div className="mt-7">
                  <div className="flex items-center justify-between mb-3">
                    <div className="kicker text-white/35">🎯 your mission</div>
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${
                        DIFF[node.mission.level]?.cls ?? ""
                      }`}
                    >
                      {DIFF[node.mission.level]?.label ?? node.mission.level}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-gradient-to-br from-white/[0.05] to-transparent p-5">
                    <p className="text-lg text-white/90 leading-relaxed">
                      {node.mission.task}
                    </p>
                    {node.mission.repos.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="kicker text-white/30">steal a starter</div>
                        {node.mission.repos.map((r) => (
                          <a
                            key={r.url}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 rounded-xl border border-white/10 bg-ink-900/50 px-3 py-2.5 hover:border-signal/50 hover:bg-signal/[0.05] transition"
                          >
                            <span className="text-lg">🐙</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-mono text-xs text-white/85 truncate">
                                {r.label}
                              </div>
                              {r.note && (
                                <div className="text-[11px] text-white/40 truncate">{r.note}</div>
                              )}
                            </div>
                            <span className="font-mono text-[10px] text-white/30 group-hover:text-signal transition">
                              open ↗
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* go deeper — zoom in */}
              {(() => {
                const kids = childrenOf(node.id);
                if (kids.length === 0) return null;
                return (
                  <div className="mt-7">
                    <div className="kicker text-white/35 mb-3">🔍 go deeper — zoom in</div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {kids.map((kid) => {
                        const live = !kid.comingSoon;
                        return (
                          <button
                            key={kid.id}
                            onClick={() => live && onJump(kid.id)}
                            disabled={!live}
                            className={`text-left rounded-xl border px-3.5 py-3 transition ${
                              live
                                ? "border-white/12 bg-white/[0.03] hover:border-signal/50 hover:bg-signal/[0.05] cursor-pointer"
                                : "border-white/8 bg-white/[0.02] opacity-50 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-white/85">
                                {kid.emoji} {kid.title}
                              </span>
                              <span className="font-mono text-[10px] text-white/35">
                                {live ? "+50 xp →" : "soon"}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* nerd mode — the theory, hidden by default to keep it light */}
              {node.blurb && (
                <div className="mt-7">
                  <button
                    onClick={() => setNerd((n) => !n)}
                    className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 hover:border-white/25 transition"
                  >
                    <span className="kicker text-white/55">🤓 nerd mode — what's really going on</span>
                    <motion.span animate={{ rotate: nerd ? 180 : 0 }} className="text-white/40">
                      ▾
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {nerd && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-base text-white/75 leading-relaxed px-1 pt-4">
                          {node.blurb}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* learn more */}
              {node.references && node.references.length > 0 && (
                <div className="mt-7">
                  <div className="kicker text-white/35 mb-3">📚 learn more</div>
                  <div className="space-y-1.5">
                    {node.references.map((ref) => (
                      <a
                        key={ref.url}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/[0.04] transition"
                      >
                        <span className="text-base">{REF_ICON[ref.kind]}</span>
                        <span className="flex-1 text-sm text-white/70 group-hover:text-white transition">
                          {ref.label}
                        </span>
                        <span className="font-mono text-[10px] text-white/25 group-hover:text-signal transition">
                          ↗
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* map-in */}
              {node.related.length > 0 && (
                <div className="mt-7">
                  <div className="kicker text-white/35 mb-3">🧭 where this sits</div>
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
                          <span className="font-mono text-[10px] text-white/40">{r.relation}</span>
                          <span className="rounded-full bg-white/8 px-2.5 py-1 text-xs text-white/80 group-hover:text-signal transition">
                            {target.emoji} {target.title} →
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* unlock */}
              <div className="mt-8 pt-6 border-t border-white/10">
                {state === "mastered" ? (
                  <div className="flex items-center gap-2 text-mastered text-sm font-mono">
                    ✓ {node.challenge && solved ? node.challenge.solved : node.build.done}
                  </div>
                ) : node.challenge ? (
                  <>
                    <div className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 text-center text-sm font-mono text-white/45">
                      ↑ solve the challenge to light it up
                    </div>
                    <button
                      onClick={() => onMaster(node.id, { celebrate: false })}
                      className="mt-2.5 mx-auto block font-mono text-[11px] text-white/30 hover:text-white/65 transition"
                    >
                      skip — I&apos;m just exploring →
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onMaster(node.id)}
                      disabled={!touched}
                      className="w-full rounded-xl bg-signal text-ink-900 font-semibold py-3.5 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-glow transition"
                    >
                      {touched ? "I get it — light it up ✦" : "↑ play with it first"}
                    </button>
                    <p className="mt-2 text-center text-[11px] text-white/30 font-mono">
                      {node.parent ? "+50 xp · deep dive" : "lights this star + unlocks the next ones"}
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

function ChallengeBar({
  challenge,
  status,
  solved,
  showHint,
  onToggleHint,
}: {
  challenge: Challenge;
  status: string;
  solved: boolean;
  showHint: boolean;
  onToggleHint: () => void;
}) {
  return (
    <motion.div
      animate={{
        borderColor: solved ? "rgba(94,224,200,0.5)" : "rgba(245,185,77,0.32)",
        backgroundColor: solved ? "rgba(94,224,200,0.08)" : "rgba(245,185,77,0.06)",
      }}
      className="mb-3 rounded-2xl border p-4"
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span
          className="kicker font-semibold"
          style={{ color: solved ? "#5ee0c8" : "#f5b94d" }}
        >
          {solved ? "✓ solved" : "🎯 challenge"}
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={status}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.18 }}
            className={`font-mono text-[11px] px-2.5 py-1 rounded-full border whitespace-nowrap ${
              solved
                ? "text-mastered border-mastered/40 bg-mastered/10"
                : "text-white/65 border-white/15 bg-white/5"
            }`}
          >
            {status || "make a move…"}
          </motion.span>
        </AnimatePresence>
      </div>
      <p className="font-display text-lg md:text-xl leading-snug text-white/90">
        {solved ? challenge.solved : challenge.goal}
      </p>
      {challenge.hint && !solved && (
        <div className="mt-2">
          <button
            onClick={onToggleHint}
            className="font-mono text-[11px] text-white/40 hover:text-white/70 transition"
          >
            {showHint ? "× hide hint" : "stuck? show hint"}
          </button>
          <AnimatePresence initial={false}>
            {showHint && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden text-sm text-white/55 leading-relaxed mt-1.5"
              >
                💡 {challenge.hint}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
