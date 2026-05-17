"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

const BLUE  = "#0055FF";
const CYAN  = "#06B6D4";
const DIM   = "#8AABCC";
const BG    = "#050A14";
const BORD  = "rgba(0,85,255,0.16)";
const TEXT  = "#E8F0FF";

export default function LeaderboardPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100dvh", background: BG, color: TEXT, fontFamily: "'Inter',system-ui,sans-serif" }}>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 24px", borderBottom: `1px solid ${BORD}`,
        background: "rgba(5,10,20,0.95)", backdropFilter: "blur(18px)",
      }}>
        <button
          onClick={() => router.push("/")}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em", color: TEXT }}
        >
          Real<span style={{ color: BLUE }}>IQ</span>Test
        </button>
        <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: DIM }}>
          Global IQ Rankings
        </span>
        <button onClick={() => router.push("/test")} style={{
          fontSize: 11, padding: "8px 18px", background: BLUE, color: "#fff",
          border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600,
          letterSpacing: "0.08em", textTransform: "uppercase",
          boxShadow: "0 0 14px rgba(0,85,255,0.4)",
        }}>
          Take Test
        </button>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 20px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: CYAN, marginBottom: 10 }}>
            Intelligence Rankings
          </p>
          <h1 style={{ fontSize: "clamp(28px,6vw,42px)", fontWeight: 300, letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.1, color: TEXT }}>
            Global IQ <span style={{ color: BLUE }}>Leaderboard</span>
          </h1>
          <p style={{ fontSize: 14, color: DIM, lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
            Rankings are built entirely from real, verified test completions. No invented scores, no placeholder data.
          </p>
        </div>

        {/* Empty state */}
        <div style={{
          background: "rgba(6,14,40,0.78)", border: `1px solid ${BORD}`,
          backdropFilter: "blur(20px)", borderRadius: 16,
          padding: "56px 32px", textAlign: "center",
        }}>
          {/* Icon */}
          <div style={{
            width: 72, height: 72, borderRadius: "50%", margin: "0 auto 24px",
            background: "rgba(0,85,255,0.08)", border: `1px solid rgba(0,85,255,0.25)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 600, color: TEXT, marginBottom: 12, letterSpacing: "-0.02em" }}>
            Be the first to claim your spot
          </h2>
          <p style={{ fontSize: 14, color: DIM, lineHeight: 1.75, maxWidth: 420, margin: "0 auto 32px" }}>
            The leaderboard is waiting for real scores. Complete the free IQ test and your result will appear here instantly.
          </p>

          {/* Stats placeholders */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
            gap: 12, marginBottom: 36, maxWidth: 480, margin: "0 auto 36px",
          }}>
            {["Country rankings","Age group data","Occupation data"].map(label => (
              <div key={label} style={{
                background: "rgba(0,85,255,0.05)", border: `1px solid ${BORD}`,
                borderRadius: 8, padding: "16px 12px",
              }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "rgba(0,85,255,0.3)", marginBottom: 4 }}>—</div>
                <div style={{ fontSize: 11, color: DIM, lineHeight: 1.5 }}>{label}<br/>awaiting first entries</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/test")}
            style={{
              fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "14px 36px", background: `linear-gradient(135deg,${BLUE},${CYAN})`,
              color: "#fff", border: "none", borderRadius: 8, cursor: "pointer",
              boxShadow: "0 0 24px rgba(0,85,255,0.5)",
            }}
          >
            Take the Free IQ Test →
          </button>
        </div>

        {/* How it works */}
        <div style={{ marginTop: 40, padding: "24px 28px", background: "rgba(0,85,255,0.04)", border: `1px solid ${BORD}`, borderRadius: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 10 }}>How rankings work</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Complete the free 30-question cognitive assessment",
              "Your score is added anonymously to the global database",
              "Country, age group, and occupation tables update in real time",
              "Unlock the premium report to see your detailed breakdown",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  background: "rgba(0,85,255,0.15)", border: `1px solid rgba(0,85,255,0.3)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: CYAN,
                }}>{i + 1}</div>
                <span style={{ fontSize: 13, color: DIM, lineHeight: 1.6, paddingTop: 2 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 40, flexWrap: "wrap" }}>
          {[{href:"/rankings",l:"Full Rankings"},{href:"/what-is-iq",l:"What is IQ?"},{href:"/faq",l:"FAQ"}].map(({href,l})=>(
            <Link key={href} href={href} style={{ fontSize: 12, color: DIM, textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
