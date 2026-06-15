"use client";

import { useEffect, useRef } from "react";

/**
 * A living deep-space canvas: parallax star layers that react to the cursor,
 * slow drift so it breathes on its own, twinkle, and the occasional comet.
 * Pure canvas, no deps, DPR-aware, and honors prefers-reduced-motion.
 *
 * The CSS aurora + grain layers stay behind/above this for color wash + texture;
 * this owns the stars and the depth.
 */

type Star = {
  x: number; // normalized 0..1
  y: number;
  z: number; // depth 0.15 (far) .. 1 (near)
  r: number; // base radius
  hue: string;
  twSpeed: number;
  twPhase: number;
};

type Comet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0..1 remaining
  len: number;
};

const STAR_TINTS = [
  "255,255,255",
  "255,255,255",
  "255,255,255",
  "200,224,255", // cool blue-white
  "255,228,178", // warm amber-white
  "176,240,228", // cyan
  "210,200,255", // faint violet
];

export default function CosmicField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let comets: Comet[] = [];

    // cursor parallax target + smoothed value
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };

    function build() {
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(W * dpr);
      canvas!.height = Math.floor(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // density scales with area, capped for perf
      const count = Math.min(620, Math.floor((W * H) / 2600));
      stars = new Array(count).fill(0).map(() => {
        const z = Math.pow(Math.random(), 1.6) * 0.85 + 0.15; // bias toward far
        return {
          x: Math.random(),
          y: Math.random(),
          z,
          r: 0.3 + z * 1.7,
          hue: STAR_TINTS[(Math.random() * STAR_TINTS.length) | 0],
          twSpeed: 0.6 + Math.random() * 1.8,
          twPhase: Math.random() * Math.PI * 2,
        };
      });
    }

    function spawnComet() {
      // enter from a random edge-ish point, shoot across
      const fromLeft = Math.random() > 0.5;
      const x = fromLeft ? -0.05 : Math.random() * 0.6;
      const y = Math.random() * 0.5;
      const speed = 0.55 + Math.random() * 0.4;
      const angle = (fromLeft ? 0.18 : 0.32) + Math.random() * 0.12; // gentle downward
      comets.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        len: 0.08 + Math.random() * 0.08,
      });
    }

    let raf = 0;
    let t = 0;
    let last = performance.now();
    let cometTimer = 2 + Math.random() * 4;

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      // ease cursor parallax
      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;

      ctx!.clearRect(0, 0, W, H);

      // slow autonomous drift so it lives without a mouse
      const driftX = Math.sin(t * 0.06) * 14;
      const driftY = Math.cos(t * 0.05) * 10;

      ctx!.globalCompositeOperation = "lighter";
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const px = cur.x * s.z * 42 + driftX * s.z;
        const py = cur.y * s.z * 42 + driftY * s.z;
        const x = s.x * W + px;
        const y = s.y * H + py;
        if (x < -4 || x > W + 4 || y < -4 || y > H + 4) continue;

        const tw = reduce ? 0.85 : 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.twSpeed + s.twPhase));
        const a = (0.35 + s.z * 0.6) * tw;
        const r = s.r;

        // soft glow for the brighter/near stars
        if (s.z > 0.62) {
          const g = ctx!.createRadialGradient(x, y, 0, x, y, r * 5);
          g.addColorStop(0, `rgba(${s.hue},${a * 0.5})`);
          g.addColorStop(1, `rgba(${s.hue},0)`);
          ctx!.fillStyle = g;
          ctx!.beginPath();
          ctx!.arc(x, y, r * 5, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.fillStyle = `rgba(${s.hue},${a})`;
        ctx!.beginPath();
        ctx!.arc(x, y, r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // comets
      if (!reduce) {
        cometTimer -= dt;
        if (cometTimer <= 0 && comets.length < 2) {
          spawnComet();
          cometTimer = 6 + Math.random() * 7;
        }
        for (let i = comets.length - 1; i >= 0; i--) {
          const c = comets[i];
          c.x += c.vx * dt;
          c.y += c.vy * dt;
          c.life -= dt * 0.5;
          if (c.life <= 0 || c.x > 1.1 || c.y > 1.1) {
            comets.splice(i, 1);
            continue;
          }
          const hx = c.x * W;
          const hy = c.y * H;
          const tx = (c.x - c.vx * c.len) * W;
          const ty = (c.y - c.vy * c.len) * H;
          const grad = ctx!.createLinearGradient(tx, ty, hx, hy);
          grad.addColorStop(0, "rgba(180,220,255,0)");
          grad.addColorStop(1, `rgba(210,235,255,${0.7 * c.life})`);
          ctx!.strokeStyle = grad;
          ctx!.lineWidth = 1.6;
          ctx!.lineCap = "round";
          ctx!.beginPath();
          ctx!.moveTo(tx, ty);
          ctx!.lineTo(hx, hy);
          ctx!.stroke();
          // head glow
          const hg = ctx!.createRadialGradient(hx, hy, 0, hx, hy, 6);
          hg.addColorStop(0, `rgba(235,245,255,${0.9 * c.life})`);
          hg.addColorStop(1, "rgba(235,245,255,0)");
          ctx!.fillStyle = hg;
          ctx!.beginPath();
          ctx!.arc(hx, hy, 6, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      ctx!.globalCompositeOperation = "source-over";

      if (!reduce) raf = requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    function onResize() {
      build();
      if (reduce) {
        last = performance.now();
        frame(last);
      }
    }

    build();
    last = performance.now();
    frame(last);
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
