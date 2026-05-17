"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { calculateIQ, getIQLabel, getPercentile, getCategoryResults } from "@/lib/iq-calculator";

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const B    = "#0055FF";
const CYAN = "#06B6D4";
const PURP = "#8B5CF6";
const GOLD = "#F59E0B";
const GRN  = "#10B981";
const ROSE = "#FB7185";
const BG   = "#020617";
const GLASS = "rgba(6,14,40,0.78)";
const BORD  = "rgba(0,85,255,0.22)";
const DIM_C = "#8AABCC";
const TEXT  = "#E2EEFF";

const DIM_COLORS  = [B, PURP, CYAN, GOLD, GRN, ROSE];
const RADAR_CATS  = ["Logic","Verbal","Spatial","Numerical","Memory","Speed"];

function iqGradient(v: number) {
  if (v >= 130) return "linear-gradient(135deg,#FFD700 0%,#FFA500 55%,#FF6B00 100%)";
  if (v >= 120) return "linear-gradient(135deg,#A78BFA 0%,#6366F1 45%,#0055FF 100%)";
  if (v >= 110) return "linear-gradient(135deg,#0055FF 0%,#06B6D4 100%)";
  if (v >= 100) return "linear-gradient(135deg,#06B6D4 0%,#0055FF 100%)";
  return              "linear-gradient(135deg,#3B82F6 0%,#64748B 100%)";
}
function iqGlow(v: number) {
  if (v >= 130) return "0 0 80px rgba(255,180,0,0.35), 0 0 160px rgba(255,120,0,0.15)";
  if (v >= 120) return "0 0 80px rgba(139,92,246,0.35), 0 0 160px rgba(99,102,241,0.15)";
  return              "0 0 80px rgba(0,85,255,0.35), 0 0 160px rgba(6,182,212,0.15)";
}

/* ─── Neural network background ─────────────────────────────────────────────── */
function NeuralBg() {
  const nodes = [
    {x:10,y:15},{x:25,y:8},{x:45,y:20},{x:65,y:5},{x:82,y:18},{x:93,y:10},
    {x:5,y:40},{x:30,y:35},{x:55,y:42},{x:76,y:30},{x:92,y:46},
    {x:15,y:62},{x:40,y:55},{x:62,y:68},{x:85,y:58},
    {x:20,y:82},{x:50,y:76},{x:72,y:87},{x:95,y:72},{x:8,y:92},
    {x:35,y:25},{x:58,y:30},{x:78,y:50},{x:22,y:50},
  ];
  const conns = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[0,6],[1,7],[2,7],[2,8],[3,8],[4,9],[5,10],
    [6,11],[7,11],[7,12],[8,12],[8,13],[9,13],[9,14],[10,14],[11,15],[12,15],
    [12,16],[13,16],[13,17],[14,17],[14,18],[15,19],[0,20],[1,20],[2,21],[3,21],
    [4,22],[9,22],[6,23],[7,23],
  ];
  return (
    <svg aria-hidden="true" style={{ position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,opacity:0.4 }}
      viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <defs>
        <style>{`
          @keyframes np{0%,100%{opacity:0.25}50%{opacity:0.9}}
          @keyframes nl{0%,100%{opacity:0.05}50%{opacity:0.2}}
          .nn{animation:np 3.5s ease-in-out infinite}
          .nc{animation:nl 4.5s ease-in-out infinite}
        `}</style>
        <radialGradient id="nbg" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#0055FF" stopOpacity="0.25"/>
          <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.06"/>
          <stop offset="100%" stopColor="#020617" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#nbg)"/>
      {conns.map(([a,b],i)=>(
        <line key={i} className="nc"
          x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke={i%3===0?"#06B6D4":i%3===1?"#0055FF":"#8B5CF6"} strokeWidth="0.12"
          style={{animationDelay:`${(i*0.19)%4.5}s`}}/>
      ))}
      {nodes.map((n,i)=>(
        <circle key={i} className="nn" cx={n.x} cy={n.y} r="0.45"
          fill={i%3===0?"#4F8EFF":i%3===1?"#A78BFA":"#22D3EE"}
          style={{animationDelay:`${(i*0.25)%3.5}s`}}/>
      ))}
    </svg>
  );
}

/* ─── Section header ─────────────────────────────────────────────────────────── */
function SectionH({ title, accent }: { title:string; accent?:string }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:22}}>
      <h2 style={{
        fontSize:"clamp(15px,2.5vw,19px)",fontWeight:800,letterSpacing:"-0.02em",
        background:accent||`linear-gradient(90deg,${B},${CYAN})`,
        WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
        backgroundClip:"text",margin:0,whiteSpace:"nowrap",
      }}>{title}</h2>
      <div style={{flex:1,height:1,background:`linear-gradient(90deg,${BORD},transparent)`}}/>
    </div>
  );
}

