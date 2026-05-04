"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ══════════════════════════════════════════════════════════════════════════
   NEURAL NETWORK CANVAS — high-density, dual-colour, multi-pulse
   Blue  #0055FF (G1) · Cyan #00AAFF (G2)
   Nodes: 120-220 depending on viewport
   Connections: every pair within 190 px
   Pulses: 4-6 spawned every 140 ms → constant neural firing
   Hub nodes: ~12% — bigger, brighter, slower moving
══════════════════════════════════════════════════════════════════════════ */

function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const G1 = "0,85,255";    // electric blue
    const G2 = "0,170,255";   // cyan

    const MAX_D   = 190;
    const FIRE_MS = 140;
    const HUB_RATIO = 0.12;

    interface Node {
      x: number; y: number;
      vx: number; vy: number;
      r: number; isHub: boolean;
      col: string;
      phase: number; phaseSpeed: number;
    }
    interface Pulse { i: number; j: number; t: number; speed: number; col: string; }

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
          r:  isHub ? 3.2 + Math.random() * 2.0 : 1.2 + Math.random() * 2.0,
          isHub,
          col: Math.random() < 0.65 ? G1 : G2,
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
      canvas.width  = w * dpr; canvas.height = h * dpr;
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
        } else {
          i = Math.floor(Math.random() * n);
        }
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
            ctx.lineWidth   = (nodes[i].isHub || nodes[j].isHub) ? 0.9 : 0.45;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      pulses = pulses.filter(p => {
        p.t += p.speed;
        const a = nodes[p.i], b = nodes[p.j];
        const env = Math.sin(p.t * Math.PI);

        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${p.col},${env * 0.52})`;
        ctx.lineWidth = 1.1; ctx.stroke();

        const px = a.x + (b.x - a.x) * p.t;
        const py = a.y + (b.y - a.y) * p.t;

        const halo = ctx.createRadialGradient(px, py, 0, px, py, 14);
        halo.addColorStop(0, `rgba(${p.col},${env * 0.58})`);
        halo.addColorStop(1, `rgba(${p.col},0)`);
        ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2);
        ctx.fillStyle = halo; ctx.fill();

        ctx.beginPath(); ctx.arc(px, py, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col},${env})`; ctx.fill();

        return p.t < 1;
      });

      for (const nd of nodes) {
        const pulse = 0.5 + 0.5 * Math.sin(nd.phase);
        const glowR = nd.isHub ? nd.r * 9 : nd.r * 6;
        const alpha0 = nd.isHub ? 0.18 + pulse * 0.32 : 0.10 + pulse * 0.18;

        const glo = ctx.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, glowR);
        glo.addColorStop(0, `rgba(${nd.col},${alpha0})`);
        glo.addColorStop(1, `rgba(${nd.col},0)`);
        ctx.beginPath(); ctx.arc(nd.x, nd.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glo; ctx.fill();

        const coreR = nd.r * (nd.isHub ? 0.8 + pulse * 0.5 : 0.6 + pulse * 0.5);
        const coreA = nd.isHub ? 0.78 + pulse * 0.22 : 0.50 + pulse * 0.45;
        ctx.beginPath(); ctx.arc(nd.x, nd.y, coreR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nd.col},${coreA})`; ctx.fill();

        if (nd.isHub) {
          ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.r * 2.4, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${nd.col},${0.14 + pulse * 0.26})`;
          ctx.lineWidth = 0.6; ctx.stroke();
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

  return (
    <canvas ref={ref} style={{ display: "block", width: "100%", height: "100%" }} aria-hidden="true" />
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BRAIN LOGO — minimalist SVG brain with pulsing neural dots
══════════════════════════════════════════════════════════════════════════ */

function BrainLogo() {
  return (
    <svg
      width="28" height="24" viewBox="0 0 28 24" fill="none"
      style={{ animation: "brain-pulse 2.5s ease-in-out infinite", flexShrink: 0, marginRight: 7 }}
      aria-hidden="true"
    >
      {/* Left hemisphere */}
      <path
        d="M14 2 C14 2 8 2.5 5.5 5.5 C3 8.5 3 11 4 13.5 C5 16 7 17 8 19 C9 20.5 9.5 21.5 11.5 21.5 C12.5 21.5 13.5 21 14 20.5"
        stroke="#0055FF" strokeWidth="1.6" fill="rgba(0,85,255,0.08)" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Right hemisphere */}
      <path
        d="M14 2 C14 2 20 2.5 22.5 5.5 C25 8.5 25 11 24 13.5 C23 16 21 17 20 19 C19 20.5 18.5 21.5 16.5 21.5 C15.5 21.5 14.5 21 14 20.5"
        stroke="#00AAFF" strokeWidth="1.6" fill="rgba(0,170,255,0.06)" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Cortex folds left */}
      <path d="M7 10 C8.5 8 10.5 9 11.5 11" stroke="#0055FF" strokeWidth="0.85" strokeLinecap="round" opacity="0.65"/>
      <path d="M6.5 14.5 C8.5 13 10 15 10.5 17" stroke="#0055FF" strokeWidth="0.85" strokeLinecap="round" opacity="0.55"/>
      {/* Cortex folds right */}
      <path d="M21 10 C19.5 8 17.5 9 16.5 11" stroke="#00AAFF" strokeWidth="0.85" strokeLinecap="round" opacity="0.65"/>
      <path d="M21.5 14.5 C19.5 13 18 15 17.5 17" stroke="#00AAFF" strokeWidth="0.85" strokeLinecap="round" opacity="0.55"/>
      {/* Center divider */}
      <line x1="14" y1="2" x2="14" y2="20.5" stroke="rgba(0,170,255,0.25)" strokeWidth="0.7" strokeDasharray="2,2.5"/>
      {/* Neural nodes */}
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
      {/* Synapse connection */}
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
   CUSTOM CURSOR — dot + lagging ring, direct DOM, no re-renders
══════════════════════════════════════════════════════════════════════════ */

function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef  = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafRef  = useRef(0);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    document.body.classList.add("has-cursor");
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      dot.style.left = e.clientX + "px";
      dot.style.top  = e.clientY + "px";
    };

    const animate = () => {
      const { x, y } = posRef.current;
      const rx = ringPos.current.x + (x - ringPos.current.x) * 0.14;
      const ry = ringPos.current.y + (y - ringPos.current.y) * 0.14;
      ringPos.current = { x: rx, y: ry };
      ring.style.left = rx + "px";
      ring.style.top  = ry + "px";
      rafRef.current  = requestAnimationFrame(animate);
    };

    const onDown = () => {
      dot.style.width  = "6px";
      dot.style.height = "6px";
      ring.style.width  = "20px";
      ring.style.height = "20px";
      ring.style.borderColor = "rgba(0,170,255,0.9)";
    };
    const onUp = () => {
      dot.style.width  = "10px";
      dot.style.height = "10px";
      ring.style.width  = "32px";
      ring.style.height = "32px";
      ring.style.borderColor = "rgba(0,85,255,0.55)";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafRef.current);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   NEURAL BRAIN VIZ — SVG orbital rings + pulsing nodes for hero
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
      {/* Outer pulse ring */}
      <circle cx={cx} cy={cy} r={outerR + 18} stroke="rgba(0,85,255,0.07)" fill="none" strokeWidth="1">
        <animate attributeName="r" values={`${outerR+18};${outerR+24};${outerR+18}`} dur="4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.4;0.12;0.4" dur="4s" repeatCount="indefinite"/>
      </circle>
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={outerR} stroke="rgba(0,85,255,0.12)" fill="none" strokeWidth="0.8"/>
      {/* Mid ring */}
      <circle cx={cx} cy={cy} r={midR} stroke="rgba(0,170,255,0.14)" fill="none" strokeWidth="0.8">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="3.5s" repeatCount="indefinite"/>
      </circle>
      {/* Inner ring */}
      <circle cx={cx} cy={cy} r={innerR} stroke="rgba(0,85,255,0.18)" fill="none" strokeWidth="0.8">
        <animate attributeName="r" values={`${innerR};${innerR+3};${innerR}`} dur="2.5s" repeatCount="indefinite"/>
      </circle>

      {/* Connections outer→mid */}
      {outer.map((n, i) => {
        const m = mid[i % midCount];
        return (
          <line key={`om${i}`} x1={n.x} y1={n.y} x2={m.x} y2={m.y}
            stroke="rgba(0,85,255,0.16)" strokeWidth="0.5">
            <animate attributeName="opacity" values="0.1;0.6;0.1" dur={`${2.2 + i * 0.35}s`} repeatCount="indefinite" begin={`${i * 0.4}s`}/>
          </line>
        );
      })}
      {/* Connections mid→center */}
      {mid.map((m, i) => (
        <line key={`mc${i}`} x1={m.x} y1={m.y} x2={cx} y2={cy}
          stroke="rgba(0,170,255,0.14)" strokeWidth="0.5">
          <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.28}s`}/>
        </line>
      ))}

      {/* Traveling pulses */}
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

      {/* Outer nodes */}
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
      {/* Mid nodes */}
      {mid.map((m, i) => (
        <g key={`mn${i}`}>
          <circle cx={m.x} cy={m.y} r="5" fill="rgba(0,170,255,0.08)" stroke="rgba(0,170,255,0.22)" strokeWidth="0.7"/>
          <circle cx={m.x} cy={m.y} r="2" fill="#00AAFF">
            <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2.4 + i * 0.28}s`} repeatCount="indefinite" begin={`${i * 0.35}s`}/>
          </circle>
        </g>
      ))}
      {/* Core */}
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
   DIMENSION ANIMATIONS — tiny SVG that appears inside each pillar card
