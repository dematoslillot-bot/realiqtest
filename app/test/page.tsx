"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ALL_QUESTIONS, CATEGORIES, type ShapeDef, type RavenCell, type VisualDef, type PCell } from "@/lib/questions";
import { DIFF_WEIGHTS } from "@/lib/iq-calculator";

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

function RavenCellSVG({ cell, size = 64, isQuestion = false }: { cell: RavenCell | null; size?: number; isQuestion?: boolean }) {
  const color = "#6EB0FF";
  if (isQuestion || cell === null) {
    return (
      <svg width={size} height={size} viewBox="0 0 60 60">
        <rect x={1} y={1} width={58} height={58} rx={2}
          fill="rgba(0,85,255,0.06)" stroke="#0055FF" strokeWidth={1.5} strokeDasharray="5,3" />
        <text x={30} y={38} textAnchor="middle" fontSize={22} fill="#0055FF" fontWeight="bold">?</text>
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      <rect x={1} y={1} width={58} height={58} rx={2}
        fill="rgba(5,18,45,0.9)" stroke="rgba(0,85,255,0.22)" strokeWidth={1} />
      {cell.map((sh, i) => <g key={i}>{renderShape(sh, color)}</g>)}
    </svg>
  );
}

/* ── Raven matrix display ───────────────────────────────────────────────── */

function RavenDisplay({ cells }: { cells: (RavenCell | null)[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4, maxWidth: 224, margin: "0 auto" }}>
      {cells.map((cell, i) => (
        <div key={i} style={{ border: "1px solid rgba(0,85,255,0.14)", borderRadius: 3, overflow: "hidden" }}>
          <RavenCellSVG cell={cell} size={70} isQuestion={cell === null} />
        </div>
      ))}
    </div>
  );
}

/* ── Rotation shape display ─────────────────────────────────────────────── */

function RotationSVG({ path, angle, size = 80, mirror = false }: { path: string; angle: number; size?: number; mirror?: boolean }) {
  // mirror=true: horizontally flip around the viewport centre (x=30) after rotation
  const transform = mirror
    ? `scale(-1,1) translate(-60,0) rotate(${angle},30,30)`
    : `rotate(${angle},30,30)`;
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
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
      <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8AABCC" }}>Source shape</p>
      <RotationSVG path={path} angle={showAngle} size={100} />
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
    <div style={{ overflowX: "auto", padding: "0 8px" }}>
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
            width: 46, height: 46, borderRadius: "50%",
            background: phase === "showing" ? col : "transparent",
            border: phase === "showing" ? "none" : "2px dashed rgba(0,85,255,0.25)",
            transition: "all 0.5s ease",
            boxShadow: phase === "showing" ? `0 0 20px ${col}99, 0 0 8px ${col}66` : "none",
          }}
            className={phase === "showing" ? "mem-circle-active" : ""}
          />
        ))}
      </div>
      {phase === "showing" && (
        <p style={{ fontSize: 11, color: "#8AABCC", letterSpacing: "0.08em" }}>
          Memorise — {countdown}s remaining
        </p>
      )}
      {phase === "hidden" && (
        <p style={{ fontSize: 11, color: "#8AABCC" }}>Now answer the question below ↓</p>
      )}
    </div>
  );
}

/* ── Embedded figures display ───────────────────────────────────────────── */

