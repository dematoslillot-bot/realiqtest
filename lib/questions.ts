export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType = "pattern" | "sequence" | "analogy" | "text" | "oddone";

export interface Question {
  cat: number;
  type: QuestionType;
  diff: Difficulty;
  badge: string;
  time: number;
  text: string;
  grid?: string[];
  gridClass?: string;
  seq?: (string | number)[];
  w1?: string;
  w2?: string;
  w3?: string;
  missing?: string;
  opts: string[];
  ans: number;
  exp: string;
}

export const CATEGORIES = [
  { name: "Logical Reasoning", short: "Logic" },
  { name: "Verbal Intelligence", short: "Verbal" },
  { name: "Spatial Reasoning", short: "Spatial" },
  { name: "Numerical Ability", short: "Numerical" },
  { name: "Working Memory", short: "Memory" },
  { name: "Processing Speed", short: "Speed" },
];

export const ALL_QUESTIONS: Question[] = [

  // ── LOGICAL REASONING (5) ────────────────────────────────────────────────

  {
    cat: 0, type: "sequence", diff: "easy", badge: "Number Series", time: 30,
    text: "What number comes next in the series?",
    seq: [3, 6, 12, 24, "?"],
    opts: ["36", "42", "48", "30"],
    ans: 2,
    exp: "Each term doubles. 24 × 2 = 48.",
  },
  {
    cat: 0, type: "text", diff: "easy", badge: "Deductive Reasoning", time: 30,
    text: "All rectangles have four sides. All squares are rectangles. Which statement must be true?",
    opts: [
      "All four-sided shapes are squares",
      "All squares have four sides",
      "All rectangles are squares",
      "No rectangle is a square",
    ],
    ans: 1,
    exp: "Since squares are rectangles and all rectangles have four sides, all squares must have four sides.",
  },
  {
    cat: 0, type: "sequence", diff: "medium", badge: "Number Series", time: 25,
    text: "What number comes next?",
    seq: [2, 3, 5, 9, 17, "?"],
    opts: ["29", "31", "33", "35"],
    ans: 2,
    exp: "Each difference doubles: +1, +2, +4, +8, +16. So 17 + 16 = 33.",
  },
  {
    cat: 0, type: "oddone", diff: "medium", badge: "Odd One Out", time: 25,
    text: "Which number does not belong?",
    opts: ["16", "25", "36", "48"],
    ans: 3,
    exp: "16=4², 25=5², 36=6² are perfect squares. 48 is not a perfect square.",
  },
  {
    cat: 0, type: "sequence", diff: "hard", badge: "Letter Series", time: 20,
    text: "What letter comes next?",
    seq: ["A", "C", "F", "J", "O", "?"],
    opts: ["T", "U", "V", "S"],
    ans: 1,
    exp: "The gaps increase by 1 each time: +2, +3, +4, +5, +6. A(1)+6=U(21). Next letter is U.",
  },

  // ── VERBAL INTELLIGENCE (5) ──────────────────────────────────────────────

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
    exp: "Simile, Metaphor and Alliteration are all figures of speech. Algebra is a branch of mathematics.",
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
    exp: "Ephemeral means lasting a very short time. Its antonym is Permanent (lasting forever).",
  },

  // ── SPATIAL REASONING (5) ────────────────────────────────────────────────

  {
    cat: 2, type: "text", diff: "easy", badge: "Orientation", time: 30,
    text: "You are facing North. You turn 90° clockwise, then 90° clockwise again. Which direction are you now facing?",
    opts: ["North", "East", "South", "West"],
    ans: 2,
    exp: "Two 90° clockwise turns = 180° total rotation. Facing North then turning 180° means you face South.",
  },
  {
    cat: 2, type: "text", diff: "easy", badge: "Mirror Image", time: 30,
    text: "A clock shows exactly 3:00. What time does its reflection in a vertical mirror show?",
    opts: ["3:00", "6:00", "9:00", "12:00"],
    ans: 2,
    exp: "A vertical mirror reverses left and right. The 3 (on the right) appears where the 9 is. The reflected clock shows 9:00.",
  },
  {
    cat: 2, type: "text", diff: "medium", badge: "Paper Folding", time: 25,
    text: "A square sheet of paper is folded in half twice. A hole is punched through all layers. How many holes appear when the paper is fully unfolded?",
    opts: ["2", "4", "6", "8"],
    ans: 1,
    exp: "Each fold doubles the layers: 1 fold = 2 layers, 2 folds = 4 layers. One punch through 4 layers creates 4 holes when unfolded.",
  },
  {
    cat: 2, type: "text", diff: "medium", badge: "Shape Counting", time: 25,
    text: "A large triangle is divided into 4 equal smaller triangles by connecting the midpoints of each side. How many triangles of ANY size are visible in total?",
    opts: ["4", "5", "6", "7"],
    ans: 1,
    exp: "There are 4 small triangles and 1 large outer triangle = 5 triangles total.",
  },
  {
    cat: 2, type: "text", diff: "hard", badge: "Squares Count", time: 20,
    text: "How many squares of ANY size (1×1, 2×2 and 3×3) are contained in a 3×3 grid of unit squares?",
    opts: ["9", "12", "14", "16"],
    ans: 2,
    exp: "1×1 squares: 9. 2×2 squares: 4. 3×3 squares: 1. Total = 14.",
  },

  // ── NUMERICAL ABILITY (5) ────────────────────────────────────────────────

  {
    cat: 3, type: "text", diff: "easy", badge: "Percentages", time: 30,
    text: "What is 15% of 200?",
    opts: ["20", "25", "30", "35"],
    ans: 2,
    exp: "15% = 15/100. 200 × 15/100 = 30.",
  },
  {
    cat: 3, type: "sequence", diff: "easy", badge: "Number Series", time: 30,
    text: "What comes next in the series?",
    seq: [100, 95, 85, 70, 50, "?"],
    opts: ["25", "30", "35", "40"],
    ans: 0,
    exp: "The differences increase: −5, −10, −15, −20, −25. So 50 − 25 = 25.",
  },
  {
    cat: 3, type: "text", diff: "medium", badge: "Speed & Distance", time: 25,
    text: "A car travels at 80 km/h. How many minutes does it take to travel 20 km?",
    opts: ["10 min", "12 min", "15 min", "20 min"],
    ans: 2,
    exp: "Time = distance ÷ speed = 20 ÷ 80 = 0.25 hours = 15 minutes.",
  },
  {
    cat: 3, type: "text", diff: "medium", badge: "Percentage Change", time: 25,
    text: "A price rises by 20%, then falls by 20%. What is the overall percentage change?",
    opts: ["0%", "−4%", "+4%", "−2%"],
    ans: 1,
    exp: "Start at 100. ×1.2 = 120. ×0.8 = 96. The net change is −4%.",
  },
  {
    cat: 3, type: "text", diff: "hard", badge: "Algebra", time: 20,
    text: "If 3x + 7 = 22, what is the value of 2x² − 1?",
    opts: ["24", "39", "49", "51"],
    ans: 2,
    exp: "3x = 15, so x = 5. Then 2(5²) − 1 = 2(25) − 1 = 50 − 1 = 49.",
  },

  // ── WORKING MEMORY (5) ──────────────────────────────────────────────────

  {
    cat: 4, type: "text", diff: "easy", badge: "Sequence Recall", time: 35,
    text: "Study this sequence, then answer: 7, 2, 9, 4, 1. What was the third number?",
    opts: ["2", "7", "9", "4"],
    ans: 2,
    exp: "The sequence is 7(1st), 2(2nd), 9(3rd), 4(4th), 1(5th). The third number is 9.",
  },
  {
    cat: 4, type: "text", diff: "easy", badge: "Reverse Recall", time: 35,
    text: "Reverse this sequence and give the result: 5, 8, 2, 6",
    opts: ["6, 2, 8, 5", "5, 2, 8, 6", "6, 8, 2, 5", "2, 6, 5, 8"],
    ans: 0,
    exp: "Reversed: the last element first gives 6, 2, 8, 5.",
  },
  {
    cat: 4, type: "text", diff: "medium", badge: "Frequency Count", time: 30,
    text: "In the series 4, 7, 3, 7, 4, 2, 4 — which number appears exactly three times?",
    opts: ["7", "3", "4", "2"],
    ans: 2,
    exp: "4 appears at positions 1, 5, and 7 — exactly three times.",
  },
  {
    cat: 4, type: "text", diff: "medium", badge: "Alphabetical Ordering", time: 30,
    text: "Arrange these letters alphabetically: K, B, M, F, T, R. What is the second letter in the sorted list?",
    opts: ["K", "F", "B", "M"],
    ans: 1,
    exp: "Sorted alphabetically: B, F, K, M, R, T. The second letter is F.",
  },
  {
    cat: 4, type: "text", diff: "hard", badge: "Position Arithmetic", time: 25,
    text: "Sequence: 8, 3, 6, 1, 9, 4, 7. What is the sum of the numbers at the 2nd, 4th, and 6th positions?",
    opts: ["6", "7", "8", "9"],
    ans: 2,
    exp: "Position 2 = 3, Position 4 = 1, Position 6 = 4. Sum = 3 + 1 + 4 = 8.",
  },

  // ── PROCESSING SPEED (5) ────────────────────────────────────────────────

  {
    cat: 5, type: "text", diff: "easy", badge: "Symbol Match", time: 15,
    text: "Which pair is exactly identical?",
    opts: ["TIGER / TIGRE", "TIGAR / TIGER", "TIGER / TIGER", "TIGRE / TIGRA"],
    ans: 2,
    exp: "Only option C — TIGER / TIGER — is exactly identical in both halves.",
  },
  {
    cat: 5, type: "text", diff: "easy", badge: "Rapid Arithmetic", time: 15,
    text: "Solve quickly: 7 × 8 = ?",
    opts: ["54", "48", "58", "56"],
    ans: 3,
    exp: "7 × 8 = 56.",
  },
  {
    cat: 5, type: "text", diff: "medium", badge: "Spot the Difference", time: 12,
    text: "Which number in the list is different from the others? 835964 / 835964 / 853964 / 835964",
    opts: ["1st", "2nd", "3rd", "4th"],
    ans: 2,
    exp: "The third number is 853964 (5 and 3 are swapped). All others are 835964.",
  },
  {
    cat: 5, type: "text", diff: "medium", badge: "Rapid Arithmetic", time: 12,
    text: "Solve quickly: You have 24 items, give away one-third, then receive 6 back. How many do you have?",
    opts: ["18", "20", "22", "24"],
    ans: 2,
    exp: "24 ÷ 3 = 8 given away. 24 − 8 = 16. Then 16 + 6 = 22.",
  },
  {
    cat: 5, type: "text", diff: "hard", badge: "Rapid Deduction", time: 10,
    text: "Diana is taller than Anna. Anna is taller than Ben. Ben is taller than Clara. Who is third tallest?",
    opts: ["Diana", "Anna", "Ben", "Clara"],
    ans: 2,
    exp: "Order tallest to shortest: Diana > Anna > Ben > Clara. The third tallest is Ben.",
  },
];
