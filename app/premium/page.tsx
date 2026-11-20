"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NavLogo from "@/app/components/NavLogo";
import { fetchAccess, startCheckout, type AccessInfo } from "@/lib/stripe";
import { loadHistory, loadStoredResult, type HistoryEntry } from "@/lib/stored-result";
import { loadDaily, streak, todayKey } from "@/lib/daily";

const BG = "#03050F", BLUE = "#5B4FFF", CYAN = "#00F5D4", TEXT = "#E8E8F0", DIM = "#8AABCC";
const BORD = "rgba(91,79,255,0.22)", CARD = "rgba(5,18,45,0.75)", ROSE = "#FB7185";

function HistoryChart({ data }: { data: HistoryEntry[] }) {
  if (data.length < 2) {
    return <p style={{ fontSize:13,color:DIM,lineHeight:1.6 }}>Your chart appears after your second test. Re-take the test next month to see your progress.</p>;
  }
  const W = 560, H = 180, pl = 36, pr = 16, pt = 16, pb = 28;
  const ys = data.map(d => d.iq);
  const lo = Math.min(...ys) - 5, hi = Math.max(...ys) + 5;
  const x = (i: number) => pl + (i / (data.length - 1)) * (W - pl - pr);
  const y = (v: number) => pt + (1 - (v - lo) / (hi - lo)) * (H - pt - pb);
  const path = data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d.iq).toFixed(1)}`).join(" ");
  const ticks = [lo + 5, Math.round((lo + hi) / 2), hi - 5];
  return (
    <div style={{ overflowX:"auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth:320,display:"block" }} role="img" aria-label="IQ history chart">
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pl} x2={W - pr} y1={y(t)} y2={y(t)} stroke="rgba(91,79,255,0.15)" />
            <text x={pl - 6} y={y(t) + 3} fontSize="10" fill={DIM} textAnchor="end">{Math.round(t)}</text>
          </g>
        ))}
        <path d={`${path} L${x(data.length - 1)},${H - pb} L${x(0)},${H - pb} Z`} fill="rgba(91,79,255,0.12)" />
        <path d={path} fill="none" stroke={CYAN} strokeWidth="2" />
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(d.iq)} r={i === data.length - 1 ? 5 : 3} fill={i === data.length - 1 ? CYAN : BLUE} />
            {(i === 0 || i === data.length - 1) && (
              <text x={x(i)} y={H - 8} fontSize="10" fill={DIM} textAnchor={i === 0 ? "start" : "end"}>
                {new Date(d.date).toLocaleDateString()}
              </text>
            )}
          </g>
        ))}
        <text x={x(data.length - 1)} y={y(data[data.length - 1].iq) - 10} fontSize="12" fontWeight="700" fill={CYAN} textAnchor="end">{data[data.length - 1].iq}</text>
      </svg>
    </div>
  );
}

function PremiumInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [access, setAccess] = useState<AccessInfo | null>(null);
  const [status, setStatus] = useState<"loading" | "verifying" | "ready">("loading");
  const [msg, setMsg] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [days, setDays] = useState(0);
  const [doneToday, setDoneToday] = useState(false);
  const [lastIq, setLastIq] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
    const st = loadDaily();
    setDays(streak(st));
    setDoneToday(st.done[todayKey()] !== undefined);
    setLastIq(loadStoredResult()?.iq ?? null);

    const sessionId = params.get("session_id");
    const restore = params.get("restore");
    if (restore === "invalid") setMsg("That access link is not valid.");
    if (restore === "inactive") setMsg("That subscription is no longer active.");

    async function load() {
      if (sessionId) {
        setStatus("verifying");
        try {
          const r = await fetch("/api/verify-payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: sessionId }) });
          const d = await r.json();
          if (d.paid) setMsg("Welcome to Premium! Your subscription is active.");
          else setMsg(d.error || "We could not confirm your subscription yet. Refresh in a minute.");
        } catch { setMsg("Network error while confirming your subscription."); }
        router.replace("/premium");
      }
      setAccess(await fetchAccess());
      setStatus("ready");
    }
    load();
  }, [params, router]);

  async function subscribe() {
    setBusy(true); setMsg("");
    try { await startCheckout("premium"); } catch { setMsg("Could not open the secure checkout. Please try again."); setBusy(false); }
  }

  async function manage() {
    setBusy(true); setMsg("");
    try {
      const r = await fetch("/api/portal", { method: "POST" });
      const d = await r.json();
      if (d.url) { window.location.href = d.url; return; }
      setMsg(d.error || "Could not open subscription settings.");
    } catch { setMsg("Could not open subscription settings."); }
    setBusy(false);
  }

  async function copyLink() {
    if (!access?.accessLink) return;
    try { await navigator.clipboard.writeText(access.accessLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { setCopied(false); }
  }

  const [now, setNow] = useState(0);
  useEffect(() => { setNow(Date.now()); }, []);
  const last = history[history.length - 1];
  const daysSinceTest = last && now ? Math.floor((now - new Date(last.date).getTime()) / 86_400_000) : null;
  const card: React.CSSProperties = { background: CARD, border: `1px solid ${BORD}`, borderRadius: 12, padding: 20 };

  return (
    <div style={{ minHeight: "100dvh", background: BG, color: TEXT }}>
      <nav style={{ position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 24px",borderBottom:`1px solid ${BORD}`,background:"rgba(5,10,20,0.95)",backdropFilter:"blur(18px)" }}>
        <NavLogo />
        <span style={{ fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:DIM }}>Premium</span>
      </nav>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px 64px", display: "flex", flexDirection: "column", gap: 18 }}>
        {msg && <div role="status" style={{ ...card, borderColor: msg.startsWith("Welcome") ? CYAN : ROSE, color: msg.startsWith("Welcome") ? CYAN : ROSE, fontSize: 14 }}>{msg}</div>}

        {status !== "ready" ? (
          <div style={{ ...card, textAlign: "center", color: DIM }}>{status === "verifying" ? "Confirming your subscription with Stripe…" : "Loading…"}</div>
        ) : access?.premium ? (
          <>
            <header>
              <p style={{ fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:CYAN,marginBottom:8 }}>RealIQTest Premium</p>
              <h1 style={{ fontSize:"clamp(26px,5vw,36px)",fontWeight:800,letterSpacing:"-0.03em",lineHeight:1.15 }}>Your brain training area</h1>
              <p style={{ fontSize:13,color:DIM,marginTop:8 }}>
                {access.cancelAt
                  ? `Your subscription is cancelled and stays active until ${new Date(access.cancelAt).toLocaleDateString()}.`
                  : "Subscription active · €4.99/month · renews monthly"}
              </p>
            </header>

            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,220px),1fr))",gap:12 }}>
              <div style={card}>
                <p style={{ fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:DIM }}>Daily challenge</p>
                <p style={{ fontSize:30,fontWeight:800,marginTop:4 }}>{days} <span style={{ fontSize:13,fontWeight:500,color:DIM }}>day streak</span></p>
                <p style={{ fontSize:12,color:DIM,margin:"4px 0 14px" }}>{doneToday ? "Done for today. New puzzles tomorrow." : "3 new puzzles are waiting for you."}</p>
                <button className="btn btn-primary" style={{ width:"100%" }} onClick={() => router.push("/daily")}>{doneToday ? "Review today's puzzles" : "Play today's challenge"}</button>
              </div>
              <div style={card}>
                <p style={{ fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:DIM }}>Latest IQ</p>
                <p style={{ fontSize:30,fontWeight:800,marginTop:4 }}>{lastIq ?? "—"}</p>
                <p style={{ fontSize:12,color:DIM,margin:"4px 0 14px" }}>
                  {daysSinceTest === null ? "Take the test to start your history." : daysSinceTest >= 30 ? "It's been a month: time for a re-test." : `Last test ${daysSinceTest} day${daysSinceTest === 1 ? "" : "s"} ago. Re-test after 30 days for a fair comparison.`}
                </p>
                <button className="btn btn-outline" style={{ width:"100%" }} onClick={() => router.push("/test")}>Re-take the test</button>
              </div>
              <div style={card}>
                <p style={{ fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:DIM }}>Full report</p>
                <p style={{ fontSize:13,color:DIM,margin:"8px 0 14px",lineHeight:1.6 }}>Breakdown by area, improvement tips, career matches and your PDF certificate.</p>
                <button className="btn btn-outline" style={{ width:"100%" }} onClick={() => router.push("/report")}>Open my report</button>
              </div>
            </div>

            <section style={card} aria-label="IQ history">
              <p style={{ fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:DIM,marginBottom:12 }}>Your IQ history</p>
              <HistoryChart data={history} />
            </section>

            <section style={card} aria-label="Account">
              <p style={{ fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:DIM,marginBottom:10 }}>Subscription</p>
              <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
                <button className="btn btn-outline" onClick={manage} disabled={busy}>Cancel or manage subscription</button>
                {access.accessLink && <button className="btn btn-outline" onClick={copyLink}>{copied ? "Link copied" : "Copy my access link"}</button>}
              </div>
              <p style={{ fontSize:11,color:DIM,marginTop:10,lineHeight:1.6 }}>
                Your access link opens Premium on another phone or computer. Keep it private. Cancelling takes one click and you keep access until the end of the month you paid for.
              </p>
            </section>
          </>
        ) : (
          <>
            <header>
              <p style={{ fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:CYAN,marginBottom:8 }}>RealIQTest Premium</p>
              <h1 style={{ fontSize:"clamp(26px,5vw,36px)",fontWeight:800,letterSpacing:"-0.03em",lineHeight:1.15 }}>Train your brain and track your IQ over time</h1>
            </header>
            <div style={card}>
              <p style={{ fontSize:32,fontWeight:800 }}>€4.99<span style={{ fontSize:14,fontWeight:500,color:DIM }}> / month</span></p>
              <ul style={{ margin:"12px 0 18px",paddingLeft:18,display:"flex",flexDirection:"column",gap:6,fontSize:14,color:"#C4D8F0" }}>
                <li>Your exact IQ score and full report with PDF certificate</li>
                <li>A daily brain challenge with 3 new puzzles and streaks</li>
                <li>A monthly re-test to measure your progress</li>
                <li>Your IQ history chart</li>
              </ul>
              <button className="btn btn-primary" style={{ width:"100%" }} onClick={subscribe} disabled={busy}>{busy ? "Opening secure checkout…" : "Start Premium — €4.99/month"}</button>
              <p style={{ fontSize:11,color:DIM,marginTop:10,lineHeight:1.6 }}>Renews every month until you cancel. Cancel anytime in one click. Payment is handled securely by Stripe.</p>
            </div>
            <p style={{ fontSize:12,color:DIM }}>Already subscribed on another device? Open the access link from your Premium page there.</p>
          </>
        )}
      </main>
    </div>
  );
}

export default function PremiumPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100dvh", background: BG }} />}>
      <PremiumInner />
    </Suspense>
  );
}
