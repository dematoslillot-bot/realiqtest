"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { calculateIQ, getDifficultyAdjustment, getIQLabel, getPercentile } from "@/lib/iq-calculator";
import { CATEGORIES } from "@/lib/questions";
import { detectCountryCode, getCountryByCode, type CountryEntry } from "@/lib/leaderboard-data";

/* ── Animated IQ counter ───────────────────────────────────────────────── */

function AnimatedIQ({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);
  const ran = useRef(false);
  useEffect(() => {
    if (!target || ran.current) return;
    ran.current = true;
    const dur = 1900, t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setDisplay(Math.round(target * (1 - Math.pow(1 - p, 4))));
      if (p < 1) requestAnimationFrame(tick);
      else setDisplay(target);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <>{display || ""}</>;
}

/* ── Gaussian bell curve ───────────────────────────────────────────────── */

function BellCurve({ iq }: { iq: number }) {
  const W = 340, H = 140;
  const padL = 28, padR = 28, padT = 22, padB = 28;
  const iqMin = 55, iqMax = 145;
  const mean = 100, sd = 15;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  function pdf(x: number) {
    const z = (x - mean) / sd;
    return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
  }
  const pdfMax = pdf(mean);

  const pts: [number, number][] = [];
  for (let i = 0; i <= 120; i++) {
    const iqV = iqMin + (i / 120) * (iqMax - iqMin);
    const x   = padL + ((iqV - iqMin) / (iqMax - iqMin)) * plotW;
    const y   = padT + plotH - (pdf(iqV) / pdfMax) * plotH;
    pts.push([x, y]);
  }

  const curveD = `M${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L")}`;
  const areaD  = `${curveD} L${pts[pts.length - 1][0]},${padT + plotH} L${pts[0][0]},${padT + plotH} Z`;

  // User marker
  const clampedIQ = Math.max(iqMin, Math.min(iqMax, iq));
  const userX = padL + ((clampedIQ - iqMin) / (iqMax - iqMin)) * plotW;
  const userY = padT + plotH - (pdf(clampedIQ) / pdfMax) * plotH;

  // Shade the area to the left of user (lower percentile)
  const leftPts = pts.filter(([x]) => x <= userX);
  const shadeD = leftPts.length > 1
    ? `M${leftPts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L")} L${leftPts[leftPts.length-1][0]},${padT + plotH} L${leftPts[0][0]},${padT + plotH} Z`
    : "";

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="bellFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0055FF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0055FF" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="bellShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0055FF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0055FF" stopOpacity="0.06" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Baseline */}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH}
        stroke="rgba(0,85,255,0.15)" strokeWidth={1} />

      {/* Area under curve */}
      <path d={areaD} fill="url(#bellFill)" />

      {/* Shaded area left of user */}
      {shadeD && <path d={shadeD} fill="url(#bellShade)" opacity={0.7} />}

      {/* Curve line */}
      <path d={curveD} stroke="#0055FF" strokeWidth={2} fill="none" strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 4px rgba(0,85,255,0.6))" }} />

      {/* User position */}
      <line x1={userX} y1={padT} x2={userX} y2={padT + plotH}
        stroke="#0055FF" strokeWidth={1.5} strokeDasharray="4,3" opacity={0.7} />
      <circle cx={userX} cy={userY} r={12} fill="rgba(0,85,255,0.2)" />
      <circle cx={userX} cy={userY} r={5}  fill="#0055FF"
        style={{ filter: "drop-shadow(0 0 6px rgba(0,85,255,0.9))" }} />

      {/* IQ label above user marker */}
      <text x={userX} y={padT - 6} textAnchor="middle" fontSize={10} fill="#0055FF" fontWeight="700"
        style={{ filter: "drop-shadow(0 0 8px rgba(0,85,255,0.7))" }}>
        {iq}
      </text>

      {/* Axis labels */}
      <text x={padL}            y={H - 8} textAnchor="middle" fontSize={9} fill="#3A5A8A">55</text>
      <text x={padL + plotW/2}  y={H - 8} textAnchor="middle" fontSize={9} fill="#3A5A8A">100</text>
      <text x={padL + plotW}    y={H - 8} textAnchor="middle" fontSize={9} fill="#3A5A8A">145</text>

      {/* Mean marker */}
      <line x1={padL + plotW/2} y1={padT + plotH - 4} x2={padL + plotW/2} y2={padT + plotH + 4}
        stroke="rgba(0,85,255,0.3)" strokeWidth={1} />
    </svg>
  );
}

