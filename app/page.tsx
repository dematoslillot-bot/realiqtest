"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ══════════════════════════════════════════════════════════════════════════
   NEURAL NETWORK CANVAS
══════════════════════════════════════════════════════════════════════════ */

function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const G1 = "0,85,255";
    const G2 = "0,170,255";
    const MAX_D = 190;
    const FIRE_MS = 140;
    const HUB_RATIO = 0.12;

    interface Node { x:number;y:number;vx:number;vy:number;r:number;isHub:boolean;col:string;phase:number;phaseSpeed:number; }
    interface Pulse { i:number;j:number;t:number;speed:number;col:string; }

    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    let lastFire = 0;

    function build(w: number, h: number) {
      const count = Math.round(Math.max(120, Math.min(220, (w * h) / 3200)));
      nodes = Array.from({ length: count }, () => {
        const isHub = Math.random() < HUB_RATIO;
        return {
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * (isHub ? 0.18 : 0.32),
          vy: (Math.random() - 0.5) * (isHub ? 0.18 : 0.32),
          r: isHub ? 3.2 + Math.random() * 2.0 : 1.2 + Math.random() * 2.0,
          isHub, col: Math.random() < 0.65 ? G1 : G2,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.008 + Math.random() * 0.016,
        };
      });
      pulses = [];
    }

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build(w, h);
    }

    function spawnPulse(forceHub = false) {
      const n = nodes.length;
      for (let k = 0; k < 60; k++) {
        let i: number;
        if (forceHub) {
          const hubs = nodes.map((nd, idx) => ({ nd, idx })).filter(o => o.nd.isHub);
          if (!hubs.length) return;
          i = hubs[Math.floor(Math.random() * hubs.length)].idx;
        } else { i = Math.floor(Math.random() * n); }
        const j = Math.floor(Math.random() * n);
        if (i === j) continue;
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        if (dx * dx + dy * dy < MAX_D * MAX_D) {
          pulses.push({ i, j, t: 0, speed: 0.008 + Math.random() * 0.018, col: nodes[i].col });
          return;
        }
      }
    }

    function draw(ts: number) {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      if (ts - lastFire > FIRE_MS) {
        const batch = 4 + Math.floor(Math.random() * 3);
        for (let b = 0; b < batch; b++) spawnPulse();
        if (Math.random() < 0.4) spawnPulse(true);
        lastFire = ts;
      }
      for (const nd of nodes) {
        nd.x += nd.vx; nd.y += nd.vy; nd.phase += nd.phaseSpeed;
        if (nd.x < 0) { nd.x = 0; nd.vx *= -1; }
        if (nd.x > w) { nd.x = w; nd.vx *= -1; }
        if (nd.y < 0) { nd.y = 0; nd.vy *= -1; }
        if (nd.y > h) { nd.y = h; nd.vy *= -1; }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MAX_D * MAX_D) {
            const alpha = 1 - Math.sqrt(d2) / MAX_D;
            const col = (nodes[i].col === G2 || nodes[j].col === G2) ? G2 : G1;
            ctx.strokeStyle = `rgba(${col},${alpha * 0.16})`;
            ctx.lineWidth = (nodes[i].isHub || nodes[j].isHub) ? 0.9 : 0.45;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
          }
        }
      }
      pulses = pulses.filter(p => {
        p.t += p.speed;
        const a = nodes[p.i], b = nodes[p.j];
        const env = Math.sin(p.t * Math.PI);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${p.col},${env * 0.52})`; ctx.lineWidth = 1.1; ctx.stroke();
        const px = a.x + (b.x - a.x) * p.t, py = a.y + (b.y - a.y) * p.t;
        const halo = ctx.createRadialGradient(px, py, 0, px, py, 14);
        halo.addColorStop(0, `rgba(${p.col},${env * 0.58})`); halo.addColorStop(1, `rgba(${p.col},0)`);
        ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.fillStyle = halo; ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, 2.8, 0, Math.PI * 2); ctx.fillStyle = `rgba(${p.col},${env})`; ctx.fill();
        return p.t < 1;
      });
      for (const nd of nodes) {
        const pulse = 0.5 + 0.5 * Math.sin(nd.phase);
        const glowR = nd.isHub ? nd.r * 9 : nd.r * 6;
        const alpha0 = nd.isHub ? 0.18 + pulse * 0.32 : 0.10 + pulse * 0.18;
        const glo = ctx.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, glowR);
        glo.addColorStop(0, `rgba(${nd.col},${alpha0})`); glo.addColorStop(1, `rgba(${nd.col},0)`);
        ctx.beginPath(); ctx.arc(nd.x, nd.y, glowR, 0, Math.PI * 2); ctx.fillStyle = glo; ctx.fill();
        const coreR = nd.r * (nd.isHub ? 0.8 + pulse * 0.5 : 0.6 + pulse * 0.5);
        const coreA = nd.isHub ? 0.78 + pulse * 0.22 : 0.50 + pulse * 0.45;
        ctx.beginPath(); ctx.arc(nd.x, nd.y, coreR, 0, Math.PI * 2); ctx.fillStyle = `rgba(${nd.col},${coreA})`; ctx.fill();
        if (nd.isHub) {
          ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.r * 2.4, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${nd.col},${0.14 + pulse * 0.26})`; ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} style={{ display: "block", width: "100%", height: "100%" }} aria-hidden="true" />;
}

/* ══════════════════════════════════════════════════════════════════════════
   BRAIN LOGO
══════════════════════════════════════════════════════════════════════════ */

