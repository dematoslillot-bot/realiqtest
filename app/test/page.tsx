"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import NavLogo from "@/app/components/NavLogo";
import NeuralScene from "@/app/components/NeuralScene";
import { useRouter } from "next/navigation";
import { ALL_QUESTIONS, CATEGORIES, type ShapeDef, type RavenCell, type VisualDef, type PCell } from "@/lib/questions";
import { DIFF_WEIGHTS, type AnswerRecord } from "@/lib/iq-calculator";

/* ── Design tokens ──────────────────────────────────────────────────────────── */
const BLUE = "#5B4FFF"; const CYAN = "#00F5D4"; const GREEN = "#00D87A";
const RED = "#FF3B3B"; const DIM = "#8AABCC"; const BG = "#03050F";
const BORD = "rgba(91,79,255,0.18)"; const GLASS = "rgba(6,14,40,0.82)";
const TEXT = "#EFEFF7"; const ORANGE = "#FF9F1C"; const PURP = "#A78BFA";

/* One accent color per cognitive dimension — the whole UI shifts with it */
const DIM_ACCENTS = ["#5B4FFF", "#A78BFA", "#00F5D4", "#FFD700", "#FF6B6B", "#FF9F1C"];

/* ── SVG shape renderer ─────────────────────────────────────────────────── */

function renderShape(sh: ShapeDef, color: string) {
  const { s, x, y, r, f = true } = sh;
  const fill   = f ? color : "none";
  const stroke = f ? "none" : color;
  const sw     = f ? 0 : 2;

  if (s === "c")  return <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth={sw} />;
  if (s === "sq") return <rect key={`${x}${y}`} x={x - r} y={y - r} width={r * 2} height={r * 2} fill={fill} stroke={stroke} strokeWidth={sw} />;
  if (s === "tr") {
    const pts = `${x},${y - r} ${x + r * 0.87},${y + r * 0.5} ${x - r * 0.87},${y + r * 0.5}`;
    return <polygon key={`${x}${y}`} points={pts} fill={fill} stroke={stroke} strokeWidth={sw} />;
  }
  if (s === "di") {
    const pts = `${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}`;
    return <polygon key={`${x}${y}`} points={pts} fill={fill} stroke={stroke} strokeWidth={sw} />;
  }
  return null;
}

/* ── Raven cell SVG ─────────────────────────────────────────────────────── */

function RavenCellSVG({ cell, isQuestion = false }: { cell: RavenCell | null; isQuestion?: boolean }) {
  const color = "#9D8FFF";
  if (isQuestion || cell === null) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 60 60">
        <rect x={1} y={1} width={58} height={58} rx={2}
          fill="rgba(91,79,255,0.06)" stroke="#5B4FFF" strokeWidth={1.5} strokeDasharray="5,3" />
        <text x={30} y={38} textAnchor="middle" fontSize={22} fill="#5B4FFF" fontWeight="bold">?</text>
      </svg>
    );
  }
  return (
    <svg width="100%" height="100%" viewBox="0 0 60 60">
      <rect x={1} y={1} width={58} height={58} rx={2}
        fill="rgba(5,18,45,0.9)" stroke="rgba(91,79,255,0.22)" strokeWidth={1} />
      {cell.map((sh, i) => <g key={i}>{renderShape(sh, color)}</g>)}
    </svg>
  );
}

/* ── Raven matrix display ───────────────────────────────────────────────── */

function RavenDisplay({ cells }: { cells: (RavenCell | null)[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4, width: "min(320px, calc(92dvh - 410px), calc(50vw))", margin: "0 auto" }}>
      {cells.map((cell, i) => (
        <div key={i} style={{ border: "1px solid rgba(91,79,255,0.14)", borderRadius: 3, overflow: "hidden", aspectRatio: "1" }}>
          <RavenCellSVG cell={cell} isQuestion={cell === null} />
        </div>
      ))}
    </div>
  );
}

/* ── Rotation shape display ─────────────────────────────────────────────── */

function RotationSVG({ path, angle, mirror = false }: { path: string; angle: number; mirror?: boolean }) {
  const transform = mirror
    ? `scale(-1,1) translate(-60,0) rotate(${angle},30,30)`
    : `rotate(${angle},30,30)`;
  return (
    <svg width="100%" height="100%" viewBox="0 0 60 60">
      <rect x={1} y={1} width={58} height={58} rx={2}
        fill="rgba(5,18,45,0.9)" stroke="rgba(91,79,255,0.22)" strokeWidth={1} />
      <g transform={transform}>
        <path d={path} fill="#9D8FFF" />
      </g>
    </svg>
  );
}

function RotationDisplay({ path, showAngle }: { path: string; showAngle: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: DIM }}>Source shape</p>
      <div style={{ width: 120, height: 120 }}>
        <RotationSVG path={path} angle={showAngle} />
      </div>
    </div>
  );
}

/* ── Bar chart display ──────────────────────────────────────────────────── */

