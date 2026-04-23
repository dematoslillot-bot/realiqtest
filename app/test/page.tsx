"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ALL_QUESTIONS, CATEGORIES } from "@/lib/questions";

export default function TestPage() {
  const router = useRouter();
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [catScores, setCatScores] = useState([0, 0, 0, 0, 0, 0]);
  const [catTotals, setCatTotals] = useState([0, 0, 0, 0, 0, 0]);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(ALL_QUESTIONS[0].time);
  const [showTransition, setShowTransition] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null);
  const [flipping, setFlipping] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const q = ALL_QUESTIONS[qIdx];

  const advanceTo = useCallback((nextIdx: number) => {
    // 3-D flip out → swap → flip in
    setFlipping(true);
    setTimeout(() => {
      setQIdx(nextIdx);
      setAnswered(false);
      setSelected(null);
      setFeedback(null);
      setTimeLeft(ALL_QUESTIONS[nextIdx].time);
      setFlipping(false);
    }, 220);
  }, []);

  const handleNext = useCallback(() => {
    const nextIdx = qIdx + 1;
    if (nextIdx >= ALL_QUESTIONS.length) {
      localStorage.setItem("iq_score", score.toString());
      localStorage.setItem("iq_total", ALL_QUESTIONS.length.toString());
      localStorage.setItem("iq_catScores", JSON.stringify(catScores));
      localStorage.setItem("iq_catTotals", JSON.stringify(catTotals));
      router.push("/results");
      return;
    }
    if (ALL_QUESTIONS[nextIdx].cat !== q.cat) {
      setShowTransition(true);
    } else {
      advanceTo(nextIdx);
    }
  }, [qIdx, score, catScores, catTotals, q, router, advanceTo]);

  useEffect(() => {
    if (answered || showTransition) return;
    if (timeLeft <= 0) {
      setAnswered(true);
      const newResults = [...results, false];
      setResults(newResults);
      const newTotals = [...catTotals];
      newTotals[q.cat]++;
      setCatTotals(newTotals);
      setFeedback({ correct: false, text: `Time's up! ${q.exp}` });
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, answered, showTransition, q, results, catTotals]);

  function selectOpt(i: number) {
    if (answered) return;
    setAnswered(true);
    setSelected(i);
    const correct = i === q.ans;
    const newResults = [...results, correct];
    setResults(newResults);
    const newCatScores = [...catScores];
    const newCatTotals = [...catTotals];
    if (correct) { newCatScores[q.cat]++; setScore((s) => s + 1); }
    newCatTotals[q.cat]++;
    setCatScores(newCatScores);
    setCatTotals(newCatTotals);
    setFeedback({ correct, text: correct ? `Correct! ${q.exp}` : `Incorrect. ${q.exp}` });
  }

  function continueAfterTransition() {
    setShowTransition(false);
    advanceTo(qIdx + 1);
  }

  // ── Category transition screen ─────────────────────────────────────────

  if (showTransition) {
    const prevCat = CATEGORIES[q.cat];
    const nextCat = CATEGORIES[ALL_QUESTIONS[qIdx + 1].cat];
    const catScore = catScores[q.cat];
    const catTotal = catTotals[q.cat];
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-[#f0ede8] flex flex-col">
        <nav className="flex items-center justify-between px-8 py-4 border-b border-[rgba(201,169,110,0.2)] bg-[#111118]">
          <span className="font-serif text-lg font-bold text-[#c9a96e]">
            Real<span className="text-[#f0ede8]">IQ</span>Test
          </span>
        </nav>
        <div className="flex-1 flex items-center justify-center text-center px-6">
          <div className="animate-fade-up max-w-sm w-full">
            {/* Section complete card */}
            <div className="bg-[#111118] border border-[rgba(201,169,110,0.2)] rounded-lg p-8 mb-8">
              <p className="text-xs tracking-widest uppercase text-[#1d9e75] mb-3">Section complete</p>
              <p className="text-sm text-[#8a8890] mb-1">{prevCat.name}</p>
              <div className="font-serif text-6xl font-black text-[#c9a96e] my-3">
                {catScore}<span className="text-2xl text-[#8a8890]">/{catTotal}</span>
              </div>
              <div className="h-1 bg-[rgba(201,169,110,0.1)] rounded-full overflow-hidden mt-4">
                <div
                  className="h-full bg-[#c9a96e] rounded-full"
                  style={{ width: `${catTotal > 0 ? (catScore / catTotal) * 100 : 0}%`, transition: "width 0.8s ease" }}
                />
              </div>
            </div>
            <h2 className="text-xl font-medium mb-1">
              Next: <span className="text-[#c9a96e]">{nextCat.name}</span>
            </h2>
            <p className="text-sm text-[#8a8890] mb-8">Take a breath before continuing.</p>
            <button
              onClick={continueAfterTransition}
              className="w-full bg-[#c9a96e] text-[#0a0a0f] px-10 py-3 text-sm font-medium tracking-widest uppercase hover:bg-[#e8c98a] active:scale-[0.97] transition-[background-color,transform] duration-150"
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Timer colour ───────────────────────────────────────────────────────

  const timerDanger = timeLeft <= Math.round(q.time * 0.25);
  const timerWarn   = timeLeft <= Math.round(q.time * 0.5);
  const progress    = ((qIdx + 1) / ALL_QUESTIONS.length) * 100;
  const timerPct    = (timeLeft / q.time) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0ede8]">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-10 bg-[#111118] border-b border-[rgba(201,169,110,0.2)]">
        <div className="flex items-center justify-between px-6 py-3">
          <span className="font-serif text-base font-bold text-[#c9a96e]">
            Real<span className="text-[#f0ede8]">IQ</span>Test
          </span>
          <div className="text-center">
            <p className="text-[10px] tracking-widest uppercase text-[#555] leading-none mb-0.5">
              {CATEGORIES[q.cat].name}
            </p>
            <p className="text-xs font-medium text-[#8a8890]">
              Category {q.cat + 1} of 6
            </p>
          </div>
          {/* Circular timer */}
          <div className="relative w-11 h-11">
            <svg className="absolute inset-0 -rotate-90" width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(201,169,110,0.12)" strokeWidth="2.5" />
              <circle
                cx="22" cy="22" r="18" fill="none"
                stroke={timerDanger ? "#e24b4a" : timerWarn ? "#e8a44b" : "#c9a96e"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - timerPct / 100)}`}
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease" }}
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center text-xs font-bold font-serif"
              style={{ color: timerDanger ? "#e24b4a" : "#c9a96e" }}
            >
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-6 pb-3">
          <div className="flex justify-between text-[10px] text-[#555] mb-1">
            <span>Q{qIdx + 1} / {ALL_QUESTIONS.length}</span>
            <span>Score: {score}</span>
          </div>
          <div className="h-0.5 bg-[rgba(201,169,110,0.1)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c9a96e] rounded-full"
              style={{ width: `${progress}%`, transition: "width 0.4s ease" }}
            />
          </div>
          <div className="flex gap-1 mt-2 flex-wrap">
            {ALL_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                style={{
                  background: i === qIdx
                    ? "#c9a96e"
                    : i < qIdx
                      ? (results[i] ? "#1d9e75" : "#e24b4a")
                      : "rgba(201,169,110,0.12)",
                }}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* ── Question card ────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div
          ref={cardRef}
          className={flipping ? "animate-flip-out" : "animate-flip-in"}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Badge row */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="font-serif text-3xl font-black text-[rgba(201,169,110,0.2)]">
              {String(qIdx + 1).padStart(2, "0")}
            </span>
            <span className="text-[10px] tracking-widest uppercase border border-[rgba(201,169,110,0.2)] text-[#c9a96e] px-2 py-1">
              {q.badge}
            </span>
            <span className={`text-[10px] tracking-widest uppercase px-2 py-1 ${
              q.diff === "easy"
                ? "bg-[rgba(29,158,117,0.1)] text-[#1d9e75] border border-[rgba(29,158,117,0.25)]"
                : q.diff === "medium"
                  ? "bg-[rgba(201,169,110,0.1)] text-[#c9a96e] border border-[rgba(201,169,110,0.2)]"
                  : "bg-[rgba(226,75,74,0.1)] text-[#e24b4a] border border-[rgba(226,75,74,0.25)]"
            }`}>
              {q.diff}
            </span>
          </div>

          {/* Question text */}
          <p className="text-lg leading-relaxed mb-5 font-medium">{q.text}</p>

          {/* Visual elements */}
          {q.type === "pattern" && q.grid && (
            <div className="bg-[#111118] border border-[rgba(201,169,110,0.15)] rounded p-6 mb-5 flex justify-center">
              <div className={`grid gap-2 ${q.gridClass === "grid3" ? "grid-cols-3" : "grid-cols-4"}`}>
                {q.grid.map((cell, i) => (
                  <div
                    key={i}
                    className={`w-14 h-14 flex items-center justify-center text-2xl rounded-sm ${
                      cell === "?"
                        ? "bg-[rgba(201,169,110,0.05)] border-2 border-dashed border-[#c9a96e] text-[#c9a96e]"
                        : "bg-[#1a1a26] border border-[rgba(201,169,110,0.15)]"
                    }`}
                  >
                    {cell !== "filled" && cell !== "empty" ? cell : (
                      cell === "filled"
                        ? <div className="w-7 h-7 rounded-sm bg-[#c9a96e]" />
                        : null
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {q.type === "sequence" && q.seq && (
            <div className="bg-[#111118] border border-[rgba(201,169,110,0.15)] rounded p-5 mb-5 flex items-center justify-center gap-2 flex-wrap">
              {q.seq.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-12 h-12 flex items-center justify-center font-serif text-lg font-bold rounded-sm ${
                    s === "?"
                      ? "bg-[rgba(201,169,110,0.05)] border-2 border-dashed border-[#c9a96e] text-[#c9a96e]"
                      : "bg-[#1a1a26] border border-[rgba(201,169,110,0.15)] text-[#f0ede8]"
                  }`}>
                    {s}
                  </div>
                  {i < q.seq!.length - 1 && <span className="text-[#555] text-xs">→</span>}
                </div>
              ))}
            </div>
          )}

          {q.type === "analogy" && (
            <div className="bg-[#111118] border border-[rgba(201,169,110,0.15)] rounded p-5 mb-5 flex items-center justify-center gap-3 flex-wrap font-serif text-lg font-bold">
              <span>{q.w1}</span>
              <span className="text-xs font-sans font-normal text-[#555]">is to</span>
              <span>{q.w2}</span>
              <span className="text-xs font-sans font-normal text-[#555]">as</span>
              <span>{q.w3}</span>
              <span className="text-xs font-sans font-normal text-[#555]">is to</span>
              <span className="text-[#c9a96e] border-b-2 border-dashed border-[#c9a96e] min-w-[70px] text-center">?</span>
            </div>
          )}

          {/* Answer options */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {q.opts.map((opt, i) => {
              const isCorrect  = answered && i === q.ans;
              const isWrong    = answered && i === selected && i !== q.ans;
              const isSelected = selected === i && !answered;
              return (
                <button
                  key={i}
                  onClick={() => selectOpt(i)}
                  disabled={answered}
                  className={`flex items-center gap-3 p-4 border text-left transition-[border-color,background-color,transform] duration-150 active:scale-[0.98] ${
                    isCorrect  ? "border-[#1d9e75] bg-[rgba(29,158,117,0.08)]"  :
                    isWrong    ? "border-[#e24b4a] bg-[rgba(226,75,74,0.08)]"   :
                    isSelected ? "border-[#c9a96e] bg-[rgba(201,169,110,0.07)]" :
                    "border-[rgba(201,169,110,0.15)] bg-[#111118] hover:border-[rgba(201,169,110,0.4)] hover:bg-[#1a1a26]"
                  }`}
                >
                  <div className={`w-7 h-7 min-w-[28px] border flex items-center justify-center text-xs font-semibold transition-colors duration-150 ${
                    isCorrect ? "border-[#1d9e75] text-[#1d9e75]" :
                    isWrong   ? "border-[#e24b4a] text-[#e24b4a]" :
                    "border-[rgba(201,169,110,0.2)] text-[#8a8890]"
                  }`}>
                    {["A","B","C","D"][i]}
                  </div>
                  <span className="text-sm leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`flex gap-3 p-4 mb-5 text-sm animate-scale-in ${
              feedback.correct
                ? "bg-[rgba(29,158,117,0.08)] border border-[rgba(29,158,117,0.4)] text-[#5dcaa5]"
                : "bg-[rgba(226,75,74,0.06)] border border-[rgba(226,75,74,0.35)] text-[#f09595]"
            }`}>
              <span className="shrink-0 font-bold">{feedback.correct ? "✓" : "✕"}</span>
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleNext}
              className="text-xs tracking-widest uppercase text-[#555] hover:text-[#f0ede8] transition-colors duration-150"
            >
              Skip →
            </button>
            <button
              onClick={handleNext}
              disabled={!answered}
              className={`px-8 py-3 text-xs font-semibold tracking-widest uppercase transition-[background-color,transform,opacity] duration-150 ${
                answered
                  ? "bg-[#c9a96e] text-[#0a0a0f] hover:bg-[#e8c98a] active:scale-[0.97]"
                  : "bg-[#c9a96e] text-[#0a0a0f] opacity-35 cursor-not-allowed"
              }`}
            >
              {qIdx === ALL_QUESTIONS.length - 1 ? "See Results →" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