══════════════════════════════════════════════════════════════════════════ */

function DimensionAnim({ index }: { index: number }) {
  const svgs = [
    /* 0 — Logical: 3×3 matrix cells highlight in sequence */
    <svg key={0} viewBox="0 0 48 48" width="48" height="48">
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <rect key={i} x={3 + (i%3)*15} y={3 + Math.floor(i/3)*15} width="12" height="12"
          rx="2" fill="rgba(0,85,255,0.12)" stroke="rgba(0,85,255,0.4)" strokeWidth="0.7">
          <animate attributeName="fill" values="rgba(0,85,255,0.12);rgba(0,85,255,0.5);rgba(0,85,255,0.12)"
            dur="2.4s" repeatCount="indefinite" begin={`${i * 0.27}s`}/>
        </rect>
      ))}
      <rect x={33} y={33} width="12" height="12" rx="2" fill="rgba(0,170,255,0.4)" stroke="#00AAFF" strokeWidth="0.7">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite"/>
      </rect>
    </svg>,

    /* 1 — Verbal: letters morph */
    <svg key={1} viewBox="0 0 48 48" width="48" height="48">
      <text x="4" y="22" fill="#00AAFF" fontSize="13" fontFamily="monospace" opacity="0.9">
        A<animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.8s" repeatCount="indefinite"/>
      </text>
      <text x="20" y="30" fill="#0055FF" fontSize="13" fontFamily="monospace" opacity="0.7">
        is<animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.2s" repeatCount="indefinite" begin="0.5s"/>
      </text>
      <text x="6" y="44" fill="#00AAFF" fontSize="12" fontFamily="monospace" opacity="0.6">
        to<animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="1s"/>
      </text>
      <text x="26" y="18" fill="#0055FF" fontSize="11" fontFamily="monospace" opacity="0.5">
        B<animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" begin="0.8s"/>
      </text>
    </svg>,

    /* 2 — Spatial: shape rotating */
    <svg key={2} viewBox="0 0 48 48" width="48" height="48">
      <g transform="translate(24 24)">
        <polygon points="-12,-8 12,-8 16,8 0,16 -16,8" fill="rgba(0,85,255,0.15)" stroke="#0055FF" strokeWidth="1">
          <animateTransform attributeName="transform" type="rotate" values="0;360" dur="5s" repeatCount="indefinite"/>
        </polygon>
        <circle cx="0" cy="0" r="3" fill="#00AAFF" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2.5s" repeatCount="indefinite"/>
        </circle>
      </g>
    </svg>,

    /* 3 — Numerical: bar chart growing */
    <svg key={3} viewBox="0 0 48 48" width="48" height="48">
      {[8,20,12,32,16].map((h, i) => (
        <rect key={i} x={4 + i * 9} y={44 - h} width="7" height={h} rx="1"
          fill={i % 2 === 0 ? "rgba(0,85,255,0.5)" : "rgba(0,170,255,0.5)"} stroke="none">
          <animate attributeName="height" values={`0;${h};${h}`} dur="2s" repeatCount="indefinite" begin={`${i * 0.2}s`}/>
          <animate attributeName="y" values={`44;${44-h};${44-h}`} dur="2s" repeatCount="indefinite" begin={`${i * 0.2}s`}/>
        </rect>
      ))}
    </svg>,

    /* 4 — Memory: colour circles flash in sequence */
    <svg key={4} viewBox="0 0 48 48" width="48" height="48">
      {[
        { cx:12, cy:12, fill:"#0055FF" },
        { cx:36, cy:12, fill:"#00AAFF" },
        { cx:12, cy:36, fill:"#9B59B6" },
        { cx:36, cy:36, fill:"#FF6B9D" },
      ].map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r="9" fill={c.fill} opacity="0.2">
          <animate attributeName="opacity" values="0.2;0.9;0.2" dur="2.4s" repeatCount="indefinite" begin={`${i * 0.6}s`}/>
        </circle>
      ))}
    </svg>,

    /* 5 — Speed: ticking number */
    <svg key={5} viewBox="0 0 48 48" width="48" height="48">
      <text x="24" y="32" textAnchor="middle" fill="#00AAFF" fontSize="22" fontFamily="monospace" fontWeight="600">
        738
        <animate attributeName="opacity" values="1;0.3;1" dur="0.6s" repeatCount="indefinite"/>
      </text>
      <line x1="4" y1="40" x2="44" y2="40" stroke="rgba(0,85,255,0.3)" strokeWidth="0.7"/>
      <circle cx="38" cy="14" r="3" fill="rgba(0,170,255,0.7)">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="0.5s" repeatCount="indefinite"/>
      </circle>
    </svg>,
  ];

  return (
    <div style={{
      position: "absolute", top: 16, right: 16,
      opacity: 0, transition: "opacity 0.35s ease",
      pointerEvents: "none",
    }} className="dim-anim">
      {svgs[index]}
    </div>
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
const LOCKED_FEATURES  = ["Radar chart", "Category breakdown", "Career matches", "PDF certificate"];
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
  wave.style.cssText = `
    position:absolute;width:${size}px;height:${size}px;
    left:${x}px;top:${y}px;border-radius:50%;
    background:rgba(255,255,255,0.28);pointer-events:none;
    animation:ripple-out 0.75s ease-out forwards;
  `;
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
  // reveal dimension anim
  const anim = card.querySelector<HTMLElement>(".dim-anim");
  if (anim) anim.style.opacity = "0.75";
}

