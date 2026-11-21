"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import NavLogo from "@/app/components/NavLogo";
import { aggregateCountries, flag, MIN_TESTS_FOR_RANK, type CountryStat } from "@/lib/countries";

const BLUE = "#5B4FFF", CYAN = "#00F5D4", DIM = "#8AABCC", BG = "#03050F";
const BORD = "rgba(91,79,255,0.18)", TEXT = "#E8F0FF", CARD = "rgba(5,18,45,0.75)", GOLD = "#F5C542";

async function loadAllScores(): Promise<{ country: string; score: number }[]> {
  const out: { country: string; score: number }[] = [];
  const page = 1000;
  for (let i = 0; i < 30; i++) {
    const { data, error } = await supabase.from("scores").select("country,score").range(i * page, i * page + page - 1);
    if (error) throw error;
    out.push(...(data ?? []));
    if (!data || data.length < page) break;
  }
  return out;
}

function Bar({ avg }: { avg: number }) {
  const pct = Math.max(4, Math.min(100, ((avg - 70) / 75) * 100));
  return (
    <div style={{ height: 6, background: "rgba(91,79,255,0.12)", borderRadius: 3, overflow: "hidden", flex: 1, minWidth: 40 }}>
      <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${BLUE}, ${CYAN})`, borderRadius: 3, transition: "width 1s ease" }} />
    </div>
  );
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<CountryStat[] | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);
  const [mine, setMine] = useState("");

  useEffect(() => {
    try { setMine(localStorage.getItem("user_country_code") || ""); } catch { /* ignore */ }
    loadAllScores()
      .then(rows => { const s = aggregateCountries(rows); setStats(s); setTotal(s.reduce((a, c) => a + c.count, 0)); })
      .catch(() => setError(true));
  }, []);

  const ranked = (stats ?? []).filter(s => s.count >= MIN_TESTS_FOR_RANK);
  const pending = (stats ?? []).filter(s => s.count < MIN_TESTS_FOR_RANK);
  const myRank = ranked.findIndex(s => s.code === mine);

  return (
    <div style={{ minHeight: "100dvh", background: BG, color: TEXT }}>
      <style>{`@keyframes lbIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}} @keyframes lbPulse{0%,100%{opacity:.45}50%{opacity:1}}`}</style>
      <nav style={{ position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 24px",borderBottom:`1px solid ${BORD}`,background:"rgba(3,5,15,0.92)",backdropFilter:"blur(18px)" }}>
        <NavLogo />
        <button className="btn btn-primary" onClick={() => router.push("/test")}>Take the test</button>
      </nav>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px 80px" }}>
        <header style={{ textAlign: "center", marginBottom: 36 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: CYAN, marginBottom: 10 }}>Country leaderboard</p>
          <h1 style={{ fontSize: "clamp(28px,6vw,42px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 14 }}>
            Average IQ by country
          </h1>
          <p style={{ fontSize: 14, color: DIM, lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
            Each country&apos;s average from people who took RealIQTest and chose that country.
            {stats && <> Based on <strong style={{ color: TEXT }}>{total.toLocaleString()}</strong> tests.</>}
          </p>
        </header>

        {mine && myRank >= 0 && (
          <div style={{ marginBottom: 18, padding: "14px 18px", borderRadius: 12, border: `1px solid ${CYAN}`, background: "rgba(0,245,212,0.06)", fontSize: 14, textAlign: "center" }}>
            {flag(mine)} <strong>{ranked[myRank].name}</strong> is <strong style={{ color: CYAN }}>#{myRank + 1}</strong> of {ranked.length} with an average of <strong>{ranked[myRank].avg}</strong>.
          </div>
        )}

        {error && (
          <div style={{ padding: 18, borderRadius: 12, border: "1px solid rgba(251,113,133,0.4)", color: "#FB7185", textAlign: "center", fontSize: 14 }}>
            The leaderboard could not load. Please refresh the page.
          </div>
        )}

        {!stats && !error && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ height: 56, borderRadius: 12, background: CARD, border: `1px solid ${BORD}`, animation: "lbPulse 1.6s ease-in-out infinite", animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        )}

        {stats && ranked.length === 0 && (
          <div style={{ padding: 24, borderRadius: 12, background: CARD, border: `1px solid ${BORD}`, textAlign: "center", color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            No country has {MIN_TESTS_FOR_RANK} tests yet. Take the test and pick your country to put it on the board.
          </div>
        )}

        {ranked.length > 0 && (
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {ranked.map((s, i) => {
              const me = s.code === mine;
              return (
                <li key={s.code} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 12,
                  background: me ? "rgba(0,245,212,0.07)" : CARD, border: `1px solid ${me ? CYAN : BORD}`,
                  animation: "lbIn .45s ease both", animationDelay: `${Math.min(i, 15) * 40}ms`,
                }}>
                  <span style={{ width: 30, textAlign: "right", fontWeight: 800, fontVariantNumeric: "tabular-nums", color: i === 0 ? GOLD : i < 3 ? CYAN : DIM }}>{i + 1}</span>
                  <span style={{ fontSize: 24, lineHeight: 1 }} aria-hidden="true">{flag(s.code)}</span>
                  <div style={{ flex: "0 1 170px", minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}{me && <span style={{ color: CYAN, fontWeight: 500 }}> · you</span>}</div>
                    <div style={{ fontSize: 11, color: DIM }}>{s.count.toLocaleString()} test{s.count === 1 ? "" : "s"}</div>
                  </div>
                  <Bar avg={s.avg} />
                  <span style={{ width: 52, textAlign: "right", fontSize: 18, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{s.avg.toFixed(1)}</span>
                </li>
              );
            })}
          </ol>
        )}

        {pending.length > 0 && (
          <p style={{ marginTop: 18, fontSize: 12, color: DIM, lineHeight: 1.7 }}>
            Not ranked yet (fewer than {MIN_TESTS_FOR_RANK} tests): {pending.map(p => `${flag(p.code)} ${p.name}`).join(" · ")}
          </p>
        )}

        <p style={{ marginTop: 28, fontSize: 11, color: "#6A88AA", lineHeight: 1.7 }}>
          These averages only reflect people who chose to take an online test on this site. They are not a scientific measure of any country&apos;s intelligence.
        </p>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button className="btn btn-primary" onClick={() => router.push("/test")}>Add your score for your country →</button>
        </div>
      </main>
    </div>
  );
}
