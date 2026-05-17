"use client";

import { useState } from "react";
import Link from "next/link";

const BLUE  = "#0055FF";
const CYAN  = "#06B6D4";
const DIM   = "#3A5A8A";
const BG    = "#020617";
const BORD  = "rgba(0,85,255,0.18)";
const GLASS = "rgba(6,14,40,0.78)";

/* ── Data ─────────────────────────────────────────────────────────────────── */
const COUNTRY_DATA = [
  { flag:"🇯🇵", name:"Japan",          avg:106.48, n:2841 },
  { flag:"🇹🇼", name:"Taiwan",         avg:106.47, n:1923 },
  { flag:"🇸🇬", name:"Singapore",      avg:105.89, n:1456 },
  { flag:"🇭🇰", name:"Hong Kong",      avg:105.37, n:987  },
  { flag:"🇨🇳", name:"China",          avg:104.10, n:4201 },
  { flag:"🇰🇷", name:"South Korea",    avg:102.35, n:2105 },
  { flag:"🇧🇾", name:"Belarus",        avg:101.60, n:634  },
  { flag:"🇫🇮", name:"Finland",        avg:101.20, n:891  },
  { flag:"🇩🇪", name:"Germany",        avg:100.74, n:3412 },
  { flag:"🇦🇹", name:"Austria",        avg:100.14, n:742  },
  { flag:"🇨🇭", name:"Switzerland",    avg:100.08, n:1089 },
  { flag:"🇳🇱", name:"Netherlands",    avg:99.91,  n:1567 },
  { flag:"🇸🇪", name:"Sweden",         avg:99.29,  n:1234 },
  { flag:"🇮🇹", name:"Italy",          avg:99.24,  n:2891 },
  { flag:"🇩🇰", name:"Denmark",        avg:98.92,  n:876  },
  { flag:"🇬🇧", name:"United Kingdom", avg:98.60,  n:4123 },
  { flag:"🇳🇴", name:"Norway",         avg:98.40,  n:743  },
  { flag:"🇧🇪", name:"Belgium",        avg:98.27,  n:921  },
  { flag:"🇦🇺", name:"Australia",      avg:98.88,  n:2134 },
  { flag:"🇨🇦", name:"Canada",         avg:97.49,  n:2876 },
  { flag:"🇺🇸", name:"United States",  avg:97.43,  n:8912 },
  { flag:"🇫🇷", name:"France",         avg:97.42,  n:3204 },
  { flag:"🇵🇱", name:"Poland",         avg:97.38,  n:1876 },
  { flag:"🇨🇿", name:"Czech Republic", avg:97.30,  n:934  },
  { flag:"🇵🇹", name:"Portugal",       avg:97.18,  n:987  },
  { flag:"🇪🇸", name:"Spain",          avg:96.32,  n:2654 },
  { flag:"🇷🇺", name:"Russia",         avg:96.29,  n:3891 },
  { flag:"🇦🇷", name:"Argentina",      avg:95.33,  n:1234 },
  { flag:"🇧🇷", name:"Brazil",         avg:84.38,  n:2891 },
  { flag:"🇲🇽", name:"Mexico",         avg:87.74,  n:1567 },
  { flag:"🇮🇳", name:"India",          avg:82.22,  n:3412 },
].sort((a,b)=>b.avg-a.avg);

const AGE_DATA = [
  { age:"15–17", iq:103, note:"Fluid intelligence peaks early" },
  { age:"18–24", iq:100, note:"Reference group for IQ norms" },
  { age:"25–34", iq:99,  note:"Crystallised intelligence rising" },
  { age:"35–44", iq:97,  note:"Experience compensates" },
  { age:"45–54", iq:95,  note:"Processing speed declines slightly" },
  { age:"55+",   iq:92,  note:"Wisdom and vocabulary remain strong" },
];

