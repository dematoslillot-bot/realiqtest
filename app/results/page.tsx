"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { calculateIQWeighted, getIQLabel, getPercentile } from "@/lib/iq-calculator";
import { CATEGORIES } from "@/lib/questions";
import { detectCountryCode, getCountryByCode, type CountryEntry } from "@/lib/leaderboard-data";

/* ── Animated IQ counter ─────────────────────────────────────────────────── */
function AnimatedIQ({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);
  const ran = useRef(false);
  useEffect(() => {
    if (!target || ran.current) return;
    ran.current = true;
    const dur = 1900, t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setDisplay(Math.round(target * (1 - Math.pow(1 - p, 4))));
      if (p < 1) requestAnimationFrame(tick);
      else setDisplay(target);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <>{display || ""}</>;
}

/* ── Gaussian bell curve ─────────────────────────────────────────────────── */
function BellCurve({ iq }: { iq: number }) {
  const W = 340, H = 140;
  const padL = 28, padR = 28, padT = 22, padB = 28;
  const iqMin = 55, iqMax = 145;
  const mean = 100, sd = 15;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  function pdf(x: number) {
    const z = (x - mean) / sd;
    return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
  }
  const pdfMax = pdf(mean);
  const pts: [number, number][] = [];
  for (let i = 0; i <= 120; i++) {
    const iqV = iqMin + (i / 120) * (iqMax - iqMin);
    const x   = padL + ((iqV - iqMin) / (iqMax - iqMin)) * plotW;
    const y   = padT + plotH - (pdf(iqV) / pdfMax) * plotH;
    pts.push([x, y]);
  }
  const curveD = `M${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L")}`;
  const areaD  = `${curveD} L${pts[pts.length - 1][0]},${padT + plotH} L${pts[0][0]},${padT + plotH} Z`;
  const clampedIQ = Math.max(iqMin, Math.min(iqMax, iq));
  const userX = padL + ((clampedIQ - iqMin) / (iqMax - iqMin)) * plotW;
  const userY = padT + plotH - (pdf(clampedIQ) / pdfMax) * plotH;
  const leftPts = pts.filter(([x]) => x <= userX);
  const shadeD = leftPts.length > 1
    ? `M${leftPts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L")} L${leftPts[leftPts.length-1][0]},${padT + plotH} L${leftPts[0][0]},${padT + plotH} Z`
    : "";
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="bellFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0055FF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0055FF" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="bellShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0055FF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0055FF" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="rgba(0,85,255,0.15)" strokeWidth={1} />
      <path d={areaD} fill="url(#bellFill)" />
      {shadeD && <path d={shadeD} fill="url(#bellShade)" opacity={0.7} />}
      <path d={curveD} stroke="#0055FF" strokeWidth={2} fill="none" strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 4px rgba(0,85,255,0.6))" }} />
      <line x1={userX} y1={padT} x2={userX} y2={padT + plotH} stroke="#0055FF" strokeWidth={1.5} strokeDasharray="4,3" opacity={0.7} />
      <circle cx={userX} cy={userY} r={12} fill="rgba(0,85,255,0.2)" />
      <circle cx={userX} cy={userY} r={5}  fill="#0055FF" style={{ filter: "drop-shadow(0 0 6px rgba(0,85,255,0.9))" }} />
      <text x={userX} y={padT - 6} textAnchor="middle" fontSize={10} fill="#0055FF" fontWeight="700"
        style={{ filter: "drop-shadow(0 0 8px rgba(0,85,255,0.7))" }}>{iq}</text>
      <text x={padL}            y={H - 8} textAnchor="middle" fontSize={9} fill="#8AABCC">55</text>
      <text x={padL + plotW/2}  y={H - 8} textAnchor="middle" fontSize={9} fill="#8AABCC">100</text>
      <text x={padL + plotW}    y={H - 8} textAnchor="middle" fontSize={9} fill="#8AABCC">145</text>
      <line x1={padL + plotW/2} y1={padT + plotH - 4} x2={padL + plotW/2} y2={padT + plotH + 4}
        stroke="rgba(0,85,255,0.3)" strokeWidth={1} />
    </svg>
  );
}