function BrainLogo() {
  return (
    <svg width="28" height="24" viewBox="0 0 28 24" fill="none"
      style={{ animation: "brain-pulse 2.5s ease-in-out infinite", flexShrink: 0, marginRight: 7 }}
      aria-hidden="true">
      <path d="M14 2 C14 2 8 2.5 5.5 5.5 C3 8.5 3 11 4 13.5 C5 16 7 17 8 19 C9 20.5 9.5 21.5 11.5 21.5 C12.5 21.5 13.5 21 14 20.5"
        stroke="#0055FF" strokeWidth="1.6" fill="rgba(0,85,255,0.08)" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2 C14 2 20 2.5 22.5 5.5 C25 8.5 25 11 24 13.5 C23 16 21 17 20 19 C19 20.5 18.5 21.5 16.5 21.5 C15.5 21.5 14.5 21 14 20.5"
        stroke="#00AAFF" strokeWidth="1.6" fill="rgba(0,170,255,0.06)" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 10 C8.5 8 10.5 9 11.5 11" stroke="#0055FF" strokeWidth="0.85" strokeLinecap="round" opacity="0.65"/>
      <path d="M6.5 14.5 C8.5 13 10 15 10.5 17" stroke="#0055FF" strokeWidth="0.85" strokeLinecap="round" opacity="0.55"/>
      <path d="M21 10 C19.5 8 17.5 9 16.5 11" stroke="#00AAFF" strokeWidth="0.85" strokeLinecap="round" opacity="0.65"/>
      <path d="M21.5 14.5 C19.5 13 18 15 17.5 17" stroke="#00AAFF" strokeWidth="0.85" strokeLinecap="round" opacity="0.55"/>
      <line x1="14" y1="2" x2="14" y2="20.5" stroke="rgba(0,170,255,0.25)" strokeWidth="0.7" strokeDasharray="2,2.5"/>
      <circle cx="8.5" cy="10" r="1.3" fill="#0055FF" opacity="0.85">
        <animate attributeName="opacity" values="0.85;1;0.5;1;0.85" dur="2.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="19.5" cy="10" r="1.3" fill="#00AAFF" opacity="0.75">
        <animate attributeName="opacity" values="0.75;1;0.5;1;0.75" dur="2.8s" repeatCount="indefinite" begin="0.6s"/>
      </circle>
      <circle cx="7.5" cy="15" r="1.1" fill="#0055FF" opacity="0.7">
        <animate attributeName="opacity" values="0.7;1;0.4;1;0.7" dur="1.9s" repeatCount="indefinite" begin="1.1s"/>
      </circle>
      <circle cx="20.5" cy="15" r="1.1" fill="#00AAFF" opacity="0.65">
        <animate attributeName="opacity" values="0.65;1;0.4;1;0.65" dur="2.4s" repeatCount="indefinite" begin="0.3s"/>
      </circle>
      <line x1="8.5" y1="10" x2="19.5" y2="10" stroke="rgba(0,170,255,0.22)" strokeWidth="0.5">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite"/>
      </line>
      <line x1="7.5" y1="15" x2="20.5" y2="15" stroke="rgba(0,85,255,0.18)" strokeWidth="0.5">
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.1s" repeatCount="indefinite" begin="0.8s"/>
      </line>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CSS SPHERE — Spatial Reasoning 3D replacement (pure CSS, no canvas)
══════════════════════════════════════════════════════════════════════════ */

function CssSphere() {
  return (
    <div className="css-sphere-container" aria-hidden="true">
      <div className="css-sphere-scene">
        {/* Main sphere with animated light + sweeping grid lines */}
        <div className="css-sphere">
          <div className="css-sphere-highlight" />
        </div>
        {/* 3D orbital rings */}
        <div className="css-ring-a" />
        <div className="css-ring-b" />
        {/* Glowing dots travelling along each ring */}
        <div className="css-orbit-dot css-orbit-dot-a" />
        <div className="css-orbit-dot css-orbit-dot-b" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   NEURAL BRAIN VIZ — hero decoration (absolute-positioned, doesn't offset text)
══════════════════════════════════════════════════════════════════════════ */

function NeuralBrainViz() {
  const cx = 130, cy = 130;
  const outerR = 100, midR = 65, innerR = 34;
  const outerCount = 8, midCount = 6;

  const outer = Array.from({ length: outerCount }, (_, i) => {
    const a = (i * Math.PI * 2) / outerCount - Math.PI / 2;
    return { x: cx + outerR * Math.cos(a), y: cy + outerR * Math.sin(a) };
  });
  const mid = Array.from({ length: midCount }, (_, i) => {
    const a = (i * Math.PI * 2) / midCount - Math.PI / 6;
    return { x: cx + midR * Math.cos(a), y: cy + midR * Math.sin(a) };
  });

  return (
    <svg viewBox="0 0 260 260" width="300" height="300" aria-hidden="true">
      <circle cx={cx} cy={cy} r={outerR + 18} stroke="rgba(0,85,255,0.07)" fill="none" strokeWidth="1">
        <animate attributeName="r" values={`${outerR+18};${outerR+24};${outerR+18}`} dur="4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.4;0.12;0.4" dur="4s" repeatCount="indefinite"/>
      </circle>
      <circle cx={cx} cy={cy} r={outerR} stroke="rgba(0,85,255,0.12)" fill="none" strokeWidth="0.8"/>
      <circle cx={cx} cy={cy} r={midR} stroke="rgba(0,170,255,0.14)" fill="none" strokeWidth="0.8">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="3.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx={cx} cy={cy} r={innerR} stroke="rgba(0,85,255,0.18)" fill="none" strokeWidth="0.8">
        <animate attributeName="r" values={`${innerR};${innerR+3};${innerR}`} dur="2.5s" repeatCount="indefinite"/>
      </circle>
      {outer.map((n, i) => {
        const m = mid[i % midCount];
        return (
          <line key={`om${i}`} x1={n.x} y1={n.y} x2={m.x} y2={m.y} stroke="rgba(0,85,255,0.16)" strokeWidth="0.5">
            <animate attributeName="opacity" values="0.1;0.6;0.1" dur={`${2.2 + i * 0.35}s`} repeatCount="indefinite" begin={`${i * 0.4}s`}/>
          </line>
        );
      })}
      {mid.map((m, i) => (
        <line key={`mc${i}`} x1={m.x} y1={m.y} x2={cx} y2={cy} stroke="rgba(0,170,255,0.14)" strokeWidth="0.5">
          <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.28}s`}/>
        </line>
      ))}
      {[0, 2, 4, 6].map(i => {
        const start = outer[i], end = mid[i % midCount];
        return (
          <circle key={`tp${i}`} r="2.2" fill="#00AAFF">
            <animateMotion dur={`${1.4 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.7}s`}
              path={`M${start.x},${start.y} L${end.x},${end.y}`}/>
            <animate attributeName="opacity" values="0;0.95;0" dur={`${1.4 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.7}s`}/>
          </circle>
        );
      })}
      {[1, 3].map(i => {
        const m = mid[i], path = `M${m.x},${m.y} L${cx},${cy}`;
        return (
          <circle key={`tp2${i}`} r="1.8" fill="#0055FF">
            <animateMotion dur={`${1.1 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.9 + 0.5}s`} path={path}/>
            <animate attributeName="opacity" values="0;1;0" dur={`${1.1 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.9 + 0.5}s`}/>
          </circle>
        );
      })}
      {outer.map((n, i) => (
        <g key={`on${i}`}>
          <circle cx={n.x} cy={n.y} r="7" fill="rgba(0,85,255,0.07)" stroke="rgba(0,85,255,0.28)" strokeWidth="0.7">
            <animate attributeName="r" values="6;8.5;6" dur={`${2.2 + i * 0.38}s`} repeatCount="indefinite" begin={`${i * 0.3}s`}/>
          </circle>
          <circle cx={n.x} cy={n.y} r="2.8" fill={i % 2 === 0 ? "#0055FF" : "#00AAFF"}>
            <animate attributeName="opacity" values="0.55;1;0.55" dur={`${1.9 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.25}s`}/>
          </circle>
        </g>
      ))}
      {mid.map((m, i) => (
        <g key={`mn${i}`}>
          <circle cx={m.x} cy={m.y} r="5" fill="rgba(0,170,255,0.08)" stroke="rgba(0,170,255,0.22)" strokeWidth="0.7"/>
          <circle cx={m.x} cy={m.y} r="2" fill="#00AAFF">
            <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2.4 + i * 0.28}s`} repeatCount="indefinite" begin={`${i * 0.35}s`}/>
          </circle>
        </g>
      ))}
      <circle cx={cx} cy={cy} r="17" fill="rgba(0,85,255,0.18)">
        <animate attributeName="r" values="15;20;15" dur="2.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx={cx} cy={cy} r="7" fill="#0055FF" opacity="0.95">
        <animate attributeName="opacity" values="0.75;1;0.75" dur="1.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx={cx} cy={cy} r="3.5" fill="white" opacity="0.7"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   DIM3D — Canvas-rendered 3D animated object per cognitive dimension
   1 canvas per card, 200×200, pauses when off-screen (IntersectionObserver)
══════════════════════════════════════════════════════════════════════════ */

function Dim3D({ index }: { index: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speedRef  = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = 200, H = 200;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + "px";
    canvas.style.height = H + "px";
    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;
    // assign to a const so TS narrowing propagates into nested functions
    const ctx: CanvasRenderingContext2D = ctxRaw;
    ctx.scale(dpr, dpr);

    const cx = W / 2, cy = H / 2;
    let t = 0, raf = 0, visible = false;

    /* ── helpers ── */
    const rotY = (x: number, y: number, z: number, a: number): [number,number,number] =>
      [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
    const rotX = (x: number, y: number, z: number, a: number): [number,number,number] =>
      [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
    const project = (x: number, y: number, z: number): [number, number] => {
      const s = 180 / (z + 4.5);
      return [cx + x * s, cy + y * s];
    };

    /* ── 0: Wireframe cube ── */
    function drawCube() {
      const sp = speedRef.current;
      const ry = t * 0.5 * sp, rx = t * 0.3 * sp;
      const sc = 0.72;
      const raw: [number,number,number][] = [
        [-sc,-sc,-sc],[ sc,-sc,-sc],[ sc, sc,-sc],[-sc, sc,-sc],
        [-sc,-sc, sc],[ sc,-sc, sc],[ sc, sc, sc],[-sc, sc, sc],
      ];
      const pts = raw.map(([x,y,z]) => {
        const [x1,y1,z1] = rotY(x,y,z,ry);
        const [x2,y2,z2] = rotX(x1,y1,z1,rx);
        return { p: project(x2,y2,z2), z: z2 };
      });
      const edges: [number,number][] = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      ctx.clearRect(0,0,W,H);

      const sorted = edges.map(([a,b]) => ({ a,b, avgZ:(pts[a].z+pts[b].z)/2 }))
                          .sort((a,b) => a.avgZ - b.avgZ);
      sorted.forEach(({ a, b, avgZ }) => {
        const alpha = Math.max(0.2, 0.3 + (avgZ + 1.5) / 3 * 0.55);
        const [ax,ay] = pts[a].p, [bx,by] = pts[b].p;
        ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by);
        ctx.strokeStyle = avgZ > 0 ? `rgba(0,170,255,${alpha})` : `rgba(0,85,255,${alpha})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = "#00AAFF"; ctx.shadowBlur = 10;
        ctx.stroke(); ctx.shadowBlur = 0;
      });
      pts.forEach(({ p:[px,py], z }) => {
        const alpha = Math.max(0.4, 0.5 + (z+1.5)/3*0.5);
        ctx.beginPath(); ctx.arc(px,py,3.5,0,Math.PI*2);
        ctx.fillStyle = z > 0 ? `rgba(0,170,255,${alpha})` : `rgba(0,85,255,${alpha})`;
        ctx.shadowColor = "#00AAFF"; ctx.shadowBlur = 14; ctx.fill(); ctx.shadowBlur = 0;
      });
    }

    /* ── 1: Letters A-B-C-D orbiting ── */
    function drawLetters() {
      const sp = speedRef.current;
      ctx.clearRect(0,0,W,H);
      const LETTERS = ["A","B","C","D"];
      const r = 58;
      const items = LETTERS.map((l, i) => {
        const angle = (i / LETTERS.length) * Math.PI * 2 + t * 0.55 * sp;
        const z = Math.cos(angle);
        const x = cx + r * Math.sin(angle);
        const y = cy + r * 0.32 * Math.cos(angle + Math.PI/5);
        const scale = 0.55 + (z+1)/2*0.65;
        const alpha = 0.28 + (z+1)/2*0.72;
        return { l, x, y, z, scale, alpha, i };
      }).sort((a,b) => a.z - b.z);

      items.forEach(({ l, x, y, scale, alpha, i }) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * 0.35 * sp + i);
        const col = i % 2 === 0 ? "0,85,255" : "0,170,255";
        ctx.font = `800 ${Math.round(28*scale)}px sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(${col},${alpha})`;
        ctx.shadowColor = `rgb(${col})`; ctx.shadowBlur = 16*scale;
        ctx.fillText(l, 0, 0);
        ctx.restore(); ctx.shadowBlur = 0;
      });
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r*0.32, 0, 0, Math.PI*2);
      ctx.strokeStyle = "rgba(0,85,255,0.1)"; ctx.lineWidth = 1; ctx.stroke();
    }

    /* ── 2: Sphere with meridians ── */
    function drawSphere() {
      const sp = speedRef.current;
      const rot = t * 0.45 * sp;
      const R = 74;
      ctx.clearRect(0,0,W,H);

      ctx.save();
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.clip();

      for (let i = -3; i <= 3; i++) {
        const phi = (i/4)*Math.PI*0.8;
        const r = R*Math.cos(phi), yOff = R*Math.sin(phi);
        const alpha = 0.12 + Math.abs(Math.cos(phi))*0.28;
        ctx.beginPath();
        ctx.ellipse(cx, cy-yOff, r, r*0.26, 0, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(0,170,255,${alpha})`; ctx.lineWidth = 0.9; ctx.stroke();
      }
      const nMer = 9;
      for (let i = 0; i < nMer; i++) {
        const angle = (i/nMer)*Math.PI + rot;
        const sinA = Math.abs(Math.sin(angle)), cosA = Math.cos(angle);
        const alpha = 0.08 + sinA*0.3;
        ctx.beginPath();
        ctx.ellipse(cx, cy, R*sinA, R, 0, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(${cosA>0?"0,85,255":"0,170,255"},${alpha})`; ctx.lineWidth = 0.9; ctx.stroke();
      }
      ctx.restore();

      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
      ctx.strokeStyle = "rgba(0,85,255,0.4)"; ctx.lineWidth = 1.5;
      ctx.shadowColor = "#0055FF"; ctx.shadowBlur = 16; ctx.stroke(); ctx.shadowBlur = 0;

      [[0,-R],[0,R]].forEach(([dx,dy]) => {
        ctx.beginPath(); ctx.arc(cx+dx, cy+dy, 3.5, 0, Math.PI*2);
        ctx.fillStyle = "#00AAFF"; ctx.shadowColor = "#00AAFF"; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0;
      });
    }

    /* ── 3: Numbers in spiral ── */
    function drawSpiral() {
      const sp = speedRef.current;
      const rot = t * 0.4 * sp;
      ctx.clearRect(0,0,W,H);
      const nums = "123456789".split("");
      nums.forEach((n, i) => {
        const frac = i / (nums.length - 1);
        const angle = frac * Math.PI * 3.6 + rot;
        const r = 14 + frac * 64;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const sz = 11 + frac * 16;
        const alpha = 0.3 + frac * 0.7;
        const col = i % 2 === 0 ? "0,85,255" : "0,170,255";
        ctx.save();
        ctx.translate(x, y); ctx.rotate(angle);
        ctx.font = `700 ${Math.round(sz)}px monospace`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(${col},${alpha})`;
        ctx.shadowColor = `rgb(${col})`; ctx.shadowBlur = 10;
        ctx.fillText(n, 0, 0);
        ctx.restore(); ctx.shadowBlur = 0;
      });
      ctx.beginPath(); ctx.arc(cx,cy,5,0,Math.PI*2);
      ctx.fillStyle = "rgba(0,170,255,0.85)"; ctx.shadowColor = "#00AAFF"; ctx.shadowBlur = 18; ctx.fill(); ctx.shadowBlur = 0;
    }

    /* ── 4: Particles forming hexagonal pattern ── */
    const hexTargets: [number,number][] = [
      [0,0],[36,0],[-36,0],[18,31],[-18,31],[18,-31],[-18,-31],
      [72,0],[-72,0],[54,31],[-54,31],[54,-31],[-54,-31],[0,62],[0,-62],
    ];
    const hexParts = hexTargets.map(([tx,ty]) => ({
      ox:(Math.random()-0.5)*160, oy:(Math.random()-0.5)*160, tx, ty,
    }));

    function drawParticles() {
      const sp = speedRef.current;
      const cycle = (t * sp * 0.22) % (Math.PI*2);
      const phase = (Math.sin(cycle)+1)/2;
      ctx.clearRect(0,0,W,H);

      if (phase > 0.45) {
        const str = (phase-0.45)/0.55;
        hexParts.forEach((p, i) => {
          hexParts.forEach((q, j) => {
            if (j <= i) return;
            const dx = p.tx-q.tx, dy = p.ty-q.ty;
            if (Math.sqrt(dx*dx+dy*dy) < 42) {
              const px2 = cx + p.ox + (p.tx-p.ox)*phase;
              const py2 = cy + p.oy + (p.ty-p.oy)*phase;
              const qx2 = cx + q.ox + (q.tx-q.ox)*phase;
              const qy2 = cy + q.oy + (q.ty-q.oy)*phase;
              ctx.beginPath(); ctx.moveTo(px2,py2); ctx.lineTo(qx2,qy2);
              ctx.strokeStyle = `rgba(0,85,255,${str*0.4})`; ctx.lineWidth = 0.7; ctx.stroke();
            }
          });
        });
      }
      hexParts.forEach((p, i) => {
        const px2 = cx + p.ox + (p.tx-p.ox)*phase;
        const py2 = cy + p.oy + (p.ty-p.oy)*phase;
        const r = 2.5 + phase*1.8;
        const alpha = 0.35 + phase*0.65;
        const col = i%3===0?"0,85,255":i%3===1?"0,170,255":"110,70,220";
        ctx.beginPath(); ctx.arc(px2,py2,r,0,Math.PI*2);
        ctx.fillStyle = `rgba(${col},${alpha})`;
        ctx.shadowColor = `rgb(${col})`; ctx.shadowBlur = 9*phase;
        ctx.fill(); ctx.shadowBlur = 0;
      });
    }

    /* ── 5: Lightning bolt with sparks ── */
    function drawLightning() {
      const sp = speedRef.current;
      ctx.clearRect(0,0,W,H);
      const segs = 10;
      const topY = cy-82, botY = cy+82;
      const jitter = 18 + Math.sin(t*5*sp)*7;
      const pts: [number,number][] = [[cx,topY]];
      for (let i = 1; i < segs; i++) {
        const frac = i/segs;
        const side = ((i%2)*2-1)*jitter*(1-frac*0.5) + Math.sin(t*9*sp+i)*4;
        pts.push([cx+side, topY+frac*(botY-topY)]);
      }
      pts.push([cx,botY]);

      // Outer glow
      ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]);
      pts.slice(1).forEach(([bx,by]) => ctx.lineTo(bx,by));
      ctx.strokeStyle = "rgba(0,170,255,0.25)"; ctx.lineWidth = 16;
      ctx.shadowColor = "#00AAFF"; ctx.shadowBlur = 28; ctx.stroke(); ctx.shadowBlur = 0;

      // Mid glow
      ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]);
      pts.slice(1).forEach(([bx,by]) => ctx.lineTo(bx,by));
      ctx.strokeStyle = "rgba(0,170,255,0.9)"; ctx.lineWidth = 3;
      ctx.shadowColor = "#00AAFF"; ctx.shadowBlur = 16; ctx.stroke(); ctx.shadowBlur = 0;

      // Core white
      ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]);
      pts.slice(1).forEach(([bx,by]) => ctx.lineTo(bx,by));
      ctx.strokeStyle = "rgba(200,235,255,0.95)"; ctx.lineWidth = 1; ctx.stroke();

      // Sparks
      for (let i = 0; i < 18; i++) {
        const life = ((t*sp*(1.5+i*0.08)+i*0.4) % 1);
        const boltPt = pts[Math.floor(i*pts.length/18)];
        if (!boltPt) continue;
        const angle = (i/18)*Math.PI*2 + t*2.5*sp;
        const dist = life*36;
        const sx = boltPt[0]+Math.cos(angle)*dist;
        const sy = boltPt[1]+Math.sin(angle)*dist;
        const alpha = (1-life)*0.9;
        ctx.beginPath(); ctx.arc(sx,sy,Math.max(0.4,2*(1-life)),0,Math.PI*2);
        ctx.fillStyle = `rgba(0,${170+Math.floor(life*85)},255,${alpha})`;
        ctx.shadowColor = "#00AAFF"; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;
      }
    }

    const renderers = [drawCube, drawLetters, drawSphere, drawSpiral, drawParticles, drawLightning];

    const animate = () => {
      if (!visible) { raf = 0; return; }
      ctx.shadowBlur = 0;
      renderers[index]();
      t += 0.016;
      raf = requestAnimationFrame(animate);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(animate);
    }, { threshold: 0.05 });
    io.observe(canvas);

    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [index]);

  return (
    <canvas
      ref={canvasRef}
      onMouseEnter={() => { speedRef.current = 2.8; }}
      onMouseLeave={() => { speedRef.current = 1; }}
      aria-hidden="true"
      style={{ display: "block" }}
    />
  );
}

