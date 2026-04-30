export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType =
  | "raven" | "rotation" | "bars" | "memory" | "symbols"
  | "sequence" | "analogy" | "text" | "oddone" | "pattern";

export type ShapeDef = {
  s: "c" | "sq" | "tr" | "di";  // circle, square, triangle, diamond
  x: number; y: number;          // center in 60×60 viewbox
  r: number;                     // radius / half-size
  f?: boolean;                   // filled (default: true)
};

export type RavenCell = ShapeDef[];

export type VisualDef =
  | { kind: "raven";    cells: (RavenCell | null)[]; optCells: RavenCell[] }
  | { kind: "bars";     values: (number | null)[];   max: number }
  | { kind: "rotation"; path: string; showAngle: number; optAngles: number[] }
  | { kind: "memory";   colors: string[];             showMs?: number }
  | { kind: "symbols";  target: string;               compare?: string[] };

export interface Question {
  cat: number;
  type: QuestionType;
  diff: Difficulty;
  badge: string;
  time: number;
  text: string;
  opts: string[];
  ans: number;
  exp: string;
  vis?: VisualDef;
  seq?: (string | number)[];
  w1?: string; w2?: string; w3?: string; missing?: string;
}

export const CATEGORIES = [
  { name: "Logical Reasoning",  short: "Logic"    },
  { name: "Verbal Intelligence",short: "Verbal"   },
  { name: "Spatial Reasoning",  short: "Spatial"  },
  { name: "Numerical Ability",  short: "Numerical"},
  { name: "Working Memory",     short: "Memory"   },
  { name: "Processing Speed",   short: "Speed"    },
];

// ── Shape helpers ──────────────────────────────────────────────────────────

const c  = (x: number, y: number, r: number, f = true): ShapeDef => ({ s: "c",  x, y, r, f });
const sq = (x: number, y: number, r: number, f = true): ShapeDef => ({ s: "sq", x, y, r, f });
const tr = (x: number, y: number, r: number, f = true): ShapeDef => ({ s: "tr", x, y, r, f });
const di = (x: number, y: number, r: number, f = true): ShapeDef => ({ s: "di", x, y, r, f });

// ── Preset Raven cells (60×60 viewbox) ────────────────────────────────────

// --- 1 / 2 / 3 of each shape (filled) ---
const C1  = [c(30,30,14)];
const C2  = [c(18,30,10), c(42,30,10)];
const C3  = [c(13,30,8),  c(30,30,8),  c(47,30,8)];
const S1  = [sq(30,30,14)];
const S2  = [sq(18,30,10), sq(42,30,10)];
const S3  = [sq(13,30,8),  sq(30,30,8),  sq(47,30,8)];
const T1  = [tr(30,30,14)];
const T2  = [tr(18,30,10), tr(42,30,10)];
const T3  = [tr(13,30,8),  tr(30,30,8),  tr(47,30,8)];
const D1  = [di(30,30,14)];

// --- outline versions ---
const C1o = [c(30,30,14,false)];
const S1o = [sq(30,30,14,false)];
const T1o = [tr(30,30,14,false)];
const D1o = [di(30,30,14,false)];

// --- size variants (single shape) ---
const C_big = [c(30,30,17)];
const C_med = [c(30,30,11)];
const C_sm  = [c(30,30,7)];
const S_big = [sq(30,30,17)];
const S_med = [sq(30,30,11)];
const S_sm  = [sq(30,30,7)];
const T_big = [tr(30,30,17)];
const T_med = [tr(30,30,11)];
const T_sm  = [tr(30,30,7)];

// --- count + size (smaller shapes as count grows) ---
const C1b = [c(30,30,16)];
const C2m = [c(18,30,11), c(42,30,11)];
const C3s = [c(13,30,7),  c(30,30,7),  c(47,30,7)];
const S1b = [sq(30,30,16)];
const S2m = [sq(18,30,11), sq(42,30,11)];
const S3s = [sq(13,30,7),  sq(30,30,7),  sq(47,30,7)];
const T1b = [tr(30,30,16)];
const T2m = [tr(18,30,11), tr(42,30,11)];
const T3s = [tr(13,30,7),  tr(30,30,7),  tr(47,30,7)];
const D3s = [di(13,30,7),  di(30,30,7),  di(47,30,7)];

// ── SVG path constants for rotation questions ──────────────────────────────

const ARROW   = "M8,21 L8,39 L36,39 L36,51 L54,30 L36,9 L36,21 Z";
const L_SHAPE = "M10,8 L26,8 L26,46 L52,46 L52,56 L10,56 Z";
const T_SHAPE = "M8,8 L52,8 L52,22 L36,22 L36,56 L24,56 L24,22 L8,22 Z";
const STEP    = "M10,8 L36,8 L36,30 L55,30 L55,54 L28,54 L28,30 L10,30 Z";
const F_SHAPE = "M10,8 L50,8 L50,22 L24,22 L24,36 L44,36 L44,48 L24,48 L24,54 L10,54 Z";

