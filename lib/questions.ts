export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType =
  | "raven" | "rotation" | "bars" | "memory" | "symbols"
  | "sequence" | "analogy" | "text" | "oddone" | "pattern";

export type ShapeDef = {
  s: "c" | "sq" | "tr" | "di";
  x: number; y: number;
  r: number;
  f?: boolean;
};

export type RavenCell = ShapeDef[];

export type VisualDef =
  | { kind: "raven";       cells: (RavenCell | null)[];  optCells: RavenCell[] }
  | { kind: "bars";        values: (number | null)[];    max: number }
  | { kind: "rotation";    path: string; showAngle: number; optAngles: number[]; optMirrors?: boolean[] }
  | { kind: "memory";      colors: string[];              showMs?: number }
  | { kind: "symbols";     target: string;                compare?: string[] }
  | { kind: "embedded";    display: string;               optPaths: string[] }
  | { kind: "dicenet";     faces: number[] }
  | { kind: "raven2";      cells: (RavenCell|null)[];    optCells: RavenCell[] }
  | { kind: "ravenrot";    path: string; angles: (number|null)[]; optAngles: number[] }
  | { kind: "ravenpattern";cells: (PCell|null)[];        optCells: PCell[] }
  | { kind: "topview";     optGrids: string[] }
  | { kind: "clock";       seqH: number[]; seqM: number[]; optH: number[]; optM: number[] }
  | { kind: "heatmap";     grid: (number|null)[][];      optVals: number[] }
  | { kind: "mirror";      path: string;                  optPaths: string[] }
  | { kind: "maze";        arrows: string[] }
  | { kind: "binary";      rows: (0|1|null)[][];          optRows: (0|1)[][] }
  | { kind: "shadow3d";    optGrids: string[] }
  | { kind: "origami" }
  | { kind: "shapesum";    exA: RavenCell; exB: RavenCell; exC: RavenCell; qA: RavenCell; qB: RavenCell; optCells: RavenCell[] }
  | { kind: "symcode";     equations: string[];           optVals: string[] };

export type PCell = { shape: "tri"|"sq"|"ci"; fill: "h"|"v"|"d" };

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

const C1  = [c(30,30,14)];
const S1  = [sq(30,30,14)];
const T1  = [tr(30,30,14)];
const D1  = [di(30,30,14)];

const C2  = [c(18,30,10), c(42,30,10)];
const S2  = [sq(18,30,10), sq(42,30,10)];
const T2  = [tr(18,30,10), tr(42,30,10)];

const C3  = [c(13,30,8), c(30,30,8), c(47,30,8)];
const S3  = [sq(13,30,8), sq(30,30,8), sq(47,30,8)];
const T3  = [tr(13,30,8), tr(30,30,8), tr(47,30,8)];
const D3  = [di(13,30,8), di(30,30,8), di(47,30,8)];

const C1o = [c(30,30,14,false)];
const S1o = [sq(30,30,14,false)];
const T1o = [tr(30,30,14,false)];
const D1o = [di(30,30,14,false)];

const C2o = [c(18,30,10,false), c(42,30,10,false)];
const S2o = [sq(18,30,10,false), sq(42,30,10,false)];
const T2o = [tr(18,30,10,false), tr(42,30,10,false)];

const C3o = [c(13,30,8,false), c(30,30,8,false), c(47,30,8,false)];
const S3o = [sq(13,30,8,false), sq(30,30,8,false), sq(47,30,8,false)];
const T3o = [tr(13,30,8,false), tr(30,30,8,false), tr(47,30,8,false)];

const C_big = [c(30,30,17)];
const C_med = [c(30,30,11)];
const C_sm  = [c(30,30,7)];
const S_big = [sq(30,30,17)];
const S_med = [sq(30,30,11)];
const S_sm  = [sq(30,30,7)];
const T_big = [tr(30,30,17)];
const T_med = [tr(30,30,11)];
const T_sm  = [tr(30,30,7)];

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

const C_medo = [c(30,30,11,false)];
const S_medo = [sq(30,30,11,false)];
const T_medo = [tr(30,30,11,false)];
const C_smo  = [c(30,30,7,false)];

