"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavLogo from "@/app/components/NavLogo";
import { fetchAccess } from "@/lib/stripe";
import { dailyPuzzles, loadDaily, saveDaily, streak, todayKey, type DailyPuzzle } from "@/lib/daily";

const BG = "#03050F", BLUE = "#5B4FFF", CYAN = "#00F5D4", TEXT = "#E8E8F0", DIM = "#8AABCC";
const BORD = "rgba(91,79,255,0.22)", CARD = "rgba(5,18,45,0.75)", GRN = "#10B981", ROSE = "#FB7185";

export default function DailyPage() {
  const router = useRouter();
  const [premium, setPremium] = useState<boolean | null>(null);
  const [puzzles, setPuzzles] = useState<DailyPuzzle[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [days, setDays] = useState(0);

  useEffect(() => {
    fetchAccess().then(a => setPremium(a.premium));
    setPuzzles(dailyPuzzles());
    const st = loadDaily();
    const today = st.done[todayKey()];
    if (today !== undefined) { setFinished(true); setCorrect(today); }
    setDays(streak(st));
  }, []);

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === puzzles[idx].answer) setCorrect(c => c + 1);
  }

  function next() {
    if (idx < puzzles.length - 1) { setIdx(idx + 1); setPicked(null); return; }
    const st = loadDaily();
    st.done[todayKey()] = correct;
    saveDaily(st);
    setDays(streak(st));
    setFinished(true);
  }

  const card: React.CSSProperties = { background: CARD, border: `1px solid ${BORD}`, borderRadius: 12, padding: 22 };
  const p = puzzles[idx];

  return (
    <div style={{ minHeight: "100dvh", background: BG, color: TEXT }}>
      <nav style={{ position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 24px",borderBottom:`1px solid ${BORD}`,background:"rgba(5,10,20,0.95)",backdropFilter:"blur(18px)" }}>
        <NavLogo />
        <span style={{ fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:DIM }}>Daily challenge</span>
      </nav>

      <main style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px 64px", display: "flex", flexDirection: "column", gap: 16 }}>
        <header>
          <p style={{ fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:CYAN,marginBottom:6 }}>{new Date().toLocaleDateString(undefined, { weekday:"long", day:"numeric", month:"long" })}</p>
          <h1 style={{ fontSize:"clamp(24px,5vw,32px)",fontWeight:800,letterSpacing:"-0.03em" }}>Today&apos;s brain challenge</h1>
          <p style={{ fontSize:13,color:DIM,marginTop:6 }}>3 quick puzzles every day · current streak: <strong style={{ color:TEXT }}>{days} day{days === 1 ? "" : "s"}</strong></p>
        </header>

        {premium === null ? (
          <div style={{ ...card, color: DIM, textAlign: "center" }}>Loading…</div>
        ) : !premium ? (
          <div style={card}>
            <p style={{ fontSize:16,fontWeight:700,marginBottom:8 }}>The daily challenge is part of Premium</p>
            <p style={{ fontSize:13,color:DIM,lineHeight:1.6,marginBottom:16 }}>Every day you get 3 new logic, number and letter puzzles, with explanations and a streak counter.</p>
            <button className="btn btn-primary" style={{ width:"100%" }} onClick={() => router.push("/premium")}>See Premium — €4.99/month</button>
          </div>
        ) : finished ? (
          <div style={card}>
            <p style={{ fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:DIM }}>Done for today</p>
            <p style={{ fontSize:40,fontWeight:800,margin:"6px 0" }}>{correct} / {puzzles.length || 3}</p>
            <p style={{ fontSize:13,color:DIM,marginBottom:16 }}>Come back tomorrow for 3 new puzzles and keep your {days}-day streak going.</p>
            <button className="btn btn-outline" style={{ width:"100%" }} onClick={() => router.push("/premium")}>Back to my Premium area</button>
          </div>
        ) : p ? (
          <div style={card}>
            <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:DIM,marginBottom:14 }}>
              <span>Puzzle {idx + 1} of {puzzles.length}</span><span>{correct} correct</span>
            </div>
            <p style={{ fontSize:16,fontWeight:700,marginBottom:14 }}>{p.prompt}</p>
            {p.display && (
              <pre style={{ whiteSpace:"pre-wrap",fontFamily:"var(--font-geist-mono), ui-monospace, monospace",fontSize:20,textAlign:"center",padding:"18px 12px",background:"rgba(91,79,255,0.08)",border:`1px solid ${BORD}`,borderRadius:10,marginBottom:16,lineHeight:1.7,overflowX:"auto" }}>{p.display}</pre>
            )}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
              {p.options.map((o, i) => {
                const isAnswer = i === p.answer, isPicked = i === picked;
                const border = picked === null ? BORD : isAnswer ? GRN : isPicked ? ROSE : BORD;
                return (
                  <button key={i} id={`opt-${i}`} onClick={() => choose(i)} disabled={picked !== null}
                    style={{ padding:"16px 10px",fontSize:20,fontWeight:700,color:TEXT,background:picked !== null && isAnswer ? "rgba(16,185,129,0.12)" : "rgba(5,18,45,0.9)",border:`1.5px solid ${border}`,borderRadius:10,cursor:picked === null ? "pointer" : "default" }}>
                    {o}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div style={{ marginTop:16 }}>
                <p role="status" style={{ fontSize:14,fontWeight:700,color:picked === p.answer ? GRN : ROSE }}>{picked === p.answer ? "Correct!" : `Not quite. The answer is ${p.options[p.answer]}.`}</p>
                <p style={{ fontSize:13,color:DIM,marginTop:4 }}>{p.explain}</p>
                <button className="btn btn-primary" style={{ width:"100%",marginTop:14,background:BLUE }} onClick={next}>{idx < puzzles.length - 1 ? "Next puzzle →" : "Finish today's challenge"}</button>
              </div>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}