/* ── Leaderboard popup ─────────────────────────────────────────────── */

function LeaderboardPopup({ iq, onClose }: { iq: number; onClose: () => void }) {
  const [country, setCountry] = useState<CountryEntry | null>(null);

  useEffect(() => {
    const code = detectCountryCode();
    if (code) setCountry(getCountryByCode(code) ?? null);
  }, []);

  const blue  = "#0055FF";
  const blue2 = "rgba(0,85,255,0.16)";
  const dim   = "#3A5A8A";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(5,10,20,0.82)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div className="animate-fade-up" style={{
        maxWidth: 380, width: "100%",
        background: "#080E1A", border: `1px solid ${blue2}`,
        borderRadius: 10, padding: "28px 24px", textAlign: "center",
        boxShadow: "0 0 60px rgba(0,85,255,0.18)",
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🌍</div>
        <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: dim, marginBottom: 10 }}>
          Country Comparison
        </p>

        {country ? (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18 }}>
              <span style={{ fontSize: 32 }}>{country.flag}</span>
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#D6E4FF" }}>{country.name}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              <div style={{ background: "rgba(0,85,255,0.07)", border: `1px solid ${blue2}`, borderRadius: 6, padding: "12px 8px" }}>
                <p style={{ fontSize: 9, color: dim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Country avg</p>
                <p style={{ fontSize: 22, fontWeight: 300, color: blue }}>{country.avgIQ}</p>
              </div>
              <div style={{ background: "rgba(0,85,255,0.07)", border: `1px solid ${blue2}`, borderRadius: 6, padding: "12px 8px" }}>
                <p style={{ fontSize: 9, color: dim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Your score</p>
                <p style={{ fontSize: 22, fontWeight: 300, color: iq >= country.avgIQ ? "#00D87A" : "#FF8C00" }}>{iq}</p>
              </div>
            </div>

            <p style={{ fontSize: 12, color: dim, marginBottom: 20, lineHeight: 1.6 }}>
              {iq > country.avgIQ
                ? `You scored ${iq - country.avgIQ} pts above your country's average — top performance! 🚀`
                : iq === country.avgIQ
                  ? "You matched your country's average exactly."
                  : `You're ${country.avgIQ - iq} pts below your country's average — keep practicing!`}
            </p>
          </>
        ) : (
          <p style={{ fontSize: 13, color: dim, marginBottom: 20 }}>
            See how your score compares to 50+ countries worldwide.
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={onClose} className="btn btn-primary" style={{ width: "100%" }}>
            Continue to my results →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Results page ──────────────────────────────────────────────────────── */

export default function ResultsPage() {
  const router = useRouter();
  const [iq, setIq]           = useState(0);
  const [label, setLabel]     = useState("");
  const [percentile, setPercentile] = useState(0);
  const [score, setScore]     = useState(0);
  const [total, setTotal]     = useState(0);
  const [catScores, setCatScores] = useState([0,0,0,0,0,0]);
  const [catTotals, setCatTotals] = useState([0,0,0,0,0,0]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const s  = parseInt(localStorage.getItem("iq_score")     || "0");
    const t  = parseInt(localStorage.getItem("iq_total")     || "30");
    const cs = JSON.parse(localStorage.getItem("iq_catScores") || "[0,0,0,0,0,0]");
    const ct = JSON.parse(localStorage.getItem("iq_catTotals") || "[0,0,0,0,0,0]");
    const easyScore = parseInt(localStorage.getItem("iq_easyScore") || "0");
    const easyTotal = parseInt(localStorage.getItem("iq_easyTotal") || "1");
    const hardScore = parseInt(localStorage.getItem("iq_hardScore") || "0");
    const hardTotal = parseInt(localStorage.getItem("iq_hardTotal") || "1");
    const base  = calculateIQ(s, t);
    const adj   = getDifficultyAdjustment(hardScore, hardTotal, easyTotal - easyScore, easyTotal);
    const final = Math.max(78, Math.min(145, base + adj));
    setScore(s); setTotal(t); setCatScores(cs); setCatTotals(ct);
    setIq(final); setLabel(getIQLabel(final)); setPercentile(getPercentile(final));
    const timer = setTimeout(() => setShowLeaderboard(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  const meterFill  = iq > 0 ? Math.round(((iq - 70) / 80) * 100) : 0;
  const catOffsets = [5, -2, -8, 3, -5, -12];
  const blue       = "#0055FF";
  const blue2      = "rgba(0,85,255,0.16)";
  const dim        = "#3A5A8A";

  return (
    <div style={{ minHeight: "100dvh", background: "#050A14", color: "#D6E4FF" }}>

      {/* Leaderboard popup */}
      {showLeaderboard && iq > 0 && (
        <LeaderboardPopup iq={iq} onClose={() => setShowLeaderboard(false)} />
      )}

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 24px", borderBottom: `1px solid ${blue2}`,
        background: "rgba(5,10,20,0.95)", backdropFilter: "blur(18px)",
      }}>
        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em" }}>
          Real<span style={{ color: blue }}>IQ</span>Test
        </span>
        <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: dim }}>Your Results</span>
      </nav>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 20px", textAlign: "center" }}>

        {/* IQ Score */}
        <p className="animate-fade-up" style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: dim, marginBottom: 16 }}>
          Your RealIQ Score
        </p>
        <div
          className="animate-fade-up"
          style={{
            fontSize: "clamp(80px,18vw,118px)", fontWeight: 300, lineHeight: 1,
            color: blue, letterSpacing: "-0.03em",
            textShadow: `0 0 60px rgba(0,85,255,0.45)`,
            animationDelay: "80ms",
          }}
        >
          <AnimatedIQ target={iq} />
        </div>
        <p className="animate-fade-up" style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: dim, marginTop: 8, animationDelay: "160ms" }}>
          Intelligence Quotient
        </p>

        {/* Label badge */}
        <div className="animate-fade-up" style={{ animationDelay: "220ms", marginTop: 16, marginBottom: 28 }}>
          <span style={{
            display: "inline-block", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
            padding: "7px 20px", border: `1px solid ${blue}`, color: blue,
            boxShadow: `0 0 16px rgba(0,85,255,0.3)`,
          }}>
            {label}
          </span>
        </div>

        {/* IQ meter */}
        <div className="animate-fade-up" style={{ maxWidth: 360, margin: "0 auto 16px", animationDelay: "280ms" }}>
          <div style={{ height: 4, background: blue2, borderRadius: 2, overflow: "hidden" }}>
            <div className="progress-neon" style={{
              height: "100%", borderRadius: 2,
              width: `${meterFill}%`,
              transition: "width 1.6s cubic-bezier(0.22,1,0.36,1)",
              transitionDelay: "400ms",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: dim, marginTop: 6, letterSpacing: "0.06em" }}>
            <span>70</span><span>Average (100)</span><span>145+</span>
          </div>
        </div>

        <p className="animate-fade-up" style={{ fontSize: 13, color: dim, animationDelay: "340ms" }}>
          You answered {score} out of {total} questions correctly
        </p>
        <p className="animate-fade-up" style={{ fontSize: 11, color: "#1E3460", marginTop: 6, maxWidth: 340, margin: "6px auto 32px", animationDelay: "380ms" }}>
          This is an estimate based on performance. Not a certified clinical assessment.
        </p>

        {/* Bell curve */}
        <div className="animate-fade-up" style={{
          animationDelay: "420ms", marginBottom: 32,
          background: "rgba(5,18,45,0.75)", border: `1px solid ${blue2}`,
          backdropFilter: "blur(14px)", borderRadius: 8, padding: "20px 8px",
        }}>
          <p style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: dim, marginBottom: 14 }}>
            IQ Distribution — Normal Curve
          </p>
          {iq > 0 && <BellCurve iq={iq} />}
          <p style={{ fontSize: 10, color: dim, marginTop: 12 }}>
            You are in the <span style={{ color: blue, fontWeight: 600 }}>{percentile}th percentile</span> of the population
          </p>
        </div>

        {/* Category breakdown (partial) */}
        <div className="animate-fade-up" style={{ animationDelay: "460ms", marginBottom: 28, textAlign: "left" }}>
          <p style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: dim, marginBottom: 14, textAlign: "center" }}>
            Score by category
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CATEGORIES.map((cat, i) => {
              const catIQ  = Math.min(145, Math.max(70, iq + catOffsets[i]));
              const barW   = Math.round(((catIQ - 70) / 80) * 100);
              const blurred = i >= 3;
              return (
                <div
                  key={i}
                  className="animate-fade-up"
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                    background: "rgba(5,18,45,0.75)", border: `1px solid ${blue2}`,
                    borderRadius: 4, animationDelay: `${460 + i * 55}ms`,
                    ...(blurred ? { filter: "blur(5px)", opacity: 0.25, userSelect: "none", pointerEvents: "none" } : {}),
                  }}
                >
                  <span style={{ fontSize: 12, color: dim, width: 130, flexShrink: 0 }}>{cat.name}</span>
                  <div style={{ flex: 1, height: 3, background: blue2, borderRadius: 2, overflow: "hidden" }}>
                    <div className="progress-neon" style={{
                      height: "100%", borderRadius: 2,
                      width: `${barW}%`,
                      transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)",
                      transitionDelay: `${600 + i * 80}ms`,
                    }} />
                  </div>
                  <span style={{ fontSize: 13, color: blue, fontWeight: 600, width: 32, textAlign: "right" }}>{catIQ}</span>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 10, color: "#1E3460", textAlign: "center", marginTop: 10 }}>
            Bottom 3 categories locked — unlock with Premium Report
          </p>
        </div>

        {/* Upsell */}
        <div className="animate-fade-up" style={{
          animationDelay: "740ms", marginBottom: 24,
          padding: 20, borderRadius: 6,
          background: "rgba(0,85,255,0.06)",
          border: `1px dashed rgba(0,85,255,0.28)`,
          textAlign: "left",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: blue }}>Full Cognitive Report</p>
            <span style={{ fontSize: 9, background: "rgba(0,216,122,0.15)", color: "#00D87A", border: "1px solid rgba(0,216,122,0.3)", padding: "2px 8px", borderRadius: 2 }}>
              Save 80%
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#1E3460", textDecoration: "line-through" }}>€9.99</span>
            <span style={{ fontSize: 22, fontWeight: 600, color: "#D6E4FF" }}>€1.99</span>
          </div>
          <p style={{ fontSize: 12, color: dim, lineHeight: 1.6 }}>
            All 6 category scores · Cognitive radar chart · Career matches · Improvement tips · PDF certificate
          </p>
        </div>

        {/* CTA buttons */}
        <div className="animate-fade-up" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", animationDelay: "800ms" }}>
          <button
            onClick={() => router.push("/report")}
            className="btn btn-primary"
          >
            Unlock Full Report — €1.99
          </button>
          <button
            onClick={() => router.push("/test")}
            className="btn btn-outline"
          >
            Retry
          </button>
        </div>

        <p style={{ fontSize: 10, color: "#1E3460", marginTop: 16 }}>No subscription · One-time payment · Instant access</p>
      </div>
    </div>
  );
}
