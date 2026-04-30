"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ALL_QUESTIONS, CATEGORIES, type ShapeDef, type RavenCell, type VisualDef } from "@/lib/questions";

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

function RotationSVG({ path, angle, size = 80 }: { path: string; angle: number; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      <rect x={1} y={1} width={58} height={58} rx={2}
        fill="rgba(5,18,45,0.9)" stroke="rgba(0,85,255,0.22)" strokeWidth={1} />
      <g transform={`rotate(${angle},30,30)`}>
        <path d={path} fill="#6EB0FF" />
      </g>
    </svg>
  );
}

function RotationDisplay({ path, showAngle }: { path: string; showAngle: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#3A5A8A" }}>Source shape</p>
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
                  <text x={x + bw / 2} y={H + 14} textAnchor="middle" fontSize={9} fill="#3A5A8A">{v}</text>
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
        <p style={{ fontSize: 11, color: "#3A5A8A", letterSpacing: "0.08em" }}>
          Memorise — {countdown}s remaining
        </p>
      )}
      {phase === "hidden" && (
        <p style={{ fontSize: 11, color: "#3A5A8A" }}>Now answer the question below ↓</p>
      )}
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
              <span style={{ fontSize: 9, color: "#3A5A8A", marginRight: 6, letterSpacing: "0.1em" }}>
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
  }
}

/* ── Option content (visual or text) ───────────────────────────────────── */

function OptionContent({ vis, opt, idx }: { vis?: VisualDef; opt: string; idx: number }) {
  if (vis?.kind === "raven") {
    return <RavenCellSVG cell={vis.optCells[idx]} size={60} />;
  }
  if (vis?.kind === "rotation") {
    return <RotationSVG path={vis.path} angle={vis.optAngles[idx]} size={68} />;
  }
  return <span style={{ fontSize: 14, lineHeight: 1.4 }}>{opt}</span>;
}

/* ── Main test page ─────────────────────────────────────────────────────── */

export default function TestPage() {
  const router = useRouter();
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [catScores, setCatScores] = useState([0, 0, 0, 0, 0, 0]);
  const [catTotals, setCatTotals] = useState([0, 0, 0, 0, 0, 0]);
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
      localStorage.setItem("iq_score",     score.toString());
      localStorage.setItem("iq_total",     ALL_QUESTIONS.length.toString());
      localStorage.setItem("iq_catScores", JSON.stringify(catScores));
      localStorage.setItem("iq_catTotals", JSON.stringify(catTotals));
      router.push("/results");
      return;
    }
    if (ALL_QUESTIONS[nextIdx].cat !== q.cat) {
      setShowTransition(true);
    } else {
      advanceTo(nextIdx);
    }
  }, [qIdx, score, catScores, catTotals, q, router, advanceTo]);

  // Countdown timer (paused during memory reveal)
  useEffect(() => {
    if (answered || showTransition || timerPaused) return;
    if (timeLeft <= 0) {
      setAnswered(true);
      setResults(prev => [...prev, false]);
      setCatTotals(prev => { const n = [...prev]; n[q.cat]++; return n; });
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

  const hasVisOpts  = q.vis?.kind === "raven" || q.vis?.kind === "rotation";

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
              <p style={{ fontSize: 13, color: "#3A5A8A", marginBottom: 6 }}>{prevCat.name}</p>
              <div style={{ fontSize: 64, fontWeight: 300, color: "#0055FF", lineHeight: 1, margin: "12px 0", textShadow: "0 0 30px rgba(0,85,255,0.5)" }}>
                {catScore}<span style={{ fontSize: 24, color: "#3A5A8A" }}>/{catTotal}</span>
              </div>
              <div style={{ height: 3, background: "rgba(0,85,255,0.12)", borderRadius: 2, overflow: "hidden", marginTop: 16 }}>
                <div className="progress-neon" style={{ height: "100%", width: `${catTotal > 0 ? (catScore / catTotal) * 100 : 0}%`, transition: "width 0.9s ease", borderRadius: 2 }} />
              </div>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 400, marginBottom: 6 }}>
              Next: <span style={{ color: "#0055FF" }}>{nextCat.name}</span>
            </h2>
            <p style={{ fontSize: 13, color: "#3A5A8A", marginBottom: 28 }}>Take a breath before continuing.</p>
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
            <p style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#3A5A8A", lineHeight: 1, marginBottom: 2 }}>
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
              fontSize: 11, fontWeight: 700, color: timerPaused ? "#3A5A8A" : timerColor,
            }}>
              {timerPaused ? "—" : timeLeft}
            </span>
          </div>
        </div>

        {/* Progress bar + dots */}
        <div style={{ padding: "0 20px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#3A5A8A", marginBottom: 5, letterSpacing: "0.08em" }}>
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
              <span style={{ fontSize: 10, color: "#3A5A8A", fontWeight: 400 }}>is to</span>
              <span>{q.w2}</span>
              <span style={{ fontSize: 10, color: "#3A5A8A", fontWeight: 400 }}>as</span>
              <span>{q.w3}</span>
              <span style={{ fontSize: 10, color: "#3A5A8A", fontWeight: 400 }}>is to</span>
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
                  {i < q.seq!.length - 1 && <span style={{ color: "#3A5A8A", fontSize: 12 }}>→</span>}
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
                color: "#3A5A8A", transition: "color 0.15s",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#D6E4FF")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#3A5A8A")}
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