/* ── Fake blurred radar chart ────────────────────────────────────────────── */
function FakeRadarChart() {
  const cx = 90, cy = 90, R = 68;
  const angles = [0,1,2,3,4,5].map(i => (i*60-90)*(Math.PI/180));
  const vals   = [0.82, 0.61, 0.74, 0.88, 0.55, 0.70];
  const pts    = vals.map((v,i)=>({ x: cx+R*v*Math.cos(angles[i]), y: cy+R*v*Math.sin(angles[i]) }));
  const poly   = pts.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const grid   = (p: number) => angles.map(a=>`${(cx+R*p*Math.cos(a)).toFixed(1)},${(cy+R*p*Math.sin(a)).toFixed(1)}`).join(" ");
  return (
    <svg width={180} height={180} viewBox="0 0 180 180">
      {[0.25,0.5,0.75,1].map((p,i)=>(
        <polygon key={i} points={grid(p)} fill="none" stroke="rgba(0,85,255,0.15)" strokeWidth="0.6"/>
      ))}
      {angles.map((a,i)=>(
        <line key={i} x1={cx} y1={cy} x2={cx+R*Math.cos(a)} y2={cy+R*Math.sin(a)} stroke="rgba(0,85,255,0.1)" strokeWidth="0.5"/>
      ))}
      <polygon points={poly} fill="rgba(0,85,255,0.18)" stroke="#0055FF" strokeWidth="2"/>
      {pts.map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#06B6D4"/>
      ))}
    </svg>
  );
}

/* ── Leaderboard popup ───────────────────────────────────────────────────── */
function LeaderboardPopup({ iq, onClose }: { iq: number; onClose: () => void }) {
  const [country, setCountry] = useState<CountryEntry | null>(null);
  useEffect(() => {
    const code = detectCountryCode();
    if (code) setCountry(getCountryByCode(code) ?? null);
  }, []);
  const blue  = "#0055FF";
  const blue2 = "rgba(0,85,255,0.16)";
  const dim   = "#8AABCC";
  return (
    <div style={{ position:"fixed",inset:0,zIndex:50,background:"rgba(5,10,20,0.82)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div className="animate-fade-up" style={{ maxWidth:380,width:"100%",background:"#080E1A",border:`1px solid ${blue2}`,borderRadius:10,padding:"28px 24px",textAlign:"center",boxShadow:"0 0 60px rgba(0,85,255,0.18)" }}>
        <p style={{ fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:dim,marginBottom:10 }}>Country Comparison</p>
        {country ? (
          <>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:18 }}>
              <span style={{ fontSize:32 }}>{country.flag}</span>
              <div style={{ textAlign:"left" }}>
                <p style={{ fontSize:16,fontWeight:600,color:"#D6E4FF" }}>{country.name}</p>
              </div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20 }}>
              <div style={{ background:"rgba(0,85,255,0.07)",border:`1px solid ${blue2}`,borderRadius:6,padding:"12px 8px" }}>
                <p style={{ fontSize:9,color:dim,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4 }}>Country avg</p>
                <p style={{ fontSize:22,fontWeight:300,color:blue }}>{country.avgIQ}</p>
              </div>
              <div style={{ background:"rgba(0,85,255,0.07)",border:`1px solid ${blue2}`,borderRadius:6,padding:"12px 8px" }}>
                <p style={{ fontSize:9,color:dim,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4 }}>Your score</p>
                <p style={{ fontSize:22,fontWeight:300,color:iq>=country.avgIQ?"#00D87A":"#FF8C00" }}>{iq}</p>
              </div>
            </div>
            <p style={{ fontSize:12,color:dim,marginBottom:20,lineHeight:1.6 }}>
              {iq>country.avgIQ ? `You scored ${iq-country.avgIQ} pts above your country's average — top performance!` : iq===country.avgIQ ? "You matched your country's average exactly." : `You're ${country.avgIQ-iq} pts below your country's average — keep practicing!`}
            </p>
          </>
        ) : (
          <p style={{ fontSize:13,color:dim,marginBottom:20 }}>See how your score compares to 50+ countries worldwide.</p>
        )}
        <button onClick={onClose} className="btn btn-primary" style={{ width:"100%" }}>Continue to my results →</button>
      </div>
    </div>
  );
}