/* ── Stat Counter ──────────────────────────────────────────────────────── */

function StatCounter({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      const dur = 1500, t0 = performance.now();
      const fmt = (v: number) => decimals ? v.toFixed(decimals) : String(Math.round(v));
      const tick = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = fmt(value * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = fmt(value) + suffix;
      };
      requestAnimationFrame(tick);
      io.disconnect();
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, suffix, decimals]);
  return <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>{decimals ? value.toFixed(decimals) : value}{suffix}</span>;
}

/* ── Data ──────────────────────────────────────────────────────────────── */

// One entrance animation per cognitive dimension (mobile-first impact)
// 0 Logical      → from left      (pattern search = left-to-right scan)
// 1 Verbal       → from right     (reading direction reversed)
// 2 Spatial      → scale pop      (object "materialises")
// 3 Numerical    → bounce up      (numbers bouncing off a surface)
// 4 Memory       → glitch reveal  (digital memory flicker)
// 5 Speed        → blur-to-focus  (instant snap, processing burst)
const PILLAR_ANIMS = [
  "reveal-left",
  "reveal-right",
  "reveal-scale",
  "reveal-bounce",
  "reveal-glitch",
  "reveal-blur",
] as const;

// Stagger delay by column position (desktop = 3 cols, mobile = 1 col)
const pillarDelay = (i: number) => `${(i % 3) * 120}ms`;

