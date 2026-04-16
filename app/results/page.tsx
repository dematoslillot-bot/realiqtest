"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateIQ, getIQLabel, getPercentile } from "@/lib/iq-calculator";
import { CATEGORIES } from "@/lib/questions";

export default function ResultsPage() {
  const router = useRouter();
  const [iq, setIq] = useState(0);
  const [label, setLabel] = useState("");
  const [percentile, setPercentile] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [catScores, setCatScores] = useState([0, 0, 0, 0, 0, 0]);
  const [catTotals, setCatTotals] = useState([0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const s = parseInt(localStorage.getItem("iq_score") || "0");
    const t = parseInt(localStorage.getItem("iq_total") || "52");
    const cs = JSON.parse(localStorage.getItem("iq_catScores") || "[0,0,0,0,0,0]");
    const ct = JSON.parse(localStorage.getItem("iq_catTotals") || "[0,0,0,0,0,0]");
    const calculatedIQ = calculateIQ(s, t);
    setScore(s);
    setTotal(t);
    setCatScores(cs);
    setCatTotals(ct);
    setIq(calculatedIQ);
    setLabel(getIQLabel(calculatedIQ));
    setPercentile(getPercentile(calculatedIQ));
  }, []);

  const meterFill = Math.round(((iq - 70) / 80) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0ede8]">
      <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 border-b border-[rgba(201,169,110,0.2)] bg-[#111118]">
        <span className="font-serif text-lg font-bold text-[#c9a96e]">Real<span className="text-[#f0ede8]">IQ</span>Test</span>
        <span className="text-xs tracking-widest uppercase text-[#8a8890]">Your Results</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        {/* IQ Score */}
        <p className="text-xs tracking-widest uppercase text-[#8a8890] mb-3 animate-fade-up" style={{ animationDelay: '60ms' }}>Your RealIQ Result</p>
        <div
          className={`font-serif text-8xl font-black text-[#c9a96e] leading-none transition-[opacity] duration-300 ${iq > 0 ? 'animate-fade-up' : 'opacity-0'}`}
          style={{ animationDelay: '120ms' }}
        >
          {iq || ''}
        </div>
        <p className="text-xs tracking-widest uppercase text-[#8a8890] mt-3 animate-fade-up" style={{ animationDelay: '180ms' }}>Intelligence Quotient</p>
        <div
          className={`inline-block mt-4 border border-[#c9a96e] text-[#c9a96e] px-5 py-1.5 rounded-sm text-sm transition-[opacity] duration-300 ${iq > 0 ? 'animate-scale-in' : 'opacity-0'}`}
          style={{ animationDelay: '240ms' }}
        >
          {label}
        </div>

        {/* Meter */}
        <div className="max-w-sm mx-auto mt-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
          <div className="h-1 bg-[rgba(201,169,110,0.12)] rounded-full overflow-hidden">
            <div className="h-full bg-[#c9a96e] rounded-full transition-[width] duration-1000 ease-out" style={{ width: `${meterFill}%` }} />
          </div>
          <div className="flex justify-between text-xs text-[#8a8890] mt-1">
            <span>70</span><span>Average (100)</span><span>145+</span>
          </div>
        </div>

        <p className="text-sm text-[#8a8890] mt-4 animate-fade-up" style={{ animationDelay: '360ms' }}>You scored {score} out of {total} questions</p>

        {/* Category preview — blurred after 3 */}
        <div className="mt-10 text-left animate-fade-up" style={{ animationDelay: '420ms' }}>
          <p className="text-xs tracking-widest uppercase text-[#8a8890] mb-4">Score by category</p>
          <div className="flex flex-col gap-3">
            {CATEGORIES.map((cat, i) => {
              const catIQ = Math.min(145, Math.max(70, iq + [5, -2, -8, 3, -5, -12][i]));
              const barW = Math.round(((catIQ - 70) / 80) * 100);
              const blurred = i >= 3;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-3 bg-[#111118] border border-[rgba(201,169,110,0.2)] rounded animate-fade-up ${blurred ? "blur-sm opacity-40 select-none" : ""}`}
                  style={{ animationDelay: `${460 + i * 55}ms` }}
                >
                  <span className="text-sm text-[#8a8890] w-36">{cat.name}</span>
                  <div className="flex-1 h-0.5 bg-[rgba(201,169,110,0.1)] rounded-full">
                    <div className="h-full bg-[#c9a96e] rounded-full" style={{ width: `${barW}%` }} />
                  </div>
                  <span className="text-sm text-[#c9a96e] font-serif font-bold w-8 text-right">{catIQ}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[#8a8890] text-center mt-3">Bottom 3 categories locked in free report</p>
        </div>

        {/* Unlock CTA */}
        <div className="mt-8 p-5 bg-[rgba(201,169,110,0.04)] border border-dashed border-[rgba(201,169,110,0.2)] rounded text-left animate-fade-up" style={{ animationDelay: '760ms' }}>
          <p className="text-sm font-medium text-[#c9a96e] mb-1">Unlock your Full Cognitive Report — <span className="line-through text-[#8a8890] mr-2">€9.99</span>€5.99</p>
          <p className="text-xs text-[#8a8890] leading-relaxed">Detailed breakdown of all 6 categories · Percentile rank vs 2.4M users · Cognitive strengths & weaknesses · Downloadable PDF certificate</p>
        </div>

        <div className="mt-6 flex gap-3 justify-center animate-fade-up" style={{ animationDelay: '820ms' }}>
          <button onClick={() => router.push("/report")}
            className="bg-[#c9a96e] text-[#0a0a0f] px-8 py-3 text-sm font-medium tracking-widest uppercase rounded-sm hover:bg-[#e8c98a] active:scale-[0.97] transition-[background-color,transform] duration-150">
            Unlock Full Report — <span className="line-through text-[rgba(10,10,15,0.5)] mr-1">€9.99</span>€5.99
          </button>
          <button onClick={() => router.push("/test")}
            className="border border-[rgba(240,237,232,0.2)] text-[#f0ede8] px-6 py-3 text-sm rounded-sm hover:border-[#c9a96e] hover:text-[#c9a96e] active:scale-[0.97] transition-[color,border-color,transform] duration-150">
            Retry
          </button>
        </div>

        <p className="text-xs text-[#8a8890] mt-4">No subscription · One-time payment · Instant access</p>
      </div>
    </div>
  );
}
