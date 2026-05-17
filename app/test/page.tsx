"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ALL_QUESTIONS, CATEGORIES, type ShapeDef, type RavenCell, type VisualDef, type PCell } from "@/lib/questions";
import { DIFF_WEIGHTS } from "@/lib/iq-calculator";

/* ── Design tokens ──────────────────────────────────────────────────────────── */
const BLUE = "#0055FF"; const CYAN = "#06B6D4"; const GREEN = "#00D87A";
const RED = "#FF3B3B"; const DIM = "#8AABCC"; const BG = "#020617";
const BORD = "rgba(0,85,255,0.18)"; const GLASS = "rgba(6,14,40,0.82)";
const TEXT = "#E8F0FF"; const ORANGE = "#FF8C00"; const PURP = "#8B5CF6";

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
  const color = "#6EB0FF";
  if (isQuestion || cell === null) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 60 60">
        <rect x={1} y={1} width={58} height={58} rx={2}
          fill="rgba(0,85,255,0.06)" stroke="#0055FF" strokeWidth={1.5} strokeDasharray="5,3" />
        <text x={30} y={38} textAnchor="middle" fontSize={22} fill="#0055FF" fontWeight="bold">?</text>
      </svg>
    );
  }
  return (
    <svg width="100%" height="100%" viewBox="0 0 60 60">
      <rect x={1} y={1} width={58} height={58} rx={2}
        fill="rgba(5,18,45,0.9)" stroke="rgba(0,85,255,0.22)" strokeWidth={1} />
      {cell.map((sh, i) => <g key={i}>{renderShape(sh, color)}</g>)}
    </svg>
  );
}

/* ── Raven matrix display ───────────────────────────────────────────────── */

