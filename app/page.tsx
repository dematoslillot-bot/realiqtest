"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NeuralScene from "./components/NeuralScene";

/* ══════════════════════════════════════════════════════════════════════════
   NEUROTECH DESIGN TOKENS — traveling through your own brain
══════════════════════════════════════════════════════════════════════════ */

const INDIGO = "#5B4FFF";
const CYAN   = "#00F5D4";
const VIOLET = "#A78BFA";
const GOLD   = "#FFD700";
const CORAL  = "#FF6B6B";
const AMBER  = "#FF9F1C";
const TXT    = "#E8E8F0";
const DIM    = "#8A8FB8";
const GLASS  = "rgba(8,12,32,0.72)";
const BORD   = "rgba(91,79,255,0.20)";

/* One accent per cognitive dimension */
const DIM_COLORS = [INDIGO, VIOLET, CYAN, GOLD, CORAL, AMBER];

/* ══════════════════════════════════════════════════════════════════════════
   BRAIN LOGO
══════════════════════════════════════════════════════════════════════════ */

function BrainLogo() {
  return (
    <svg width="28" height="24" viewBox="0 0 28 24" fill="none"
      style={{ animation: "brain-pulse 2.5s ease-in-out infinite", flexShrink: 0, marginRight: 7 }}
      aria-hidden="true">
      <path d="M14 2 C14 2 8 2.5 5.5 5.5 C3 8.5 3 11 4 13.5 C5 16 7 17 8 19 C9 20.5 9.5 21.5 11.5 21.5 C12.5 21.5 13.5 21 14 20.5"
        stroke={INDIGO} strokeWidth="1.6" fill="rgba(91,79,255,0.08)" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2 C14 2 20 2.5 22.5 5.5 C25 8.5 25 11 24 13.5 C23 16 21 17 20 19 C19 20.5 18.5 21.5 16.5 21.5 C15.5 21.5 14.5 21 14 20.5"
        stroke={CYAN} strokeWidth="1.6" fill="rgba(0,245,212,0.06)" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 10 C8.5 8 10.5 9 11.5 11" stroke={INDIGO} strokeWidth="0.85" strokeLinecap="round" opacity="0.65"/>
      <path d="M6.5 14.5 C8.5 13 10 15 10.5 17" stroke={INDIGO} strokeWidth="0.85" strokeLinecap="round" opacity="0.55"/>
      <path d="M21 10 C19.5 8 17.5 9 16.5 11" stroke={CYAN} strokeWidth="0.85" strokeLinecap="round" opacity="0.65"/>
      <path d="M21.5 14.5 C19.5 13 18 15 17.5 17" stroke={CYAN} strokeWidth="0.85" strokeLinecap="round" opacity="0.55"/>
      <line x1="14" y1="2" x2="14" y2="20.5" stroke="rgba(0,245,212,0.25)" strokeWidth="0.7" strokeDasharray="2,2.5"/>
      <circle cx="8.5" cy="10" r="1.3" fill={INDIGO} opacity="0.85">
        <animate attributeName="opacity" values="0.85;1;0.5;1;0.85" dur="2.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="19.5" cy="10" r="1.3" fill={CYAN} opacity="0.75">
        <animate attributeName="opacity" values="0.75;1;0.5;1;0.75" dur="2.8s" repeatCount="indefinite" begin="0.6s"/>
      </circle>
      <circle cx="7.5" cy="15" r="1.1" fill={INDIGO} opacity="0.7">
        <animate attributeName="opacity" values="0.7;1;0.4;1;0.7" dur="1.9s" repeatCount="indefinite" begin="1.1s"/>
      </circle>
      <circle cx="20.5" cy="15" r="1.1" fill={CYAN} opacity="0.65">
        <animate attributeName="opacity" values="0.65;1;0.4;1;0.65" dur="2.4s" repeatCount="indefinite" begin="0.3s"/>
      </circle>
      <line x1="8.5" y1="10" x2="19.5" y2="10" stroke="rgba(0,245,212,0.22)" strokeWidth="0.5">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite"/>
      </line>
      <line x1="7.5" y1="15" x2="20.5" y2="15" stroke="rgba(91,79,255,0.18)" strokeWidth="0.5">
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.1s" repeatCount="indefinite" begin="0.8s"/>
      </line>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MICRO-INTERACTIONS — scroll progress bar + custom cursor ring
══════════════════════════════════════════════════════════════════════════ */

function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        el.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className="scroll-progress" style={{ width: "100%", transform: "scaleX(0)" }} />;
}

function CursorRing() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top  = `${e.clientY}px`;
      const t = e.target as HTMLElement;
      const hot = !!t.closest("button, a, [data-hot]");
      el.classList.toggle("cursor-hot", hot);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div ref={ref} className="cursor-dot" style={{ left: -50, top: -50 }} aria-hidden="true" />;
}

/* ══════════════════════════════════════════════════════════════════════════
   HERO — letter-assembly headline + floating IQ scores
══════════════════════════════════════════════════════════════════════════ */

function lerpHex(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (sh: number) => {
    const va = (pa >> sh) & 255, vb = (pb >> sh) & 255;
    return Math.round(va + (vb - va) * t);
  };
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}