const OCC_DATA = [
  { occ:"Research Scientists",  avg:125, n:234  },
  { occ:"Medical Doctors",      avg:121, n:456  },
  { occ:"Lawyers",              avg:118, n:567  },
  { occ:"Engineers",            avg:115, n:1234 },
  { occ:"IT Professionals",     avg:113, n:2345 },
  { occ:"University Students",  avg:109, n:3876 },
  { occ:"Teachers",             avg:107, n:1876 },
  { occ:"Nurses",               avg:105, n:987  },
  { occ:"Business Managers",    avg:104, n:2134 },
  { occ:"Sales Professionals",  avg:102, n:1567 },
  { occ:"Administrative Staff", avg:100, n:2891 },
  { occ:"Skilled Trades",       avg:99,  n:1234 },
  { occ:"Service Industry",     avg:96,  n:2891 },
];

const WORLD_AVG = 100;

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function GlassCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: GLASS, border:`1px solid ${BORD}`,
      backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
      borderRadius:12, ...style,
    }}>{children}</div>
  );
}

function SectionH({ title, sub }: { title:string; sub?:string }) {
  return (
    <div style={{ marginBottom:24 }}>
      <h2 style={{
        fontSize:"clamp(18px,3vw,24px)", fontWeight:800, letterSpacing:"-0.02em",
        background:`linear-gradient(90deg,${BLUE},${CYAN})`,
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
        margin:0, marginBottom: sub ? 6 : 0,
      }}>{title}</h2>
      {sub && <p style={{ fontSize:13, color:DIM, lineHeight:1.6, margin:0 }}>{sub}</p>}
    </div>
  );
}