// ── All questions ──────────────────────────────────────────────────────────

export const ALL_QUESTIONS: Question[] = [

  // ── CAT 0 · LOGICAL REASONING — Raven matrices (5) ──────────────────────

  {
    cat: 0, type: "raven", diff: "easy", badge: "Matrix Pattern", time: 30,
    text: "Which image completes the matrix?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Each row has 1, 2, then 3 of the same shape. Row 3 uses triangles, so 3 triangles completes it.",
    vis: {
      kind: "raven",
      cells: [C1, C2, C3,  S1, S2, S3,  T1, T2, null],
      optCells: [T3, T1, S3, C3],
    },
  },

  {
    cat: 0, type: "raven", diff: "easy", badge: "Shape Sequence", time: 30,
    text: "Which image completes the matrix?",
    opts: ["A", "B", "C", "D"],
    ans: 2,
    exp: "Each shape appears exactly once per row and per column (Latin square). Row 3, Col 3 must be a square.",
    vis: {
      kind: "raven",
      cells: [C1, S1, T1,  S1, T1, C1,  T1, C1, null],
      optCells: [C1, T1, S1, D1],
    },
  },

  {
    cat: 0, type: "raven", diff: "medium", badge: "Fill Pattern", time: 25,
    text: "Which image completes the matrix?",
    opts: ["A", "B", "C", "D"],
    ans: 1,
    exp: "Column 1 is filled, Column 2 is outline, Column 3 is filled. Row 3 uses triangles → filled triangle.",
    vis: {
      kind: "raven",
      cells: [C1, C1o, C1,  S1, S1o, S1,  T1, T1o, null],
      optCells: [T1o, T1, S1, D1],
    },
  },

  {
    cat: 0, type: "raven", diff: "medium", badge: "Size Rule", time: 25,
    text: "Which image completes the matrix?",
    opts: ["A", "B", "C", "D"],
    ans: 3,
    exp: "Column 1 = large, Column 2 = medium, Column 3 = small. Row 3 uses triangles → small triangle.",
    vis: {
      kind: "raven",
      cells: [C_big, C_med, C_sm,  S_big, S_med, S_sm,  T_big, T_med, null],
      optCells: [T_big, C_sm, S_sm, T_sm],
    },
  },

  {
    cat: 0, type: "raven", diff: "hard", badge: "Dual Rule", time: 20,
    text: "Which image completes the matrix?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Count increases right (1,2,3) while shapes get smaller as count grows. Row 3 uses triangles → 3 small triangles.",
    vis: {
      kind: "raven",
      cells: [C1b, C2m, C3s,  S1b, S2m, S3s,  T1b, T2m, null],
      optCells: [T3s, T1b, D3s, T2m],
    },
  },

  // ── CAT 1 · VERBAL INTELLIGENCE — text (5) ──────────────────────────────

  {
    cat: 1, type: "analogy", diff: "easy", badge: "Word Analogy", time: 30,
    text: "Complete the analogy:",
    w1: "Light", w2: "Dark", w3: "Hot", missing: "?",
    opts: ["Warm", "Fire", "Cold", "Sun"],
    ans: 2,
    exp: "Light is the opposite of Dark. The opposite of Hot is Cold.",
  },

  {
    cat: 1, type: "text", diff: "easy", badge: "Synonym", time: 30,
    text: "Which word is closest in meaning to SERENE?",
    opts: ["Agitated", "Calm", "Noisy", "Restless"],
    ans: 1,
    exp: "Serene means peacefully calm and untroubled. The closest synonym is Calm.",
  },

  {
    cat: 1, type: "oddone", diff: "medium", badge: "Odd Word Out", time: 25,
    text: "Which word does NOT belong with the others?",
    opts: ["Simile", "Metaphor", "Algebra", "Alliteration"],
    ans: 2,
    exp: "Simile, Metaphor and Alliteration are figures of speech. Algebra is mathematics.",
  },

  {
    cat: 1, type: "analogy", diff: "medium", badge: "Word Analogy", time: 25,
    text: "Complete the analogy:",
    w1: "Author", w2: "Novel", w3: "Sculptor", missing: "?",
    opts: ["Clay", "Museum", "Statue", "Chisel"],
    ans: 2,
    exp: "An Author creates a Novel. A Sculptor creates a Statue.",
  },

  {
    cat: 1, type: "text", diff: "hard", badge: "Antonym", time: 20,
    text: "Which word is most OPPOSITE in meaning to EPHEMERAL?",
    opts: ["Fleeting", "Transient", "Permanent", "Brief"],
    ans: 2,
    exp: "Ephemeral means lasting a very short time. Its antonym is Permanent.",
  },

  // ── CAT 2 · SPATIAL REASONING — rotation (5) ────────────────────────────

  {
    cat: 2, type: "rotation", diff: "easy", badge: "Mental Rotation", time: 30,
    text: "The arrow points right (0°). Which option shows it rotated 90° clockwise?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Rotating a right-pointing arrow 90° clockwise gives a downward-pointing arrow.",
    vis: { kind: "rotation", path: ARROW, showAngle: 0, optAngles: [90, 0, 180, 270] },
  },

  {
    cat: 2, type: "rotation", diff: "easy", badge: "Mental Rotation", time: 30,
    text: "Which option shows this L-shape rotated 180°?",
    opts: ["A", "B", "C", "D"],
    ans: 1,
    exp: "Rotating 180° flips the L-shape to face the opposite diagonal.",
    vis: { kind: "rotation", path: L_SHAPE, showAngle: 0, optAngles: [0, 180, 90, 270] },
  },

  {
    cat: 2, type: "rotation", diff: "medium", badge: "Mental Rotation", time: 25,
    text: "Which option shows this T-shape rotated 90° counter-clockwise?",
    opts: ["A", "B", "C", "D"],
    ans: 1,
    exp: "90° counter-clockwise equals 270° clockwise. The stem of the T points to the right.",
    vis: { kind: "rotation", path: T_SHAPE, showAngle: 0, optAngles: [90, 270, 0, 180] },
  },

  {
    cat: 2, type: "rotation", diff: "medium", badge: "Mental Rotation", time: 25,
    text: "Which option shows this step-shape rotated 90° clockwise?",
    opts: ["A", "B", "C", "D"],
    ans: 1,
    exp: "Rotating 90° clockwise moves the step orientation from top-right to right-down.",
    vis: { kind: "rotation", path: STEP, showAngle: 0, optAngles: [0, 90, 270, 180] },
  },

  {
    cat: 2, type: "rotation", diff: "hard", badge: "Inverse Rotation", time: 20,
    text: "This F-shape has been rotated 90° clockwise. Which option shows its original orientation?",
    opts: ["A", "B", "C", "D"],
    ans: 2,
    exp: "To reverse a 90° clockwise rotation, rotate 90° counter-clockwise (270° CW), returning to 0°.",
    vis: { kind: "rotation", path: F_SHAPE, showAngle: 90, optAngles: [180, 270, 0, 90] },
  },

  // ── CAT 3 · NUMERICAL ABILITY — bar charts (5) ──────────────────────────

  {
    cat: 3, type: "bars", diff: "easy", badge: "Number Series", time: 30,
    text: "What value completes this series?",
    opts: ["36", "42", "48", "30"],
    ans: 2,
    exp: "Each term doubles. 24 × 2 = 48.",
    vis: { kind: "bars", values: [3, 6, 12, 24, null], max: 60 },
  },

  {
    cat: 3, type: "bars", diff: "easy", badge: "Decreasing Series", time: 30,
    text: "What is the missing bar value?",
    opts: ["25", "30", "35", "40"],
    ans: 0,
    exp: "Differences: −5, −10, −15, −20, −25. So 50 − 25 = 25.",
    vis: { kind: "bars", values: [100, 95, 85, 70, 50, null], max: 110 },
  },

  {
    cat: 3, type: "bars", diff: "medium", badge: "Perfect Squares", time: 25,
    text: "Which value completes the pattern?",
    opts: ["30", "36", "42", "49"],
    ans: 1,
    exp: "1², 2², 3², 4², 5², 6² = 1, 4, 9, 16, 25, 36.",
    vis: { kind: "bars", values: [1, 4, 9, 16, 25, null], max: 40 },
  },

  {
    cat: 3, type: "bars", diff: "medium", badge: "Doubling Gaps", time: 25,
    text: "What completes this series?",
    opts: ["29", "31", "33", "35"],
    ans: 2,
    exp: "Gaps double: +1, +2, +4, +8, +16. So 17 + 16 = 33.",
    vis: { kind: "bars", values: [2, 3, 5, 9, 17, null], max: 40 },
  },

  {
    cat: 3, type: "bars", diff: "hard", badge: "Fibonacci", time: 20,
    text: "What is the missing value?",
    opts: ["11", "12", "13", "15"],
    ans: 2,
    exp: "Fibonacci: each term = sum of previous two. 5 + 8 = 13.",
    vis: { kind: "bars", values: [1, 1, 2, 3, 5, 8, null], max: 15 },
  },

  // ── CAT 4 · WORKING MEMORY — colour sequences (5) ───────────────────────

  {
    cat: 4, type: "memory", diff: "easy", badge: "Colour Memory", time: 35,
    text: "What was the 2nd colour in the sequence?",
    opts: ["Red", "Blue", "Green", "Yellow"],
    ans: 1,
    exp: "Sequence: Red, Blue, Green, Yellow. The 2nd colour was Blue.",
    vis: { kind: "memory", colors: ["#FF3B3B", "#0055FF", "#00D87A", "#FFD700"], showMs: 3500 },
  },

  {
    cat: 4, type: "memory", diff: "easy", badge: "Colour Memory", time: 35,
    text: "What was the 3rd colour?",
    opts: ["Orange", "Yellow", "Purple", "Blue"],
    ans: 1,
    exp: "Sequence: Purple, Orange, Yellow, Blue, Green. The 3rd colour was Yellow.",
    vis: { kind: "memory", colors: ["#9B59B6", "#FF8C00", "#FFD700", "#0055FF", "#00D87A"], showMs: 3500 },
  },

  {
    cat: 4, type: "memory", diff: "medium", badge: "Colour Recall", time: 30,
    text: "What was the 4th colour?",
    opts: ["Orange", "Blue", "Green", "Red"],
    ans: 0,
    exp: "Sequence: Blue, Green, Red, Orange, Yellow. The 4th colour was Orange.",
    vis: { kind: "memory", colors: ["#0055FF", "#00D87A", "#FF3B3B", "#FF8C00", "#FFD700"], showMs: 3000 },
  },

  {
    cat: 4, type: "memory", diff: "medium", badge: "Frequency Count", time: 30,
    text: "How many times did Blue appear in the sequence?",
    opts: ["1", "2", "3", "4"],
    ans: 1,
    exp: "Sequence: Red, Blue, Green, Red, Purple, Blue. Blue appeared 2 times (positions 2 and 6).",
    vis: { kind: "memory", colors: ["#FF3B3B", "#0055FF", "#00D87A", "#FF3B3B", "#9B59B6", "#0055FF"], showMs: 4000 },
  },

  {
    cat: 4, type: "memory", diff: "hard", badge: "Sequence Recall", time: 25,
    text: "What was the 5th colour?",
    opts: ["Red", "Blue", "Yellow", "Green"],
    ans: 2,
    exp: "Sequence: Red, Blue, Green, Red, Yellow, Blue, Purple. The 5th colour was Yellow.",
    vis: { kind: "memory", colors: ["#FF3B3B", "#0055FF", "#00D87A", "#FF3B3B", "#FFD700", "#0055FF", "#9B59B6"], showMs: 4000 },
  },

  // ── CAT 5 · PROCESSING SPEED — symbol matching (5) ──────────────────────

  {
    cat: 5, type: "symbols", diff: "easy", badge: "Symbol Match", time: 15,
    text: "Which option exactly matches the target?",
    opts: ["TIGAR", "TIGRE", "TIGER", "TEGER"],
    ans: 2,
    exp: "Only TIGER matches the target TIGER exactly.",
    vis: { kind: "symbols", target: "TIGER", compare: ["TIGAR", "TIGRE", "TIGER", "TEGER"] },
  },

  {
    cat: 5, type: "symbols", diff: "easy", badge: "Rapid Arithmetic", time: 15,
    text: "Solve as fast as you can:",
    opts: ["54", "48", "56", "58"],
    ans: 2,
    exp: "7 × 8 = 56.",
    vis: { kind: "symbols", target: "7 × 8 = ?" },
  },

  {
    cat: 5, type: "symbols", diff: "medium", badge: "Spot the Difference", time: 12,
    text: "Which item is different from the others?",
    opts: ["1st", "2nd", "3rd", "4th"],
    ans: 2,
    exp: "The 3rd item (853964) has digits 5 and 3 swapped. All others show 835964.",
    vis: { kind: "symbols", target: "835964", compare: ["835964", "835964", "853964", "835964"] },
  },

  {
    cat: 5, type: "symbols", diff: "medium", badge: "Rapid Calculation", time: 12,
    text: "Solve quickly:",
    opts: ["12", "14", "16", "18"],
    ans: 1,
    exp: "24 ÷ 3 = 8. Then 8 + 6 = 14.",
    vis: { kind: "symbols", target: "24 ÷ 3 + 6 = ?" },
  },

  {
    cat: 5, type: "symbols", diff: "hard", badge: "Rapid Deduction", time: 10,
    text: "Who is the 3rd tallest?",
    opts: ["Diana", "Anna", "Ben", "Clara"],
    ans: 2,
    exp: "Order: Diana > Anna > Ben > Clara. The 3rd tallest is Ben.",
    vis: { kind: "symbols", target: "Diana > Anna > Ben > Clara" },
  },
];
