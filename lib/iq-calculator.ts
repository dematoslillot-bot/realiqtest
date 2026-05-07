/**
 * Points per difficulty level.
 *
 * Easy   correct → small reward   (expected to get it right)
 * Easy   wrong   → heavy penalty  (no excuse to miss it)
 * Medium correct → moderate reward
 * Medium wrong   → moderate penalty
 * Hard   correct → big reward     (real merit)
 * Hard   wrong   → tiny penalty   (expected to miss some)
 */
export const DIFF_WEIGHTS = {
  easy:   { correct: 1,  wrong: -3 },
  medium: { correct: 2,  wrong: -2 },
  hard:   { correct: 4,  wrong: -1 },
} as const;

// ── Internal IQ lookup (Bell-curve aligned, mean=100 σ=15) ─────────────────

function iqFromPct(pct: number): number {
  if (pct >= 0.96) return 145;
  if (pct >= 0.90) return 135;
  if (pct >= 0.83) return 128;
  if (pct >= 0.77) return 121;
  if (pct >= 0.70) return 115;
  if (pct >= 0.62) return 113;
  if (pct >= 0.55) return 108;
  if (pct >= 0.47) return 105;
  if (pct >= 0.42) return 100;
  if (pct >= 0.32) return 93;
  if (pct >= 0.22) return 85;
  return 78;
}

// Legacy helper (kept for any backward-compat call sites)
export function calculateIQ(score: number, total: number): number {
  return iqFromPct(score / total);
}

/**
 * Primary IQ calculator — uses the weighted difficulty scoring system.
 *
 * The normalized percentage maps the weighted score against the theoretical
 * minimum (all wrong) and maximum (all correct), so:
 *   • Perfect score   → 145 IQ
 *   • 50/50 on all    → 100 IQ
 *   • All wrong       → 78  IQ
 *
 * @param weighted     Accumulated point total (can be negative)
 * @param maxPossible  Sum of correct-weights for every question answered
 * @param minPossible  Sum of wrong-weights  for every question answered (negative)
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

/** @deprecated Use calculateIQWeighted instead */
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
  if (iq >= 145) return 99;
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
  catTotals: number[]
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
    const catIQ = Math.min(145, Math.max(70, iq + offsets[i]));
    const pct = catTotals[i] > 0 ? catScores[i] / catTotals[i] : 0;
    const badge: "strong" | "avg" | "weak" =
      pct >= 0.75 ? "strong" : pct >= 0.5 ? "avg" : "weak";
    return {
      name,
      iq: catIQ,
      score: catScores[i],
      total: catTotals[i],
      badge,
      desc: descs[i],
    };
  });
}