function BarsDisplay({ values, max }: { values: (number | null)[]; max: number }) {
  const n = values.length;
  const W = Math.min(300, n * 42);
  const bw = Math.floor((W - (n - 1) * 5 - 20) / n);
  const H = 120;

  return (
    <div style={{ overflowX: "auto", padding: "0 8px", width: "min(320px, calc(100vw - 48px))" }}>
      <svg width={W + 20} height={H + 28} viewBox={`0 0 ${W + 20} ${H + 28}`} style={{ display: "block", margin: "0 auto" }}>
        <line x1={10} y1={H} x2={W + 10} y2={H} stroke="rgba(91,79,255,0.2)" strokeWidth={1} />
        {values.map((v, i) => {
          const x = 10 + i * (bw + 5);
          const isNull = v === null;
          const h = isNull ? 0 : Math.round((v / max) * (H - 16));
          return (
            <g key={i}>
              {isNull ? (
                <>
                  <rect x={x} y={16} width={bw} height={H - 16} rx={2}
                    fill="rgba(91,79,255,0.06)" stroke="#5B4FFF" strokeWidth={1.5} strokeDasharray="5,3" />
                  <text x={x + bw / 2} y={H / 2 + 6} textAnchor="middle" fontSize={18} fill="#5B4FFF" fontWeight="bold">?</text>
                </>
              ) : (
                <>
                  <rect x={x} y={H - h} width={bw} height={h} rx={2}
                    fill="rgba(91,79,255,0.55)" stroke="#5B4FFF" strokeWidth={1}
                    style={{ filter: "drop-shadow(0 0 6px rgba(91,79,255,0.7))" }} />
                  <text x={x + bw / 2} y={H + 14} textAnchor="middle" fontSize={9} fill="#8AABCC">{v}</text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Memory colour display ──────────────────────────────────────────────── */

function MemoryDisplay({
  colors, showMs = 3500, onReady,
}: {
  colors: string[]; showMs?: number; onReady: () => void;
}) {
  const [phase, setPhase] = useState<"showing" | "hidden">("showing");
  const [countdown, setCountdown] = useState(Math.ceil(showMs / 1000));
  const didHide = useRef(false);

  useEffect(() => {
    didHide.current = false;
    setPhase("showing");
    setCountdown(Math.ceil(showMs / 1000));

    const hideTimer = setTimeout(() => {
      setPhase("hidden");
      if (!didHide.current) { didHide.current = true; onReady(); }
    }, showMs);

    const tick = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => { clearTimeout(hideTimer); clearInterval(tick); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMs]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "12px 0" }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        {colors.map((col, i) => (
          <div key={i} style={{
            width: "clamp(36px,8vw,52px)", height: "clamp(36px,8vw,52px)", borderRadius: "50%",
            background: phase === "showing" ? col : "transparent",
            border: phase === "showing" ? "none" : "2px dashed rgba(91,79,255,0.25)",
            transition: "all 0.5s ease",
            boxShadow: phase === "showing" ? `0 0 20px ${col}99, 0 0 8px ${col}66` : "none",
          }} />
        ))}
      </div>
      {phase === "showing" && (
        <p style={{ fontSize: 11, color: DIM, letterSpacing: "0.08em" }}>
          Memorise — {countdown}s remaining
        </p>
      )}
      {phase === "hidden" && (
        <p style={{ fontSize: 11, color: DIM }}>Now answer the question below ↓</p>
      )}
    </div>
  );
}

/* ── Embedded figures display ───────────────────────────────────────────── */

function EmbeddedDisplay({ display }: { display: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: DIM }}>
        Combined figure
      </p>
      <svg width="min(140px, 30vw)" height="min(140px, 30vw)" viewBox="0 0 60 60" style={{ width: "min(140px, 30vw)", height: "min(140px, 30vw)" }}>
        <rect x={1} y={1} width={58} height={58} rx={2}
          fill="rgba(5,18,45,0.9)" stroke="rgba(91,79,255,0.22)" strokeWidth={1} />
        <path d={display} fill="#9D8FFF" fillRule="evenodd" />
      </svg>
    </div>
  );
}

/* ── Dice net display ────────────────────────────────────────────────────── */

function DiceNetDisplay({ faces }: { faces: number[] }) {
  const S = 46;

  function dots(n: number, cx: number, cy: number) {
    const off = 13;
    const R = 3.5;
    const pos: Record<number, [number, number][]> = {
      1: [[0, 0]],
      2: [[-off, off], [off, -off]],
      3: [[-off, off], [0, 0], [off, -off]],
      4: [[-off, -off], [off, -off], [-off, off], [off, off]],
      5: [[-off, -off], [off, -off], [0, 0], [-off, off], [off, off]],
      6: [[-off, -off], [off, -off], [-off, 0], [off, 0], [-off, off], [off, off]],
    };
    return (pos[n] || []).map(([dx, dy], i) => (
      <circle key={i} cx={cx + dx} cy={cy + dy} r={R} fill="#9D8FFF" />
    ));
  }

  const layout: [number, number, number][] = [
    [S,     0,   0],
    [0,     S,   3],
    [S,     S,   1],
    [S * 2, S,   4],
    [S,     S*2, 2],
    [S,     S*3, 5],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: DIM }}>
        Dice net — fold to assemble
      </p>
      <svg width={S * 3} height={S * 4} viewBox={`0 0 ${S * 3} ${S * 4}`} style={{ display: "block", width: "min(150px, 35vw)", height: "auto" }}>
        {layout.map(([x, y, fi]) => (
          <g key={fi}>
            <rect x={x + 1} y={y + 1} width={S - 2} height={S - 2} rx={3}
              fill="rgba(5,18,45,0.92)" stroke="rgba(91,79,255,0.45)" strokeWidth={1.5} />
            {dots(faces[fi], x + S / 2, y + S / 2)}
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ── Raven 2×2 display ──────────────────────────────────────────────────── */

function Raven2Display({ cells }: { cells: (RavenCell|null)[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 4, width: "min(220px, calc(92dvh - 410px), calc(40vw))", margin: "0 auto" }}>
      {cells.map((cell, i) => (
        <div key={i} style={{ border: "1px solid rgba(91,79,255,0.14)", borderRadius: 3, overflow: "hidden", aspectRatio: "1" }}>
          <RavenCellSVG cell={cell} isQuestion={cell === null} />
        </div>
      ))}
    </div>
  );
}

/* ── Raven rotation display (3×3 grid of rotated arrows) ────────────────── */

function RavenRotDisplay({ path, angles }: { path: string; angles: (number|null)[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4, width: "min(320px, calc(92dvh - 410px), calc(50vw))", margin: "0 auto" }}>
      {angles.map((angle, i) => (
        <div key={i} style={{ border: "1px solid rgba(91,79,255,0.14)", borderRadius: 3, overflow: "hidden", aspectRatio: "1" }}>
          {angle === null ? (
            <svg width="100%" height="100%" viewBox="0 0 60 60">
              <rect x={1} y={1} width={58} height={58} rx={2}
                fill="rgba(91,79,255,0.06)" stroke="#5B4FFF" strokeWidth={1.5} strokeDasharray="5,3" />
              <text x={30} y={38} textAnchor="middle" fontSize={22} fill="#5B4FFF" fontWeight="bold">?</text>
            </svg>
          ) : (
            <RotationSVG path={path} angle={angle} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Pattern cell SVG (shape + line-fill) ───────────────────────────────── */

function PatternCellSVG({ cell, cellIdx = 0, isQ = false }: {
  cell: PCell | null; cellIdx?: number; isQ?: boolean;
}) {
  const COLOR = "#9D8FFF";
  if (cell === null || isQ) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 60 60">
        <rect x={1} y={1} width={58} height={58} rx={2}
          fill="rgba(91,79,255,0.06)" stroke="#5B4FFF" strokeWidth={1.5} strokeDasharray="5,3" />
        <text x={30} y={38} textAnchor="middle" fontSize={22} fill="#5B4FFF" fontWeight="bold">?</text>
      </svg>
    );
  }
  const TRI = "30,8 53,52 7,52";
  const clipId = `rp${cellIdx}`;
  const patId  = `pp${cellIdx}`;
  return (
    <svg width="100%" height="100%" viewBox="0 0 60 60">
      <defs>
        {cell.fill === "h" && (
          <pattern id={patId} width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="3" x2="6" y2="3" stroke={COLOR} strokeWidth="1.5" />
          </pattern>
        )}
        {cell.fill === "v" && (
          <pattern id={patId} width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="3" y1="0" x2="3" y2="6" stroke={COLOR} strokeWidth="1.5" />
          </pattern>
        )}
        {cell.fill === "d" && (
          <pattern id={patId} width="7" height="7" patternUnits="userSpaceOnUse">
            <line x1="-1" y1="1" x2="1" y2="-1" stroke={COLOR} strokeWidth="1.5" />
            <line x1="0" y1="7" x2="7" y2="0" stroke={COLOR} strokeWidth="1.5" />
            <line x1="6" y1="8" x2="8" y2="6" stroke={COLOR} strokeWidth="1.5" />
          </pattern>
        )}
        <clipPath id={clipId}>
          {cell.shape === "tri" && <polygon points={TRI} />}
          {cell.shape === "sq"  && <rect x={8} y={8} width={44} height={44} />}
          {cell.shape === "ci"  && <circle cx={30} cy={30} r={22} />}
        </clipPath>
      </defs>
      <rect x={1} y={1} width={58} height={58} rx={2}
        fill="rgba(5,18,45,0.9)" stroke="rgba(91,79,255,0.22)" strokeWidth={1} />
      <rect x={0} y={0} width={60} height={60} fill={`url(#${patId})`} clipPath={`url(#${clipId})`} />
      {cell.shape === "tri" && <polygon points={TRI} fill="none" stroke={COLOR} strokeWidth={1.8} />}
      {cell.shape === "sq"  && <rect x={8} y={8} width={44} height={44} fill="none" stroke={COLOR} strokeWidth={1.8} />}
      {cell.shape === "ci"  && <circle cx={30} cy={30} r={22} fill="none" stroke={COLOR} strokeWidth={1.8} />}
    </svg>
  );
}

function RavenPatternDisplay({ cells }: { cells: (PCell|null)[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4, width: "min(320px, calc(92dvh - 410px), calc(50vw))", margin: "0 auto" }}>
      {cells.map((cell, i) => (
        <div key={i} style={{ border: "1px solid rgba(91,79,255,0.14)", borderRadius: 3, overflow: "hidden", aspectRatio: "1" }}>
          <PatternCellSVG cell={cell} cellIdx={i} isQ={cell === null} />
        </div>
      ))}
    </div>
  );
}

/* ── Top-view display (isometric 3D → 2D grid) ──────────────────────────── */

function TopViewDisplay() {
  const u = 10;
  const ox = 25, oy = 22;
  const cubes: [number, number][] = [[0,0],[0,1],[1,0],[2,0]];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: DIM }}>
        3D arrangement
      </p>
      <svg viewBox="0 0 60 45" style={{ width: "min(130px, 30vw)", height: "auto" }}>
        <rect width={60} height={45} fill="rgba(5,18,45,0.9)" rx={2} />
        {cubes.map(([c, r]) => {
          const bx = ox + (c - r) * u;
          const by = oy + (c + r) * (u / 2);
          const top   = `${bx},${by-u} ${bx+u},${by-u/2} ${bx},${by} ${bx-u},${by-u/2}`;
          const right = `${bx},${by-u} ${bx+u},${by-u/2} ${bx+u},${by+u/2} ${bx},${by}`;
          const left  = `${bx-u},${by-u/2} ${bx},${by-u} ${bx},${by} ${bx-u},${by+u/2}`;
          return (
            <g key={`${c}${r}`}>
              <polygon points={left}  fill="#9D8FFF" fillOpacity={0.28} stroke="#5B4FFF" strokeWidth={0.6} />
              <polygon points={right} fill="#9D8FFF" fillOpacity={0.50} stroke="#5B4FFF" strokeWidth={0.6} />
              <polygon points={top}   fill="#9D8FFF" fillOpacity={0.85} stroke="#5B4FFF" strokeWidth={0.6} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Symbols display ────────────────────────────────────────────────────── */

function SymbolsDisplay({ target, compare }: { target: string; compare?: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", maxWidth: "min(400px, calc(100vw - 48px))" }}>
      <div style={{
        padding: "18px 32px",
        background: "rgba(91,79,255,0.08)",
        border: "1px solid rgba(91,79,255,0.25)",
        borderRadius: 4,
        fontSize: compare ? 22 : 28,
        fontWeight: 600,
        color: "#E8E8F0",
        letterSpacing: "0.06em",
        fontFamily: "monospace",
        textShadow: "0 0 16px rgba(91,79,255,0.4)",
        textAlign: "center",
        width: "100%",
      }}>
        {target}
      </div>
      {compare && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 6, width: "100%" }}>
          {compare.map((item, i) => (
            <div key={i} style={{
              padding: "10px 12px",
              background: "rgba(5,18,45,0.8)",
              border: "1px solid rgba(91,79,255,0.15)",
              borderRadius: 3,
              textAlign: "center",
              fontSize: 14,
              fontFamily: "monospace",
              color: "#8AB0E0",
              letterSpacing: "0.04em",
            }}>
              <span style={{ fontSize: 9, color: DIM, marginRight: 6, letterSpacing: "0.1em" }}>
                {["1st", "2nd", "3rd", "4th"][i]}
              </span>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Clock face SVG ────────────────────────────────────────────────────── */
function ClockFaceSVG({ h, m, size = 72, isQ = false }: { h?: number; m?: number; size?: number; isQ?: boolean }) {
  if (isQ) {
    return (
      <svg width={size} height={size} viewBox="0 0 72 72">
        <circle cx={36} cy={36} r={33} fill="rgba(91,79,255,0.06)" stroke="#5B4FFF" strokeWidth={1.5} strokeDasharray="5,3" />
        <text x={36} y={42} textAnchor="middle" fontSize={22} fill="#5B4FFF" fontWeight="bold">?</text>
      </svg>
    );
  }
  const cx = 36, cy = 36, r = 31;
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const isMajor = i % 3 === 0;
    return { x1: cx + Math.cos(a) * r * (isMajor ? 0.75 : 0.82), y1: cy + Math.sin(a) * r * (isMajor ? 0.75 : 0.82), x2: cx + Math.cos(a) * r, y2: cy + Math.sin(a) * r, major: isMajor };
  });
  const nums = [{ n: 12, i: 0 }, { n: 3, i: 3 }, { n: 6, i: 6 }, { n: 9, i: 9 }];
  const ha = (((h ?? 0) % 12) / 12 + (m ?? 0) / 720) * Math.PI * 2 - Math.PI / 2;
  const ma = ((m ?? 0) / 60) * Math.PI * 2 - Math.PI / 2;
  return (
    <svg width={size} height={size} viewBox="0 0 72 72">
      <circle cx={cx} cy={cy} r={r} fill="rgba(5,18,45,0.95)" stroke="#5B4FFF" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r * 0.92} fill="none" stroke="rgba(91,79,255,0.1)" strokeWidth={0.5} />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? "#9D8FFF" : "rgba(91,79,255,0.35)"} strokeWidth={t.major ? 2 : 1} />
      ))}
      {nums.map(({ n, i }) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return <text key={n} x={cx + Math.cos(a) * r * 0.62} y={cy + Math.sin(a) * r * 0.62 + 3.5} textAnchor="middle" fontSize={8} fill="#9D8FFF" fontWeight="700">{n}</text>;
      })}
      <line x1={cx} y1={cy} x2={cx + Math.cos(ha) * r * 0.52} y2={cy + Math.sin(ha) * r * 0.52} stroke="#EFEFF7" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + Math.cos(ma) * r * 0.73} y2={cy + Math.sin(ma) * r * 0.73} stroke="#00F5D4" strokeWidth={1.5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={3} fill="#5B4FFF" />
    </svg>
  );
}

function ClockDisplay({ seqH, seqM }: { seqH: number[]; seqM: number[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: DIM }}>What time does the 4th clock show?</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {seqH.map((h, i) => (
          <React.Fragment key={i}>
            <div style={{ border: "1px solid rgba(91,79,255,0.22)", borderRadius: 8, overflow: "hidden", boxShadow: "0 0 12px rgba(91,79,255,0.12)" }}>
              <ClockFaceSVG h={h} m={seqM[i]} size={72} />
            </div>
            {i < seqH.length - 1 && <span style={{ color: DIM, fontSize: 14, flexShrink: 0 }}>→</span>}
          </React.Fragment>
        ))}
        <span style={{ color: DIM, fontSize: 14, flexShrink: 0 }}>→</span>
        <div style={{ border: "1px dashed rgba(91,79,255,0.4)", borderRadius: 8, overflow: "hidden" }}>
          <ClockFaceSVG isQ={true} size={72} />
        </div>
      </div>
    </div>
  );
}

/* ── Heatmap display ───────────────────────────────────────────────────── */
function HeatmapDisplay({ grid }: { grid: (number | null)[][] }) {
  const HEAT_COLORS = ["#070F20", "#0D2558", "#0D50B8", "#1178FF", "#00C4FF"];
  const S = 46, G = 5, PAD = 4;
  const W = S * 3 + G * 2 + PAD * 2;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: DIM }}>
        All rows and columns sum to the same number
      </p>
      <svg width={W} height={W} viewBox={`0 0 ${W} ${W}`} style={{ display: "block" }}>
        {grid.map((row, r) =>
          row.map((val, c) => {
            const x = PAD + c * (S + G), y = PAD + r * (S + G);
            if (val === null) {
              return (
                <g key={`${r}${c}`}>
                  <rect x={x} y={y} width={S} height={S} rx={4} fill="rgba(91,79,255,0.06)" stroke="#5B4FFF" strokeWidth={1.5} strokeDasharray="5,3" />
                  <text x={x + S / 2} y={y + S / 2 + 8} textAnchor="middle" fontSize={22} fill="#5B4FFF" fontWeight="bold">?</text>
                </g>
              );
            }
            return (
              <g key={`${r}${c}`}>
                <rect x={x} y={y} width={S} height={S} rx={4} fill={HEAT_COLORS[val]} stroke="rgba(91,79,255,0.25)" strokeWidth={1}
                  style={{ filter: val >= 3 ? "drop-shadow(0 0 8px rgba(0,196,255,0.45))" : "none" }} />
                {Array.from({ length: val }).map((_, i) => (
                  <circle key={i} cx={x + 9 + i * 9} cy={y + S - 9} r={2.5} fill="rgba(255,255,255,0.45)" />
                ))}
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}

/* ── Mirror display ────────────────────────────────────────────────────── */
function MirrorDisplay({ path }: { path: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: DIM }}>
        Original shape — choose its exact horizontal mirror
      </p>
      <svg viewBox="0 0 60 60" style={{ width: "min(180px, 38vw)", height: "min(180px, 38vw)", display: "block" }}>
        <rect x={1} y={1} width={58} height={58} rx={3} fill="rgba(5,18,45,0.92)" stroke="rgba(91,79,255,0.3)" strokeWidth={1.5} />
        <path d={path} fill="#9D8FFF" style={{ filter: "drop-shadow(0 0 6px rgba(91,79,255,0.4))" }} />
      </svg>
    </div>
  );
}

/* ── Maze display ──────────────────────────────────────────────────── */
function MazeDisplay({ arrows }: { arrows: string[] }) {
  const CS = 46, G = 5, PAD = 26;
  const W = PAD * 2 + CS * 3 + G * 2;
  const ap = (dir: string) => {
    const m = CS / 2;
    if (dir === "R") return `M${CS*0.17},${m-5} L${CS*0.67},${m-5} L${CS*0.67},${m-10} L${CS*0.9},${m} L${CS*0.67},${m+10} L${CS*0.67},${m+5} L${CS*0.17},${m+5} Z`;
    if (dir === "L") return `M${CS*0.83},${m-5} L${CS*0.33},${m-5} L${CS*0.33},${m-10} L${CS*0.1},${m} L${CS*0.33},${m+10} L${CS*0.33},${m+5} L${CS*0.83},${m+5} Z`;
    if (dir === "U") return `M${m-5},${CS*0.83} L${m-5},${CS*0.33} L${m-10},${CS*0.33} L${m},${CS*0.1} L${m+10},${CS*0.33} L${m+5},${CS*0.33} L${m+5},${CS*0.83} Z`;
    return `M${m-5},${CS*0.17} L${m-5},${CS*0.67} L${m-10},${CS*0.67} L${m},${CS*0.9} L${m+10},${CS*0.67} L${m+5},${CS*0.67} L${m+5},${CS*0.17} Z`;
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
      <p style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:DIM }}>Trace mentally from START — which exit do you reach?</p>
      <svg width={W} height={W} viewBox={`0 0 ${W} ${W}`} style={{ display:"block" }}>
        <text x={W/2} y={13} textAnchor="middle" fontSize={9} fontWeight="700" fill={BLUE}>A</text>
        <text x={W/2} y={W-1} textAnchor="middle" fontSize={9} fontWeight="700" fill={BLUE}>B</text>
        <text x={W-8} y={W/2+3} textAnchor="middle" fontSize={9} fontWeight="700" fill={CYAN}>C</text>
        <text x={9} y={W/2+3} textAnchor="middle" fontSize={9} fontWeight="700" fill={BLUE}>D</text>
        {[0,1,2].flatMap(row => [0,1,2].map(col => {
          const idx=row*3+col, x=PAD+col*(CS+G), y=PAD+row*(CS+G), isS=idx===0;
          return (
            <g key={idx} transform={`translate(${x},${y})`}>
              <rect width={CS} height={CS} rx={4} fill={isS?"rgba(91,79,255,0.18)":"rgba(5,18,45,0.92)"} stroke={isS?BLUE:"rgba(91,79,255,0.3)"} strokeWidth={isS?1.5:1}/>
              <path d={ap(arrows[idx])} fill={isS?"#9D8FFF":"rgba(110,176,255,0.65)"}/>
              {isS && <text x={CS/2} y={8} textAnchor="middle" fontSize={6} fill={CYAN} fontWeight="700">START</text>}
            </g>
          );
        }))}
      </svg>
    </div>
  );
}

/* ── Binary code display ────────────────────────────────────────────── */
function BinaryDisplay({ rows }: { rows: (0|1|null)[][] }) {
  const CS=36, G=4, PAD=5, W=PAD*2+CS*4+G*3;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
      <p style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:DIM }}>Each column XOR = 0 (even filled dots per column)</p>
      <svg width={W} height={W} viewBox={`0 0 ${W} ${W}`} style={{ display:"block" }}>
        {rows.map((row, r) => row.map((val, c) => {
          const cx=PAD+c*(CS+G)+CS/2, cy=PAD+r*(CS+G)+CS/2, bx=PAD+c*(CS+G), by=PAD+r*(CS+G);
          if (val===null) return (
            <g key={`${r}${c}`}>
              <rect x={bx} y={by} width={CS} height={CS} rx={3} fill="rgba(91,79,255,0.06)" stroke="#5B4FFF" strokeWidth={1.5} strokeDasharray="5,3"/>
              <text x={cx} y={cy+5} textAnchor="middle" fontSize={13} fill="#5B4FFF" fontWeight="bold">?</text>
            </g>
          );
          return (
            <g key={`${r}${c}`}>
              <rect x={bx} y={by} width={CS} height={CS} rx={3} fill="rgba(5,18,45,0.85)" stroke="rgba(91,79,255,0.18)" strokeWidth={1}/>
              {val===1
                ? <circle cx={cx} cy={cy} r={11} fill="#9D8FFF" style={{ filter:"drop-shadow(0 0 4px rgba(91,79,255,0.5))" }}/>
                : <circle cx={cx} cy={cy} r={11} fill="none" stroke="rgba(91,79,255,0.28)" strokeWidth={1.5} strokeDasharray="4,3"/>}
            </g>
          );
        }))}
      </svg>
    </div>
  );
}

/* ── Shadow 3D display ──────────────────────────────────────────────── */
function Shadow3DDisplay() {
  const u=10, ox=25, oy=22;
  const cubes: [number,number][] = [[0,0],[1,0],[2,0],[2,1],[2,2]];
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
      <p style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:DIM }}>3D arrangement — find the correct FRONT silhouette</p>
      <svg viewBox="0 0 60 45" style={{ width:"min(160px,38vw)", height:"auto" }}>
        <rect width={60} height={45} fill="rgba(5,18,45,0.9)" rx={2}/>
        {cubes.map(([cx,cz]) => {
          const bx=ox+cx*u, by=oy+cx*(u/2)-cz*u;
          const top  =`${bx},${by-u} ${bx+u},${by-u/2} ${bx},${by} ${bx-u},${by-u/2}`;
          const right=`${bx},${by-u} ${bx+u},${by-u/2} ${bx+u},${by+u/2} ${bx},${by}`;
          const left =`${bx-u},${by-u/2} ${bx},${by-u} ${bx},${by} ${bx-u},${by+u/2}`;
          return (
            <g key={`${cx}${cz}`}>
              <polygon points={left}  fill="#9D8FFF" fillOpacity={0.28} stroke="#5B4FFF" strokeWidth={0.5}/>
              <polygon points={right} fill="#9D8FFF" fillOpacity={0.50} stroke="#5B4FFF" strokeWidth={0.5}/>
              <polygon points={top}   fill="#9D8FFF" fillOpacity={0.85} stroke="#5B4FFF" strokeWidth={0.5}/>
            </g>
          );
        })}
        <text x={30} y={43} textAnchor="middle" fontSize={5} fill={DIM}>← FRONT →</text>
      </svg>
    </div>
  );
}

/* ── Origami display ────────────────────────────────────────────────── */
function OrigamiDisplay() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
      <p style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:DIM }}>Fold → cut → unfold: which hole pattern appears?</p>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        {[
          { label:"Full square", jsx: <rect x={8} y={8} width={44} height={44} fill="rgba(91,79,255,0.18)" stroke="#9D8FFF" strokeWidth={1.5} rx={1}/> },
          { label:"Fold bottom up", jsx: <><rect x={8} y={8} width={44} height={22} fill="rgba(91,79,255,0.22)" stroke="#9D8FFF" strokeWidth={1.5} rx={1}/><text x={30} y={41} textAnchor="middle" fontSize={6} fill={CYAN}>fold ↑</text></> },
          { label:"Cut corner", jsx: <><rect x={8} y={8} width={44} height={22} fill="rgba(91,79,255,0.18)" stroke="#9D8FFF" strokeWidth={1.5} rx={1}/><circle cx={48} cy={12} r={7} fill="rgba(255,59,59,0.35)" stroke="#FF3B3B" strokeWidth={1}/><text x={48} y={14} textAnchor="middle" fontSize={8} fill="#FF3B3B">✂</text></> },
        ].map((s, i) => (
          <React.Fragment key={i}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <svg width={60} height={60} viewBox="0 0 60 60">
                <rect width={60} height={60} rx={3} fill="rgba(5,18,45,0.9)" stroke="rgba(91,79,255,0.22)" strokeWidth={1}/>
                {s.jsx}
              </svg>
              <span style={{ fontSize:6, color:DIM }}>{s.label}</span>
            </div>
            {i < 2 && <span style={{ color:DIM, fontSize:14 }}>→</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ── Shape sum display ──────────────────────────────────────────────── */
function ShapeSumDisplay({ exA, exB, exC, qA, qB }: {
  exA: RavenCell; exB: RavenCell; exC: RavenCell; qA: RavenCell; qB: RavenCell;
}) {
  const SZ=44;
  const box: React.CSSProperties = { width:SZ, height:SZ, flexShrink:0, border:"1px solid rgba(91,79,255,0.25)", borderRadius:4, overflow:"hidden" };
  const Op = ({ s }: { s: string }) => <span style={{ color:DIM, fontSize:20, fontWeight:300, flexShrink:0 }}>{s}</span>;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
      <p style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:DIM }}>Discover the rule → apply it to the second pair</p>
      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
        <div style={box}><RavenCellSVG cell={exA}/></div><Op s="+"/>
        <div style={box}><RavenCellSVG cell={exB}/></div><Op s="="/>
        <div style={box}><RavenCellSVG cell={exC}/></div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
        <div style={box}><RavenCellSVG cell={qA}/></div><Op s="+"/>
        <div style={box}><RavenCellSVG cell={qB}/></div><Op s="="/>
        <div style={box}><RavenCellSVG cell={null} isQuestion={true}/></div>
      </div>
    </div>
  );
}

/* ── Symbol code display ────────────────────────────────────────────── */
function SymCodeDisplay({ equations }: { equations: string[] }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, width:"100%", maxWidth:"min(360px,calc(100vw - 48px))" }}>
      {equations.map((eq, i) => {
        const isQ = eq.includes("?");
        return (
          <div key={i} style={{
            width:"100%", padding:"10px 20px",
            background: isQ ? "rgba(91,79,255,0.12)" : "rgba(5,18,45,0.82)",
            border:`1px solid ${isQ?"rgba(91,79,255,0.45)":"rgba(91,79,255,0.15)"}`,
            borderRadius:6, fontSize: isQ?20:17, fontWeight: isQ?700:500,
            color: isQ?"#9D8FFF":"#C0D8FF", letterSpacing:"0.1em",
            fontFamily:"monospace", textAlign:"center",
            boxShadow: isQ?"0 0 14px rgba(91,79,255,0.18)":"none",
          }}>{eq}</div>
        );
      })}
    </div>
  );
}