function RavenDisplay({ cells }: { cells: (RavenCell | null)[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4, width: "min(280px, calc(35vh - 20px), calc(100vw - 48px))", margin: "0 auto" }}>
      {cells.map((cell, i) => (
        <div key={i} style={{ border: "1px solid rgba(0,85,255,0.14)", borderRadius: 3, overflow: "hidden", aspectRatio: "1" }}>
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
        fill="rgba(5,18,45,0.9)" stroke="rgba(0,85,255,0.22)" strokeWidth={1} />
      <g transform={transform}>
        <path d={path} fill="#6EB0FF" />
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
        <line x1={10} y1={H} x2={W + 10} y2={H} stroke="rgba(0,85,255,0.2)" strokeWidth={1} />
        {values.map((v, i) => {
          const x = 10 + i * (bw + 5);
          const isNull = v === null;
          const h = isNull ? 0 : Math.round((v / max) * (H - 16));
          return (
            <g key={i}>
              {isNull ? (
                <>
                  <rect x={x} y={16} width={bw} height={H - 16} rx={2}
                    fill="rgba(0,85,255,0.06)" stroke="#0055FF" strokeWidth={1.5} strokeDasharray="5,3" />
                  <text x={x + bw / 2} y={H / 2 + 6} textAnchor="middle" fontSize={18} fill="#0055FF" fontWeight="bold">?</text>
                </>
              ) : (
                <>
                  <rect x={x} y={H - h} width={bw} height={h} rx={2}
                    fill="rgba(0,85,255,0.55)" stroke="#0055FF" strokeWidth={1}
                    style={{ filter: "drop-shadow(0 0 6px rgba(0,85,255,0.7))" }} />
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
            border: phase === "showing" ? "none" : "2px dashed rgba(0,85,255,0.25)",
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
          fill="rgba(5,18,45,0.9)" stroke="rgba(0,85,255,0.22)" strokeWidth={1} />
        <path d={display} fill="#6EB0FF" fillRule="evenodd" />
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
      <circle key={i} cx={cx + dx} cy={cy + dy} r={R} fill="#6EB0FF" />
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
              fill="rgba(5,18,45,0.92)" stroke="rgba(0,85,255,0.45)" strokeWidth={1.5} />
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
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 4, width: "min(200px, calc(24vh - 16px), calc(100vw - 48px))", margin: "0 auto" }}>
      {cells.map((cell, i) => (
        <div key={i} style={{ border: "1px solid rgba(0,85,255,0.14)", borderRadius: 3, overflow: "hidden", aspectRatio: "1" }}>
          <RavenCellSVG cell={cell} isQuestion={cell === null} />
        </div>
      ))}
    </div>
  );
}

/* ── Raven rotation display (3×3 grid of rotated arrows) ────────────────── */

function RavenRotDisplay({ path, angles }: { path: string; angles: (number|null)[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4, width: "min(280px, calc(35vh - 20px), calc(100vw - 48px))", margin: "0 auto" }}>
      {angles.map((angle, i) => (
        <div key={i} style={{ border: "1px solid rgba(0,85,255,0.14)", borderRadius: 3, overflow: "hidden", aspectRatio: "1" }}>
          {angle === null ? (
            <svg width="100%" height="100%" viewBox="0 0 60 60">
              <rect x={1} y={1} width={58} height={58} rx={2}
                fill="rgba(0,85,255,0.06)" stroke="#0055FF" strokeWidth={1.5} strokeDasharray="5,3" />
              <text x={30} y={38} textAnchor="middle" fontSize={22} fill="#0055FF" fontWeight="bold">?</text>
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
  const COLOR = "#6EB0FF";
  if (cell === null || isQ) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 60 60">
        <rect x={1} y={1} width={58} height={58} rx={2}
          fill="rgba(0,85,255,0.06)" stroke="#0055FF" strokeWidth={1.5} strokeDasharray="5,3" />
        <text x={30} y={38} textAnchor="middle" fontSize={22} fill="#0055FF" fontWeight="bold">?</text>
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
        fill="rgba(5,18,45,0.9)" stroke="rgba(0,85,255,0.22)" strokeWidth={1} />
      <rect x={0} y={0} width={60} height={60} fill={`url(#${patId})`} clipPath={`url(#${clipId})`} />
      {cell.shape === "tri" && <polygon points={TRI} fill="none" stroke={COLOR} strokeWidth={1.8} />}
      {cell.shape === "sq"  && <rect x={8} y={8} width={44} height={44} fill="none" stroke={COLOR} strokeWidth={1.8} />}
      {cell.shape === "ci"  && <circle cx={30} cy={30} r={22} fill="none" stroke={COLOR} strokeWidth={1.8} />}
    </svg>
  );
}

function RavenPatternDisplay({ cells }: { cells: (PCell|null)[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4, width: "min(280px, calc(35vh - 20px), calc(100vw - 48px))", margin: "0 auto" }}>
      {cells.map((cell, i) => (
        <div key={i} style={{ border: "1px solid rgba(0,85,255,0.14)", borderRadius: 3, overflow: "hidden", aspectRatio: "1" }}>
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
              <polygon points={left}  fill="#6EB0FF" fillOpacity={0.28} stroke="#0055FF" strokeWidth={0.6} />
              <polygon points={right} fill="#6EB0FF" fillOpacity={0.50} stroke="#0055FF" strokeWidth={0.6} />
              <polygon points={top}   fill="#6EB0FF" fillOpacity={0.85} stroke="#0055FF" strokeWidth={0.6} />
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
        background: "rgba(0,85,255,0.08)",
        border: "1px solid rgba(0,85,255,0.25)",
        borderRadius: 4,
        fontSize: compare ? 22 : 28,
        fontWeight: 600,
        color: "#D6E4FF",
        letterSpacing: "0.06em",
        fontFamily: "monospace",
        textShadow: "0 0 16px rgba(0,85,255,0.4)",
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
              border: "1px solid rgba(0,85,255,0.15)",
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
          fill="rgba(5,18,45,0.9)" stroke="rgba(0,85,255,0.22)" strokeWidth={1} />
        <path d={vis.optPaths[idx]} fill="#6EB0FF" />
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
          fill="rgba(5,18,45,0.9)" stroke="rgba(0,85,255,0.22)" strokeWidth={1} />
        <path d={vis.optGrids[idx]} fill="#6EB0FF" />
      </svg>
    );
  }
  return <span style={{ fontSize: "clamp(14px,3.5vw,18px)", lineHeight: 1.3, fontWeight: 500 }}>{opt}</span>;
}

/* ── Animated test background ───────────────────────────────────────────── */

function AnimatedTestBg({ catIdx }: { catIdx: number }) {
  const catColors: [string, string, string][] = [
    ["rgba(0,85,255,0.70)", "rgba(139,92,246,0.45)", "rgba(6,182,212,0.30)"],   // 0 blue
    ["rgba(139,92,246,0.70)", "rgba(0,85,255,0.45)", "rgba(255,59,59,0.20)"],   // 1 purple
    ["rgba(6,182,212,0.65)", "rgba(0,85,255,0.45)", "rgba(139,92,246,0.25)"],   // 2 teal
    ["rgba(99,60,220,0.70)", "rgba(6,182,212,0.40)", "rgba(0,85,255,0.30)"],    // 3 indigo
    ["rgba(0,85,255,0.65)", "rgba(6,182,212,0.40)", "rgba(139,92,246,0.30)"],   // 4 blue+teal
    ["rgba(6,182,212,0.65)", "rgba(0,85,255,0.45)", "rgba(99,60,220,0.30)"],    // 5 cyan
  ];
  const [c1, c2, c3] = catColors[catIdx] ?? catColors[0];

  const nodes = [
    {x:8,y:10},{x:22,y:5},{x:45,y:9},{x:72,y:6},{x:92,y:12},
    {x:3,y:32},{x:18,y:38},{x:40,y:28},{x:65,y:35},{x:88,y:30},
    {x:6,y:55},{x:28,y:60},{x:52,y:50},{x:75,y:62},{x:95,y:55},
    {x:14,y:78},{x:38,y:82},{x:62,y:75},{x:84,y:85},{x:96,y:72},
  ];
  const conns: [number,number][] = [
    [0,1],[1,2],[2,3],[3,4],[5,6],[6,7],[7,8],[8,9],[10,11],[11,12],[12,13],[13,14],[15,16],[16,17],[17,18],[18,19],
    [0,5],[1,6],[2,7],[3,8],[4,9],[5,10],[6,11],[7,12],[8,13],[9,14],[10,15],[11,16],[12,17],[13,18],[14,19],
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* gradient blobs — 3 for richer color */}
      <div style={{
        position: "absolute", top: "-25%", left: "-15%", width: "65%", height: "65%",
        background: `radial-gradient(ellipse, ${c1}, transparent 68%)`,
        animation: "bgPulse1 7s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "-25%", right: "-15%", width: "65%", height: "65%",
        background: `radial-gradient(ellipse, ${c2}, transparent 68%)`,
        animation: "bgPulse2 7s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: "30%", right: "5%", width: "45%", height: "45%",
        background: `radial-gradient(ellipse, ${c3}, transparent 65%)`,
        animation: "bgPulse1 10s ease-in-out infinite reverse",
      }} />
      {/* neural network SVG */}
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
        {conns.map(([a, b], i) => (
          <line key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke="#0055FF" strokeWidth={0.3}
            style={{ animation: `lineGlow ${4 + (i % 3)}s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }}
          />
        ))}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={0.8} fill="#06B6D4"
            style={{ animation: `nodeGlow ${3 + (i % 4)}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
          />
        ))}
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
      background: "rgba(2,6,23,0.85)", backdropFilter: "blur(16px)",
      padding: "24px",
    }}>
      <div className="animate-scale-in" style={{
        maxWidth: 420, width: "100%",
        background: GLASS, border: `1px solid ${BORD}`,
        borderRadius: 16, padding: "36px 28px",
        backdropFilter: "blur(20px)",
        textAlign: "center",
        boxShadow: "0 24px 80px rgba(0,85,255,0.2)",
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
          <div style={{ height: 4, background: "rgba(0,85,255,0.12)", borderRadius: 2, overflow: "hidden" }}>
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
          boxShadow: "0 4px 20px rgba(0,85,255,0.45)",
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
      boxShadow: active ? "0 0 14px rgba(0,85,255,0.4)" : "none",
    });
    return (
      <div style={{ minHeight: "100dvh", background: BG, color: TEXT, display: "flex", flexDirection: "column", position: "relative", fontFamily: "'Inter',system-ui,sans-serif" }}>
        <AnimatedTestBg catIdx={0} />
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: `1px solid ${BORD}`, background: "rgba(2,6,23,0.9)", position: "relative", zIndex: 5 }}>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em" }}>Real<span style={{ color: BLUE }}>IQ</span>Test</span>
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
                background: `linear-gradient(135deg,${BLUE},#0099CC)`,
                border: "none", borderRadius: 10,
                fontSize: 15, fontWeight: 700, color: "#fff",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(0,85,255,0.45)",
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
  const [flipping, setFlipping] = useState(false);
  const [memReady, setMemReady] = useState(false);
  const [streak, setStreak] = useState(0);
  const [streakFlash, setStreakFlash] = useState(false);
  const [milestoneData, setMilestoneData] = useState<{icon:"brain"|"target"|"fire";heading:string;sub:string}|null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const shownMilestonesRef = useRef(new Set<number>());

  const q = ALL_QUESTIONS[qIdx];
  const isMemory = q.vis?.kind === "memory";
  const timerPaused = isMemory && !memReady;

  const advanceTo = useCallback((nextIdx: number) => {
    setFlipping(true);
    setTimeout(() => {
      setQIdx(nextIdx);
      setAnswered(false);
      setSelected(null);
      setFeedback(null);
      setMemReady(false);
      setTimeLeft(ALL_QUESTIONS[nextIdx].time);
      setFlipping(false);
    }, 150);
  }, []);

  const handleNext = useCallback(() => {
    const nextIdx = qIdx + 1;
    if (nextIdx >= ALL_QUESTIONS.length) {
      localStorage.setItem("iq_score",        score.toString());
      localStorage.setItem("iq_total",        ALL_QUESTIONS.length.toString());
      localStorage.setItem("iq_catScores",    JSON.stringify(catScores));
      localStorage.setItem("iq_catTotals",    JSON.stringify(catTotals));
      localStorage.setItem("iq_weighted",     weightedScore.toString());
      localStorage.setItem("iq_maxPossible",  maxPossible.toString());
      localStorage.setItem("iq_minPossible",  minPossible.toString());
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
  }, [qIdx, score, catScores, catTotals, weightedScore, maxPossible, minPossible, q, router, advanceTo, streak]);

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
    const correct = i === q.ans;
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
  const timerDanger = timeLeft <= Math.round(q.time * 0.25);
  const timerWarn   = timeLeft <= Math.round(q.time * 0.50);
  const timerColor  = timerDanger ? RED : timerWarn ? ORANGE : BLUE;
  const timerPct    = (timeLeft / q.time) * 100;
  const progress    = ((qIdx + 1) / ALL_QUESTIONS.length) * 100;

  const hasVisOpts = q.vis?.kind === "raven" || q.vis?.kind === "rotation" || q.vis?.kind === "embedded"
    || q.vis?.kind === "raven2" || q.vis?.kind === "ravenrot" || q.vis?.kind === "ravenpattern" || q.vis?.kind === "topview";

  const keyframes = `
    @keyframes bgPulse1 { 0%,100%{opacity:0.7} 50%{opacity:0.3} }
    @keyframes bgPulse2 { 0%,100%{opacity:0.3} 50%{opacity:0.7} }
    @keyframes nodeGlow { 0%,100%{opacity:0.3} 50%{opacity:0.8} }
    @keyframes lineGlow { 0%,100%{opacity:0.06} 50%{opacity:0.18} }
    @keyframes streakSlide { from{transform:translateY(-100%);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes qFadeIn { from{opacity:0} to{opacity:1} }
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
              boxShadow: "0 24px 60px rgba(0,85,255,0.15)",
            }}>
              <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: GREEN, marginBottom: 12, fontWeight: 700 }}>
                ✓ Section complete
              </p>
              <p style={{ fontSize: 13, color: DIM, marginBottom: 8 }}>{prevCat.name}</p>
              <div style={{ fontSize: 56, fontWeight: 300, color: BLUE, lineHeight: 1, margin: "12px 0", textShadow: "0 0 30px rgba(0,85,255,0.5)" }}>
                {catScore}<span style={{ fontSize: 22, color: DIM }}>/{catTotal}</span>
              </div>
              <p style={{ fontSize: 13, color: "#9ABCD4", marginBottom: 16, lineHeight: 1.5 }}>{motivational}</p>
              <div style={{ height: 3, background: "rgba(0,85,255,0.12)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${catTotal > 0 ? (catScore / catTotal) * 100 : 0}%`, background: `linear-gradient(90deg,${BLUE},${CYAN})`, transition: "width 0.9s ease", borderRadius: 2 }} />
              </div>
            </div>

            {/* Overall progress */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: DIM, marginBottom: 6 }}>
                <span>Overall progress</span><span>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: 3, background: "rgba(0,85,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
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
                boxShadow: "0 4px 20px rgba(0,85,255,0.4)",
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
  // Fade transition: flipping=true means content is fading out (opacity 0)
  const fadeStyle: React.CSSProperties = {
    opacity: flipping ? 0 : 1,
    transition: "opacity 150ms ease",
  };

  return (
    <div style={{
      height: "100dvh", overflow: "hidden", display: "flex", flexDirection: "column",
      background: BG, color: TEXT, position: "relative",
      fontFamily: "'Inter',system-ui,sans-serif",
    }}>
      <style>{keyframes}</style>

      <AnimatedTestBg catIdx={q.cat} />

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
          background: "linear-gradient(90deg,rgba(255,140,0,0.18),rgba(255,60,0,0.10))",
          borderBottom: "1px solid rgba(255,140,0,0.25)",
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
        background: "rgba(2,6,23,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,85,255,0.12)",
      }}>
        {/* Progress bar — 3px at very top */}
        <div style={{ height: 3, background: "rgba(0,85,255,0.08)", flexShrink: 0 }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: `linear-gradient(90deg,${BLUE},${CYAN})`,
            transition: "width 0.4s ease",
            borderRadius: "0 2px 2px 0",
          }} />
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
              <span style={{ color: "rgba(0,85,255,0.4)", margin: "0 3px" }}>/</span>
              {ALL_QUESTIONS.length}
            </span>
            {streak >= 3 && (
              <div style={{
                display: "flex", alignItems: "center", gap: 3,
                background: "rgba(255,140,0,0.12)", border: "1px solid rgba(255,140,0,0.3)",
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
              <circle cx={22} cy={22} r={18} fill="none" stroke="rgba(0,85,255,0.12)" strokeWidth={2.5} />
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

      {/* Content wrapper — fades with question transitions */}
      <div ref={cardRef} style={{ ...fadeStyle, display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

        {/* ══ ZONE 2 — CATEGORY LABEL (4vh) ══════════════════════════════ */}
        <div style={{
          height: "4vh", flexShrink: 0, zIndex: 5, position: "relative",
          display: "flex", alignItems: "center",
          padding: "0 clamp(12px,3vw,20px)",
          borderBottom: "1px solid rgba(0,85,255,0.08)",
          maxWidth: 760, width: "100%", margin: "0 auto", boxSizing: "border-box",
          gap: 8,
        }}>
          <span style={{ fontSize: "clamp(9px,1.6vw,11px)", letterSpacing: "0.18em", textTransform: "uppercase", color: DIM, fontWeight: 600 }}>
            {CATEGORIES[q.cat].name}
          </span>
          <span style={{ color: "rgba(0,85,255,0.3)", fontSize: 10 }}>|</span>
          <span style={{
            fontSize: "clamp(8px,1.4vw,10px)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700,
            ...(q.diff === "easy" ? { color: GREEN } : q.diff === "medium" ? { color: "#6EB0FF" } : { color: RED }),
          }}>{q.diff}</span>
          <span style={{ fontSize: "clamp(8px,1.4vw,10px)", letterSpacing: "0.10em", textTransform: "uppercase", padding: "1px 6px", borderRadius: 2, border: `1px solid rgba(0,85,255,0.22)`, color: BLUE }}>{q.badge}</span>
        </div>

        {/* ══ ZONE 3 — QUESTION TEXT (9vh) ══════════════════════════════ */}
        <div style={{
          height: "9vh", flexShrink: 0, zIndex: 5, position: "relative",
          display: "flex", alignItems: "center",
          padding: "0 clamp(12px,3vw,20px)",
          maxWidth: 760, width: "100%", margin: "0 auto", boxSizing: "border-box",
          overflow: "hidden",
        }}>
          {q.type === "analogy" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", width: "100%", overflow: "hidden" }}>
              <p style={{ fontSize: "clamp(13px,2vw,17px)", fontWeight: 600, color: TEXT, lineHeight: 1.35, margin: 0 }}>{q.text}</p>
              <span style={{ fontSize: "clamp(12px,2vw,16px)", fontWeight: 600 }}>{q.w1}</span>
              <span style={{ fontSize: "clamp(9px,1.5vw,11px)", color: DIM }}>is to</span>
              <span style={{ fontSize: "clamp(12px,2vw,16px)", fontWeight: 600 }}>{q.w2}</span>
              <span style={{ fontSize: "clamp(9px,1.5vw,11px)", color: DIM }}>as</span>
              <span style={{ fontSize: "clamp(12px,2vw,16px)", fontWeight: 600 }}>{q.w3}</span>
              <span style={{ fontSize: "clamp(9px,1.5vw,11px)", color: DIM }}>is to</span>
              <span style={{ color: BLUE, borderBottom: "2px dashed rgba(0,85,255,0.5)", minWidth: 40, textAlign: "center", fontSize: "clamp(12px,2vw,16px)" }}>?</span>
            </div>
          ) : q.type === "sequence" && q.seq ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", overflow: "hidden" }}>
              <p style={{ fontSize: "clamp(13px,2vw,17px)", fontWeight: 600, color: TEXT, lineHeight: 1.3, margin: 0,
                overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                {q.text}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "nowrap", overflow: "hidden" }}>
                {q.seq.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                    <div style={{
                      width: "clamp(28px,6vw,38px)", height: "clamp(28px,6vw,38px)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 5, fontSize: "clamp(11px,2vw,14px)", fontWeight: 600, flexShrink: 0,
                      ...(s === "?"
                        ? { background: "rgba(0,85,255,0.08)", border: "2px dashed rgba(0,85,255,0.5)", color: BLUE }
                        : { background: "rgba(5,18,45,0.9)", border: "1px solid rgba(0,85,255,0.2)", color: TEXT }),
                    }}>{s}</div>
                    {i < q.seq!.length - 1 && <span style={{ color: DIM, fontSize: 10 }}>→</span>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{
              fontSize: "clamp(14px,2vw,18px)", fontWeight: 600, lineHeight: 1.4, color: TEXT,
              margin: 0, overflow: "hidden", display: "-webkit-box",
              WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            }}>{q.text}</p>
          )}
        </div>

        {/* ══ ZONE 4 — MATRIX / VISUAL (37vh) ════════════════════════════ */}
        <div style={{
          height: "37vh", flexShrink: 0, zIndex: 5, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "clamp(4px,0.8vh,8px) clamp(12px,3vw,20px)",
          maxWidth: 760, width: "100%", margin: "0 auto", boxSizing: "border-box",
          overflow: "hidden",
        }}>
          {q.vis ? (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(5,18,45,0.60)", border: `1px solid rgba(0,85,255,0.22)`,
              borderRadius: 12, padding: "clamp(6px,1.2vh,12px)",
              overflow: "hidden", boxSizing: "border-box",
            }}>
              <VisualDisplay vis={q.vis} onMemReady={() => setMemReady(true)} />
            </div>
          ) : (
            <div style={{ width: "100%", height: "100%" }} />
          )}
        </div>

        {/* ══ ZONE 5 — OPTIONS GRID 2×2 (32vh) ══════════════════════════ */}
        <div style={{
          height: "32vh", flexShrink: 0, zIndex: 5, position: "relative",
          padding: "clamp(3px,0.6vh,5px) clamp(12px,3vw,20px) 0",
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
                    background: isCorrect ? "rgba(0,216,122,0.12)" : isWrong ? "rgba(255,59,59,0.12)" : isSel ? "rgba(0,85,255,0.12)" : GLASS,
                    borderColor: isCorrect ? GREEN : isWrong ? RED : isSel ? BLUE : "rgba(0,85,255,0.20)",
                    boxShadow: isCorrect
                      ? `0 0 0 1px ${GREEN}, 0 0 18px rgba(0,216,122,0.28), inset 0 0 20px rgba(0,216,122,0.06)`
                      : isWrong ? `0 0 0 1px ${RED}, 0 0 12px rgba(255,59,59,0.25), inset 0 0 20px rgba(255,59,59,0.06)` : "none",
                    backdropFilter: "blur(12px)",
                    overflow: "hidden",
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={e => { if (!answered) { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLButtonElement).style.borderColor = BLUE; } }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; if (!answered) (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,85,255,0.20)"; }}
                >
                  <div style={{
                    minWidth: hasVisOpts ? "auto" : 20, height: hasVisOpts ? "auto" : 20,
                    border: "1px solid",
                    borderColor: isCorrect ? GREEN : isWrong ? RED : "rgba(0,85,255,0.35)",
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

        {/* ══ ZONE 6 — FEEDBACK BOX (6vh) ════════════════════════════════ */}
        <div style={{
          height: "6vh", flexShrink: 0, zIndex: 5, position: "relative",
          display: "flex", alignItems: "center",
          padding: "clamp(4px,0.8vh,6px) clamp(12px,3vw,20px)",
          maxWidth: 760, width: "100%", margin: "0 auto", boxSizing: "border-box",
        }}>
          {feedback ? (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", gap: 10,
              padding: "0 clamp(12px,2vw,18px)",
              borderRadius: 10,
              fontSize: "clamp(12px,1.8vw,14px)", fontWeight: 600,
              overflow: "hidden",
              ...(feedback.correct
                ? {
                    background: "rgba(0,216,122,0.14)",
                    border: "2px solid rgba(0,216,122,0.65)",
                    color: "#00E882",
                    boxShadow: "0 0 20px rgba(0,216,122,0.18)",
                  }
                : {
                    background: "rgba(255,59,59,0.14)",
                    border: "2px solid rgba(255,59,59,0.65)",
                    color: "#FF6B6B",
                    boxShadow: "0 0 20px rgba(255,59,59,0.18)",
                  }),
            }}>
              <span style={{ fontSize: "clamp(15px,2.2vw,19px)", fontWeight: 900, flexShrink: 0 }}>
                {feedback.correct ? "✓" : "✕"}
              </span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {feedback.text}
              </span>
            </div>
          ) : (
            <div style={{ width: "100%", height: "100%", borderRadius: 10, border: "1px dashed rgba(0,85,255,0.10)" }} />
          )}
        </div>

        {/* ══ ZONE 7 — NAV BUTTONS (4vh) ═════════════════════════════════ */}
        <div style={{
          height: "4vh", flexShrink: 0, zIndex: 5, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          padding: "0 clamp(12px,3vw,20px)",
          maxWidth: 760, width: "100%", margin: "0 auto", boxSizing: "border-box",
          gap: 12,
        }}>
          <button onClick={handleNext} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "clamp(9px,1.6vw,11px)", letterSpacing: "0.14em", textTransform: "uppercase",
            color: DIM, padding: 0, flexShrink: 0,
          }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = TEXT)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = DIM)}
          >Skip →</button>

          <button onClick={handleNext} disabled={!answered} style={{
            padding: "0 clamp(20px,4vw,32px)",
            height: "clamp(32px,3.8vh,42px)",
            fontSize: "clamp(11px,1.8vw,13px)", fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase",
            borderRadius: 8, border: "none", cursor: answered ? "pointer" : "not-allowed",
            background: answered ? `linear-gradient(135deg,${BLUE},${CYAN})` : "rgba(0,85,255,0.18)",
            color: "#fff", opacity: answered ? 1 : 0.35,
            boxShadow: answered ? "0 4px 20px rgba(0,85,255,0.55), 0 0 40px rgba(0,85,255,0.15)" : "none",
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
