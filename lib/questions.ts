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
  | { kind: "rotation"; path: string; showAngle: number; optAngles: number[]; optMirrors?: boolean[] }
  | { kind: "memory";   colors: string[];             showMs?: number }
  | { kind: "symbols";  target: string;               compare?: string[] }
  | { kind: "embedded"; display: string;              optPaths: string[] }
  | { kind: "dicenet";  faces: number[] };

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

// Size variants — single outline (for triple-rule questions)
const C_medo = [c(30,30,11,false)];
const S_medo = [sq(30,30,11,false)];
const T_medo = [tr(30,30,11,false)];
const C_smo  = [c(30,30,7,false)];

// Two/Three diamonds (for hard Latin square question)
const D2   = [di(18,30,10), di(42,30,10)];
const D3o  = [di(13,30,8,false), di(30,30,8,false), di(47,30,8,false)];

// ── XOR / Cancellation cells (side-by-side, r=11) ────────────────────────
// Rule: shapes appearing in BOTH col1 and col2 cancel; only unique shapes survive in col3
// Row1: circle|square  +  circle|diamond  →  square|diamond  (circle cancels)
// Row2: square|triangle+  square|circle   →  triangle|circle (square cancels)
// Row3: triangle|diamond+ triangle|square →  diamond|square  (triangle cancels) ← ANSWER
const xCS = [c(18,30,11),  sq(42,30,11)];  // circle | square
const xCD = [c(18,30,11),  di(42,30,11)];  // circle | diamond
const xSD = [sq(18,30,11), di(42,30,11)];  // square | diamond   (row1 result)
const xST = [sq(18,30,11), tr(42,30,11)];  // square | triangle  (row2 col1)
const xSC = [sq(18,30,11), c(42,30,11)];   // square | circle    (row2 col2)
const xTC = [tr(18,30,11), c(42,30,11)];   // triangle| circle   (row2 result)
const xTD = [tr(18,30,11), di(42,30,11)];  // triangle| diamond  (row3 col1)
const xTS = [tr(18,30,11), sq(42,30,11)];  // triangle| square   (row3 col2)
const xDS = [di(18,30,11), sq(42,30,11)];  // diamond | square   ← CORRECT ANSWER
// Distractors: xTD (triangle persists), xTC (from row2), xCS (from row1 input)

// Size-only diamond variant
const D_sm  = [di(30,30,7)];

// Stacked dual-shape cells (top r=12 at y=16, bottom r=9 at y=44)
// Rule: col3 = col1 shape stacked on top of col2 shape
const aCbDd = [c(30,16,12),  di(30,44,9)];   // circle top + diamond bottom
const aSbTd = [sq(30,16,12), tr(30,44,9)];   // square top + triangle bottom
const aTbCd = [tr(30,16,12), c(30,44,9)];    // triangle top + circle bottom ← ANSWER
const aCbTd = [c(30,16,12),  tr(30,44,9)];   // distractor: circle top + triangle bottom
const aTbDd = [tr(30,16,12), di(30,44,9)];   // distractor: triangle top + diamond bottom

// Quadrant position cells (4 circles r=8 at corners of 60×60 cell)
// Filled position rotates clockwise: TL(0)→TR(1)→BR(2)→BL(3)→TL(0)
const qTL   = [c(15,15,8),         c(45,15,8,false), c(15,45,8,false), c(45,45,8,false)];
const qTR   = [c(15,15,8,false), c(45,15,8),         c(15,45,8,false), c(45,45,8,false)];
const qBR   = [c(15,15,8,false), c(45,15,8,false), c(15,45,8,false), c(45,45,8)        ];
const qBL   = [c(15,15,8,false), c(45,15,8,false), c(15,45,8),         c(45,45,8,false)];
const qAll4 = [c(15,15,8),         c(45,15,8),         c(15,45,8),         c(45,45,8)  ];