/* ── Visual question container ──────────────────────────────────────────── */

function VisualDisplay({ vis, onMemReady }: { vis: VisualDef; onMemReady: () => void }) {
  switch (vis.kind) {
    case "raven":
      return <RavenDisplay cells={vis.cells} />;
    case "rotation":
      return <RotationDisplay path={vis.path} showAngle={vis.showAngle} />;
    case "bars":
      return <BarsDisplay values={vis.values} max={vis.max} />;
    case "memory":
      return <MemoryDisplay colors={vis.colors} showMs={vis.showMs} onReady={onMemReady} />;
    case "symbols":
      return <SymbolsDisplay target={vis.target} compare={vis.compare} />;
    case "embedded":
      return <EmbeddedDisplay display={vis.display} />;
    case "dicenet":
      return <DiceNetDisplay faces={vis.faces} />;
    case "raven2":
      return <Raven2Display cells={vis.cells} />;
    case "ravenrot":
      return <RavenRotDisplay path={vis.path} angles={vis.angles} />;
    case "ravenpattern":
      return <RavenPatternDisplay cells={vis.cells} />;
    case "topview":
      return <TopViewDisplay />;
    case "clock":
      return <ClockDisplay seqH={vis.seqH} seqM={vis.seqM} />;
    case "heatmap":
      return <HeatmapDisplay grid={vis.grid} />;
    case "mirror":
      return <MirrorDisplay path={vis.path} />;
    case "maze":
      return <MazeDisplay arrows={vis.arrows} />;
    case "binary":
      return <BinaryDisplay rows={vis.rows} />;
    case "shadow3d":
      return <Shadow3DDisplay />;
    case "origami":
      return <OrigamiDisplay />;
    case "shapesum":
      return <ShapeSumDisplay exA={vis.exA} exB={vis.exB} exC={vis.exC} qA={vis.qA} qB={vis.qB} />;
    case "symcode":
      return <SymCodeDisplay equations={vis.equations} />;
  }
}

