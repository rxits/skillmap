"use client";

import { useEffect, useRef } from "react";

/**
 * A living deep-space canvas: parallax star layers that react to the cursor,
 * slow drift so it breathes on its own, twinkle, and the occasional comet.
 *
 * Perf: glow halos are pre-rendered to sprite canvases ONCE and blitted with
 * drawImage (no per-frame gradient allocation). DPR capped at 2, star count
 * capped by area, the loop pauses when the tab is hidden, and reduced-motion
 * renders a single static frame.
 */

type Star = {
  x: number; // normalized 0..1
  y: number;
  z: number; // depth 0.15 (far) .. 1 (near)
  r: number; // base radius
  tint: number; // index into TINTS
  twSpeed: number;
  twPhase: number;
};

type Comet = { x: number; y: number; vx: number; vy: number; life: number; len: number };

const TINTS = [
  [255, 255, 255],
  [255, 255, 255],
  [255, 255, 255],
  [200, 224, 255], // cool blue-white
  [255, 228, 178], // warm amber-white
  [176, 240, 228], // cyan
  [210, 200, 255], // faint violet
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
    const comets: Comet[] = [];

    // Pre-rendered glow sprites, one per tint — built once, blitted every frame.
    const sprites: HTMLCanvasElement[] = TINTS.map(([r, g, b]) => {
      const s = document.createElement("canvas");
      s.width = s.height = 48;
      const sc = s.getContext("2d")!;
      const grad = sc.createRadialGradient(24, 24, 0, 24, 24, 24);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.9)`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},0.25)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      sc.fillStyle = grad;
      sc.fillRect(0, 0, 48, 48);
      return s;
    });
    const whiteGlow = sprites[0];

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };

    function build() {
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(W * dpr);
      canvas!.height = Math.floor(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(560, Math.floor((W * H) / 2900));
      stars = new Array(count).fill(0).map(() => {
        const z = Math.pow(Math.random(), 1.6) * 0.85 + 0.15;
        return {
          x: Math.random(),
          y: Math.random(),
          z,
          r: 0.3 + z * 1.7,
          tint: (Math.random() * TINTS.length) | 0,
          twSpeed: 0.6 + Math.random() * 1.8,
          twPhase: Math.random() * Math.PI * 2,
        };
      });
    }

    function spawnComet() {
      const fromLeft = Math.random() > 0.5;
      const x = fromLeft ? -0.05 : Math.random() * 0.6;
      const y = Math.random() * 0.5;
      const speed = 0.55 + Math.random() * 0.4;
      const angle = (fromLeft ? 0.18 : 0.32) + Math.random() * 0.12;
      comets.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, len: 0.08 + Math.random() * 0.08 });
    }

    let raf = 0;
    let t = 0;
    let last = performance.now();
    let cometTimer = 2 + Math.random() * 4;
    let running = false;

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;

      ctx!.clearRect(0, 0, W, H);
      ctx!.globalCompositeOperation = "lighter";

      const driftX = Math.sin(t * 0.06) * 14;
      const driftY = Math.cos(t * 0.05) * 10;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const px = cur.x * s.z * 42 + driftX * s.z;
        const py = cur.y * s.z * 42 + driftY * s.z;
        const x = s.x * W + px;
        const y = s.y * H + py;
        if (x < -8 || x > W + 8 || y < -8 || y > H + 8) continue;

        const tw = reduce ? 0.85 : 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.twSpeed + s.twPhase));
        const a = (0.35 + s.z * 0.6) * tw;

        if (s.z > 0.55) {
          const R = s.r * 5;
          ctx!.globalAlpha = a * 0.6;
          ctx!.drawImage(sprites[s.tint], x - R, y - R, R * 2, R * 2);
        }
        ctx!.globalAlpha = a;
        const [r, g, b] = TINTS[s.tint];
        ctx!.fillStyle = `rgb(${r},${g},${b})`;
        ctx!.beginPath();
        ctx!.arc(x, y, s.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

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
          const R = 7;
          ctx!.globalAlpha = 0.9 * c.life;
          ctx!.drawImage(whiteGlow, hx - R, hy - R, R * 2, R * 2);
          ctx!.globalAlpha = 1;
        }
      }
      ctx!.globalCompositeOperation = "source-over";

      if (!reduce && running) raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function onMove(e: PointerEvent) {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    function onResize() {
      build();
      if (reduce) frame(performance.now());
    }
    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    build();
    if (reduce) {
      frame(performance.now());
    } else {
      start();
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
    }
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