// Fill-shift tri-shape cells: 3 shapes at l/m/r positions (r=7), exactly one filled per cell
// Row 1 — shapes C S T
const fsR1C1 = [c(13,30,7),           sq(30,30,7,false), tr(47,30,7,false)];
const fsR1C2 = [c(13,30,7,false), sq(30,30,7),           tr(47,30,7,false)];
const fsR1C3 = [c(13,30,7,false), sq(30,30,7,false), tr(47,30,7)          ];
// Row 2 — shapes T C S
const fsR2C1 = [tr(13,30,7),           c(30,30,7,false),  sq(47,30,7,false)];
const fsR2C2 = [tr(13,30,7,false), c(30,30,7),            sq(47,30,7,false)];
const fsR2C3 = [tr(13,30,7,false), c(30,30,7,false),  sq(47,30,7)          ];
// Row 3 — shapes S T C
const fsR3C1 = [sq(13,30,7),           tr(30,30,7,false), c(47,30,7,false) ];
const fsR3C2 = [sq(13,30,7,false), tr(30,30,7),           c(47,30,7,false) ];
const fsR3C3 = [sq(13,30,7,false), tr(30,30,7,false), c(47,30,7)           ]; // ← ANSWER
const fsAllF = [sq(13,30,7),           tr(30,30,7),           c(47,30,7)    ]; // distractor

// ── Overlay combination cells (both shapes at r=14, centred at 30,30) ───────
// Rule: col3 = col1 shape (filled) OVERLAID with col2 shape (outline) — visually they merge/intersect
const ovC  = [c(30,30,14)];
const ovS  = [sq(30,30,14)];
const ovT  = [tr(30,30,14)];
const ovCS = [c(30,30,14),  sq(30,30,14,false)];  // filled circle + outline square
const ovST = [sq(30,30,14), tr(30,30,14,false)];  // filled square + outline triangle
const ovTC = [tr(30,30,14), c(30,30,14,false)];   // filled triangle + outline circle ← ANSWER
const ovCT = [c(30,30,14),  tr(30,30,14,false)];  // distractor: wrong order (circle base)
const ovDS = [di(30,30,14), sq(30,30,14,false)];  // distractor: diamond base (wrong shape)

// ── Multi-operation cells (3 distinct row rules: UNION / SUBTRACTION / XOR) ──
// Row 1 UNION  : col3 = col1 ∪ col2 (all shapes appear)
const moR1C1 = [c(18,30,11),  sq(42,30,11)];              // {C,S}
const moR1C2 = [sq(18,30,11), tr(42,30,11)];              // {S,T}
const moR1C3 = [c(13,30,8),   sq(30,30,8), tr(47,30,8)]; // {C,S,T}
// Row 2 SUBTRACT: col3 = col1 − col2 (remove shapes that appear in col2)
const moR2C1 = [c(13,30,8),   sq(30,30,8), tr(47,30,8)]; // {C,S,T}
const moR2C2 = [sq(30,30,11)];                             // {S}
const moR2C3 = [c(18,30,11),  tr(42,30,11)];              // {C,T}  (S removed)
// Row 3 XOR: col3 = shapes unique to col1 OR col2 (shared shapes cancel)
const moR3C1 = [tr(18,30,11), c(42,30,11)];               // {T,C}
const moR3C2 = [tr(18,30,11), sq(42,30,11)];              // {T,S}
// ANSWER: T is in both → cancels → {C,S}  = moR1C1

// ── Concentric shape cells (outer outline r=18, inner filled r=8, centred at 30,30) ──
// Rule: outer shape = row attribute, inner shape = column attribute
const ccCC = [c(30,30,18,false), c(30,30,8)];
const ccCS = [c(30,30,18,false), sq(30,30,8)];
const ccCT = [c(30,30,18,false), tr(30,30,8)];
const ccCD = [c(30,30,18,false), di(30,30,8)];
const ccSC = [sq(30,30,18,false), c(30,30,8)];
const ccSS = [sq(30,30,18,false), sq(30,30,8)];
const ccST = [sq(30,30,18,false), tr(30,30,8)];
const ccSD = [sq(30,30,18,false), di(30,30,8)];
const ccTC = [tr(30,30,18,false), c(30,30,8)];
const ccTS = [tr(30,30,18,false), sq(30,30,8)];
const ccTT = [tr(30,30,18,false), tr(30,30,8)];
const ccTD = [tr(30,30,18,false), di(30,30,8)];
const ccDT = [di(30,30,18,false), tr(30,30,8)];