/* ── Option content (visual or text) ───────────────────────────────────── */

function OptionContent({ vis, opt, idx }: { vis?: VisualDef; opt: string; idx: number }) {
  if (vis?.kind === "raven") {
    return <RavenCellSVG cell={vis.optCells[idx]} />;
  }
  if (vis?.kind === "rotation") {
    return <RotationSVG path={vis.path} angle={vis.optAngles[idx]} mirror={vis.optMirrors?.[idx] ?? false} />;
  }
  if (vis?.kind === "embedded") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 60 60">
        <rect x={1} y={1} width={58} height={58} rx={2}
          fill="rgba(5,18,45,0.9)" stroke="rgba(91,79,255,0.22)" strokeWidth={1} />
        <path d={vis.optPaths[idx]} fill="#9D8FFF" />
      </svg>
    );
  }
  if (vis?.kind === "raven2") {
    return <RavenCellSVG cell={vis.optCells[idx]} />;
  }
  if (vis?.kind === "ravenrot") {
    return <RotationSVG path={vis.path} angle={vis.optAngles[idx]} />;
  }
  if (vis?.kind === "ravenpattern") {
    return <PatternCellSVG cell={vis.optCells[idx]} cellIdx={90 + idx} />;
  }
  if (vis?.kind === "topview") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 60 60">
        <rect x={1} y={1} width={58} height={58} rx={2}
          fill="rgba(5,18,45,0.9)" stroke="rgba(91,79,255,0.22)" strokeWidth={1} />
        <path d={vis.optGrids[idx]} fill="#9D8FFF" />
      </svg>
    );
  }
  if (vis?.kind === "clock") {
    return <ClockFaceSVG h={vis.optH[idx]} m={vis.optM[idx]} size={56} />;
  }
  if (vis?.kind === "heatmap") {
    const HEAT_COLORS = ["#070F20", "#0D2558", "#0D50B8", "#1178FF", "#00C4FF"];
    const val = vis.optVals[idx];
    return (
      <svg width="100%" height="100%" viewBox="0 0 60 60">
        <rect x={2} y={2} width={56} height={56} rx={4} fill={HEAT_COLORS[val]} stroke="rgba(91,79,255,0.3)" strokeWidth={1} />
        {Array.from({ length: val }).map((_, i) => (
          <circle key={i} cx={10 + i * 10} cy={50} r={3} fill="rgba(255,255,255,0.45)" />
        ))}
      </svg>
    );
  }
  if (vis?.kind === "mirror") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 60 60">
        <rect x={1} y={1} width={58} height={58} rx={2} fill="rgba(5,18,45,0.9)" stroke="rgba(91,79,255,0.22)" strokeWidth={1} />
        <path d={vis.optPaths[idx]} fill="#9D8FFF" />
      </svg>
    );
  }
  if (vis?.kind === "binary") {
    const row = vis.optRows[idx];
    return (
      <svg width="100%" height="100%" viewBox="0 0 68 22">
        {row.map((val, c) => {
          const cx = 7 + c * 18;
          return val === 1
            ? <circle key={c} cx={cx} cy={11} r={7} fill="#9D8FFF"/>
            : <circle key={c} cx={cx} cy={11} r={7} fill="none" stroke="rgba(91,79,255,0.35)" strokeWidth={1.5} strokeDasharray="4,2"/>;
        })}
      </svg>
    );
  }
  if (vis?.kind === "shadow3d") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 60 60">
        <rect x={1} y={1} width={58} height={58} rx={2} fill="rgba(5,18,45,0.9)" stroke="rgba(91,79,255,0.22)" strokeWidth={1}/>
        <path d={vis.optGrids[idx]} fill="#9D8FFF"/>
      </svg>
    );
  }
  if (vis?.kind === "origami") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 60 60">
        <rect x={1} y={1} width={58} height={58} rx={2} fill="rgba(5,18,45,0.9)" stroke="rgba(91,79,255,0.22)" strokeWidth={1}/>
        <rect x={8} y={8} width={44} height={44} fill="none" stroke="rgba(91,79,255,0.18)" strokeWidth={0.5}/>
        {idx === 0 && <circle cx={44} cy={16} r={7} fill="#9D8FFF"/>}
        {idx === 1 && <><circle cx={44} cy={16} r={7} fill="#9D8FFF"/><circle cx={44} cy={44} r={7} fill="#9D8FFF"/></>}
        {idx === 2 && <><circle cx={14} cy={14} r={6} fill="#9D8FFF"/><circle cx={46} cy={14} r={6} fill="#9D8FFF"/><circle cx={14} cy={46} r={6} fill="#9D8FFF"/><circle cx={46} cy={46} r={6} fill="#9D8FFF"/></>}
        {idx === 3 && <circle cx={30} cy={30} r={9} fill="#9D8FFF"/>}
      </svg>
    );
  }
  if (vis?.kind === "shapesum") {
    return <RavenCellSVG cell={vis.optCells[idx]} />;
  }
  if (vis?.kind === "symcode") {
    return <span style={{ fontSize:"clamp(18px,4vw,26px)", fontWeight:800, fontFamily:"monospace", color:"#9D8FFF" }}>{vis.optVals[idx]}</span>;
  }
  return <span style={{ fontSize: "clamp(13px,3vw,16px)", lineHeight: 1.25, fontWeight: 500 }}>{opt}</span>;
}

/* ── Animated test background (form + category transitions) ─────────────── */

function AnimatedTestBg({ catIdx, flyKey }: { catIdx: number; flyKey?: number }) {
  const catColors: [string, string, string][] = [
    ["rgba(91,79,255,0.55)", "rgba(167,139,250,0.32)", "rgba(0,245,212,0.20)"],
    ["rgba(167,139,250,0.55)", "rgba(91,79,255,0.32)", "rgba(255,107,107,0.14)"],
    ["rgba(0,245,212,0.45)", "rgba(91,79,255,0.32)", "rgba(167,139,250,0.18)"],
    ["rgba(255,215,0,0.30)", "rgba(91,79,255,0.32)", "rgba(0,245,212,0.16)"],
    ["rgba(255,107,107,0.42)", "rgba(91,79,255,0.30)", "rgba(167,139,250,0.18)"],
    ["rgba(255,159,28,0.40)", "rgba(91,79,255,0.30)", "rgba(0,245,212,0.16)"],
  ];
  const [c1, c2, c3] = catColors[catIdx] ?? catColors[0];
  const accent = DIM_ACCENTS[catIdx] ?? DIM_ACCENTS[0];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-25%", left: "-15%", width: "65%", height: "65%", background: `radial-gradient(ellipse, ${c1}, transparent 68%)`, animation: "bgPulse1 7s ease-in-out infinite", transition: "background 0.8s ease" }} />
      <div style={{ position: "absolute", bottom: "-25%", right: "-15%", width: "65%", height: "65%", background: `radial-gradient(ellipse, ${c2}, transparent 68%)`, animation: "bgPulse2 7s ease-in-out infinite", transition: "background 0.8s ease" }} />
      <div style={{ position: "absolute", top: "30%", right: "5%", width: "45%", height: "45%", background: `radial-gradient(ellipse, ${c3}, transparent 65%)`, animation: "bgPulse1 10s ease-in-out infinite reverse", transition: "background 0.8s ease" }} />
      <NeuralScene accent={accent} accent2={catIdx === 2 ? "#5B4FFF" : "#00F5D4"} opacity={0.55} density={0.85} flyKey={flyKey} fixed />
    </div>
  );
}

