"use client";

import { useState } from "react";
import Link from "next/link";

const BLUE  = "#0055FF";
const CYAN  = "#06B6D4";
const DIM   = "#8AABCC";
const BG    = "#020617";
const BORD  = "rgba(0,85,255,0.18)";
const GLASS = "rgba(6,14,40,0.78)";
const TEXT  = "#E8F0FF";

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

function EmptyState({ message }: { message?: string }) {
  return (
    <GlassCard style={{ padding:"56px 32px", textAlign:"center" }}>
      <div style={{
        width:56, height:56, borderRadius:"50%", margin:"0 auto 20px",
        background:"rgba(0,85,255,0.08)", border:`1px solid ${BORD}`,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
        </svg>
      </div>
      <p style={{ fontSize:15, color:TEXT, fontWeight:600, marginBottom:8 }}>
        No data yet
      </p>
      <p style={{ fontSize:13, color:DIM, lineHeight:1.7, maxWidth:400, margin:"0 auto 24px" }}>
        {message || "Be the first to complete the test and claim your spot on the leaderboard."}
      </p>
      <Link href="/test" style={{
        display:"inline-block", fontSize:12, fontWeight:700,
        letterSpacing:"0.1em", textTransform:"uppercase",
        padding:"11px 28px",
        background:`linear-gradient(135deg,${BLUE},${CYAN})`,
        color:"#fff", textDecoration:"none", borderRadius:8,
        boxShadow:"0 0 20px rgba(0,85,255,0.4)",
      }}>Take the Free Test</Link>
    </GlassCard>
  );
}

const TABS = ["By Country","By Age","By Gender","By Occupation"] as const;
type Tab = typeof TABS[number];

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("By Country");

  return (
    <div style={{ minHeight:"100dvh", background:BG, color:TEXT, fontFamily:"'Inter',system-ui,sans-serif" }}>
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
        <Link href="/" style={{ fontSize:17,fontWeight:800,color:TEXT,textDecoration:"none",letterSpacing:"-0.03em" }}>
          Real<span style={{color:BLUE,textShadow:"0 0 14px rgba(0,85,255,0.7)"}}>IQ</span>Test
        </Link>
        <div style={{ display:"flex",gap:20,alignItems:"center",flexWrap:"wrap" }}>
          {([{href:"/",l:"Home"},{href:"/rankings",l:"Rankings"},{href:"/faq",l:"FAQ"}] as const).map(({href,l})=>(
            <Link key={href} href={href} style={{ fontSize:13,color:l==="Rankings"?CYAN:DIM,textDecoration:"none",fontWeight:l==="Rankings"?700:400 }}>{l}</Link>
          ))}
          <Link href="/test" style={{ fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:"9px 20px",background:BLUE,color:"#fff",textDecoration:"none",borderRadius:6,boxShadow:"0 0 14px rgba(0,85,255,0.4)" }}>Take Test — Free</Link>
        </div>
      </nav>

      <div style={{ maxWidth:900,margin:"0 auto",padding:"48px 20px 80px",position:"relative",zIndex:1 }}>

        {/* Page header */}
        <div style={{ marginBottom:40 }}>
          <p style={{ fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:CYAN,marginBottom:10,fontWeight:700 }}>Intelligence Rankings</p>
          <h1 style={{
            fontSize:"clamp(28px,5vw,44px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.1,marginBottom:14,
            background:`linear-gradient(135deg,${TEXT} 0%,${CYAN} 100%)`,
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
          }}>IQ Rankings Worldwide</h1>
          <p style={{ fontSize:15,color:DIM,lineHeight:1.7,maxWidth:620 }}>
            Rankings are built entirely from real test completions. Complete the test to add your score and help populate these tables.
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
                borderRadius:8, fontSize:13, fontWeight:activeTab===tab?700:400,
                color: activeTab===tab ? "#fff" : DIM,
                cursor:"pointer",
                boxShadow: activeTab===tab ? "0 0 18px rgba(0,85,255,0.4)" : "none",
                transition:"all 150ms",
              }}
            >{tab}</button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab==="By Country" && (
            <div>
              <SectionH title="IQ Rankings by Country" sub="Average scores from verified test completions, grouped by country."/>
              <EmptyState message="Be the first to complete the test and claim your spot on the country leaderboard."/>
            </div>
          )}
          {activeTab==="By Age" && (
            <div>
              <SectionH title="IQ by Age Group" sub="How scores compare across different age groups."/>
              <EmptyState message="Complete the test to add your score to the age group rankings."/>
            </div>
          )}
          {activeTab==="By Gender" && (
            <div>
              <SectionH title="IQ by Gender" sub="Score distribution across genders based on real test completions."/>
              <EmptyState message="Complete the test to contribute to the gender comparison data."/>
            </div>
          )}
          {activeTab==="By Occupation" && (
            <div>
              <SectionH title="IQ by Occupation" sub="Average scores grouped by self-reported profession."/>
              <EmptyState message="Complete the test and share your occupation to populate the profession rankings."/>
            </div>
          )}
        </div>

        {/* Info note */}
        <div style={{ marginTop:40,padding:"20px 24px",background:"rgba(0,85,255,0.04)",border:`1px solid ${BORD}`,borderRadius:10 }}>
          <p style={{ fontSize:12,color:DIM,lineHeight:1.7,margin:0 }}>
            <strong style={{color:TEXT}}>How rankings work:</strong> Every completed test contributes to these tables anonymously. Your country is detected automatically from your timezone. Rankings update in real time as more people complete the assessment.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop:`1px solid ${BORD}`,background:"rgba(2,4,12,0.9)",padding:"32px 24px",position:"relative",zIndex:1 }}>
        <div style={{ maxWidth:900,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
          <span style={{ fontSize:14,fontWeight:700,color:TEXT }}>Real<span style={{color:BLUE}}>IQ</span>Test</span>
          <div style={{ display:"flex",gap:20,flexWrap:"wrap" }}>
            {([{href:"/",l:"Home"},{href:"/test",l:"Take Test"},{href:"/rankings",l:"Rankings"},{href:"/what-is-iq",l:"What is IQ?"}] as const).map(({href,l})=>(
              <Link key={href} href={href} style={{ fontSize:12,color:DIM,textDecoration:"none" }}>{l}</Link>
            ))}
          </div>
          <span style={{ fontSize:11,color:"#6A88AA" }}>© 2026 RealIQTest</span>
        </div>
      </footer>
    </div>
  );
}
