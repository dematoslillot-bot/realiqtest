export function calculateIQ(score: number, total: number): number {
  const pct = score / total;
  // Bell-curve aligned thresholds (mean=100, σ=15)
  // 96%+ → 145   (top 1%)
  // 90%+ → 135   (top 3%)
  // 83%+ → 128   (top 4%)
  // 77%+ → 121   (top 9%) — adjusted so 30% fail (70% correct) gives ≤115
  // 70%+ → 115   (top 16%) — new level: 70% correct caps here
  // 62%+ → 113
  // 55%+ → 108   — adjusted so 50% fail (50% correct) gives ≤105
  // 47%+ → 105   — new level: 50% correct caps here
  // 42%+ → 100
  // 32%+ → 93
  // 22%+ → 85
  //  <22% → 78
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