/* ── Neural network background (quiz view — black + SVG neurons) ─────────── */

// 27 question nodes spread organically left→right in a 1920×1080 canvas
const Q_NODES: [number, number][] = [
  [ 80, 540], [165, 280], [220, 760], [295, 175], [335, 520],
  [400, 380], [460, 760], [515, 155], [570, 455], [610, 295],
  [670, 680], [730, 215], [775, 520], [835, 355], [880, 755],
  [940, 175], [980, 480], [1045, 315], [1095, 675], [1145, 195],
  [1195, 440], [1255, 740], [1305, 295], [1360, 555], [1415, 175],
  [1470, 440], [1555, 340],
];

const _BG_NODES: [number, number][] = [
  [115, 120], [165, 900], [265, 440], [365,  90], [355, 870],
  [505, 610], [505, 270], [595, 860], [665, 100], [715, 440],
  [765, 760], [835, 560], [915, 640], [965, 100], [1015, 780],
  [1065, 520], [1135, 380], [1175, 840], [1215, 120], [1275, 600],
  [1315, 840], [1385, 280], [1435, 720], [1495, 580], [1565, 600],
  [1595, 200], [1635, 800], [1695, 420], [1735, 160], [1795, 600],
  [1835, 380], [1875, 760], [1915, 240],  [55, 780], [105, 200],
  [215, 630], [295, 320], [435, 180], [635, 580], [1915, 540],
];

const _ALL_NET = [...Q_NODES, ..._BG_NODES];

const NET_EDGES: [number, number][] = (() => {
  const out: [number, number][] = [];
  const T2 = 285 * 285;
  for (let i = 0; i < _ALL_NET.length; i++) {
    let cnt = 0;
    for (let j = i + 1; j < _ALL_NET.length && cnt < 4; j++) {
      const dx = _ALL_NET[i][0] - _ALL_NET[j][0], dy = _ALL_NET[i][1] - _ALL_NET[j][1];
      if (dx * dx + dy * dy < T2) { out.push([i, j]); cnt++; }
    }
  }
  return out;
})();

function NeuralNetBg({ qIdx }: { qIdx: number }) {
  const [cx, cy] = Q_NODES[Math.min(qIdx, Q_NODES.length - 1)];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", background: "#000" }}>
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}>

        {NET_EDGES.map(([a, b], k) => {
          const aQ = a < 27, bQ = b < 27;
          const aLit = aQ && a <= qIdx, bLit = bQ && b <= qIdx;
          const bothLit = aLit && bLit;
          const touchesCur = (aQ && a === qIdx) || (bQ && b === qIdx);
          return (
            <line key={k}
              x1={_ALL_NET[a][0]} y1={_ALL_NET[a][1]}
              x2={_ALL_NET[b][0]} y2={_ALL_NET[b][1]}
              stroke={bothLit ? "rgba(91,79,255,0.28)" : touchesCur ? "rgba(91,79,255,0.16)" : "rgba(91,79,255,0.05)"}
              strokeWidth={bothLit ? 1.2 : 0.5}
              style={{ transition: "stroke 0.7s ease, stroke-width 0.7s ease" }}
            />
          );
        })}

        {_BG_NODES.map(([x, y], i) => (
          <circle key={`bg${i}`} cx={x} cy={y} r={2.5} fill="rgba(91,79,255,0.07)" />
        ))}

        {Q_NODES.map(([x, y], i) => {
          const lit = i < qIdx, cur = i === qIdx;
          return (
            <circle key={`q${i}`} cx={x} cy={y}
              r={cur ? 7 : lit ? 4.5 : 3}
              fill={cur ? "#5B4FFF" : lit ? "rgba(91,79,255,0.55)" : "rgba(91,79,255,0.12)"}
              style={{
                filter: cur
                  ? "drop-shadow(0 0 10px #5B4FFF) drop-shadow(0 0 22px rgba(91,79,255,0.9))"
                  : lit ? "drop-shadow(0 0 5px rgba(91,79,255,0.5))" : "none",
                transition: "all 0.7s ease",
              }}
            />
          );
        })}

        {/* Pulsing ring on current node — travels with question index */}
        <g style={{ transform: `translate(${cx}px,${cy}px)`, transition: "transform 0.7s ease" }}>
          <circle r={12} fill="none" stroke="rgba(91,79,255,0.5)" strokeWidth={1.5}
            style={{ transformBox: "fill-box", transformOrigin: "center", animation: "neuronRing 2s ease-out infinite" }} />
          <circle r={18} fill="none" stroke="rgba(0,245,212,0.18)" strokeWidth={0.8}
            style={{ transformBox: "fill-box", transformOrigin: "center", animation: "neuronRing 2s ease-out infinite 0.7s" }} />
        </g>
      </svg>
    </div>
  );
}

/* ── Milestone overlay ──────────────────────────────────────────────────── */

function MilestoneOverlay({
  icon, heading, sub, progress, onContinue
}: { icon: "brain"|"target"|"fire"; heading: string; sub: string; progress: number; onContinue: () => void }) {
  const iconPaths: Record<string, string> = {
    brain: "M12 2a5 5 0 015 5 5 5 0 01-1 3 5 5 0 012 4c0 3-2 5-5 5H7a5 5 0 01-5-5 5 5 0 012-4 5 5 0 01-1-3 5 5 0 015-5h4z",
    target: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-4a6 6 0 100-12 6 6 0 000 12zm0-4a2 2 0 100-4 2 2 0 000 4z",
    fire: "M12 2c0 0-5 4-5 9a5 5 0 0010 0c0-2-1-3-2-4 0 2-1 3-2 3-1 0-2-1-2-2 0-2 1-6 1-6zM12 22c2.21 0 4-1.79 4-4 0-1.5-1-3-3-4 0 1.5-1 2-1 2-1.5 0-2-1-2-2.5C8 15.2 8 22 12 22z",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(3,5,15,0.85)", backdropFilter: "blur(16px)",
      padding: "24px",
    }}>
      <div className="animate-scale-in" style={{
        maxWidth: 420, width: "100%",
        background: GLASS, border: `1px solid ${BORD}`,
        borderRadius: 16, padding: "36px 28px",
        backdropFilter: "blur(20px)",
        textAlign: "center",
        boxShadow: "0 24px 80px rgba(91,79,255,0.2)",
      }}>
        {/* Icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <svg width={50} height={50} viewBox="0 0 24 24" fill="none">
            <path d={iconPaths[icon]} fill={CYAN} />
          </svg>
        </div>
        {/* Heading */}
        <h2 style={{
          fontSize: 22, fontWeight: 700, marginBottom: 10,
          background: `linear-gradient(135deg, ${BLUE}, ${CYAN})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>{heading}</h2>
        {/* Sub */}
        <p style={{ fontSize: 14, color: DIM, marginBottom: 24, lineHeight: 1.5 }}>{sub}</p>
        {/* Progress */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: DIM, marginBottom: 6 }}>
            <span>Progress</span><span>{progress}%</span>
          </div>
          <div style={{ height: 4, background: "rgba(91,79,255,0.12)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${BLUE}, ${CYAN})`, borderRadius: 2, transition: "width 1s ease" }} />
          </div>
        </div>
        {/* Button */}
        <button onClick={onContinue} style={{
          width: "100%", padding: "14px 24px",
          background: `linear-gradient(135deg, ${BLUE}, ${CYAN})`,
          border: "none", borderRadius: 10,
          fontSize: 14, fontWeight: 700, color: "#fff",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(91,79,255,0.45)",
          transition: "transform 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

/* ── Milestone data ─────────────────────────────────────────────────────── */

const MILESTONE_DATA: Record<number, {icon:"brain"|"target"|"fire"; heading:string; sub:string}> = {
  5:  { icon:"brain",  heading:"Your pattern recognition is exceptional!", sub:"You're in the top 20% so far — keep going!" },
  16: { icon:"target", heading:"Halfway there!", sub:"Your IQ is tracking above average. Don't stop now." },
  25: { icon:"fire",   heading:"Almost done!", sub:"Just 7 questions left — your score is looking very strong." },
};

/* ── Main test page ─────────────────────────────────────────────────────── */

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh","Belarus","Belgium","Bolivia",
  "Brazil","Bulgaria","Cambodia","Canada","Chile","China","Colombia","Croatia","Czech Republic","Denmark",
  "Ecuador","Egypt","Ethiopia","Finland","France","Germany","Ghana","Greece","Guatemala","Hungary",
  "India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Japan","Jordan","Kenya",
  "South Korea","Malaysia","Mexico","Morocco","Netherlands","New Zealand","Nigeria","Norway","Pakistan","Peru",
  "Philippines","Poland","Portugal","Romania","Russia","Saudi Arabia","Serbia","Singapore","South Africa","Spain",
  "Sri Lanka","Sweden","Switzerland","Taiwan","Thailand","Turkey","Ukraine","United Arab Emirates","United Kingdom","United States",
  "Venezuela","Vietnam","Other",
];

export default function TestPage() {
  const router = useRouter();

  /* ── Pre-test form state ─────────────────────────────────────────────── */
  const [screen,     setScreen]     = useState<"form"|"quiz">("form");
  const [gender,     setGender]     = useState("");
  const [ageGroup,   setAgeGroup]   = useState("");
  const [country,    setCountry]    = useState("");
  const [occupation, setOccupation] = useState("");

  function handleStartTest() {
    if (gender)     localStorage.setItem("user_gender",     gender);
    if (ageGroup)   localStorage.setItem("user_age",        ageGroup);
    if (country)    localStorage.setItem("user_country",    country);
    if (occupation) localStorage.setItem("user_occupation", occupation);
    setScreen("quiz");
  }

  /* ── Form screen ─────────────────────────────────────────────────────── */
  if (screen === "form") {
    const pill = (active: boolean): React.CSSProperties => ({
      padding: "9px 18px",
      background: active ? BLUE : "rgba(5,18,45,0.8)",
      border: `1px solid ${active ? BLUE : BORD}`,
      borderRadius: 8, cursor: "pointer",
      fontSize: 13, color: active ? "#fff" : "#C0C8D8",
      fontWeight: active ? 700 : 400,
      transition: "all 150ms",
      boxShadow: active ? "0 0 14px rgba(91,79,255,0.4)" : "none",
    });
    return (
      <div style={{ minHeight: "100dvh", background: BG, color: TEXT, display: "flex", flexDirection: "column", position: "relative", fontFamily: "'Inter',system-ui,sans-serif" }}>
        <AnimatedTestBg catIdx={0} />
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: `1px solid ${BORD}`, background: "rgba(3,5,15,0.9)", position: "relative", zIndex: 5 }}>
          <NavLogo />
          <button onClick={handleStartTest} style={{ fontSize: 11, color: DIM, background: "none", border: "none", cursor: "pointer" }}>Skip →</button>
        </nav>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px", position: "relative", zIndex: 5 }}>
          <div className="animate-fade-up" style={{ maxWidth: 460, width: "100%" }}>
            <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: BLUE, marginBottom: 10, fontWeight: 700 }}>Quick setup</p>
            <h1 style={{ fontSize: "clamp(22px,4vw,30px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 6 }}>
              Takes 10 seconds
            </h1>
            <p style={{ fontSize: 13, color: DIM, lineHeight: 1.6, marginBottom: 28 }}>
              This personalises your score comparison — we will show you how you rank vs your demographic group.
            </p>

            {/* Gender */}
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: DIM, marginBottom: 10, fontWeight: 600 }}>Gender</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[{v:"man",l:"Man"},{v:"woman",l:"Woman"},{v:"other",l:"Prefer not to say"}].map(({v,l}) => (
                  <button key={v} onClick={() => setGender(g => g === v ? "" : v)} style={pill(gender === v)}>{l}</button>
                ))}
              </div>
            </div>

            {/* Age group */}
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: DIM, marginBottom: 10, fontWeight: 600 }}>Age group</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["15–17","18–24","25–34","35–44","45–54","55+"].map(a => (
                  <button key={a} onClick={() => setAgeGroup(g => g === a ? "" : a)} style={pill(ageGroup === a)}>{a}</button>
                ))}
              </div>
            </div>

            {/* Country */}
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: DIM, marginBottom: 10, fontWeight: 600 }}>Country</p>
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "rgba(5,18,45,0.9)", border: `1px solid ${BORD}`,
                  borderRadius: 8, fontSize: 13, color: country ? TEXT : DIM,
                  outline: "none", cursor: "pointer", fontFamily: "inherit",
                  appearance: "none",
                }}
              >
                <option value="">Select your country…</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Occupation */}
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: DIM, marginBottom: 10, fontWeight: 600 }}>Occupation</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["Student","Professional","Other"].map(o => (
                  <button key={o} onClick={() => setOccupation(p => p === o ? "" : o)} style={pill(occupation === o)}>{o}</button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartTest}
              style={{
                width: "100%", padding: "15px 24px",
                background: `linear-gradient(135deg,${BLUE},#00C9AE)`,
                border: "none", borderRadius: 10,
                fontSize: 15, fontWeight: 700, color: "#fff",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(91,79,255,0.45)",
                transition: "transform 150ms",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Start Test →
            </button>
            <p style={{ fontSize: 10, color: "#6A88AA", textAlign: "center", marginTop: 12 }}>30 questions · ~15 minutes · No signup required</p>
          </div>
        </div>
      </div>
    );
  }

  return <QuizScreen />;
}

