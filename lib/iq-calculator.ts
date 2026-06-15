/**
 * Per-question answer record — captured during the test,
 * saved to localStorage as "iq_records", consumed by calculateIQFull.
 */
export interface AnswerRecord {
  diff: "easy" | "medium" | "hard";
  cat: number;
  correct: boolean;
  timeFrac: number;   // fraction of time limit consumed (0 = instant, 1 = time-out)
  skipped: boolean;
}

/**
 * Difficulty weights.
 *
 * Easy   correct → small reward   (expected)
 * Easy   wrong   → heavy penalty  (no excuse)
 * Medium correct → moderate reward
 * Medium wrong   → moderate penalty
 * Hard   correct → big reward     (real merit)
 * Hard   wrong   → tiny penalty   (expected to miss some)
 *
 * These are also used by the test page to maintain the
 * running weighted-score display (category transition cards).
 */
export const DIFF_WEIGHTS = {
  easy:   { correct: 1,  wrong: -5 },
  medium: { correct: 3,  wrong: -3 },
  hard:   { correct: 7,  wrong: -1 },
} as const;

const SKIP_PENALTY: Record<"easy" | "medium" | "hard", number> = {
  easy:   -4,
  medium: -2,
  hard:   -0.5,
};

// ── Internal IQ lookup (Bell-curve aligned, mean=100 σ=15) ─────────────────
// Maps normalised weighted-score percentage to a base IQ.
// Harder to reach top end — speed/confidence bonuses push to 148.

function iqFromPct(pct: number): number {
  if (pct >= 0.97) return 138;
  if (pct >= 0.92) return 131;
  if (pct >= 0.86) return 127;
  if (pct >= 0.79) return 122;
  if (pct >= 0.72) return 118;
  if (pct >= 0.64) return 114;
  if (pct >= 0.56) return 110;
  if (pct >= 0.48) return 106;
  if (pct >= 0.40) return 102;
  if (pct >= 0.30) return 97;
  if (pct >= 0.20) return 90;
  if (pct >= 0.10) return 83;
  return 78;
}

/**
 * Primary IQ calculator — full algorithm using per-question records.
 *
 * Pipeline:
 *   1. Difficulty-weighted base score → base IQ (78-138)
 *   2. Time bonus/penalty            → ±3 IQ max
 *   3. Streak bonus                  → +2 IQ if ≥5 consecutive correct
 *   4. Cognitive consistency penalty → −1..−3 IQ for unbalanced profiles
 *   5. Confidence index              → ±4 IQ max
 *
 * Final range: 78–148
 *
 * Target distribution:
 *   Good users        → 105-127
 *   Excellent users   → 129-137
 *   Perfect + fast    → 137-148
 *   Absolute max      → 148
 */
export function calculateIQFull(
  records: AnswerRecord[],
  catScores: number[],
  catTotals: number[],
): number {
  if (records.length === 0) return 100;

  // ── 1. Difficulty-weighted base ─────────────────────────────────────────
  let weighted = 0;
  let maxPossible = 0;
  let minPossible = 0;

  for (const r of records) {
    const w = DIFF_WEIGHTS[r.diff];
    maxPossible += w.correct;
    minPossible += w.wrong;
    if (r.skipped) {
      weighted += SKIP_PENALTY[r.diff];
    } else {
      weighted += r.correct ? w.correct : w.wrong;
    }
  }

  const span = maxPossible - minPossible;
  const pct  = span <= 0 ? 0.5 : Math.max(0, Math.min(1, (weighted - minPossible) / span));
  let iq = iqFromPct(pct);

  // ── 2. Time bonus / penalty (±3 IQ max) ────────────────────────────────
  let timeSum = 0;
  for (const r of records) {
    if (r.skipped) continue;
    const f = r.timeFrac;
    if      (f < 0.25) timeSum += 0.15;
    else if (f < 0.50) timeSum += 0.06;
    else if (f < 0.75) timeSum += 0;
    else               timeSum -= 0.08;
  }
  iq += Math.max(-3, Math.min(3, Math.round(timeSum)));

  // ── 3. Streak bonus (+2 IQ for longest streak ≥ 5, once) ───────────────
  let maxStreak = 0, cur = 0;
  for (const r of records) {
    if (!r.skipped && r.correct) { cur++; maxStreak = Math.max(maxStreak, cur); }
    else cur = 0;
  }
  if (maxStreak >= 5) iq += 2;

  // ── 4. Cognitive consistency penalty (−1..−3) ──────────────────────────
  const catPerf = catTotals.map((total, i) =>
    total > 0 ? catScores[i] / total : 0.5,
  );
  const mean  = catPerf.reduce((a, b) => a + b, 0) / catPerf.length;
  const stdDev = Math.sqrt(catPerf.reduce((s, p) => s + (p - mean) ** 2, 0) / catPerf.length);
  if      (stdDev > 0.35) iq -= 3;
  else if (stdDev > 0.25) iq -= 2;
  else if (stdDev > 0.15) iq -= 1;

  // ── 5. Confidence index (±4 IQ max) ────────────────────────────────────
  // Hard answered fast = genuine mastery (bonus)
  // Easy answered fast but wrong = over-confidence (penalty)
  let confSum = 0;
  for (const r of records) {
    if (r.skipped) continue;
    if (r.diff === "hard" && r.correct) {
      if      (r.timeFrac < 0.15) confSum += 1.5;
      else if (r.timeFrac < 0.35) confSum += 0.8;
    } else if (r.diff === "easy" && !r.correct) {
      if      (r.timeFrac < 0.45) confSum -= 1.5;
      else if (r.timeFrac < 0.60) confSum -= 0.8;
    }
  }
  iq += Math.max(-4, Math.min(4, Math.round(confSum)));

  return Math.max(78, Math.min(148, iq));
}