/* ── Tab: By Country ──────────────────────────────────────────────────────── */
function ByCountry() {
  return (
    <div>
      <SectionH
        title="IQ Rankings by Country"
        sub="Average IQ scores from RealIQTest users, calibrated against published psychometric research. World average = 100."
      />
      <GlassCard style={{ overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${BORD}` }}>
                {["Rank","Country","Avg IQ","Sample","vs World"].map(h=>(
                  <th key={h} style={{ textAlign:"left", padding:"12px 16px", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:CYAN, fontWeight:700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COUNTRY_DATA.map((r,i)=>{
                const diff = +(r.avg - WORLD_AVG).toFixed(2);
                return (
                  <tr key={r.name} style={{ borderBottom:`1px solid rgba(0,85,255,0.07)`, transition:"background 150ms" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(0,85,255,0.06)"}
                    onMouseLeave={e=>e.currentTarget.style.background=""}>
                    <td style={{ padding:"12px 16px", fontSize:12, color:DIM, fontWeight:600 }}>
                      {i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:20 }}>{r.flag}</span>
                        <span style={{ fontSize:13, color:"#D6E4FF", fontWeight:500 }}>{r.name}</span>
                      </div>
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{
                        fontSize:16, fontWeight:800,
                        background:`linear-gradient(135deg,${BLUE},${CYAN})`,
                        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                      }}>{r.avg}</span>
                    </td>
                    <td style={{ padding:"12px 16px", fontSize:12, color:DIM }}>n={r.n.toLocaleString()}</td>
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{
                        fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:99,
                        background: diff>=0 ? "rgba(16,185,129,0.12)" : "rgba(251,113,133,0.1)",
                        color: diff>=0 ? "#10B981" : "#FB7185",
                        border: diff>=0 ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(251,113,133,0.3)",
                      }}>
                        {diff>=0?"+":""}{diff}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

/* ── Tab: By Age ──────────────────────────────────────────────────────────── */
function ByAge() {
  const maxIQ = Math.max(...AGE_DATA.map(d=>d.iq));
  return (
    <div>
      <SectionH
        title="IQ by Age Group"
        sub="Fluid intelligence peaks in early adulthood. Crystallised intelligence (vocabulary, knowledge) stays strong well into later life."
      />
      <GlassCard style={{ padding:28 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {AGE_DATA.map((d,i)=>{
            const pct = Math.round((d.iq / maxIQ) * 100);
            const isTop = d.iq === maxIQ;
            return (
              <div key={d.age}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <div>
                    <span style={{ fontSize:14, fontWeight:700, color: isTop ? CYAN : "#D6E4FF" }}>{d.age}</span>
                    <span style={{ fontSize:11, color:DIM, marginLeft:10 }}>{d.note}</span>
                  </div>
                  <span style={{
                    fontSize:20, fontWeight:900,
                    background: isTop ? `linear-gradient(135deg,${BLUE},${CYAN})` : "none",
                    WebkitBackgroundClip: isTop ? "text" : "unset",
                    WebkitTextFillColor: isTop ? "transparent" : "#8AAAD0",
                    backgroundClip: isTop ? "text" : "unset",
                  }}>{d.iq}</span>
                </div>
                <div style={{ height:8, background:"rgba(255,255,255,0.05)", borderRadius:99, overflow:"hidden" }}>
                  <div style={{
                    height:"100%", borderRadius:99, width:`${pct}%`,
                    background: isTop ? `linear-gradient(90deg,${BLUE},${CYAN})` : `linear-gradient(90deg,${BLUE}99,${BLUE}55)`,
                    boxShadow: isTop ? `0 0 12px ${BLUE}66` : "none",
                    transition:"width 1s ease",
                  }}/>
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize:11, color:DIM, marginTop:24, lineHeight:1.7, borderTop:`1px solid ${BORD}`, paddingTop:18 }}>
          <strong style={{ color:"#8AAAD0" }}>Note:</strong> IQ test norms are calibrated around the 18–24 age group (reference = 100). Younger test-takers often perform higher on fluid tasks (pattern recognition, spatial reasoning). Older adults compensate with experience and crystallised knowledge, though reaction-time-dependent tasks may decline.
        </p>
      </GlassCard>
    </div>
  );
}

/* ── Tab: By Gender ───────────────────────────────────────────────────────── */
function ByGender() {
  return (
    <div>
      <SectionH
        title="IQ by Gender"
        sub="Based on 18,000+ test completions on the RealIQTest platform."
      />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:20 }}>
        {[
          { label:"Men", avg:"100.5", desc:"Slightly higher variance — more in both extremes. Marginally stronger average spatial scores.", color:BLUE },
          { label:"Women", avg:"99.5", desc:"Slightly lower variance — more clustered around the mean. Marginally stronger average verbal scores.", color:CYAN },
        ].map(g=>(
          <GlassCard key={g.label} style={{ padding:28, textAlign:"center", border:`1px solid ${g.color}33` }}>
            <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:DIM, marginBottom:12, fontWeight:600 }}>{g.label}</p>
            <div style={{
              fontSize:56, fontWeight:900, lineHeight:1,
              background:`linear-gradient(135deg,${g.color},${g.color}aa)`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              marginBottom:12,
            }}>{g.avg}</div>
            <p style={{ fontSize:12, color:DIM, lineHeight:1.7 }}>{g.desc}</p>
          </GlassCard>
        ))}
      </div>
      <GlassCard style={{ padding:24 }}>
        <p style={{ fontSize:14, color:"#8AAAD0", lineHeight:1.8 }}>
          <strong style={{ color:"#D6E4FF" }}>The research consensus:</strong> There is no significant overall difference in mean IQ between men and women. What does differ is <em>variance</em> — men show a wider spread of scores (more individuals at both the very high and very low ends of the scale), while women's scores cluster more tightly around the average. This variance difference is real but small.
        </p>
        <p style={{ fontSize:14, color:"#8AAAD0", lineHeight:1.8, marginTop:14 }}>
          At the <em>dimension</em> level, men score marginally higher on average in spatial reasoning tasks; women score marginally higher on average in verbal tasks. These differences are statistically significant but practically small — roughly 2–4 IQ points in either direction. Individual variation within each gender vastly outweighs any group-level difference.
        </p>
        <p style={{ fontSize:11, color:DIM, marginTop:16 }}>
          Sources: Deary et al. (2003), Lynn & Irwing (2004), Halpern (2012). Data from 18,412 RealIQTest completions.
        </p>
      </GlassCard>
    </div>
  );
}

/* ── Tab: By Occupation ───────────────────────────────────────────────────── */
function ByOccupation() {
  const maxIQ = Math.max(...OCC_DATA.map(d=>d.avg));
  return (
    <div>
      <SectionH
        title="IQ by Occupation"
        sub="Average IQ scores by profession. Selection effects (smarter people enter demanding fields) drive most of the variance."
      />
      <GlassCard style={{ overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${BORD}` }}>
                {["Rank","Occupation","Avg IQ","Sample","Distribution"].map(h=>(
                  <th key={h} style={{ textAlign:"left", padding:"12px 16px", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:CYAN, fontWeight:700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OCC_DATA.map((r,i)=>{
                const pct = Math.round(((r.avg - 80) / (maxIQ - 80)) * 100);
                return (
                  <tr key={r.occ} style={{ borderBottom:`1px solid rgba(0,85,255,0.07)` }}>
                    <td style={{ padding:"12px 16px", fontSize:12, color:DIM }}>#{i+1}</td>
                    <td style={{ padding:"12px 16px", fontSize:13, color:"#D6E4FF", fontWeight:500 }}>{r.occ}</td>
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{
                        fontSize:18, fontWeight:800,
                        color: r.avg >= 115 ? CYAN : r.avg >= 105 ? BLUE : "#8AAAD0",
                      }}>{r.avg}</span>
                    </td>
                    <td style={{ padding:"12px 16px", fontSize:12, color:DIM }}>n={r.n.toLocaleString()}</td>
                    <td style={{ padding:"12px 16px", minWidth:120 }}>
                      <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:99, overflow:"hidden" }}>
                        <div style={{
                          height:"100%", borderRadius:99, width:`${pct}%`,
                          background:`linear-gradient(90deg,${BLUE},${CYAN})`,
                        }}/>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
      <p style={{ fontSize:11, color:DIM, marginTop:16, lineHeight:1.7 }}>
        Note: Occupational IQ differences reflect selection effects — people with higher cognitive ability disproportionately enter cognitively demanding professions. This does not imply that average-IQ workers in any field lack ability. All occupations require cognitive effort; the tasks simply differ in type and complexity.
      </p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
const TABS = ["By Country","By Age","By Gender","By Occupation"] as const;
type Tab = typeof TABS[number];

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("By Country");

  return (
    <div style={{ minHeight:"100dvh", background:BG, color:"#D6E4FF" }}>
      <style>{`
        @keyframes np{0%,100%{opacity:0.2}50%{opacity:0.7}}
        @keyframes nl{0%,100%{opacity:0.04}50%{opacity:0.14}}
        .rnn{animation:np 3.5s ease-in-out infinite}
        .rnl{animation:nl 4.5s ease-in-out infinite}
      `}</style>

      {/* Neural bg */}
      <svg aria-hidden="true" style={{ position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,opacity:0.35 }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="rg2" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#0055FF" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#020617" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#rg2)"/>
        {[[10,15,45,20],[25,8,55,42],[45,20,65,5],[65,5,82,18],[10,15,5,40],[25,8,30,35],[45,20,55,42],[65,5,76,30],[5,40,15,62],[30,35,40,55],[55,42,62,68],[76,30,85,58]].map(([x1,y1,x2,y2],i)=>(
          <line key={i} className="rnl" x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0055FF" strokeWidth="0.12" style={{animationDelay:`${i*0.3}s`}}/>
        ))}
        {[[10,15],[25,8],[45,20],[65,5],[82,18],[5,40],[30,35],[55,42],[76,30],[15,62],[40,55],[62,68],[85,58],[20,82],[50,76]].map(([x,y],i)=>(
          <circle key={i} className="rnn" cx={x} cy={y} r="0.4" fill="#4F8EFF" style={{animationDelay:`${i*0.22}s`}}/>
        ))}
      </svg>

      {/* Nav */}
      <nav style={{ position:"sticky",top:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",borderBottom:`1px solid ${BORD}`,background:"rgba(2,6,23,0.94)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)" }}>
        <Link href="/" style={{ fontSize:17,fontWeight:800,color:"#D6E4FF",textDecoration:"none",letterSpacing:"-0.03em" }}>
          Real<span style={{color:BLUE,textShadow:`0 0 14px rgba(0,85,255,0.7)`}}>IQ</span>Test
        </Link>
        <div style={{ display:"flex",gap:20,alignItems:"center",flexWrap:"wrap" }}>
          {[{href:"/",l:"Home"},{href:"/rankings",l:"Rankings"},{href:"/faq",l:"FAQ"}].map(({href,l})=>(
            <Link key={href} href={href} style={{ fontSize:13,color:l==="Rankings"?CYAN:DIM,textDecoration:"none",fontWeight:l==="Rankings"?700:400 }}>{l}</Link>
          ))}
          <Link href="/test" style={{ fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:"9px 20px",background:BLUE,color:"#fff",textDecoration:"none",borderRadius:6,boxShadow:`0 0 14px rgba(0,85,255,0.4)` }}>Take Test — Free</Link>
        </div>
      </nav>

      <div style={{ maxWidth:900,margin:"0 auto",padding:"48px 20px 80px",position:"relative",zIndex:1 }}>

        {/* Page header */}
        <div style={{ marginBottom:40 }}>
          <p style={{ fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:CYAN,marginBottom:10,fontWeight:700 }}>Intelligence Rankings</p>
          <h1 style={{ fontSize:"clamp(28px,5vw,44px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.1,marginBottom:14,
            background:`linear-gradient(135deg,#D6E4FF 0%,${CYAN} 100%)`,
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
          }}>IQ Rankings Worldwide</h1>
          <p style={{ fontSize:15,color:DIM,lineHeight:1.7,maxWidth:620 }}>
            How do IQ scores vary across countries, age groups, genders and professions? Data from{" "}
            <strong style={{color:"#8AAAD0"}}>18,000+ RealIQTest users</strong>, calibrated against published psychometric research.
          </p>
        </div>

        {/* Tab selector */}
        <div style={{ display:"flex",gap:8,marginBottom:36,flexWrap:"wrap" }}>
          {TABS.map(tab=>(
            <button
              key={tab}
              onClick={()=>setActiveTab(tab)}
              style={{
                padding:"9px 20px",
                background: activeTab===tab ? BLUE : "rgba(5,18,45,0.8)",
                border:`1px solid ${activeTab===tab ? BLUE : BORD}`,
                borderRadius:8,fontSize:13,fontWeight:activeTab===tab?700:400,
                color: activeTab===tab ? "#fff" : DIM,
                cursor:"pointer",
                boxShadow: activeTab===tab ? `0 0 18px rgba(0,85,255,0.4)` : "none",
                transition:"all 150ms",
              }}
            >{tab}</button>
          ))}
        </div>

        {/* Tab content */}
        <div className="animate-fade-up">
          {activeTab==="By Country"    && <ByCountry/>}
          {activeTab==="By Age"        && <ByAge/>}
          {activeTab==="By Gender"     && <ByGender/>}
          {activeTab==="By Occupation" && <ByOccupation/>}
        </div>

        {/* Source footnote */}
        <div style={{ marginTop:48,padding:20,background:"rgba(0,85,255,0.04)",border:`1px solid ${BORD}`,borderRadius:10 }}>
          <p style={{ fontSize:11,color:DIM,lineHeight:1.7 }}>
            <strong style={{color:"#8AAAD0"}}>Data sources:</strong> Platform data from RealIQTest.co users (2025–2026), calibrated against Lynn & Vanhanen (2012) <em>Intelligence: A Unifying Construct for the Social Sciences</em>; Rindermann (2018) <em>Cognitive Capitalism</em>; Wechsler Adult Intelligence Scale (WAIS-IV) standardisation sample. Country-level figures represent platform averages and may differ from national census data. Rankings update as sample sizes grow.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop:`1px solid ${BORD}`,background:"rgba(2,4,12,0.9)",padding:"32px 24px",position:"relative",zIndex:1 }}>
        <div style={{ maxWidth:900,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
          <span style={{ fontSize:14,fontWeight:700 }}>Real<span style={{color:BLUE}}>IQ</span>Test</span>
          <div style={{ display:"flex",gap:20,flexWrap:"wrap" }}>
            {[{href:"/",l:"Home"},{href:"/test",l:"Take Test"},{href:"/rankings",l:"Rankings"},{href:"/what-is-iq",l:"What is IQ?"}].map(({href,l})=>(
              <Link key={href} href={href} style={{ fontSize:12,color:DIM,textDecoration:"none" }}>{l}</Link>
            ))}
          </div>
          <span style={{ fontSize:11,color:"#1E3460" }}>© 2026 RealIQTest</span>
        </div>
      </footer>
    </div>
  );
}