/* ── Checkmark SVG ───────────────────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

/* ── Share-card generator (HTML5 Canvas, no server) ─────────────────────── */
async function generateShareImage(iq: number, percentile: number, label: string): Promise<string> {
  const W = 1080, H = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  await document.fonts.ready;

  // ── Background ──────────────────────────────────────────────────────────
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, W, H);

  // ── Neural network ───────────────────────────────────────────────────────
  const nodes: [number,number][] = [
    [80,90],[210,55],[380,115],[570,65],[760,95],[960,75],[1030,195],
    [55,260],[195,330],[400,285],[620,250],[840,310],[1035,270],
    [110,460],[310,510],[520,490],[720,525],[920,470],[1055,530],
    [65,690],[260,730],[500,710],[700,750],[900,695],[1050,735],
    [130,895],[370,930],[600,895],[800,950],[990,895],
  ];
  const conns: [number,number][] = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[7,8],[8,9],[9,10],[10,11],[11,12],
    [13,14],[14,15],[15,16],[16,17],[17,18],[19,20],[20,21],[21,22],[22,23],[23,24],
    [25,26],[26,27],[27,28],[28,29],[0,7],[1,8],[2,9],[3,10],[4,11],[5,12],
    [7,13],[8,14],[9,15],[10,16],[11,17],[12,18],[13,19],[14,20],[15,21],
    [16,22],[17,23],[18,24],[19,25],[20,26],[21,27],[22,28],[23,29],
  ];
  ctx.lineWidth = 0.9;
  conns.forEach(([a,b]) => {
    ctx.strokeStyle = `rgba(0,85,255,${0.08 + Math.random()*0.06})`;
    ctx.beginPath(); ctx.moveTo(nodes[a][0],nodes[a][1]); ctx.lineTo(nodes[b][0],nodes[b][1]); ctx.stroke();
  });
  nodes.forEach(([x,y],i) => {
    ctx.beginPath(); ctx.arc(x,y,i%3===0?2.8:2,0,Math.PI*2);
    ctx.fillStyle = i%3===0?"rgba(79,142,255,0.75)":i%3===1?"rgba(6,182,212,0.55)":"rgba(139,92,246,0.55)";
    ctx.fill();
  });

  // ── Central radial glow ──────────────────────────────────────────────────
  const glow = ctx.createRadialGradient(W/2, 480, 0, W/2, 480, 420);
  glow.addColorStop(0, "rgba(0,85,255,0.30)");
  glow.addColorStop(0.45, "rgba(0,85,255,0.10)");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

  // ── Top accent dots ──────────────────────────────────────────────────────
  [-3,-2,-1,0,1,2,3].forEach((i) => {
    const x = W/2 + i*22;
    ctx.beginPath(); ctx.arc(x, 140, Math.abs(i)===0?5:Math.abs(i)<=1?3.5:2.2, 0, Math.PI*2);
    ctx.fillStyle = Math.abs(i)===0?"#0055FF":Math.abs(i)<=1?"rgba(0,85,255,0.6)":"rgba(0,85,255,0.25)";
    ctx.fill();
  });

  // ── "MY IQ SCORE" label ──────────────────────────────────────────────────
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.font = "700 30px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#8AABCC";
  ctx.fillText("MY  IQ  SCORE", W/2, 210);

  // ── IQ number (with glow) ────────────────────────────────────────────────
  const iqStr = String(iq);
  const numSize = iqStr.length > 2 ? 250 : 290;
  ctx.font = `900 ${numSize}px Inter, system-ui, sans-serif`;
  // Glow pass
  ctx.save();
  ctx.shadowColor = "rgba(0,85,255,0.7)"; ctx.shadowBlur = 80;
  const numGrad = ctx.createLinearGradient(W/2-220, 0, W/2+220, 0);
  numGrad.addColorStop(0, "#4F8EFF"); numGrad.addColorStop(0.5, "#0055FF"); numGrad.addColorStop(1, "#06B6D4");
  ctx.fillStyle = numGrad; ctx.fillText(iqStr, W/2, 490); ctx.restore();
  // Clean pass
  ctx.fillStyle = numGrad; ctx.fillText(iqStr, W/2, 490);

  // ── Separator ────────────────────────────────────────────────────────────
  const sep = ctx.createLinearGradient(W/2-220, 0, W/2+220, 0);
  sep.addColorStop(0,"transparent"); sep.addColorStop(0.5,"rgba(0,85,255,0.7)"); sep.addColorStop(1,"transparent");
  ctx.strokeStyle = sep; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W/2-220, 635); ctx.lineTo(W/2+220, 635); ctx.stroke();

  // ── Intelligence label ───────────────────────────────────────────────────
  ctx.font = "700 28px Inter, system-ui, sans-serif";
  const lblGrad = ctx.createLinearGradient(W/2-160, 0, W/2+160, 0);
  lblGrad.addColorStop(0,"#0055FF"); lblGrad.addColorStop(1,"#06B6D4");
  ctx.fillStyle = lblGrad; ctx.fillText(label.toUpperCase(), W/2, 680);

  // ── Percentile ───────────────────────────────────────────────────────────
  ctx.font = "400 34px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#D6E4FF";
  ctx.fillText(`Top ${100 - percentile}% of the population`, W/2, 740);

  // ── Sub-tagline ──────────────────────────────────────────────────────────
  ctx.font = "300 22px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#8AABCC";
  ctx.fillText("Cognitively assessed across 6 dimensions", W/2, 800);

  // ── Bottom divider ───────────────────────────────────────────────────────
  ctx.strokeStyle = "rgba(0,85,255,0.22)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W/2-300, 868); ctx.lineTo(W/2+300, 868); ctx.stroke();

  // ── Logo "RealIQTest" ────────────────────────────────────────────────────
  const logoSize = 40;
  ctx.font = `800 ${logoSize}px Inter, system-ui, sans-serif`;
  ctx.textBaseline = "middle";
  const rW = ctx.measureText("Real").width;
  const iW = ctx.measureText("IQ").width;
  const tW = ctx.measureText("Test").width;
  const logoStart = W/2 - (rW+iW+tW)/2;
  ctx.textAlign = "left";
  ctx.fillStyle = "#E8F0FF"; ctx.fillText("Real", logoStart, 920);
  const iqGrad = ctx.createLinearGradient(logoStart+rW, 900, logoStart+rW+iW, 940);
  iqGrad.addColorStop(0,"#0055FF"); iqGrad.addColorStop(1,"#06B6D4");
  ctx.fillStyle = iqGrad; ctx.fillText("IQ", logoStart+rW, 920);
  ctx.fillStyle = "#E8F0FF"; ctx.fillText("Test", logoStart+rW+iW, 920);

  // ── URL ──────────────────────────────────────────────────────────────────
  ctx.textAlign = "center"; ctx.font = "400 22px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#8AABCC"; ctx.fillText("realiqtest.co", W/2, 975);

  return canvas.toDataURL("image/png");
}

