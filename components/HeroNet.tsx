"use client";

import { useEffect, useRef } from "react";
import { cssVar } from "@/lib/cssVar";

interface Node {
  x: number; y: number; vx: number; vy: number; r: number; pulse: number;
}

export function HeroNet() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, DPR = 1;
    let nodes: Node[] = [];
    let raf = 0;                                  // ← hold the rAF id for cleanup
    const mouse = { x: -9999, y: -9999, active: false };
    const LINK = 138;   // node-to-node link distance
    const MOUSE = 200;  // cursor influence radius

    function build() {
      const density = W < 700 ? 16000 : 11000;
      let count = Math.round((W * H) / density);
      count = Math.max(26, Math.min(count, 110)); // cap → keeps the O(n²) cheap
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.6 + 1.0,
        pulse: Math.random() * Math.PI * 2,
      }));
    }

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);     // draw in CSS pixels, crisp on retina
      build();
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      const accent = cssVar("--accent") || "orange";
      const accentH = cssVar("--accent-h") || "62";

      // ---- update: drift, edge-wrap, cursor pull, damping ----
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = W + 20; if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20; if (n.y > H + 20) n.y = -20;
        if (mouse.active) {
          const dx = mouse.x - n.x, dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < MOUSE && d > 0.1) {
            const f = (1 - d / MOUSE) * 0.5;
            n.vx += (dx / d) * f * 0.06;
            n.vy += (dy / d) * f * 0.06;
          }
        }
        n.vx *= 0.985; n.vy *= 0.985;
        if (Math.hypot(n.vx, n.vy) < 0.12) {
          n.vx += (Math.random() - 0.5) * 0.05;
          n.vy += (Math.random() - 0.5) * 0.05;
        }
        n.pulse += 0.02;
      }

      // ---- links between nearby nodes (fade with distance) ----
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `oklch(0.46 0.012 65 / ${(1 - d / LINK) * 0.22})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      // ---- highlighted links from cursor to nearby nodes ----
      if (mouse.active) {
        for (const n of nodes) {
          const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
          if (d < MOUSE) {
            ctx.strokeStyle = `oklch(0.80 0.155 ${accentH} / ${(1 - d / MOUSE) * 0.7})`;
            ctx.lineWidth = 1.1;
            ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(n.x, n.y); ctx.stroke();
          }
        }
      }

      // ---- draw nodes (glow if near cursor) ----
      for (const n of nodes) {
        const near = mouse.active && Math.hypot(mouse.x - n.x, mouse.y - n.y) < MOUSE;
        const glow = 0.55 + Math.sin(n.pulse) * 0.18;
        if (near) { ctx.fillStyle = accent; ctx.shadowColor = accent; ctx.shadowBlur = 10; }
        else { ctx.fillStyle = `oklch(0.62 0.04 65 / ${glow})`; ctx.shadowBlur = 0; }
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;

      if (!reduce) raf = requestAnimationFrame(frame);
    }

    function onMove(e: MouseEvent | TouchEvent) {
      const rect = canvas.getBoundingClientRect();
      const point = "touches" in e ? e.touches[0] : e;
      if (!point) return;
      mouse.x = point.clientX - rect.left;
      mouse.y = point.clientY - rect.top;
      mouse.active = true;
    }
    function onLeave() { mouse.active = false; }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchend", onLeave);
    window.addEventListener("resize", resize);

    resize();
    frame();

    return () => {                                // ⚠️ teardown — the whole point
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchend", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 z-0 h-full w-full" />;
}