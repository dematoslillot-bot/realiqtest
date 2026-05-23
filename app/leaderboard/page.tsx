"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BLUE = "#0055FF"; const CYAN = "#06B6D4";
const DIM = "#8AABCC"; const BG = "#050A14";
const BORD = "rgba(0,85,255,0.16)"; const TEXT = "#E8F0FF";

type LBEntry = { iq: number; date: string; country: string; age: string };

function ScoreBar({ iq }: { iq: number }) {
  const pct = Math.max(5, Math.min(98, ((iq - 70) / 80) * 100));
  return (
    <div style={{ height: 4, background: "rgba(0,85,255,0.12)", borderRadius: 2, overflow: "hidden", flex: 1 }}>
      <div style={{
        height: "100%", width: `${pct}%`,
        background: `linear-gradient(90deg, ${BLUE}, ${CYAN})`,
        borderRadius: 2, transition: "width 1s ease",
      }} />
    </div>
  );
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<LBEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState<string>("");

  useEffect(() => {
    // Read stored entries
    const stored = JSON.parse(localStorage.getItem("lb_entries") || "[]") as LBEntry[];
    setEntries(stored);

    // Detect country
    fetch("https://api.country.is/")
      .then(r => r.json())
      .then(d => { if (d?.country) setCountry(d.country); })
      .catch(() => {});

    setLoading(false);
  }, []);

  return (
    <div style={{ minHeight: "100dvh", background: BG, color: TEXT, fontFamily: "'Inter',system-ui,sans-serif" }}>
      <nav style={{
        position: "sticky", top: 0, zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 24px", borderBottom: `1px solid ${BORD}`,
        background: "rgba(5,10,20,0.95)", backdropFilter: "blur(18px)",
      }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em", color: TEXT }}>
          Real<span style={{ color: BLUE }}>IQ</span>Test
        </button>
        <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: DIM }}>Global IQ Rankings</span>
        <button onClick={() => router.push("/test")} style={{
          fontSize: 11, padding: "8px 18px", background: BLUE, color: "#fff",
          border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600,
          letterSpacing: "0.08em", textTransform: "uppercase",
          boxShadow: "0 0 14px rgba(0,85,255,0.4)",
        }}>Take Test</button>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 20px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: CYAN, marginBottom: 10 }}>Intelligence Rankings</p>
          <h1 style={{ fontSize: "clamp(28px,6vw,42px)", fontWeight: 300, letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.1, color: TEXT }}>
            Global IQ <span style={{ color: BLUE }}>Leaderboard</span>
          </h1>
          <p style={{ fontSize: 14, color: DIM, lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
            Rankings built from real, verified test completions only. No invented scores.
          </p>
        </div>

        {!loading && entries.length === 0 ? (
          <div style={{ background: "rgba(6,14,40,0.78)", border: `1px solid ${BORD}`, backdropFilter: "blur(20px)", borderRadius: 16, padding: "56px 32px", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", margin: "0 auto 24px", background: "rgba(0,85,255,0.08)", border: `1px solid rgba(0,85,255,0.25)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: TEXT, marginBottom: 12, letterSpacing: "-0.02em" }}>Be the first to claim your spot</h2>
            <p style={{ fontSize: 14, color: DIM, lineHeight: 1.75, maxWidth: 420, margin: "0 auto 32px" }}>
              Complete the free IQ test and your result will appear here instantly.
            </p>
            <button onClick={() => router.push("/test")} style={{
              fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "14px 36px", background: `linear-gradient(135deg,${BLUE},${CYAN})`,
              color: "#fff", border: "none", borderRadius: 8, cursor: "pointer",
              boxShadow: "0 0 24px rgba(0,85,255,0.5)",
            }}>Take the Free IQ Test →</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Header row */}
            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 80px 100px 120px", gap: 12, padding: "0 16px 8px", borderBottom: `1px solid ${BORD}` }}>
              {["#","Score","Date","Country","Age"].map(h => (
                <span key={h} style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: DIM }}>{h}</span>
              ))}
            </div>
            {entries.map((e, i) => {
              const dateStr = new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
              const iqColor = e.iq >= 130 ? "#8B5CF6" : e.iq >= 120 ? CYAN : e.iq >= 110 ? BLUE : DIM;
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "40px 1fr 80px 100px 120px",
                  gap: 12, padding: "14px 16px",
                  background: i === 0 ? "rgba(0,85,255,0.08)" : "rgba(6,14,40,0.5)",
                  border: `1px solid ${i === 0 ? "rgba(0,85,255,0.3)" : BORD}`,
                  borderRadius: 10, alignItems: "center",
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: i === 0 ? CYAN : DIM }}>#{i + 1}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: iqColor, flexShrink: 0 }}>{e.iq}</span>
                    <ScoreBar iq={e.iq} />
                  </div>
                  <span style={{ fontSize: 12, color: DIM }}>{dateStr}</span>
                  <span style={{ fontSize: 12, color: DIM }}>{e.country || country || "—"}</span>
                  <span style={{ fontSize: 12, color: DIM }}>{e.age || "—"}</span>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 48, flexWrap: "wrap" }}>
          {[{href:"/rankings",l:"Full Rankings"},{href:"/what-is-iq",l:"What is IQ?"},{href:"/faq",l:"FAQ"}].map(({href,l})=>(
            <Link key={href} href={href} style={{ fontSize: 12, color: DIM, textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