function EmbeddedDisplay({ display }: { display: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8AABCC" }}>
        Combined figure
      </p>
      <svg width={120} height={120} viewBox="0 0 60 60">
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

  // Net layout [x, y, faceIndex]: cross shape with 4 rows
  //        [1]
  //    [4] [2] [5]
  //        [3]
  //        [6]
  const layout: [number, number, number][] = [
    [S,     0,   0],  // top    → faces[0] = 1
    [0,     S,   3],  // left   → faces[3] = 4
    [S,     S,   1],  // centre → faces[1] = 2  (front)
    [S * 2, S,   4],  // right  → faces[4] = 5
    [S,     S*2, 2],  // bottom → faces[2] = 3
    [S,     S*3, 5],  // far-bottom → faces[5] = 6  (opposite to front)
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8AABCC" }}>
        Dice net — fold to assemble
      </p>
      <svg width={S * 3} height={S * 4} viewBox={`0 0 ${S * 3} ${S * 4}`} style={{ display: "block" }}>
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
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 4, maxWidth: 152, margin: "0 auto" }}>
      {cells.map((cell, i) => (
        <div key={i} style={{ border: "1px solid rgba(0,85,255,0.14)", borderRadius: 3, overflow: "hidden" }}>
          <RavenCellSVG cell={cell} size={72} isQuestion={cell === null} />
        </div>
      ))}
    </div>
  );
}

/* ── Raven rotation display (3×3 grid of rotated arrows) ────────────────── */