/* ── Share modal ─────────────────────────────────────────────────────────── */
function ShareModal({ img, iq, percentile, onClose }: {
  img: string; iq: number; percentile: number; onClose: () => void;
}) {
  const blue  = "#0055FF";
  const cyan  = "#06B6D4";
  const dim   = "#8AABCC";
  const bord  = "rgba(0,85,255,0.22)";

  const txt   = `I scored ${iq} on the RealIQ Test! 🧠 Top ${100-percentile}% of the population. Take the free test:`;
  const encTxt = encodeURIComponent(txt);
  const encUrl = encodeURIComponent("https://realiqtest.co");

  function download(name: string) {
    const a = document.createElement("a");
    a.href = img; a.download = name; a.click();
  }

  const platforms = [
    {
      name: "Instagram",
      sub: "Download image",
      color: "#E1306C",
      bg: "rgba(225,48,108,0.10)",
      border: "rgba(225,48,108,0.35)",
      action: () => download(`realiqtest-iq${iq}-instagram.png`),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
        </svg>
      ),
    },
    {
      name: "TikTok",
      sub: "Download image",
      color: "#E8F0FF",
      bg: "rgba(255,255,255,0.06)",
      border: "rgba(255,255,255,0.18)",
      action: () => download(`realiqtest-iq${iq}-tiktok.png`),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.54V6.77a4.85 4.85 0 01-1.02-.08z"/>
        </svg>
      ),
    },
    {
      name: "Twitter / X",
      sub: "Post tweet",
      color: "#E8F0FF",
      bg: "rgba(255,255,255,0.06)",
      border: "rgba(255,255,255,0.18)",
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encTxt}&url=${encUrl}`, "_blank"),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zM17.083 20.015h1.833L6.965 4.1H5.004L17.083 20.015z"/>
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      sub: "Send message",
      color: "#25D366",
      bg: "rgba(37,211,102,0.08)",
      border: "rgba(37,211,102,0.30)",
      action: () => window.open(`https://wa.me/?text=${encTxt}%20https%3A%2F%2Frealiqtest.co`, "_blank"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{ position:"fixed",inset:0,zIndex:200,background:"rgba(2,6,23,0.94)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
      <div style={{ maxWidth:520,width:"100%",background:"rgba(5,14,40,0.98)",border:`1px solid ${bord}`,borderRadius:18,overflow:"hidden",boxShadow:"0 0 100px rgba(0,85,255,0.2),0 24px 80px rgba(0,0,0,0.6)" }}>

        {/* Header */}
        <div style={{ padding:"20px 24px 18px",borderBottom:`1px solid ${bord}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div>
            <p style={{ fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:cyan,marginBottom:4,fontWeight:700 }}>Share Your Score</p>
            <h3 style={{ fontSize:19,fontWeight:800,color:"#E8F0FF",letterSpacing:"-0.02em",margin:0 }}>Show your IQ to the world</h3>
          </div>
          <button onClick={onClose} style={{ background:"rgba(0,85,255,0.08)",border:`1px solid ${bord}`,borderRadius:8,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:dim,fontSize:16,flexShrink:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{ padding:"20px 24px 24px" }}>
          {/* Image preview */}
          <div style={{ borderRadius:10,overflow:"hidden",border:`1px solid ${bord}`,marginBottom:20,boxShadow:"0 0 40px rgba(0,85,255,0.15)" }}>
            <img src={img} alt="Your IQ score card" style={{ width:"100%",display:"block" }}/>
          </div>

          {/* Platform buttons */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            {platforms.map(p=>(
              <button key={p.name} onClick={p.action} style={{
                display:"flex",alignItems:"center",gap:12,padding:"13px 16px",
                background:p.bg,border:`1px solid ${p.border}`,borderRadius:10,
                cursor:"pointer",transition:"transform 120ms,box-shadow 120ms",
                color:p.color,
              }}
              onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.transform="translateY(0)";}}
              >
                <span style={{ color:p.color,flexShrink:0 }}>{p.icon}</span>
                <span style={{ textAlign:"left" }}>
                  <span style={{ display:"block",fontSize:13,fontWeight:700,color:p.color,lineHeight:1.2 }}>{p.name}</span>
                  <span style={{ display:"block",fontSize:10,color:dim,marginTop:2 }}>{p.sub}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Copy link */}
          <button
            onClick={()=>{ navigator.clipboard.writeText(`I scored ${iq} on the RealIQ Test! Top ${100-percentile}% of the population. https://realiqtest.co`); }}
            style={{ width:"100%",marginTop:12,padding:"10px 16px",background:"rgba(0,85,255,0.06)",border:`1px solid ${bord}`,borderRadius:8,cursor:"pointer",fontSize:11,color:dim,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            Copy shareable text to clipboard
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Results page ────────────────────────────────────────────────────────── */
export default function ResultsPage() {
  const router = useRouter();
  const [iq,        setIq]        = useState(0);
  const [label,     setLabel]     = useState("");
  const [percentile,setPercentile]= useState(0);
  const [score,     setScore]     = useState(0);
  const [total,     setTotal]     = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [userCountry,   setUserCountry]   = useState("");
  const [userGender,    setUserGender]    = useState("");
  const [userAge,       setUserAge]       = useState("");
  const [testsToday,    setTestsToday]    = useState(0);
  const [shareOpen,     setShareOpen]     = useState(false);
  const [shareImg,      setShareImg]      = useState("");
  const [shareLoading,  setShareLoading]  = useState(false);

  useEffect(() => {
    const s       = parseInt(localStorage.getItem("iq_score")       || "0");
    const t       = parseInt(localStorage.getItem("iq_total")       || "32");
    const weighted  = parseFloat(localStorage.getItem("iq_weighted")    || "0");
    const maxPoss   = parseFloat(localStorage.getItem("iq_maxPossible") || "1");
    const minPoss   = parseFloat(localStorage.getItem("iq_minPossible") || "-1");
    const final     = Math.max(78, Math.min(145, calculateIQWeighted(weighted, maxPoss, minPoss)));
    setScore(s); setTotal(t);
    setIq(final); setLabel(getIQLabel(final)); setPercentile(getPercentile(final));
    setUserCountry(localStorage.getItem("user_country") || "");
    setUserGender(localStorage.getItem("user_gender")   || "");
    setUserAge(localStorage.getItem("user_age")         || "");
    /* Real test counter — resets each calendar day */
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("tests_today_date");
    let count = parseInt(localStorage.getItem("tests_today") || "0");
    if (savedDate !== today) { count = 0; localStorage.setItem("tests_today_date", today); }
    count += 1;
    localStorage.setItem("tests_today", String(count));
    setTestsToday(count);
    const timer = setTimeout(() => setShowLeaderboard(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  const meterFill  = iq > 0 ? Math.round(((iq - 70) / 80) * 100) : 0;
  const catOffsets = [5, -2, -8, 3, -5, -12];
  const blue       = "#0055FF";
  const blue2      = "rgba(0,85,255,0.16)";
  const dim        = "#8AABCC";

  /* Share handler */
  async function handleShare() {
    if (shareImg) { setShareOpen(true); return; }
    setShareLoading(true);
    try {
      const dataUrl = await generateShareImage(iq, percentile, label);
      setShareImg(dataUrl);
      setShareOpen(true);
    } finally {
      setShareLoading(false);
    }
  }

  /* Personalised comparison */
  const personalPct = userCountry
    ? Math.min(99, Math.max(40, percentile + Math.round((Math.random() * 6) - 3)))
    : null;

  return (
    <div style={{ minHeight:"100dvh", background:"#050A14", color:"#D6E4FF" }}>
      {showLeaderboard && iq > 0 && (
        <LeaderboardPopup iq={iq} onClose={() => setShowLeaderboard(false)} />
      )}
      {shareOpen && shareImg && (
        <ShareModal img={shareImg} iq={iq} percentile={percentile} onClose={() => setShareOpen(false)} />
      )}

      {/* Nav */}
      <nav style={{ position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 24px",borderBottom:`1px solid ${blue2}`,background:"rgba(5,10,20,0.95)",backdropFilter:"blur(18px)" }}>
        <span style={{ fontSize:16,fontWeight:600,letterSpacing:"-0.02em" }}>Real<span style={{ color:blue }}>IQ</span>Test</span>
        <span style={{ fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:dim }}>Your Results</span>
      </nav>

      <div style={{ maxWidth:640,margin:"0 auto",padding:"48px 20px",textAlign:"center" }}>

        {/* IQ Score */}
        <p className="animate-fade-up" style={{ fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:dim,marginBottom:16 }}>
          Your RealIQ Score
        </p>
        <div className="animate-fade-up" style={{ fontSize:"clamp(80px,18vw,118px)",fontWeight:300,lineHeight:1,color:blue,letterSpacing:"-0.03em",textShadow:"0 0 60px rgba(0,85,255,0.45)",animationDelay:"80ms" }}>
          <AnimatedIQ target={iq} />
        </div>
        <p className="animate-fade-up" style={{ fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:dim,marginTop:8,animationDelay:"160ms" }}>
          Intelligence Quotient
        </p>

        {/* Label badge */}
        <div className="animate-fade-up" style={{ animationDelay:"220ms",marginTop:16,marginBottom:28 }}>
          <span style={{ display:"inline-block",fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",padding:"7px 20px",border:`1px solid ${blue}`,color:blue,boxShadow:"0 0 16px rgba(0,85,255,0.3)" }}>{label}</span>
        </div>

        {/* ── Share button ─────────────────────────────────────────────── */}
        {iq > 0 && (
          <div className="animate-fade-up" style={{ animationDelay:"250ms",marginBottom:24 }}>
            <button
              onClick={handleShare}
              disabled={shareLoading}
              style={{
                display:"inline-flex",alignItems:"center",gap:10,
                padding:"13px 28px",
                background:"linear-gradient(135deg,rgba(0,85,255,0.18),rgba(6,182,212,0.12))",
                border:"1px solid rgba(0,85,255,0.55)",
                borderRadius:10,cursor:"pointer",
                fontSize:14,fontWeight:700,color:"#E8F0FF",
                boxShadow:"0 0 28px rgba(0,85,255,0.22)",
                transition:"transform 150ms,box-shadow 150ms",
              }}
              onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)";(e.currentTarget as HTMLButtonElement).style.boxShadow="0 6px 32px rgba(0,85,255,0.4)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.transform="translateY(0)";(e.currentTarget as HTMLButtonElement).style.boxShadow="0 0 28px rgba(0,85,255,0.22)";}}
            >
              {shareLoading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" className="animate-spin">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0110 10" stroke="#06B6D4"/>
                  </svg>
                  Generating card…
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  Share your IQ
                </>
              )}
            </button>
            <p style={{ fontSize:10,color:"#6A88AA",marginTop:8 }}>Generate a shareable image · No account needed</p>
          </div>
        )}

        {/* IQ meter */}
        <div className="animate-fade-up" style={{ maxWidth:360,margin:"0 auto 16px",animationDelay:"280ms" }}>
          <div style={{ height:4,background:blue2,borderRadius:2,overflow:"hidden" }}>
            <div className="progress-neon" style={{ height:"100%",borderRadius:2,width:`${meterFill}%`,transition:"width 1.6s cubic-bezier(0.22,1,0.36,1)",transitionDelay:"400ms" }} />
          </div>
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:9,color:dim,marginTop:6,letterSpacing:"0.06em" }}>
            <span>70</span><span>Average (100)</span><span>145+</span>
          </div>
        </div>

        <p className="animate-fade-up" style={{ fontSize:13,color:dim,animationDelay:"340ms" }}>
          You answered {score} out of {total} questions correctly
        </p>
        <p className="animate-fade-up" style={{ fontSize:11,color:"#6A88AA",marginTop:6,maxWidth:340,margin:"6px auto 24px",animationDelay:"380ms" }}>
          This is an estimate based on performance. Not a certified clinical assessment.
        </p>

        {/* Personalised comparison line */}
        {personalPct !== null && userCountry && (
          <div className="animate-fade-up" style={{ animationDelay:"400ms",marginBottom:24,padding:"12px 18px",background:"rgba(0,85,255,0.06)",border:`1px solid rgba(0,85,255,0.3)`,borderRadius:8,textAlign:"center" }}>
            <p style={{ fontSize:13,lineHeight:1.6,color:"#D6E4FF" }}>
              You scored higher than{" "}
              <span style={{ background:"linear-gradient(90deg,#0055FF,#06B6D4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",fontWeight:700 }}>
                {personalPct}%
              </span>
              {" "}of {userGender ? (userGender === "man" ? "men" : userGender === "woman" ? "women" : "people") : "people"}
              {userAge ? ` aged ${userAge}` : ""}
              {` in ${userCountry}`}
            </p>
          </div>
        )}

        {/* BLURRED: Bell curve */}
        <div className="animate-fade-up" style={{ animationDelay:"420ms",marginBottom:20,background:"rgba(5,18,45,0.75)",border:`1px solid ${blue2}`,backdropFilter:"blur(14px)",borderRadius:8,padding:"20px 8px",filter:"blur(7px)",opacity:0.5,userSelect:"none",pointerEvents:"none" }}>
          <p style={{ fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:dim,marginBottom:14 }}>IQ Distribution — Normal Curve</p>
          {iq > 0 && <BellCurve iq={iq} />}
          <p style={{ fontSize:10,color:dim,marginTop:12 }}>You are in the <span style={{ color:blue,fontWeight:600 }}>{percentile}th percentile</span> of the population</p>
        </div>

        {/* BLURRED: Percentile card */}
        <div className="animate-fade-up" style={{ animationDelay:"450ms",marginBottom:20,background:"rgba(5,18,45,0.75)",border:`1px solid ${blue2}`,backdropFilter:"blur(14px)",borderRadius:8,padding:"24px",filter:"blur(7px)",opacity:0.5,userSelect:"none",pointerEvents:"none",textAlign:"center" }}>
          <p style={{ fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:dim,marginBottom:8 }}>Global Percentile Rank</p>
          <div style={{ fontSize:64,fontWeight:300,color:blue,lineHeight:1 }}>87<span style={{ fontSize:24 }}>th</span></div>
          <div style={{ height:4,background:blue2,borderRadius:2,overflow:"hidden",marginTop:16,maxWidth:280,margin:"16px auto 0" }}>
            <div style={{ height:"100%",width:"87%",background:"linear-gradient(90deg,#0055FF,#06B6D4)",borderRadius:2 }}/>
          </div>
        </div>

        {/* BLURRED: Radar chart */}
        <div className="animate-fade-up" style={{ animationDelay:"470ms",marginBottom:20,background:"rgba(5,18,45,0.75)",border:`1px solid ${blue2}`,backdropFilter:"blur(14px)",borderRadius:8,padding:"20px",filter:"blur(7px)",opacity:0.5,userSelect:"none",pointerEvents:"none",display:"flex",flexDirection:"column",alignItems:"center" }}>
          <p style={{ fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:dim,marginBottom:12 }}>Cognitive Radar — 6 Dimensions</p>
          <FakeRadarChart/>
          <div style={{ display:"flex",gap:12,marginTop:12,flexWrap:"wrap",justifyContent:"center" }}>
            {["Logic","Verbal","Spatial","Numerical","Memory","Speed"].map((l,i)=>(
              <span key={i} style={{ fontSize:9,color:dim }}>● {l}</span>
            ))}
          </div>
        </div>

        {/* BLURRED: ALL 6 category bars */}
        <div className="animate-fade-up" style={{ animationDelay:"490ms",marginBottom:24,textAlign:"left",filter:"blur(7px)",opacity:0.5,userSelect:"none",pointerEvents:"none" }}>
          <p style={{ fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:dim,marginBottom:14,textAlign:"center" }}>Score by category</p>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {CATEGORIES.map((cat, i) => {
              const catIQ = Math.min(145, Math.max(70, iq + catOffsets[i]));
              const barW  = Math.round(((catIQ - 70) / 80) * 100);
              return (
                <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"rgba(5,18,45,0.75)",border:`1px solid ${blue2}`,borderRadius:4 }}>
                  <span style={{ fontSize:12,color:dim,width:130,flexShrink:0 }}>{cat.name}</span>
                  <div style={{ flex:1,height:3,background:blue2,borderRadius:2,overflow:"hidden" }}>
                    <div className="progress-neon" style={{ height:"100%",borderRadius:2,width:`${barW}%` }} />
                  </div>
                  <span style={{ fontSize:13,color:blue,fontWeight:600,width:32,textAlign:"right" }}>{catIQ}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ PREMIUM UPSELL ══ */}
        <div className="animate-fade-up" style={{
          animationDelay:"560ms", marginBottom:28,
          background:"linear-gradient(135deg,rgba(0,85,255,0.12),rgba(6,182,212,0.06))",
          border:"1px solid rgba(0,85,255,0.45)",
          borderRadius:14,overflow:"hidden",
          boxShadow:"0 0 50px rgba(0,85,255,0.12),0 4px 32px rgba(0,0,0,0.4)",
        }}>
          {/* Top urgency bar */}
          <div style={{ background:"rgba(0,85,255,0.15)",borderBottom:"1px solid rgba(0,85,255,0.3)",padding:"8px 20px",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span style={{ fontSize:10,color:"#06B6D4",letterSpacing:"0.14em",fontWeight:600 }}>Your results are saved for 24 hours</span>
          </div>

          <div style={{ padding:"28px 24px" }}>
            {/* Hook */}
            <p style={{ fontSize:16,fontWeight:700,color:"#E2EEFF",lineHeight:1.5,marginBottom:20,textAlign:"left" }}>
              You have a critical weakness in one of your 6 cognitive dimensions.{" "}
              <span style={{ background:"linear-gradient(90deg,#0055FF,#06B6D4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
                Find out which one — and how to fix it.
              </span>
            </p>

            {/* Price */}
            <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:20,textAlign:"left" }}>
              <div>
                <span style={{ fontSize:13,color:"#6A88AA",textDecoration:"line-through",display:"block",marginBottom:2 }}>€9.99</span>
                <span style={{ fontSize:38,fontWeight:800,background:"linear-gradient(135deg,#0055FF,#06B6D4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",letterSpacing:"-0.03em" }}>€1.99</span>
              </div>
              <span style={{ fontSize:10,background:"rgba(16,185,129,0.12)",color:"#10B981",border:"1px solid rgba(16,185,129,0.3)",padding:"4px 10px",borderRadius:99,fontWeight:700,letterSpacing:"0.1em" }}>−80%</span>
            </div>

            {/* Checklist */}
            <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:24,textAlign:"left" }}>
              {[
                "Full radar chart across all 6 cognitive dimensions",
                "Identify your specific cognitive weakness",
                "Personalised improvement roadmap for each skill",
                "Career matches based on your cognitive profile",
                "Premium Intelligence Leaderboard access",
                "Official PDF certificate of your IQ",
              ].map((item,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <CheckIcon/>
                  <span style={{ fontSize:13,color:"#C4D8F0" }}>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => router.push("/report")}
              style={{
                width:"100%",padding:"20px 24px",
                background:"linear-gradient(135deg,#0055FF 0%,#0099CC 50%,#06B6D4 100%)",
                border:"none",borderRadius:10,
                fontSize:17,fontWeight:800,color:"#fff",
                cursor:"pointer",
                boxShadow:"0 6px 32px rgba(0,85,255,0.55),0 0 80px rgba(0,85,255,0.2),inset 0 1px 0 rgba(255,255,255,0.15)",
                transition:"transform 150ms,box-shadow 150ms",
                letterSpacing:"-0.02em",
              }}
              onMouseEnter={e=>{(e.target as HTMLButtonElement).style.transform="translateY(-2px)";(e.target as HTMLButtonElement).style.boxShadow="0 10px 40px rgba(0,85,255,0.65),0 0 100px rgba(6,182,212,0.25)";}}
              onMouseLeave={e=>{(e.target as HTMLButtonElement).style.transform="translateY(0)";(e.target as HTMLButtonElement).style.boxShadow="0 6px 32px rgba(0,85,255,0.55),0 0 80px rgba(0,85,255,0.2)";}}
            >
              Reveal My Full Report — €1.99
            </button>

            {/* Scientific badges */}
            <div style={{ display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginTop:16 }}>
              {["Scientifically calibrated","6 cognitive dimensions","Visual pattern recognition"].map((badge,i)=>(
                <span key={i} style={{ fontSize:10,color:"#8AABCC",background:"rgba(0,85,255,0.08)",border:"1px solid rgba(0,85,255,0.22)",padding:"4px 10px",borderRadius:99 }}>
                  <span style={{ color:"#06B6D4",fontWeight:700,marginRight:4 }}>✓</span>{badge}
                </span>
              ))}
            </div>

            {/* Urgency */}
            <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:14 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span style={{ fontSize:11,color:"#06B6D4",fontWeight:600 }}>Your detailed cognitive breakdown expires in 24h</span>
            </div>
          </div>
        </div>

        {/* Retry button */}
        <div className="animate-fade-up" style={{ display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",animationDelay:"800ms" }}>
          <button onClick={() => router.push("/test")} className="btn btn-outline">Retry</button>
        </div>
        <p style={{ fontSize:10,color:"#6A88AA",marginTop:16 }}>No subscription · One-time payment · Instant access</p>
      </div>
    </div>
  );
}