const D2   = [di(18,30,10), di(42,30,10)];
const D3o  = [di(13,30,8,false), di(30,30,8,false), di(47,30,8,false)];
const D_sm  = [di(30,30,7)];

// ── XOR / Cancellation cells ───────────────────────────────────────────────
// (corner A4 anchors removed — shapes only)
const xCS = [c(18,30,11),  sq(42,30,11)];
const xCD = [c(18,30,11),  di(42,30,11)];
const xSD = [sq(18,30,11), di(42,30,11)];
const xST = [sq(18,30,11), tr(42,30,11)];
const xSC = [sq(18,30,11), c(42,30,11)];
const xTC = [tr(18,30,11), c(42,30,11)];
const xTD = [tr(18,30,11), di(42,30,11)];
const xTS = [tr(18,30,11), sq(42,30,11)];
const xDS = [di(18,30,11), sq(42,30,11)];

// Stacked dual-shape cells
const aCbDd = [c(30,16,12),  di(30,44,9)];
const aSbTd = [sq(30,16,12), tr(30,44,9)];
const aTbCd = [tr(30,16,12), c(30,44,9)];
const aCbTd = [c(30,16,12),  tr(30,44,9)];
const aTbDd = [tr(30,16,12), di(30,44,9)];

// ── Dot-pattern decorators (for decoration-matrix question) ───────────────
const dP = [c(30,14,2),c(30,21,2), c(14,30,2),c(21,30,2), c(39,30,2),c(46,30,2), c(30,39,2),c(30,46,2)];
const dX = [c(15,15,2),c(22,22,2),c(38,38,2),c(45,45,2), c(45,15,2),c(38,22,2),c(22,38,2),c(15,45,2)];

// Decoration-matrix cells (outer outline shape + dot pattern, NO corner anchors)
const dmCn = [c(30,30,18,false)];
const dmCp = [c(30,30,18,false), ...dP];
const dmCx = [c(30,30,18,false), ...dX];
const dmSn = [sq(30,30,18,false)];
const dmSp = [sq(30,30,18,false), ...dP];
const dmSx = [sq(30,30,18,false), ...dX];
const dmTn = [tr(30,30,18,false)];
const dmTp = [tr(30,30,18,false), ...dP];
const dmTx = [tr(30,30,18,false), ...dX]; // ← ANSWER

// Quadrant position cells (NO edge midpoint markers — clean)
const qTL   = [c(15,15,11),           c(45,15,11,false), c(15,45,11,false), c(45,45,11,false)];
const qTR   = [c(15,15,11,false), c(45,15,11),           c(15,45,11,false), c(45,45,11,false)];
const qBR   = [c(15,15,11,false), c(45,15,11,false), c(15,45,11,false), c(45,45,11)          ];
const qBL   = [c(15,15,11,false), c(45,15,11,false), c(15,45,11),           c(45,45,11,false)];
const qAll4 = [c(15,15,11),           c(45,15,11),           c(15,45,11),           c(45,45,11)];

// Fill-shift cells (NO corner anchors)
const fsR1C1 = [c(13,30,8),           sq(30,30,8,false), tr(47,30,8,false)];
const fsR1C2 = [c(13,30,8,false),  sq(30,30,8),           tr(47,30,8,false)];
const fsR1C3 = [c(13,30,8,false),  sq(30,30,8,false), tr(47,30,8)          ];
const fsR2C1 = [tr(13,30,8),           c(30,30,8,false),  sq(47,30,8,false)];
const fsR2C2 = [tr(13,30,8,false),  c(30,30,8),            sq(47,30,8,false)];
const fsR2C3 = [tr(13,30,8,false),  c(30,30,8,false),  sq(47,30,8)          ];
const fsR3C1 = [sq(13,30,8),           tr(30,30,8,false), c(47,30,8,false) ];
const fsR3C2 = [sq(13,30,8,false),  tr(30,30,8),           c(47,30,8,false) ];
const fsR3C3 = [sq(13,30,8,false),  tr(30,30,8,false), c(47,30,8)           ]; // ← ANSWER
const fsAllF = [sq(13,30,8),           tr(30,30,8),           c(47,30,8)    ];

