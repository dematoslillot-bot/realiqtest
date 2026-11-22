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
  | { kind: "symcode";     equations: string[];           optVals: string[] }
  | { kind: "lines";       cells: (LineCell | null)[];   optCells: LineCell[] }
  | { kind: "mirrorclock"; h: number; m: number }
  | { kind: "cubeviews";   views: [CubeSym, CubeSym, CubeSym][]; optSyms: CubeSym[] }
  | { kind: "patch";       art: PatchArt; hole: { x: number; y: number; w: number; h: number };
      opts: { dx: number; dy: number; flipX?: boolean }[] };

// Stroke figures (advanced Raven style): v vertical strokes crossed by h horizontal
// strokes of one kind — straight ("s"), arcs bulging up ("u") or arcs bulging down ("d").
export type LineCell = {
  v: number; h: number; t: "s" | "u" | "d";
  ex?: ("s" | "u" | "d" | "x" | "y" | "k")[];   // extra single strokes: line, arcs, diagonals, corner dot
  rot?: number;                                  // rotate the whole figure (degrees, clockwise)
  flip?: boolean;                                // mirror left↔right after rotating
};

// Picture-completion patterns (Raven-style): drawn on a 200×130 board.
// Each option shows the board seen through the hole window, shifted by (dx, dy) and/or mirrored.
export type PatchArt =
  | { type: "grid";   v: [number, number][]; h: [number, number][] }   // [position, line width]
  | { type: "wedges"; bands: number }                                   // wedges converging to the right edge
  | { type: "waves";  xs: number[]; amp0: number; ampK: number; period: number }
  | { type: "dots";   cols: number; rows: number };

// Symbols on the faces of a cube; a view lists [top, front-left, right].
export type CubeSym = "circle" | "ring" | "square" | "star" | "plus" | "triangle";

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


const L = (v: number, h: number, t: "s" | "u" | "d"): LineCell => ({ v, h, t });
type EX = "s" | "u" | "d" | "x" | "y" | "k";
const E = (...ex: EX[]): LineCell => ({ v: 0, h: 0, t: "s", ex });
const LE = (v: number, ...ex: EX[]): LineCell => ({ v, h: 0, t: "s", ex });
const R = (v: number, h: number, t: "s" | "u" | "d", rot: number, flip = false): LineCell => ({ v, h, t, ex: ["k"], rot, flip });

// ── Multi-rule matrix helpers (Logical Reasoning) ───────────────────────────────────
// Corner / centre positions inside a 60×60 cell
const PT = { TL: [15,15], TR: [45,15], BR: [45,45], BL: [15,45], C: [30,30] } as const;
type PK = keyof typeof PT;
const dots = (...k: PK[]): RavenCell => k.map(n => c(PT[n][0], PT[n][1], 6));
const CW: PK[] = ["TL","TR","BR","BL"];
const cs2 = (ci: number, si: number): RavenCell => [c(PT[CW[ci]][0], PT[CW[ci]][1], 8), sq(PT[CW[si]][0], PT[CW[si]][1], 8, false)];
const POS: Record<number, [number, number][]> = {
  1: [[30,30]], 2: [[17,30],[43,30]], 3: [[15,15],[30,30],[45,45]],
  4: [[15,15],[45,15],[15,45],[45,45]], 5: [[15,15],[45,15],[30,30],[15,45],[45,45]],
};
const many = (shape: "c"|"sq"|"tr", n: number, f: boolean): RavenCell =>
  POS[n].map(([x, y]) => ({ s: shape, x, y, r: 7, f }));