function AssembledLine({ text, baseDelay, gradient, style }: {
  text: string; baseDelay: number; gradient?: [string, string]; style?: React.CSSProperties;
}) {
  const chars = [...text];
  return (
    <span style={{ display: "inline-block", whiteSpace: "pre-wrap", ...style }}>
      {chars.map((c, i) => (
        <span key={i} className="letter-in" style={{
          animationDelay: `${baseDelay + i * 38}ms`,
          color: gradient ? lerpHex(gradient[0], gradient[1], chars.length > 1 ? i / (chars.length - 1) : 0) : undefined,
          textShadow: gradient ? `0 0 28px ${lerpHex(gradient[0], gradient[1], chars.length > 1 ? i / (chars.length - 1) : 0)}55` : undefined,
        }}>{c === " " ? " " : c}</span>
      ))}
    </span>
  );
}

const FLOAT_SCORES = [
  { v: 127, left: "11%", top: "22%", col: INDIGO, delay: 0,   size: 15 },
  { v: 134, left: "84%", top: "30%", col: CYAN,   delay: 1.4, size: 13 },
  { v: 118, left: "7%",  top: "64%", col: VIOLET, delay: 2.8, size: 12 },
  { v: 142, left: "88%", top: "66%", col: INDIGO, delay: 0.7, size: 14 },
  { v: 121, left: "20%", top: "82%", col: CYAN,   delay: 3.5, size: 11 },
  { v: 131, left: "76%", top: "12%", col: VIOLET, delay: 2.1, size: 12 },
];