// ── Attribute-Drift cells (l=x13 / m=x30 / r=x47, r=8) ───────────────────
// Rule 1: shape type per row (C-S-T → S-T-C → T-C-S)
// Rule 2: number of filled shapes accumulates left-to-right (1 → 2 → 3)
const adR1C1 = [c(13,30,8),          sq(30,30,8,false), tr(47,30,8,false)];
const adR1C2 = [c(13,30,8),          sq(30,30,8),       tr(47,30,8,false)];
const adR1C3 = [c(13,30,8),          sq(30,30,8),       tr(47,30,8)      ];
const adR2C1 = [sq(13,30,8),         tr(30,30,8,false), c(47,30,8,false) ];
const adR2C2 = [sq(13,30,8),         tr(30,30,8),       c(47,30,8,false) ];
const adR2C3 = [sq(13,30,8),         tr(30,30,8),       c(47,30,8)       ];
const adR3C1 = [tr(13,30,8),         c(30,30,8,false),  sq(47,30,8,false)];
const adR3C2 = [tr(13,30,8),         c(30,30,8),        sq(47,30,8,false)];
const adR3C3 = [tr(13,30,8),         c(30,30,8),        sq(47,30,8)      ]; // ← ANSWER
const adR3w1  = [tr(13,30,8,false),  c(30,30,8),        sq(47,30,8)      ]; // tri not filled
const adR3w2  = [tr(13,30,8),        c(30,30,8,false),  sq(47,30,8,false)]; // only 1 filled
const adR3w3  = [sq(13,30,8),        tr(30,30,8),       c(47,30,8)       ]; // wrong shape set

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
// Complex asymmetric shapes (harder spatial questions)
const HOOK  = "M10,6 L28,6 L28,24 L50,24 L50,42 L38,42 L38,30 L18,30 L18,54 L10,54 Z";
const CRANK = "M8,8 L30,8 L30,20 L50,20 L50,8 L56,8 L56,46 L50,46 L50,34 L14,34 L14,52 L8,52 Z";
// New elaborate asymmetric shapes for spatial redesign
const BRACKET  = "M8,8 L8,52 L52,52 L52,36 L24,36 L24,24 L52,24 L52,8 Z";
const CELTIC_Z = "M10,8 L50,8 L50,22 L24,22 L50,40 L50,52 L10,52 L10,38 L36,38 L10,20 Z";
const CROWN_A  = "M8,52 L8,32 L18,32 L18,10 L28,10 L28,32 L36,32 L36,18 L46,18 L46,32 L54,32 L54,52 Z";

// ── Questions ──────────────────────────────────────────────────────────────