// Outlined outer shape with a small filled inner shape (inner sits lower inside triangles)
type SK = "c" | "sq" | "tr";
const nest = (o: SK, i: SK): RavenCell => {
  const outer: ShapeDef = { s: o, x: 30, y: o === "tr" ? 33 : 30, r: o === "tr" ? 22 : 18, f: false };
  const inner: ShapeDef = { s: i, x: 30, y: o === "tr" ? 37 : 30, r: o === "tr" ? 6 : 8, f: true };
  return [outer, inner];
};

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

  // ── CAT 0 · LOGICAL REASONING (picture completion + multi-rule matrices, all hard) ──

  {
    cat: 0, type: "raven", diff: "hard", badge: "Stroke Matrix", time: 60,
    text: "Each figure is built from vertical strokes and crossing strokes. Find the rules and choose the missing figure.",
    opts: ["A", "B", "C", "D", "E", "F", "G", "H"],
    ans: 5,
    exp: "Three things vary independently, and each row and column contains each value exactly once: the number of vertical strokes (1, 2, 3), the number of crossing strokes (1, 2, 3) and their kind (straight, curving up, curving down). Row 3 is missing 2 vertical strokes, 1 crossing stroke and the upward curve.",
    vis: {
      kind: "lines",
      cells: [
        L(1,1,"u"), L(2,2,"s"), L(3,3,"d"),
        L(2,3,"d"), L(3,1,"u"), L(1,2,"s"),
        L(3,2,"s"), L(1,3,"d"), null,
      ],
      optCells: [L(2,1,"s"), L(1,1,"u"), L(2,2,"u"), L(2,1,"d"), L(3,1,"u"), L(2,1,"u"), L(2,3,"u"), L(3,2,"d")],
    },
  },

  {
    cat: 0, type: "raven", diff: "hard", badge: "Stroke Arithmetic", time: 60,
    text: "In each row the first two figures combine into the third. Find all the rules and choose the missing figure.",
    opts: ["A", "B", "C", "D", "E", "F", "G", "H"],
    ans: 2,
    exp: "Vertical strokes add up along each row (1+1=2, 2+1=3, 1+2=3). The number of crossing strokes is the same in a whole row (1, then 2, then 3). The kind of crossing stroke appears once per row and column (straight, up, down). So the missing figure has 3 vertical strokes and 3 upward curves.",
    vis: {
      kind: "lines",
      cells: [
        L(1,1,"s"), L(1,1,"u"), L(2,1,"d"),
        L(2,2,"u"), L(1,2,"d"), L(3,2,"s"),
        L(1,3,"d"), L(2,3,"s"), null,
      ],
      optCells: [L(3,3,"s"), L(1,3,"u"), L(3,3,"u"), L(3,2,"u"), L(3,3,"d"), L(2,3,"u"), L(3,1,"u"), L(2,2,"s")],
    },
  },

  {
    cat: 0, type: "raven", diff: "hard", badge: "Stroke Overlay", time: 60,
    text: "The first two figures in each row combine into the third. Find the rule.",
    opts: ["A", "B", "C", "D", "E", "F", "G", "H"],
    ans: 4,
    exp: "Strokes that appear in only one of the first two figures are kept; strokes that appear in both cancel out. Row 3: the horizontal line and the rising diagonal appear only in figure 1, the downward curve only in figure 2, and the falling diagonal is in both, so it disappears.",
    vis: {
      kind: "lines",
      cells: [
        E("s","x"),     E("x","u"), E("s","u"),
        E("u","d","y"), E("d","s"), E("u","y","s"),
        E("s","y","x"), E("y","d"), null,
      ],
      optCells: [E("s","x","y","d"), E("y"), E("s","x"), E("s","d"), E("s","x","d"), E("x","d"), E("s","x","d","u"), E("s","y","d")],
    },
  },

  {
    cat: 0, type: "raven", diff: "hard", badge: "Turning Strokes", time: 60,
    text: "Find the three rules (strokes, curve, rotation) and pick the missing figure.",
    opts: ["A", "B", "C", "D", "E", "F", "G", "H"],
    ans: 6,
    exp: "Rotation: every step to the right turns the figure 90° clockwise (watch the dot). Number of vertical strokes: 1 in row 1, 2 in row 2, 3 in row 3. Kind of curve: each row and column has one straight, one upward and one downward. The missing figure has 3 strokes and an upward curve, turned 180°.",
    vis: {
      kind: "lines",
      cells: [
        R(1,1,"u",0), R(1,1,"s",90), R(1,1,"d",180),
        R(2,1,"d",0), R(2,1,"u",90), R(2,1,"s",180),
        R(3,1,"s",0), R(3,1,"d",90), null,
      ],
      optCells: [R(3,1,"u",90), R(3,1,"u",270), R(3,1,"d",180), R(3,1,"s",180), R(2,1,"u",180), R(3,1,"u",180,true), R(3,1,"u",180), R(3,1,"u",0)],
    },
  },

  {
    cat: 0, type: "raven", diff: "hard", badge: "Moving Pieces", time: 45,
    text: "The circle and the square each move in their own way. Where are they in the empty cell?",
    opts: ["A", "B", "C", "D"],
    ans: 3,
    exp: "In every row the filled circle moves one corner clockwise and the empty square moves one corner anticlockwise. Row 3 continues: circle top-left, square bottom-left.",
    vis: {
      kind: "raven",
      cells: [cs2(0,3), cs2(1,2), cs2(2,1),  cs2(1,0), cs2(2,3), cs2(3,2),  cs2(2,1), cs2(3,0), null],
      optCells: [cs2(1,3), cs2(0,1), cs2(3,0), cs2(0,3)],
    },
  },

  {
    cat: 0, type: "raven", diff: "hard", badge: "Count Matrix", time: 45,
    text: "Find the rules for number, shape and fill. Which image completes the matrix?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "Number: one more shape in each step to the right and down (1-2-3, 2-3-4, 3-4-5). Shape: column 1 circles, column 2 squares, column 3 triangles. Fill: filled and outlined alternate like a chessboard, so the bottom-right cell is filled. Answer: five filled triangles.",
    vis: {
      kind: "raven",
      cells: [
        many("c",1,true),  many("sq",2,false), many("tr",3,true),
        many("c",2,false), many("sq",3,true),  many("tr",4,false),
        many("c",3,true),  many("sq",4,false), null,
      ],
      optCells: [many("tr",5,true), many("tr",4,true), many("tr",5,false), many("sq",5,true)],
    },
  },

  {
    cat: 0, type: "raven", diff: "hard", badge: "Cancelling Dots", time: 50,
    text: "In each row, the first two cells combine to make the third. Find the rule and complete the last row.",
    opts: ["A", "B", "C", "D"],
    ans: 2,
    exp: "Dots that appear in only one of the first two cells are kept; dots that appear in both cancel out. Row 3: top-left and bottom-left only in cell 1, bottom-right only in cell 2, top-right in both (cancels). Answer: top-left, bottom-left, bottom-right.",
    vis: {
      kind: "raven",
      cells: [
        dots("TL","C"),      dots("TR","C"),  dots("TL","TR"),
        dots("BL","BR","C"), dots("BR","TL"), dots("BL","C","TL"),
        dots("TL","TR","BL"), dots("TR","BR"), null,
      ],
      optCells: [dots("TL","TR","BL","BR"), dots("TR"), dots("TL","BL","BR"), dots("TL","BL","BR","C")],
    },
  },


  {
    cat: 0, type: "raven", diff: "hard", badge: "Hidden Totals", time: 60,
    text: "Three rules link these figures. Count carefully and choose the missing figure.",
    opts: ["A", "B", "C", "D", "E", "F", "G", "H"],
    ans: 3,
    exp: "1) Each row and column has 1, 2 and 3 vertical strokes. 2) Each row and column has one straight, one upward and one downward kind of crossing stroke. 3) Every figure in a row has the same TOTAL number of strokes: 4 in row 1, 5 in row 2, 6 in row 3. The missing figure has 2 vertical strokes, upward curves, and 6 − 2 = 4 curves.",
    vis: {
      kind: "lines",
      cells: [
        L(1,3,"u"), L(2,2,"s"), L(3,1,"d"),
        L(2,3,"d"), L(3,2,"u"), L(1,4,"s"),
        L(3,3,"s"), L(1,5,"d"), null,
      ],
      optCells: [L(2,3,"u"), L(3,3,"u"), L(2,4,"d"), L(2,4,"u"), L(1,4,"u"), L(2,2,"u"), L(2,5,"u"), L(2,4,"s")],
    },
  },

  {
    cat: 0, type: "raven", diff: "hard", badge: "Common Strokes", time: 60,
    text: "In each row the first two figures combine into the third. Two rules work at once.",
    opts: ["A", "B", "C", "D", "E", "F", "G", "H"],
    ans: 5,
    exp: "Vertical strokes add up (1+1=2, 2+1=3, 1+2=3). Of the other strokes, only those that appear in BOTH of the first two figures are kept. Row 3: the upward curve and the falling diagonal are in both, the line and the downward curve are not. Answer: 3 vertical strokes, upward curve and falling diagonal.",
    vis: {
      kind: "lines",
      cells: [
        LE(1,"s","x","u"), LE(1,"x","u","d"), LE(2,"x","u"),
        LE(2,"d","y","s"), LE(1,"y","s","x"), LE(3,"y","s"),
        LE(1,"u","s","y"), LE(2,"y","u","d"), null,
      ],
      optCells: [LE(3,"u","s","y","d"), LE(3,"s","d"), LE(2,"u","y"), LE(3,"u"), LE(4,"u","y"), LE(3,"u","y"), LE(3,"u","d"), LE(3,"y","s")],
    },
  },

  {
    cat: 0, type: "raven", diff: "hard", badge: "Column Logic", time: 70,
    text: "The rules are not where you would expect them. Find them and choose the missing figure.",
    opts: ["A", "B", "C", "D", "E", "F", "G", "H"],
    ans: 6,
    exp: "Look down the columns, not along the rows. The number of vertical strokes is fixed per row (1, 2, 3). The other strokes combine DOWN each column: a stroke in only one of the top two figures is kept, a stroke in both cancels. Column 3: top has the line and rising diagonal; middle has the rising diagonal, falling diagonal and upward curve. The rising diagonal cancels, leaving line, falling diagonal and upward curve, with 3 vertical strokes.",
    vis: {
      kind: "lines",
      cells: [
        LE(1,"s","u"), LE(1,"d","y"), LE(1,"x","s"),
        LE(2,"u","x"), LE(2,"s","d"), LE(2,"x","y","u"),
        LE(3,"s","x"), LE(3,"y","s"), null,
      ],
      optCells: [LE(3,"x","y"), LE(3,"s","x","y","u"), LE(2,"s","y","u"), LE(3,"s","y"), LE(3,"y","u"), LE(3,"s","u","d"), LE(3,"s","y","u"), LE(4,"s","y","u")],
    },
  },

  // ── CAT 1 · VERBAL INTELLIGENCE ──

  {
    cat: 1, type: "analogy", diff: "hard", badge: "Analogy", time: 25,
    text: "Complete the analogy:",
    w1: "Ornithology", w2: "Birds", w3: "Entomology",
    opts: ["Insects", "Fossils", "Words", "Fish"],
    ans: 0,
    exp: "Ornithology is the study of birds; entomology is the study of insects. (Etymology, which looks similar, is the study of word origins.)",
  },

  {
    cat: 1, type: "text", diff: "hard", badge: "Deduction", time: 40,
    text: "In a club, all three statements are true. Which statement MUST also be true?",
    opts: ["Every swimmer is a doctor", "Some pilots are not swimmers", "Some doctors are not pilots", "No pilot is a swimmer"],
    ans: 0,
    exp: "Swimmers are all pilots and pilots are all doctors, so every swimmer is a doctor. The doctors who are not swimmers might or might not be pilots, so B and C are not certain, and D contradicts the statements.",
    vis: { kind: "symcode", equations: ["Every pilot is a doctor.", "Some doctors are not swimmers.", "Every swimmer is a pilot."], optVals: [] },
  },

  {
    cat: 1, type: "text", diff: "hard", badge: "Syllogistic Logic", time: 35,
    text: "Read the three statements. Which conclusion MUST be true?",
    opts: ["No Glimbs are Splacts", "Some Glimbs are Splacts", "All Yends are Forbs", "Some Forbs are Yends"],
    ans: 0,
    vis: { kind: "symcode", equations: ["All Glimbs are Forbs.", "No Forbs are Splacts.", "Some Splacts are Yends."], optVals: [] },
    exp: "All Glimbs → Forbs. No Forbs → Splacts. Therefore: No Glimbs → Splacts (A). B contradicts this. C and D go beyond the premises.",
  },

  {
    cat: 1, type: "text", diff: "hard", badge: "Anagram", time: 25,
    text: "Rearrange these letters. The word you get is the name of a(n):",
    opts: ["Ocean", "Country", "City", "Animal"],
    ans: 0,
    exp: "C I F A I P C rearranges to PACIFIC, an ocean.",
    vis: { kind: "symbols", target: "C  I  F  A  I  P  C" },
  },


  // ── CAT 2 · SPATIAL REASONING ──

  {
    cat: 2, type: "rotation", diff: "hard", badge: "Rotation, Not Mirror", time: 30,
    text: "Which option is the SAME shape, only rotated (not flipped)?",
    opts: ["A", "B", "C", "D"],
    ans: 1,
    exp: "Only B is the original shape turned 90°. A, C and D are mirror images that have also been rotated, so no amount of turning makes them match.",
    vis: {
      kind: "rotation", path: HOOK, showAngle: 0,
      optAngles:  [90, 90, 180, 270],
      optMirrors: [true, false, true, true],
    },
  },

  {
    cat: 2, type: "text", diff: "hard", badge: "Mirror Clock", time: 45,
    text: "A clock seen in a mirror (12 is at the top). What will the REAL time be 25 minutes from now?",
    opts: ["5:05", "7:45", "4:15", "8:05"],
    ans: 1,
    exp: "A mirror swaps left and right, so the reflection looks like 4:40. Flip it back: the minute hand really points at 20 and the hour hand just past 7, so the real time is 7:20. 25 minutes later it is 7:45. (5:05 is what you get if you forget to un-mirror.)",
    vis: { kind: "mirrorclock", h: 7, m: 20 },
  },

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

  {
    cat: 2, type: "rotation", diff: "hard", badge: "Origami", time: 35,
    text: "A square paper is folded (bottom half up), then a circle is cut from the top-right corner of the folded paper. When fully unfolded, which result appears?",
    opts: ["A", "B", "C", "D"],
    ans: 1,
    exp: "Folding bottom half up mirrors the cut: one circle in the upper-right and one mirrored in the lower-right. Result = B: two symmetric holes vertically aligned on the right side.",
    vis: { kind: "origami" },
  },

  {
    cat: 2, type: "raven", diff: "hard", badge: "Cube Views", time: 70,
    text: "These are three views of the SAME cube. Which symbol is on the face opposite the triangle?",
    opts: ["A", "B", "C", "D"],
    ans: 2,
    exp: "The first two views show the triangle next to the circle, the square and the star, so its opposite face is either the plus or the ring. Now use the corners: in view 1 the circle (top), square (front) and triangle (right) go round one way; in view 3 the ring, plus and square must fit the same cube. Placing the ring on the left and the plus on the bottom matches view 3 exactly; the other way round gives a mirror-image cube. So the ring is opposite the triangle.",
    vis: {
      kind: "cubeviews",
      views: [["circle","square","triangle"], ["circle","triangle","star"], ["ring","plus","square"]],
      optSyms: ["plus", "star", "ring", "circle"],
    },
  },


  // ── CAT 3 · NUMERICAL ABILITY ──

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

  {
    cat: 3, type: "bars", diff: "hard", badge: "Square Pattern", time: 25,
    text: "What is the missing value?",
    opts: ["35", "37", "36", "41"],
    ans: 1,
    exp: "Each term is a square number plus 1: 1²+1=2, 2²+1=5, 3²+1=10, 4²+1=17, 5²+1=26, 6²+1=37. (The gaps grow by 2: +3, +5, +7, +9, +11.)",
    vis: { kind: "bars", values: [2, 5, 10, 17, 26, null], max: 42 },
  },

  {
    cat: 3, type: "bars", diff: "hard", badge: "Hidden Squares", time: 35,
    text: "What is the missing value?",
    opts: ["94", "49", "64", "81"],
    ans: 0,
    exp: "These are the square numbers 1, 4, 9, 16, 25, 36 written backwards: 1, 4, 9, 61, 52, 63. Next is 49 written backwards: 94.",
    vis: { kind: "bars", values: [1, 4, 9, 61, 52, 63, null], max: 100 },
  },


  // ── CAT 4 · WORKING MEMORY ──

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


  // ── CAT 5 · PROCESSING SPEED ──

  {
    cat: 5, type: "symbols", diff: "medium", badge: "Rapid Calculation", time: 10,
    text: "Solve quickly:",
    opts: ["31", "27", "29", "33"],
    ans: 0,
    exp: "48 ÷ 6 = 8, then 8 × 5 = 40, then 40 − 9 = 31.",
    vis: { kind: "symbols", target: "48 ÷ 6 × 5 − 9 = ?" },
  },

  {
    cat: 5, type: "symbols", diff: "hard", badge: "Spot the Difference", time: 10,
    text: "Which group is DIFFERENT from the other three?",
    opts: ["1st", "2nd", "3rd", "4th"],
    ans: 2,
    exp: "The 3rd group ends in Q9; the others end in 9Q.",
    vis: { kind: "symbols", target: "7B4K9Q   7B4K9Q   7B4KQ9   7B4K9Q" },
  },

  {
    cat: 5, type: "symbols", diff: "hard", badge: "Rapid Ordering", time: 15,
    text: "Who is the SECOND tallest?",
    opts: ["A", "B", "C", "D"],
    ans: 0,
    exp: "D is taller than A, A is taller than B and B is taller than C, so the order is D > A > B > C. A is second.",
    vis: { kind: "symbols", target: "D taller than A · A taller than B · C shorter than B" },
  },

];
