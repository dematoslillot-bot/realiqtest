"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateIQ, getIQLabel, getPercentile, getCategoryResults } from "@/lib/iq-calculator";

export default function ReportPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<"pay" | "processing" | "report">("pay");
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [iq, setIq] = useState(0);
  const [label, setLabel] = useState("");
  const [percentile, setPercentile] = useState(0);
  const [catResults, setCatResults] = useState<any[]>([]);

  useEffect(() => {
    const s = parseInt(localStorage.getItem("iq_score") || "0");
    const t = parseInt(localStorage.getItem("iq_total") || "30");
    const cs = JSON.parse(localStorage.getItem("iq_catScores") || "[0,0,0,0,0,0]");
    const ct = JSON.parse(localStorage.getItem("iq_catTotals") || "[0,0,0,0,0,0]");
    const iqVal = calculateIQ(s, t);
    setIq(iqVal);
    setLabel(getIQLabel(iqVal));
    setPercentile(getPercentile(iqVal));
    setCatResults(getCategoryResults(iqVal, cs, ct));
  }, []);

  function formatCard(val: string) {
    return val.replace(/\D/g, "").substring(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(val: string) {
    const v = val.replace(/\D/g, "");
    if (v.length >= 2) return v.substring(0, 2) + " / " + v.substring(2, 4);
    return v;
  }
  async function handlePay() {
    const newErrors: Record<string, boolean> = {};
    if (!email) newErrors.email = true;
    if (card.length < 19) newErrors.card = true;
    if (!consent) newErrors.consent = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setScreen("processing");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setScreen("pay");
      }
    } catch {
      setScreen("pay");
    }
  }

  const pctFill = Math.round(((iq - 70) / 80) * 100);

  const CAREERS: Record<string, string[]> = {
    "Genius": ["Research Scientist", "Neurosurgeon", "Aerospace Engineer", "Theoretical Physicist", "Philosophy Professor"],
    "Very Superior": ["Software Architect", "Medical Doctor", "Financial Analyst", "Lawyer", "University Professor"],
    "Superior": ["Engineer", "Data Scientist", "Psychologist", "Architect", "Journalist"],
    "High Average": ["Teacher", "Nurse", "Marketing Manager", "Project Manager", "Accountant"],
    "Average": ["Technician", "Sales Manager", "Designer", "Police Officer", "Chef"],
    "Low Average": ["Logistics Coordinator", "Administrative Assistant", "Customer Service", "Retail Manager", "Driver"],
    "Below Average": ["Warehouse Operative", "Delivery Driver", "Cleaner", "Cashier", "Factory Worker"],
  };

  const FAMOUS: Record<string, { name: string; iq: number; field: string }[]> = {
    "Genius": [{ name: "Stephen Hawking", iq: 160, field: "Physics" }, { name: "Elon Musk", iq: 155, field: "Tech/Business" }],
    "Very Superior": [{ name: "Bill Gates", iq: 160, field: "Tech" }, { name: "Barack Obama", iq: 137, field: "Politics" }],
    "Superior": [{ name: "Arnold Schwarzenegger", iq: 135, field: "Actor/Politician" }, { name: "Quentin Tarantino", iq: 160, field: "Cinema" }],
    "High Average": [{ name: "Average College Graduate", iq: 115, field: "Various" }, { name: "Most Professionals", iq: 112, field: "Various" }],
    "Average": [{ name: "Average Adult", iq: 100, field: "General Population" }, { name: "High School Graduate", iq: 98, field: "Education" }],
    "Low Average": [{ name: "Below Average Graduate", iq: 88, field: "General" }, { name: "General Population Low", iq: 85, field: "General" }],
    "Below Average": [{ name: "General Population", iq: 78, field: "General" }, { name: "Basic Skills Level", iq: 75, field: "General" }],
  };

  const TIPS: Record<string, string> = {
    "Logical Reasoning": "Practice daily logic puzzles and Sudoku. Apps like Lumosity or BrainHQ target this directly. Try to solve at least one logic problem per day.",
    "Verbal Intelligence": "Read widely — fiction, non-fiction, news. Learn 5 new words per week. Do crosswords and word association games regularly.",
    "Spatial Reasoning": "Play 3D puzzle games like Tetris or Monument Valley. Practice mental rotation exercises. Drawing and sketching also trains spatial thinking.",
    "Numerical Ability": "Practice mental arithmetic daily. Use apps like Mathway. Challenge yourself with percentage calculations in everyday situations.",
    "Working Memory": "Try the dual n-back exercise (free at brainworkshop.net). Memorise phone numbers, poems or shopping lists without writing them down.",
    "Processing Speed": "Play reaction-based games. Practice timed arithmetic. Speed reading exercises also help train your brain to process faster.",
  };

  const RADAR_CATS = ["Logic", "Verbal", "Spatial", "Numerical", "Memory", "Speed"];

  if (screen === "processing") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-[#f0ede8] flex flex-col">
        <nav className="flex items-center justify-between px-8 py-4 border-b border-[rgba(201,169,110,0.2)] bg-[#111118]">
          <span className="font-serif text-lg font-bold text-[#c9a96e]">Real<span className="text-[#f0ede8]">IQ</span>Test</span>
          <span className="text-xs text-[#8a8890]">Processing payment...</span>
        </nav>
        <div className="flex-1 flex items-center justify-center text-center px-6">
          <div>
            <div className="w-12 h-12 border-2 border-[rgba(201,169,110,0.2)] border-t-[#c9a96e] rounded-full animate-spin mx-auto mb-6" />
            <h3 className="font-serif text-2xl font-bold mb-2">Generating your premium report</h3>
            <p className="text-sm text-[#8a8890] mt-1">Analysing all 6 cognitive dimensions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "report") {
    const careers = CAREERS[label] || CAREERS["Average"];
    const famous = FAMOUS[label] || FAMOUS["Average"];
    const radarValues = catResults.map(c => Math.round(((c.iq - 70) / 80) * 100));
    const cx = 160; const cy = 160; const r = 110;
    const angles = RADAR_CATS.map((_, i) => (i * 60 - 90) * (Math.PI / 180));
    const points = radarValues.map((v, i) => ({
      x: cx + (r * v / 100) * Math.cos(angles[i]),
      y: cy + (r * v / 100) * Math.sin(angles[i]),
    }));
    const polyPoints = points.map(p => `${p.x},${p.y}`).join(" ");
    const gridPoints = (pct: number) => angles.map(a => `${cx + r * pct * Math.cos(a)},${cy + r * pct * Math.sin(a)}`).join(" ");

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-[#f0ede8]">
        <nav className="flex items-center justify-between px-8 py-4 border-b border-[rgba(201,169,110,0.2)] bg-[#111118]">
          <span className="font-serif text-lg font-bold text-[#c9a96e]">Real<span className="text-[#f0ede8]">IQ</span>Test</span>
          <span className="text-xs text-[#1d9e75]">✓ Premium Report Unlocked</span>
        </nav>
        <div className="max-w-2xl mx-auto px-6 py-12">

          {/* IQ Header */}
          <div className="text-center mb-12 pb-10 border-b border-[rgba(201,169,110,0.2)]">
            <p className="text-xs tracking-widest uppercase text-[#1d9e75] mb-4">✓ Full Premium Report — Unlocked</p>
            <div className="font-serif text-8xl font-black text-[#c9a96e] leading-none">{iq}</div>
            <p className="text-xs tracking-widest uppercase text-[#8a8890] mt-3">Intelligence Quotient</p>
            <div className="inline-block mt-4 border border-[#c9a96e] text-[#c9a96e] px-5 py-1.5 rounded-sm text-sm">{label}</div>
            <div className="max-w-sm mx-auto mt-6">
              <div className="h-1 bg-[rgba(201,169,110,0.12)] rounded-full overflow-hidden">
                <div className="h-full bg-[#c9a96e] rounded-full" style={{ width: `${pctFill}%` }} />
              </div>
              <div className="flex justify-between text-xs text-[#8a8890] mt-1"><span>70</span><span>Average (100)</span><span>145+</span></div>
            </div>
          </div>

          {/* Percentile */}
          <div className="mb-10">
            <h2 className="font-serif text-xl font-bold mb-5 flex items-center gap-4">Global percentile rank<span className="flex-1 h-px bg-[rgba(201,169,110,0.2)]" /></h2>
            <div className="bg-[#111118] border border-[rgba(201,169,110,0.2)] rounded p-6 text-center">
              <div className="font-serif text-6xl font-black text-[#c9a96e]">{percentile}th</div>
              <p className="text-sm text-[#8a8890] mt-2">percentile — better than {percentile}% of all test takers</p>
              <div className="mt-5 h-1.5 bg-[rgba(201,169,110,0.1)] rounded-full relative overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[rgba(29,158,117,0.5)] to-[#c9a96e] rounded-full" style={{ width: `${pctFill}%` }} />
              </div>
              <div className="flex justify-between text-xs text-[#8a8890] mt-1"><span>1st</span><span>50th</span><span>99th</span></div>
              <p className="text-sm text-[#8a8890] mt-4 leading-relaxed max-w-sm mx-auto">
                {percentile >= 90 ? `Your score places you in the top ${100 - percentile}% of the global population. You demonstrate strong analytical and abstract reasoning capabilities.` : `Your score places you at the ${percentile}th percentile — higher than ${percentile}% of all people who have taken this test.`}
              </p>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="mb-10">
            <h2 className="font-serif text-xl font-bold mb-5 flex items-center gap-4">Cognitive radar<span className="flex-1 h-px bg-[rgba(201,169,110,0.2)]" /></h2>
            <div className="bg-[#111118] border border-[rgba(201,169,110,0.2)] rounded p-6 flex justify-center">
              <svg width="320" height="320" viewBox="0 0 320 320">
                {[0.25, 0.5, 0.75, 1].map((pct, i) => (
                  <polygon key={i} points={gridPoints(pct)} fill="none" stroke="rgba(201,169,110,0.15)" strokeWidth="0.5" />
                ))}
                {angles.map((a, i) => (
                  <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="rgba(201,169,110,0.1)" strokeWidth="0.5" />
                ))}
                <polygon points={polyPoints} fill="rgba(201,169,110,0.15)" stroke="#c9a96e" strokeWidth="1.5" />
                {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#c9a96e" />)}
                {RADAR_CATS.map((label, i) => {
                  const lx = cx + (r + 22) * Math.cos(angles[i]);
                  const ly = cy + (r + 22) * Math.sin(angles[i]);
                  return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#8a8890" fontSize="10" fontFamily="DM Sans, sans-serif">{label}</text>;
                })}
              </svg>
            </div>
          </div>

          {/* All categories */}
          <div className="mb-10">
            <h2 className="font-serif text-xl font-bold mb-5 flex items-center gap-4">Breakdown by category<span className="flex-1 h-px bg-[rgba(201,169,110,0.2)]" /></h2>
            <div className="flex flex-col gap-3">
              {catResults.map((cat, i) => (
                <div key={i} className="bg-[#111118] border border-[rgba(201,169,110,0.2)] rounded p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs tracking-widest uppercase px-2 py-0.5 rounded-sm ${cat.badge === "strong" ? "bg-[rgba(29,158,117,0.1)] text-[#1d9e75] border border-[rgba(29,158,117,0.3)]" : cat.badge === "avg" ? "bg-[rgba(201,169,110,0.1)] text-[#c9a96e] border border-[rgba(201,169,110,0.2)]" : "bg-[rgba(226,75,74,0.1)] text-[#e24b4a] border border-[rgba(226,75,74,0.3)]"}`}>
                        {cat.badge === "strong" ? "Strength" : cat.badge === "avg" ? "Average" : "Develop"}
                      </span>
                      <span className="font-serif text-xl font-bold text-[#c9a96e]">{cat.iq}</span>
                    </div>
                  </div>
                  <div className="h-0.5 bg-[rgba(201,169,110,0.1)] rounded-full mb-2">
                    <div className="h-full bg-[#c9a96e] rounded-full" style={{ width: `${Math.round(((cat.iq - 70) / 80) * 100)}%` }} />
                  </div>
                  <p className="text-xs text-[#8a8890] leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips to improve */}
          <div className="mb-10">
            <h2 className="font-serif text-xl font-bold mb-5 flex items-center gap-4">How to improve<span className="flex-1 h-px bg-[rgba(201,169,110,0.2)]" /></h2>
            <div className="flex flex-col gap-3">
              {catResults.map((cat, i) => (
                <div key={i} className="bg-[#111118] border border-[rgba(201,169,110,0.2)] rounded p-4">
                  <p className="text-sm font-medium mb-1 text-[#c9a96e]">{cat.name}</p>
                  <p className="text-xs text-[#8a8890] leading-relaxed">{TIPS[cat.name]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Careers */}
          <div className="mb-10">
            <h2 className="font-serif text-xl font-bold mb-5 flex items-center gap-4">Best career matches<span className="flex-1 h-px bg-[rgba(201,169,110,0.2)]" /></h2>
            <div className="bg-[#111118] border border-[rgba(201,169,110,0.2)] rounded p-5">
              <p className="text-xs text-[#8a8890] leading-relaxed mb-4">Based on your IQ profile and cognitive strengths, these careers typically align well with your intellectual capabilities:</p>
              <div className="grid grid-cols-2 gap-2">
                {careers.map((career, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-[#c9a96e]">→</span>
                    <span>{career}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Famous comparisons */}
          <div className="mb-10">
            <h2 className="font-serif text-xl font-bold mb-5 flex items-center gap-4">IQ comparisons<span className="flex-1 h-px bg-[rgba(201,169,110,0.2)]" /></h2>
            <div className="bg-[#111118] border border-[rgba(201,169,110,0.2)] rounded p-5">
              <p className="text-xs text-[#8a8890] mb-4">People with a similar IQ range to yours:</p>
              <div className="flex flex-col gap-3">
                {famous.map((f, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[rgba(201,169,110,0.1)] last:border-0">
                    <div>
                      <p className="text-sm font-medium">{f.name}</p>
                      <p className="text-xs text-[#8a8890]">{f.field}</p>
                    </div>
                    <div className="font-serif text-xl font-bold text-[#c9a96e]">~{f.iq}</div>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2 mt-1 bg-[rgba(201,169,110,0.05)] rounded px-3">
                  <div>
                    <p className="text-sm font-medium text-[#c9a96e]">You</p>
                    <p className="text-xs text-[#8a8890]">RealIQTest result</p>
                  </div>
                  <div className="font-serif text-xl font-bold text-[#c9a96e]">{iq}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate */}
          <div className="mb-10">
            <h2 className="font-serif text-xl font-bold mb-5 flex items-center gap-4">Certificate<span className="flex-1 h-px bg-[rgba(201,169,110,0.2)]" /></h2>
            <div className="bg-[#111118] border border-[rgba(201,169,110,0.2)] rounded p-10 text-center relative overflow-hidden">
              <div className="absolute top-3 left-3 w-14 h-14 border-l border-t border-[rgba(201,169,110,0.3)]" />
              <div className="absolute top-3 right-3 w-14 h-14 border-r border-t border-[rgba(201,169,110,0.3)]" />
              <div className="absolute bottom-3 left-3 w-14 h-14 border-l border-b border-[rgba(201,169,110,0.3)]" />
              <div className="absolute bottom-3 right-3 w-14 h-14 border-r border-b border-[rgba(201,169,110,0.3)]" />
              <p className="text-xs tracking-widest uppercase text-[#8a8890] mb-2">RealIQTest · Official Certificate</p>
              <p className="font-serif text-lg mb-1">This certifies an IQ score of</p>
              <div className="font-serif text-6xl font-black text-[#c9a96e]">{iq}</div>
              <p className="font-serif text-lg mt-1">{label}</p>
              <p className="text-xs text-[#8a8890] mt-4">Top {100 - percentile}% of global population · {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })} · RealIQTest.com</p>
            </div>
            <div className="text-center mt-5 flex justify-center gap-3">
              <button className="text-xs tracking-widest uppercase text-[#8a8890] hover:text-[#f0ede8] border border-[rgba(240,237,232,0.15)] px-6 py-2.5 rounded-sm transition-colors">↓ Download PDF</button>
              <button onClick={() => router.push("/test")} className="bg-[#c9a96e] text-[#0a0a0f] px-6 py-2.5 text-xs font-medium tracking-widest uppercase rounded-sm hover:bg-[#e8c98a] transition-colors">Take Test Again</button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Payment screen
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0ede8]">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-[rgba(201,169,110,0.2)] bg-[#111118]">
        <span className="font-serif text-lg font-bold text-[#c9a96e]">Real<span className="text-[#f0ede8]">IQ</span>Test</span>
        <span className="text-xs text-[#8a8890]">🔒 Secure Checkout</span>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#c9a96e] mb-3">Premium Cognitive Report</p>
          <h1 className="font-serif text-3xl font-bold leading-tight mb-4">Unlock your complete <em className="text-[#c9a96e]">intelligence profile</em></h1>
          <p className="text-sm text-[#8a8890] leading-relaxed mb-7">Your free result shows your overall IQ. The premium report gives you everything — detailed breakdown, career matches, improvement tips, famous IQ comparisons and your official certificate.</p>
          <div className="flex flex-col gap-3 mb-7">
            {[
              "Full breakdown across all 6 cognitive categories",
              "Cognitive radar chart — visualise your mind",
              "Percentile rank vs 2.4 million users",
              "Best career matches for your IQ profile",
              "Personalised tips to improve each category",
              "Famous IQ comparisons",
              "Official downloadable PDF certificate",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-[#111118] border border-[rgba(201,169,110,0.2)] rounded">
                <div className="w-5 h-5 min-w-[20px] rounded-full bg-[rgba(29,158,117,0.15)] border border-[rgba(29,158,117,0.3)] flex items-center justify-center text-[#1d9e75] text-xs mt-0.5">✓</div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 flex-wrap text-xs text-[#8a8890]">
            <span>🔒 256-bit SSL</span><span>⚡ Instant access</span><span>✓ No subscription</span><span>🌍 2.4M+ users</span>
          </div>
        </div>
        <div className="bg-[#111118] border border-[rgba(201,169,110,0.2)] rounded-lg overflow-hidden">
          <div className="flex justify-between items-center px-6 py-5 border-b border-[rgba(201,169,110,0.2)]">
            <div>
              <p className="text-xs tracking-widest uppercase text-[#8a8890] mb-1">Premium Report — One time</p>
              <div className="flex items-baseline gap-2">
                <span className="text-sm line-through text-[#8a8890]">€9.99</span>
                <span className="font-serif text-3xl font-bold text-[#c9a96e]">€4.99</span>
                <span className="text-xs bg-[rgba(29,158,117,0.15)] text-[#1d9e75] border border-[rgba(29,158,117,0.3)] px-2 py-0.5 rounded-sm">Save 50%</span>
              </div>
            </div>
            <div className="flex gap-2">
              {["VISA","MC","AMEX"].map(c => <span key={c} className="text-xs px-2 py-1 bg-[rgba(240,237,232,0.06)] border border-[rgba(201,169,110,0.2)] rounded text-[#8a8890]">{c}</span>)}
            </div>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-widest uppercase text-[#8a8890]">Email address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com"
                className={`bg-[#1a1a26] border rounded px-3 py-2.5 text-sm text-[#f0ede8] outline-none placeholder-[#8a8890] focus:border-[#c9a96e] transition-colors ${errors.email ? "border-[#e24b4a]" : "border-[rgba(201,169,110,0.25)]"}`} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-widest uppercase text-[#8a8890]">Card number</label>
              <input value={card} onChange={e => setCard(formatCard(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19}
                className={`bg-[#1a1a26] border rounded px-3 py-2.5 text-sm text-[#f0ede8] outline-none placeholder-[#8a8890] focus:border-[#c9a96e] transition-colors ${errors.card ? "border-[#e24b4a]" : "border-[rgba(201,169,110,0.25)]"}`} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs tracking-widest uppercase text-[#8a8890]">Expiry</label>
                <input value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} placeholder="MM / YY" maxLength={7}
                  className="bg-[#1a1a26] border border-[rgba(201,169,110,0.25)] rounded px-3 py-2.5 text-sm text-[#f0ede8] outline-none placeholder-[#8a8890] focus:border-[#c9a96e] transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs tracking-widest uppercase text-[#8a8890]">CVC</label>
                <input value={cvc} onChange={e => setCvc(e.target.value)} placeholder="123" maxLength={3}
                  className="bg-[#1a1a26] border border-[rgba(201,169,110,0.25)] rounded px-3 py-2.5 text-sm text-[#f0ede8] outline-none placeholder-[#8a8890] focus:border-[#c9a96e] transition-colors" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-widest uppercase text-[#8a8890]">Name on card</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
                className="bg-[#1a1a26] border border-[rgba(201,169,110,0.25)] rounded px-3 py-2.5 text-sm text-[#f0ede8] outline-none placeholder-[#8a8890] focus:border-[#c9a96e] transition-colors" />
            </div>
            <label className={`flex items-start gap-3 p-3 rounded cursor-pointer border ${errors.consent ? "border-[#e24b4a] bg-[rgba(226,75,74,0.05)]" : "border-[rgba(201,169,110,0.2)] bg-[rgba(201,169,110,0.04)]"}`}>
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 accent-[#c9a96e]" />
              <span className="text-xs text-[#8a8890] leading-relaxed"><strong className="text-[#f0ede8]">I understand this is a digital product with immediate access.</strong> Refunds are only available in case of a technical error preventing access to the report.</span>
            </label>
            <button onClick={handlePay}
              className={`w-full py-3 text-sm font-medium tracking-widest uppercase rounded transition-all ${consent ? "bg-[#c9a96e] text-[#0a0a0f] hover:bg-[#e8c98a]" : "bg-[#c9a96e] text-[#0a0a0f] opacity-40 cursor-not-allowed"}`}>
              Pay €4.99 — Unlock Premium Report
            </button>
            <p className="text-center text-xs text-[#8a8890]">🔒 Powered by Stripe · Your card data is never stored</p>
            <p className="text-center text-xs text-[#8a8890]">No subscription · One-time payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}