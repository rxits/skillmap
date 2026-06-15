"use client";

import { useEffect, useState } from "react";
import { initSound, isSoundOn, setSoundOn } from "@/lib/sound";

export default function SoundToggle({ className = "" }: { className?: string }) {
  const [on, setOn] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initSound();
    setOn(isSoundOn());
    setReady(true);
  }, []);

  function toggle() {
    const next = !on;
    setSoundOn(next);
    setOn(next);
  }

  if (!ready) return null;

  return (
    <button
      onClick={toggle}
      title={on ? "Sound on" : "Sound off"}
      aria-label={on ? "Mute sound" : "Unmute sound"}
      className={`group flex items-center justify-center w-8 h-8 rounded-full border transition ${
        on
          ? "border-signal/40 text-signal hover:bg-signal/10"
          : "border-white/12 text-white/35 hover:text-white/70"
      } ${className}`}
    >
      <span className="text-sm leading-none">{on ? "🔊" : "🔇"}</span>
    </button>
  );
}
