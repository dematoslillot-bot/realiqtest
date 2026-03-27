"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [timeLeft, setTimeLeft] = useState(45);
  const [showTransition, setShowTransition] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null);

  const q = ALL_QUESTIONS[qIdx];

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
    const nextCat = ALL_QUESTIONS[nextIdx].cat;
    if (nextCat !== q.cat) {
      setShowTransition(true);
    } else {
      setQIdx(nextIdx);
      setAnswered(false);
      setSelected(null);
      setFeedback(null);
      setTimeLeft(ALL_QUESTIONS[nextIdx].time);
    }
  }, [qIdx, score, catScores, catTotals, q, router]);

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
    const nextIdx = qIdx + 1;
    setQIdx(nextIdx);
    setAnswered(false);
    setSelected(null);
    setFeedback(null);
    setTimeLeft(ALL_QUESTIONS[nextIdx].time);
  }

  if (showTransition) {
    const prevCat = CATEGORIES[q.cat];
    const nextCat = CATEGORIES[ALL_QUESTIONS[qIdx + 1].cat];
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-[#f0ede8] flex flex-col">
        <nav className="flex items-center justify-between px-8 py-4 border-b border-[rgba(201,169,110,0.2)] bg-[#111118]">
          <span className="font-serif text-lg font-bold text-[#c9a96e]">Real<span className="text-[#f0ede8]">IQ</span>Test</span>
        </nav>
        <div className="flex-1 flex items-center justify-center text-center px-6">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#8a8890] mb-4">{prevCat.name} — Complete</p>
            <p className="font-serif text-5xl font-black text-[#c9a96e]">{catScores[q.cat]}/{catTotals[q.cat]}</p>
            <p className="text-sm text-[#8a8890] mt-2 mb-8">Correct answers</p>
            <h2 className="font-serif text-3xl font-bold mb-3">Next: <em className="text-[#c9a96e]">{nextCat.name}</em></h2>
            <p className="text-[#8a8890] text-sm mb-8 max-w-sm mx-auto">Get ready for the next category. Take a breath.</p>
            <button onClick={continueAfterTransition} className="bg-[#c9a96e] text-[#0a0a0f] px-10 py-3 text-sm font-medium tracking-widest uppercase rounded-sm hover:bg-[#e8c98a] transition-colors">
              Begin →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((qIdx + 1) / ALL_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0ede8]">
      {/* Header */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 border-b border-[rgba(201,169,110,0.2)] bg-[#111118]">
        <span className="font-serif text-lg font-bold text-[#c9a96e]">Real<span className="text-[#f0ede8]">IQ</span>Test</span>
        <div className="text-center">
          <p className="text-xs tracking-widest uppercase text-[#8a8890]">Category {q.cat + 1} of 6</p>
          <p className="text-sm font-medium">{CATEGORIES[q.cat].name}</p>
        </div>
        <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-serif font-bold text-base transition-colors ${timeLeft <= 8 ? "border-[#e24b4a] text-[#e24b4a]" : "border-[#c9a96e] text-[#c9a96e]"}`}>
          {timeLeft}
        </div>
      </nav>

      {/* Progress */}
      <div className="px-8 py-3 bg-[#111118] border-b border-[rgba(201,169,110,0.2)]">
        <div className="flex justify-between text-xs text-[#8a8890] mb-1">
          <span>Question {qIdx + 1} of {ALL_QUESTIONS.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="h-0.5 bg-[rgba(201,169,110,0.12)] rounded-full">
          <div className="h-full bg-[#c9a96e] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex gap-1 mt-2 flex-wrap">
          {ALL_QUESTIONS.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === qIdx ? "bg-[#c9a96e]" : i < qIdx ? (results[i] ? "bg-[#1d9e75]" : "bg-[#e24b4a]") : "bg-[rgba(201,169,110,0.15)]"}`} />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-serif text-4xl font-black text-[rgba(201,169,110,0.25)]">{String(qIdx + 1).padStart(2, "0")}</span>
          <span className="text-xs tracking-widest uppercase border border-[rgba(201,169,110,0.2)] text-[#c9a96e] px-2 py-1 rounded-sm">{q.badge}</span>
          <span className={`text-xs tracking-widest uppercase px-2 py-1 rounded-sm ${q.diff === "easy" ? "bg-[rgba(29,158,117,0.1)] text-[#1d9e75] border border-[rgba(29,158,117,0.3)]" : q.diff === "medium" ? "bg-[rgba(201,169,110,0.1)] text-[#c9a96e] border border-[rgba(201,169,110,0.2)]" : "bg-[rgba(226,75,74,0.1)] text-[#e24b4a] border border-[rgba(226,75,74,0.3)]"}`}>{q.diff}</span>
        </div>

        <p className="font-serif text-xl leading-relaxed mb-6">{q.text}</p>

        {/* Visual */}
        {q.type === "pattern" && q.grid && (
          <div className="bg-[#111118] border border-[rgba(201,169,110,0.2)] rounded p-6 mb-6 flex justify-center">
            <div className={`grid gap-1.5 ${q.gridClass === "grid3" ? "grid-cols-3" : "grid-cols-4"}`}>
              {q.grid.map((cell, i) => (
                <div key={i} className={`w-16 h-16 flex items-center justify-center text-2xl rounded-sm ${cell === "?" ? "bg-[rgba(201,169,110,0.05)] border-2 border-dashed border-[#c9a96e] text-[#c9a96e] text-lg" : "bg-[#1a1a26] border border-[rgba(201,169,110,0.2)]"}`}>
                  {cell}
                </div>
              ))}
            </div>
          </div>
        )}

        {q.type === "sequence" && q.seq && (
          <div className="bg-[#111118] border border-[rgba(201,169,110,0.2)] rounded p-6 mb-6 flex items-center justify-center gap-3 flex-wrap">
            {q.seq.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-14 h-14 flex items-center justify-center font-serif text-xl font-bold rounded-sm ${s === "?" ? "bg-[rgba(201,169,110,0.05)] border-2 border-dashed border-[#c9a96e] text-[#c9a96e]" : "bg-[#1a1a26] border border-[rgba(201,169,110,0.2)]"}`}>{s}</div>
                {i < q.seq!.length - 1 && <span className="text-[#8a8890] text-sm">→</span>}
              </div>
            ))}
          </div>
        )}

        {q.type === "analogy" && (
          <div className="bg-[#111118] border border-[rgba(201,169,110,0.2)] rounded p-6 mb-6 flex items-center justify-center gap-4 flex-wrap font-serif text-xl font-bold">
            <span>{q.w1}</span>
            <span className="text-sm font-sans font-normal text-[#8a8890]">is to</span>
            <span>{q.w2}</span>
            <span className="text-sm font-sans font-normal text-[#8a8890]">as</span>
            <span>{q.w3}</span>
            <span className="text-sm font-sans font-normal text-[#8a8890]">is to</span>
            <span className="text-[#c9a96e] border-b-2 border-dashed border-[#c9a96e] min-w-[80px] text-center">?</span>
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {q.opts.map((opt, i) => (
            <button key={i} onClick={() => selectOpt(i)} disabled={answered}
              className={`flex items-center gap-3 p-4 rounded border text-left transition-all ${answered && i === q.ans ? "border-[#1d9e75] bg-[rgba(29,158,117,0.1)]" : answered && i === selected && i !== q.ans ? "border-[#e24b4a] bg-[rgba(226,75,74,0.1)]" : selected === i ? "border-[#c9a96e] bg-[rgba(201,169,110,0.08)]" : "border-[rgba(201,169,110,0.2)] bg-[#111118] hover:border-[#c9a96e] hover:bg-[#1a1a26]"}`}>
              <div className={`w-7 h-7 min-w-[28px] border rounded-sm flex items-center justify-center text-xs font-medium transition-colors ${answered && i === q.ans ? "border-[#1d9e75] text-[#1d9e75]" : answered && i === selected && i !== q.ans ? "border-[#e24b4a] text-[#e24b4a]" : "border-[rgba(201,169,110,0.2)] text-[#8a8890]"}`}>
                {["A","B","C","D"][i]}
              </div>
              <span className="text-sm">{opt}</span>
            </button>
          ))}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`flex gap-3 p-4 rounded mb-6 text-sm ${feedback.correct ? "bg-[rgba(29,158,117,0.1)] border border-[#1d9e75] text-[#5dcaa5]" : "bg-[rgba(226,75,74,0.08)] border border-[#e24b4a] text-[#f09595]"}`}>
            <span>{feedback.correct ? "✓" : "✕"}</span>
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button onClick={handleNext} className="text-xs tracking-widest uppercase text-[#8a8890] hover:text-[#f0ede8] transition-colors">
            Skip →
          </button>
          <button onClick={handleNext} disabled={!answered}
            className={`bg-[#c9a96e] text-[#0a0a0f] px-8 py-3 text-sm font-medium tracking-widest uppercase rounded-sm transition-all ${answered ? "opacity-100 hover:bg-[#e8c98a]" : "opacity-40 cursor-not-allowed"}`}>
            {qIdx === ALL_QUESTIONS.length - 1 ? "See Results →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}