function FloatingScores() {
  return (
    <div className="iq-scores" aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
      {FLOAT_SCORES.map((s, i) => (
        <span key={i} className="iq-float" style={{
          left: s.left, top: s.top, color: s.col, fontSize: s.size,
          animationDelay: `${s.delay}s`, opacity: 0,
        }}>{s.v}</span>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   STAT COUNTER — counts up when entering viewport
══════════════════════════════════════════════════════════════════════════ */

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
  return <span ref={ref} className="num-mono">{decimals ? value.toFixed(decimals) : value}{suffix}</span>;
}

/* ══════════════════════════════════════════════════════════════════════════
   DATA — all copy preserved verbatim
══════════════════════════════════════════════════════════════════════════ */

const PILLAR_ANIMS = [
  "reveal-left", "reveal-right", "reveal-scale",
  "reveal-bounce", "reveal-glitch", "reveal-blur",
] as const;

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

const STEP_PATHS = [
  /* checklist grid */ "M4 5 h7 v7 h-7 Z M13 5 h7 v7 h-7 Z M4 14 h7 v7 h-7 Z M14 16 l2.5 2.5 L21 14",
  /* chip / algorithm */ "M8 8 h8 v8 h-8 Z M12 2 v4 M12 18 v4 M2 12 h4 M18 12 h4 M5 5 l3 3 M19 5 l-3 3 M5 19 l3-3 M19 19 l-3-3",
  /* gauge / score */ "M4 18 a8 8 0 1 1 16 0 M12 18 L16 11 M12 18 a1.5 1.5 0 1 0 0.01 0",
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

/* ══════════════════════════════════════════════════════════════════════════
   RADAR CHART — NASA-grade data viz: draws on scroll, morphs between
   sample cognitive profiles in a loop, vertices in dimension colors
══════════════════════════════════════════════════════════════════════════ */

const RADAR_NAMES = ["Logical", "Verbal", "Spatial", "Numerical", "Memory", "Speed"];
const RADAR_PROFILES = [
  [78, 92, 65, 88, 71, 85],
  [88, 70, 84, 64, 90, 76],
  [66, 84, 91, 78, 62, 87],
  [92, 64, 74, 86, 81, 70],
];

function RadarChart() {
  const [vals, setVals] = useState<number[]>(RADAR_PROFILES[0].map(() => 0));
  const [hovered, setHovered] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const stateRef = useRef({ drawn: false, profile: 0 });

  const CX = 160, CY = 160, R = 110;

  /* Draw-in on scroll, then morph between sample profiles in a loop */
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    let raf = 0;

    const animateTo = (target: number[], dur: number, from: number[]) => {
      cancelAnimationFrame(raf);
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - t0) / dur, 1);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setVals(target.map((tv, i) => from[i] + (tv - from[i]) * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || stateRef.current.drawn) return;
      stateRef.current.drawn = true;
      io.disconnect();
      animateTo(RADAR_PROFILES[0], 1400, RADAR_PROFILES[0].map(() => 0));
      interval = setInterval(() => {
        const cur = RADAR_PROFILES[stateRef.current.profile];
        stateRef.current.profile = (stateRef.current.profile + 1) % RADAR_PROFILES.length;
        animateTo(RADAR_PROFILES[stateRef.current.profile], 1600, cur);
      }, 3400);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); if (interval) clearInterval(interval); cancelAnimationFrame(raf); };
  }, []);

  const angleOf = (i: number) => (i * 60 - 90) * (Math.PI / 180);
  const axisEnd = (i: number): [number, number] => [CX + R * Math.cos(angleOf(i)), CY + R * Math.sin(angleOf(i))];
  const dataPoint = (i: number): [number, number] => {
    const r = R * (vals[i] / 100);
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

  const dataPolygon = Array.from({ length: 6 }, (_, i) => dataPoint(i).join(",")).join(" ");

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg ref={svgRef} viewBox="0 0 320 320" width="320" height="320"
        style={{ overflow: "visible", filter: "drop-shadow(0 0 24px rgba(91,79,255,0.2))" }}>

        {/* Concentric hex grid — outer ring pulses subtly */}
        {[0.25, 0.5, 0.75, 1].map(pct => (
          <polygon key={pct} points={hexPoints(pct)}
            fill={pct === 1 ? "rgba(91,79,255,0.03)" : "none"}
            stroke={pct === 1 ? "rgba(91,79,255,0.25)" : "rgba(91,79,255,0.10)"}
            strokeWidth={pct === 1 ? 1.2 : 0.7}>
            {pct === 1 && <animate attributeName="stroke-opacity" values="1;0.45;1" dur="4s" repeatCount="indefinite" />}
          </polygon>
        ))}

        {[25, 50, 75].map(pct => (
          <text key={pct}
            x={CX + R * 0.01 * pct * Math.cos(angleOf(0)) + 5}
            y={CY + R * 0.01 * pct * Math.sin(angleOf(0)) - 4}
            fill="rgba(110,115,165,0.7)" fontSize="7.5" fontFamily="var(--font-mono), monospace"
          >{pct}</text>
        ))}

        {Array.from({ length: 6 }, (_, i) => {
          const [ex, ey] = axisEnd(i);
          return (
            <line key={i} x1={CX} y1={CY} x2={ex} y2={ey}
              stroke="rgba(91,79,255,0.18)" strokeWidth="1" strokeDasharray="3,3" />
          );
        })}

        <polygon points={dataPolygon} fill="rgba(91,79,255,0.10)" stroke="none" />
        <polygon points={dataPolygon} fill="none" stroke="rgba(91,79,255,0.9)" strokeWidth="2"
          style={{ filter: "drop-shadow(0 0 6px rgba(91,79,255,0.7))" }} />

        {Array.from({ length: 6 }, (_, i) => {
          const [px, py] = dataPoint(i);
          const col = DIM_COLORS[i];
          const isHov = hovered === i;
          return (
            <g key={i} style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              {isHov && <circle cx={px} cy={py} r={14} fill="none" stroke={col} strokeWidth="1" opacity="0.35" />}
              <circle cx={px} cy={py} r={isHov ? 7 : 5} fill={col}
                style={{ transition: "r 0.15s", filter: `drop-shadow(0 0 ${isHov ? 8 : 4}px ${col})` }} />
              {isHov && (
                <g>
                  <rect x={px - 22} y={py - 30} width={44} height={22} rx={4} ry={4}
                    fill="rgba(5,8,22,0.92)" stroke={col} strokeWidth="1" />
                  <text x={px} y={py - 18} textAnchor="middle" dominantBaseline="middle"
                    fill={col} fontSize="11" fontWeight="700" fontFamily="var(--font-mono), monospace">
                    {Math.round(vals[i])}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {Array.from({ length: 6 }, (_, i) => {
          const [lx, ly] = labelPos(i);
          const isHov = hovered === i;
          return (
            <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              fill={isHov ? DIM_COLORS[i] : "#6E73A5"}
              fontSize={isHov ? "11.5" : "10.5"} fontWeight={isHov ? "700" : "400"}
              style={{ transition: "fill 0.15s, font-size 0.15s", cursor: "pointer" }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              {RADAR_NAMES[i]}
            </text>
          );
        })}

        <circle cx={CX} cy={CY} r={3} fill={INDIGO} opacity="0.6" />
      </svg>

      <p style={{ fontSize: 11, color: DIM, marginTop: 8, letterSpacing: "0.04em" }}>
        Hover each vertex to explore your dimensions
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   HOW IT WORKS — pinned horizontal scroll with SVG stroke-draw icons
══════════════════════════════════════════════════════════════════════════ */

function StepIcon({ d, active, color }: { d: string; active: boolean; color: string }) {
  return (
    <svg width="46" height="46" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      style={{ filter: `drop-shadow(0 0 10px ${color}66)` }}>
      <path d={d} strokeDasharray="120"
        className={active ? "draw-on" : undefined}
        style={{ strokeDashoffset: 120 }} />
    </svg>
  );
}

function StepCard({ s, i, active }: { s: typeof STEPS[number]; i: number; active: boolean }) {
  const col = [INDIGO, CYAN, VIOLET][i];
  return (
    <div style={{
      background: GLASS, border: `1px solid ${active ? `${col}55` : BORD}`,
      backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
      borderRadius: 16, padding: "34px 30px",
      width: "100%", maxWidth: 380, flexShrink: 0,
      boxShadow: active ? `0 0 50px ${col}1f, inset 0 1px 0 ${col}22` : "0 8px 32px rgba(0,0,0,0.4)",
      transition: "border-color 0.5s, box-shadow 0.5s, transform 0.5s",
      transform: active ? "translateY(0) scale(1)" : "translateY(10px) scale(0.97)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <StepIcon d={STEP_PATHS[i]} active={active} color={col} />
        <span className="num-mono" style={{ fontSize: 30, color: col, opacity: 0.30, fontWeight: 700 }}>{s.n}</span>
      </div>
      <div className="font-head" style={{ fontSize: 19, fontWeight: 700, marginBottom: 10, color: TXT, letterSpacing: "-0.01em" }}>{s.title}</div>
      <div style={{ fontSize: 13.5, color: DIM, lineHeight: 1.7 }}>{s.desc}</div>
    </div>
  );
}

function SampleResultCard() {
  return (
    <div style={{
      background: GLASS, border: `1px solid rgba(91,79,255,0.35)`,
      backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
      borderRadius: 16, padding: 28, width: "100%", maxWidth: 380, flexShrink: 0,
      boxShadow: `0 0 60px rgba(91,79,255,0.12), inset 0 1px 0 rgba(0,245,212,0.06)`,
    }}>
      <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: DIM, marginBottom: 20 }}>Sample result</p>
      <div className="num-mono" style={{ fontSize: 76, fontWeight: 700, color: INDIGO, lineHeight: 1, marginBottom: 8, letterSpacing: "-0.03em", textShadow: `0 0 50px rgba(91,79,255,0.45), 0 0 100px rgba(0,245,212,0.15)`, animation: "neon-glow 3s ease-in-out infinite" }}>127</div>
      <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: DIM, marginBottom: 12 }}>Intelligence Quotient</p>
      <div style={{ display: "inline-block", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", padding: "6px 16px", marginBottom: 22, border: `1px solid ${INDIGO}`, color: CYAN, boxShadow: `0 0 14px rgba(91,79,255,0.25)`, borderRadius: 4 }}>Superior Intelligence</div>
      <div style={{ height: 3, background: BORD, position: "relative", overflow: "hidden", marginBottom: 4, borderRadius: 2 }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "72%", borderRadius: 2 }} className="progress-neon" />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: DIM, marginBottom: 20 }} className="num-mono">
        <span>70</span><span>100</span><span>145+</span>
      </div>
      {([["Logic", 88, INDIGO], ["Verbal", 75, VIOLET], ["Spatial", 70, CYAN]] as const).map(([n, w, c]) => (
        <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, marginBottom: 10 }}>
          <span style={{ width: 64, textAlign: "right", color: DIM, flexShrink: 0 }}>{n}</span>
          <div style={{ flex: 1, height: 2, background: BORD, position: "relative", borderRadius: 1 }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${w}%`, borderRadius: 1, background: c, boxShadow: `0 0 8px ${c}` }} />
          </div>
        </div>
      ))}
      {([["Numerical", 82], ["Memory", 65]] as const).map(([n, w]) => (
        <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, marginBottom: 10, filter: "blur(4px)", opacity: 0.15, userSelect: "none" }}>
          <span style={{ width: 64, textAlign: "right", color: DIM, flexShrink: 0 }}>{n}</span>
          <div style={{ flex: 1, height: 2, background: BORD, position: "relative", borderRadius: 1 }}>
            <div className="progress-neon" style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${w}%`, borderRadius: 1 }} />
          </div>
        </div>
      ))}
      <p style={{ fontSize: 12, marginTop: 14, color: "#6E73A5" }}>Full breakdown unlocked with Premium Report</p>
    </div>
  );
}

function HowItWorks() {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef  = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const wrap = wrapRef.current, track = trackRef.current;
        if (!wrap || !track) return;
        if (window.innerWidth < 768) { track.style.transform = ""; setActiveStep(3); return; }
        const rect = wrap.getBoundingClientRect();
        const total = wrap.offsetHeight - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), total);
        const p = total > 0 ? scrolled / total : 0;
        const overflow = track.scrollWidth - track.clientWidth;
        track.style.transform = `translateX(${-p * overflow}px)`;
        if (lineRef.current) lineRef.current.style.transform = `scaleX(${p})`;
        setActiveStep(Math.min(3, Math.floor(p * 4.2)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <section id="how-it-works" style={{ background: "#04060f", borderTop: `1px solid ${BORD}` }}>
      <style>{`
        .hiw-wrap   { height: 280vh; position: relative; }
        .hiw-sticky { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
        .hiw-track  { display: flex; gap: 28px; padding: 0 max(6vw, 40px); will-change: transform; align-items: stretch; }
        @media (max-width: 767px) {
          .hiw-wrap   { height: auto; }
          .hiw-sticky { position: relative; height: auto; padding: 64px 0; }
          .hiw-track  { flex-direction: column; align-items: center; transform: none !important; padding: 0 18px; gap: 16px; }
        }
      `}</style>
      <div ref={wrapRef} className="hiw-wrap">
        <div className="hiw-sticky">
          <div className="container" style={{ width: "100%", marginBottom: 36 }}>
            <p className="label">How it works</p>
            <h2 className="sec-title font-head" style={{ marginBottom: 10 }}>Simple process,<br />deep insights</h2>
            <div style={{ height: 2, background: BORD, borderRadius: 1, maxWidth: 420, marginTop: 18, overflow: "hidden" }}>
              <div ref={lineRef} style={{
                height: "100%", width: "100%", transformOrigin: "left", transform: "scaleX(0)",
                background: `linear-gradient(90deg, ${INDIGO}, ${CYAN})`,
                boxShadow: `0 0 10px ${INDIGO}`,
              }} />
            </div>
          </div>
          <div ref={trackRef} className="hiw-track">
            {STEPS.map((s, i) => <StepCard key={i} s={s} i={i} active={activeStep >= i} />)}
            <SampleResultCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PRICING — glassmorphism + animated gradient border + particles
══════════════════════════════════════════════════════════════════════════ */

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 73) % 100,
  bottom: (i * 31) % 40,
  dur: 3.5 + (i % 5),
  delay: (i % 7) * 0.8,
  col: i % 3 === 0 ? CYAN : INDIGO,
}));

function PricingSection({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <section className="section" id="pricing" style={{ background: "#04060f" }}>
      <div className="container">
        <div className="reveal sec-hd">
          <p className="label">Pricing</p>
          <h2 className="sec-title font-head">Free to start,<br />powerful when unlocked</h2>
        </div>
        <div className="pricing-grid">
          {/* Free card — clean minimal contrast */}
          <div className="reveal" style={{
            transitionDelay: "60ms", padding: 32,
            background: "rgba(8,12,32,0.5)", border: `1px solid ${BORD}`,
            borderRadius: 16, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
          }}>
            <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: DIM, marginBottom: 16 }}>Basic</p>
            <div className="font-head" style={{ fontSize: 48, fontWeight: 500, letterSpacing: "-0.03em", marginBottom: 8 }}>Free</div>
            <p style={{ fontSize: 13, color: DIM, lineHeight: 1.65, marginBottom: 28 }}>Take the full test and receive your overall IQ score instantly.</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
              {FREE_FEATURES.map(f => (
                <li key={f} style={{ display: "flex", gap: 12, fontSize: 13 }}>
                  <span style={{ color: INDIGO }}>+</span><span>{f}</span>
                </li>
              ))}
            </ul>
            <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-outline" style={{ width: "100%" }}>Start Free</button>
          </div>

          {/* Premium card — animated gradient border + particle field */}
          <div className="reveal grad-border" style={{
            transitionDelay: "120ms", padding: 32, borderRadius: 16,
            position: "relative", overflow: "hidden",
            boxShadow: `0 0 50px rgba(91,79,255,0.16), 0 0 100px rgba(0,245,212,0.05)`,
          }}>
            {PARTICLES.map((p, i) => (
              <span key={i} className="particle" style={{
                left: `${p.left}%`, bottom: `${p.bottom}%`,
                background: p.col, boxShadow: `0 0 6px ${p.col}`,
                animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
              }} />
            ))}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, position: "relative" }}>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: DIM }}>Premium Report</p>
              <span style={{ fontSize: 10, letterSpacing: "0.10em", textTransform: "uppercase", padding: "4px 10px", background: "rgba(91,79,255,0.12)", color: CYAN, border: `1px solid rgba(0,245,212,0.30)`, boxShadow: "0 0 14px rgba(0,245,212,0.15)", borderRadius: 4 }}>Best value</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8, position: "relative" }}>
              <span className="num-mono" style={{ fontSize: 15, color: DIM, position: "relative", display: "inline-block" }}>
                €3.99
                <span className="strike-line" />
              </span>
              <span className="font-head num-mono" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.03em", background: `linear-gradient(120deg, ${TXT}, ${CYAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>€1.99</span>
            </div>
            <p style={{ fontSize: 13, color: DIM, lineHeight: 1.65, marginBottom: 28, position: "relative" }}>Complete cognitive profile with everything you need.</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
              {PREMIUM_FEATURES.map(f => (
                <li key={f} style={{ display: "flex", gap: 12, fontSize: 13 }}>
                  <span style={{ color: CYAN }}>+</span><span>{f}</span>
                </li>
              ))}
            </ul>
            <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="liquid-cta" style={{
              width: "100%", padding: "16px 24px", fontSize: 14, fontWeight: 800,
              letterSpacing: "0.04em", color: "#fff", position: "relative",
            }}>Get Premium Report</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════ */