const PILLAR_ICONS = ["⬡", "◈", "⟳", "∑", "◉", "⚡"];

const PILLARS = [
  { n: "01", name: "Logical Reasoning",   desc: "Identify patterns and solve abstract Raven matrix problems with multiple simultaneous rules." },
  { n: "02", name: "Verbal Intelligence", desc: "Analogies, vocabulary depth and linguistic structure comprehension." },
  { n: "03", name: "Spatial Reasoning",   desc: "Rotate and manipulate 2D shapes mentally — angles, inverses and compound rotations." },
  { n: "04", name: "Numerical Ability",   desc: "Number series visualised as bar charts — alternating operations, Fibonacci variants, geometric sequences." },
  { n: "05", name: "Working Memory",      desc: "Memorise rapid colour sequences (6-8 items) and recall specific positions under cognitive load." },
  { n: "06", name: "Processing Speed",    desc: "Symbol matching and rapid calculation — pure cognitive throughput under time pressure." },
];

const STEPS = [
  { n: "01", title: "Answer 30 questions",             desc: "5 questions across each of the 6 cognitive dimensions. Visual patterns, rotations, series and sequences." },
  { n: "02", title: "Algorithm scores your responses", desc: "Our model weights accuracy, speed and category performance against 2.4 million data points." },
  { n: "03", title: "Receive your IQ score instantly", desc: "Free report with your overall IQ. Unlock the full premium report for €1.99." },
];

const FEATURES = [
  { title: "Cognitive Radar Chart",    desc: "Visual spider chart across all 6 dimensions at a glance." },
  { title: "Full Category Breakdown",  desc: "Detailed score and personalised analysis for each category." },
  { title: "Global Percentile Rank",   desc: "See exactly where you stand vs thousands of test takers." },
  { title: "Career Matches",           desc: "Careers that align with your unique cognitive profile." },
  { title: "Improvement Tips",         desc: "Personalised neuroscience-backed advice for each area." },
  { title: "Famous IQ Comparisons",    desc: "See how your score compares to historical geniuses." },
  { title: "Official PDF Certificate", desc: "Download your personalised IQ certificate." },
  { title: "Strengths and Weaknesses", desc: "Clear identification of cognitive superpowers and growth areas." },
];

const FREE_FEATURES    = ["Full 30-question test", "Overall IQ score", "Population percentile"];
const PREMIUM_FEATURES = [
  "Full 30-question test", "Overall IQ score", "Population percentile",
  "Radar chart", "Category breakdown", "Career matches",
  "Improvement tips", "Famous comparisons", "PDF certificate",
];

