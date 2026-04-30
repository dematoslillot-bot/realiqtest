export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType =
  | "raven" | "rotation" | "bars" | "memory" | "symbols"
  | "sequence" | "analogy" | "text" | "oddone" | "pattern";

export type ShapeDef = {
  s: "c" | "sq" | "tr" | "di";  // circle, square, triangle, diamond
  x: number; y: number;          // centre in 60×60 viewbox
  r: number;                     // radius / half-size
  f?: boolean;                   // filled (default true)
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
  { name: "Logical Reasoning",   short: "Logic"    },
  { name: "Verbal Intelligence", short: "Verbal"   },
  { name: "Spatial Reasoning",   short: "Spatial"  },
  { name: "Numerical Ability",   short: "Numerical"},
  { name: "Working Memory",      short: "Memory"   },
  { name: "Processing Speed",    short: "Speed"    },
];

// ── Shape helpers ──────────────────────────────────────────────────────────

const c  = (x: number, y: number, r: number, f = true): ShapeDef => ({ s: "c",  x, y, r, f });
const sq = (x: number, y: number, r: number, f = true): ShapeDef => ({ s: "sq", x, y, r, f });
const tr = (x: number, y: number, r: number, f = true): ShapeDef => ({ s: "tr", x, y, r, f });
const di = (x: number, y: number, r: number, f = true): ShapeDef => ({ s: "di", x, y, r, f });

// ── Preset Raven cells (60×60 viewbox) ────────────────────────────────────

// Single — filled
const C1  = [c(30,30,14)];
const S1  = [sq(30,30,14)];
const T1  = [tr(30,30,14)];
const D1  = [di(30,30,14)];

// Two — filled
const C2  = [c(18,30,10), c(42,30,10)];
const S2  = [sq(18,30,10), sq(42,30,10)];
const T2  = [tr(18,30,10), tr(42,30,10)];

// Three — filled
const C3  = [c(13,30,8), c(30,30,8), c(47,30,8)];
const S3  = [sq(13,30,8), sq(30,30,8), sq(47,30,8)];
const T3  = [tr(13,30,8), tr(30,30,8), tr(47,30,8)];
const D3  = [di(13,30,8), di(30,30,8), di(47,30,8)];

// Single — outline
const C1o = [c(30,30,14,false)];
const S1o = [sq(30,30,14,false)];
const T1o = [tr(30,30,14,false)];
const D1o = [di(30,30,14,false)];

// Two — outline
const C2o = [c(18,30,10,false), c(42,30,10,false)];
const S2o = [sq(18,30,10,false), sq(42,30,10,false)];
const T2o = [tr(18,30,10,false), tr(42,30,10,false)];

// Three — outline
const C3o = [c(13,30,8,false), c(30,30,8,false), c(47,30,8,false)];
const S3o = [sq(13,30,8,false), sq(30,30,8,false), sq(47,30,8,false)];
const T3o = [tr(13,30,8,false), tr(30,30,8,false), tr(47,30,8,false)];

// Size variants — single filled
const C_big = [c(30,30,17)];
const C_med = [c(30,30,11)];
const C_sm  = [c(30,30,7)];
const S_big = [sq(30,30,17)];
const S_med = [sq(30,30,11)];
const S_sm  = [sq(30,30,7)];
const T_big = [tr(30,30,17)];
const T_med = [tr(30,30,11)];
const T_sm  = [tr(30,30,7)];

// Count + size (shrink as count grows)
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

// ── SVG paths for rotation questions ──────────────────────────────────────

