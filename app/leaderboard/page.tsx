"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, type ScoreRow } from "@/lib/supabase";

const BLUE = "#0055FF"; const CYAN = "#06B6D4";
const DIM = "#8AABCC"; const BG = "#050A14";
const BORD = "rgba(0,85,255,0.16)"; const TEXT = "#E8F0FF";

/* Country code → flag emoji */
function flag(code: string) {
  if (!code || code.length !== 2) return "🌍";
  return [...code.toUpperCase()].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join("");
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.max(5, Math.min(98, ((score - 70) / 80) * 100));
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

function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{
          height: 52, borderRadius: 10,
          background: "rgba(0,85,255,0.05)",
          border: `1px solid ${BORD}`,
          animation: "pulse 1.6s ease-in-out infinite",
          animationDelay: `${i * 80}ms`,
        }} />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }`}</style>
    </div>
  );
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [rows,    setRows]    = useState<ScoreRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [total,   setTotal]   = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // Top 50 scores + total count in parallel
        const [topRes, countRes] = await Promise.all([
          supabase
            .from("scores")
            .select("*")
            .order("score", { ascending: false })
            .limit(50),
          supabase
            .from("scores")
            .select("id", { count: "exact", head: true }),
        ]);
        if (topRes.error) throw topRes.error;
        setRows(topRes.data ?? []);
        setTotal(countRes.count ?? null);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ minHeight: "100dvh", background: BG, color: TEXT, fontFamily: "'Inter',system-ui,sans-serif" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Nav */}
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

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48, animation: "fadeUp 0.5s ease forwards" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: CYAN, marginBottom: 10 }}>Intelligence Rankings</p>
          <h1 style={{ fontSize: "clamp(28px,6vw,42px)", fontWeight: 300, letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.1, color: TEXT }}>
            Global IQ <span style={{ color: BLUE }}>Leaderboard</span>
          </h1>
          <p style={{ fontSize: 14, color: DIM, lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
            Real scores from real test-takers worldwide.{" "}
            {total !== null && (
              <span style={{ color: CYAN, fontWeight: 600 }}>{total.toLocaleString()} scores submitted.</span>
            )}
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div style={{ background: "rgba(255,60,60,0.06)", border: "1px solid rgba(255,60,60,0.25)", borderRadius: 12, padding: "24px", textAlign: "center", marginBottom: 32 }}>
            <p style={{ color: "#FF8C8C", fontSize: 14 }}>Failed to load leaderboard. Check your connection and try again.</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: 12, fontSize: 12, padding: "8px 20px", background: "rgba(255,60,60,0.12)", border: "1px solid rgba(255,60,60,0.3)", borderRadius: 6, cursor: "pointer", color: "#FF8C8C" }}>
              Retry
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <Skeleton />}

        {/* Empty state */}
        {!loading && !error && rows.length === 0 && (
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
        )}

        {/* Leaderboard table */}
        {!loading && !error && rows.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Header row */}
            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 60px 80px", gap: 12, padding: "0 16px 8px", borderBottom: `1px solid ${BORD}` }}>
              {["#", "IQ Score", "Flag", "Date"].map(h => (
                <span key={h} style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: DIM }}>{h}</span>
              ))}
            </div>

            {rows.map((row, i) => {
              const iqColor = row.score >= 130 ? "#8B5CF6" : row.score >= 120 ? CYAN : row.score >= 110 ? BLUE : DIM;
              const dateStr = new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
              const isTop3  = i < 3;
              return (
                <div key={row.id} style={{
                  display: "grid", gridTemplateColumns: "40px 1fr 60px 80px",
                  gap: 12, padding: "14px 16px",
                  background: isTop3 ? "rgba(0,85,255,0.07)" : "rgba(6,14,40,0.5)",
                  border: `1px solid ${isTop3 ? "rgba(0,85,255,0.28)" : BORD}`,
                  borderRadius: 10, alignItems: "center",
                  animation: `fadeUp 0.4s ease forwards`,
                  animationDelay: `${Math.min(i * 40, 600)}ms`,
                  opacity: 0,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : DIM }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: iqColor, flexShrink: 0, filter: isTop3 ? `drop-shadow(0 0 6px ${iqColor}80)` : "none" }}>
                      {row.score}
                    </span>
                    <ScoreBar score={row.score} />
                  </div>
                  <span style={{ fontSize: 18 }}>{flag(row.country)}</span>
                  <span style={{ fontSize: 12, color: DIM }}>{dateStr}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats strip */}
        {!loading && rows.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 32 }}>
            {[
              { label: "Top score", value: rows[0]?.score ?? "—" },
              { label: "Avg score", value: rows.length ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length) : "—" },
              { label: "Total tests", value: total !== null ? total.toLocaleString() : "—" },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: "rgba(0,85,255,0.05)", border: `1px solid ${BORD}`, borderRadius: 10, padding: "16px 12px", textAlign: "center" }}>
                <p style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: DIM, marginBottom: 6 }}>{label}</p>
                <p style={{ fontSize: 26, fontWeight: 700, color: CYAN }}>{value}</p>
              </div>
            ))}
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
