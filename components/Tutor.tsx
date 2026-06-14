"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkillNode } from "@/lib/types";

interface Msg {
  role: "user" | "model";
  text: string;
}

export default function Tutor({ node }: { node: SkillNode | null }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [msgs, busy]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    const next = [...msgs, { role: "user" as const, text }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          nodeTitle: node?.title,
          nodeHook: node?.hook,
          history: msgs.slice(-6),
        }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "model", text: data.reply ?? "…" }]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "model", text: "Connection hiccup — try again in a sec." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const suggestions = node
    ? [`Explain ${node.title} like I'm 5`, `Why does ${node.title} matter?`, "Go deeper"]
    : ["What should I learn first?", "How does this map work?"];

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-signal text-ink-900 font-semibold px-4 py-3 shadow-glow hover:scale-105 transition"
      >
        <span className="text-lg leading-none">✦</span>
        <span className="font-mono text-xs">tutor</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-20 right-5 z-50 w-[min(380px,calc(100vw-2.5rem))] h-[min(520px,70vh)] flex flex-col rounded-2xl bg-ink-800/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div>
                <div className="font-display text-base leading-none">Tutor</div>
                <div className="kicker text-white/35 mt-1">
                  {node ? node.title : "the map"}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/40 hover:text-white text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto thin-scroll px-4 py-4 space-y-3">
              {msgs.length === 0 && (
                <div className="text-sm text-white/45 leading-relaxed">
                  Ask me anything about{" "}
                  <span className="text-signal">{node?.title ?? "AI engineering"}</span>.
                  I keep it plain and short.
                </div>
              )}
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-signal/15 text-signal-soft rounded-br-sm"
                        : "bg-white/5 text-white/80 rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="bg-white/5 rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-white/40"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msgs.length === 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-white/10 text-white/45 hover:text-white/80 hover:border-white/25 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="p-3 border-t border-white/10 flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ask the tutor…"
                className="flex-1 bg-ink-900/70 rounded-xl px-3 py-2 text-sm outline-none border border-white/10 focus:border-signal/50 transition placeholder:text-white/25"
              />
              <button
                type="submit"
                disabled={busy}
                className="rounded-xl bg-signal text-ink-900 px-3.5 font-semibold disabled:opacity-40 transition"
              >
                ↑
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