function offTilt(e: React.MouseEvent<HTMLDivElement>) {
  const card = e.currentTarget;
  card.style.transform = "";
  card.style.borderColor = "";
  card.style.boxShadow = "";
  const anim = card.querySelector<HTMLElement>(".dim-anim");
  if (anim) anim.style.opacity = "0";
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
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add("visible"); io.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const blue  = "#0055FF";
  const cyan  = "#00AAFF";
  const blue2 = "rgba(0,85,255,0.18)";
  const dim   = "#3A5A8A";

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
      {/* Custom cursor */}
      <CustomCursor />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
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
          {["The Test", "How it works", "Pricing"].map(l => (
            <li key={l}
              style={{ fontSize: "13px", color: dim, cursor: "pointer", transition: "color 0.15s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#D6E4FF")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = dim)}>
              {l}
            </li>
          ))}
        </ul>

        <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-primary">Start Free</button>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{
        position: "relative", minHeight: "100dvh",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", background: "#03050F",
      }}>
        {/* Full-screen neural canvas */}
        <div className="canvas-wrap"><NeuralCanvas /></div>

        {/* Ambient glow blobs */}
        <div style={{
          position: "absolute", borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none",
          width: 640, height: 640,
          background: "radial-gradient(circle, rgba(0,85,255,0.16) 0%, transparent 70%)",
          top: "5%", left: "18%",
          animation: "hero-glow-drift 9s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", borderRadius: "50%", filter: "blur(70px)", pointerEvents: "none",
          width: 420, height: 420,
          background: "radial-gradient(circle, rgba(0,170,255,0.12) 0%, transparent 70%)",
          top: "45%", right: "12%",
          animation: "hero-glow-drift 12s ease-in-out infinite reverse",
        }} />
        <div style={{
          position: "absolute", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none",
          width: 280, height: 280,
          background: "radial-gradient(circle, rgba(0,85,255,0.10) 0%, transparent 70%)",
          bottom: "15%", left: "10%",
          animation: "hero-glow-drift 7s ease-in-out infinite",
          animationDelay: "-4s",
        }} />

        {/* Vignette */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(3,5,15,0.20) 0%, rgba(3,5,15,0.65) 100%)",
        }} />

        {/* Hero content */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 64, flexWrap: "wrap",
          padding: "96px 16px 64px",
          width: "100%", minHeight: "100dvh",
        }}>
          {/* Text block */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div className="h1" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, transparent, ${cyan})` }} />
              <span style={{
                fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase",
                fontWeight: 600, color: cyan,
                textShadow: `0 0 18px rgba(0,170,255,0.9)`,
              }}>
                Scientifically calibrated
              </span>
              <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, ${cyan}, transparent)` }} />
            </div>

            <h1 className="h2 hero-title">
              Discover your<br />
              <span className="text-gradient-anim">
                true intelligence
              </span>
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

            <p className="h4" style={{
              marginTop: 32, fontSize: 10, letterSpacing: "0.10em",
              color: "#1E3460", textShadow: "0 1px 4px rgba(0,0,0,0.9)",
            }}>
              30 questions · 6 dimensions · ~15 min · No signup required
            </p>
          </div>

          {/* Brain visualization — desktop only */}
          <div className="hero-brain-wrap" style={{ opacity: 0.8 }}>
            <NeuralBrainViz />
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 28,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          opacity: 0.30, zIndex: 10,
        }}>
          <span style={{ fontSize: 9, letterSpacing: "0.20em", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 30, background: `linear-gradient(to bottom, ${blue}, transparent)` }} />
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div style={{ background: "#050810", borderTop: `1px solid ${blue2}`, borderBottom: `1px solid ${blue2}` }}>
        <div className="stats-grid">
          {[
            { value: 30,   suffix: "",     label: "Questions" },
            { value: 6,    suffix: "",     label: "Cognitive dimensions" },
            { value: 15,   suffix: " min", label: "Average duration" },
            { value: 1.99, suffix: "€", decimals: 2, label: "Full report" },
          ].map((s, i) => (
            <div key={i} className="stat-cell reveal" style={{ transitionDelay: `${i * 60}ms` }}>
              <div style={{
                fontSize: 32, fontWeight: 500,
                color: i % 2 === 0 ? blue : cyan,
                fontVariantNumeric: "tabular-nums", marginBottom: 6,
                textShadow: `0 0 24px ${i % 2 === 0 ? "rgba(0,85,255,0.6)" : "rgba(0,170,255,0.6)"}`,
              }}>
                <StatCounter value={s.value} suffix={s.suffix} decimals={(s as { decimals?: number }).decimals} />
              </div>
              <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: dim }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Six Pillars ──────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="reveal sec-hd">
            <p className="label">What we measure</p>
            <h2 className="sec-title">Six pillars of intelligence</h2>
            <p className="sec-sub">5 questions per dimension · 30 questions total</p>
          </div>
          <div className="pillars-grid">
            {PILLARS.map((p, i) => (
              <div
                key={i}
                className="card card-3d reveal"
                style={{ transitionDelay: `${i * 55}ms`, position: "relative" }}
                onMouseMove={onTilt}
                onMouseLeave={offTilt}
              >
                <DimensionAnim index={i} />
                <div className="pillar-icon">
                  <span style={{
                    fontSize: 16,
                    color: i % 2 === 0 ? blue : cyan,
                    textShadow: `0 0 10px ${i % 2 === 0 ? "rgba(0,85,255,0.8)" : "rgba(0,170,255,0.8)"}`,
                  }}>{PILLAR_ICONS[i]}</span>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.22em", color: blue, opacity: 0.4, marginBottom: 10 }}>{p.n}</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: dim, lineHeight: 1.65 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="section" style={{ background: "#050810" }}>
        <div className="container">
          <div className="how-grid">
            <div className="reveal">
              <p className="label">How it works</p>
              <h2 className="sec-title" style={{ marginBottom: 48 }}>Simple process,<br />deep insights</h2>
              <div style={{ borderTop: `1px solid ${blue2}` }}>
                {STEPS.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 24, padding: "28px 0", borderBottom: `1px solid ${blue2}` }}>
                    <span style={{
                      fontFamily: "monospace", fontSize: 22,
                      color: i % 2 === 0 ? blue : cyan, opacity: 0.25,
                      minWidth: 44, lineHeight: 1,
                    }}>{s.n}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{s.title}</div>
                      <div style={{ fontSize: 13, color: dim, lineHeight: 1.65 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card reveal" style={{
              transitionDelay: "100ms", padding: 28,
              boxShadow: `0 0 40px rgba(0,85,255,0.08), inset 0 1px 0 rgba(0,170,255,0.06)`,
            }}>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: dim, marginBottom: 24 }}>Sample result</p>
              <div style={{
                fontSize: 88, fontWeight: 300, color: blue, lineHeight: 1, marginBottom: 8,
                letterSpacing: "-0.03em",
                textShadow: `0 0 50px rgba(0,85,255,0.45), 0 0 100px rgba(0,170,255,0.15)`,
                animation: "neon-glow 3s ease-in-out infinite",
              }}>127</div>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: dim, marginBottom: 12 }}>Intelligence Quotient</p>
              <div style={{
                display: "inline-block", fontSize: 10, letterSpacing: "0.14em",
                textTransform: "uppercase", padding: "6px 16px", marginBottom: 24,
                border: `1px solid ${blue}`, color: cyan, boxShadow: `0 0 14px rgba(0,85,255,0.25)`,
              }}>Superior Intelligence</div>
              <div style={{ height: 3, background: blue2, position: "relative", overflow: "hidden", marginBottom: 4, borderRadius: 2 }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "72%", borderRadius: 2 }} className="progress-neon" />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: dim, marginBottom: 24 }}>
                <span>70</span><span>100</span><span>145+</span>
              </div>
              {[["Logic", 88], ["Verbal", 75], ["Spatial", 70]].map(([n, w]) => (
                <div key={String(n)} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, marginBottom: 10 }}>
                  <span style={{ width: 64, textAlign: "right", color: dim, flexShrink: 0 }}>{n}</span>
                  <div style={{ flex: 1, height: 2, background: blue2, position: "relative", borderRadius: 1 }}>
                    <div className="progress-neon" style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${w}%`, borderRadius: 1 }} />
                  </div>
                </div>
              ))}
              {[["Numerical", 82], ["Memory", 65]].map(([n, w]) => (
                <div key={String(n)} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, marginBottom: 10, filter: "blur(4px)", opacity: 0.15, userSelect: "none" }}>
                  <span style={{ width: 64, textAlign: "right", color: dim, flexShrink: 0 }}>{n}</span>
                  <div style={{ flex: 1, height: 2, background: blue2, position: "relative", borderRadius: 1 }}>
                    <div className="progress-neon" style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${w}%`, borderRadius: 1 }} />
                  </div>
                </div>
              ))}
              <p style={{ fontSize: 12, marginTop: 16, color: "#1E3460" }}>Full breakdown unlocked with Premium Report</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Premium Features ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="reveal sec-hd">
            <p className="label">Premium Report</p>
            <h2 className="sec-title">Everything in the full report</h2>
            <p className="sec-sub">One-time payment · €1.99 · Instant access</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="card reveal" style={{ transitionDelay: `${i * 35}ms`, display: "flex", gap: 16 }}>
                <span style={{
                  color: i % 2 === 0 ? blue : cyan, fontFamily: "monospace",
                  fontSize: 14, marginTop: 2, flexShrink: 0,
                  textShadow: `0 0 10px ${i % 2 === 0 ? "rgba(0,85,255,0.7)" : "rgba(0,170,255,0.7)"}`,
                }}>+</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: dim, lineHeight: 1.65 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ marginTop: 40, transitionDelay: "160ms" }}>
            <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-primary">Take the Free Test First</button>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: "#050810" }}>
        <div className="container">
          <div className="reveal sec-hd">
            <p className="label">Pricing</p>
            <h2 className="sec-title">Free to start,<br />powerful when unlocked</h2>
          </div>
          <div className="pricing-grid">
            <div className="card reveal" style={{ transitionDelay: "60ms", padding: 32 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: dim, marginBottom: 16 }}>Basic</p>
              <div style={{ fontSize: 48, fontWeight: 300, letterSpacing: "-0.03em", marginBottom: 8 }}>Free</div>
              <p style={{ fontSize: 13, color: dim, lineHeight: 1.65, marginBottom: 28 }}>Take the full test and receive your overall IQ score instantly.</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                {FREE_FEATURES.map(f => (
                  <li key={f} style={{ display: "flex", gap: 12, fontSize: 13 }}>
                    <span style={{ color: blue }}>+</span><span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-outline" style={{ width: "100%" }}>Start Free</button>
            </div>

            <div className="card reveal" style={{
              transitionDelay: "120ms", padding: 32,
              borderLeft: `3px solid ${blue}`,
              boxShadow: `0 0 40px rgba(0,85,255,0.14), 0 0 80px rgba(0,170,255,0.05)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: dim }}>Premium Report</p>
                <span style={{
                  fontSize: 10, letterSpacing: "0.10em", textTransform: "uppercase",
                  padding: "4px 10px", background: "rgba(0,85,255,0.12)", color: cyan,
                  border: `1px solid rgba(0,170,255,0.30)`,
                  boxShadow: "0 0 14px rgba(0,170,255,0.15)",
                }}>Best value</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 14, textDecoration: "line-through", color: dim }}>€3.99</span>
                <span style={{ fontSize: 48, fontWeight: 300, letterSpacing: "-0.03em" }}>€1.99</span>
              </div>
              <p style={{ fontSize: 13, color: dim, lineHeight: 1.65, marginBottom: 28 }}>Complete cognitive profile with everything you need.</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                {PREMIUM_FEATURES.map(f => (
                  <li key={f} style={{ display: "flex", gap: 12, fontSize: 13 }}>
                    <span style={{ color: cyan }}>+</span><span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-primary" style={{ width: "100%" }}>Get Premium Report</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ───────────────────────────────────────────────────── */}
      <section className="section" style={{ borderTop: `1px solid ${blue2}` }}>
        <div className="container">
          <div className="reveal" style={{ maxWidth: 560 }}>
            <h2 style={{ fontSize: "clamp(34px,5vw,54px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
              Ready to discover<br />your true IQ?
            </h2>
            <p style={{ fontSize: 14, color: dim, lineHeight: 1.7, marginBottom: 32, maxWidth: 360 }}>
              No registration required. Results in ~15 minutes. Based on standardised cognitive assessment formats.
            </p>
            <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-primary">Begin the Test — Free</button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${blue2}`, background: "#020408", padding: "40px 24px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "grid", gap: 32, marginBottom: 36,
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", display: "flex", alignItems: "center", marginBottom: 12 }}>
                <BrainLogo />
                Real<span style={{ color: blue, textShadow: `0 0 14px rgba(0,85,255,0.7)` }}>IQ</span>Test
              </span>
              <p style={{ fontSize: 12, color: dim, lineHeight: 1.7, maxWidth: 180 }}>
                Scientifically calibrated cognitive assessment. Free IQ test with premium report.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: cyan, marginBottom: 12 }}>Resources</div>
              {[
                { href: "/what-is-iq", label: "What is IQ?" },
                { href: "/cognitive-dimensions", label: "Cognitive Dimensions" },
                { href: "/iq-score-ranges", label: "IQ Score Ranges" },
                { href: "/how-to-improve-iq", label: "How to Improve IQ" },
                { href: "/sample-questions", label: "Sample Questions" },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ display: "block", fontSize: 13, color: dim, textDecoration: "none", marginBottom: 6 }}>{l.label}</Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: cyan, marginBottom: 12 }}>Company</div>
              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/faq", label: "FAQ" },
                { href: "/disclaimer", label: "Disclaimer" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms" },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ display: "block", fontSize: 13, color: dim, textDecoration: "none", marginBottom: 6 }}>{l.label}</Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: cyan, marginBottom: 12 }}>Take the Test</div>
              <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-primary" style={{ fontSize: 11, padding: "12px 20px" }}>
                Free IQ Test
              </button>
              <p style={{ fontSize: 12, color: dim, marginTop: 12, lineHeight: 1.6 }}>
                30 questions · 6 dimensions<br />~15 min · No signup required
              </p>
            </div>
          </div>
          <div style={{
            borderTop: `1px solid ${blue2}`, paddingTop: 18,
            display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
            fontSize: 12, color: "#1E3460",
          }}>
            <span>© 2026 RealIQTest · realiqtest.co</span>
            <span>For informational purposes only. Not a clinical diagnostic tool.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