export const ALL_QUESTIONS: Question[] = [

  // ── CAT 0 · LOGICAL REASONING — Raven matrices ───────────────────────────

  // Q1 easy: concentric 2-attribute latin square
  // Outer shape cycles C→S→T per row; inner shape cycles C→S→T per column
  {
    cat: 0, type: "raven", diff: "easy", badge: "Nested Shapes", time: 30,
    text: "Which image completes the matrix?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Two rules run simultaneously: the outer (outline) shape cycles circle→square→triangle per row; the inner (filled) shape cycles circle→square→triangle per column. Row 3, col 3 needs outer triangle with inner triangle.",
    vis: {
      kind: "raven",
      cells: [ccCC, ccCS, ccCT,  ccSC, ccSS, ccST,  ccTC, ccTS, null],
      optCells: [ccTT, ccTS, ccST, ccTC],
    },
  },

  // Q2 easy: size × shape double rule
  // Column rule: shape = circle / square / triangle (left→right)
  // Row rule: size = large / medium / small (top→bottom)
  {
    cat: 0, type: "raven", diff: "easy", badge: "Size & Shape", time: 30,
    text: "Which image completes the matrix?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Column rule: shape is circle (col 1), square (col 2), triangle (col 3). Row rule: size goes large → medium → small. Row 3, col 3 needs a small triangle.",
    vis: {
      kind: "raven",
      cells: [C_big, S_big, T_big,  C_med, S_med, T_med,  C_sm, S_sm, null],
      optCells: [T_sm, T_big, D_sm, S_sm],
    },
  },

  // Q3 medium: attribute drift — shape type rotates per row; filled count accumulates per column
  // Row 1: C-S-T shapes; col 1 = 1 filled, col 2 = 2 filled, col 3 = 3 filled
  // Row 2: S-T-C shapes; same fill accumulation rule
  // Row 3: T-C-S shapes; col 3 → all 3 filled ← ANSWER
  {
    cat: 0, type: "raven", diff: "medium", badge: "Attribute Drift", time: 25,
    text: "Which image completes the matrix?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Two simultaneous rules: (1) the shape set rotates per row (C-S-T → S-T-C → T-C-S); (2) the number of filled shapes increases left-to-right (1 → 2 → 3). Row 3, col 3: T-C-S with all three filled.",
    vis: {
      kind: "raven",
      cells: [adR1C1, adR1C2, adR1C3,  adR2C1, adR2C2, adR2C3,  adR3C1, adR3C2, null],
      optCells: [adR3C3, adR3w1, adR3w2, adR3w3],
    },
  },

  // Q4 medium: OVERLAY COMBINATION — col3 = col1 shape (filled) merged with col2 shape (outline)
  // Col1: single filled shapes; Col2: single filled shapes; Col3: both shapes overlaid at same centre
  // Row1: circle(f) + square(f) → circle(f) inside outline-square
  // Row2: square(f) + triangle(f) → square(f) inside outline-triangle
  // Row3: triangle(f) + circle(f) → ??? → triangle(f) inside outline-circle
  {
    cat: 0, type: "raven", diff: "medium", badge: "Shape Overlay", time: 22,
    text: "Which image completes the matrix?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Rule: column 3 = the shape from column 1 (filled) overlaid with the shape from column 2 (drawn as outline). Row 3: filled triangle overlaid with outline circle — triangle inside a circle ring.",
    vis: {
      kind: "raven",
      cells: [ovC, ovS, ovCS,  ovS, ovT, ovST,  ovT, ovC, null],
      optCells: [ovTC, ovCT, ovST, ovDS],
    },
  },

  // Q5 hard (APM-level): CANCELLATION / XOR MATRIX
  // Each cell holds two shapes. In every row, any shape that appears in BOTH col1 AND col2
  // is "cancelled" and disappears from col3 — only shapes unique to one column survive.
  // Row1: {C,S} | {C,D} → C cancels → col3 = {S,D}
  // Row2: {S,T} | {S,C} → S cancels → col3 = {T,C}
  // Row3: {T,D} | {T,S} → T cancels → col3 = {D,S} ← ANSWER
  // Traps: B keeps triangle (rule misapplied), C copies row2 result, D uses row1 input
  {
    cat: 0, type: "raven", diff: "hard", badge: "Cancellation Matrix", time: 40,
    text: "Find the hidden rule, then choose the image that belongs in the empty cell.",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Cancellation rule: any shape present in BOTH col 1 AND col 2 of a row is removed in col 3 — only unique shapes survive. Row 3 has triangle+diamond and triangle+square → triangle cancels → answer is diamond+square.",
    vis: {
      kind: "raven",
      cells: [xCS, xCD, xSD,  xST, xSC, xTC,  xTD, xTS, null],
      optCells: [xDS, xTD, xTC, xCS],
    },
  },

  // Q6 hard: POSITION ROTATION (APM-level) ───────────────────────────────────
  // Each cell: 4 circles at corner positions, exactly 1 filled.
  // Rule: the filled position steps 90° clockwise with each move (left→right, top→bottom).
  // Steps: TL(0) TR(1) BR(2) | TR(1) BR(2) BL(3) | BR(2) BL(3) → TL(4≡0)
  {
    cat: 0, type: "raven", diff: "hard", badge: "Position Rotation", time: 38,
    text: "Find the hidden rule, then choose the image that belongs in the empty cell.",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "One circle is filled per cell; the rest are outlines. Reading left→right, top→bottom, the filled position rotates 90° clockwise each step (TL→TR→BR→BL→TL). After 8 steps the full cycle completes — the answer brings the filled circle back to the top-left corner.",
    vis: {
      kind: "raven",
      cells: [qTL, qTR, qBR,  qTR, qBR, qBL,  qBR, qBL, null],
      optCells: [qTL, qBL, qTR, qAll4],
    },
  },

  // Q7 hard: FILL SHIFT (Cattell CFI-level, two simultaneous rules) ──────────
  // Rule 1: each row has 3 shapes in fixed l/m/r positions — row 1: C-S-T, row 2: T-C-S, row 3: S-T-C
  // Rule 2: exactly one shape is filled per cell; the filled shape shifts one position right per column
  {
    cat: 0, type: "raven", diff: "hard", badge: "Fill Shift", time: 40,
    text: "Find the hidden rule, then choose the image that belongs in the empty cell.",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Two simultaneous rules: (1) shape order cycles per row — C-S-T → T-C-S → S-T-C. (2) exactly one shape is filled and it shifts right by one position per column. Row 3, col 3: shapes are S-T-C and the rightmost (circle) must be filled.",
    vis: {
      kind: "raven",
      cells: [fsR1C1, fsR1C2, fsR1C3,  fsR2C1, fsR2C2, fsR2C3,  fsR3C1, fsR3C2, null],
      optCells: [fsR3C3, fsR3C1, fsR3C2, fsAllF],
    },
  },

  // Q8 hard: ROW OPERATIONS — each row uses a different logical operation (HARDEST)
  // Row 1 UNION:      col3 = col1 ∪ col2   (all shapes from both cells appear)
  // Row 2 SUBTRACT:   col3 = col1 − col2   (shapes present in col2 are removed from col1)
  // Row 3 XOR:        col3 = col1 ⊕ col2   (shapes in BOTH cells cancel; only unique survive)
  // Row3: {T,C} ⊕ {T,S} → T cancels → answer = {C,S}
  {
    cat: 0, type: "raven", diff: "hard", badge: "Row Operations", time: 45,
    text: "Each row applies a different logical operation to its shapes. Discover the three rules, then choose the image for the empty cell.",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Three row rules: Row 1 UNION (col 3 = all shapes from col 1 and col 2 combined). Row 2 SUBTRACT (col 3 = col 1 minus any shape that also appears in col 2). Row 3 XOR (shapes present in BOTH col 1 and col 2 cancel — only shapes unique to one column survive). Row 3: {T,C} ⊕ {T,S} → triangle cancels → answer is {C,S}.",
    vis: {
      kind: "raven",
      cells: [moR1C1, moR1C2, moR1C3,  moR2C1, moR2C2, moR2C3,  moR3C1, moR3C2, null],
      optCells: [moR1C1, moR3C1, moR3C2, moR1C3],
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
    cat: 1, type: "text", diff: "hard", badge: "Syllogistic Logic", time: 35,
    text: "All Glimbs are Forbs. No Forbs are Splacts. Some Splacts are Yends. Which statement MUST be true?",
    opts: ["Some Glimbs are Splacts", "All Yends are Forbs", "No Glimbs are Splacts", "Some Forbs are Yends"],
    ans: 2,
    exp: "Chain: All Glimbs → Forbs. No Forbs → Splacts. Therefore by transitivity: No Glimbs → Splacts (C). A contradicts this. B and D go beyond what the premises support.",
  },

  // ── CAT 2 · SPATIAL REASONING — rotation ─────────────────────────────────

  // Q1 easy: DICE NET — fold the net and find the opposite face
  // Standard T-cross net: top=1, left=4, front=2, right=5, bottom=3, far-bottom=6
  // When folded: face 2 (front) is opposite to face 6 (back)
  {
    cat: 2, type: "rotation", diff: "easy", badge: "Dice Net", time: 30,
    text: "Fold this net into a cube. Which face ends up directly OPPOSITE the face showing 2 dots?",
    opts: ["1", "3", "5", "6"],
    ans: 3,
    exp: "The face with 2 dots is the centre of the cross — it becomes the front. The face at the end of the chain (6 dots) folds around to become the back face, directly opposite.",
    vis: { kind: "dicenet", faces: [1, 2, 3, 4, 5, 6] },
  },

  // Q2 easy: EMBEDDED FIGURES — identify which component shape is hidden inside the complex figure
  // Display = BRACKET + ARROW paths combined (evenodd fill creates interesting merged silhouette)
  // The ARROW shape is clearly traceable inside the merged figure
  {
    cat: 2, type: "rotation", diff: "easy", badge: "Hidden Shape", time: 30,
    text: "The figure on the left is formed by overlapping two shapes. Which of the four shapes below is one of the two components?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "The complex figure is formed by the ARROW shape overlapping the BRACKET shape. The arrow's shaft and triangular head are visible within the merged outline.",
    vis: {
      kind: "embedded",
      display: BRACKET + " " + ARROW,
      optPaths: [ARROW, CELTIC_Z, CROWN_A, STEP],
    },
  },

  // Q3 medium: CROWN_A (asymmetric crown with two teeth at different heights)
  // Show at 0°, ask for 115° CW; options within 20°; one mirror trap at correct angle
  {
    cat: 2, type: "rotation", diff: "medium", badge: "Compound Rotation", time: 22,
    text: "Which option shows this crown shape rotated exactly 115° clockwise?",
    opts: ["A", "B", "C", "D"],
    ans: 1,
    exp: "115° sits between 90° and 135°. Option A is only 95° (20° short). Option C looks identical to B but is horizontally mirrored — a reflection is not the same as a rotation.",
    vis: {
      kind: "rotation", path: CROWN_A, showAngle: 0,
      optAngles:  [95, 115, 115, 135],
      optMirrors: [false, false, true, false],
    },
  },

  // Q4 medium: F_SHAPE shown at 40°, rotate a further 100° CW → 140°
  // Options within 20° of each other; one mirror distractor at the exact correct angle
  {
    cat: 2, type: "rotation", diff: "medium", badge: "Precise Rotation", time: 20,
    text: "This shape is at 40°. Which shows it rotated a further 100° clockwise?",
    opts: ["A", "B", "C", "D"],
    ans: 1,
    exp: "40° + 100° = 140°. Options are within 20° of each other. Option C is the mirror image at 140° — a reflection, not a rotation.",
    vis: {
      kind: "rotation", path: F_SHAPE, showAngle: 40,
      optAngles:  [120, 140, 140, 160],
      optMirrors: [false, false, true, false],
    },
  },

  // Q5 hard: HOOK shown at 230° — find original orientation (0°)
  // Options within 10° of each other; mirror trap at the correct angle (ans=3)
  // To undo 230° CW rotate a further 130° CW → back to 0°
  {
    cat: 2, type: "rotation", diff: "hard", badge: "Inverse Rotation", time: 25,
    text: "This shape has been rotated 230° clockwise from its original position. Which option shows the ORIGINAL orientation?",
    opts: ["A", "B", "C", "D"],
    ans: 3,
    exp: "360° − 230° = 130° more clockwise returns to the original. Original = 0°. Option A is 0° but horizontally mirrored (a reflection, not a rotation). B is 350° (10° short). C is 10° (10° past). Only D is the exact original.",
    vis: {
      kind: "rotation", path: HOOK, showAngle: 230,
      optAngles:  [0,   350, 10, 0],
      optMirrors: [true, false, false, false],
    },
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

  // Q1 easy, 10 s: exact match in long alphanumeric string
  {
    cat: 5, type: "symbols", diff: "easy", badge: "Symbol Match", time: 10,
    text: "Which option exactly matches the target?",
    opts: ["1st", "2nd", "3rd", "4th"],
    ans: 0,
    exp: "Only the 1st item (4R7Q2M8K) matches the target exactly. The 2nd swaps 2→Z, the 3rd swaps Q→G, the 4th swaps M→N.",
    vis: { kind: "symbols", target: "4R7Q2M8K", compare: ["4R7Q2M8K", "4R7QZM8K", "4R7G2M8K", "4R7Q2N8K"] },
  },

  // Q2 easy, 10 s: fast two-step arithmetic
  {
    cat: 5, type: "symbols", diff: "easy", badge: "Rapid Arithmetic", time: 10,
    text: "Solve as fast as you can:",
    opts: ["49", "51", "53", "55"],
    ans: 1,
    exp: "17 × 3 = 51.",
    vis: { kind: "symbols", target: "17 × 3 = ?" },
  },

  // Q3 medium, 10 s: spot the ONE different string (strings are visually near-identical)
  {
    cat: 5, type: "symbols", diff: "medium", badge: "Spot the Difference", time: 10,
    text: "Which item is DIFFERENT from the others?",
    opts: ["1st", "2nd", "3rd", "4th"],
    ans: 2,
    exp: "The 3rd item has C instead of G (N5X8C2Z vs N5X8G2Z). All others are identical.",
    vis: { kind: "symbols", target: "N5X8G2Z", compare: ["N5X8G2Z", "N5X8G2Z", "N5X8C2Z", "N5X8G2Z"] },
  },

  // Q4 medium, 10 s: three-step calculation
  {
    cat: 5, type: "symbols", diff: "medium", badge: "Rapid Calculation", time: 10,
    text: "Solve quickly:",
    opts: ["27", "29", "31", "33"],
    ans: 2,
    exp: "48 ÷ 6 = 8, then 8 × 5 = 40, then 40 − 9 = 31.",
    vis: { kind: "symbols", target: "48 ÷ 6 × 5 − 9 = ?" },
  },

  // Q5 hard, 10 s: ordering chain — identify the median
  {
    cat: 5, type: "symbols", diff: "hard", badge: "Rapid Deduction", time: 10,
    text: "Which value is the MEDIAN (middle) of these five?",
    opts: ["S", "T", "P", "R"],
    ans: 1,
    exp: "Order ascending: Q < R < T < P < S. The median (3rd of 5) is T.",
    vis: { kind: "symbols", target: "S > P > T > R > Q" },
  },
];