// Overlay cells (NO corner anchors)
const ovC  = [c(30,30,14)];
const ovS  = [sq(30,30,14)];
const ovT  = [tr(30,30,14)];
const ovCS = [c(30,30,14),  sq(30,30,14,false)];
const ovST = [sq(30,30,14), tr(30,30,14,false)];
const ovTC = [tr(30,30,14), c(30,30,14,false)];   // ← ANSWER
const ovCT = [c(30,30,14),  tr(30,30,14,false)];
const ovDS = [di(30,30,14), sq(30,30,14,false)];

// Multi-operation cells (NO corner anchors)
const moR1C1 = [c(18,30,11),  sq(42,30,11)];
const moR1C2 = [sq(18,30,11), tr(42,30,11)];
const moR1C3 = [c(13,30,8),   sq(30,30,8), tr(47,30,8)];
const moR2C1 = [c(13,30,8),   sq(30,30,8), tr(47,30,8)];
const moR2C2 = [sq(30,30,11)];
const moR2C3 = [c(18,30,11),  tr(42,30,11)];
const moR3C1 = [tr(18,30,11), c(42,30,11)];
const moR3C2 = [tr(18,30,11), sq(42,30,11)];

// Attribute-drift cells (NO corner anchors)
const adR1C1 = [c(13,30,8),          sq(30,30,8,false), tr(47,30,8,false)];
const adR1C2 = [c(13,30,8),          sq(30,30,8),       tr(47,30,8,false)];
const adR1C3 = [c(13,30,8),          sq(30,30,8),       tr(47,30,8)      ];
const adR2C1 = [sq(13,30,8),         tr(30,30,8,false), c(47,30,8,false) ];
const adR2C2 = [sq(13,30,8),         tr(30,30,8),       c(47,30,8,false) ];
const adR2C3 = [sq(13,30,8),         tr(30,30,8),       c(47,30,8)       ];
const adR3C1 = [tr(13,30,8),         c(30,30,8,false),  sq(47,30,8,false)];
const adR3C2 = [tr(13,30,8),         c(30,30,8),        sq(47,30,8,false)];
const adR3C3 = [tr(13,30,8),         c(30,30,8),        sq(47,30,8)      ]; // ← ANSWER
const adR3w1  = [tr(13,30,8,false),  c(30,30,8),        sq(47,30,8)      ];
const adR3w2  = [tr(13,30,8),        c(30,30,8,false),  sq(47,30,8,false)];
const adR3w3  = [sq(13,30,8),        tr(30,30,8),       c(47,30,8)       ];

// Concentric shape cells (for various questions & shapesum)
const ccCT = [c(30,30,18,false),  tr(30,30,8)];
const ccCD = [c(30,30,18,false),  di(30,30,8)];
const ccSC = [sq(30,30,18,false), c(30,30,8)];
const ccST = [sq(30,30,18,false), tr(30,30,8)];
const ccSD = [sq(30,30,18,false), di(30,30,8)];   // ← shapesum correct answer
const ccTC = [tr(30,30,18,false), c(30,30,8)];
const ccTS = [tr(30,30,18,false), sq(30,30,8)];
const ccTD = [tr(30,30,18,false), di(30,30,8)];
const ccDC = [di(30,30,18,false), c(30,30,8)];

// ── SVG paths ─────────────────────────────────────────────────────────────