// Legacy helper — kept for backward-compat and fallback
export function calculateIQ(score: number, total: number): number {
  const pct = total > 0 ? score / total : 0;
  return iqFromPct(pct);
}

/**
 * Weighted IQ calculator (fallback when iq_records not available).
 * Normalises the weighted score against theoretical min/max.
 */
export function calculateIQWeighted(
  weighted: number,
  maxPossible: number,
  minPossible: number,
): number {
  const span = maxPossible - minPossible;
  if (span <= 0) return 100;
  const pct = Math.max(0, Math.min(1, (weighted - minPossible) / span));
  return iqFromPct(pct);
}

/** @deprecated */
export function getDifficultyAdjustment(): number { return 0; }

export function getIQLabel(iq: number): string {
  if (iq >= 140) return "Genius";
  if (iq >= 130) return "Very Superior";
  if (iq >= 120) return "Superior";
  if (iq >= 110) return "High Average";
  if (iq >= 90)  return "Average";
  if (iq >= 80)  return "Low Average";
  return "Below Average";
}

export function getPercentile(iq: number): number {
  if (iq >= 148) return 99;
  if (iq >= 140) return 99;
  if (iq >= 135) return 97;
  if (iq >= 128) return 96;
  if (iq >= 121) return 92;
  if (iq >= 115) return 84;
  if (iq >= 108) return 70;
  if (iq >= 105) return 63;
  if (iq >= 100) return 50;
  if (iq >= 93)  return 32;
  if (iq >= 85)  return 16;
  return 10;
}

export interface CategoryResult {
  name: string;
  iq: number;
  score: number;
  total: number;
  badge: "strong" | "avg" | "weak";
  desc: string;
}

export function getCategoryResults(
  iq: number,
  catScores: number[],
  catTotals: number[],
): CategoryResult[] {
  const offsets = [+5, -2, -8, +3, -5, -12];
  const descs = [
    "You excel at identifying patterns and abstract relationships. Your deductive reasoning is well above average.",
    "Strong vocabulary and linguistic reasoning. You handle analogies and word relationships with ease.",
    "Moderate spatial visualisation. You handle 2D patterns well but complex 3D rotation tasks slow you down.",
    "Solid numerical reasoning. You handle sequences and arithmetic efficiently under time pressure.",
    "Your working memory is functional but shows some strain on multi-step recall tasks. An area to develop.",
    "Processing speed is your relative weakness. Faster decisions would meaningfully boost your overall score.",
  ];
  const names = [
    "Logical Reasoning",
    "Verbal Intelligence",
    "Spatial Reasoning",
    "Numerical Ability",
    "Working Memory",
    "Processing Speed",
  ];

  return names.map((name, i) => {
    const catIQ  = Math.min(148, Math.max(70, iq + offsets[i]));
    const pct    = catTotals[i] > 0 ? catScores[i] / catTotals[i] : 0;
    const badge: "strong" | "avg" | "weak" =
      pct >= 0.75 ? "strong" : pct >= 0.5 ? "avg" : "weak";
    return { name, iq: catIQ, score: catScores[i], total: catTotals[i], badge, desc: descs[i] };
  });
}
