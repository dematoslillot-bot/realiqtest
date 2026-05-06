"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LEADERBOARD, TOTAL_TESTS, type CountryEntry, type Region } from "@/lib/leaderboard-data";

const REGIONS: Array<"All" | Region> = ["All", "Europe", "Asia", "Americas", "Oceania", "Africa & Middle East"];

/* ── Animated counter ────────────────────────────────────────────────────── */

function AnimatedCount({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const dur = 1600, t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <>{val.toLocaleString()}{suffix}</>;
}

/* ── Podium ──────────────────────────────────────────────────────────────── */

function Podium({ top3 }: { top3: CountryEntry[] }) {
  const blue  = "#0055FF";
  const blue2 = "rgba(0,85,255,0.16)";

  const heights = [130, 100, 80];
  const order   = [1, 0, 2]; // silver, gold, bronze layout
  const medals  = ["🥈", "🥇", "🥉"];
  const colors  = [
    "rgba(192,192,192,0.15)", // silver
    "rgba(255,215,0,0.18)",   // gold
    "rgba(205,127,50,0.15)",  // bronze
  ];
  const borders = ["rgba(192,192,192,0.4)", "rgba(255,215,0,0.6)", "rgba(205,127,50,0.4)"];
  const glows   = [
    "0 0 24px rgba(192,192,192,0.15)",
    "0 0 40px rgba(255,215,0,0.25)",
    "0 0 24px rgba(205,127,50,0.15)",
  ];

  return (
    <div style={{
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      gap: 12, margin: "0 auto 40px", maxWidth: 500,
    }}>
      {order.map((pos) => {
        const c = top3[pos];
        if (!c) return null;
        const isGold = pos === 0;
        return (
          <div key={pos} className="animate-fade-up" style={{
            display: "flex", flexDirection: "column", alignItems: "center", flex: 1,
            animationDelay: `${pos * 120}ms`,
          }}>
            {/* Country card */}
            <div style={{
              background: colors[pos], border: `1px solid ${borders[pos]}`,
              borderRadius: 8, padding: "14px 10px", textAlign: "center", width: "100%",
              boxShadow: glows[pos],
              transform: isGold ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.2s ease",
            }}>
              <div style={{ fontSize: isGold ? 40 : 32, marginBottom: 4 }}>{c.flag}</div>
              <p style={{ fontSize: isGold ? 13 : 11, fontWeight: 600, color: "#D6E4FF", marginBottom: 2, lineHeight: 1.2 }}>
                {c.name}
              </p>
              <p style={{ fontSize: isGold ? 22 : 18, fontWeight: 300, color: blue }}>
                {c.avgIQ}
              </p>
              <p style={{ fontSize: 9, color: "#3A5A8A", letterSpacing: "0.08em" }}>IQ avg</p>
            </div>

            {/* Podium block */}
            <div style={{
              width: "100%", height: heights[pos],
              background: `linear-gradient(180deg, ${colors[pos]}, rgba(5,18,45,0.5))`,
              border: `1px solid ${borders[pos]}`,
              borderTop: "none",
              borderRadius: "0 0 4px 4px",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: glows[pos],
            }}>
              <span style={{ fontSize: 28 }}>{medals[pos]}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Table row ───────────────────────────────────────────────────────────── */

function CountryRow({ c, userCode, animate }: { c: CountryEntry; userCode: string; animate: boolean }) {
  const isUser = c.code === userCode;
  const blue   = "#0055FF";
  const blue2  = "rgba(0,85,255,0.16)";
  const dim    = "#3A5A8A";

  const rankColor =
    c.rank === 1 ? "#FFD700" :
    c.rank === 2 ? "#C0C0C0" :
    c.rank === 3 ? "#CD7F32" : dim;

  return (
    <div className={animate ? "animate-fade-up" : ""} style={{
      display: "grid",
      gridTemplateColumns: "44px 36px 1fr 64px 80px",
      alignItems: "center", gap: 8,
      padding: "11px 16px",
      background: isUser ? "rgba(0,85,255,0.08)" : "rgba(5,18,45,0.6)",
      border: `1px solid ${isUser ? "rgba(0,85,255,0.4)" : blue2}`,
      borderRadius: 6,
      boxShadow: isUser ? "0 0 16px rgba(0,85,255,0.15)" : "none",
      transition: "background 0.2s",
    }}>
      {/* Rank */}
      <span style={{ fontSize: 14, fontWeight: 700, color: rankColor, textAlign: "center" }}>
        {c.rank <= 3 ? ["🥇","🥈","🥉"][c.rank - 1] : `#${c.rank}`}
      </span>
      {/* Flag */}
      <span style={{ fontSize: 22, textAlign: "center" }}>{c.flag}</span>
      {/* Name */}
      <div>
        <p style={{ fontSize: 13, color: "#D6E4FF", fontWeight: isUser ? 600 : 400 }}>
          {c.name}
          {isUser && <span style={{ fontSize: 9, color: blue, marginLeft: 6, letterSpacing: "0.1em" }}>YOU</span>}
        </p>
        <p style={{ fontSize: 9, color: dim, letterSpacing: "0.06em" }}>{c.region}</p>
      </div>
      {/* Avg IQ */}
      <span style={{ fontSize: 16, fontWeight: 600, color: blue, textAlign: "right" }}>
        {c.avgIQ}
      </span>
      {/* Tests */}
      <span style={{ fontSize: 11, color: dim, textAlign: "right" }}>
        {c.tests.toLocaleString()}
      </span>
    </div>
  );
}

/* ── Main leaderboard page ───────────────────────────────────────────────── */

export default function LeaderboardPage() {
  const router = useRouter();
  const [region, setRegion] = useState<"All" | Region>("All");
  const [userCode, setUserCode] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Detect user's country on mount
    import("@/lib/leaderboard-data").then(({ detectCountryCode }) => {
      setUserCode(detectCountryCode());
    });
  }, []);

  const filtered = LEADERBOARD.filter(c => {
    const matchRegion = region === "All" || c.region === region;
    const matchSearch = search === "" || c.name.toLowerCase().includes(search.toLowerCase());
    return matchRegion && matchSearch;
  });

  const top3   = LEADERBOARD.slice(0, 3);
  const blue   = "#0055FF";
  const blue2  = "rgba(0,85,255,0.16)";
  const dim    = "#3A5A8A";

  return (
    <div style={{ minHeight: "100dvh", background: "#050A14", color: "#D6E4FF" }}>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 24px", borderBottom: `1px solid ${blue2}`,
        background: "rgba(5,10,20,0.95)", backdropFilter: "blur(18px)",
      }}>
        <button
          onClick={() => router.push("/")}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em", color: "#D6E4FF" }}
        >
          Real<span style={{ color: blue }}>IQ</span>Test
        </button>
        <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: dim }}>
          Global IQ Rankings
        </span>
        <button onClick={() => router.push("/test")} className="btn btn-primary" style={{ fontSize: 11, padding: "7px 16px" }}>
          Take Test
        </button>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 16px" }}>

        {/* Header */}
        <div className="animate-fade-up" style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: dim, marginBottom: 10 }}>
            Based on cross-national IQ research
          </p>
          <h1 style={{ fontSize: "clamp(28px,6vw,42px)", fontWeight: 300, letterSpacing: "-0.03em", marginBottom: 12, lineHeight: 1.1 }}>
            Global IQ <span style={{ color: blue }}>Leaderboard</span>
          </h1>

          {/* Total tests counter */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,85,255,0.07)", border: `1px solid ${blue2}`,
            borderRadius: 6, padding: "10px 20px", marginBottom: 8,
          }}>
            <span style={{ fontSize: 22, fontWeight: 600, color: blue }}>
              <AnimatedCount target={TOTAL_TESTS} />
            </span>
            <span style={{ fontSize: 11, color: dim }}>total tests taken worldwide</span>
          </div>

          <p style={{ fontSize: 11, color: "#1E3460", marginTop: 8 }}>
            Average IQ scores based on published academic research (Lynn &amp; Becker, 2019). Data is for educational purposes only.
          </p>
        </div>

        {/* Podium — top 3 */}
        <Podium top3={top3} />

        {/* Filter tabs */}
        <div style={{
          display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center",
          marginBottom: 16,
        }}>
          {REGIONS.map(r => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              style={{
                background: region === r ? blue : "rgba(0,85,255,0.07)",
                border: `1px solid ${region === r ? blue : blue2}`,
                color: region === r ? "#fff" : dim,
                borderRadius: 4, padding: "6px 14px", fontSize: 11,
                cursor: "pointer", letterSpacing: "0.06em",
                transition: "all 0.2s ease",
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom: 14 }}>
          <input
            type="text"
            placeholder="Search country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box",
              background: "rgba(5,18,45,0.8)", border: `1px solid ${blue2}`,
              borderRadius: 4, padding: "10px 14px", color: "#D6E4FF",
              fontSize: 13, outline: "none",
            }}
          />
        </div>

        {/* Table header */}
        <div style={{
          display: "grid", gridTemplateColumns: "44px 36px 1fr 64px 80px",
          gap: 8, padding: "8px 16px", marginBottom: 6,
        }}>
          <span style={{ fontSize: 9, color: dim, letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "center" }}>Rank</span>
          <span style={{ fontSize: 9, color: dim, letterSpacing: "0.12em", textTransform: "uppercase" }}></span>
          <span style={{ fontSize: 9, color: dim, letterSpacing: "0.12em", textTransform: "uppercase" }}>Country</span>
          <span style={{ fontSize: 9, color: dim, letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "right" }}>Avg IQ</span>
          <span style={{ fontSize: 9, color: dim, letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "right" }}>Tests</span>
        </div>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {filtered.map((c, i) => (
            <CountryRow key={c.code} c={c} userCode={userCode} animate={i < 20} />
          ))}
          {filtered.length === 0 && (
            <p style={{ textAlign: "center", color: dim, padding: "32px 0", fontSize: 13 }}>
              No countries found for this filter.
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="animate-fade-up" style={{ textAlign: "center", marginTop: 48 }}>
          <p style={{ fontSize: 13, color: dim, marginBottom: 16 }}>
            Don&apos;t know where you stand yet?
          </p>
          <button
            onClick={() => router.push("/test")}
            className="btn btn-primary"
          >
            Take the Free IQ Test →
          </button>
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: 10, color: "#1E3460", textAlign: "center", marginTop: 28, lineHeight: 1.7 }}>
          Rankings are based on academic research averages, not live user data. Individual IQ varies widely within all countries.
          Test counts are estimates based on platform usage patterns.
        </p>
      </div>
    </div>
  );
}
