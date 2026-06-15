"use client";

/**
 * Tiny WebAudio chime synth — zero assets. Fires only on deliberate actions
 * (solve, master, level-up, click), so it's delight, not noise. Lazily creates
 * the AudioContext on the first gesture (autoplay-policy safe) and respects a
 * persisted mute flag.
 */

const KEY = "skillmap.sound.v1";
let ctx: AudioContext | null = null;
let enabled = true;

export function initSound() {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(KEY);
  enabled = raw === null ? true : raw === "on";
}

export function isSoundOn(): boolean {
  return enabled;
}

export function setSoundOn(on: boolean) {
  enabled = on;
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, on ? "on" : "off");
  if (on) ping(); // immediate feedback that sound is live
}

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

/** One soft note with an exponential pluck envelope. */
function note(
  freq: number,
  start: number,
  dur: number,
  gain: number,
  type: OscillatorType = "sine"
) {
  const c = ac();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(g);
  g.connect(c.destination);
  const t0 = c.currentTime + start;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function ping() {
  note(880, 0, 0.18, 0.12, "triangle");
}

// Pleasant just-intonation-ish frequencies (A-based).
const N = {
  A4: 440,
  C5: 523.25,
  E5: 659.25,
  G5: 783.99,
  A5: 880,
  C6: 1046.5,
  E6: 1318.5,
};

/** Rising arpeggio — a challenge solved. */
export function playSolve() {
  if (!enabled) return;
  note(N.C5, 0, 0.22, 0.1, "triangle");
  note(N.E5, 0.07, 0.22, 0.1, "triangle");
  note(N.G5, 0.14, 0.28, 0.11, "triangle");
  note(N.C6, 0.21, 0.4, 0.09, "sine");
}

/** Warmer chord bloom — a star mastered. */
export function playMaster() {
  if (!enabled) return;
  note(N.A4, 0, 0.5, 0.08, "sine");
  note(N.E5, 0.02, 0.5, 0.07, "sine");
  note(N.A5, 0.05, 0.55, 0.08, "triangle");
  note(N.C6, 0.12, 0.45, 0.05, "sine");
}

/** Triumphant flourish — a level-up. */
export function playLevel() {
  if (!enabled) return;
  note(N.C5, 0, 0.3, 0.09, "triangle");
  note(N.G5, 0.1, 0.3, 0.09, "triangle");
  note(N.C6, 0.2, 0.35, 0.1, "triangle");
  note(N.E6, 0.3, 0.5, 0.09, "sine");
}

/** Soft blip — a star opened. */
export function playClick() {
  if (!enabled) return;
  note(N.A5, 0, 0.12, 0.05, "sine");
}