/* ─── Glass card ─────────────────────────────────────────────────────────────── */
function Card({ children, style, glow, delay }: {
  children:React.ReactNode; style?:React.CSSProperties; glow?:string; delay?:number;
}) {
  return (
    <div className="animate-fade-up" style={{
      background:GLASS,
      border:`1px solid ${glow ? glow+"44" : BORD}`,
      backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
      borderRadius:14,
      boxShadow:glow
        ?`0 0 28px ${glow}18,0 4px 32px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.06)`
        :`0 4px 32px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.04)`,
      animationDelay:delay?`${delay}ms`:"0ms",
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── Animated progress bar ─────────────────────────────────────────────────── */
function AnimBar({ pct, color, delay=200 }: { pct:number; color:string; delay?:number }) {
  const [w, setW] = useState(0);
  useEffect(()=>{ const t=setTimeout(()=>setW(pct),delay); return()=>clearTimeout(t); },[pct,delay]);
  return (
    <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:99,overflow:"hidden"}}>
      <div style={{
        height:"100%",borderRadius:99,
        background:`linear-gradient(90deg,${color},${color}aa)`,
        boxShadow:`0 0 10px ${color}66`,
        width:`${w}%`,
        transition:"width 1.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}/>
    </div>
  );
}

/* ─── No fake leaderboard data — only real user entries ─────────────────────── */

/* ─── Career SVG icons (simple, consistent) ──────────────────────────────────── */
function CIcon({ i }: { i:number }) {
  const paths = [
    "M9 3h6M12 3v4M8 21l-2-4H3l2-4H3l4-6h10l4 6h-2l2 4h-3l-2 4H8z",
    "M12 2C8.5 2 6 4.5 6 8c0 2.5 1.5 4.5 3.5 5.5L9 22h6l-.5-8.5C16.5 12.5 18 10.5 18 8c0-3.5-2.5-6-6-6z",
    "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",
    "M3 3v18h18M7 16l5-5 3 3 5-6",
    "M12 4l8 4-8 4-8-4 8-4zM4 8v8M20 8v8M8 10v8c0 0 2 2 4 2s4-2 4-2v-8",
    "M12 2a7 7 0 100 14A7 7 0 0012 2zM12 16v6M8 22h8",
    "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3l-4 4-4-4",
    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  ];
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[i % paths.length]}/>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════════════════ */
function ReportInner() {
  const router      = useRouter();
  const searchParams= useSearchParams();

  /* payment / screen state — UNTOUCHED */
  const [screen,  setScreen]  = useState<"pay"|"processing"|"verifying"|"report">("pay");
  const [email,   setEmail]   = useState("");
  const [card,    setCard]    = useState("");
  const [expiry,  setExpiry]  = useState("");
  const [cvc,     setCvc]     = useState("");
  const [name,    setName]    = useState("");
  const [consent, setConsent] = useState(false);
  const [errors,  setErrors]  = useState<Record<string,boolean>>({});
  const [verifyError,setVerifyError] = useState("");

  /* IQ state */
  const [iq,         setIq]         = useState(0);
  const [label,      setLabel]      = useState("");
  const [percentile, setPercentile] = useState(0);
  const [catResults, setCatResults] = useState<ReturnType<typeof getCategoryResults>>([]);

  /* animated counter */
  const [displayIq, setDisplayIq] = useState(0);

  /* Load IQ from localStorage */
  useEffect(()=>{
    const s  = parseInt(localStorage.getItem("iq_score")||"0");
    const t  = parseInt(localStorage.getItem("iq_total")||"30");
    const cs = JSON.parse(localStorage.getItem("iq_catScores")||"[0,0,0,0,0,0]");
    const ct = JSON.parse(localStorage.getItem("iq_catTotals")||"[0,0,0,0,0,0]");
    const v  = calculateIQ(s,t);
    setIq(v); setLabel(getIQLabel(v)); setPercentile(getPercentile(v));
    setCatResults(getCategoryResults(v,cs,ct));
  },[]);

  /* Detect Stripe return */
  useEffect(()=>{
    const success    = searchParams.get("success");
    const session_id = searchParams.get("session_id");
    if (success==="true" && session_id) {
      setScreen("verifying");
      fetch("/api/verify-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({session_id})})
        .then(r=>r.json())
        .then(d=>{
          if(d.paid){
            localStorage.setItem("report_paid",session_id);
            setScreen("report");
          } else { setVerifyError(d.error||"Payment could not be verified."); setScreen("pay"); }
        })
        .catch(()=>{ setVerifyError("Network error verifying payment."); setScreen("pay"); });
      return;
    }
    if(localStorage.getItem("report_paid")) setScreen("report");
  },[searchParams]);

  /* Count-up animation when report shown */
  useEffect(()=>{
    if(screen!=="report"||iq===0) return;
    const start = Math.max(60, iq-35);
    setDisplayIq(start);
    let cur = start;
    const step = Math.max(1, Math.ceil((iq-start)/50));
    const t = setInterval(()=>{
      cur += step;
      if(cur>=iq){ setDisplayIq(iq); clearInterval(t); return; }
      setDisplayIq(cur);
    }, 28);
    return ()=>clearInterval(t);
  },[screen,iq]);

  /* Save leaderboard entry when report unlocks */
  useEffect(()=>{
    if(screen!=="report"||iq===0) return;
    const existing = JSON.parse(localStorage.getItem("lb_entry")||"null");
    if(!existing){
      localStorage.setItem("lb_entry", JSON.stringify({ iq, date: new Date().toISOString() }));
    }
  },[screen,iq]);

  function formatCard(v:string)  { return v.replace(/\D/g,"").substring(0,16).replace(/(.{4})/g,"$1 ").trim(); }
  function formatExpiry(v:string){ const n=v.replace(/\D/g,""); return n.length>=2?n.substring(0,2)+" / "+n.substring(2,4):n; }

  async function handlePay(){
    const e:Record<string,boolean>={};
    if(!email) e.email=true;
    if(card.length<19) e.card=true;
    if(!consent) e.consent=true;
    setErrors(e);
    if(Object.keys(e).length) return;
    setScreen("processing");
    try{
      const res  = await fetch("/api/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});
      const data = await res.json();
      if(data.url){ window.location.href=data.url; } else { setScreen("pay"); }
    } catch{ setScreen("pay"); }
  }

  /* Shared card/input styles for pay screen */
  const payCard: React.CSSProperties = {
    background:"rgba(5,18,45,0.80)",border:`1px solid ${BORD}`,
    backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",borderRadius:6,
  };
  const inputSt: React.CSSProperties = {
    background:"rgba(5,18,45,0.9)",border:`1px solid ${BORD}`,
    borderRadius:4,padding:"10px 14px",fontSize:13,color:"#D6E4FF",
    outline:"none",width:"100%",fontFamily:"inherit",
  };

  /* ── Verifying ─────────────────────────────────────────────────────────────── */
  if(screen==="verifying") return (
    <div style={{minHeight:"100dvh",background:BG,color:TEXT,display:"flex",flexDirection:"column"}}>
      <NeuralBg/>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 24px",borderBottom:`1px solid ${BORD}`,background:"rgba(2,6,23,0.9)",zIndex:10,position:"relative"}}>
        <span style={{fontSize:16,fontWeight:700}}>Real<span style={{color:B}}>IQ</span>Test</span>
        <span style={{fontSize:11,color:DIM_C}}>Verifying payment...</span>
      </nav>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"0 24px",position:"relative",zIndex:1}}>
        <div>
          <div className="animate-spin" style={{width:52,height:52,border:`2px solid ${BORD}`,borderTopColor:B,borderRadius:"50%",margin:"0 auto 24px"}}/>
          <h3 style={{fontSize:22,fontWeight:600,marginBottom:8}}>Confirming your payment</h3>
          <p style={{fontSize:13,color:DIM_C}}>Verifying with Stripe — this takes just a moment...</p>
        </div>
      </div>
    </div>
  );

  /* ── Processing ────────────────────────────────────────────────────────────── */
  if(screen==="processing") return (
    <div style={{minHeight:"100dvh",background:BG,color:TEXT,display:"flex",flexDirection:"column"}}>
      <NeuralBg/>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 24px",borderBottom:`1px solid ${BORD}`,background:"rgba(2,6,23,0.9)",zIndex:10,position:"relative"}}>
        <span style={{fontSize:16,fontWeight:700}}>Real<span style={{color:B}}>IQ</span>Test</span>
        <span style={{fontSize:11,color:DIM_C}}>Redirecting to secure payment...</span>
      </nav>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"0 24px",position:"relative",zIndex:1}}>
        <div className="animate-fade-up">
          <div className="animate-spin" style={{width:52,height:52,border:`2px solid ${BORD}`,borderTopColor:B,borderRadius:"50%",margin:"0 auto 24px"}}/>
          <h3 style={{fontSize:22,fontWeight:600,marginBottom:8}}>Connecting to Stripe</h3>
          <p style={{fontSize:13,color:DIM_C}}>You will be redirected to the secure payment page...</p>
        </div>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════════════════════
     PREMIUM REPORT SCREEN
  ══════════════════════════════════════════════════════════════════════════════ */
  if(screen==="report"){
    const careers = ({
      "Genius":       ["Research Scientist","Neurosurgeon","Aerospace Engineer","Theoretical Physicist","Philosophy Professor"],
      "Very Superior":["Software Architect","Medical Doctor","Financial Analyst","Lawyer","University Professor"],
      "Superior":     ["Engineer","Data Scientist","Psychologist","Architect","Journalist"],
      "High Average": ["Teacher","Nurse","Marketing Manager","Project Manager","Accountant"],
      "Average":      ["Technician","Sales Manager","Designer","Police Officer","Chef"],
      "Low Average":  ["Logistics Coordinator","Administrative Assistant","Customer Service","Retail Manager","Driver"],
      "Below Average":["Warehouse Operative","Delivery Driver","Cleaner","Cashier","Factory Worker"],
    } as Record<string,string[]>)[label] || ["Engineer","Designer","Analyst","Manager","Specialist"];

    const famous = ({
      "Genius":       [{name:"Stephen Hawking",iq:160,field:"Physics"},{name:"Elon Musk",iq:155,field:"Tech/Business"}],
      "Very Superior":[{name:"Bill Gates",iq:160,field:"Tech"},{name:"Barack Obama",iq:137,field:"Politics"}],
      "Superior":     [{name:"Arnold Schwarzenegger",iq:135,field:"Actor/Politician"},{name:"Quentin Tarantino",iq:160,field:"Cinema"}],
      "High Average": [{name:"Average College Graduate",iq:115,field:"Various"},{name:"Most Professionals",iq:112,field:"Various"}],
      "Average":      [{name:"Average Adult",iq:100,field:"General Population"},{name:"High School Graduate",iq:98,field:"Education"}],
      "Low Average":  [{name:"Below Average Graduate",iq:88,field:"General"},{name:"General Population Low",iq:85,field:"General"}],
      "Below Average":[{name:"General Population",iq:78,field:"General"},{name:"Basic Skills Level",iq:75,field:"General"}],
    } as Record<string,{name:string;iq:number;field:string}[]>)[label] || [];

    const TIPS: Record<string,string> = {
      "Logical Reasoning":  "Practice daily logic puzzles and Sudoku. Apps like Lumosity or BrainHQ target this directly.",
      "Verbal Intelligence":"Read widely — fiction, non-fiction, news. Learn 5 new words per week. Crosswords help.",
      "Spatial Reasoning":  "Play 3D puzzle games like Tetris or Monument Valley. Practice mental rotation exercises.",
      "Numerical Ability":  "Practice mental arithmetic daily. Challenge yourself with percentage calculations.",
      "Working Memory":     "Try the dual n-back exercise (brainworkshop.net). Memorise lists without writing them.",
      "Processing Speed":   "Play reaction-based games. Practice timed arithmetic. Speed reading exercises help.",
    };

    const pctFill = Math.round(((iq-70)/80)*100);
    const radarValues = catResults.map(c=>Math.round(((c.iq-70)/80)*100));
    const cx=160, cy=160, R=110;
    const angles = RADAR_CATS.map((_,i)=>(i*60-90)*(Math.PI/180));
    const pts = radarValues.map((v,i)=>({
      x: cx+(R*v/100)*Math.cos(angles[i]),
      y: cy+(R*v/100)*Math.sin(angles[i]),
    }));
    const polyPoints = pts.map(p=>`${p.x},${p.y}`).join(" ");
    const gridPts = (p:number)=>angles.map(a=>`${cx+R*p*Math.cos(a)},${cy+R*p*Math.sin(a)}`).join(" ");

    /* Leaderboard: only the real user's entry */
    const userEntry = { country:"You", iq, h:"just now", isUser:true };

    return (
      <div style={{minHeight:"100dvh",background:BG,color:TEXT,overflowX:"hidden"}}>
        <NeuralBg/>
        <style>{`
          @keyframes scoreGlow{0%,100%{filter:drop-shadow(0 0 20px rgba(0,85,255,0.4))}50%{filter:drop-shadow(0 0 40px rgba(6,182,212,0.6))}}
          @keyframes borderPulse{0%,100%{border-color:rgba(0,85,255,0.22)}50%{border-color:rgba(0,85,255,0.55)}}
          @keyframes radarDraw{from{opacity:0;transform:scale(0.05);transform-origin:160px 160px}to{opacity:1;transform:scale(1);transform-origin:160px 160px}}
          @keyframes dotPop{from{r:0;opacity:0}to{opacity:1}}
          .radar-poly{animation:radarDraw 1s cubic-bezier(0.34,1.56,0.64,1) 0.2s both}
          .radar-dot{animation:dotPop 0.4s ease-out both}
          .score-num{animation:scoreGlow 3s ease-in-out infinite}
          .lb-card{transition:transform 200ms,box-shadow 200ms}
          .lb-card:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,85,255,0.2)!important}
          .career-item{transition:background 200ms,border-color 200ms,transform 150ms}
          .career-item:hover{background:rgba(0,85,255,0.12)!important;border-color:rgba(0,85,255,0.4)!important;transform:translateX(4px)}
        `}</style>

        {/* ── Nav ─────────────────────────────────────────────────────────── */}
        <nav style={{position:"sticky",top:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"14px 28px",borderBottom:`1px solid ${BORD}`,
          background:"rgba(2,6,23,0.92)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}}>
          <span style={{fontSize:17,fontWeight:800,letterSpacing:"-0.03em"}}>Real<span style={{color:B}}>IQ</span>Test</span>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:GRN,boxShadow:`0 0 8px ${GRN}`}}/>
            <span style={{fontSize:10,color:GRN,letterSpacing:"0.14em",fontWeight:600,textTransform:"uppercase"}}>Premium Report Unlocked</span>
          </div>
        </nav>

        <div style={{maxWidth:700,margin:"0 auto",padding:"60px 20px 80px",position:"relative",zIndex:1}}>

          {/* ── HERO: IQ Score ──────────────────────────────────────────────── */}
          <div className="animate-fade-up" style={{textAlign:"center",marginBottom:56,paddingBottom:48,
            borderBottom:`1px solid ${BORD}`}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 16px",
              background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.3)",
              borderRadius:99,marginBottom:20}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span style={{fontSize:10,color:GRN,letterSpacing:"0.18em",fontWeight:700,textTransform:"uppercase"}}>Full Premium Report</span>
            </div>

            {/* Giant score with gradient */}
            <div className="score-num" style={{
              fontSize:"clamp(100px,20vw,148px)",fontWeight:900,lineHeight:1,
              background:iqGradient(iq),
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
              textShadow:"none",
              filter:"drop-shadow(0 0 40px rgba(0,85,255,0.4))",
              letterSpacing:"-0.04em",
            }}>{displayIq}</div>

            <p style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:DIM_C,marginTop:4}}>Intelligence Quotient</p>

            {/* Label badge */}
            <div style={{
              display:"inline-block",marginTop:18,padding:"8px 28px",
              background:`linear-gradient(135deg,${B}22,${CYAN}22)`,
              border:`1px solid ${B}55`,borderRadius:6,
              fontSize:12,letterSpacing:"0.16em",textTransform:"uppercase",fontWeight:700,
              background2:iqGradient(iq),
              color:TEXT,
            } as React.CSSProperties}>{label}</div>

            {/* Progress bar */}
            <div style={{maxWidth:380,margin:"24px auto 0"}}>
              <AnimBar pct={pctFill} color={B} delay={600}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:DIM_C,marginTop:6}}>
                <span>70</span><span style={{color:TEXT}}>Average (100)</span><span>145+</span>
              </div>
            </div>
          </div>

          {/* ── Percentile ──────────────────────────────────────────────────── */}
          <div className="animate-fade-up" style={{marginBottom:40,animationDelay:"60ms"}}>
            <SectionH title="Global Percentile Rank"/>
            <Card glow={CYAN} style={{padding:32,textAlign:"center"}}>
              <div style={{
                fontSize:"clamp(56px,10vw,80px)",fontWeight:900,lineHeight:1,
                background:`linear-gradient(135deg,${CYAN},${B})`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
                letterSpacing:"-0.04em",
              }}>{percentile}<span style={{fontSize:"clamp(24px,4vw,36px)",opacity:0.7}}>th</span></div>
              <p style={{fontSize:12,color:DIM_C,marginTop:10,lineHeight:1.7}}>
                You scored higher than <strong style={{color:TEXT}}>{percentile}%</strong> of the global population<br/>based on standardised IQ distribution norms.
              </p>
              <div style={{maxWidth:320,margin:"24px auto 0"}}>
                <AnimBar pct={pctFill} color={CYAN} delay={400}/>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:DIM_C,marginTop:6}}>
                  <span>1st</span><span>50th</span><span>99th</span>
                </div>
              </div>
            </Card>
          </div>

          {/* ── Radar chart ─────────────────────────────────────────────────── */}
          <div className="animate-fade-up" style={{marginBottom:40,animationDelay:"120ms"}}>
            <SectionH title="Cognitive Radar" accent={`linear-gradient(90deg,${PURP},${CYAN})`}/>
            <Card glow={PURP} style={{padding:"28px 24px",display:"flex",flexDirection:"column",alignItems:"center"}}>
              <svg width="320" height="320" viewBox="0 0 320 320">
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={B} stopOpacity="0.25"/>
                    <stop offset="100%" stopColor={PURP} stopOpacity="0.1"/>
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                {/* Grid rings */}
                {[0.25,0.5,0.75,1].map((p,i)=>(
                  <polygon key={i} points={gridPts(p)} fill="none"
                    stroke={`rgba(0,85,255,${i===3?0.18:0.08})`} strokeWidth={i===3?"0.8":"0.5"}
                    strokeDasharray={i===3?"none":"2 2"}/>
                ))}
                {/* Axis lines */}
                {angles.map((a,i)=>(
                  <line key={i} x1={cx} y1={cy} x2={cx+R*Math.cos(a)} y2={cy+R*Math.sin(a)}
                    stroke={`${DIM_COLORS[i]}30`} strokeWidth="0.8"/>
                ))}
                {/* Filled polygon */}
                <polygon className="radar-poly" points={polyPoints}
                  fill="url(#rg)" stroke="none"/>
                <polygon className="radar-poly" points={polyPoints}
                  fill="none" stroke={`url(#rg)`}
                  strokeWidth="2.5" strokeLinejoin="round" filter="url(#glow)"
                  style={{stroke:B}}/>
                {/* Dots colored per dimension */}
                {pts.map((p,i)=>(
                  <circle key={i} className="radar-dot" cx={p.x} cy={p.y} r="5"
                    fill={DIM_COLORS[i]}
                    style={{animationDelay:`${0.5+i*0.1}s`,filter:`drop-shadow(0 0 6px ${DIM_COLORS[i]})`}}/>
                ))}
                {/* Labels */}
                {RADAR_CATS.map((lab,i)=>{
                  const lx=cx+(R+22)*Math.cos(angles[i]);
                  const ly=cy+(R+22)*Math.sin(angles[i]);
                  return(
                    <g key={i}>
                      <text x={lx} y={ly-6} textAnchor="middle" dominantBaseline="middle"
                        fill={DIM_COLORS[i]} fontSize="9.5" fontFamily="Inter,sans-serif" fontWeight="700"
                        letterSpacing="0.05em">{lab}</text>
                      {catResults[i] && (
                        <text x={lx} y={ly+7} textAnchor="middle" dominantBaseline="middle"
                          fill={`${DIM_COLORS[i]}99`} fontSize="8" fontFamily="Inter,sans-serif">{catResults[i].iq}</text>
                      )}
                    </g>
                  );
                })}
              </svg>
              {/* Legend */}
              <div style={{display:"flex",flexWrap:"wrap",gap:"8px 16px",justifyContent:"center",marginTop:8}}>
                {RADAR_CATS.map((lab,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:DIM_COLORS[i],boxShadow:`0 0 6px ${DIM_COLORS[i]}`}}/>
                    <span style={{fontSize:10,color:DIM_C}}>{lab}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* ── Dimension breakdown ─────────────────────────────────────────── */}
          <div style={{marginBottom:40}}>
            <SectionH title="Breakdown by Dimension"/>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {catResults.map((cat,i)=>(
                <Card key={i} glow={DIM_COLORS[i]} delay={i*60} style={{padding:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:DIM_COLORS[i],
                        boxShadow:`0 0 10px ${DIM_COLORS[i]}`}}/>
                      <span style={{fontSize:14,fontWeight:700,letterSpacing:"-0.01em"}}>{cat.name}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{
                        fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",
                        padding:"3px 10px",borderRadius:99,fontWeight:700,
                        ...(cat.badge==="strong"
                          ?{background:"rgba(16,185,129,0.12)",color:GRN,border:`1px solid ${GRN}44`}
                          :cat.badge==="avg"
                            ?{background:`rgba(0,85,255,0.1)`,color:B,border:`1px solid ${BORD}`}
                            :{background:"rgba(251,113,133,0.1)",color:ROSE,border:"1px solid rgba(251,113,133,0.3)"}),
                      }}>
                        {cat.badge==="strong"?"Strength":cat.badge==="avg"?"Average":"Develop"}
                      </span>
                      <span style={{
                        fontSize:26,fontWeight:900,
                        background:`linear-gradient(135deg,${DIM_COLORS[i]},${DIM_COLORS[(i+2)%6]})`,
                        WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
                      }}>{cat.iq}</span>
                    </div>
                  </div>
                  <AnimBar pct={Math.round(((cat.iq-70)/80)*100)} color={DIM_COLORS[i]} delay={300+i*80}/>
                  <p style={{fontSize:12,color:DIM_C,lineHeight:1.7,marginTop:10}}>{cat.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* ── PREMIUM LEADERBOARD ─────────────────────────────────────────── */}
          <div style={{marginBottom:40}}>
            <SectionH title="Premium Intelligence Board" accent={`linear-gradient(90deg,${GOLD},#FF9500)`}/>

            {/* User's own entry */}
            <div className="animate-fade-up" style={{
              display:"flex",alignItems:"center",gap:14,padding:"16px 20px",
              background:`linear-gradient(135deg,rgba(245,158,11,0.14),rgba(255,149,0,0.06))`,
              border:`1px solid rgba(245,158,11,0.5)`,borderRadius:10,marginBottom:16,
              boxShadow:`0 0 20px rgba(245,158,11,0.1)`,
            }}>
              <div style={{
                width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                background:`linear-gradient(135deg,${GOLD},#FFA500)`,fontSize:12,fontWeight:800,color:BG,flexShrink:0,
                boxShadow:`0 0 10px ${GOLD}66`,
              }}>1</div>
              <div style={{flex:1}}>
                <p style={{fontSize:14,fontWeight:700,color:GOLD,marginBottom:2}}>You — just now</p>
                <p style={{fontSize:11,color:DIM_C}}>Your verified cognitive assessment</p>
              </div>
              <div style={{
                fontSize:22,fontWeight:900,
                background:`linear-gradient(135deg,${GOLD},#FDE68A)`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
              }}>IQ {userEntry.iq}</div>
            </div>

            {/* Empty state */}
            <div style={{
              textAlign:"center",padding:"32px 24px",
              background:"rgba(6,14,40,0.4)",border:`1px solid ${BORD}`,borderRadius:10,
            }}>
              <p style={{fontSize:13,color:DIM_C,lineHeight:1.7,marginBottom:4}}>
                Be the first to complete the test and claim your spot on the Intelligence Board.
              </p>
              <p style={{fontSize:11,color:"#8AABCC"}}>Board populates as more premium assessments are completed.</p>
            </div>
          </div>

          {/* ── Career matches ──────────────────────────────────────────────── */}
          <div style={{marginBottom:40}}>
            <SectionH title="Best Career Matches"/>
            <Card style={{padding:24}}>
              <p style={{fontSize:12,color:DIM_C,marginBottom:18,lineHeight:1.7}}>
                Based on your cognitive profile, these careers align strongest with your intellectual strengths:
              </p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
                {careers.map((career,i)=>(
                  <div key={i} className="career-item" style={{
                    display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                    background:"rgba(0,85,255,0.06)",border:`1px solid ${BORD}`,
                    borderRadius:8,cursor:"default",
                  }}>
                    <div style={{color:DIM_COLORS[i%6],flexShrink:0}}><CIcon i={i}/></div>
                    <span style={{fontSize:12,fontWeight:500}}>{career}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* ── Improvement tips ────────────────────────────────────────────── */}
          <div style={{marginBottom:40}}>
            <SectionH title="How to Improve" accent={`linear-gradient(90deg,${GRN},${CYAN})`}/>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {catResults.map((cat,i)=>(
                <Card key={i} delay={i*50} style={{padding:18}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:DIM_COLORS[i],
                      boxShadow:`0 0 8px ${DIM_COLORS[i]}`,flexShrink:0}}/>
                    <span style={{fontSize:13,fontWeight:700,
                      background:`linear-gradient(90deg,${DIM_COLORS[i]},${DIM_COLORS[(i+1)%6]})`,
                      WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
                    }}>{cat.name}</span>
                  </div>
                  <p style={{fontSize:12,color:DIM_C,lineHeight:1.7}}>{TIPS[cat.name]}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* ── Famous comparisons ──────────────────────────────────────────── */}
          <div style={{marginBottom:40}}>
            <SectionH title="IQ Comparisons"/>
            <Card style={{padding:24}}>
              <p style={{fontSize:12,color:DIM_C,marginBottom:18}}>Notable figures with a similar IQ range:</p>
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {famous.map((f,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                    padding:"14px 0",borderBottom:`1px solid ${BORD}`}}>
                    <div>
                      <p style={{fontSize:13,fontWeight:600}}>{f.name}</p>
                      <p style={{fontSize:11,color:DIM_C}}>{f.field}</p>
                    </div>
                    <div style={{
                      fontSize:22,fontWeight:900,
                      background:iqGradient(f.iq),
                      WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
                    }}>~{f.iq}</div>
                  </div>
                ))}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"14px 16px",marginTop:10,
                  background:`linear-gradient(135deg,${B}12,${CYAN}06)`,
                  border:`1px solid ${B}33`,borderRadius:8}}>
                  <div>
                    <p style={{fontSize:13,fontWeight:700,
                      background:`linear-gradient(90deg,${B},${CYAN})`,
                      WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
                    }}>You</p>
                    <p style={{fontSize:11,color:DIM_C}}>RealIQTest result</p>
                  </div>
                  <div style={{
                    fontSize:28,fontWeight:900,
                    background:iqGradient(iq),
                    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
                  }}>{iq}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* ── Certificate ─────────────────────────────────────────────────── */}
          <div style={{marginBottom:40}}>
            <SectionH title="Official Certificate" accent={`linear-gradient(90deg,${GOLD},#FDE68A)`}/>
            <div className="animate-fade-up" style={{
              background:`linear-gradient(135deg,rgba(6,14,40,0.9),rgba(10,20,55,0.9))`,
              border:`1px solid rgba(245,158,11,0.35)`,borderRadius:16,
              padding:"52px 40px",textAlign:"center",position:"relative",overflow:"hidden",
              boxShadow:`0 0 60px rgba(245,158,11,0.08),0 0 120px rgba(0,85,255,0.06)`,
            }}>
              {/* Corner ornaments */}
              {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],i)=>(
                <div key={i} style={{
                  position:"absolute",[v]:16,[h]:16,width:44,height:44,
                  [`border${v.charAt(0).toUpperCase()+v.slice(1)}`]:"none",
                  borderLeft: h==="left"?"1.5px solid rgba(245,158,11,0.5)":"none",
                  borderRight:h==="right"?"1.5px solid rgba(245,158,11,0.5)":"none",
                  borderTop:  v==="top"?"1.5px solid rgba(245,158,11,0.5)":"none",
                  borderBottom:v==="bottom"?"1.5px solid rgba(245,158,11,0.5)":"none",
                }}/>
              ))}
              {/* Watermark glow */}
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
                width:200,height:200,borderRadius:"50%",
                background:`radial-gradient(circle,${GOLD}06,transparent 70%)`,
                pointerEvents:"none"}}/>

              <p style={{fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",color:DIM_C,marginBottom:16}}>
                RealIQTest · Official Certificate of Intelligence Assessment
              </p>
              <p style={{fontSize:15,color:TEXT,marginBottom:14,fontWeight:300}}>This certifies an IQ score of</p>
              <div style={{
                fontSize:"clamp(72px,14vw,100px)",fontWeight:900,lineHeight:1,
                background:iqGradient(iq),
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
                letterSpacing:"-0.04em",filter:`drop-shadow(0 0 30px ${GOLD}44)`,
              }}>{iq}</div>
              <div style={{
                display:"inline-block",marginTop:16,padding:"8px 32px",
                background:`linear-gradient(135deg,${GOLD}22,${GOLD}08)`,
                border:`1px solid ${GOLD}44`,borderRadius:4,
                fontSize:13,letterSpacing:"0.18em",textTransform:"uppercase",
                fontWeight:700,color:GOLD,
              }}>{label}</div>
              <p style={{fontSize:10,color:DIM_C,marginTop:24,lineHeight:1.7}}>
                Top {100-percentile}% of global population<br/>
                {new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})} · RealIQTest.co
              </p>
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:12,marginTop:20}}>
              <button className="btn btn-outline" style={{fontSize:11,cursor:"pointer"}} onClick={()=>window.print()}>
                ↓ Download / Print PDF
              </button>
              <button onClick={()=>router.push("/test")} className="btn btn-primary" style={{cursor:"pointer"}}>
                Take Test Again
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════════════════════
     PAY SCREEN — UNCHANGED LOGIC, slightly polished
  ══════════════════════════════════════════════════════════════════════════════ */
  return (
    <div style={{minHeight:"100dvh",background:BG,color:TEXT}}>
      <NeuralBg/>
      <nav style={{position:"relative",zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"16px 24px",borderBottom:`1px solid ${BORD}`,
        background:"rgba(2,6,23,0.95)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}}>
        <span style={{fontSize:16,fontWeight:800}}>Real<span style={{color:B}}>IQ</span>Test</span>
        <span style={{fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:DIM_C}}>Secure Checkout</span>
      </nav>

      <div style={{maxWidth:980,margin:"0 auto",padding:"48px 20px",display:"grid",
        gridTemplateColumns:"1fr",gap:40,position:"relative",zIndex:1}}
        className="report-grid">
        <style>{`@media(min-width:768px){.report-grid{grid-template-columns:1fr 1fr!important}}`}</style>

        {/* Left: benefits */}
        <div className="animate-fade-up">
          <p style={{fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:B,marginBottom:12,fontWeight:700}}>Premium Cognitive Report</p>
          <h1 style={{fontSize:"clamp(24px,4vw,36px)",fontWeight:800,letterSpacing:"-0.03em",lineHeight:1.2,marginBottom:16}}>
            Unlock your complete{" "}
            <span style={{background:`linear-gradient(90deg,${B},${CYAN})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
              intelligence profile
            </span>
          </h1>
          <p style={{fontSize:13,color:DIM_C,lineHeight:1.8,marginBottom:28}}>
            Your free result shows your overall IQ. The premium report gives you everything — detailed breakdown, career matches, improvement tips, famous comparisons and your official certificate.
          </p>

          {verifyError && (
            <div style={{padding:"12px 16px",borderRadius:8,background:"rgba(251,113,133,0.08)",
              border:"1px solid rgba(251,113,133,0.3)",color:ROSE,fontSize:12,marginBottom:20,lineHeight:1.5}}>
              <strong>Payment verification failed:</strong> {verifyError}
              <br/><span style={{color:DIM_C}}>If you were charged, please contact support@realiqtest.co</span>
            </div>
          )}

          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
            {[
              "Full breakdown across all 6 cognitive categories",
              "Cognitive radar chart — visualise your mind",
              "Percentile rank vs global population norms",
              "Premium Intelligence Leaderboard",
              "Best career matches for your IQ profile",
              "Personalised tips to improve each category",
              "Famous IQ comparisons",
              "Official downloadable PDF certificate",
            ].map((item,i)=>(
              <div key={i} className="animate-fade-up" style={{
                display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                background:GLASS,border:`1px solid ${BORD}`,borderRadius:8,
                animationDelay:`${i*40}ms`,
              }}>
                <div style={{width:20,height:20,minWidth:20,borderRadius:"50%",
                  background:"rgba(16,185,129,0.12)",border:"1px solid rgba(16,185,129,0.3)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:GRN,flexShrink:0}}>✓</div>
                <span style={{fontSize:13}}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap",fontSize:11,color:DIM_C}}>
            <span>SSL Encrypted</span><span>·</span><span>Instant access</span><span>·</span><span>No subscription</span>
          </div>
        </div>

        {/* Right: payment form */}
        <div className="animate-scale-in" style={{...payCard,overflow:"hidden",animationDelay:"120ms",borderRadius:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
            padding:"20px 24px",borderBottom:`1px solid ${BORD}`}}>
            <div>
              <p style={{fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:DIM_C,marginBottom:6}}>Premium Report — One time</p>
              <div style={{display:"flex",alignItems:"baseline",gap:10}}>
                <span style={{fontSize:13,textDecoration:"line-through",color:"#6A88AA"}}>€9.99</span>
                <span style={{fontSize:32,fontWeight:800,
                  background:`linear-gradient(135deg,${B},${CYAN})`,
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
                }}>€1.99</span>
                <span style={{fontSize:9,background:"rgba(16,185,129,0.12)",color:GRN,
                  border:"1px solid rgba(16,185,129,0.3)",padding:"3px 8px",borderRadius:99}}>-80%</span>
              </div>
            </div>
            <div style={{display:"flex",gap:6}}>
              {["VISA","MC","AMEX"].map(c=>(
                <span key={c} style={{fontSize:9,padding:"4px 8px",background:"rgba(0,85,255,0.08)",
                  border:`1px solid ${BORD}`,borderRadius:4,color:DIM_C}}>{c}</span>
              ))}
            </div>
          </div>
          <div style={{padding:24,display:"flex",flexDirection:"column",gap:16}}>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <label style={{fontSize:9,letterSpacing:"0.16em",textTransform:"uppercase",color:DIM_C}}>Email address</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com"
                style={{...inputSt,borderColor:errors.email?"#FB7185":BORD}}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <label style={{fontSize:9,letterSpacing:"0.16em",textTransform:"uppercase",color:DIM_C}}>Card number</label>
              <input value={card} onChange={e=>setCard(formatCard(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19}
                style={{...inputSt,borderColor:errors.card?"#FB7185":BORD}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <label style={{fontSize:9,letterSpacing:"0.16em",textTransform:"uppercase",color:DIM_C}}>Expiry</label>
                <input value={expiry} onChange={e=>setExpiry(formatExpiry(e.target.value))} placeholder="MM / YY" maxLength={7} style={inputSt}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <label style={{fontSize:9,letterSpacing:"0.16em",textTransform:"uppercase",color:DIM_C}}>CVC</label>
                <input value={cvc} onChange={e=>setCvc(e.target.value)} placeholder="123" maxLength={3} style={inputSt}/>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <label style={{fontSize:9,letterSpacing:"0.16em",textTransform:"uppercase",color:DIM_C}}>Name on card</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={inputSt}/>
            </div>
            <label style={{display:"flex",alignItems:"flex-start",gap:10,padding:12,borderRadius:8,cursor:"pointer",
              border:`1px solid ${errors.consent?"#FB7185":BORD}`,
              background:errors.consent?"rgba(251,113,133,0.05)":"rgba(0,85,255,0.05)"}}>
              <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} style={{marginTop:2,accentColor:B}}/>
              <span style={{fontSize:11,color:DIM_C,lineHeight:1.5}}>
                <strong style={{color:TEXT}}>I understand this is a digital product with immediate access.</strong>{" "}
                Refunds are only available in case of a technical error preventing access.
              </span>
            </label>
            <button onClick={handlePay} className="btn btn-primary" style={{width:"100%",cursor:consent?"pointer":"not-allowed",opacity:consent?1:0.4}}>
              Pay €1.99 — Unlock Premium Report
            </button>
            <p style={{textAlign:"center",fontSize:10,color:"#6A88AA"}}>Powered by Stripe · Your card data is never stored</p>
            <p style={{textAlign:"center",fontSize:10,color:"#6A88AA"}}>No subscription · One-time payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Suspense wrapper ───────────────────────────────────────────────────────── */
export default function ReportPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight:"100dvh",background:BG,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div className="animate-spin" style={{width:44,height:44,border:"2px solid rgba(0,85,255,0.18)",borderTopColor:"#0055FF",borderRadius:"50%"}}/>
      </div>
    }>
      <ReportInner/>
    </Suspense>
  );
}