const ARROW     = "M8,21 L8,39 L36,39 L36,51 L54,30 L36,9 L36,21 Z";
const L_SHAPE   = "M10,8 L26,8 L26,46 L52,46 L52,56 L10,56 Z";
const T_SHAPE   = "M8,8 L52,8 L52,22 L36,22 L36,56 L24,56 L24,22 L8,22 Z";
const STEP      = "M10,8 L36,8 L36,30 L55,30 L55,54 L28,54 L28,30 L10,30 Z";
const F_SHAPE   = "M10,8 L50,8 L50,22 L24,22 L24,36 L44,36 L44,48 L24,48 L24,54 L10,54 Z";
const Z_SHAPE   = "M8,10 L52,10 L52,26 L20,26 L20,42 L52,42 L52,58 L8,58 L8,42 L40,42 L40,26 L8,26 Z";
const NOTCH     = "M10,8 L50,8 L36,28 L50,52 L10,52 Z";
const G_SHAPE   = "M52,8 L52,38 L32,38 L32,26 L44,26 L44,20 L14,20 L14,44 L44,44 L44,38 L52,38 L52,56 L8,56 L8,8 Z";
const HOOK      = "M10,6 L28,6 L28,24 L50,24 L50,42 L38,42 L38,30 L18,30 L18,54 L10,54 Z";
const CRANK     = "M8,8 L30,8 L30,20 L50,20 L50,8 L56,8 L56,46 L50,46 L50,34 L14,34 L14,52 L8,52 Z";
const BRACKET   = "M8,8 L8,52 L52,52 L52,36 L24,36 L24,24 L52,24 L52,8 Z";
const CELTIC_Z  = "M10,8 L50,8 L50,22 L24,22 L50,40 L50,52 L10,52 L10,38 L36,38 L10,20 Z";
const CROWN_A   = "M8,52 L8,32 L18,32 L18,10 L28,10 L28,32 L36,32 L36,18 L46,18 L46,32 L54,32 L54,52 Z";
const ARROW_TRI = "M10,30 L50,10 L50,50 Z";

// ── Questions ──────────────────────────────────────────────────────────────

