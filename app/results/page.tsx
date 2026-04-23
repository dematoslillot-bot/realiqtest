"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { calculateIQ, getIQLabel, getPercentile } from "@/lib/iq-calculator";
import { CATEGORIES } from "@/lib/questions";

function AnimatedIQ({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);
  const ran = useRef(false);

  useEffect(() => {
    if (!target || ran.current) return;
    ran.current = true;
    const dur = 1800;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
      else setDisplay(target);
    };
    requestAnimationFrame(tick);
  }, [target]);

  return <>{display || ""}</>;
}

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
    const t = parseInt(localStorage.getItem("iq_total") || "30");
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

  const meterFill = iq > 0 ? Math.round(((iq - 70) / 80) * 100) : 0;
  const catOffsets = [5, -2, -8, 3, -5, -12];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0ede8]">
      <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 border-b border-[rgba(201,169,110,0.2)] bg-[#111118]">
        <span className="font-serif text-lg font-bold text-[#c9a96e]">
          Real<span className="text-[#f0ede8]">IQ</span>Test
        </span>
        <span className="text-xs tracking-widest uppercase text-[#8a8890]">Your Results</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12 text-center">

        {/* IQ Score — animated */}
        <p className="text-xs tracking-widest uppercase text-[#8a8890] mb-4 animate-fade-up">
          Your RealIQ Score
        </p>
        <div
          className="font-serif leading-none animate-fade-up"
          style={{
            fontSize: "clamp(80px, 18vw, 120px)",
            color: "#c9a96e",
            animationDelay: "80ms",
            textShadow: "0 0 60px rgba(201,169,110,0.25)",
          }}
        >
          <AnimatedIQ target={iq} />
        </div>
        <p className="text-xs tracking-widest uppercase text-[#8a8890] mt-3 animate-fade-up" style={{ animationDelay: "160ms" }}>
          Intelligence Quotient
        </p>
        <div
          className="inline-block mt-4 border border-[#c9a96e] text-[#c9a96e] px-5 py-1.5 text-sm tracking-widest animate-fade-up"
          style={{ animationDelay: "220ms" }}
        >
          {label}
        </div>

        {/* IQ Meter */}
        <div className="max-w-sm mx-auto mt-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <div className="h-1 bg-[rgba(201,169,110,0.12)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c9a96e] rounded-full"
              style={{
                width: `${meterFill}%`,
                transition: "width 1.4s cubic-bezier(0.22,1,0.36,1)",
                transitionDelay: "400ms",
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#8a8890] mt-1.5">
            <span>70</span><span>Average (100)</span><span>145+</span>
          </div>
        </div>

        <p className="text-sm text-[#8a8890] mt-4 animate-fade-up" style={{ animationDelay: "360ms" }}>
          You answered {score} out of {total} questions correctly
        </p>

        {/* Score disclaimer */}
        <p className="text-xs text-[#555] mt-2 animate-fade-up max-w-sm mx-auto" style={{ animationDelay: "400ms" }}>
          This is an estimate based on your performance. Not a certified clinical assessment.
        </p>

        {/* Category preview */}
        <div className="mt-10 text-left animate-fade-up" style={{ animationDelay: "420ms" }}>
          <p className="text-xs tracking-widest uppercase text-[#8a8890] mb-4">Score by category</p>
          <div className="flex flex-col gap-3">
            {CATEGORIES.map((cat, i) => {
              const catIQ = Math.min(145, Math.max(70, iq + catOffsets[i]));
              const barW = Math.round(((catIQ - 70) / 80) * 100);
              const blurred = i >= 3;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-3 bg-[#111118] border border-[rgba(201,169,110,0.2)] rounded animate-fade-up ${blurred ? "blur-sm opacity-35 select-none pointer-events-none" : ""}`}
                  style={{ animationDelay: `${460 + i * 55}ms` }}
                >
                  <span className="text-sm text-[#8a8890] w-36 shrink-0">{cat.name}</span>
                  <div className="flex-1 h-0.5 bg-[rgba(201,169,110,0.1)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#c9a96e] rounded-full"
                      style={{
                        width: blurred ? `${barW}%` : `${barW}%`,
                        transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)",
                        transitionDelay: `${600 + i * 80}ms`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-[#c9a96e] font-serif font-bold w-8 text-right">{catIQ}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[#555] text-center mt-3">Bottom 3 categories locked — unlock with Premium Report</p>
        </div>

        {/* Upsell */}
        <div
          className="mt-8 p-5 bg-[rgba(201,169,110,0.04)] border border-dashed border-[rgba(201,169,110,0.25)] rounded text-left animate-fade-up"
          style={{ animationDelay: "760ms" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <p className="text-sm font-medium text-[#c9a96e]">Full Cognitive Report</p>
            <span className="text-xs bg-[rgba(29,158,117,0.15)] text-[#1d9e75] border border-[rgba(29,158,117,0.3)] px-2 py-0.5">Save 80%</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xs text-[#555] line-through">€9.99</span>
            <span className="text-xl font-bold text-[#f0ede8]">€1.99</span>
          </div>
          <p className="text-xs text-[#8a8890] leading-relaxed">
            All 6 category scores · Cognitive radar chart · Career matches · Improvement tips · Downloadable PDF certificate
          </p>
        </div>

        <div className="mt-6 flex gap-3 justify-center animate-fade-up" style={{ animationDelay: "820ms" }}>
          <button
            onClick={() => router.push("/report")}
            className="bg-[#c9a96e] text-[#0a0a0f] px-8 py-3 text-sm font-medium tracking-widest uppercase hover:bg-[#e8c98a] active:scale-[0.97] transition-[background-color,transform] duration-150"
          >
            Unlock Full Report — €1.99
          </button>
          <button
            onClick={() => router.push("/test")}
            className="border border-[rgba(240,237,232,0.2)] text-[#f0ede8] px-6 py-3 text-sm hover:border-[#c9a96e] hover:text-[#c9a96e] active:scale-[0.97] transition-[color,border-color,transform] duration-150"
          >
            Retry
          </button>
        </div>

        <p className="text-xs text-[#555] mt-4">No subscription · One-time payment · Instant access</p>
      </div>
    </div>
  );
}
