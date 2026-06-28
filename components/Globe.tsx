"use client";

import { useEffect, useRef } from "react";
import { cssVar } from "@/lib/cssVar";

interface Region { lat: number; lon: number; name: string; }
interface Vec3 { x: number; y: number; z: number; }
interface Projected { sx: number; sy: number; z: number; scale: number; }

// approximate AWS-region coordinates (lat, lon)
const REGIONS: Region[] = [
  { lat: 39, lon: -77, name: "us-east-1" },
  { lat: 45, lon: -119, name: "us-west-2" },
  { lat: 53, lon: -8, name: "eu-west-1" },
  { lat: 50, lon: 8, name: "eu-central-1" },
  { lat: 1.3, lon: 103, name: "ap-southeast-1" },
  { lat: 35, lon: 139, name: "ap-northeast-1" },
  { lat: -33, lon: 151, name: "ap-southeast-2" },
  { lat: -23, lon: -46, name: "sa-east-1" },
  { lat: 19, lon: 72, name: "ap-south-1" },
];
// traffic arcs between region indices
const ARCS: [number, number][] = [[0, 2], [0, 1], [1, 5], [2, 3], [4, 5], [0, 7], [3, 8], [4, 6]];

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, R = 0, CX = 0, CY = 0, DPR = 1;
    let rotX = -0.35, rotY = 0.6, velX = 0, velY = 0.003;
    let dragging = false, lastX = 0, lastY = 0, lastT = 0;
    let raf = 0;

    const pulses = ARCS.map((arc) => ({ arc, t: Math.random(), speed: 0.004 + Math.random() * 0.006 }));
    const accentH = () => cssVar("--accent-h") || "62";

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      CX = W / 2; CY = H / 2;
      R = Math.min(W, H) * 0.38;
    }

    // lat/lon -> point on a unit sphere
    function toXYZ(lat: number, lon: number): Vec3 {
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = ((lon + 180) * Math.PI) / 180;
      return { x: -Math.sin(phi) * Math.cos(theta), y: Math.cos(phi), z: Math.sin(phi) * Math.sin(theta) };
    }
    // spin around Y, then tilt around X
    function rotate(p: Vec3): Vec3 {
      const x = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
      let z = p.x * Math.sin(rotY) + p.z * Math.cos(rotY);
      const y = p.y * Math.cos(rotX) - z * Math.sin(rotX);
      z = p.y * Math.sin(rotX) + z * Math.cos(rotX);
      return { x, y, z };
    }
    // 3D -> 2D with fake perspective (nearer points scale up)
    function project(p: Vec3): Projected {
      const persp = 1.4 / (1.4 - p.z * 0.55);
      return { sx: CX + p.x * R * persp, sy: CY + p.y * R * persp, z: p.z, scale: persp };
    }
    // great-circle-ish arc that bows outward from the surface
    function arcPoints(a: Vec3, b: Vec3, n: number): Vec3[] {
      const pts: Vec3[] = [];
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;
        const z = a.z + (b.z - a.z) * t;
        const len = Math.hypot(x, y, z);
        const lift = 1 + 0.32 * Math.sin(Math.PI * t);
        pts.push({ x: (x / len) * lift, y: (y / len) * lift, z: (z / len) * lift });
      }
      return pts;
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      if (!dragging) { rotY += velY; rotX += velX; velX *= 0.96; velY += (0.003 - velY) * 0.02; }
      const accent = cssVar("--accent");

      // wireframe: latitude rings
      for (let la = -60; la <= 60; la += 30) {
        ctx.beginPath();
        let started = false;
        for (let lo = -180; lo <= 180; lo += 8) {
          const p = project(rotate(toXYZ(la, lo)));
          ctx.strokeStyle = `oklch(0.42 0.01 65 / ${p.z > -0.15 ? 0.5 : 0.12})`;
          if (!started) { ctx.moveTo(p.sx, p.sy); started = true; } else ctx.lineTo(p.sx, p.sy);
        }
        ctx.stroke();
      }
      // wireframe: longitude rings
      for (let lo = -180; lo < 180; lo += 30) {
        ctx.beginPath();
        let started = false;
        for (let la = -90; la <= 90; la += 8) {
          const p = project(rotate(toXYZ(la, lo)));
          ctx.strokeStyle = `oklch(0.42 0.01 65 / ${p.z > -0.15 ? 0.4 : 0.1})`;
          if (!started) { ctx.moveTo(p.sx, p.sy); started = true; } else ctx.lineTo(p.sx, p.sy);
        }
        ctx.stroke();
      }

      // arcs + travelling pulses
      for (const pl of pulses) {
        const a = rotate(toXYZ(REGIONS[pl.arc[0]].lat, REGIONS[pl.arc[0]].lon));
        const b = rotate(toXYZ(REGIONS[pl.arc[1]].lat, REGIONS[pl.arc[1]].lon));
        const pts = arcPoints(a, b, 40);
        ctx.beginPath();
        pts.forEach((pt, i) => { const p = project(pt); if (i === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy); });
        ctx.strokeStyle = `oklch(0.80 0.155 ${accentH()} / 0.22)`;
        ctx.lineWidth = 1; ctx.stroke();
        pl.t += pl.speed; if (pl.t > 1) pl.t -= 1;
        const idx = Math.floor(pl.t * (pts.length - 1));
        const pp = project(pts[idx]);
        if (pp.z > -0.2) {
          ctx.beginPath(); ctx.arc(pp.sx, pp.sy, 2.6, 0, Math.PI * 2);
          ctx.fillStyle = accent; ctx.shadowColor = accent; ctx.shadowBlur = 10;
          ctx.fill(); ctx.shadowBlur = 0;
        }
      }

      // region nodes, sorted back-to-front so near ones draw on top
      const drawn = REGIONS.map((r) => ({ ...project(rotate(toXYZ(r.lat, r.lon))), name: r.name }))
        .sort((a, b) => a.z - b.z);
      for (const d of drawn) {
        const front = d.z > -0.1;
        const rad = (front ? 3.4 : 2.2) * d.scale;
        ctx.beginPath(); ctx.arc(d.sx, d.sy, rad, 0, Math.PI * 2);
        ctx.fillStyle = front ? accent : "oklch(0.55 0.08 65 / 0.5)";
        if (front) { ctx.shadowColor = accent; ctx.shadowBlur = 12; }
        ctx.fill(); ctx.shadowBlur = 0;
        if (front) {
          ctx.beginPath(); ctx.arc(d.sx, d.sy, rad + 4, 0, Math.PI * 2);
          ctx.strokeStyle = `oklch(0.80 0.155 ${accentH()} / 0.35)`;
          ctx.lineWidth = 1; ctx.stroke();
          ctx.font = '10px "IBM Plex Mono", monospace';
          ctx.fillStyle = "oklch(0.82 0.012 80 / 0.85)";
          ctx.fillText(d.name, d.sx + rad + 7, d.sy + 3);
        }
      }

      if (!reduce) raf = requestAnimationFrame(frame);
    }

    function down(e: MouseEvent | TouchEvent) {
      dragging = true;
      const t = "touches" in e ? e.touches[0] : e;
      if (!t) return;
      lastX = t.clientX; lastY = t.clientY; lastT = performance.now();
    }
    function move(e: MouseEvent | TouchEvent) {
      if (!dragging) return;
      const t = "touches" in e ? e.touches[0] : e;
      if (!t) return;
      const now = performance.now();
      const dt = Math.max(now - lastT, 1);
      const dx = t.clientX - lastX, dy = t.clientY - lastY;
      rotY += dx * 0.008;
      rotX += dy * 0.008;
      rotX = Math.max(-1.2, Math.min(1.2, rotX));
      velY = ((dx * 0.008) / dt) * 16; // fling velocity → inertia after release
      velX = ((dy * 0.008) / dt) * 16;
      lastX = t.clientX; lastY = t.clientY; lastT = now;
      if (e.cancelable) e.preventDefault();
    }
    function up() { dragging = false; }

    canvas.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    canvas.addEventListener("touchstart", down, { passive: true });
    canvas.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
    window.addEventListener("resize", resize);

    resize();
    frame();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousedown", down);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      canvas.removeEventListener("touchstart", down);
      canvas.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
    />
  );
}