export default function Home() {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("nav-scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const SELECTORS = [
      ".reveal",
      ".reveal-left", ".reveal-right", ".reveal-scale",
      ".reveal-bounce", ".reveal-glitch", ".reveal-blur",
      ".reveal-persp",
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
    <div style={{ background: "#03050F", color: TXT }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

      <ScrollProgress />
      <CursorRing />

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
          fontSize: "17px", fontWeight: 600, color: TXT,
          letterSpacing: "-0.02em", fontFamily: "inherit",
          display: "flex", alignItems: "center",
        }}>
          <BrainLogo />
          Real<span style={{ color: INDIGO, textShadow: `0 0 18px rgba(91,79,255,0.8)` }}>IQ</span>Test
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
              style={{ fontSize: "13px", color: DIM, cursor: "pointer", transition: "color 0.15s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = TXT)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = DIM)}>
              {"href" in l && l.href === "/leaderboard"
                ? <span style={{ color: "#8F85FF" }}>{l.label}</span>
                : l.label}
            </li>
          ))}
        </ul>

        {/* Hamburger — mobile only */}
        <button
          className="hamburger"
          aria-label="Menu"
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: "none", background: "none", border: "none",
            cursor: "pointer", padding: 6, color: TXT,
          }}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>

        <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-primary">Start Free</button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 57, left: 0, right: 0, zIndex: 49,
          background: "rgba(3,5,15,0.97)", backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${BORD}`,
          padding: "12px 0 16px",
          display: "flex", flexDirection: "column",
        }}>
          {[
            { label: "The Test",     action: () => { document.getElementById("pillars")?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); } },
            { label: "How It Works", action: () => { document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); } },
            { label: "Leaderboard",  action: () => { router.push("/leaderboard"); setMenuOpen(false); }, highlight: true },
            { label: "Pricing",      action: () => { document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); } },
            { label: "Start Free →", action: () => { router.push("/test"); setMenuOpen(false); }, cta: true },
          ].map(item => (
            <button key={item.label} onClick={item.action} style={{
              background: item.cta ? `linear-gradient(135deg,${INDIGO},#00C9AE)` : "none",
              border: "none", cursor: "pointer", textAlign: "left",
              padding: "13px 24px",
              fontSize: item.cta ? "14px" : "15px",
              fontWeight: item.cta ? 700 : 400,
              color: item.cta ? "#fff" : item.highlight ? "#8F85FF" : TXT,
              margin: item.cta ? "8px 16px 0" : 0,
              borderRadius: item.cta ? 8 : 0,
              fontFamily: "inherit",
              borderTop: item.cta ? "none" : "1px solid rgba(91,79,255,0.08)",
            }}>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Hero — full-viewport 3D neural network ── */}
      <section style={{
        position: "relative", minHeight: "100dvh",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", background: "#03050F",
      }}>
        <NeuralScene accent={INDIGO} accent2={CYAN} opacity={0.85} />

        {/* Ambient glows */}
        <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none", width: 640, height: 640, background: "radial-gradient(circle, rgba(91,79,255,0.15) 0%, transparent 70%)", top: "5%", left: "18%", animation: "hero-glow-drift 9s ease-in-out infinite" }} />
        <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(70px)", pointerEvents: "none", width: 420, height: 420, background: "radial-gradient(circle, rgba(0,245,212,0.09) 0%, transparent 70%)", top: "45%", right: "12%", animation: "hero-glow-drift 12s ease-in-out infinite reverse" }} />

        {/* Vignette */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(3,5,15,0.18) 0%, rgba(3,5,15,0.68) 100%)" }} />

        {/* Floating IQ scores */}
        <FloatingScores />
        <style>{`@media (max-width: 767px) { .iq-scores { display: none; } }`}</style>

        {/* Hero content */}
        <div style={{
          position: "relative", zIndex: 10,
          width: "100%", minHeight: "100dvh",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "100px 24px 80px",
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 860, width: "100%" }}>

            {/* Eyebrow */}
            <div className="h1" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px" }}>
              <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, transparent, ${CYAN})` }} />
              <span style={{ fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase", fontWeight: 600, color: CYAN, textShadow: `0 0 18px rgba(0,245,212,0.9)` }}>
                Scientifically calibrated
              </span>
              <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, ${CYAN}, transparent)` }} />
            </div>

            {/* Headline — assembles letter by letter on load */}
            <h1 className="font-head" style={{
              fontSize: "clamp(40px, 8.5vw, 92px)",
              fontWeight: 700, lineHeight: 1.04, letterSpacing: "-0.035em",
              margin: 0, marginBottom: 26, perspective: 800,
            }}>
              <AssembledLine text="Discover your" baseDelay={150} style={{ color: TXT }} />
              <br />
              <AssembledLine text="true intelligence" baseDelay={760} gradient={[INDIGO, CYAN]} />
            </h1>

            <p className="h3 hero-sub" style={{ maxWidth: 620 }}>
              30 visual questions across 6 cognitive dimensions — matrix patterns,
              mental rotation, number series and memory sequences. Your actual score.
            </p>

            <div className="h4 hero-ctas">
              <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="liquid-cta" style={{
                padding: "17px 38px", fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "0.02em",
              }}>
                Take the Test — Free
              </button>
              <button onClick={() => router.push("/sample-questions")} className="btn btn-outline">View Sample Report</button>
            </div>

            <p className="h4" style={{ marginTop: 32, fontSize: 10, letterSpacing: "0.10em", color: "#6E73A5", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
              30 questions · 6 dimensions · ~15 min · No signup required
            </p>
          </div>
        </div>

        {/* Scroll indicator — subtle pulse */}
        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.35, zIndex: 10 }}>
          <span style={{ fontSize: 9, letterSpacing: "0.20em", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 30, background: `linear-gradient(to bottom, ${INDIGO}, transparent)`, animation: "node-breathe 2.2s ease-in-out infinite" }} />
        </div>
      </section>

      {/* ── Stats ── */}
      <div style={{ background: "#04060f", borderTop: `1px solid ${BORD}`, borderBottom: `1px solid ${BORD}` }}>
        <div className="stats-grid">
          {[
            { value: 30,   suffix: "",     label: "Questions",            col: INDIGO },
            { value: 6,    suffix: "",     label: "Cognitive dimensions", col: CYAN },
            { value: 15,   suffix: " min", label: "Average duration",     col: VIOLET },
            { value: 1.99, suffix: "€",    decimals: 2, label: "Full report", col: GOLD },
          ].map((s, i) => (
            <div key={i} className={`stat-cell ${i % 2 === 0 ? "reveal-left" : "reveal-right"}`}
              style={{ transitionDelay: `${i * 80}ms` }}>
              <div style={{ fontSize: 32, fontWeight: 600, color: s.col, marginBottom: 6, textShadow: `0 0 24px ${s.col}77` }}>
                <StatCounter value={s.value} suffix={s.suffix} decimals={(s as { decimals?: number }).decimals} />
              </div>
              <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: DIM }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Six Pillars — honeycomb of 3D flip cards ── */}
      <section className="section" id="pillars">
        <div className="container">
          <div className="reveal sec-hd">
            <p className="label">What we measure</p>
            <h2 className="sec-title font-head">Six pillars of intelligence</h2>
            <p className="sec-sub">5 questions per dimension · 30 questions total</p>
          </div>
          <div className="hex-grid">
            {PILLARS.map((p, i) => {
              const col   = DIM_COLORS[i];
              const anim  = PILLAR_ANIMS[i];
              const delay = pillarDelay(i);
              const isAnimBased = anim === "reveal-bounce" || anim === "reveal-glitch";
              const delayStyle  = isAnimBased ? { animationDelay: delay } : { transitionDelay: delay };

              return (
                <div key={i} className={anim} style={delayStyle}>
                  <div className="hex-cell" style={{ height: 252 }} data-hot>
                    {/* FRONT */}
                    <div className="hex-face" style={{ border: `1px solid ${col}33` }}>
                      <div style={{
                        width: 64, height: 58, display: "flex", alignItems: "center", justifyContent: "center",
                        clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                        background: `${col}14`, border: `1px solid ${col}44`,
                        marginBottom: 18, animation: "hex-pulse 3.2s ease-in-out infinite",
                        animationDelay: `${i * 0.4}s`,
                      }}>
                        <span style={{ fontSize: 22, color: col, textShadow: `0 0 14px ${col}` }}>{PILLAR_ICONS[i]}</span>
                      </div>
                      <div className="num-mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: col, opacity: 0.55, marginBottom: 10 }}>{p.n}</div>
                      <div className="font-head" style={{ fontSize: 16.5, fontWeight: 700, color: TXT, letterSpacing: "-0.01em" }}>{p.name}</div>
                      <div className="hex-hint" style={{ position: "absolute", bottom: 14, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6E73A5" }}>Hover to reveal</div>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${col}88, transparent)` }} />
                    </div>
                    {/* BACK */}
                    <div className="hex-face hex-back" style={{ border: `1px solid ${col}66`, boxShadow: `inset 0 0 40px ${col}11` }}>
                      <span style={{ fontSize: 15, color: col, marginBottom: 12, textShadow: `0 0 12px ${col}` }}>{PILLAR_ICONS[i]}</span>
                      <div style={{ fontSize: 13.5, color: "#C7CAE0", lineHeight: 1.7 }}>{p.desc}</div>
                      <div style={{ marginTop: 16, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: col, border: `1px solid ${col}44`, padding: "4px 12px", borderRadius: 99 }}>
                        5 questions
                      </div>
                    </div>
                  </div>
                  {/* Mobile: description shown statically below front face */}
                  <div className="hex-mobile-desc" style={{ display: "none", fontSize: 13, color: DIM, lineHeight: 1.65, padding: "12px 18px 0", textAlign: "center" }}>{p.desc}</div>
                </div>
              );
            })}
          </div>
          <style>{`@media (max-width: 767px) {
            .hex-hint { display: none; }
            .hex-mobile-desc { display: block !important; }
          }`}</style>
        </div>
      </section>

      {/* ── How It Works — pinned horizontal scroll ── */}
      <HowItWorks />

      {/* ── Cognitive Radar — the money shot ── */}
      <section className="section" style={{ background: "#04060f", borderTop: `1px solid rgba(91,79,255,0.10)` }}>
        <div className="container">
          <div style={{ display: "flex", gap: 56, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>

            <div className="reveal-persp" style={{ transitionDelay: "80ms", flexShrink: 0 }}>
              <div style={{
                background: GLASS, border: `1px solid rgba(91,79,255,0.22)`,
                borderRadius: 16, padding: "28px 24px",
                backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
                boxShadow: "0 0 60px rgba(91,79,255,0.08), inset 0 1px 0 rgba(0,245,212,0.06)",
              }}>
                <RadarChart />
              </div>
            </div>

            <div className="reveal-persp" style={{ maxWidth: 400, transitionDelay: "160ms" }}>
              <p className="label">Full Report</p>
              <h2 className="sec-title font-head" style={{ marginBottom: 16 }}>Your cognitive<br />radar chart</h2>
              <p style={{ fontSize: 14, color: DIM, lineHeight: 1.75, marginBottom: 24 }}>
                The Premium Report includes your personal radar chart — a hexagonal visualisation
                of all six cognitive dimensions. See exactly where you excel and where you can grow.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {RADAR_NAMES.map((name, i) => (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                      background: DIM_COLORS[i], boxShadow: `0 0 8px ${DIM_COLORS[i]}`,
                    }} />
                    <span style={{ fontSize: 12, color: "#6E73A5", width: 74 }}>{name}</span>
                    <div style={{ flex: 1, height: 3, background: "rgba(91,79,255,0.10)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${RADAR_PROFILES[0][i]}%`, borderRadius: 2,
                        background: DIM_COLORS[i], boxShadow: `0 0 8px ${DIM_COLORS[i]}`,
                        transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
                      }} />
                    </div>
                    <span className="num-mono" style={{ fontSize: 12, fontWeight: 700, color: DIM_COLORS[i], width: 24, textAlign: "right" }}>{RADAR_PROFILES[0][i]}</span>
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
            <h2 className="sec-title font-head">Everything in the full report</h2>
            <p className="sec-sub">One-time payment · €1.99 · Instant access</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i}
                className={`card ${i % 2 === 0 ? "reveal-left" : "reveal-right"}`}
                style={{ transitionDelay: `${i * 100}ms`, display: "flex", gap: 16, borderRadius: 12 }}>
                <span className="num-mono" style={{ color: DIM_COLORS[i % 6], fontSize: 14, marginTop: 2, flexShrink: 0, textShadow: `0 0 10px ${DIM_COLORS[i % 6]}99` }}>+</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: DIM, lineHeight: 1.65 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ marginTop: 40, transitionDelay: "160ms" }}>
            <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-primary">Take the Free Test First</button>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <PricingSection router={router} />

      {/* ── Footer CTA ── */}
      <section className="section" style={{ borderTop: `1px solid ${BORD}`, position: "relative", overflow: "hidden" }}>
        <NeuralScene accent={INDIGO} accent2={CYAN} opacity={0.30} density={0.5} />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="reveal" style={{ maxWidth: 560 }}>
            <h2 className="font-head" style={{ fontSize: "clamp(34px,5vw,54px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
              Ready to discover<br />your true IQ?
            </h2>
            <p style={{ fontSize: 14, color: DIM, lineHeight: 1.7, marginBottom: 32, maxWidth: 360 }}>
              No registration required. Results in ~15 minutes. Based on standardised cognitive assessment formats.
            </p>
            <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="liquid-cta" style={{
              padding: "16px 36px", fontSize: 15, fontWeight: 800, color: "#fff",
            }}>Begin the Test — Free</button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${BORD}`, background: "#020408", padding: "40px 24px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gap: 32, marginBottom: 36, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", display: "flex", alignItems: "center", marginBottom: 12 }}>
                <BrainLogo />
                Real<span style={{ color: INDIGO, textShadow: `0 0 14px rgba(91,79,255,0.7)` }}>IQ</span>Test
              </span>
              <p style={{ fontSize: 12, color: DIM, lineHeight: 1.7, maxWidth: 180 }}>
                Scientifically calibrated cognitive assessment. Free IQ test with premium report.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: CYAN, marginBottom: 12 }}>Resources</div>
              {[
                { href: "/what-is-iq",           label: "What is IQ?" },
                { href: "/cognitive-dimensions",  label: "Cognitive Dimensions" },
                { href: "/iq-score-ranges",       label: "IQ Score Ranges" },
                { href: "/how-to-improve-iq",     label: "How to Improve IQ" },
                { href: "/sample-questions",      label: "Sample Questions" },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ display: "block", fontSize: 13, color: DIM, textDecoration: "none", marginBottom: 6 }}>{l.label}</Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: CYAN, marginBottom: 12 }}>Company</div>
              {[
                { href: "/about",      label: "About" },
                { href: "/contact",    label: "Contact" },
                { href: "/faq",        label: "FAQ" },
                { href: "/disclaimer", label: "Disclaimer" },
                { href: "/privacy",    label: "Privacy Policy" },
                { href: "/terms",      label: "Terms" },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ display: "block", fontSize: 13, color: DIM, textDecoration: "none", marginBottom: 6 }}>{l.label}</Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: CYAN, marginBottom: 12 }}>Take the Test</div>
              <button onClick={(e) => { addRipple(e); router.push("/test"); }} className="btn btn-primary" style={{ fontSize: 11, padding: "12px 20px" }}>
                Free IQ Test
              </button>
              <p style={{ fontSize: 12, color: DIM, marginTop: 12, lineHeight: 1.6 }}>
                30 questions · 6 dimensions<br />~15 min · No signup required
              </p>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${BORD}`, paddingTop: 18, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, fontSize: 12, color: "#6E73A5" }}>
            <span>© 2026 RealIQTest · realiqtest.co</span>
            <span>For informational purposes only. Not a clinical diagnostic tool.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
