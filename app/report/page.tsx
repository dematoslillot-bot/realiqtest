"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateIQ, getIQLabel, getPercentile, getCategoryResults } from "@/lib/iq-calculator";

export default function ReportPage() {
  const router  = useRouter();
  const [screen, setScreen] = useState<"pay" | "processing" | "report">("pay");
  const [email,   setEmail]   = useState("");
  const [card,    setCard]    = useState("");
  const [expiry,  setExpiry]  = useState("");
  const [cvc,     setCvc]     = useState("");
  const [name,    setName]    = useState("");
  const [consent, setConsent] = useState(false);
  const [errors,  setErrors]  = useState<Record<string, boolean>>({});
  const [iq,      setIq]      = useState(0);
  const [label,   setLabel]   = useState("");
  const [percentile, setPercentile] = useState(0);
  const [catResults, setCatResults] = useState<ReturnType<typeof getCategoryResults>>([]);

  useEffect(() => {
    const s  = parseInt(localStorage.getItem("iq_score") || "0");
    const t  = parseInt(localStorage.getItem("iq_total") || "30");
    const cs = JSON.parse(localStorage.getItem("iq_catScores") || "[0,0,0,0,0,0]");
    const ct = JSON.parse(localStorage.getItem("iq_catTotals") || "[0,0,0,0,0,0]");
    const iqVal = calculateIQ(s, t);
    setIq(iqVal); setLabel(getIQLabel(iqVal)); setPercentile(getPercentile(iqVal));
    setCatResults(getCategoryResults(iqVal, cs, ct));
  }, []);

  function formatCard(v: string)   { return v.replace(/\D/g,"").substring(0,16).replace(/(.{4})/g,"$1 ").trim(); }
  function formatExpiry(v: string) { const n=v.replace(/\D/g,""); return n.length>=2?n.substring(0,2)+" / "+n.substring(2,4):n; }

  async function handlePay() {
    const e: Record<string, boolean> = {};
    if (!email)         e.email   = true;
    if (card.length<19) e.card    = true;
    if (!consent)       e.consent = true;
    setErrors(e);
    if (Object.keys(e).length) return;
    setScreen("processing");
    try {
      const res  = await fetch("/api/checkout", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; } else { setScreen("pay"); }
    } catch { setScreen("pay"); }
  }

  const pctFill = Math.round(((iq - 70) / 80) * 100);
  const blue   = "#0055FF";
  const blue2  = "rgba(0,85,255,0.18)";
  const dim    = "#3A5A8A";

  const CAREERS: Record<string,string[]> = {
    "Genius":       ["Research Scientist","Neurosurgeon","Aerospace Engineer","Theoretical Physicist","Philosophy Professor"],
    "Very Superior":["Software Architect","Medical Doctor","Financial Analyst","Lawyer","University Professor"],
    "Superior":     ["Engineer","Data Scientist","Psychologist","Architect","Journalist"],
    "High Average": ["Teacher","Nurse","Marketing Manager","Project Manager","Accountant"],
    "Average":      ["Technician","Sales Manager","Designer","Police Officer","Chef"],
    "Low Average":  ["Logistics Coordinator","Administrative Assistant","Customer Service","Retail Manager","Driver"],
    "Below Average":["Warehouse Operative","Delivery Driver","Cleaner","Cashier","Factory Worker"],
  };
  const FAMOUS: Record<string,{name:string;iq:number;field:string}[]> = {
    "Genius":       [{name:"Stephen Hawking",iq:160,field:"Physics"},{name:"Elon Musk",iq:155,field:"Tech/Business"}],
    "Very Superior":[{name:"Bill Gates",iq:160,field:"Tech"},{name:"Barack Obama",iq:137,field:"Politics"}],
    "Superior":     [{name:"Arnold Schwarzenegger",iq:135,field:"Actor/Politician"},{name:"Quentin Tarantino",iq:160,field:"Cinema"}],
    "High Average": [{name:"Average College Graduate",iq:115,field:"Various"},{name:"Most Professionals",iq:112,field:"Various"}],
    "Average":      [{name:"Average Adult",iq:100,field:"General Population"},{name:"High School Graduate",iq:98,field:"Education"}],
    "Low Average":  [{name:"Below Average Graduate",iq:88,field:"General"},{name:"General Population Low",iq:85,field:"General"}],
    "Below Average":[{name:"General Population",iq:78,field:"General"},{name:"Basic Skills Level",iq:75,field:"General"}],
  };
  const TIPS: Record<string,string> = {
    "Logical Reasoning":  "Practice daily logic puzzles and Sudoku. Apps like Lumosity or BrainHQ target this. Try one logic problem per day.",
    "Verbal Intelligence":"Read widely — fiction, non-fiction, news. Learn 5 new words per week. Crosswords and word association games help.",
    "Spatial Reasoning":  "Play 3D puzzle games like Tetris or Monument Valley. Practice mental rotation exercises and sketching.",
    "Numerical Ability":  "Practice mental arithmetic daily. Challenge yourself with percentage calculations in everyday situations.",
    "Working Memory":     "Try the dual n-back exercise (free at brainworkshop.net). Memorise phone numbers or shopping lists without writing.",
    "Processing Speed":   "Play reaction-based games. Practice timed arithmetic. Speed reading exercises also help.",
  };
  const RADAR_CATS = ["Logic","Verbal","Spatial","Numerical","Memory","Speed"];

  const cardStyle: React.CSSProperties = {
    background: "rgba(5,18,45,0.80)", border: `1px solid ${blue2}`,
    backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
    borderRadius: 6,
  };
  const inputStyle: React.CSSProperties = {
    background: "rgba(5,18,45,0.9)", border: `1px solid ${blue2}`,
    borderRadius: 4, padding: "10px 14px",
    fontSize: 13, color: "#D6E4FF",
    outline: "none", width: "100%",
    fontFamily: "inherit",
  };

  if (screen === "processing") {
    return (
      <div style={{ minHeight: "100dvh", background: "#050A14", color: "#D6E4FF", display: "flex", flexDirection: "column" }}>
        <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 24px", borderBottom:`1px solid ${blue2}`, background:"rgba(5,10,20,0.95)" }}>
          <span style={{ fontSize:16, fontWeight:600 }}>Real<span style={{color:blue}}>IQ</span>Test</span>
          <span style={{ fontSize:11, color:dim }}>Redirecting to secure payment...</span>
        </nav>
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"0 24px" }}>
          <div className="animate-fade-up">
            <div style={{ width:48, height:48, border:`2px solid ${blue2}`, borderTopColor:blue, borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 24px" }}
              className="animate-spin" />
            <h3 style={{ fontSize:22, fontWeight:300, marginBottom:8 }}>Connecting to Stripe</h3>
            <p style={{ fontSize:13, color:dim }}>You will be redirected to the secure payment page...</p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "report") {
    const careers = CAREERS[label] || CAREERS["Average"];
    const famous  = FAMOUS[label]  || FAMOUS["Average"];
    const radarValues = catResults.map(c => Math.round(((c.iq - 70) / 80) * 100));
    const cx=160, cy=160, r=108;
    const angles = RADAR_CATS.map((_,i) => (i*60-90)*(Math.PI/180));
    const pts = radarValues.map((v,i) => ({
      x: cx+(r*v/100)*Math.cos(angles[i]),
      y: cy+(r*v/100)*Math.sin(angles[i]),
    }));
    const polyPoints = pts.map(p=>`${p.x},${p.y}`).join(" ");
    const gridPts = (pct: number) => angles.map(a=>`${cx+r*pct*Math.cos(a)},${cy+r*pct*Math.sin(a)}`).join(" ");

    return (
      <div style={{ minHeight:"100dvh", background:"#050A14", color:"#D6E4FF" }}>
        <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 24px", borderBottom:`1px solid ${blue2}`, background:"rgba(5,10,20,0.95)" }}>
          <span style={{ fontSize:16, fontWeight:600 }}>Real<span style={{color:blue}}>IQ</span>Test</span>
          <span style={{ fontSize:10, color:"#00D87A", letterSpacing:"0.12em" }}>✓ Premium Report Unlocked</span>
        </nav>
        <div style={{ maxWidth:640, margin:"0 auto", padding:"48px 20px" }}>

          {/* Score header */}
          <div className="animate-fade-up" style={{ textAlign:"center", marginBottom:48, paddingBottom:40, borderBottom:`1px solid ${blue2}` }}>
            <p style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"#00D87A", marginBottom:16 }}>✓ Full Premium Report — Unlocked</p>
            <div style={{ fontSize:96, fontWeight:300, color:blue, lineHeight:1, textShadow:`0 0 50px rgba(0,85,255,0.4)` }}>{iq}</div>
            <p style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:dim, marginTop:8 }}>Intelligence Quotient</p>
            <div style={{ display:"inline-block", marginTop:14, border:`1px solid ${blue}`, color:blue, padding:"6px 20px", fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase" }}>{label}</div>
            <div style={{ maxWidth:340, margin:"20px auto 0" }}>
              <div style={{ height:4, background:blue2, borderRadius:2, overflow:"hidden" }}>
                <div className="progress-neon" style={{ height:"100%", width:`${pctFill}%`, transition:"width 1.4s ease", borderRadius:2 }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:dim, marginTop:6 }}>
                <span>70</span><span>Average (100)</span><span>145+</span>
              </div>
            </div>
          </div>

          {/* Percentile */}
          <div className="animate-fade-up" style={{ marginBottom:36, animationDelay:"80ms" }}>
            <h2 style={{ fontSize:16, fontWeight:500, marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
              Global percentile rank<span style={{ flex:1, height:1, background:blue2, display:"block" }} />
            </h2>
            <div style={{ ...cardStyle, padding:24, textAlign:"center" }}>
              <div style={{ fontSize:60, fontWeight:300, color:blue, textShadow:`0 0 30px rgba(0,85,255,0.4)` }}>{percentile}<span style={{ fontSize:24, color:dim }}>th</span></div>
              <p style={{ fontSize:12, color:dim, marginTop:8 }}>percentile — based on standardised IQ distribution norms</p>
              <div style={{ height:4, background:blue2, borderRadius:2, overflow:"hidden", marginTop:20 }}>
                <div className="progress-neon" style={{ height:"100%", width:`${pctFill}%`, transition:"width 1.2s ease", borderRadius:2 }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:dim, marginTop:6 }}>
                <span>1st</span><span>50th</span><span>99th</span>
              </div>
            </div>
          </div>

          {/* Radar chart */}
          <div className="animate-fade-up" style={{ marginBottom:36, animationDelay:"140ms" }}>
            <h2 style={{ fontSize:16, fontWeight:500, marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
              Cognitive radar<span style={{ flex:1, height:1, background:blue2, display:"block" }} />
            </h2>
            <div style={{ ...cardStyle, padding:24, display:"flex", justifyContent:"center" }}>
              <svg width="320" height="320" viewBox="0 0 320 320">
                <defs>
                  <style>{`
                    @keyframes radar-grow { from{opacity:0;transform:scale(0.1);transform-origin:160px 160px} to{opacity:1;transform:scale(1);transform-origin:160px 160px} }
                    .radar-shape{animation:radar-grow 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.3s both}
                    .radar-dot  {animation:radar-grow 0.5s ease-out both}
                  `}</style>
                </defs>
                {[0.25,0.5,0.75,1].map((p,i)=>(
                  <polygon key={i} points={gridPts(p)} fill="none" stroke="rgba(0,85,255,0.12)" strokeWidth="0.5" />
                ))}
                {angles.map((a,i)=>(
                  <line key={i} x1={cx} y1={cy} x2={cx+r*Math.cos(a)} y2={cy+r*Math.sin(a)} stroke="rgba(0,85,255,0.1)" strokeWidth="0.5" />
                ))}
                <polygon className="radar-shape" points={polyPoints}
                  fill="rgba(0,85,255,0.12)" stroke="#0055FF" strokeWidth="2" strokeLinejoin="round" />
                {pts.map((p,i)=>(
                  <circle key={i} className="radar-dot" cx={p.x} cy={p.y} r="4" fill="#0055FF"
                    style={{ animationDelay:`${0.3+i*0.08}s`, filter:"drop-shadow(0 0 4px rgba(0,85,255,0.8))" }} />
                ))}
                {RADAR_CATS.map((lab,i)=>{
                  const lx=cx+(r+24)*Math.cos(angles[i]);
                  const ly=cy+(r+24)*Math.sin(angles[i]);
                  return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#5A78A8" fontSize="10" fontFamily="Inter,sans-serif">{lab}</text>;
                })}
                {radarValues.map((v,i)=>{
                  const lx=cx+(r*v/100*0.65)*Math.cos(angles[i]);
                  const ly=cy+(r*v/100*0.65)*Math.sin(angles[i]);
                  return v>20 ? <text key={`v${i}`} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="rgba(0,85,255,0.7)" fontSize="8" fontFamily="Inter,sans-serif">{catResults[i]?.iq}</text> : null;
                })}
              </svg>
            </div>
          </div>

          {/* Category breakdown */}
          <div style={{ marginBottom:36 }}>
            <h2 style={{ fontSize:16, fontWeight:500, marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
              Breakdown by category<span style={{ flex:1, height:1, background:blue2, display:"block" }} />
            </h2>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {catResults.map((cat,i)=>(
                <div key={i} className="animate-fade-up" style={{ ...cardStyle, padding:16, animationDelay:`${200+i*55}ms` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <span style={{ fontSize:13, fontWeight:500 }}>{cat.name}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{
                        fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", padding:"3px 8px", borderRadius:2,
                        ...(cat.badge==="strong"
                          ? {background:"rgba(0,216,122,0.1)", color:"#00D87A", border:"1px solid rgba(0,216,122,0.3)"}
                          : cat.badge==="avg"
                            ? {background:"rgba(0,85,255,0.1)", color:blue, border:`1px solid ${blue2}`}
                            : {background:"rgba(255,59,59,0.1)", color:"#FF3B3B", border:"1px solid rgba(255,59,59,0.3)"}),
                      }}>
                        {cat.badge==="strong"?"Strength":cat.badge==="avg"?"Average":"Develop"}
                      </span>
                      <span style={{ fontSize:20, fontWeight:300, color:blue }}>{cat.iq}</span>
                    </div>
                  </div>
                  <div style={{ height:3, background:blue2, borderRadius:2, marginBottom:8 }}>
                    <div className="progress-neon" style={{ height:"100%", borderRadius:2, width:`${Math.round(((cat.iq-70)/80)*100)}%` }} />
                  </div>
                  <p style={{ fontSize:12, color:dim, lineHeight:1.6 }}>{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How to improve */}
          <div style={{ marginBottom:36 }}>
            <h2 style={{ fontSize:16, fontWeight:500, marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
              How to improve<span style={{ flex:1, height:1, background:blue2, display:"block" }} />
            </h2>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {catResults.map((cat,i)=>(
                <div key={i} className="animate-fade-up" style={{ ...cardStyle, padding:14, animationDelay:`${i*50}ms` }}>
                  <p style={{ fontSize:12, fontWeight:500, color:blue, marginBottom:6 }}>{cat.name}</p>
                  <p style={{ fontSize:12, color:dim, lineHeight:1.6 }}>{TIPS[cat.name]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Career matches */}
          <div style={{ marginBottom:36 }}>
            <h2 style={{ fontSize:16, fontWeight:500, marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
              Best career matches<span style={{ flex:1, height:1, background:blue2, display:"block" }} />
            </h2>
            <div style={{ ...cardStyle, padding:20 }}>
              <p style={{ fontSize:12, color:dim, marginBottom:14, lineHeight:1.6 }}>Based on your IQ profile, these careers typically align well with your intellectual capabilities:</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
                {careers.map((career,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13 }}>
                    <span style={{ color:blue }}>→</span><span>{career}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Famous comparisons */}
          <div style={{ marginBottom:36 }}>
            <h2 style={{ fontSize:16, fontWeight:500, marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
              IQ comparisons<span style={{ flex:1, height:1, background:blue2, display:"block" }} />
            </h2>
            <div style={{ ...cardStyle, padding:20 }}>
              <p style={{ fontSize:12, color:dim, marginBottom:14 }}>People with a similar IQ range:</p>
              <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                {famous.map((f,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid ${blue2}` }}>
                    <div>
                      <p style={{ fontSize:13, fontWeight:500 }}>{f.name}</p>
                      <p style={{ fontSize:11, color:dim }}>{f.field}</p>
                    </div>
                    <div style={{ fontSize:20, fontWeight:300, color:blue }}>~{f.iq}</div>
                  </div>
                ))}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", marginTop:8, background:"rgba(0,85,255,0.08)", borderRadius:4 }}>
                  <div>
                    <p style={{ fontSize:13, fontWeight:500, color:blue }}>You</p>
                    <p style={{ fontSize:11, color:dim }}>RealIQTest result</p>
                  </div>
                  <div style={{ fontSize:20, fontWeight:300, color:blue }}>{iq}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate */}
          <div style={{ marginBottom:36 }}>
            <h2 style={{ fontSize:16, fontWeight:500, marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
              Certificate<span style={{ flex:1, height:1, background:blue2, display:"block" }} />
            </h2>
            <div style={{ ...cardStyle, padding:48, textAlign:"center", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:12, left:12, width:40, height:40, borderLeft:`1px solid rgba(0,85,255,0.4)`, borderTop:`1px solid rgba(0,85,255,0.4)` }} />
              <div style={{ position:"absolute", top:12, right:12, width:40, height:40, borderRight:`1px solid rgba(0,85,255,0.4)`, borderTop:`1px solid rgba(0,85,255,0.4)` }} />
              <div style={{ position:"absolute", bottom:12, left:12, width:40, height:40, borderLeft:`1px solid rgba(0,85,255,0.4)`, borderBottom:`1px solid rgba(0,85,255,0.4)` }} />
              <div style={{ position:"absolute", bottom:12, right:12, width:40, height:40, borderRight:`1px solid rgba(0,85,255,0.4)`, borderBottom:`1px solid rgba(0,85,255,0.4)` }} />
              <p style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:dim, marginBottom:12 }}>RealIQTest · Official Certificate</p>
              <p style={{ fontSize:16, marginBottom:8 }}>This certifies an IQ score of</p>
              <div style={{ fontSize:68, fontWeight:300, color:blue, lineHeight:1, textShadow:`0 0 30px rgba(0,85,255,0.4)` }}>{iq}</div>
              <p style={{ fontSize:16, marginTop:8 }}>{label}</p>
              <p style={{ fontSize:10, color:dim, marginTop:20 }}>
                Top {100-percentile}% of global population · {new Date().toLocaleDateString("en-GB",{month:"long",year:"numeric"})} · RealIQTest.co
              </p>
            </div>
            <div style={{ display:"flex", justifyContent:"center", gap:10, marginTop:16 }}>
              <button className="btn btn-outline" style={{ fontSize:10 }}>↓ Download PDF</button>
              <button onClick={()=>router.push("/test")} className="btn btn-primary">Take Test Again</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Pay screen ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100dvh", background:"#050A14", color:"#D6E4FF" }}>
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 24px", borderBottom:`1px solid ${blue2}`, background:"rgba(5,10,20,0.95)" }}>
        <span style={{ fontSize:16, fontWeight:600 }}>Real<span style={{color:blue}}>IQ</span>Test</span>
        <span style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:dim }}>Secure Checkout</span>
      </nav>

      <div style={{ maxWidth:960, margin:"0 auto", padding:"48px 20px", display:"grid", gridTemplateColumns:"1fr", gap:40 }}
        className="report-grid">
        <style>{`@media(min-width:768px){.report-grid{grid-template-columns:1fr 1fr!important}}`}</style>

        {/* Left: benefits */}
        <div className="animate-fade-up">
          <p style={{ fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:blue, marginBottom:12 }}>Premium Cognitive Report</p>
          <h1 style={{ fontSize:"clamp(24px,4vw,34px)", fontWeight:300, letterSpacing:"-0.02em", lineHeight:1.25, marginBottom:16 }}>
            Unlock your complete <em style={{ color:blue, fontStyle:"normal" }}>intelligence profile</em>
          </h1>
          <p style={{ fontSize:13, color:dim, lineHeight:1.7, marginBottom:28 }}>
            Your free result shows your overall IQ. The premium report gives you everything — detailed breakdown, career matches, improvement tips, famous comparisons and your official certificate.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28 }}>
            {[
              "Full breakdown across all 6 cognitive categories",
              "Cognitive radar chart — visualise your mind",
              "Percentile rank vs global population norms",
              "Best career matches for your IQ profile",
              "Personalised tips to improve each category",
              "Famous IQ comparisons",
              "Official downloadable PDF certificate",
            ].map((item,i)=>(
              <div key={i} className="animate-fade-up" style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 12px", ...cardStyle, animationDelay:`${i*45}ms` }}>
                <div style={{ width:20, height:20, minWidth:20, borderRadius:"50%", background:"rgba(0,216,122,0.12)", border:"1px solid rgba(0,216,122,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#00D87A" }}>✓</div>
                <span style={{ fontSize:13 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap", fontSize:11, color:dim }}>
            <span>SSL Encrypted</span><span>·</span><span>Instant access</span><span>·</span><span>No subscription</span>
          </div>
        </div>

        {/* Right: payment form */}
        <div className="animate-scale-in" style={{ ...cardStyle, overflow:"hidden", animationDelay:"120ms" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px", borderBottom:`1px solid ${blue2}` }}>
            <div>
              <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:dim, marginBottom:6 }}>Premium Report — One time</p>
              <div style={{ display:"flex", alignItems:"baseline", gap:10 }}>
                <span style={{ fontSize:13, textDecoration:"line-through", color:"#1E3460" }}>€9.99</span>
                <span style={{ fontSize:32, fontWeight:300, color:blue }}>€1.99</span>
                <span style={{ fontSize:9, background:"rgba(0,216,122,0.12)", color:"#00D87A", border:"1px solid rgba(0,216,122,0.3)", padding:"3px 8px", borderRadius:2 }}>Save 50%</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {["VISA","MC","AMEX"].map(c=>(
                <span key={c} style={{ fontSize:9, padding:"4px 8px", background:"rgba(0,85,255,0.08)", border:`1px solid ${blue2}`, borderRadius:2, color:dim }}>{c}</span>
              ))}
            </div>
          </div>
          <div style={{ padding:24, display:"flex", flexDirection:"column", gap:16 }}>
            {/* Email */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:dim }}>Email address</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com"
                style={{ ...inputStyle, borderColor: errors.email ? "#FF3B3B" : blue2 }} />
            </div>
            {/* Card */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:dim }}>Card number</label>
              <input value={card} onChange={e=>setCard(formatCard(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19}
                style={{ ...inputStyle, borderColor: errors.card ? "#FF3B3B" : blue2 }} />
            </div>
            {/* Expiry + CVC */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <label style={{ fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:dim }}>Expiry</label>
                <input value={expiry} onChange={e=>setExpiry(formatExpiry(e.target.value))} placeholder="MM / YY" maxLength={7}
                  style={inputStyle} />
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <label style={{ fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:dim }}>CVC</label>
                <input value={cvc} onChange={e=>setCvc(e.target.value)} placeholder="123" maxLength={3}
                  style={inputStyle} />
              </div>
            </div>
            {/* Name */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:dim }}>Name on card</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"
                style={inputStyle} />
            </div>
            {/* Consent */}
            <label style={{
              display:"flex", alignItems:"flex-start", gap:10, padding:12, borderRadius:4, cursor:"pointer",
              border:`1px solid ${errors.consent ? "#FF3B3B" : blue2}`,
              background: errors.consent ? "rgba(255,59,59,0.05)" : "rgba(0,85,255,0.05)",
            }}>
              <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}
                style={{ marginTop:2, accentColor:blue }} />
              <span style={{ fontSize:11, color:dim, lineHeight:1.5 }}>
                <strong style={{ color:"#D6E4FF" }}>I understand this is a digital product with immediate access.</strong>{" "}
                Refunds are only available in case of a technical error preventing access.
              </span>
            </label>
            {/* Pay button */}
            <button onClick={handlePay} className="btn btn-primary"
              style={{ width:"100%", opacity: consent ? 1 : 0.4, cursor: consent ? "pointer" : "not-allowed" }}>
              Pay €1.99 — Unlock Premium Report
            </button>
            <p style={{ textAlign:"center", fontSize:10, color:"#1E3460" }}>Powered by Stripe · Your card data is never stored</p>
            <p style={{ textAlign:"center", fontSize:10, color:"#1E3460" }}>No subscription · One-time payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}