/* ── Ripple helper ─────────────────────────────────────────────────────── */

function addRipple(e: React.MouseEvent<HTMLButtonElement>) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top  - size / 2;
  const wave = document.createElement("span");
  wave.style.cssText = `position:absolute;width:${size}px;height:${size}px;left:${x}px;top:${y}px;border-radius:50%;background:rgba(255,255,255,0.28);pointer-events:none;animation:ripple-out 0.75s ease-out forwards;`;
  btn.style.position = "relative";
  btn.style.overflow = "hidden";
  btn.appendChild(wave);
  setTimeout(() => wave.remove(), 750);
}

/* ── 3D tilt handlers ──────────────────────────────────────────────────── */

function onTilt(e: React.MouseEvent<HTMLDivElement>) {
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  const rx = -((e.clientY - r.top  - r.height / 2) / r.height) * 7;
  const ry =  ((e.clientX - r.left - r.width  / 2) / r.width)  * 9;
  card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px) scale(1.025)`;
  card.style.borderColor = "rgba(0,170,255,0.55)";
  card.style.boxShadow = "0 24px 60px rgba(0,0,0,0.55), 0 0 36px rgba(0,85,255,0.18), inset 0 1px 0 rgba(0,170,255,0.12)";
}

function offTilt(e: React.MouseEvent<HTMLDivElement>) {
  const card = e.currentTarget;
  card.style.transform = "";
  card.style.borderColor = "";
  card.style.boxShadow = "";
}

/* ══════════════════════════════════════════════════════════════════════════
   RADAR CHART — cognitive profile spider (6 dimensions, animated draw)
══════════════════════════════════════════════════════════════════════════ */

const RADAR_DIMS = [
  { name: "Logical",   value: 78, color: "#0055FF" },
  { name: "Verbal",    value: 92, color: "#00AAFF" },
  { name: "Spatial",   value: 65, color: "#9B59B6" },
  { name: "Numerical", value: 88, color: "#00D87A" },
  { name: "Memory",    value: 71, color: "#FF8C00" },
  { name: "Speed",     value: 85, color: "#FFD700" },
];

function RadarChart() {
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const CX = 160, CY = 160, R = 110;

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const dur = 1400, t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - t0) / dur, 1);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setProgress(eased);
        if (t < 1) requestAnimationFrame(tick);
        else setProgress(1);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const angleOf = (i: number) => (i * 60 - 90) * (Math.PI / 180);

  const axisEnd = (i: number): [number, number] => [
    CX + R * Math.cos(angleOf(i)),
    CY + R * Math.sin(angleOf(i)),
  ];

  const dataPoint = (i: number, prog = 1): [number, number] => {
    const r = R * (RADAR_DIMS[i].value / 100) * prog;
    return [CX + r * Math.cos(angleOf(i)), CY + r * Math.sin(angleOf(i))];
  };

  const labelPos = (i: number): [number, number] => {
    const r = R + 26;
    return [CX + r * Math.cos(angleOf(i)), CY + r * Math.sin(angleOf(i))];
  };

  const hexPoints = (pct: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const r = R * pct;
      return `${CX + r * Math.cos(angleOf(i))},${CY + r * Math.sin(angleOf(i))}`;
    }).join(" ");

  const dataPolygon = Array.from({ length: 6 }, (_, i) => dataPoint(i, progress).join(",")).join(" ");

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg ref={svgRef} viewBox="0 0 320 320" width="320" height="320"
        style={{ overflow: "visible", filter: "drop-shadow(0 0 24px rgba(0,85,255,0.2))" }}>

        {/* Background concentric hexagons */}
        {[0.25, 0.5, 0.75, 1].map(pct => (
          <polygon key={pct} points={hexPoints(pct)}
            fill={pct === 1 ? "rgba(0,85,255,0.03)" : "none"}
            stroke={pct === 1 ? "rgba(0,85,255,0.22)" : "rgba(0,85,255,0.10)"}
            strokeWidth={pct === 1 ? 1.2 : 0.7} />
        ))}

        {/* % labels on right axis */}
        {[25, 50, 75].map(pct => (
          <text key={pct}
            x={CX + R * 0.01 * pct * Math.cos(angleOf(0)) + 5}
            y={CY + R * 0.01 * pct * Math.sin(angleOf(0)) - 4}
            fill="rgba(58,90,138,0.7)" fontSize="7.5" fontFamily="monospace"
          >{pct}</text>
        ))}

        {/* Axis spokes */}
        {Array.from({ length: 6 }, (_, i) => {
          const [ex, ey] = axisEnd(i);
          return (
            <line key={i} x1={CX} y1={CY} x2={ex} y2={ey}
              stroke="rgba(0,85,255,0.18)" strokeWidth="1" strokeDasharray="3,3" />
          );
        })}

        {/* Data fill */}
        <polygon points={dataPolygon}
          fill="rgba(0,85,255,0.10)"
          stroke="none" />

        {/* Data stroke with glow */}
        <polygon points={dataPolygon}
          fill="none"
          stroke="rgba(0,85,255,0.9)"
          strokeWidth="2"
          style={{ filter: "drop-shadow(0 0 6px rgba(0,85,255,0.7))" }} />

        {/* Data points */}
        {Array.from({ length: 6 }, (_, i) => {
          const [px, py] = dataPoint(i, progress);
          const dim = RADAR_DIMS[i];
          const isHov = hovered === i;
          return (
            <g key={i}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}>
              {/* Outer glow ring on hover */}
              {isHov && (
                <circle cx={px} cy={py} r={14} fill="none"
                  stroke={dim.color} strokeWidth="1" opacity="0.35" />
              )}
              <circle cx={px} cy={py} r={isHov ? 7 : 5}
                fill={dim.color}
                style={{
                  transition: "r 0.15s",
                  filter: `drop-shadow(0 0 ${isHov ? 8 : 4}px ${dim.color})`,
                }} />
              {/* Value tooltip */}
              {isHov && (
                <g>
                  <rect x={px - 22} y={py - 30} width={44} height={22}
                    rx={4} ry={4}
                    fill="rgba(5,10,25,0.92)"
                    stroke={dim.color} strokeWidth="1" />
                  <text x={px} y={py - 18} textAnchor="middle" dominantBaseline="middle"
                    fill={dim.color} fontSize="11" fontWeight="700" fontFamily="monospace">
                    {dim.value}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Axis labels */}
        {Array.from({ length: 6 }, (_, i) => {
          const [lx, ly] = labelPos(i);
          const dim = RADAR_DIMS[i];
          const isHov = hovered === i;
          return (
            <text key={i} x={lx} y={ly}
              textAnchor="middle" dominantBaseline="middle"
              fill={isHov ? dim.color : "#5577AA"}
              fontSize={isHov ? "11.5" : "10.5"}
              fontWeight={isHov ? "700" : "400"}
              fontFamily="sans-serif"
              style={{ transition: "fill 0.15s, font-size 0.15s", cursor: "pointer" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}>
              {dim.name}
            </text>
          );
        })}

        {/* Center dot */}
        <circle cx={CX} cy={CY} r={3} fill="#0055FF" opacity="0.6" />
      </svg>

      <p style={{ fontSize: 11, color: "#8AABCC", marginTop: 8, letterSpacing: "0.04em" }}>
        Hover each vertex to explore your dimensions
      </p>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function Home() {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("nav-scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Observe all scroll-reveal variants — fires once, never re-triggers
    const SELECTORS = [
      ".reveal",
      ".reveal-left", ".reveal-right", ".reveal-scale",
      ".reveal-bounce", ".reveal-glitch", ".reveal-blur",
    ].join(", ");

    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add("visible");
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.10, rootMargin: "0px 0px -24px 0px" }
    );
    document.querySelectorAll(SELECTORS).forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const blue  = "#0055FF";
  const cyan  = "#00AAFF";
  const blue2 = "rgba(0,85,255,0.18)";
  const dim   = "#8AABCC";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "RealIQTest",
    "url": "https://realiqtest.co",
    "description": "Free IQ test with 30 visual questions across 6 cognitive dimensions. Get your IQ score instantly.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://realiqtest.co/test",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div style={{ background: "#03050F", color: "#D6E4FF" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

      {/* ── Nav ── */}
      <nav ref={navRef} style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px",
        background: "rgba(3,5,15,0.88)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid transparent",
        transition: "border-color 0.3s, background 0.3s, box-shadow 0.3s",
      }}>
        <button onClick={() => router.push("/")} style={{
          background: "none", border: "none", cursor: "pointer", padding: 0,
          fontSize: "17px", fontWeight: 600, color: "#D6E4FF",
          letterSpacing: "-0.02em", fontFamily: "inherit",
          display: "flex", alignItems: "center",
        }}>
          <BrainLogo />
          Real<span style={{ color: blue, textShadow: `0 0 18px rgba(0,85,255,0.8)` }}>IQ</span>Test
        </button>

        <ul className="nav-links" style={{ gap: "32px", listStyle: "none", margin: 0, padding: 0 }}>
          {[
            { label: "The Test",     id: "pillars"      },
            { label: "How It Works", id: "how-it-works" },
            { label: "Leaderboard",  href: "/leaderboard" },
            { label: "Pricing",      id: "pricing"      },
          ].map(l => (
            <li key={l.label}
              onClick={() => {
                if ("href" in l && l.href) router.push(l.href);
                else if ("id" in l && l.id) document.getElementById(l.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{ fontSize: "13px", color: dim, cursor: "pointer", transition: "color 0.15s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#D6E4FF")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = dim)}>
              {"href" in l && l.href === "/leaderboard"
                ? <span style={{ color: "#5599FF" }}>{l.label}</span>
                : l.label}
            </li>
          ))}
        </ul>

        <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-primary">Start Free</button>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        position: "relative", minHeight: "100dvh",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", background: "#03050F",
      }}>
        <div className="canvas-wrap"><NeuralCanvas /></div>

        {/* Ambient blobs */}
        <div style={{ position:"absolute", borderRadius:"50%", filter:"blur(90px)", pointerEvents:"none", width:640, height:640, background:"radial-gradient(circle, rgba(0,85,255,0.16) 0%, transparent 70%)", top:"5%", left:"18%", animation:"hero-glow-drift 9s ease-in-out infinite" }} />
        <div style={{ position:"absolute", borderRadius:"50%", filter:"blur(70px)", pointerEvents:"none", width:420, height:420, background:"radial-gradient(circle, rgba(0,170,255,0.12) 0%, transparent 70%)", top:"45%", right:"12%", animation:"hero-glow-drift 12s ease-in-out infinite reverse" }} />
        <div style={{ position:"absolute", borderRadius:"50%", filter:"blur(60px)", pointerEvents:"none", width:280, height:280, background:"radial-gradient(circle, rgba(0,85,255,0.10) 0%, transparent 70%)", bottom:"15%", left:"10%", animation:"hero-glow-drift 7s ease-in-out infinite", animationDelay:"-4s" }} />

        {/* Vignette */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse 80% 80% at 50% 50%, rgba(3,5,15,0.20) 0%, rgba(3,5,15,0.65) 100%)" }} />

        {/* Hero content — TEXT is the only thing in the flex flow, so it stays perfectly centred */}
        <div style={{
          position: "relative", zIndex: 10,
          width: "100%", minHeight: "100dvh",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "100px 24px 80px",
        }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", maxWidth: 720, width:"100%" }}>

            {/* Eyebrow */}
            <div className="h1" style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"28px" }}>
              <span style={{ width:28, height:1, background:`linear-gradient(90deg, transparent, ${cyan})` }} />
              <span style={{ fontSize:10, letterSpacing:"0.26em", textTransform:"uppercase", fontWeight:600, color:cyan, textShadow:`0 0 18px rgba(0,170,255,0.9)` }}>
                Scientifically calibrated
              </span>
              <span style={{ width:28, height:1, background:`linear-gradient(90deg, ${cyan}, transparent)` }} />
            </div>

            {/* Title — "Discover your" bold white, "true intelligence" via SVG gradient fill
                SVG bypass: background-clip:text fails in Chrome when ancestors animate.
                SVG gradient fill is 100% reliable across all browsers. */}
            <h1 className="h2 hero-title">
              <span className="hero-discover">Discover your</span>
              {/* SVG gradient text — Space Grotesk, bigger, animated rainbow */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1020 114"
                style={{ width:"100%", maxWidth:960, height:"auto", display:"block", margin:"10px auto 0", overflow:"visible" }}
                aria-label="true intelligence"
                role="img"
              >
                <defs>
                  <linearGradient id="hero-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#0055FF">
                      <animate attributeName="stop-color" values="#0055FF;#00AAFF;#9B59B6;#FF6B9D;#00CCFF;#0055FF" dur="5s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="25%"  stopColor="#00AAFF">
                      <animate attributeName="stop-color" values="#00AAFF;#9B59B6;#FF6B9D;#00CCFF;#0055FF;#00AAFF" dur="5s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="55%"  stopColor="#9B59B6">
                      <animate attributeName="stop-color" values="#9B59B6;#FF6B9D;#00CCFF;#0055FF;#00AAFF;#9B59B6" dur="5s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="80%"  stopColor="#FF6B9D">
                      <animate attributeName="stop-color" values="#FF6B9D;#00CCFF;#0055FF;#00AAFF;#9B59B6;#FF6B9D" dur="5s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="#00CCFF">
                      <animate attributeName="stop-color" values="#00CCFF;#0055FF;#00AAFF;#9B59B6;#FF6B9D;#00CCFF" dur="5s" repeatCount="indefinite" />
                    </stop>
                  </linearGradient>
                  <filter id="hero-glow">
                    <feGaussianBlur stdDeviation="4" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                {/* Glow layer */}
                <text
                  x="50%" y="88"
                  textAnchor="middle"
                  fill="url(#hero-grad)"
                  fontFamily="'Space Grotesk', sans-serif"
                  fontWeight="700"
                  fontSize="96"
                  letterSpacing="-3.5"
                  opacity="0.35"
                  style={{ filter: "blur(12px)" }}
                >
                  true intelligence
                </text>
                {/* Main text */}
                <text
                  x="50%" y="88"
                  textAnchor="middle"
                  fill="url(#hero-grad)"
                  fontFamily="'Space Grotesk', sans-serif"
                  fontWeight="700"
                  fontSize="96"
                  letterSpacing="-3.5"
                >
                  true intelligence
                </text>
              </svg>
            </h1>

            <p className="h3 hero-sub">
              30 visual questions across 6 cognitive dimensions — matrix patterns,
              mental rotation, number series and memory sequences. Your actual score.
            </p>

            <div className="h4 hero-ctas">
              <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-primary">
                Take the Test — Free
              </button>
              <button className="btn btn-outline">View Sample Report</button>
            </div>

            <p className="h4" style={{ marginTop:32, fontSize:10, letterSpacing:"0.10em", color:"#6A88AA", textShadow:"0 1px 4px rgba(0,0,0,0.9)" }}>
              30 questions · 6 dimensions · ~15 min · No signup required
            </p>
          </div>
        </div>

        {/* Brain viz — absolute, doesn't push text off-centre */}
        <div className="hero-brain-abs">
          <NeuralBrainViz />
        </div>

        {/* Scroll indicator */}
        <div style={{ position:"absolute", bottom:28, display:"flex", flexDirection:"column", alignItems:"center", gap:6, opacity:0.30, zIndex:10 }}>
          <span style={{ fontSize:9, letterSpacing:"0.20em", textTransform:"uppercase" }}>Scroll</span>
          <div style={{ width:1, height:30, background:`linear-gradient(to bottom, ${blue}, transparent)` }} />
        </div>
      </section>

      {/* ── Stats ── */}
      <div style={{ background:"#050810", borderTop:`1px solid ${blue2}`, borderBottom:`1px solid ${blue2}` }}>
        <div className="stats-grid">
          {[
            { value:30,   suffix:"",     label:"Questions" },
            { value:6,    suffix:"",     label:"Cognitive dimensions" },
            { value:15,   suffix:" min", label:"Average duration" },
            { value:1.99, suffix:"€",    decimals:2, label:"Full report" },
          ].map((s, i) => (
            /* stat cells: alternate left/right entrance, 80ms stagger */
            <div key={i} className={`stat-cell ${i%2===0?"reveal-left":"reveal-right"}`}
              style={{ transitionDelay:`${i*80}ms` }}>
              <div style={{ fontSize:32, fontWeight:500, color:i%2===0?blue:cyan, fontVariantNumeric:"tabular-nums", marginBottom:6, textShadow:`0 0 24px ${i%2===0?"rgba(0,85,255,0.6)":"rgba(0,170,255,0.6)"}` }}>
                <StatCounter value={s.value} suffix={s.suffix} decimals={(s as { decimals?: number }).decimals} />
              </div>
              <div style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:dim }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Six Pillars ── */}
      <section className="section" id="pillars">
        <div className="container">
          <div className="reveal sec-hd">
            <p className="label">What we measure</p>
            <h2 className="sec-title">Six pillars of intelligence</h2>
            <p className="sec-sub">5 questions per dimension · 30 questions total</p>
          </div>
          <div className="pillars-grid">
            {PILLARS.map((p, i) => {
              const anim  = PILLAR_ANIMS[i];
              const delay = pillarDelay(i);
              // transition-based variants use transitionDelay;
              // animation-based (bounce/glitch) use animationDelay
              const isAnimBased = anim === "reveal-bounce" || anim === "reveal-glitch";
              const delayStyle  = isAnimBased
                ? { animationDelay: delay }
                : { transitionDelay: delay };

              return (
                /* pillar-cell: card on top, 3D canvas below
                   outer wrapper carries the per-pillar entrance animation */
                <div
                  key={i}
                  className={`pillar-cell ${anim}`}
                  style={delayStyle}
                >
                  {/* card — no reveal class, animation is on parent */}
                  <div
                    className="card card-3d"
                    style={{ borderRadius:"6px 6px 0 0" }}
                    onMouseMove={onTilt}
                    onMouseLeave={offTilt}
                  >
                    <div className="pillar-icon">
                      <span style={{ fontSize:16, color:i%2===0?blue:cyan, textShadow:`0 0 10px ${i%2===0?"rgba(0,85,255,0.8)":"rgba(0,170,255,0.8)"}` }}>
                        {PILLAR_ICONS[i]}
                      </span>
                    </div>
                    <div style={{ fontFamily:"monospace", fontSize:10, letterSpacing:"0.22em", color:blue, opacity:0.4, marginBottom:10 }}>{p.n}</div>
                    <div style={{ fontSize:14, fontWeight:500, marginBottom:8 }}>{p.name}</div>
                    <div style={{ fontSize:13, color:dim, lineHeight:1.65 }}>{p.desc}</div>
                  </div>

                  {/* 3D object — CSS sphere for Spatial (index 2), canvas for others */}
                  <div className="dim-3d-container">
                    {i === 2 ? <CssSphere /> : <Dim3D index={i} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section" id="how-it-works" style={{ background:"#050810" }}>
        <div className="container">
          <div className="how-grid">
            <div className="reveal">
              <p className="label">How it works</p>
              <h2 className="sec-title" style={{ marginBottom:48 }}>Simple process,<br />deep insights</h2>
              <div style={{ borderTop:`1px solid ${blue2}` }}>
                {STEPS.map((s, i) => (
                  <div key={i} style={{ display:"flex", gap:24, padding:"28px 0", borderBottom:`1px solid ${blue2}` }}>
                    <span style={{ fontFamily:"monospace", fontSize:22, color:i%2===0?blue:cyan, opacity:0.25, minWidth:44, lineHeight:1 }}>{s.n}</span>
                    <div>
                      <div style={{ fontSize:14, fontWeight:500, marginBottom:6 }}>{s.title}</div>
                      <div style={{ fontSize:13, color:dim, lineHeight:1.65 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card reveal" style={{ transitionDelay:"100ms", padding:28, boxShadow:`0 0 40px rgba(0,85,255,0.08), inset 0 1px 0 rgba(0,170,255,0.06)` }}>
              <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:dim, marginBottom:24 }}>Sample result</p>
              <div style={{ fontSize:88, fontWeight:300, color:blue, lineHeight:1, marginBottom:8, letterSpacing:"-0.03em", textShadow:`0 0 50px rgba(0,85,255,0.45), 0 0 100px rgba(0,170,255,0.15)`, animation:"neon-glow 3s ease-in-out infinite" }}>127</div>
              <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:dim, marginBottom:12 }}>Intelligence Quotient</p>
              <div style={{ display:"inline-block", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", padding:"6px 16px", marginBottom:24, border:`1px solid ${blue}`, color:cyan, boxShadow:`0 0 14px rgba(0,85,255,0.25)` }}>Superior Intelligence</div>
              <div style={{ height:3, background:blue2, position:"relative", overflow:"hidden", marginBottom:4, borderRadius:2 }}>
                <div style={{ position:"absolute", left:0, top:0, height:"100%", width:"72%", borderRadius:2 }} className="progress-neon" />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:dim, marginBottom:24 }}>
                <span>70</span><span>100</span><span>145+</span>
              </div>
              {[["Logic",88],["Verbal",75],["Spatial",70]].map(([n,w]) => (
                <div key={String(n)} style={{ display:"flex", alignItems:"center", gap:12, fontSize:12, marginBottom:10 }}>
                  <span style={{ width:64, textAlign:"right", color:dim, flexShrink:0 }}>{n}</span>
                  <div style={{ flex:1, height:2, background:blue2, position:"relative", borderRadius:1 }}>
                    <div className="progress-neon" style={{ position:"absolute", left:0, top:0, height:"100%", width:`${w}%`, borderRadius:1 }} />
                  </div>
                </div>
              ))}
              {[["Numerical",82],["Memory",65]].map(([n,w]) => (
                <div key={String(n)} style={{ display:"flex", alignItems:"center", gap:12, fontSize:12, marginBottom:10, filter:"blur(4px)", opacity:0.15, userSelect:"none" }}>
                  <span style={{ width:64, textAlign:"right", color:dim, flexShrink:0 }}>{n}</span>
                  <div style={{ flex:1, height:2, background:blue2, position:"relative", borderRadius:1 }}>
                    <div className="progress-neon" style={{ position:"absolute", left:0, top:0, height:"100%", width:`${w}%`, borderRadius:1 }} />
                  </div>
                </div>
              ))}
              <p style={{ fontSize:12, marginTop:16, color:"#6A88AA" }}>Full breakdown unlocked with Premium Report</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cognitive Radar Preview ── */}
      <section className="section" style={{ background: "#050810", borderTop: "1px solid rgba(0,85,255,0.10)" }}>
        <div className="container">
          <div style={{ display: "flex", gap: 56, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>

            {/* Radar chart */}
            <div className="reveal" style={{ transitionDelay: "80ms", flexShrink: 0 }}>
              <div style={{
                background: "rgba(5,10,25,0.7)", border: "1px solid rgba(0,85,255,0.18)",
                borderRadius: 12, padding: "28px 24px",
                boxShadow: "0 0 60px rgba(0,85,255,0.08), inset 0 1px 0 rgba(0,170,255,0.06)",
              }}>
                <RadarChart />
              </div>
            </div>

            {/* Copy */}
            <div className="reveal" style={{ maxWidth: 400, transitionDelay: "160ms" }}>
              <p className="label">Full Report</p>
              <h2 className="sec-title" style={{ marginBottom: 16 }}>Your cognitive<br />radar chart</h2>
              <p style={{ fontSize: 14, color: "#8AABCC", lineHeight: 1.75, marginBottom: 24 }}>
                The Premium Report includes your personal radar chart — a hexagonal visualisation
                of all six cognitive dimensions. See exactly where you excel and where you can grow.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {RADAR_DIMS.map((d) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                      background: d.color,
                      boxShadow: `0 0 8px ${d.color}`,
                    }} />
                    <span style={{ fontSize: 12, color: "#5577AA", width: 74 }}>{d.name}</span>
                    <div style={{ flex: 1, height: 3, background: "rgba(0,85,255,0.10)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${d.value}%`, borderRadius: 2,
                        background: d.color,
                        boxShadow: `0 0 8px ${d.color}`,
                        transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
                      }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: d.color, width: 24, textAlign: "right" }}>{d.value}</span>
                  </div>
                ))}
              </div>
              <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-primary">
                Get Your Profile →
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── Premium Features ── */}
      <section className="section">
        <div className="container">
          <div className="reveal sec-hd">
            <p className="label">Premium Report</p>
            <h2 className="sec-title">Everything in the full report</h2>
            <p className="sec-sub">One-time payment · €1.99 · Instant access</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              /* features: even = from-left, odd = from-right, 100ms stagger */
              <div key={i}
                className={`card ${i%2===0?"reveal-left":"reveal-right"}`}
                style={{ transitionDelay:`${i*100}ms`, display:"flex", gap:16 }}>
                <span style={{ color:i%2===0?blue:cyan, fontFamily:"monospace", fontSize:14, marginTop:2, flexShrink:0, textShadow:`0 0 10px ${i%2===0?"rgba(0,85,255,0.7)":"rgba(0,170,255,0.7)"}` }}>+</span>
                <div>
                  <div style={{ fontSize:14, fontWeight:500, marginBottom:6 }}>{f.title}</div>
                  <div style={{ fontSize:13, color:dim, lineHeight:1.65 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ marginTop:40, transitionDelay:"160ms" }}>
            <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-primary">Take the Free Test First</button>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="section" id="pricing" style={{ background:"#050810" }}>
        <div className="container">
          <div className="reveal sec-hd">
            <p className="label">Pricing</p>
            <h2 className="sec-title">Free to start,<br />powerful when unlocked</h2>
          </div>
          <div className="pricing-grid">
            <div className="card reveal" style={{ transitionDelay:"60ms", padding:32 }}>
              <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:dim, marginBottom:16 }}>Basic</p>
              <div style={{ fontSize:48, fontWeight:300, letterSpacing:"-0.03em", marginBottom:8 }}>Free</div>
              <p style={{ fontSize:13, color:dim, lineHeight:1.65, marginBottom:28 }}>Take the full test and receive your overall IQ score instantly.</p>
              <ul style={{ listStyle:"none", padding:0, margin:"0 0 28px", display:"flex", flexDirection:"column", gap:10 }}>
                {FREE_FEATURES.map(f => (
                  <li key={f} style={{ display:"flex", gap:12, fontSize:13 }}>
                    <span style={{ color:blue }}>+</span><span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-outline" style={{ width:"100%" }}>Start Free</button>
            </div>

            <div className="card reveal" style={{ transitionDelay:"120ms", padding:32, borderLeft:`3px solid ${blue}`, boxShadow:`0 0 40px rgba(0,85,255,0.14), 0 0 80px rgba(0,170,255,0.05)` }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:dim }}>Premium Report</p>
                <span style={{ fontSize:10, letterSpacing:"0.10em", textTransform:"uppercase", padding:"4px 10px", background:"rgba(0,85,255,0.12)", color:cyan, border:`1px solid rgba(0,170,255,0.30)`, boxShadow:"0 0 14px rgba(0,170,255,0.15)" }}>Best value</span>
              </div>
              <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:8 }}>
                <span style={{ fontSize:14, textDecoration:"line-through", color:dim }}>€3.99</span>
                <span style={{ fontSize:48, fontWeight:300, letterSpacing:"-0.03em" }}>€1.99</span>
              </div>
              <p style={{ fontSize:13, color:dim, lineHeight:1.65, marginBottom:28 }}>Complete cognitive profile with everything you need.</p>
              <ul style={{ listStyle:"none", padding:0, margin:"0 0 28px", display:"flex", flexDirection:"column", gap:10 }}>
                {PREMIUM_FEATURES.map(f => (
                  <li key={f} style={{ display:"flex", gap:12, fontSize:13 }}>
                    <span style={{ color:cyan }}>+</span><span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-primary" style={{ width:"100%" }}>Get Premium Report</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="section" style={{ borderTop:`1px solid ${blue2}` }}>
        <div className="container">
          <div className="reveal" style={{ maxWidth:560 }}>
            <h2 style={{ fontSize:"clamp(34px,5vw,54px)", fontWeight:300, letterSpacing:"-0.03em", lineHeight:1.1, marginBottom:20 }}>
              Ready to discover<br />your true IQ?
            </h2>
            <p style={{ fontSize:14, color:dim, lineHeight:1.7, marginBottom:32, maxWidth:360 }}>
              No registration required. Results in ~15 minutes. Based on standardised cognitive assessment formats.
            </p>
            <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-primary">Begin the Test — Free</button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop:`1px solid ${blue2}`, background:"#020408", padding:"40px 24px 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"grid", gap:32, marginBottom:36, gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))" }}>
            <div>
              <span style={{ fontSize:15, fontWeight:600, letterSpacing:"-0.01em", display:"flex", alignItems:"center", marginBottom:12 }}>
                <BrainLogo />
                Real<span style={{ color:blue, textShadow:`0 0 14px rgba(0,85,255,0.7)` }}>IQ</span>Test
              </span>
              <p style={{ fontSize:12, color:dim, lineHeight:1.7, maxWidth:180 }}>
                Scientifically calibrated cognitive assessment. Free IQ test with premium report.
              </p>
            </div>
            <div>
              <div style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:cyan, marginBottom:12 }}>Resources</div>
              {[
                { href:"/what-is-iq",           label:"What is IQ?" },
                { href:"/cognitive-dimensions",  label:"Cognitive Dimensions" },
                { href:"/iq-score-ranges",       label:"IQ Score Ranges" },
                { href:"/how-to-improve-iq",     label:"How to Improve IQ" },
                { href:"/sample-questions",      label:"Sample Questions" },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ display:"block", fontSize:13, color:dim, textDecoration:"none", marginBottom:6 }}>{l.label}</Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:cyan, marginBottom:12 }}>Company</div>
              {[
                { href:"/about",      label:"About" },
                { href:"/contact",    label:"Contact" },
                { href:"/faq",        label:"FAQ" },
                { href:"/disclaimer", label:"Disclaimer" },
                { href:"/privacy",    label:"Privacy Policy" },
                { href:"/terms",      label:"Terms" },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ display:"block", fontSize:13, color:dim, textDecoration:"none", marginBottom:6 }}>{l.label}</Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:cyan, marginBottom:12 }}>Take the Test</div>
              <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-primary" style={{ fontSize:11, padding:"12px 20px" }}>
                Free IQ Test
              </button>
              <p style={{ fontSize:12, color:dim, marginTop:12, lineHeight:1.6 }}>
                30 questions · 6 dimensions<br />~15 min · No signup required
              </p>
            </div>
          </div>
          <div style={{ borderTop:`1px solid ${blue2}`, paddingTop:18, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8, fontSize:12, color:"#6A88AA" }}>
            <span>© 2026 RealIQTest · realiqtest.co</span>
            <span>For informational purposes only. Not a clinical diagnostic tool.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