const ARROW   = "M8,21 L8,39 L36,39 L36,51 L54,30 L36,9 L36,21 Z";
const L_SHAPE = "M10,8 L26,8 L26,46 L52,46 L52,56 L10,56 Z";
const T_SHAPE = "M8,8 L52,8 L52,22 L36,22 L36,56 L24,56 L24,22 L8,22 Z";
const STEP    = "M10,8 L36,8 L36,30 L55,30 L55,54 L28,54 L28,30 L10,30 Z";
const F_SHAPE = "M10,8 L50,8 L50,22 L24,22 L24,36 L44,36 L44,48 L24,48 L24,54 L10,54 Z";
// Harder shapes (more complex, asymmetric)
const Z_SHAPE = "M8,10 L52,10 L52,26 L20,26 L20,42 L52,42 L52,58 L8,58 L8,42 L40,42 L40,26 L8,26 Z";
const NOTCH   = "M10,8 L50,8 L36,28 L50,52 L10,52 Z";
const G_SHAPE = "M52,8 L52,38 L32,38 L32,26 L44,26 L44,20 L14,20 L14,44 L44,44 L44,38 L52,38 L52,56 L8,56 L8,8 Z";

// ── Questions ──────────────────────────────────────────────────────────────

export const ALL_QUESTIONS: Question[] = [

  // ── CAT 0 · LOGICAL REASONING — Raven matrices ───────────────────────────

  // Q1 easy: count 1→2→3, shape per row
  {
    cat: 0, type: "raven", diff: "easy", badge: "Matrix Pattern", time: 30,
    text: "Which image completes the matrix?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Each row has 1, 2, then 3 of the same shape. Row 3 uses triangles → 3 filled triangles.",
    vis: {
      kind: "raven",
      cells: [C1, C2, C3,  S1, S2, S3,  T1, T2, null],
      optCells: [T3, T1, S3, C3],
    },
  },

  // Q2 easy: Latin square C/S/T
  {
    cat: 0, type: "raven", diff: "easy", badge: "Shape Sequence", time: 30,
    text: "Which image completes the matrix?",
    opts: ["A", "B", "C", "D"],
    ans: 2,
    exp: "Each shape appears exactly once per row and column. Row 3, Col 3 must be square.",
    vis: {
      kind: "raven",
      cells: [C1, S1, T1,  S1, T1, C1,  T1, C1, null],
      optCells: [C1, T1, S1, D1],
    },
  },

  // Q3 medium: THREE rules — shape per row, count per row, fill per column
  // Row1: 1C-filled, 1C-outline, 1C-filled
  // Row2: 2S-filled, 2S-outline, 2S-filled
  // Row3: 3T-filled, 3T-outline, ??? → T3 (filled)
  {
    cat: 0, type: "raven", diff: "medium", badge: "Triple Rule", time: 25,
    text: "Which image completes the matrix?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Three simultaneous rules: shape per row (C→S→T), count per row (1→2→3), fill per column (filled→outline→filled). Missing = 3 filled triangles.",
    vis: {
      kind: "raven",
      cells: [C1, C1o, C1,  S2, S2o, S2,  T3, T3o, null],
      optCells: [T3, T3o, S3, C3],
    },
  },

  // Q4 medium: shape rotation per row + size decreases left→right
  // Row1: C-big, S-med, T-sm
  // Row2: T-big, C-med, S-sm
  // Row3: S-big, T-med, ??? → C-sm
  {
    cat: 0, type: "raven", diff: "medium", badge: "Rotation + Size", time: 25,
    text: "Which image completes the matrix?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Each row contains all three shapes in a cyclic order. Size decreases left→right (big→med→small). Row 3 is S→T→? = circle (small).",
    vis: {
      kind: "raven",
      cells: [C_big, S_med, T_sm,  T_big, C_med, S_sm,  S_big, T_med, null],
      optCells: [C_sm, S_sm, T_sm, C_big],
    },
  },

  // Q5 hard: Latin square C/S/D + fill per column (col1&3 filled, col2 outline)
  // Row1: C1-f, D1o, S1-f
  // Row2: S1-f, C1o, D1-f
  // Row3: D1-f, S1o, ??? → C1 (filled)
  {
    cat: 0, type: "raven", diff: "hard", badge: "Latin Square + Fill", time: 20,
    text: "Which image completes the matrix?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Latin square: each shape once per row and column. Columns 1 & 3 are filled, column 2 is outline. Missing = filled circle.",
    vis: {
      kind: "raven",
      cells: [C1, D1o, S1,  S1, C1o, D1,  D1, S1o, null],
      optCells: [C1, C1o, D1, S1],
    },
  },

  // ── CAT 1 · VERBAL INTELLIGENCE ──────────────────────────────────────────

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
    exp: "Serene means peacefully calm. The closest synonym is Calm.",
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

  // ── CAT 2 · SPATIAL REASONING — rotation ─────────────────────────────────

  // Q1 easy: Arrow 0° → 90° CW
  {
    cat: 2, type: "rotation", diff: "easy", badge: "Mental Rotation", time: 30,
    text: "The arrow points right (0°). Which option shows it rotated 90° clockwise?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Rotating a right-pointing arrow 90° clockwise gives a downward-pointing arrow.",
    vis: { kind: "rotation", path: ARROW, showAngle: 0, optAngles: [90, 0, 180, 270] },
  },

  // Q2 easy: L-shape 0° → 180°
  {
    cat: 2, type: "rotation", diff: "easy", badge: "Mental Rotation", time: 30,
    text: "Which option shows this L-shape rotated 180°?",
    opts: ["A", "B", "C", "D"],
    ans: 1,
    exp: "Rotating 180° flips the L-shape to face the opposite diagonal.",
    vis: { kind: "rotation", path: L_SHAPE, showAngle: 0, optAngles: [0, 180, 90, 270] },
  },

  // Q3 medium: Z-shape shown at 45° → which is 90° CW further? (45+90=135°)
  // Options only 45° apart — requires precise mental rotation
  {
    cat: 2, type: "rotation", diff: "medium", badge: "Compound Rotation", time: 25,
    text: "This Z-shape is shown at 45°. Which option shows it rotated a further 90° clockwise?",
    opts: ["A", "B", "C", "D"],
    ans: 2,
    exp: "45° + 90° clockwise = 135°. Options are only 45° apart, demanding precise rotation.",
    vis: { kind: "rotation", path: Z_SHAPE, showAngle: 45, optAngles: [45, 90, 135, 180] },
  },

  // Q4 medium/hard: Notch-shape 0° → 135° CW — options 45° apart
  {
    cat: 2, type: "rotation", diff: "medium", badge: "Precise Rotation", time: 22,
    text: "Which option shows this flag-shape rotated exactly 135° clockwise from the original?",
    opts: ["A", "B", "C", "D"],
    ans: 1,
    exp: "135° clockwise is three-eighths of a full turn. Options are 45° apart — choose carefully.",
    vis: { kind: "rotation", path: NOTCH, showAngle: 0, optAngles: [90, 135, 180, 225] },
  },

  // Q5 hard: Complex G-shape shown at 270° — find original (0°)
  {
    cat: 2, type: "rotation", diff: "hard", badge: "Inverse Rotation", time: 18,
    text: "This complex shape has been rotated 270° clockwise. Which option shows its original position?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "To undo 270° CW, rotate 90° CW (or equivalently 270° CCW). Original orientation = 0°.",
    vis: { kind: "rotation", path: G_SHAPE, showAngle: 270, optAngles: [0, 90, 180, 270] },
  },

  // ── CAT 3 · NUMERICAL ABILITY — bar charts ────────────────────────────────

  // Q1 easy: ×2 series
  {
    cat: 3, type: "bars", diff: "easy", badge: "Number Series", time: 30,
    text: "What value completes this series?",
    opts: ["36", "42", "48", "30"],
    ans: 2,
    exp: "Each term doubles. 24 × 2 = 48.",
    vis: { kind: "bars", values: [3, 6, 12, 24, null], max: 60 },
  },

  // Q2 easy: decreasing gaps
  {
    cat: 3, type: "bars", diff: "easy", badge: "Decreasing Series", time: 30,
    text: "What is the missing bar value?",
    opts: ["25", "30", "35", "40"],
    ans: 0,
    exp: "Gaps: −5, −10, −15, −20, −25. So 50 − 25 = 25.",
    vis: { kind: "bars", values: [100, 95, 85, 70, 50, null], max: 110 },
  },

  // Q3 medium: alternating ×3 / ÷1.5
  // 2, 6, 4, 12, 8, 24, → 16
  {
    cat: 3, type: "bars", diff: "medium", badge: "Alternating Rule", time: 25,
    text: "Which value completes this alternating-operation series?",
    opts: ["12", "16", "18", "32"],
    ans: 1,
    exp: "Pattern alternates ×3 then ÷1.5: 2→6→4→12→8→24→16. After 24: 24 ÷ 1.5 = 16.",
    vis: { kind: "bars", values: [2, 6, 4, 12, 8, 24, null], max: 28 },
  },

  // Q4 medium/hard: modified Fibonacci (seed 2,2) → 2,2,4,6,10,16,26
  {
    cat: 3, type: "bars", diff: "medium", badge: "Modified Fibonacci", time: 22,
    text: "What completes this Fibonacci-variant series?",
    opts: ["24", "26", "28", "30"],
    ans: 1,
    exp: "Each term = sum of previous two (starting at 2,2). 2,2,4,6,10,16 → 10+16 = 26.",
    vis: { kind: "bars", values: [2, 2, 4, 6, 10, 16, null], max: 30 },
  },

  // Q5 hard: 2^n − 1 series: 1, 3, 7, 15, 31, → 63
  {
    cat: 3, type: "bars", diff: "hard", badge: "Exponential Pattern", time: 18,
    text: "What is the missing value?",
    opts: ["57", "61", "63", "65"],
    ans: 2,
    exp: "Each term = previous × 2 + 1: 1, 3, 7, 15, 31, 63. (31 × 2 + 1 = 63)",
    vis: { kind: "bars", values: [1, 3, 7, 15, 31, null], max: 70 },
  },

  // ── CAT 4 · WORKING MEMORY — colour sequences ─────────────────────────────

  // Q1 easy: 5 colours, 2800 ms, ask last
  {
    cat: 4, type: "memory", diff: "easy", badge: "Colour Memory", time: 30,
    text: "What was the LAST colour in the sequence?",
    opts: ["Green", "Yellow", "Purple", "Blue"],
    ans: 2,
    exp: "Sequence: Red → Blue → Green → Yellow → Purple. The last colour was Purple.",
    vis: { kind: "memory", colors: ["#FF3B3B", "#0055FF", "#00D87A", "#FFD700", "#9B59B6"], showMs: 2800 },
  },

  // Q2 easy: 6 colours, 2800 ms, ask 4th
  {
    cat: 4, type: "memory", diff: "easy", badge: "Colour Memory", time: 30,
    text: "What was the 4th colour in the sequence?",
    opts: ["Yellow", "Green", "Blue", "Orange"],
    ans: 1,
    exp: "Sequence: Red → Orange → Yellow → Green → Blue → Purple. The 4th colour was Green.",
    vis: { kind: "memory", colors: ["#FF3B3B", "#FF8C00", "#FFD700", "#00D87A", "#00AAFF", "#9B59B6"], showMs: 2800 },
  },

  // Q3 medium: 6 colours with repeat, 2200 ms, count distinct
  {
    cat: 4, type: "memory", diff: "medium", badge: "Colour Count", time: 28,
    text: "How many DIFFERENT colours appeared in the sequence?",
    opts: ["4", "5", "6", "7"],
    ans: 1,
    exp: "Sequence: Blue, Red, Yellow, Purple, Red, Green — 5 distinct colours (Red appeared twice).",
    vis: { kind: "memory", colors: ["#00AAFF", "#FF3B3B", "#FFD700", "#9B59B6", "#FF3B3B", "#00D87A"], showMs: 2200 },
  },

  // Q4 medium: 7 colours, 2200 ms, ask 6th
  {
    cat: 4, type: "memory", diff: "medium", badge: "Sequence Recall", time: 25,
    text: "What was the 6th colour?",
    opts: ["Purple", "Orange", "Red", "Blue"],
    ans: 2,
    exp: "Sequence: Red → Blue → Purple → Green → Orange → Red → Yellow. The 6th colour was Red.",
    vis: { kind: "memory", colors: ["#FF3B3B", "#00AAFF", "#9B59B6", "#00D87A", "#FF8C00", "#FF3B3B", "#FFD700"], showMs: 2200 },
  },

  // Q5 hard: 8 colours, 1800 ms, count blue appearances
  {
    cat: 4, type: "memory", diff: "hard", badge: "Frequency Recall", time: 22,
    text: "How many times did Blue appear in the sequence?",
    opts: ["1", "2", "3", "4"],
    ans: 1,
    exp: "Sequence: Blue, Red, Green, Yellow, Purple, Blue, Orange, Red — Blue appeared 2 times.",
    vis: { kind: "memory", colors: ["#00AAFF", "#FF3B3B", "#00D87A", "#FFD700", "#9B59B6", "#00AAFF", "#FF8C00", "#FF3B3B"], showMs: 1800 },
  },

  // ── CAT 5 · PROCESSING SPEED ─────────────────────────────────────────────

  // Q1 easy, 12 s: exact string match in number grid
  {
    cat: 5, type: "symbols", diff: "easy", badge: "Symbol Match", time: 12,
    text: "Which option exactly matches the target?",
    opts: ["1st", "2nd", "3rd", "4th"],
    ans: 2,
    exp: "Only the 3rd item (738291) matches the target exactly.",
    vis: { kind: "symbols", target: "738291", compare: ["738921", "738219", "738291", "738912"] },
  },

  // Q2 easy, 12 s: fast arithmetic
  {
    cat: 5, type: "symbols", diff: "easy", badge: "Rapid Arithmetic", time: 12,
    text: "Solve as fast as you can:",
    opts: ["50", "55", "60", "65"],
    ans: 2,
    exp: "15 × 4 = 60.",
    vis: { kind: "symbols", target: "15 × 4 = ?" },
  },

  // Q3 medium, 10 s: spot the different alphanumeric string
  {
    cat: 5, type: "symbols", diff: "medium", badge: "Spot the Difference", time: 10,
    text: "Which item is DIFFERENT from the others?",
    opts: ["1st", "2nd", "3rd", "4th"],
    ans: 1,
    exp: "The 2nd item (K7B0D3) has a 0 instead of 9. All others show K7B9D3.",
    vis: { kind: "symbols", target: "K7B9D3", compare: ["K7B9D3", "K7B0D3", "K7B9D3", "K7B9D3"] },
  },

  // Q4 medium, 10 s: two-step calculation
  {
    cat: 5, type: "symbols", diff: "medium", badge: "Rapid Calculation", time: 10,
    text: "Solve quickly:",
    opts: ["15", "16", "17", "18"],
    ans: 1,
    exp: "36 ÷ 4 = 9, then 9 + 7 = 16.",
    vis: { kind: "symbols", target: "36 ÷ 4 + 7 = ?" },
  },

  // Q5 hard, 8 s: ordering — 2nd smallest
  {
    cat: 5, type: "symbols", diff: "hard", badge: "Rapid Deduction", time: 8,
    text: "Who is the 2nd SMALLEST?",
    opts: ["P", "Q", "R", "T"],
    ans: 2,
    exp: "Order ascending: P < R < Q < T < S. The 2nd smallest is R.",
    vis: { kind: "symbols", target: "P < R < Q < T < S" },
  },
];