function RavenRotDisplay({ path, angles }: { path: string; angles: (number|null)[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4, maxWidth: 224, margin: "0 auto" }}>
      {angles.map((angle, i) => (
        <div key={i} style={{ border: "1px solid rgba(0,85,255,0.14)", borderRadius: 3, overflow: "hidden" }}>
          {angle === null ? (
            <svg width={70} height={70} viewBox="0 0 60 60">
              <rect x={1} y={1} width={58} height={58} rx={2}
                fill="rgba(0,85,255,0.06)" stroke="#0055FF" strokeWidth={1.5} strokeDasharray="5,3" />
              <text x={30} y={38} textAnchor="middle" fontSize={22} fill="#0055FF" fontWeight="bold">?</text>
            </svg>
          ) : (
            <RotationSVG path={path} angle={angle} size={70} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Pattern cell SVG (shape + line-fill) ───────────────────────────────── */

function PatternCellSVG({ cell, size = 64, cellIdx = 0, isQ = false }: {
  cell: PCell | null; size?: number; cellIdx?: number; isQ?: boolean;
}) {
  const COLOR = "#6EB0FF";
  if (cell === null || isQ) {
    return (
      <svg width={size} height={size} viewBox="0 0 60 60">
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
    <svg width={size} height={size} viewBox="0 0 60 60">
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
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4, maxWidth: 224, margin: "0 auto" }}>
      {cells.map((cell, i) => (
        <div key={i} style={{ border: "1px solid rgba(0,85,255,0.14)", borderRadius: 3, overflow: "hidden" }}>
          <PatternCellSVG cell={cell} size={70} cellIdx={i} isQ={cell === null} />
        </div>
      ))}
    </div>
  );
}

/* ── Top-view display (isometric 3D → 2D grid) ──────────────────────────── */

function TopViewDisplay() {
  // Four cubes in Γ-arrangement: (0,0),(1,0),(2,0),(0,1) on isometric grid
  // Projection: bx = 25+(c-r)*10,  by = 22+(c+r)*5
  const u = 10;
  const ox = 25, oy = 22;
  const cubes: [number, number][] = [[0,0],[0,1],[1,0],[2,0]]; // back→front
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8AABCC" }}>
        3D arrangement
      </p>
      <svg width={120} height={90} viewBox="0 0 60 45">
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
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
      }}>
        {target}
      </div>
      {compare && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 6, width: "100%", maxWidth: 360 }}>
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
              <span style={{ fontSize: 9, color: "#8AABCC", marginRight: 6, letterSpacing: "0.1em" }}>
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
      return (
        <div style={{ background: "rgba(5,18,45,0.7)", border: "1px solid rgba(0,85,255,0.16)", borderRadius: 6, padding: "20px 16px", marginBottom: 20 }}>
          <RavenDisplay cells={vis.cells} />
        </div>
      );
    case "rotation":
      return (
        <div style={{ background: "rgba(5,18,45,0.7)", border: "1px solid rgba(0,85,255,0.16)", borderRadius: 6, padding: "20px 16px", marginBottom: 20 }}>
          <RotationDisplay path={vis.path} showAngle={vis.showAngle} />
        </div>
      );
    case "bars":
      return (
        <div style={{ background: "rgba(5,18,45,0.7)", border: "1px solid rgba(0,85,255,0.16)", borderRadius: 6, padding: "20px 8px", marginBottom: 20 }}>
          <BarsDisplay values={vis.values} max={vis.max} />
        </div>
      );
    case "memory":
      return (
        <div style={{ background: "rgba(5,18,45,0.7)", border: "1px solid rgba(0,85,255,0.16)", borderRadius: 6, padding: "20px 16px", marginBottom: 20 }}>
          <MemoryDisplay colors={vis.colors} showMs={vis.showMs} onReady={onMemReady} />
        </div>
      );
    case "symbols":
      return (
        <div style={{ background: "rgba(5,18,45,0.7)", border: "1px solid rgba(0,85,255,0.16)", borderRadius: 6, padding: "20px 16px", marginBottom: 20 }}>
          <SymbolsDisplay target={vis.target} compare={vis.compare} />
        </div>
      );
    case "embedded":
      return (
        <div style={{ background: "rgba(5,18,45,0.7)", border: "1px solid rgba(0,85,255,0.16)", borderRadius: 6, padding: "20px 16px", marginBottom: 20 }}>
          <EmbeddedDisplay display={vis.display} />
        </div>
      );
    case "dicenet":
      return (
        <div style={{ background: "rgba(5,18,45,0.7)", border: "1px solid rgba(0,85,255,0.16)", borderRadius: 6, padding: "20px 16px", marginBottom: 20 }}>
          <DiceNetDisplay faces={vis.faces} />
        </div>
      );
    case "raven2":
      return (
        <div style={{ background: "rgba(5,18,45,0.7)", border: "1px solid rgba(0,85,255,0.16)", borderRadius: 6, padding: "20px 16px", marginBottom: 20 }}>
          <Raven2Display cells={vis.cells} />
        </div>
      );
    case "ravenrot":
      return (
        <div style={{ background: "rgba(5,18,45,0.7)", border: "1px solid rgba(0,85,255,0.16)", borderRadius: 6, padding: "20px 16px", marginBottom: 20 }}>
          <RavenRotDisplay path={vis.path} angles={vis.angles} />
        </div>
      );
    case "ravenpattern":
      return (
        <div style={{ background: "rgba(5,18,45,0.7)", border: "1px solid rgba(0,85,255,0.16)", borderRadius: 6, padding: "20px 16px", marginBottom: 20 }}>
          <RavenPatternDisplay cells={vis.cells} />
        </div>
      );
    case "topview":
      return (
        <div style={{ background: "rgba(5,18,45,0.7)", border: "1px solid rgba(0,85,255,0.16)", borderRadius: 6, padding: "20px 16px", marginBottom: 20 }}>
          <TopViewDisplay />
        </div>
      );
  }
}

/* ── Option content (visual or text) ───────────────────────────────────── */

function OptionContent({ vis, opt, idx }: { vis?: VisualDef; opt: string; idx: number }) {
  if (vis?.kind === "raven") {
    return <RavenCellSVG cell={vis.optCells[idx]} size={60} />;
  }
  if (vis?.kind === "rotation") {
    return <RotationSVG path={vis.path} angle={vis.optAngles[idx]} size={68} mirror={vis.optMirrors?.[idx] ?? false} />;
  }
  if (vis?.kind === "embedded") {
    return (
      <svg width={68} height={68} viewBox="0 0 60 60">
        <rect x={1} y={1} width={58} height={58} rx={2}
          fill="rgba(5,18,45,0.9)" stroke="rgba(0,85,255,0.22)" strokeWidth={1} />
        <path d={vis.optPaths[idx]} fill="#6EB0FF" />
      </svg>
    );
  }
  if (vis?.kind === "raven2") {
    return <RavenCellSVG cell={vis.optCells[idx]} size={60} />;
  }
  if (vis?.kind === "ravenrot") {
    return <RotationSVG path={vis.path} angle={vis.optAngles[idx]} size={68} />;
  }
  if (vis?.kind === "ravenpattern") {
    return <PatternCellSVG cell={vis.optCells[idx]} size={68} cellIdx={90 + idx} />;
  }
  if (vis?.kind === "topview") {
    return (
      <svg width={68} height={68} viewBox="0 0 60 60">
        <rect x={1} y={1} width={58} height={58} rx={2}
          fill="rgba(5,18,45,0.9)" stroke="rgba(0,85,255,0.22)" strokeWidth={1} />
        <path d={vis.optGrids[idx]} fill="#6EB0FF" />
      </svg>
    );
  }
  return <span style={{ fontSize: 14, lineHeight: 1.4 }}>{opt}</span>;
}

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
    const blue  = "#0055FF";
    const blue2 = "rgba(0,85,255,0.18)";
    const dim   = "#8AABCC";
    const pill  = (active: boolean): React.CSSProperties => ({
      padding:"9px 18px",
      background: active ? blue : "rgba(5,18,45,0.8)",
      border: `1px solid ${active ? blue : blue2}`,
      borderRadius: 8, cursor:"pointer",
      fontSize: 13, color: active ? "#fff" : "#C0C8D8",
      fontWeight: active ? 700 : 400,
      transition:"all 150ms",
      boxShadow: active ? `0 0 14px rgba(0,85,255,0.4)` : "none",
    });
    return (
      <div style={{ minHeight:"100dvh", background:"#050A14", color:"#D6E4FF", display:"flex", flexDirection:"column" }}>
        <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 24px", borderBottom:`1px solid ${blue2}`, background:"rgba(5,10,20,0.95)" }}>
          <span style={{ fontSize:16, fontWeight:700, letterSpacing:"-0.02em" }}>Real<span style={{color:blue}}>IQ</span>Test</span>
          <button onClick={handleStartTest} style={{ fontSize:11, color:dim, background:"none", border:"none", cursor:"pointer" }}>Skip →</button>
        </nav>
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 20px" }}>
          <div className="animate-fade-up" style={{ maxWidth:460, width:"100%" }}>
            <p style={{ fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:blue, marginBottom:10, fontWeight:700 }}>Quick setup</p>
            <h1 style={{ fontSize:"clamp(22px,4vw,30px)", fontWeight:800, letterSpacing:"-0.02em", lineHeight:1.2, marginBottom:6 }}>
              Takes 10 seconds
            </h1>
            <p style={{ fontSize:13, color:dim, lineHeight:1.6, marginBottom:28 }}>
              This personalises your score comparison — we will show you how you rank vs your demographic group.
            </p>

            {/* Gender */}
            <div style={{ marginBottom:22 }}>
              <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:dim, marginBottom:10, fontWeight:600 }}>Gender</p>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {[{v:"man",l:"Man"},{v:"woman",l:"Woman"},{v:"other",l:"Prefer not to say"}].map(({v,l})=>(
                  <button key={v} onClick={()=>setGender(g=>g===v?"":v)} style={pill(gender===v)}>{l}</button>
                ))}
              </div>
            </div>

            {/* Age group */}
            <div style={{ marginBottom:22 }}>
              <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:dim, marginBottom:10, fontWeight:600 }}>Age group</p>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {["15–17","18–24","25–34","35–44","45–54","55+"].map(a=>(
                  <button key={a} onClick={()=>setAgeGroup(g=>g===a?"":a)} style={pill(ageGroup===a)}>{a}</button>
                ))}
              </div>
            </div>

            {/* Country */}
            <div style={{ marginBottom:22 }}>
              <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:dim, marginBottom:10, fontWeight:600 }}>Country</p>
              <select
                value={country}
                onChange={e=>setCountry(e.target.value)}
                style={{
                  width:"100%", padding:"10px 14px",
                  background:"rgba(5,18,45,0.9)", border:`1px solid ${blue2}`,
                  borderRadius:8, fontSize:13, color: country?"#D6E4FF":dim,
                  outline:"none", cursor:"pointer", fontFamily:"inherit",
                  appearance:"none",
                }}
              >
                <option value="">Select your country…</option>
                {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Occupation */}
            <div style={{ marginBottom:32 }}>
              <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:dim, marginBottom:10, fontWeight:600 }}>Occupation</p>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {["Student","Professional","Other"].map(o=>(
                  <button key={o} onClick={()=>setOccupation(p=>p===o?"":o)} style={pill(occupation===o)}>{o}</button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartTest}
              style={{
                width:"100%", padding:"15px 24px",
                background:`linear-gradient(135deg,${blue},#0099CC)`,
                border:"none", borderRadius:10,
                fontSize:15, fontWeight:700, color:"#fff",
                cursor:"pointer",
                boxShadow:`0 4px 20px rgba(0,85,255,0.45)`,
                transition:"transform 150ms",
              }}
              onMouseEnter={e=>(e.currentTarget.style.transform="translateY(-2px)")}
              onMouseLeave={e=>(e.currentTarget.style.transform="translateY(0)")}
            >
              Start Test →
            </button>
            <p style={{ fontSize:10, color:"#6A88AA", textAlign:"center", marginTop:12 }}>30 questions · ~15 minutes · No signup required</p>
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
  // Weighted scoring state (easy wrong = big penalty, hard correct = big reward)
  const [weightedScore, setWeightedScore] = useState(0);
  const [maxPossible,   setMaxPossible]   = useState(0); // sum of correct weights
  const [minPossible,   setMinPossible]   = useState(0); // sum of wrong  weights
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(ALL_QUESTIONS[0].time);
  const [showTransition, setShowTransition] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [memReady, setMemReady] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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
    }, 220);
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
    if (ALL_QUESTIONS[nextIdx].cat !== q.cat) {
      setShowTransition(true);
    } else {
      advanceTo(nextIdx);
    }
  }, [qIdx, score, catScores, catTotals, weightedScore, maxPossible, minPossible, q, router, advanceTo]);

  // Countdown timer (paused during memory reveal)
  useEffect(() => {
    if (answered || showTransition || timerPaused) return;
    if (timeLeft <= 0) {
      setAnswered(true);
      setResults(prev => [...prev, false]);
      setCatTotals(prev => { const n = [...prev]; n[q.cat]++; return n; });
      // Timeout = wrong answer — apply wrong penalty for this difficulty
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
    // Weighted scoring: reward hard correct heavily, penalise easy wrong heavily
    const w = DIFF_WEIGHTS[q.diff];
    setWeightedScore(v => v + (correct ? w.correct : w.wrong));
    setMaxPossible(v => v + w.correct);
    setMinPossible(v => v + w.wrong);
    setFeedback({ correct, text: correct ? `Correct! ${q.exp}` : `Incorrect. ${q.exp}` });
  }

  function continueAfterTransition() {
    setShowTransition(false);
    advanceTo(qIdx + 1);
  }

  // Derived display values
  const timerDanger = timeLeft <= Math.round(q.time * 0.25);
  const timerWarn   = timeLeft <= Math.round(q.time * 0.50);
  const timerColor  = timerDanger ? "#FF3B3B" : timerWarn ? "#FF8C00" : "#0055FF";
  const timerPct    = (timeLeft / q.time) * 100;
  const progress    = ((qIdx + 1) / ALL_QUESTIONS.length) * 100;

  const hasVisOpts  = q.vis?.kind === "raven" || q.vis?.kind === "rotation" || q.vis?.kind === "embedded"
    || q.vis?.kind === "raven2" || q.vis?.kind === "ravenrot" || q.vis?.kind === "ravenpattern" || q.vis?.kind === "topview";

  // ── Category transition ──────────────────────────────────────────────────
  if (showTransition) {
    const prevCat = CATEGORIES[q.cat];
    const nextCat = CATEGORIES[ALL_QUESTIONS[qIdx + 1].cat];
    const catScore = catScores[q.cat];
    const catTotal = catTotals[q.cat];
    return (
      <div style={{ minHeight: "100dvh", background: "#050A14", color: "#D6E4FF", display: "flex", flexDirection: "column" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "1px solid rgba(0,85,255,0.15)", background: "#080E1A" }}>
          <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Real<span style={{ color: "#0055FF" }}>IQ</span>Test
          </span>
        </nav>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}>
          <div className="animate-fade-up" style={{ maxWidth: 360, width: "100%" }}>
            <div style={{
              background: "rgba(5,18,45,0.85)", border: "1px solid rgba(0,85,255,0.2)",
              backdropFilter: "blur(14px)", borderRadius: 8, padding: 32, marginBottom: 24,
            }}>
              <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#00D87A", marginBottom: 12 }}>
                ✓ Section complete
              </p>
              <p style={{ fontSize: 13, color: "#8AABCC", marginBottom: 6 }}>{prevCat.name}</p>
              <div style={{ fontSize: 64, fontWeight: 300, color: "#0055FF", lineHeight: 1, margin: "12px 0", textShadow: "0 0 30px rgba(0,85,255,0.5)" }}>
                {catScore}<span style={{ fontSize: 24, color: "#8AABCC" }}>/{catTotal}</span>
              </div>
              <div style={{ height: 3, background: "rgba(0,85,255,0.12)", borderRadius: 2, overflow: "hidden", marginTop: 16 }}>
                <div className="progress-neon" style={{ height: "100%", width: `${catTotal > 0 ? (catScore / catTotal) * 100 : 0}%`, transition: "width 0.9s ease", borderRadius: 2 }} />
              </div>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 400, marginBottom: 6 }}>
              Next: <span style={{ color: "#0055FF" }}>{nextCat.name}</span>
            </h2>
            <p style={{ fontSize: 13, color: "#8AABCC", marginBottom: 28 }}>Take a breath before continuing.</p>
            <button
              onClick={continueAfterTransition}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main test ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100dvh", background: "#050A14", color: "#D6E4FF" }}>

      {/* Header */}
      <nav style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(5,10,20,0.95)", backdropFilter: "blur(18px)", borderBottom: "1px solid rgba(0,85,255,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px" }}>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Real<span style={{ color: "#0055FF" }}>IQ</span>Test
          </span>

          {/* Category + question info */}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8AABCC", lineHeight: 1, marginBottom: 2 }}>
              {CATEGORIES[q.cat].name}
            </p>
            <p style={{ fontSize: 11, fontWeight: 500, color: "#5A78A8" }}>
              Category {q.cat + 1} / 6
            </p>
          </div>

          {/* Circular countdown timer */}
          <div style={{ position: "relative", width: 44, height: 44 }}>
            <svg style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }} width={44} height={44} viewBox="0 0 44 44">
              <circle cx={22} cy={22} r={18} fill="none" stroke="rgba(0,85,255,0.12)" strokeWidth={2.5} />
              <circle
                cx={22} cy={22} r={18} fill="none"
                stroke={timerColor}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - (timerPaused ? 1 : timerPct) / 100)}`}
                style={{
                  transition: "stroke-dashoffset 1s linear, stroke 0.3s ease",
                  filter: timerDanger ? `drop-shadow(0 0 4px ${timerColor})` : "none",
                }}
              />
            </svg>
            <span style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: timerPaused ? "#8AABCC" : timerColor,
            }}>
              {timerPaused ? "—" : timeLeft}
            </span>
          </div>
        </div>

        {/* Progress bar + dots */}
        <div style={{ padding: "0 20px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#8AABCC", marginBottom: 5, letterSpacing: "0.08em" }}>
            <span>Q{qIdx + 1} / {ALL_QUESTIONS.length}</span>
            <span>Score: {score}</span>
          </div>
          <div style={{ height: 3, background: "rgba(0,85,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
            <div className="progress-neon" style={{ height: "100%", width: `${progress}%`, transition: "width 0.4s ease", borderRadius: 2 }} />
          </div>
          <div style={{ display: "flex", gap: 3, marginTop: 7, flexWrap: "wrap" }}>
            {ALL_QUESTIONS.map((_, i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: i === qIdx
                  ? "#0055FF"
                  : i < qIdx
                    ? (results[i] ? "#00D87A" : "#FF3B3B")
                    : "rgba(0,85,255,0.12)",
                boxShadow: i === qIdx ? "0 0 6px rgba(0,85,255,0.8)" : "none",
                transition: "background 0.2s ease",
              }} />
            ))}
          </div>
        </div>
      </nav>

      {/* Question area */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 16px" }}>
        <div
          ref={cardRef}
          className={flipping ? "animate-flip-out" : "animate-flip-in"}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Badge row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 28, fontWeight: 300, color: "rgba(0,85,255,0.25)", fontVariantNumeric: "tabular-nums" }}>
              {String(qIdx + 1).padStart(2, "0")}
            </span>
            <span style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", border: "1px solid rgba(0,85,255,0.25)", color: "#0055FF", padding: "3px 10px", borderRadius: 2 }}>
              {q.badge}
            </span>
            <span style={{
              fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 2,
              ...(q.diff === "easy"
                ? { background: "rgba(0,216,122,0.1)", color: "#00D87A", border: "1px solid rgba(0,216,122,0.28)" }
                : q.diff === "medium"
                  ? { background: "rgba(0,85,255,0.1)", color: "#6EB0FF", border: "1px solid rgba(0,85,255,0.28)" }
                  : { background: "rgba(255,59,59,0.1)", color: "#FF3B3B", border: "1px solid rgba(255,59,59,0.28)" })
            }}>
              {q.diff}
            </span>
          </div>

          {/* Question text */}
          <p style={{ fontSize: 17, fontWeight: 400, lineHeight: 1.6, marginBottom: 16 }}>{q.text}</p>

          {/* Analogy display */}
          {q.type === "analogy" && (
            <div style={{
              background: "rgba(5,18,45,0.8)", border: "1px solid rgba(0,85,255,0.16)",
              borderRadius: 6, padding: "16px 20px", marginBottom: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, flexWrap: "wrap", fontSize: 16, fontWeight: 500,
            }}>
              <span>{q.w1}</span>
              <span style={{ fontSize: 10, color: "#8AABCC", fontWeight: 400 }}>is to</span>
              <span>{q.w2}</span>
              <span style={{ fontSize: 10, color: "#8AABCC", fontWeight: 400 }}>as</span>
              <span>{q.w3}</span>
              <span style={{ fontSize: 10, color: "#8AABCC", fontWeight: 400 }}>is to</span>
              <span style={{ color: "#0055FF", borderBottom: "2px dashed rgba(0,85,255,0.5)", minWidth: 60, textAlign: "center" }}>?</span>
            </div>
          )}

          {/* Sequence display */}
          {q.type === "sequence" && q.seq && (
            <div style={{
              background: "rgba(5,18,45,0.8)", border: "1px solid rgba(0,85,255,0.16)",
              borderRadius: 6, padding: "16px 20px", marginBottom: 18,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap",
            }}>
              {q.seq.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    minWidth: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: 4, fontSize: 16, fontWeight: 600,
                    ...(s === "?"
                      ? { background: "rgba(0,85,255,0.08)", border: "2px dashed rgba(0,85,255,0.5)", color: "#0055FF" }
                      : { background: "rgba(5,18,45,0.9)", border: "1px solid rgba(0,85,255,0.2)", color: "#D6E4FF" }
                    ),
                  }}>{s}</div>
                  {i < q.seq!.length - 1 && <span style={{ color: "#8AABCC", fontSize: 12 }}>→</span>}
                </div>
              ))}
            </div>
          )}

          {/* Visual question display */}
          {q.vis && (
            <VisualDisplay vis={q.vis} onMemReady={() => setMemReady(true)} />
          )}

          {/* Answer options */}
          <div style={{
            display: "grid",
            gridTemplateColumns: hasVisOpts ? "repeat(2,1fr)" : "repeat(2,1fr)",
            gap: 8, marginBottom: 16,
          }}>
            {q.opts.map((opt, i) => {
              const isCorrect  = answered && i === q.ans;
              const isWrong    = answered && i === selected && i !== q.ans;
              const isSelected = selected === i && !answered;
              return (
                <button
                  key={i}
                  onClick={() => selectOpt(i)}
                  disabled={answered}
                  style={{
                    display: "flex", alignItems: "center", gap: hasVisOpts ? 0 : 10,
                    padding: hasVisOpts ? "10px" : "14px 16px",
                    flexDirection: hasVisOpts ? "column" : "row",
                    border: "1px solid",
                    borderRadius: 4, textAlign: "left", cursor: answered ? "default" : "pointer",
                    transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
                    background: isCorrect
                      ? "rgba(0,216,122,0.09)"
                      : isWrong
                        ? "rgba(255,59,59,0.09)"
                        : isSelected
                          ? "rgba(0,85,255,0.09)"
                          : "rgba(5,18,45,0.75)",
                    borderColor: isCorrect
                      ? "#00D87A"
                      : isWrong
                        ? "#FF3B3B"
                        : isSelected
                          ? "#0055FF"
                          : "rgba(0,85,255,0.16)",
                    boxShadow: isCorrect
                      ? "0 0 12px rgba(0,216,122,0.25)"
                      : isWrong
                        ? "0 0 12px rgba(255,59,59,0.2)"
                        : "none",
                  }}
                >
                  <div style={{
                    minWidth: hasVisOpts ? "auto" : 28, height: hasVisOpts ? "auto" : 28,
                    border: `1px solid`,
                    borderColor: isCorrect ? "#00D87A" : isWrong ? "#FF3B3B" : "rgba(0,85,255,0.25)",
                    borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                    color: isCorrect ? "#00D87A" : isWrong ? "#FF3B3B" : "#5A78A8",
                    padding: hasVisOpts ? "2px 8px" : "0",
                    marginBottom: hasVisOpts ? 6 : 0,
                    alignSelf: hasVisOpts ? "center" : "auto",
                  }}>
                    {["A", "B", "C", "D"][i]}
                  </div>
                  <OptionContent vis={q.vis} opt={opt} idx={i} />
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="animate-scale-in" style={{
              display: "flex", gap: 10, padding: "14px 16px", marginBottom: 16,
              borderRadius: 4, fontSize: 13, lineHeight: 1.5,
              ...(feedback.correct
                ? { background: "rgba(0,216,122,0.07)", border: "1px solid rgba(0,216,122,0.35)", color: "#5DCBA5" }
                : { background: "rgba(255,59,59,0.06)", border: "1px solid rgba(255,59,59,0.3)", color: "#F09595" }
              ),
            }}>
              <span style={{ fontWeight: 700, flexShrink: 0 }}>{feedback.correct ? "✓" : "✕"}</span>
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={handleNext}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: "8px 0",
                fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
                color: "#8AABCC", transition: "color 0.15s",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#D6E4FF")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#8AABCC")}
            >
              Skip →
            </button>

            <button
              onClick={handleNext}
              disabled={!answered}
              style={{
                padding: "12px 28px", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                borderRadius: 2, border: "none", cursor: answered ? "pointer" : "not-allowed",
                background: "#0055FF", color: "#fff",
                opacity: answered ? 1 : 0.35,
                boxShadow: answered ? "0 0 18px rgba(0,85,255,0.5)" : "none",
                transition: "opacity 0.2s, box-shadow 0.2s, transform 0.15s",
              }}
            >
              {qIdx === ALL_QUESTIONS.length - 1 ? "See Results →" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