/* ════════════════════════════════════════════════════════════════════════════
   QUIZ COMPONENT — all quiz hooks live here (no early returns before hooks)
════════════════════════════════════════════════════════════════════════════ */
function QuizScreen() {
  const router = useRouter();
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [catScores, setCatScores] = useState([0, 0, 0, 0, 0, 0]);
  const [catTotals, setCatTotals] = useState([0, 0, 0, 0, 0, 0]);
  const [weightedScore, setWeightedScore] = useState(0);
  const [maxPossible,   setMaxPossible]   = useState(0);
  const [minPossible,   setMinPossible]   = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(ALL_QUESTIONS[0].time);
  const [showTransition, setShowTransition] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null);
  const [transPhase, setTransPhase] = useState<0|1|2>(2); // 0=exit, 1=enter, 2=idle
  const [memReady, setMemReady] = useState(false);
  const [streak, setStreak] = useState(0);
  const [streakFlash, setStreakFlash] = useState(false);
  const [milestoneData, setMilestoneData] = useState<{icon:"brain"|"target"|"fire";heading:string;sub:string}|null>(null);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const shownMilestonesRef = useRef(new Set<number>());

  const q = ALL_QUESTIONS[qIdx];
  const isMemory = q.vis?.kind === "memory";
  const timerPaused = isMemory && !memReady;

  const advanceTo = useCallback((nextIdx: number) => {
    setTransPhase(0);
    setTimeout(() => {
      setQIdx(nextIdx);
      setAnswered(false);
      setSelected(null);
      setFeedback(null);
      setMemReady(false);
      setTimeLeft(ALL_QUESTIONS[nextIdx].time);
      setTransPhase(1);
      setTimeout(() => setTransPhase(2), 200);
    }, 200);
  }, []);

  const handleNext = useCallback(() => {
    const nextIdx = qIdx + 1;
    const isSkip  = !answered;

    // Synchronously build updated records/catTotals before possible navigation
    let currentRecords    = answerRecords;
    let currentCatTotals  = catTotals;
    if (isSkip) {
      const skipRec: AnswerRecord = { diff: q.diff, cat: q.cat, correct: false, timeFrac: 0, skipped: true };
      currentRecords   = [...answerRecords, skipRec];
      currentCatTotals = [...catTotals];
      currentCatTotals[q.cat]++;
      setAnswerRecords(currentRecords);
      setCatTotals(currentCatTotals);
    }

    if (nextIdx >= ALL_QUESTIONS.length) {
      localStorage.setItem("iq_score",        score.toString());
      localStorage.setItem("iq_total",        ALL_QUESTIONS.length.toString());
      localStorage.setItem("iq_catScores",    JSON.stringify(catScores));
      localStorage.setItem("iq_catTotals",    JSON.stringify(currentCatTotals));
      localStorage.setItem("iq_weighted",     weightedScore.toString());
      localStorage.setItem("iq_maxPossible",  maxPossible.toString());
      localStorage.setItem("iq_minPossible",  minPossible.toString());
      localStorage.setItem("iq_records",      JSON.stringify(currentRecords));
      router.push("/results");
      return;
    }

    // Milestone check
    if (MILESTONE_DATA[nextIdx] && !shownMilestonesRef.current.has(nextIdx)) {
      shownMilestonesRef.current.add(nextIdx);
      setMilestoneData(MILESTONE_DATA[nextIdx]);
      return;
    }

    if (ALL_QUESTIONS[nextIdx].cat !== q.cat) {
      setShowTransition(true);
    } else {
      advanceTo(nextIdx);
    }
  }, [qIdx, score, catScores, catTotals, weightedScore, maxPossible, minPossible, q, router, advanceTo, answered, answerRecords, streak]);

  // Countdown timer (paused during memory reveal)
  useEffect(() => {
    if (answered || showTransition || timerPaused) return;
    if (timeLeft <= 0) {
      setAnswered(true);
      setResults(prev => [...prev, false]);
      setCatTotals(prev => { const n = [...prev]; n[q.cat]++; return n; });
      const w = DIFF_WEIGHTS[q.diff];
      setWeightedScore(v => v + w.wrong);
      setMaxPossible(v => v + w.correct);
      setMinPossible(v => v + w.wrong);
      setFeedback({ correct: false, text: `Time's up! ${q.exp}` });
      setAnswerRecords(prev => [...prev, { diff: q.diff, cat: q.cat, correct: false, timeFrac: 1, skipped: false }]);
      return;
    }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, answered, showTransition, timerPaused, q]);

  // Auto-dismiss streak flash
  useEffect(() => {
    if (streakFlash) {
      const t = setTimeout(() => setStreakFlash(false), 2000);
      return () => clearTimeout(t);
    }
  }, [streakFlash]);

  function selectOpt(i: number) {
    if (answered) return;
    setAnswered(true);
    setSelected(i);
    const correct   = i === q.ans;
    const timeFrac  = Math.max(0, Math.min(1, 1 - timeLeft / q.time));
    setAnswerRecords(prev => [...prev, { diff: q.diff, cat: q.cat, correct, timeFrac, skipped: false }]);
    setResults(prev => [...prev, correct]);
    const ns = [...catScores], nt = [...catTotals];
    if (correct) { ns[q.cat]++; setScore(s => s + 1); }
    nt[q.cat]++;
    setCatScores(ns);
    setCatTotals(nt);
    const w = DIFF_WEIGHTS[q.diff];
    setWeightedScore(v => v + (correct ? w.correct : w.wrong));
    setMaxPossible(v => v + w.correct);
    setMinPossible(v => v + w.wrong);
    setFeedback({ correct, text: correct ? `Correct! ${q.exp}` : `Incorrect. ${q.exp}` });

    // Streak tracking
    if (correct) {
      const ns2 = streak + 1;
      setStreak(ns2);
      if (ns2 >= 3) setStreakFlash(true);
    } else {
      setStreak(0);
      setStreakFlash(false);
    }
  }

  function continueAfterTransition() {
    setShowTransition(false);
    advanceTo(qIdx + 1);
  }

  function continueFromMilestone() {
    setMilestoneData(null);
    const nextIdx = qIdx + 1;
    if (nextIdx < ALL_QUESTIONS.length && ALL_QUESTIONS[nextIdx].cat !== q.cat) {
      setShowTransition(true);
    } else if (nextIdx < ALL_QUESTIONS.length) {
      advanceTo(nextIdx);
    }
  }

  // Derived display values
  const accent      = DIM_ACCENTS[q.cat] ?? BLUE;
  const timerDanger = timeLeft <= Math.round(q.time * 0.25);
  const timerWarn   = timeLeft <= Math.round(q.time * 0.50);
  const timerColor  = timerDanger ? RED : timerWarn ? ORANGE : CYAN;
  const timerPct    = (timeLeft / q.time) * 100;
  const progress    = ((qIdx + 1) / ALL_QUESTIONS.length) * 100;

  const hasVisOpts = q.vis?.kind === "raven" || q.vis?.kind === "rotation" || q.vis?.kind === "embedded"
    || q.vis?.kind === "raven2" || q.vis?.kind === "ravenrot" || q.vis?.kind === "ravenpattern" || q.vis?.kind === "topview"
    || q.vis?.kind === "clock" || q.vis?.kind === "heatmap" || q.vis?.kind === "mirror"
    || q.vis?.kind === "binary" || q.vis?.kind === "shadow3d" || q.vis?.kind === "origami" || q.vis?.kind === "shapesum";

  const keyframes = `
    @keyframes bgPulse1 { 0%,100%{opacity:0.7} 50%{opacity:0.3} }
    @keyframes bgPulse2 { 0%,100%{opacity:0.3} 50%{opacity:0.7} }
    @keyframes nodeGlow { 0%,100%{opacity:0.3} 50%{opacity:0.8} }
    @keyframes lineGlow { 0%,100%{opacity:0.06} 50%{opacity:0.18} }
    @keyframes neuronRing { 0%{transform:scale(0.8);opacity:0.8} 100%{transform:scale(2.8);opacity:0} }
    @keyframes node-current { 0%,100%{box-shadow:0 0 0 0 rgba(91,79,255,0.7)} 50%{box-shadow:0 0 0 5px rgba(91,79,255,0)} }
    @keyframes streakSlide { from{transform:translateY(-100%);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes qFadeIn { from{opacity:0} to{opacity:1} }
    @keyframes slideOutUp { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-30px)} }
    @keyframes slideInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  `;

  // ── Category transition ──────────────────────────────────────────────────
  if (showTransition) {
    const prevCat = CATEGORIES[q.cat];
    const nextCat = CATEGORIES[ALL_QUESTIONS[qIdx + 1].cat];
    const catScore = catScores[q.cat];
    const catTotal = catTotals[q.cat];
    const motivational = catScore === catTotal
      ? "Perfect section! You nailed every question."
      : catScore >= Math.ceil(catTotal * 0.75)
      ? "Strong performance! Keep that momentum."
      : catScore >= Math.ceil(catTotal * 0.5)
      ? "Good work. Stay focused for the next section."
      : "Keep going — every section is a new chance to shine.";

    return (
      <div style={{ height: "100dvh", overflow: "hidden", display: "flex", flexDirection: "column", background: BG, color: TEXT, position: "relative", fontFamily: "'Inter',system-ui,sans-serif" }}>
        <style>{keyframes}</style>
        <AnimatedTestBg catIdx={ALL_QUESTIONS[qIdx + 1].cat} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px", position: "relative", zIndex: 5 }}>
          <div className="animate-fade-up" style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
            {/* Section complete card */}
            <div style={{
              background: GLASS, border: `1px solid ${BORD}`,
              backdropFilter: "blur(20px)", borderRadius: 16, padding: "32px 28px", marginBottom: 20,
              boxShadow: "0 24px 60px rgba(91,79,255,0.15)",
            }}>
              <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: GREEN, marginBottom: 12, fontWeight: 700 }}>
                ✓ Section complete
              </p>
              <p style={{ fontSize: 13, color: DIM, marginBottom: 8 }}>{prevCat.name}</p>
              <div style={{ fontSize: 56, fontWeight: 300, color: BLUE, lineHeight: 1, margin: "12px 0", textShadow: "0 0 30px rgba(91,79,255,0.5)" }}>
                {catScore}<span style={{ fontSize: 22, color: DIM }}>/{catTotal}</span>
              </div>
              <p style={{ fontSize: 13, color: "#9ABCD4", marginBottom: 16, lineHeight: 1.5 }}>{motivational}</p>
              <div style={{ height: 3, background: "rgba(91,79,255,0.12)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${catTotal > 0 ? (catScore / catTotal) * 100 : 0}%`, background: `linear-gradient(90deg,${BLUE},${CYAN})`, transition: "width 0.9s ease", borderRadius: 2 }} />
              </div>
            </div>

            {/* Overall progress */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: DIM, marginBottom: 6 }}>
                <span>Overall progress</span><span>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: 3, background: "rgba(91,79,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${BLUE},${CYAN})`, borderRadius: 2 }} />
              </div>
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 400, marginBottom: 6 }}>
              Next: <span style={{ color: BLUE, fontWeight: 700 }}>{nextCat.name}</span>
            </h2>
            <p style={{ fontSize: 13, color: DIM, marginBottom: 24 }}>Take a breath before continuing.</p>

            <button
              onClick={continueAfterTransition}
              style={{
                width: "100%", padding: "14px 24px",
                background: `linear-gradient(135deg,${BLUE},${CYAN})`,
                border: "none", borderRadius: 10,
                fontSize: 14, fontWeight: 700, color: "#fff",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(91,79,255,0.4)",
                transition: "transform 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main test ────────────────────────────────────────────────────────────
  // Apple-style slide up/down transition
  const CB2 = "cubic-bezier(0.25,0.46,0.45,0.94)";
  const slideStyle: React.CSSProperties =
    transPhase === 0 ? { animation: `slideOutUp 200ms ${CB2} forwards` } :
    transPhase === 1 ? { animation: `slideInUp 200ms ${CB2} forwards` } :
    {};

  return (
    <div style={{
      height: "100dvh", overflow: "hidden", display: "flex", flexDirection: "column",
      background: BG, color: TEXT, position: "relative",
      fontFamily: "'Inter',system-ui,sans-serif",
    }}>
      <style>{keyframes}</style>

      <NeuralNetBg qIdx={qIdx} />

      {/* Milestone overlay */}
      {milestoneData && (
        <MilestoneOverlay
          icon={milestoneData.icon}
          heading={milestoneData.heading}
          sub={milestoneData.sub}
          progress={Math.round((qIdx / ALL_QUESTIONS.length) * 100)}
          onContinue={continueFromMilestone}
        />
      )}

      {/* Streak banner — position:absolute, never affects layout */}
      {streakFlash && streak >= 3 && (
        <div style={{
          position: "absolute", top: "8vh", left: 0, right: 0, zIndex: 40,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "6px 16px",
          background: "linear-gradient(90deg,rgba(255,159,28,0.18),rgba(255,60,0,0.10))",
          borderBottom: "1px solid rgba(255,159,28,0.25)",
          backdropFilter: "blur(10px)",
          animation: "streakSlide 0.3s ease",
          pointerEvents: "none",
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill={ORANGE}>
            <path d="M12 2c0 0-5 4-5 9a5 5 0 0010 0c0-2-1-3-2-4 0 2-1 3-2 3-1 0-2-1-2-2 0-2 1-6 1-6z" />
          </svg>
          <span style={{ fontSize: 11, fontWeight: 700, color: ORANGE }}>{streak} correct in a row!</span>
        </div>
      )}

      {/* ══ ZONE 1 — HEADER (8vh) ════════════════════════════════════════ */}
      <div style={{
        height: "8vh", flexShrink: 0, zIndex: 10, position: "relative",
        display: "flex", flexDirection: "column",
        background: "rgba(3,5,15,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(91,79,255,0.12)",
      }}>
        {/* Neural progress nodes — lit = answered, pulsing = current, dim = upcoming */}
        <div style={{
          height: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
          gap: "clamp(2px,0.6vw,4px)", padding: "2px 8px 0",
        }}>
          {ALL_QUESTIONS.map((qq, i) => {
            const lit = i < qIdx;
            const cur = i === qIdx;
            const nodeCol = DIM_ACCENTS[qq.cat] ?? BLUE;
            return (
              <span key={i} style={{
                width: cur ? 7 : 5, height: cur ? 7 : 5, borderRadius: "50%",
                background: lit ? nodeCol : cur ? accent : "rgba(91,79,255,0.18)",
                boxShadow: lit ? `0 0 5px ${nodeCol}` : cur ? `0 0 8px ${accent}` : "none",
                animation: cur ? "node-current 1.6s ease-in-out infinite" : "none",
                transition: "background 0.4s, box-shadow 0.4s, width 0.3s, height 0.3s",
                flexShrink: 1, minWidth: 3,
              }} />
            );
          })}
        </div>
        {/* Logo | Q counter | Timer */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 clamp(12px,3vw,20px)",
        }}>
          <span style={{ fontSize: "clamp(12px,2.5vw,15px)", fontWeight: 700, letterSpacing: "-0.02em", flexShrink: 0 }}>
            Real<span style={{ color: BLUE }}>IQ</span>Test
          </span>

          {/* Q counter + streak */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "clamp(12px,2.2vw,14px)", color: DIM }}>
              <span style={{ color: TEXT, fontWeight: 700 }}>{qIdx + 1}</span>
              <span style={{ color: "rgba(91,79,255,0.4)", margin: "0 3px" }}>/</span>
              {ALL_QUESTIONS.length}
            </span>
            {streak >= 3 && (
              <div style={{
                display: "flex", alignItems: "center", gap: 3,
                background: "rgba(255,159,28,0.12)", border: "1px solid rgba(255,159,28,0.3)",
                borderRadius: 99, padding: "1px 7px",
              }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill={ORANGE}>
                  <path d="M12 2c0 0-5 4-5 9a5 5 0 0010 0c0-2-1-3-2-4 0 2-1 3-2 3-1 0-2-1-2-2 0-2 1-6 1-6z" />
                </svg>
                <span style={{ fontSize: 9, fontWeight: 700, color: ORANGE }}>{streak}</span>
              </div>
            )}
          </div>

          {/* Timer circle */}
          <div style={{ position: "relative", width: "clamp(34px,6vw,42px)", height: "clamp(34px,6vw,42px)", flexShrink: 0 }}>
            <svg style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }} width="100%" height="100%" viewBox="0 0 44 44">
              <circle cx={22} cy={22} r={18} fill="none" stroke="rgba(91,79,255,0.12)" strokeWidth={2.5} />
              <circle cx={22} cy={22} r={18} fill="none" stroke={timerColor} strokeWidth={2.5} strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - (timerPaused ? 1 : timerPct) / 100)}`}
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease", filter: timerDanger ? `drop-shadow(0 0 4px ${timerColor})` : "none" }}
              />
            </svg>
            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(9px,2vw,11px)", fontWeight: 700, color: timerPaused ? DIM : timerColor }}>
              {timerPaused ? "—" : timeLeft}
            </span>
          </div>
        </div>
      </div>

      {/* Content wrapper — fades with question transitions.
          Uses px for nav/feedback (always visible) and flex:1 for visual (adapts). */}
      <div ref={cardRef} style={{ ...slideStyle, display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

        {/* ── CATEGORY (34px fixed) ──────────────────────────────────────── */}
        <div style={{
          height: 34, flexShrink: 0, zIndex: 5, position: "relative",
          display: "flex", alignItems: "center",
          padding: "0 clamp(12px,3vw,20px)",
          borderBottom: "1px solid rgba(91,79,255,0.08)",
          maxWidth: 760, width: "100%", margin: "0 auto", boxSizing: "border-box",
          gap: 8,
        }}>
          <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: DIM, fontWeight: 600 }}>
            {CATEGORIES[q.cat].name}
          </span>
          <span style={{ color: "rgba(91,79,255,0.3)", fontSize: 10 }}>|</span>
          <span style={{
            fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700,
            ...(q.diff === "easy" ? { color: GREEN } : q.diff === "medium" ? { color: "#9D8FFF" } : { color: RED }),
          }}>{q.diff}</span>
          <span style={{ fontSize: 9, letterSpacing: "0.10em", textTransform: "uppercase", padding: "1px 6px", borderRadius: 2, border: `1px solid ${accent}44`, color: accent, transition: "color 0.5s, border-color 0.5s" }}>{q.badge}</span>
        </div>

        {/* ── QUESTION TEXT (clamp 60–80px fixed) ───────────────────────── */}
        <div style={{
          height: "clamp(60px,9vh,80px)", flexShrink: 0, zIndex: 5, position: "relative",
          display: "flex", alignItems: "center",
          padding: "0 clamp(12px,3vw,20px)",
          maxWidth: 760, width: "100%", margin: "0 auto", boxSizing: "border-box",
          overflow: "hidden",
        }}>
          {q.type === "analogy" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap", width: "100%", overflow: "hidden" }}>
              <p style={{ fontSize: "clamp(12px,2vw,16px)", fontWeight: 600, color: TEXT, lineHeight: 1.3, margin: 0 }}>{q.text}</p>
              <span style={{ fontSize: "clamp(12px,2vw,15px)", fontWeight: 600 }}>{q.w1}</span>
              <span style={{ fontSize: "clamp(9px,1.5vw,11px)", color: DIM }}>is to</span>
              <span style={{ fontSize: "clamp(12px,2vw,15px)", fontWeight: 600 }}>{q.w2}</span>
              <span style={{ fontSize: "clamp(9px,1.5vw,11px)", color: DIM }}>as</span>
              <span style={{ fontSize: "clamp(12px,2vw,15px)", fontWeight: 600 }}>{q.w3}</span>
              <span style={{ fontSize: "clamp(9px,1.5vw,11px)", color: DIM }}>is to</span>
              <span style={{ color: BLUE, borderBottom: "2px dashed rgba(91,79,255,0.5)", minWidth: 36, textAlign: "center", fontSize: "clamp(12px,2vw,15px)" }}>?</span>
            </div>
          ) : q.type === "sequence" && q.seq ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", overflow: "hidden" }}>
              <p style={{ fontSize: "clamp(12px,2vw,16px)", fontWeight: 600, color: TEXT, lineHeight: 1.3, margin: 0,
                overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                {q.text}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "nowrap", overflow: "hidden" }}>
                {q.seq.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                    <div style={{
                      width: "clamp(26px,5.5vw,36px)", height: "clamp(26px,5.5vw,36px)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 5, fontSize: "clamp(10px,2vw,14px)", fontWeight: 600, flexShrink: 0,
                      ...(s === "?"
                        ? { background: "rgba(91,79,255,0.08)", border: "2px dashed rgba(91,79,255,0.5)", color: BLUE }
                        : { background: "rgba(5,18,45,0.9)", border: "1px solid rgba(91,79,255,0.2)", color: TEXT }),
                    }}>{s}</div>
                    {i < q.seq!.length - 1 && <span style={{ color: DIM, fontSize: 10 }}>→</span>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{
              fontSize: "clamp(14px,2.2vw,18px)", fontWeight: 600, lineHeight: 1.4, color: TEXT,
              margin: 0, overflow: "hidden", display: "-webkit-box",
              WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            }}>{q.text}</p>
          )}
        </div>

        {/* ── VISUAL (flex:1 — takes all remaining space) ────────────────── */}
        <div style={{
          flex: 1, minHeight: 0, zIndex: 5, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "4px clamp(12px,3vw,20px)",
          maxWidth: 760, width: "100%", margin: "0 auto", boxSizing: "border-box",
          overflow: "hidden",
        }}>
          {q.vis ? (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(5,10,30,0.55)", border: `1px solid ${accent}30`,
              backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
              borderRadius: 14, padding: "clamp(6px,1.2vh,12px)",
              overflow: "hidden", boxSizing: "border-box",
              boxShadow: `0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 ${accent}14`,
              transition: "border-color 0.5s, box-shadow 0.5s",
            }}>
              <VisualDisplay vis={q.vis} onMemReady={() => setMemReady(true)} />
            </div>
          ) : (
            <div style={{ width: "100%", height: "100%" }} />
          )}
        </div>

        {/* ── OPTIONS GRID 2×2 (compact — visual gets priority) ───────────── */}
        <div style={{
          height: "clamp(130px,22vh,200px)", flexShrink: 0, zIndex: 5, position: "relative",
          padding: "4px clamp(12px,3vw,20px) 0",
          maxWidth: 760, width: "100%", margin: "0 auto", boxSizing: "border-box",
          overflow: "hidden",
        }}>
          <div style={{
            width: "100%", height: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "clamp(4px,1vw,7px)",
          }}>
            {q.opts.map((opt, i) => {
              const isCorrect = answered && i === q.ans;
              const isWrong   = answered && i === selected && i !== q.ans;
              const isSel     = selected === i && !answered;
              return (
                <button key={i} onClick={() => selectOpt(i)} disabled={answered}
                  style={{
                    width: "100%", height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: hasVisOpts ? "center" : "flex-start",
                    flexDirection: hasVisOpts ? "column" : "row",
                    gap: hasVisOpts ? 4 : 8,
                    padding: hasVisOpts ? "clamp(3px,0.8vw,6px)" : "clamp(4px,1vh,8px) clamp(8px,1.8vw,14px)",
                    border: "2px solid",
                    borderRadius: 8,
                    cursor: answered ? "default" : "pointer",
                    transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.1s",
                    background: isCorrect ? "rgba(0,216,122,0.12)" : isWrong ? "rgba(255,59,59,0.12)" : isSel ? `${accent}1f` : GLASS,
                    borderColor: isCorrect ? GREEN : isWrong ? RED : isSel ? accent : "rgba(91,79,255,0.20)",
                    boxShadow: isCorrect
                      ? `0 0 0 1px ${GREEN}, 0 0 18px rgba(0,216,122,0.28)`
                      : isWrong ? `0 0 0 1px ${RED}, 0 0 12px rgba(255,59,59,0.25)` : "none",
                    backdropFilter: "blur(12px)",
                    overflow: "hidden",
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={e => { if (!answered) { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLButtonElement).style.borderColor = accent; } }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; if (!answered) (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(91,79,255,0.20)"; }}
                >
                  <div style={{
                    minWidth: hasVisOpts ? "auto" : 20, height: hasVisOpts ? "auto" : 20,
                    border: "1px solid",
                    borderColor: isCorrect ? GREEN : isWrong ? RED : "rgba(91,79,255,0.35)",
                    borderRadius: 4,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "clamp(8px,1.4vw,10px)", fontWeight: 700, letterSpacing: "0.06em",
                    color: isCorrect ? GREEN : isWrong ? RED : "#6A90C0",
                    padding: hasVisOpts ? "2px 4px" : "0 3px",
                    flexShrink: 0,
                    marginBottom: hasVisOpts ? 3 : 0,
                  }}>
                    {["A", "B", "C", "D"][i]}
                  </div>
                  <div style={{
                    flex: hasVisOpts ? 1 : "auto" as "auto",
                    width: hasVisOpts ? "100%" : "auto",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    minWidth: 0, overflow: "hidden",
                  }}>
                    <OptionContent vis={q.vis} opt={opt} idx={i} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── FEEDBACK BOX (60px fixed — always fully visible) ───────────── */}
        <div style={{
          height: 60, flexShrink: 0, zIndex: 5, position: "relative",
          display: "flex", alignItems: "center",
          padding: "6px clamp(12px,3vw,20px)",
          maxWidth: 760, width: "100%", margin: "0 auto", boxSizing: "border-box",
        }}>
          {feedback ? (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", gap: 10,
              padding: "0 clamp(12px,2vw,18px)",
              borderRadius: 10,
              overflow: "hidden",
              ...(feedback.correct
                ? {
                    background: "rgba(0,216,122,0.15)",
                    border: "2px solid rgba(0,216,122,0.70)",
                    color: "#00E882",
                    boxShadow: "0 0 24px rgba(0,216,122,0.20)",
                  }
                : {
                    background: "rgba(255,59,59,0.15)",
                    border: "2px solid rgba(255,59,59,0.70)",
                    color: "#FF7070",
                    boxShadow: "0 0 24px rgba(255,59,59,0.20)",
                  }),
            }}>
              <span style={{ fontSize: 20, fontWeight: 900, flexShrink: 0, lineHeight: 1 }}>
                {feedback.correct ? "✓" : "✕"}
              </span>
              <span style={{
                fontSize: "clamp(11px,1.8vw,13px)", fontWeight: 600, lineHeight: 1.35,
                overflow: "hidden", display: "-webkit-box",
                WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
              }}>
                {feedback.text}
              </span>
            </div>
          ) : (
            <div style={{ width: "100%", height: "100%", borderRadius: 10, border: "1px dashed rgba(91,79,255,0.10)" }} />
          )}
        </div>

        {/* ── NAV BUTTONS (52px fixed — always visible on every device) ──── */}
        <div style={{
          height: 52, flexShrink: 0, zIndex: 5, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          padding: "0 clamp(12px,3vw,20px)",
          maxWidth: 760, width: "100%", margin: "0 auto", boxSizing: "border-box",
          gap: 12,
          borderTop: "1px solid rgba(91,79,255,0.08)",
        }}>
          <button onClick={handleNext} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "clamp(9px,1.6vw,11px)", letterSpacing: "0.14em", textTransform: "uppercase",
            color: DIM, padding: "4px 0", flexShrink: 0, minHeight: 44,
          }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = TEXT)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = DIM)}
          >Skip →</button>

          <button onClick={handleNext} disabled={!answered} style={{
            padding: "0 clamp(22px,4.5vw,36px)",
            height: 42,
            fontSize: "clamp(12px,1.8vw,14px)", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
            borderRadius: 8, border: "none", cursor: answered ? "pointer" : "not-allowed",
            background: answered ? `linear-gradient(135deg,${accent},${CYAN})` : "rgba(91,79,255,0.18)",
            color: "#fff", opacity: answered ? 1 : 0.35,
            boxShadow: answered ? "0 4px 24px rgba(91,79,255,0.60), 0 0 48px rgba(91,79,255,0.18)" : "none",
            transition: "opacity 0.2s, box-shadow 0.2s, transform 0.15s",
            flexShrink: 0,
          }}
            onMouseEnter={e => { if (answered) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
          >
            {qIdx === ALL_QUESTIONS.length - 1 ? "See Results →" : "Next →"}
          </button>
        </div>

      </div>{/* end fade wrapper */}
    </div>
  );
}
