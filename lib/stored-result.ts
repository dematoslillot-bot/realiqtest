// Client-side: read the last test result saved by /test in localStorage,
// so /results, /report and /premium all show the SAME IQ.
import { calculateIQFull, calculateIQWeighted, getIQLabel, getPercentile, type AnswerRecord } from "@/lib/iq-calculator";

export interface StoredResult {
  iq: number;
  label: string;
  percentile: number;
  score: number;
  total: number;
  catScores: number[];
  catTotals: number[];
}

export function loadStoredResult(): StoredResult | null {
  if (typeof window === "undefined") return null;
  try {
    const score = parseInt(localStorage.getItem("iq_score") || "0");
    const total = parseInt(localStorage.getItem("iq_total") || "0");
    const catScores: number[] = JSON.parse(localStorage.getItem("iq_catScores") || "[0,0,0,0,0,0]");
    const catTotals: number[] = JSON.parse(localStorage.getItem("iq_catTotals") || "[0,0,0,0,0,0]");
    const rawRecords = localStorage.getItem("iq_records");
    let iq: number;
    if (rawRecords) {
      const records: AnswerRecord[] = JSON.parse(rawRecords);
      iq = calculateIQFull(records, catScores, catTotals);
    } else if (localStorage.getItem("iq_weighted")) {
      const weighted = parseFloat(localStorage.getItem("iq_weighted") || "0");
      const maxPoss = parseFloat(localStorage.getItem("iq_maxPossible") || "1");
      const minPoss = parseFloat(localStorage.getItem("iq_minPossible") || "-1");
      iq = Math.max(78, Math.min(148, calculateIQWeighted(weighted, maxPoss, minPoss)));
    } else {
      return null;
    }
    return { iq, label: getIQLabel(iq), percentile: getPercentile(iq), score, total, catScores, catTotals };
  } catch {
    return null;
  }
}

/* ── Progress history (Premium) ─────────────────────────────────────────── */
export interface HistoryEntry { iq: number; date: string }

export function loadHistory(): HistoryEntry[] {
  try { return JSON.parse(localStorage.getItem("iq_history") || "[]"); } catch { return []; }
}

/** Adds the current result once per finished test (keyed by the records blob). */
export function recordHistory(iq: number) {
  try {
    const key = (localStorage.getItem("iq_records") || "") + "|" + iq;
    const sig = String(key.length) + ":" + key.slice(-40);
    if (localStorage.getItem("iq_history_last") === sig) return;
    const h = loadHistory();
    h.push({ iq, date: new Date().toISOString() });
    localStorage.setItem("iq_history", JSON.stringify(h.slice(-24)));
    localStorage.setItem("iq_history_last", sig);
  } catch { /* storage unavailable */ }
}