export const ALL_QUESTIONS: Question[] = [

  // ── CAT 0 · LOGICAL REASONING ────────────────────────────────────────────

  // Q1 · CLOCK LOGIC — each clock advances +1h 30min
  {
    cat: 0, type: "raven", diff: "medium", badge: "Clock Logic", time: 32,
    text: "Each clock advances by the same time interval. What does the 4th clock show?",
    opts: ["A", "B", "C", "D"],
    ans: 2,
    exp: "Each clock advances +1h 30min: 2:00 → 3:30 → 5:00 → 6:30.",
    vis: {
      kind: "clock",
      seqH: [2, 3, 5],
      seqM: [0, 30, 0],
      optH: [6, 7, 6, 5],
      optM: [0, 0, 30, 30],
    },
  },

  // Q2 · LOGIC MAZE — follow the arrows from START, reach the correct exit
  {
    cat: 0, type: "raven", diff: "medium", badge: "Logic Maze", time: 30,
    text: "Follow the arrows from START. Which EXIT do you reach?",
    opts: ["A", "B", "C", "D"],
    ans: 2,
    exp: "Trace: START(0,0)→ right → (0,1)↓ down → (1,1)→ right → (1,2)↓ down → (2,2)→ exits right. Exit C is on the right side of the grid.",
    vis: {
      kind: "maze",
      // 3×3 grid row-major: row0=[R,D,D] row1=[U,R,D] row2=[U,L,R]
      arrows: ["R","D","D", "U","R","D", "U","L","R"],
    },
  },

  // Q3 · DIRECTION MATRIX — each arrow rotates +45° CW per step
  {
    cat: 0, type: "raven", diff: "hard", badge: "Direction Matrix", time: 35,
    text: "Each arrow rotates by the same angle at every step. Which option belongs in the empty cell?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Each step clockwise adds 45°. Diagonals all point in the same direction. Row 3, col 3 → 270° (pointing up).",
    vis: {
      kind: "ravenrot",
      path: ARROW_TRI,
      angles: [270, 315, 0,  225, 270, 315,  180, 225, null],
      optAngles: [270, 225, 315, 0],
    },
  },

  // Q4 · BINARY CODE — find the row that makes all column XORs equal zero
  {
    cat: 0, type: "raven", diff: "medium", badge: "Binary Code", time: 28,
    text: "Each column must XOR to 0 (even number of filled dots per column). Which row completes the grid?",
    opts: ["A", "B", "C", "D"],
    ans: 2,
    exp: "XOR rule: filled=1, empty=0. Col sums must be even. Col0: 1⊕0⊕1⊕?=0→?=0. Col1: 0⊕1⊕1⊕?=0→?=0. Col2: 1⊕1⊕0⊕?=0→?=0. Col3: 1⊕0⊕1⊕?=0→?=0. Answer: all empty (0,0,0,0).",
    vis: {
      kind: "binary",
      rows: [[1,0,1,1],[0,1,1,0],[1,1,0,1],[null,null,null,null]],
      optRows: [[1,0,0,1],[0,1,0,1],[0,0,0,0],[1,1,0,0]],
    },
  },

  // Q5 · HEAT PATTERN — row & column sums all equal
  {
    cat: 0, type: "raven", diff: "medium", badge: "Heat Pattern", time: 28,
    text: "Row sums and column sums are all equal. Which intensity completes the grid?",
    opts: ["A", "B", "C", "D"],
    ans: 2,
    exp: "Each row and column sums to 6. Row 3: 1+3+?=6, so ?=2. Column 3 confirms: 3+1+?=6 → 2.",
    vis: {
      kind: "heatmap",
      grid: [[2,1,3],[3,2,1],[1,3,null]],
      optVals: [0, 1, 2, 4],
    },
  },

  // Q6 · SYMBOL CODE — solve the system of symbol equations
  {
    cat: 0, type: "raven", diff: "hard", badge: "Symbol Code", time: 35,
    text: "Each symbol has a hidden value. Solve for ◆ + ■ + ●",
    opts: ["16", "14", "18", "20"],
    ans: 0,
    exp: "◆+■=9, ■+●=13, ◆+●=10. Adding all three: 2(◆+■+●)=32 → ◆+■+●=16.",
    vis: {
      kind: "symcode",
      equations: ["◆ + ■ = 9", "■ + ● = 13", "◆ + ● = 10", "◆ + ■ + ● = ?"],
      optVals: ["16", "14", "18", "20"],
    },
  },

  // Q7 · POSITION ROTATION — filled quadrant steps 90° CW each move
  {
    cat: 0, type: "raven", diff: "hard", badge: "Position Rotation", time: 38,
    text: "Find the hidden rule, then choose the image that belongs in the empty cell.",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "The filled circle rotates 90° clockwise each step (TL→TR→BR→BL→TL). After 8 steps the cycle completes — the answer brings the filled circle back to the top-left.",
    vis: {
      kind: "raven",
      cells: [qTL, qTR, qBR,  qTR, qBR, qBL,  qBR, qBL, null],
      optCells: [qTL, qBL, qTR, qAll4],
    },
  },

  // Q8 · SHAPE SUM — A + B = C (concentric rule), apply to D + E = ?
  {
    cat: 0, type: "raven", diff: "hard", badge: "Shape Sum", time: 35,
    text: "A + B = C follows a rule. Apply the same rule: D + E = ?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Rule: the outer shape (outline) comes from the first shape, the inner shape (filled) comes from the second. Square outline + filled diamond = square with diamond inside.",
    vis: {
      kind: "shapesum",
      exA: [c(30,30,18,false)],
      exB: [di(30,30,11)],
      exC: [c(30,30,18,false), di(30,30,8)],
      qA:  [sq(30,30,18,false)],
      qB:  [di(30,30,11)],
      optCells: [
        [sq(30,30,18,false), di(30,30,8)],    // A: correct (square + diamond inside)
        [di(30,30,18,false), sq(30,30,8)],    // B: reversed (diamond outer, square inner)
        [sq(30,30,18,false)],                  // C: outer only, no inner shape
        [sq(30,30,18,false), c(30,30,8)],     // D: wrong inner (circle instead of diamond)
      ],
    },
  },

  // Q9 · ROW OPERATIONS — each row uses a different set operation
  {
    cat: 0, type: "raven", diff: "hard", badge: "Row Operations", time: 45,
    text: "Each row applies a different logical operation to its shapes. Discover the three rules, then choose the image for the empty cell.",
    opts: ["A", "B", "C", "D"],
    ans: 1,
    exp: "Row 1 UNION (all shapes), Row 2 SUBTRACT (remove shared shapes), Row 3 XOR (cancel shared). {T,C} ⊕ {T,S} → triangle cancels → {C,S}.",
    vis: {
      kind: "raven",
      cells: [moR1C1, moR1C2, moR1C3,  moR2C1, moR2C2, moR2C3,  moR3C1, moR3C2, null],
      optCells: [moR3C1, moR1C1, moR3C2, moR1C3],
    },
  },

  // ── CAT 1 · VERBAL INTELLIGENCE ──────────────────────────────────────────

  {
    cat: 1, type: "text", diff: "hard", badge: "Syllogistic Logic", time: 35,
    text: "All Glimbs are Forbs. No Forbs are Splacts. Some Splacts are Yends. Which statement MUST be true?",
    opts: ["No Glimbs are Splacts", "Some Glimbs are Splacts", "All Yends are Forbs", "Some Forbs are Yends"],
    ans: 0,
    exp: "All Glimbs → Forbs. No Forbs → Splacts. Therefore: No Glimbs → Splacts (A). B contradicts this. C and D go beyond the premises.",
  },

  // ── CAT 2 · SPATIAL REASONING ────────────────────────────────────────────

  // Q11 · DICE NET
  {
    cat: 2, type: "rotation", diff: "easy", badge: "Dice Net", time: 30,
    text: "Fold this net into a cube. Which face ends up directly OPPOSITE the face showing 2 dots?",
    opts: ["1", "3", "5", "6"],
    ans: 3,
    exp: "The face with 2 dots is the centre of the cross — it becomes the front. The face at the end of the chain (6 dots) folds to become the back face, directly opposite.",
    vis: { kind: "dicenet", faces: [1, 2, 3, 4, 5, 6] },
  },

  // Q12 · HIDDEN SHAPE
  {
    cat: 2, type: "rotation", diff: "easy", badge: "Hidden Shape", time: 30,
    text: "The figure on the left is formed by overlapping two shapes. Which of the four shapes below is one of the two components?",
    opts: ["A", "B", "C", "D"],
    ans: 1,
    exp: "The complex figure is formed by the ARROW shape overlapping the BRACKET shape. The arrow's shaft and triangular head are visible within the merged outline.",
    vis: {
      kind: "embedded",
      display: BRACKET + " " + ARROW,
      optPaths: [CELTIC_Z, ARROW, CROWN_A, STEP],
    },
  },

  // Q13 · SHADOW 3D — identify the correct front-view silhouette of an L-shaped 3D object
  {
    cat: 2, type: "rotation", diff: "medium", badge: "Shadow 3D", time: 30,
    text: "The 3D arrangement of cubes is shown. Which silhouette represents the view from directly in FRONT?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "The arrangement has 3 cubes along the base and a 2-cube tower on the right. Viewed from the front: 3 wide at bottom, the rightmost column extends 3 units high.",
    vis: {
      kind: "shadow3d",
      optGrids: [
        // A correct: 3 wide base, right col 3 tall
        "M6,38 h14 v14 h-14 Z M22,38 h14 v14 h-14 Z M38,38 h14 v14 h-14 Z M38,22 h14 v14 h-14 Z M38,6 h14 v14 h-14 Z",
        // B wrong: flat 3×1
        "M6,38 h14 v14 h-14 Z M22,38 h14 v14 h-14 Z M38,38 h14 v14 h-14 Z",
        // C wrong: staircase ascending left-to-right
        "M6,6 h14 v14 h-14 Z M6,22 h14 v14 h-14 Z M6,38 h14 v14 h-14 Z M22,22 h14 v14 h-14 Z M22,38 h14 v14 h-14 Z M38,38 h14 v14 h-14 Z",
        // D wrong: 2 columns of 3 (too wide)
        "M6,6 h14 v14 h-14 Z M6,22 h14 v14 h-14 Z M6,38 h14 v14 h-14 Z M22,6 h14 v14 h-14 Z M22,22 h14 v14 h-14 Z M22,38 h14 v14 h-14 Z",
      ],
    },
  },

  // Q14 · ORIGAMI — fold, cut, unfold: where do the holes appear?
  {
    cat: 2, type: "rotation", diff: "hard", badge: "Origami", time: 35,
    text: "A square paper is folded (bottom half up), then a circle is cut from the top-right corner of the folded paper. When fully unfolded, which result appears?",
    opts: ["A", "B", "C", "D"],
    ans: 1,
    exp: "Folding bottom half up mirrors the cut: one circle in the upper-right and one mirrored in the lower-right. Result = B: two symmetric holes vertically aligned on the right side.",
    vis: { kind: "origami" },
  },

  // Q15 · INVERSE ROTATION
  {
    cat: 2, type: "rotation", diff: "hard", badge: "Inverse Rotation", time: 25,
    text: "This shape has been rotated 230° clockwise from its original position. Which option shows the ORIGINAL orientation?",
    opts: ["A", "B", "C", "D"],
    ans: 3,
    exp: "360° − 230° = 130° more clockwise returns to the original (0°). Option A is 0° but horizontally mirrored. B is 350° (10° short). C is 10° (10° past). Only D is exactly 0°.",
    vis: {
      kind: "rotation", path: HOOK, showAngle: 230,
      optAngles:  [0,   350, 10, 0],
      optMirrors: [true, false, false, false],
    },
  },

  // Q16 · MIRROR IMAGE
  {
    cat: 2, type: "rotation", diff: "hard", badge: "Mirror Image", time: 22,
    text: "Choose the exact horizontal mirror image of this shape.",
    opts: ["A", "B", "C", "D"],
    ans: 1,
    exp: "A horizontal mirror flips left↔right. Option A is vertically flipped, C is the original, D has a subtly wrong step height. B is the correct horizontal mirror.",
    vis: {
      kind: "mirror",
      path: "M8,48 L8,24 L18,24 L18,8 L38,8 L38,20 L28,20 L28,34 L50,34 L50,48 Z",
      optPaths: [
        "M8,12 L8,36 L18,36 L18,52 L38,52 L38,40 L28,40 L28,26 L50,26 L50,12 Z",
        "M52,48 L52,24 L42,24 L42,8 L22,8 L22,20 L32,20 L32,34 L10,34 L10,48 Z",
        "M8,48 L8,24 L18,24 L18,8 L38,8 L38,20 L28,20 L28,34 L50,34 L50,48 Z",
        "M52,48 L52,24 L42,24 L42,8 L22,8 L22,20 L32,20 L32,36 L10,36 L10,48 Z",
      ],
    },
  },

  // ── CAT 3 · NUMERICAL ABILITY ─────────────────────────────────────────────

  {
    cat: 3, type: "bars", diff: "easy", badge: "Decreasing Series", time: 30,
    text: "What is the missing bar value?",
    opts: ["30", "35", "25", "40"],
    ans: 2,
    exp: "Gaps: −5, −10, −15, −20, −25. So 50 − 25 = 25.",
    vis: { kind: "bars", values: [100, 95, 85, 70, 50, null], max: 110 },
  },

  {
    cat: 3, type: "bars", diff: "medium", badge: "Alternating Rule", time: 25,
    text: "Which value completes this alternating-operation series?",
    opts: ["16", "12", "18", "32"],
    ans: 0,
    exp: "Pattern alternates ×3 then ÷1.5: 2→6→4→12→8→24→16. After 24: 24 ÷ 1.5 = 16.",
    vis: { kind: "bars", values: [2, 6, 4, 12, 8, 24, null], max: 28 },
  },

  {
    cat: 3, type: "bars", diff: "medium", badge: "Modified Fibonacci", time: 22,
    text: "What completes this Fibonacci-variant series?",
    opts: ["24", "28", "30", "26"],
    ans: 3,
    exp: "Each term = sum of previous two (starting at 2,2): 2,2,4,6,10,16 → 10+16 = 26.",
    vis: { kind: "bars", values: [2, 2, 4, 6, 10, 16, null], max: 30 },
  },

  {
    cat: 3, type: "bars", diff: "hard", badge: "Exponential Pattern", time: 18,
    text: "What is the missing value?",
    opts: ["57", "61", "63", "65"],
    ans: 2,
    exp: "Each term = previous × 2 + 1: 1, 3, 7, 15, 31, 63. (31 × 2 + 1 = 63)",
    vis: { kind: "bars", values: [1, 3, 7, 15, 31, null], max: 70 },
  },

  // ── CAT 4 · WORKING MEMORY ────────────────────────────────────────────────

  {
    cat: 4, type: "memory", diff: "easy", badge: "Colour Memory", time: 30,
    text: "What was the 4th colour in the sequence?",
    opts: ["Yellow", "Green", "Blue", "Orange"],
    ans: 1,
    exp: "Sequence: Red → Orange → Yellow → Green → Blue → Purple. The 4th colour was Green.",
    vis: { kind: "memory", colors: ["#FF3B3B","#FF8C00","#FFD700","#00D87A","#00AAFF","#9B59B6"], showMs: 2800 },
  },

  {
    cat: 4, type: "memory", diff: "medium", badge: "Colour Count", time: 28,
    text: "How many DIFFERENT colours appeared in the sequence?",
    opts: ["5", "4", "6", "7"],
    ans: 0,
    exp: "Sequence: Blue, Red, Yellow, Purple, Red, Green — 5 distinct colours (Red appeared twice).",
    vis: { kind: "memory", colors: ["#00AAFF","#FF3B3B","#FFD700","#9B59B6","#FF3B3B","#00D87A"], showMs: 2200 },
  },

  {
    cat: 4, type: "memory", diff: "medium", badge: "Sequence Recall", time: 25,
    text: "What was the 6th colour?",
    opts: ["Purple", "Orange", "Blue", "Red"],
    ans: 3,
    exp: "Sequence: Red → Blue → Purple → Green → Orange → Red → Yellow. The 6th colour was Red.",
    vis: { kind: "memory", colors: ["#FF3B3B","#00AAFF","#9B59B6","#00D87A","#FF8C00","#FF3B3B","#FFD700"], showMs: 2200 },
  },

  {
    cat: 4, type: "memory", diff: "hard", badge: "Frequency Recall", time: 22,
    text: "How many times did Blue appear in the sequence?",
    opts: ["1", "2", "3", "4"],
    ans: 1,
    exp: "Sequence: Blue, Red, Green, Yellow, Purple, Blue, Orange, Red — Blue appeared 2 times.",
    vis: { kind: "memory", colors: ["#00AAFF","#FF3B3B","#00D87A","#FFD700","#9B59B6","#00AAFF","#FF8C00","#FF3B3B"], showMs: 1800 },
  },

  // ── CAT 5 · PROCESSING SPEED ─────────────────────────────────────────────

  {
    cat: 5, type: "symbols", diff: "medium", badge: "Rapid Calculation", time: 10,
    text: "Solve quickly:",
    opts: ["31", "27", "29", "33"],
    ans: 0,
    exp: "48 ÷ 6 = 8, then 8 × 5 = 40, then 40 − 9 = 31.",
    vis: { kind: "symbols", target: "48 ÷ 6 × 5 − 9 = ?" },
  },

  {
    cat: 5, type: "symbols", diff: "hard", badge: "Rapid Deduction", time: 10,
    text: "Which value is the MEDIAN (middle) of these five?",
    opts: ["S", "P", "T", "R"],
    ans: 2,
    exp: "Order ascending: Q < R < T < P < S. The median (3rd of 5) is T.",
    vis: { kind: "symbols", target: "S > P > T > R > Q" },
  },

  {
    cat: 5, type: "symbols", diff: "medium", badge: "Rapid Scan", time: 12,
    text: "Which number appears TWICE in this sequence?",
    opts: ["7", "3", "9", "5"],
    ans: 0,
    exp: "Sequence: 3 · 7 · 5 · 2 · 7 · 9 · 1 · 4 — the number 7 appears at positions 2 and 5.",
    vis: { kind: "symbols", target: "3  ·  7  ·  5  ·  2  ·  7  ·  9  ·  1  ·  4" },
  },
];
