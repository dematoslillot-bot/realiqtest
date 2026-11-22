export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType =
  | "raven" | "rotation" | "bars" | "memory" | "symbols"
  | "sequence" | "analogy" | "text" | "oddone" | "pattern";

export type ShapeDef = {
  s: "c" | "sq" | "tr" | "di" | "hx" | "pe" | "st" | "ln" | "ar";
  x: number; y: number;
  r: number;
  f?: boolean | "g" | "z";   // filled · outline · grey (half-tone) · faint guide
  rot?: number;              // degrees clockwise
  ink?: "a" | "b";           // gold · cyan (default violet)
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
  | { kind: "gears";       gears: { x: number; y: number; r: number }[]; belt: { a: number; b: number; crossed: boolean }; bucketGear: number }
  | { kind: "scales";      rows: { l: Weight[]; r: Weight[] | null }[] }
  | { kind: "laser";       n: number; mirrors: { r: number; c: number; m: "/" | "\\" }[]; entryRow: number;
      exits: { side: "top" | "right" | "bottom" | "left"; i: number; label: string }[] }
  | { kind: "stroop";      words: { w: string; c: string }[] }
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

export type Weight = "c" | "s" | "t";   // circle, square, triangle on a balance scale

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
    cat: 0, type: "raven", diff: "hard", badge: "Falling Shapes", time: 70,
    text: "Each cell has shapes above and below a line. Find both rules and complete the matrix.",
    opts: ["A", "B", "C", "D", "E", "F", "G", "H"],
    ans: 3,
    exp: "Two rules work at once along each row. 1) Below the line you always find what was ABOVE the line in the previous cell: the shapes fall down. 2) Above the line, the third cell joins the top shapes of the first two cells, in the same order. Row 3: top = filled circle, square + circle; bottom = the circle that was on top in cell 2.",
    vis: {
      kind: "raven",
      cells: [
        [{s:"ln",x:30,y:31,r:20,f:true},{s:"sq",x:30.0,y:20,r:4.5,f:false},{s:"c",x:23.5,y:42,r:4.5,f:false},{s:"c",x:36.5,y:42,r:4.5,f:false}],
        [{s:"ln",x:30,y:31,r:20,f:true},{s:"c",x:23.5,y:20,r:4.5,f:false},{s:"c",x:36.5,y:20,r:4.5,f:true},{s:"sq",x:30.0,y:42,r:4.5,f:false}],
        [{s:"ln",x:30,y:31,r:20,f:true},{s:"sq",x:17.0,y:20,r:4.5,f:false},{s:"c",x:30.0,y:20,r:4.5,f:false},{s:"c",x:43.0,y:20,r:4.5,f:true},{s:"c",x:23.5,y:42,r:4.5,f:false},{s:"c",x:36.5,y:42,r:4.5,f:true}],
        [{s:"ln",x:30,y:31,r:20,f:true},{s:"c",x:30.0,y:20,r:4.5,f:false},{s:"sq",x:30.0,y:42,r:4.5,f:true}],
        [{s:"ln",x:30,y:31,r:20,f:true},{s:"sq",x:23.5,y:20,r:4.5,f:true},{s:"sq",x:36.5,y:20,r:4.5,f:false},{s:"c",x:30.0,y:42,r:4.5,f:false}],
        [{s:"ln",x:30,y:31,r:20,f:true},{s:"c",x:17.0,y:20,r:4.5,f:false},{s:"sq",x:30.0,y:20,r:4.5,f:true},{s:"sq",x:43.0,y:20,r:4.5,f:false},{s:"sq",x:23.5,y:42,r:4.5,f:true},{s:"sq",x:36.5,y:42,r:4.5,f:false}],
        [{s:"ln",x:30,y:31,r:20,f:true},{s:"c",x:23.5,y:20,r:4.5,f:true},{s:"sq",x:36.5,y:20,r:4.5,f:false},{s:"c",x:30.0,y:42,r:4.5,f:false}],
        [{s:"ln",x:30,y:31,r:20,f:true},{s:"c",x:30.0,y:20,r:4.5,f:false},{s:"c",x:23.5,y:42,r:4.5,f:true},{s:"sq",x:36.5,y:42,r:4.5,f:false}],
        null,
      ],
      optCells: [[{s:"ln",x:30,y:31,r:20,f:true},{s:"c",x:17.0,y:20,r:4.5,f:false},{s:"c",x:30.0,y:20,r:4.5,f:true},{s:"sq",x:43.0,y:20,r:4.5,f:false},{s:"c",x:30.0,y:42,r:4.5,f:false}], [{s:"ln",x:30,y:31,r:20,f:true},{s:"c",x:17.0,y:20,r:4.5,f:true},{s:"sq",x:30.0,y:20,r:4.5,f:false},{s:"c",x:43.0,y:20,r:4.5,f:false},{s:"c",x:23.5,y:42,r:4.5,f:true},{s:"sq",x:36.5,y:42,r:4.5,f:false}], [{s:"ln",x:30,y:31,r:20,f:true},{s:"c",x:23.5,y:20,r:4.5,f:true},{s:"sq",x:36.5,y:20,r:4.5,f:false},{s:"c",x:30.0,y:42,r:4.5,f:false}], [{s:"ln",x:30,y:31,r:20,f:true},{s:"c",x:17.0,y:20,r:4.5,f:true},{s:"sq",x:30.0,y:20,r:4.5,f:false},{s:"c",x:43.0,y:20,r:4.5,f:false},{s:"c",x:30.0,y:42,r:4.5,f:false}], [{s:"ln",x:30,y:31,r:20,f:true},{s:"c",x:17.0,y:20,r:4.5,f:true},{s:"sq",x:30.0,y:20,r:4.5,f:false},{s:"c",x:43.0,y:20,r:4.5,f:false},{s:"c",x:23.5,y:42,r:4.5,f:false},{s:"c",x:36.5,y:42,r:4.5,f:false}], [{s:"ln",x:30,y:31,r:20,f:true},{s:"sq",x:17.0,y:20,r:4.5,f:false},{s:"c",x:30.0,y:20,r:4.5,f:true},{s:"c",x:43.0,y:20,r:4.5,f:false},{s:"c",x:30.0,y:42,r:4.5,f:false}], [{s:"ln",x:30,y:31,r:20,f:true},{s:"c",x:17.0,y:20,r:4.5,f:true},{s:"sq",x:30.0,y:20,r:4.5,f:false},{s:"c",x:43.0,y:20,r:4.5,f:false}], [{s:"ln",x:30,y:31,r:20,f:true},{s:"c",x:23.5,y:20,r:4.5,f:true},{s:"c",x:36.5,y:20,r:4.5,f:false},{s:"c",x:30.0,y:42,r:4.5,f:false}]],
    },
  },

  {
    cat: 0, type: "text", diff: "hard", badge: "Gear Train", time: 50,
    text: "The big gear on the left turns the way the arrow shows. What happens to the bucket?",
    opts: ["It goes up", "It goes down", "It does not move", "The gears jam"],
    ans: 0,
    exp: "Gears that touch turn opposite ways: big gear clockwise, next anticlockwise, third clockwise. The small gear at the bottom touches nothing that matters. The belt is CROSSED, so it reverses the turn again: the gear on the right goes anticlockwise, and the gear holding the rope goes clockwise. The rope hangs from its left side, which moves up when it turns clockwise, so the bucket rises.",
    vis: {
      kind: "gears",
      gears: [
        { x: 50, y: 82, r: 30 }, { x: 93, y: 57, r: 20 }, { x: 133, y: 80, r: 26 },
        { x: 126, y: 122, r: 16 }, { x: 232, y: 70, r: 22 }, { x: 246, y: 108, r: 18 },
      ],
      belt: { a: 2, b: 4, crossed: true },
      bucketGear: 5,
    },
  },

  {
    cat: 0, type: "text", diff: "hard", badge: "Balance", time: 50,
    text: "The first two scales are balanced. How many squares balance the last one?",
    opts: ["3", "4", "5", "6"],
    ans: 1,
    exp: "Scale 1: 3 circles = 2 squares, so a circle is 2/3 of a square. Scale 2: triangle = circle + square = 5/3 of a square. Last scale: 2 triangles + 1 circle = 10/3 + 2/3 = 12/3 = 4 squares. (With weights: circle 2, square 3, triangle 5 → 5+5+2 = 12 = 4 × 3.)",
    vis: {
      kind: "scales",
      rows: [
        { l: ["c", "c", "c"], r: ["s", "s"] },
        { l: ["t"], r: ["c", "s"] },
        { l: ["t", "t", "c"], r: null },
      ],
    },
  },

  {
    cat: 0, type: "raven", diff: "hard", badge: "Built Figures", time: 60,
    text: "Each figure is built from three parts. Find the rule for each part and choose the missing figure.",
    opts: ["A", "B", "C", "D", "E", "F", "G", "H"],
    ans: 6,
    exp: "Three parts change independently, and every row and every column contains each version once: the big outline (hexagon, circle, diamond), the small shape on top (circle, square, triangle) and the number of dots underneath (0, 1, 2). The missing figure is a circle with a square on top and no dots.",
    vis: {
      kind: "raven",
      cells: [
        [{s:"hx",x:30,y:31,r:15,f:false},{s:"c",x:30,y:10,r:5,f:true}],
        [{s:"c",x:30,y:31,r:15,f:false},{s:"sq",x:30,y:10,r:5,f:true},{s:"c",x:30.0,y:53,r:2.6,f:true}],
        [{s:"di",x:30,y:31,r:15,f:false},{s:"tr",x:30,y:11,r:5,f:true},{s:"c",x:25.5,y:53,r:2.6,f:true},{s:"c",x:34.5,y:53,r:2.6,f:true}],
        [{s:"c",x:30,y:31,r:15,f:false},{s:"sq",x:30,y:10,r:5,f:true},{s:"c",x:25.5,y:53,r:2.6,f:true},{s:"c",x:34.5,y:53,r:2.6,f:true}],
        [{s:"di",x:30,y:31,r:15,f:false},{s:"tr",x:30,y:11,r:5,f:true}],
        [{s:"hx",x:30,y:31,r:15,f:false},{s:"c",x:30,y:10,r:5,f:true},{s:"c",x:30.0,y:53,r:2.6,f:true}],
        [{s:"di",x:30,y:31,r:15,f:false},{s:"tr",x:30,y:11,r:5,f:true},{s:"c",x:30.0,y:53,r:2.6,f:true}],
        [{s:"hx",x:30,y:31,r:15,f:false},{s:"c",x:30,y:10,r:5,f:true},{s:"c",x:25.5,y:53,r:2.6,f:true},{s:"c",x:34.5,y:53,r:2.6,f:true}],
        null,
      ],
      optCells: [[{s:"c",x:30,y:31,r:15,f:false},{s:"sq",x:30,y:10,r:5,f:true},{s:"c",x:30.0,y:53,r:2.6,f:true}], [{s:"c",x:30,y:31,r:15,f:false},{s:"tr",x:30,y:11,r:5,f:true}], [{s:"hx",x:30,y:31,r:15,f:false},{s:"sq",x:30,y:10,r:5,f:true}], [{s:"c",x:30,y:31,r:15,f:false},{s:"c",x:30,y:10,r:5,f:true}], [{s:"di",x:30,y:31,r:15,f:false},{s:"sq",x:30,y:10,r:5,f:true}], [{s:"c",x:30,y:31,r:15,f:false},{s:"sq",x:30,y:10,r:5,f:true},{s:"c",x:25.5,y:53,r:2.6,f:true},{s:"c",x:34.5,y:53,r:2.6,f:true}], [{s:"c",x:30,y:31,r:15,f:false},{s:"sq",x:30,y:10,r:5,f:true}], [{s:"hx",x:30,y:31,r:15,f:false},{s:"tr",x:30,y:11,r:5,f:true},{s:"c",x:30.0,y:53,r:2.6,f:true}]],
    },
  },

  {
    cat: 0, type: "raven", diff: "hard", badge: "Moving Pieces", time: 70,
    text: "Three things change from cell to cell, reading left to right, row by row. What comes ninth?",
    opts: ["A", "B", "C", "D", "E", "F", "G", "H"],
    ans: 1,
    exp: "Read the cells like a book. The star moves one place clockwise each time. The black square jumps three places anticlockwise each time. The small shape in the middle repeats every four cells: triangle, circle, square, diamond. Cell 9: star top-left, square bottom-middle, triangle in the middle.",
    vis: {
      kind: "raven",
      cells: [
        [{s:"st",x:14,y:14,r:6.5,f:true,ink:"b"},{s:"sq",x:30,y:46,r:5,f:true},{s:"tr",x:30,y:30,r:5,f:false}],
        [{s:"st",x:30,y:14,r:6.5,f:true,ink:"b"},{s:"sq",x:46,y:14,r:5,f:true},{s:"c",x:30,y:30,r:5,f:false}],
        [{s:"st",x:46,y:14,r:6.5,f:true,ink:"b"},{s:"sq",x:14,y:30,r:5,f:true},{s:"sq",x:30,y:30,r:5,f:false}],
        [{s:"st",x:46,y:30,r:6.5,f:true,ink:"b"},{s:"sq",x:46,y:46,r:5,f:true},{s:"di",x:30,y:30,r:5,f:false}],
        [{s:"st",x:46,y:46,r:6.5,f:true,ink:"b"},{s:"sq",x:30,y:14,r:5,f:true},{s:"tr",x:30,y:30,r:5,f:false}],
        [{s:"st",x:30,y:46,r:6.5,f:true,ink:"b"},{s:"sq",x:14,y:46,r:5,f:true},{s:"c",x:30,y:30,r:5,f:false}],
        [{s:"st",x:14,y:46,r:6.5,f:true,ink:"b"},{s:"sq",x:46,y:30,r:5,f:true},{s:"sq",x:30,y:30,r:5,f:false}],
        [{s:"st",x:14,y:30,r:6.5,f:true,ink:"b"},{s:"sq",x:14,y:14,r:5,f:true},{s:"di",x:30,y:30,r:5,f:false}],
        null,
      ],
      optCells: [[{s:"st",x:30,y:14,r:6.5,f:true,ink:"b"},{s:"sq",x:30,y:46,r:5,f:true},{s:"tr",x:30,y:30,r:5,f:false}], [{s:"st",x:14,y:14,r:6.5,f:true,ink:"b"},{s:"sq",x:30,y:46,r:5,f:true},{s:"tr",x:30,y:30,r:5,f:false}], [{s:"st",x:14,y:14,r:6.5,f:true,ink:"b"},{s:"sq",x:46,y:14,r:5,f:true},{s:"tr",x:30,y:30,r:5,f:false}], [{s:"st",x:14,y:14,r:6.5,f:true,ink:"b"},{s:"sq",x:30,y:46,r:5,f:true},{s:"c",x:30,y:30,r:5,f:false}], [{s:"st",x:14,y:14,r:6.5,f:true,ink:"b"},{s:"sq",x:46,y:46,r:5,f:true},{s:"tr",x:30,y:30,r:5,f:false}], [{s:"st",x:14,y:30,r:6.5,f:true,ink:"b"},{s:"sq",x:30,y:46,r:5,f:true},{s:"tr",x:30,y:30,r:5,f:false}], [{s:"st",x:14,y:14,r:6.5,f:true,ink:"b"},{s:"sq",x:30,y:46,r:5,f:true},{s:"di",x:30,y:30,r:5,f:false}], [{s:"st",x:30,y:14,r:6.5,f:true,ink:"b"},{s:"sq",x:46,y:14,r:5,f:true},{s:"c",x:30,y:30,r:5,f:false}]],
    },
  },

  {
    cat: 0, type: "raven", diff: "hard", badge: "Counting Sides", time: 70,
    text: "Find what each row has in common and how the shading works. Which figure is missing?",
    opts: ["A", "B", "C", "D", "E", "F", "G", "H"],
    ans: 4,
    exp: "Add up the sides of every shape in a row: row 1 is 3+3+4+5 = 15 and row 2 is 6+3+6 = 15. Row 3 already has 5+3+3 = 11, so it needs 4 sides: a square. Shading: each row and column has one filled, one outlined and one grey figure, so the square is filled.",
    vis: {
      kind: "raven",
      cells: [
        [{s:"tr",x:17,y:31,r:10,f:true},{s:"tr",x:43,y:31,r:10,f:true}],
        [{s:"sq",x:30,y:31,r:14,f:false}],
        [{s:"pe",x:30,y:31,r:14,f:"g"}],
        [{s:"hx",x:30,y:31,r:14,f:"g"}],
        [{s:"tr",x:30,y:31,r:14,f:true}],
        [{s:"hx",x:30,y:31,r:14,f:false}],
        [{s:"pe",x:30,y:31,r:14,f:false}],
        [{s:"tr",x:17,y:31,r:10,f:"g"},{s:"tr",x:43,y:31,r:10,f:"g"}],
        null,
      ],
      optCells: [[{s:"pe",x:30,y:31,r:14,f:true}], [{s:"sq",x:30,y:31,r:14,f:false}], [{s:"sq",x:30,y:31,r:14,f:"g"}], [{s:"tr",x:30,y:31,r:14,f:true}], [{s:"sq",x:30,y:31,r:14,f:true}], [{s:"tr",x:17,y:31,r:10,f:true},{s:"tr",x:43,y:31,r:10,f:true}], [{s:"hx",x:30,y:31,r:14,f:true}], [{s:"sq",x:17,y:31,r:10,f:true},{s:"tr",x:43,y:31,r:10,f:true}]],
    },
  },

  {
    cat: 0, type: "raven", diff: "hard", badge: "Adding Turns", time: 60,
    text: "Each arrow points in a direction. Find how the third arrow in each row is made.",
    opts: ["A", "B", "C", "D", "E", "F", "G", "H"],
    ans: 2,
    exp: "Measure the turn of each arrow from 'up', clockwise. In every row the third arrow's turn is the sum of the first two: 45\u00b0 + 180\u00b0 = 225\u00b0 and 90\u00b0 + 90\u00b0 = 180\u00b0. Row 3: 135\u00b0 + 45\u00b0 = 180\u00b0, so it points down. The colours appear once per row and column, so it is cyan. (If you thought the turns go up by equal steps, row 2 already breaks that rule.)",
    vis: {
      kind: "raven",
      cells: [
        [{s:"ar",x:30,y:30,r:20,f:true,rot:45}],
        [{s:"ar",x:30,y:30,r:20,f:true,rot:180,ink:"b"}],
        [{s:"ar",x:30,y:30,r:20,f:true,rot:225,ink:"a"}],
        [{s:"ar",x:30,y:30,r:20,f:true,rot:90,ink:"b"}],
        [{s:"ar",x:30,y:30,r:20,f:true,rot:90,ink:"a"}],
        [{s:"ar",x:30,y:30,r:20,f:true,rot:180}],
        [{s:"ar",x:30,y:30,r:20,f:true,rot:135,ink:"a"}],
        [{s:"ar",x:30,y:30,r:20,f:true,rot:45}],
        null,
      ],
      optCells: [[{s:"ar",x:30,y:30,r:20,f:true,rot:315,ink:"b"}], [{s:"ar",x:30,y:30,r:20,f:true,rot:180}], [{s:"ar",x:30,y:30,r:20,f:true,rot:180,ink:"b"}], [{s:"ar",x:30,y:30,r:20,f:true,rot:180,ink:"a"}], [{s:"ar",x:30,y:30,r:20,f:true,rot:90,ink:"b"}], [{s:"ar",x:30,y:30,r:20,f:true,rot:0,ink:"b"}], [{s:"ar",x:30,y:30,r:20,f:true,rot:225,ink:"b"}], [{s:"ar",x:30,y:30,r:20,f:true,rot:315,ink:"a"}]],
    },
  },


  {
    cat: 0, type: "raven", diff: "hard", badge: "Take Away", time: 60,
    text: "In each row the first two figures produce the third. Find the rule.",
    opts: ["A", "B", "C", "D", "E", "F", "G", "H"],
    ans: 7,
    exp: "The third figure keeps the dots of the first figure that do NOT appear in the second one: first minus second. It is not 'keep the dots that appear only once': in row 2 the lower-left dot of the second figure is not in the first, and it does not appear in the result. Row 3: the first has 4 dots; the lower-right and upper-left ones also appear in the second, so only the upper-right and lower-left dots are left.",
    vis: {
      kind: "raven",
      cells: [
        [{s:"c",x:30,y:30,r:17,f:"z"},{s:"c",x:30.0,y:13.0,r:4.5,f:true},{s:"c",x:44.7,y:21.5,r:4.5,f:true},{s:"c",x:30.0,y:47.0,r:4.5,f:true},{s:"c",x:15.3,y:38.5,r:4.5,f:true}],
        [{s:"c",x:30,y:30,r:17,f:"z"},{s:"c",x:44.7,y:21.5,r:4.5,f:true},{s:"c",x:15.3,y:38.5,r:4.5,f:true}],
        [{s:"c",x:30,y:30,r:17,f:"z"},{s:"c",x:30.0,y:13.0,r:4.5,f:true},{s:"c",x:30.0,y:47.0,r:4.5,f:true}],
        [{s:"c",x:30,y:30,r:17,f:"z"},{s:"c",x:30.0,y:13.0,r:4.5,f:true},{s:"c",x:44.7,y:38.5,r:4.5,f:true},{s:"c",x:30.0,y:47.0,r:4.5,f:true},{s:"c",x:15.3,y:21.5,r:4.5,f:true}],
        [{s:"c",x:30,y:30,r:17,f:"z"},{s:"c",x:44.7,y:38.5,r:4.5,f:true},{s:"c",x:15.3,y:38.5,r:4.5,f:true}],
        [{s:"c",x:30,y:30,r:17,f:"z"},{s:"c",x:30.0,y:13.0,r:4.5,f:true},{s:"c",x:30.0,y:47.0,r:4.5,f:true},{s:"c",x:15.3,y:21.5,r:4.5,f:true}],
        [{s:"c",x:30,y:30,r:17,f:"z"},{s:"c",x:44.7,y:21.5,r:4.5,f:true},{s:"c",x:44.7,y:38.5,r:4.5,f:true},{s:"c",x:15.3,y:38.5,r:4.5,f:true},{s:"c",x:15.3,y:21.5,r:4.5,f:true}],
        [{s:"c",x:30,y:30,r:17,f:"z"},{s:"c",x:30.0,y:13.0,r:4.5,f:true},{s:"c",x:44.7,y:38.5,r:4.5,f:true},{s:"c",x:15.3,y:21.5,r:4.5,f:true}],
        null,
      ],
      optCells: [[{s:"c",x:30,y:30,r:17,f:"z"},{s:"c",x:30.0,y:13.0,r:4.5,f:true},{s:"c",x:44.7,y:21.5,r:4.5,f:true},{s:"c",x:15.3,y:38.5,r:4.5,f:true}], [{s:"c",x:30,y:30,r:17,f:"z"},{s:"c",x:44.7,y:38.5,r:4.5,f:true},{s:"c",x:15.3,y:21.5,r:4.5,f:true}], [{s:"c",x:30,y:30,r:17,f:"z"},{s:"c",x:30.0,y:13.0,r:4.5,f:true},{s:"c",x:44.7,y:21.5,r:4.5,f:true},{s:"c",x:44.7,y:38.5,r:4.5,f:true},{s:"c",x:15.3,y:38.5,r:4.5,f:true},{s:"c",x:15.3,y:21.5,r:4.5,f:true}], [{s:"c",x:30,y:30,r:17,f:"z"},{s:"c",x:44.7,y:21.5,r:4.5,f:true}], [{s:"c",x:30,y:30,r:17,f:"z"},{s:"c",x:15.3,y:38.5,r:4.5,f:true}], [{s:"c",x:30,y:30,r:17,f:"z"},{s:"c",x:44.7,y:21.5,r:4.5,f:true},{s:"c",x:44.7,y:38.5,r:4.5,f:true},{s:"c",x:15.3,y:38.5,r:4.5,f:true}], [{s:"c",x:30,y:30,r:17,f:"z"},{s:"c",x:30.0,y:13.0,r:4.5,f:true},{s:"c",x:30.0,y:47.0,r:4.5,f:true}], [{s:"c",x:30,y:30,r:17,f:"z"},{s:"c",x:44.7,y:21.5,r:4.5,f:true},{s:"c",x:15.3,y:38.5,r:4.5,f:true}]],
    },
  },

  {
    cat: 0, type: "raven", diff: "hard", badge: "Inside Out", time: 70,
    text: "Look at how the shapes inside and outside are passed along. Which figure is missing?",
    opts: ["A", "B", "C", "D", "E", "F", "G", "H"],
    ans: 0,
    exp: "The shapes follow the cycle square \u2192 circle \u2192 triangle \u2192 diamond \u2192 square. In every figure the inner shape is the one after the outer shape, and the next figure to the right starts with that inner shape as its outer shape. So the missing figure is a square with a circle inside. The shading of the inner shape is filled, grey or empty once in every row and column, which makes it grey.",
    vis: {
      kind: "raven",
      cells: [
        [{s:"sq",x:30,y:30,r:21,f:false},{s:"c",x:30,y:30,r:8,f:true}],
        [{s:"c",x:30,y:30,r:21,f:false},{s:"tr",x:30,y:30,r:8,f:"g"}],
        [{s:"tr",x:30,y:34,r:24,f:false},{s:"di",x:30,y:37,r:8,f:false}],
        [{s:"c",x:30,y:30,r:21,f:false},{s:"tr",x:30,y:30,r:8,f:"g"}],
        [{s:"tr",x:30,y:34,r:24,f:false},{s:"di",x:30,y:37,r:8,f:false}],
        [{s:"di",x:30,y:30,r:21,f:false},{s:"sq",x:30,y:30,r:8,f:true}],
        [{s:"tr",x:30,y:34,r:24,f:false},{s:"di",x:30,y:37,r:8,f:false}],
        [{s:"di",x:30,y:30,r:21,f:false},{s:"sq",x:30,y:30,r:8,f:true}],
        null,
      ],
      optCells: [[{s:"sq",x:30,y:30,r:21,f:false},{s:"c",x:30,y:30,r:8,f:"g"}], [{s:"sq",x:30,y:30,r:21,f:false},{s:"c",x:30,y:30,r:8,f:true}], [{s:"sq",x:30,y:30,r:21,f:false},{s:"c",x:30,y:30,r:8,f:false}], [{s:"di",x:30,y:30,r:21,f:false},{s:"sq",x:30,y:30,r:8,f:"g"}], [{s:"c",x:30,y:30,r:21,f:false},{s:"tr",x:30,y:30,r:8,f:"g"}], [{s:"c",x:30,y:30,r:21,f:false},{s:"sq",x:30,y:30,r:8,f:"g"}], [{s:"sq",x:30,y:30,r:21,f:false},{s:"tr",x:30,y:30,r:8,f:"g"}], [{s:"tr",x:30,y:34,r:24,f:false},{s:"di",x:30,y:37,r:8,f:true}]],
    },
  },

  {
    cat: 0, type: "raven", diff: "hard", badge: "Golden Overlap", time: 70,
    text: "In each row the first two figures combine into the third. Why are some squares gold?",
    opts: ["A", "B", "C", "D", "E", "F", "G", "H"],
    ans: 5,
    exp: "The third figure puts the first two on top of each other. Squares that appear in only one of them stay purple; squares that appear in BOTH turn gold. Row 3: the left-middle and bottom-left squares are in both (gold), the top-left, centre and right-middle squares are in only one (purple).",
    vis: {
      kind: "raven",
      cells: [
        [{s:"sq",x:15,y:15,r:5.5,f:"z"},{s:"sq",x:30,y:15,r:5.5,f:"z"},{s:"sq",x:45,y:15,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:"z"},{s:"sq",x:30,y:30,r:5.5,f:"z"},{s:"sq",x:45,y:30,r:5.5,f:"z"},{s:"sq",x:15,y:45,r:5.5,f:"z"},{s:"sq",x:30,y:45,r:5.5,f:"z"},{s:"sq",x:45,y:45,r:5.5,f:"z"},{s:"sq",x:15,y:15,r:5.5,f:true},{s:"sq",x:30,y:30,r:5.5,f:true},{s:"sq",x:45,y:45,r:5.5,f:true}],
        [{s:"sq",x:15,y:15,r:5.5,f:"z"},{s:"sq",x:30,y:15,r:5.5,f:"z"},{s:"sq",x:45,y:15,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:"z"},{s:"sq",x:30,y:30,r:5.5,f:"z"},{s:"sq",x:45,y:30,r:5.5,f:"z"},{s:"sq",x:15,y:45,r:5.5,f:"z"},{s:"sq",x:30,y:45,r:5.5,f:"z"},{s:"sq",x:45,y:45,r:5.5,f:"z"},{s:"sq",x:45,y:15,r:5.5,f:true},{s:"sq",x:30,y:30,r:5.5,f:true},{s:"sq",x:15,y:45,r:5.5,f:true}],
        [{s:"sq",x:15,y:15,r:5.5,f:"z"},{s:"sq",x:30,y:15,r:5.5,f:"z"},{s:"sq",x:45,y:15,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:"z"},{s:"sq",x:30,y:30,r:5.5,f:"z"},{s:"sq",x:45,y:30,r:5.5,f:"z"},{s:"sq",x:15,y:45,r:5.5,f:"z"},{s:"sq",x:30,y:45,r:5.5,f:"z"},{s:"sq",x:45,y:45,r:5.5,f:"z"},{s:"sq",x:15,y:15,r:5.5,f:true},{s:"sq",x:45,y:15,r:5.5,f:true},{s:"sq",x:15,y:45,r:5.5,f:true},{s:"sq",x:45,y:45,r:5.5,f:true},{s:"sq",x:30,y:30,r:5.5,f:true,ink:"a"}],
        [{s:"sq",x:15,y:15,r:5.5,f:"z"},{s:"sq",x:30,y:15,r:5.5,f:"z"},{s:"sq",x:45,y:15,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:"z"},{s:"sq",x:30,y:30,r:5.5,f:"z"},{s:"sq",x:45,y:30,r:5.5,f:"z"},{s:"sq",x:15,y:45,r:5.5,f:"z"},{s:"sq",x:30,y:45,r:5.5,f:"z"},{s:"sq",x:45,y:45,r:5.5,f:"z"},{s:"sq",x:15,y:15,r:5.5,f:true},{s:"sq",x:30,y:15,r:5.5,f:true},{s:"sq",x:45,y:15,r:5.5,f:true},{s:"sq",x:30,y:30,r:5.5,f:true}],
        [{s:"sq",x:15,y:15,r:5.5,f:"z"},{s:"sq",x:30,y:15,r:5.5,f:"z"},{s:"sq",x:45,y:15,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:"z"},{s:"sq",x:30,y:30,r:5.5,f:"z"},{s:"sq",x:45,y:30,r:5.5,f:"z"},{s:"sq",x:15,y:45,r:5.5,f:"z"},{s:"sq",x:30,y:45,r:5.5,f:"z"},{s:"sq",x:45,y:45,r:5.5,f:"z"},{s:"sq",x:30,y:15,r:5.5,f:true},{s:"sq",x:30,y:30,r:5.5,f:true},{s:"sq",x:30,y:45,r:5.5,f:true}],
        [{s:"sq",x:15,y:15,r:5.5,f:"z"},{s:"sq",x:30,y:15,r:5.5,f:"z"},{s:"sq",x:45,y:15,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:"z"},{s:"sq",x:30,y:30,r:5.5,f:"z"},{s:"sq",x:45,y:30,r:5.5,f:"z"},{s:"sq",x:15,y:45,r:5.5,f:"z"},{s:"sq",x:30,y:45,r:5.5,f:"z"},{s:"sq",x:45,y:45,r:5.5,f:"z"},{s:"sq",x:15,y:15,r:5.5,f:true},{s:"sq",x:45,y:15,r:5.5,f:true},{s:"sq",x:30,y:45,r:5.5,f:true},{s:"sq",x:30,y:15,r:5.5,f:true,ink:"a"},{s:"sq",x:30,y:30,r:5.5,f:true,ink:"a"}],
        [{s:"sq",x:15,y:15,r:5.5,f:"z"},{s:"sq",x:30,y:15,r:5.5,f:"z"},{s:"sq",x:45,y:15,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:"z"},{s:"sq",x:30,y:30,r:5.5,f:"z"},{s:"sq",x:45,y:30,r:5.5,f:"z"},{s:"sq",x:15,y:45,r:5.5,f:"z"},{s:"sq",x:30,y:45,r:5.5,f:"z"},{s:"sq",x:45,y:45,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:true},{s:"sq",x:30,y:30,r:5.5,f:true},{s:"sq",x:45,y:30,r:5.5,f:true},{s:"sq",x:15,y:45,r:5.5,f:true}],
        [{s:"sq",x:15,y:15,r:5.5,f:"z"},{s:"sq",x:30,y:15,r:5.5,f:"z"},{s:"sq",x:45,y:15,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:"z"},{s:"sq",x:30,y:30,r:5.5,f:"z"},{s:"sq",x:45,y:30,r:5.5,f:"z"},{s:"sq",x:15,y:45,r:5.5,f:"z"},{s:"sq",x:30,y:45,r:5.5,f:"z"},{s:"sq",x:45,y:45,r:5.5,f:"z"},{s:"sq",x:15,y:15,r:5.5,f:true},{s:"sq",x:15,y:30,r:5.5,f:true},{s:"sq",x:15,y:45,r:5.5,f:true}],
        null,
      ],
      optCells: [[{s:"sq",x:15,y:15,r:5.5,f:"z"},{s:"sq",x:30,y:15,r:5.5,f:"z"},{s:"sq",x:45,y:15,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:"z"},{s:"sq",x:30,y:30,r:5.5,f:"z"},{s:"sq",x:45,y:30,r:5.5,f:"z"},{s:"sq",x:15,y:45,r:5.5,f:"z"},{s:"sq",x:30,y:45,r:5.5,f:"z"},{s:"sq",x:45,y:45,r:5.5,f:"z"},{s:"sq",x:15,y:15,r:5.5,f:true},{s:"sq",x:15,y:30,r:5.5,f:true},{s:"sq",x:30,y:30,r:5.5,f:true},{s:"sq",x:45,y:30,r:5.5,f:true},{s:"sq",x:15,y:45,r:5.5,f:true}], [{s:"sq",x:15,y:15,r:5.5,f:"z"},{s:"sq",x:30,y:15,r:5.5,f:"z"},{s:"sq",x:45,y:15,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:"z"},{s:"sq",x:30,y:30,r:5.5,f:"z"},{s:"sq",x:45,y:30,r:5.5,f:"z"},{s:"sq",x:15,y:45,r:5.5,f:"z"},{s:"sq",x:30,y:45,r:5.5,f:"z"},{s:"sq",x:45,y:45,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:true},{s:"sq",x:15,y:45,r:5.5,f:true},{s:"sq",x:15,y:15,r:5.5,f:true,ink:"a"},{s:"sq",x:30,y:30,r:5.5,f:true,ink:"a"},{s:"sq",x:45,y:30,r:5.5,f:true,ink:"a"}], [{s:"sq",x:15,y:15,r:5.5,f:"z"},{s:"sq",x:30,y:15,r:5.5,f:"z"},{s:"sq",x:45,y:15,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:"z"},{s:"sq",x:30,y:30,r:5.5,f:"z"},{s:"sq",x:45,y:30,r:5.5,f:"z"},{s:"sq",x:15,y:45,r:5.5,f:"z"},{s:"sq",x:30,y:45,r:5.5,f:"z"},{s:"sq",x:45,y:45,r:5.5,f:"z"},{s:"sq",x:15,y:15,r:5.5,f:true},{s:"sq",x:30,y:30,r:5.5,f:true},{s:"sq",x:45,y:30,r:5.5,f:true}], [{s:"sq",x:15,y:15,r:5.5,f:"z"},{s:"sq",x:30,y:15,r:5.5,f:"z"},{s:"sq",x:45,y:15,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:"z"},{s:"sq",x:30,y:30,r:5.5,f:"z"},{s:"sq",x:45,y:30,r:5.5,f:"z"},{s:"sq",x:15,y:45,r:5.5,f:"z"},{s:"sq",x:30,y:45,r:5.5,f:"z"},{s:"sq",x:45,y:45,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:true,ink:"a"},{s:"sq",x:15,y:45,r:5.5,f:true,ink:"a"}], [{s:"sq",x:15,y:15,r:5.5,f:"z"},{s:"sq",x:30,y:15,r:5.5,f:"z"},{s:"sq",x:45,y:15,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:"z"},{s:"sq",x:30,y:30,r:5.5,f:"z"},{s:"sq",x:45,y:30,r:5.5,f:"z"},{s:"sq",x:15,y:45,r:5.5,f:"z"},{s:"sq",x:30,y:45,r:5.5,f:"z"},{s:"sq",x:45,y:45,r:5.5,f:"z"},{s:"sq",x:15,y:15,r:5.5,f:true},{s:"sq",x:30,y:30,r:5.5,f:true},{s:"sq",x:45,y:30,r:5.5,f:true},{s:"sq",x:15,y:45,r:5.5,f:true},{s:"sq",x:15,y:30,r:5.5,f:true,ink:"a"}], [{s:"sq",x:15,y:15,r:5.5,f:"z"},{s:"sq",x:30,y:15,r:5.5,f:"z"},{s:"sq",x:45,y:15,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:"z"},{s:"sq",x:30,y:30,r:5.5,f:"z"},{s:"sq",x:45,y:30,r:5.5,f:"z"},{s:"sq",x:15,y:45,r:5.5,f:"z"},{s:"sq",x:30,y:45,r:5.5,f:"z"},{s:"sq",x:45,y:45,r:5.5,f:"z"},{s:"sq",x:15,y:15,r:5.5,f:true},{s:"sq",x:30,y:30,r:5.5,f:true},{s:"sq",x:45,y:30,r:5.5,f:true},{s:"sq",x:15,y:30,r:5.5,f:true,ink:"a"},{s:"sq",x:15,y:45,r:5.5,f:true,ink:"a"}], [{s:"sq",x:15,y:15,r:5.5,f:"z"},{s:"sq",x:30,y:15,r:5.5,f:"z"},{s:"sq",x:45,y:15,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:"z"},{s:"sq",x:30,y:30,r:5.5,f:"z"},{s:"sq",x:45,y:30,r:5.5,f:"z"},{s:"sq",x:15,y:45,r:5.5,f:"z"},{s:"sq",x:30,y:45,r:5.5,f:"z"},{s:"sq",x:45,y:45,r:5.5,f:"z"},{s:"sq",x:15,y:15,r:5.5,f:true},{s:"sq",x:30,y:30,r:5.5,f:true},{s:"sq",x:45,y:30,r:5.5,f:true},{s:"sq",x:45,y:45,r:5.5,f:true},{s:"sq",x:15,y:30,r:5.5,f:true,ink:"a"},{s:"sq",x:15,y:45,r:5.5,f:true,ink:"a"}], [{s:"sq",x:15,y:15,r:5.5,f:"z"},{s:"sq",x:30,y:15,r:5.5,f:"z"},{s:"sq",x:45,y:15,r:5.5,f:"z"},{s:"sq",x:15,y:30,r:5.5,f:"z"},{s:"sq",x:30,y:30,r:5.5,f:"z"},{s:"sq",x:45,y:30,r:5.5,f:"z"},{s:"sq",x:15,y:45,r:5.5,f:"z"},{s:"sq",x:30,y:45,r:5.5,f:"z"},{s:"sq",x:45,y:45,r:5.5,f:"z"},{s:"sq",x:15,y:15,r:5.5,f:true},{s:"sq",x:45,y:30,r:5.5,f:true},{s:"sq",x:15,y:30,r:5.5,f:true,ink:"a"},{s:"sq",x:30,y:30,r:5.5,f:true,ink:"a"},{s:"sq",x:15,y:45,r:5.5,f:true,ink:"a"}]],
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
    cat: 2, type: "text", diff: "hard", badge: "Laser Mirrors", time: 60,
    text: "The laser enters from the left. Mirrors reflect on both sides. Where does the beam leave the box?",
    opts: ["A", "B", "C", "D"],
    ans: 2,
    exp: "Follow the beam cell by cell: right, down at the first mirror, then it zig-zags through the box, crossing its own path several times. One mirror (bottom-left corner) is never hit. The beam finally travels down column 4 and leaves through the bottom at C.",
    vis: {
      kind: "laser", n: 5, entryRow: 2,
      mirrors: [
        { r: 0, c: 3, m: "\\" }, { r: 4, c: 1, m: "\\" }, { r: 1, c: 4, m: "\\" }, { r: 4, c: 0, m: "\\" },
        { r: 3, c: 4, m: "/" }, { r: 4, c: 2, m: "/" }, { r: 1, c: 2, m: "/" }, { r: 3, c: 0, m: "\\" },
        { r: 0, c: 0, m: "/" }, { r: 2, c: 1, m: "\\" },
      ],
      exits: [
        { side: "top", i: 3, label: "A" }, { side: "right", i: 3, label: "B" },
        { side: "bottom", i: 3, label: "C" }, { side: "left", i: 3, label: "D" },
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
    cat: 5, type: "symbols", diff: "hard", badge: "Colour Clash", time: 14,
    text: "How many words are written in the SAME colour that they name?",
    opts: ["2", "3", "4", "5"],
    ans: 1,
    exp: "GREEN in green, PURPLE in purple and YELLOW in yellow: 3. Your brain reads the word faster than it names the ink colour, which is why this is harder than it looks.",
    vis: {
      kind: "stroop",
      words: [
        { w: "RED", c: "blue" }, { w: "GREEN", c: "green" }, { w: "BLUE", c: "red" },
        { w: "YELLOW", c: "purple" }, { w: "PURPLE", c: "purple" }, { w: "RED", c: "yellow" },
        { w: "BLUE", c: "green" }, { w: "YELLOW", c: "yellow" }, { w: "GREEN", c: "red" },
      ],
    },
  },

];
