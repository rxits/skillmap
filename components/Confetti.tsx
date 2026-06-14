"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type P = {
  id: number;
  x: number;
  y: number;
  rot: number;
  color: string;
  delay: number;
  round: boolean;
};

const COLORS = ["#f5b94d", "#5ee0c8", "#7aa2ff", "#f472b6", "#ffffff"];

/** Fires a celebratory burst whenever `trigger` changes to a new truthy value. */
export default function Confetti({ trigger }: { trigger: number }) {
  const [particles, setParticles] = useState<P[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const next: P[] = Array.from({ length: 48 }, (_, i) => ({
      id: trigger * 1000 + i,
      x: (Math.random() - 0.5) * 700,
      y: (Math.random() - 0.5) * 700,
      rot: Math.random() * 540 - 270,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.12,
      round: i % 2 === 0,
    }));
    setParticles(next);
    const t = setTimeout(() => setParticles([]), 1700);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center">
      <div className="relative">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
              animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.rot, scale: 0.4 }}
              transition={{ duration: 1.5, delay: p.delay, ease: [0.2, 0.6, 0.3, 1] }}
              style={{
                position: "absolute",
                width: 9,
                height: 9,
                background: p.color,
                borderRadius: p.round ? "50%" : "2px",
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
