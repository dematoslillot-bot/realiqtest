// Daily brain challenge: 3 puzzles per day, generated from the date so everyone
// gets the same set on the same day. Progress and streak live in localStorage.

export interface DailyPuzzle {
  kind: "sequence" | "letters" | "oddone" | "symbols";
  prompt: string;
  display: string;
  options: string[];
  answer: number;        // index into options
  explain: string;
}

/* Small deterministic PRNG (mulberry32) */
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function todayKey(d = new Date()): string {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function seedFrom(key: string) {
  let h = 2166136261;
  for (const c of key) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function shuffleWithAnswer(r: () => number, correct: string, wrong: string[]): { options: string[]; answer: number } {
  const uniq = Array.from(new Set(wrong.filter(w => w !== correct))).slice(0, 3);
  const opts = [correct, ...uniq];
  for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
  return { options: opts, answer: opts.indexOf(correct) };
}

function sequencePuzzle(r: () => number): DailyPuzzle {
  const type = Math.floor(r() * 4);
  let seq: number[] = [], next = 0, explain = "";
  if (type === 0) {
    const a = 2 + Math.floor(r() * 20), d = 3 + Math.floor(r() * 9);
    seq = [0, 1, 2, 3, 4].map(i => a + i * d); next = a + 5 * d;
    explain = `Each number goes up by ${d}.`;
  } else if (type === 1) {
    const a = 2 + Math.floor(r() * 4), q = 2 + Math.floor(r() * 2);
    seq = [0, 1, 2, 3, 4].map(i => a * q ** i); next = a * q ** 5;
    explain = `Each number is multiplied by ${q}.`;
  } else if (type === 2) {
    const a = 1 + Math.floor(r() * 10), p = 2 + Math.floor(r() * 6), m = 1 + Math.floor(r() * (p - 1));
    seq = [a]; for (let i = 1; i < 6; i++) seq.push(seq[i - 1] + (i % 2 ? p : -m));
    next = seq.pop()!; explain = `It alternates: +${p}, −${m}.`;
  } else {
    const a = 1 + Math.floor(r() * 5), b = 1 + Math.floor(r() * 5);
    seq = [a, b]; for (let i = 2; i < 6; i++) seq.push(seq[i - 1] + seq[i - 2]);
    next = seq.pop()!; explain = "Each number is the sum of the two before it.";
  }
  const { options, answer } = shuffleWithAnswer(r, String(next), [next + 1, next - 1, next + 2, next * 2, next - 3].map(String));
  return { kind: "sequence", prompt: "Which number comes next?", display: seq.join("  ·  ") + "  ·  ?", options, answer, explain };
}

function letterPuzzle(r: () => number): DailyPuzzle {
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const step = 2 + Math.floor(r() * 3), start = Math.floor(r() * (26 - step * 5));
  const seq = [0, 1, 2, 3].map(i => A[start + i * step]);
  const correct = A[start + 4 * step];
  const wrongIdx = [start + 4 * step + 1, start + 4 * step - 1, start + 4 * step + step, start + 3 * step + 1];
  const { options, answer } = shuffleWithAnswer(r, correct, wrongIdx.filter(i => i >= 0 && i < 26).map(i => A[i]));
  return { kind: "letters", prompt: "Which letter comes next?", display: seq.join("  ·  ") + "  ·  ?", options, answer, explain: `The letters skip ${step - 1} each time.` };
}

function oddOnePuzzle(r: () => number): DailyPuzzle {
  const k = 3 + Math.floor(r() * 7);
  const nums = new Set<number>();
  while (nums.size < 3) nums.add(k * (2 + Math.floor(r() * 12)));
  let odd = k * (2 + Math.floor(r() * 12)) + 1 + Math.floor(r() * (k - 1));
  while (nums.has(odd)) odd++;
  const { options, answer } = shuffleWithAnswer(r, String(odd), Array.from(nums).map(String));
  return { kind: "oddone", prompt: "Which number does not belong?", display: "", options, answer, explain: `All the others are multiples of ${k}.` };
}

function symbolPuzzle(r: () => number): DailyPuzzle {
  const t = 2 + Math.floor(r() * 8), s = 1 + Math.floor(r() * 9);
  const correct = s + 2 * t;
  const display = `▲ + ▲ = ${2 * t}\n▲ + ■ = ${t + s}\n■ + ▲ + ▲ = ?`;
  const { options, answer } = shuffleWithAnswer(r, String(correct), [correct + 2, correct - 1, t + s, correct + t].map(String));
  return { kind: "symbols", prompt: "Each symbol stands for a number. Solve the last line.", display, options, answer, explain: `▲ = ${t} and ■ = ${s}, so ■ + ▲ + ▲ = ${correct}.` };
}

export function dailyPuzzles(key = todayKey()): DailyPuzzle[] {
  const r = rng(seedFrom(key));
  const makers = [sequencePuzzle, letterPuzzle, oddOnePuzzle, symbolPuzzle];
  // Always a sequence, then two of the other kinds.
  const others = [1, 2, 3].sort(() => r() - 0.5).slice(0, 2);
  return [makers[0](r), ...others.map(i => makers[i](r))];
}

/* ── Progress ───────────────────────────────────────────────────────────── */
export interface DailyState { done: Record<string, number>; } // date -> correct answers (0-3)

export function loadDaily(): DailyState {
  try { return JSON.parse(localStorage.getItem("daily_state") || '{"done":{}}'); } catch { return { done: {} }; }
}
export function saveDaily(st: DailyState) {
  try { localStorage.setItem("daily_state", JSON.stringify(st)); } catch { /* ignore */ }
}

/** Consecutive days (ending today, or yesterday if today isn't done yet) with a finished challenge. */
export function streak(st: DailyState, now = new Date()): number {
  let n = 0;
  const d = new Date(now);
  if (st.done[todayKey(d)] === undefined) d.setDate(d.getDate() - 1);
  while (st.done[todayKey(d)] !== undefined) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
