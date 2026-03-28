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
  // LOGICAL REASONING (5)
  { cat:0, type:"sequence", diff:"easy", badge:"Number Sequence", time:30,
    text:"What number comes next? 2, 4, 8, 16, ?",
    seq:[2,4,8,16,"?"],
    opts:["24","32","28","20"], ans:1,
    exp:"Each number doubles. 16 x 2 = 32." },
  { cat:0, type:"oddone", diff:"easy", badge:"Odd One Out", time:30,
    text:"Which does not belong?",
    opts:["Dog","Cat","Eagle","Hamster"], ans:2,
    exp:"Dog, Cat and Hamster are mammals. Eagle is a bird." },
  { cat:0, type:"sequence", diff:"medium", badge:"Letter Sequence", time:25,
    text:"What letter comes next? A, C, F, J, ?",
    seq:["A","C","F","J","?"],
    opts:["L","M","N","O"], ans:3,
    exp:"Gaps increase: +2,+3,+4,+5. J is the 10th letter, next is the 15th = O." },
  { cat:0, type:"sequence", diff:"medium", badge:"Number Sequence", time:25,
    text:"What comes next? 1, 1, 2, 3, 5, 8, ?",
    seq:[1,1,2,3,5,8,"?"],
    opts:["11","12","13","14"], ans:2,
    exp:"Fibonacci: each number is the sum of the two before it. 5 + 8 = 13." },
  { cat:0, type:"oddone", diff:"hard", badge:"Odd One Out", time:20,
    text:"Which does not belong?",
    opts:["16","25","36","50"], ans:3,
    exp:"16=4, 25=5, 36=6 are all perfect squares. 50 is not." },

  // VERBAL INTELLIGENCE (5)
  { cat:1, type:"analogy", diff:"easy", badge:"Word Analogy", time:30,
    text:"Complete the analogy:",
    w1:"Hot", w2:"Cold", w3:"Day", missing:"?",
    opts:["Sun","Night","Warm","Light"], ans:1,
    exp:"Hot is the opposite of Cold. Day opposite is Night." },
  { cat:1, type:"text", diff:"easy", badge:"Odd Word Out", time:30,
    text:"Which word does NOT belong?",
    opts:["Apple","Banana","Carrot","Mango"], ans:2,
    exp:"Apple, Banana and Mango are fruits. Carrot is a vegetable." },
  { cat:1, type:"text", diff:"medium", badge:"Synonym", time:25,
    text:"Which word is closest in meaning to BRAVE?",
    opts:["Timid","Reckless","Courageous","Nervous"], ans:2,
    exp:"Brave means showing courage. Closest synonym is Courageous." },
  { cat:1, type:"analogy", diff:"medium", badge:"Word Analogy", time:25,
    text:"Complete the analogy:",
    w1:"Author", w2:"Novel", w3:"Composer", missing:"?",
    opts:["Piano","Concert","Symphony","Lyrics"], ans:2,
    exp:"An Author creates a Novel. A Composer creates a Symphony." },
  { cat:1, type:"text", diff:"hard", badge:"Antonym", time:20,
    text:"Which word is most OPPOSITE to EPHEMERAL?",
    opts:["Brief","Transient","Permanent","Fleeting"], ans:2,
    exp:"Ephemeral means lasting a very short time. Its antonym is Permanent." },

  // SPATIAL REASONING (5)
  { cat:2, type:"text", diff:"easy", badge:"Rotation", time:30,
    text:"A triangle pointing UP is rotated 90 degrees clockwise. Where does it point?",
    opts:["Up","Right","Down","Left"], ans:1,
    exp:"Rotating a triangle 90 degrees clockwise makes it point right." },
  { cat:2, type:"pattern", diff:"easy", badge:"Pattern Matrix", time:30,
    text:"What completes the pattern?",
    grid:["filled","empty","filled","empty","filled","empty","filled","empty","?"], gridClass:"grid3",
    opts:["filled","empty","both","none"], ans:1,
    exp:"The grid alternates filled and empty. The missing cell is empty." },
  { cat:2, type:"text", diff:"medium", badge:"Folding", time:25,
    text:"A square paper is folded in half twice then one corner is cut. How many holes appear when unfolded?",
    opts:["1","2","3","4"], ans:3,
    exp:"Folding twice creates 4 layers. One cut through all layers = 4 holes." },
  { cat:2, type:"text", diff:"medium", badge:"3D Vision", time:25,
    text:"If you look at a clock from behind, what time does 3:00 appear to show?",
    opts:["3:00","9:00","6:00","12:00"], ans:1,
    exp:"From behind, left and right are mirrored. The 3 appears where the 9 is." },
  { cat:2, type:"text", diff:"hard", badge:"Spatial Logic", time:20,
    text:"How many squares of ALL sizes are in a 3x3 grid?",
    opts:["9","12","14","16"], ans:2,
    exp:"1x1: 9, 2x2: 4, 3x3: 1. Total = 14 squares." },

  // NUMERICAL ABILITY (5)
  { cat:3, type:"text", diff:"easy", badge:"Quick Maths", time:30,
    text:"What is 25% of 80?",
    opts:["15","20","25","30"], ans:1,
    exp:"25% = one quarter. 80 divided by 4 = 20." },
  { cat:3, type:"sequence", diff:"easy", badge:"Number Series", time:30,
    text:"What comes next? 100, 90, 81, 73, 66, ?",
    seq:[100,90,81,73,66,"?"],
    opts:["58","59","60","61"], ans:2,
    exp:"Differences: -10,-9,-8,-7,-6. So 66 - 6 = 60." },
  { cat:3, type:"text", diff:"medium", badge:"Word Problem", time:25,
    text:"A train travels 240 km in 3 hours. How long to travel 400 km at the same speed?",
    opts:["4h","4.5h","5h","5.5h"], ans:2,
    exp:"Speed = 80 km/h. Time = 400 divided by 80 = 5 hours." },
  { cat:3, type:"text", diff:"medium", badge:"Percentages", time:25,
    text:"A price rises 20% then falls 20%. What is the net change?",
    opts:["0%","-4%","+4%","-2%"], ans:1,
    exp:"100 x 1.2 = 120. Then 120 x 0.8 = 96. Net change = -4%." },
  { cat:3, type:"text", diff:"hard", badge:"Algebra", time:20,
    text:"If 3x + 7 = 22, what is 2x - 1?",
    opts:["8","9","10","11"], ans:1,
    exp:"3x = 15, so x = 5. Then 2(5) - 1 = 9." },

  // WORKING MEMORY (5)
  { cat:4, type:"text", diff:"easy", badge:"Sequence Recall", time:35,
    text:"What is this sequence in REVERSE? 3, 7, 2, 9",
    opts:["9,2,7,3","3,7,2,9","7,2,9,3","9,7,2,3"], ans:0,
    exp:"The sequence 3,7,2,9 reversed is 9,2,7,3." },
  { cat:4, type:"text", diff:"easy", badge:"Word Recall", time:35,
    text:"Which word was NOT in this list? CHAIR, TABLE, LAMP, DOOR, WINDOW",
    opts:["Table","Lamp","Carpet","Door"], ans:2,
    exp:"CARPET was not in the original list. All others were present." },
  { cat:4, type:"text", diff:"medium", badge:"N-Back", time:30,
    text:"In the series 4,7,3,7,4,2,4 which number appeared exactly 3 times?",
    opts:["7","3","4","2"], ans:2,
    exp:"4 appears at positions 1, 5 and 7. Exactly 3 times." },
  { cat:4, type:"text", diff:"medium", badge:"Sequence Recall", time:30,
    text:"Letters shown: K, B, M, F, T, R. What was the 4th letter?",
    opts:["M","F","T","B"], ans:1,
    exp:"K(1), B(2), M(3), F(4). The 4th letter was F." },
  { cat:4, type:"text", diff:"hard", badge:"Complex Recall", time:25,
    text:"Sequence: 8, 3, 6, 1, 9, 4. What is the sum of the 2nd and 5th numbers?",
    opts:["10","11","12","13"], ans:2,
    exp:"2nd number = 3. 5th number = 9. Sum = 12." },

  // PROCESSING SPEED (5)
  { cat:5, type:"text", diff:"easy", badge:"Quick Comparison", time:15,
    text:"Which pair is identical?",
    opts:["TIGER / TIGER","TIGER / TIGRE","TIGAR / TIGER","TIGRE / TIGRE"], ans:0,
    exp:"Only TIGER / TIGER is exactly identical." },
  { cat:5, type:"text", diff:"easy", badge:"Rapid Calculation", time:15,
    text:"7 x 8 = ?",
    opts:["54","56","58","48"], ans:1,
    exp:"7 x 8 = 56." },
  { cat:5, type:"text", diff:"medium", badge:"Quick Comparison", time:12,
    text:"Which number is different? 748392 / 748392 / 748329 / 748392",
    opts:["1st","2nd","3rd","4th"], ans:2,
    exp:"The 3rd number is 748329. The others are all 748392." },
  { cat:5, type:"text", diff:"medium", badge:"Rapid Calculation", time:12,
    text:"What is 13 x 13?",
    opts:["156","168","169","172"], ans:2,
    exp:"13 x 13 = 169." },
  { cat:5, type:"text", diff:"hard", badge:"Rapid Deduction", time:10,
    text:"Anna is older than Ben. Ben is older than Clara. Who is the youngest?",
    opts:["Anna","Ben","Clara","Cannot tell"], ans:2,
    exp:"The order is Anna > Ben > Clara. Clara is the youngest." },
];