import ContentShell, { Section } from "../components/ContentShell";

export const metadata = {
  title: "Sample IQ Test Questions — Examples from All 6 Dimensions | RealIQTest",
  description: "See sample questions from all 6 cognitive dimensions of RealIQTest: logical reasoning, verbal, spatial, numerical, working memory, and processing speed — with full explanations.",
  openGraph: {
    title: "Sample IQ Test Questions — Examples from All 6 Dimensions",
    description: "18 sample questions with correct answers and full explanations — 3 per cognitive dimension.",
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Sample IQ Test Questions — Examples from All 6 Cognitive Dimensions",
  "description": "Sample questions from all 6 cognitive dimensions of RealIQTest with correct answers and detailed explanations.",
  "url": "https://realiqtest.co/sample-questions",
  "author": { "@type": "Organization", "name": "RealIQTest" },
  "publisher": { "@type": "Organization", "name": "RealIQTest", "url": "https://realiqtest.co" },
  "datePublished": "2026-05-01",
  "dateModified": "2026-05-03",
};

const blue  = "#0055FF";
const cyan  = "#00AAFF";
const blue2 = "rgba(0,85,255,0.18)";
const dim   = "#3A5A8A";

function SampleQ({ n, badge, q, opts, ans, exp }: {
  n: string; badge: string; q: string;
  opts: string[]; ans: number; exp: string;
}) {
  return (
    <div style={{
      background: "rgba(3,10,30,0.85)", border: `1px solid ${blue2}`,
      borderRadius: 6, padding: "20px 24px", marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "#1E3460" }}>{n}</span>
        <span style={{
          fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
          padding: "3px 10px", background: "rgba(0,85,255,0.12)", color: cyan,
          border: `1px solid rgba(0,170,255,0.25)`, borderRadius: 2,
        }}>{badge}</span>
      </div>
      <p style={{ fontSize: 15, color: "#D6E4FF", marginBottom: 16, lineHeight: 1.5 }}>{q}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {opts.map((opt, i) => (
          <div key={i} style={{
            padding: "10px 14px", borderRadius: 4, fontSize: 13,
            background: i === ans ? "rgba(0,216,122,0.12)" : "rgba(0,85,255,0.06)",
            border: `1px solid ${i === ans ? "rgba(0,216,122,0.40)" : "rgba(0,85,255,0.15)"}`,
            color: i === ans ? "#00D87A" : "#8AAAD0",
          }}>
            <span style={{ marginRight: 8, fontWeight: 600 }}>{String.fromCharCode(65 + i)}.</span>
            {opt}
            {i === ans && <span style={{ marginLeft: 8, fontSize: 11 }}>✓</span>}
          </div>
        ))}
      </div>
      <div style={{
        padding: "12px 16px", background: "rgba(0,85,255,0.05)",
        border: "1px solid rgba(0,85,255,0.12)", borderRadius: 4,
        fontSize: 13, color: dim, lineHeight: 1.7,
      }}>
        <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#00AAFF", marginRight: 10 }}>Explanation</span>
        {exp}
      </div>
    </div>
  );
}

function DimHeader({ icon, n, name, note }: { icon: string; n: string; name: string; note: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 24, marginTop: 40 }}>
      <div style={{
        width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
        background: "rgba(0,85,255,0.12)", border: "1px solid rgba(0,85,255,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: cyan, marginBottom: 2 }}>Dimension {n}</div>
        <h2 style={{ fontSize: 22, fontWeight: 400, color: "#D6E4FF", marginBottom: 6 }}>{name}</h2>
        <p style={{ fontSize: 13, color: dim, lineHeight: 1.6 }}>{note}</p>
      </div>
    </div>
  );
}

export default function SampleQuestionsPage() {
  return (
    <ContentShell
      eyebrow="Test preview"
      title="Sample Questions"
      subtitle="Examples from every cognitive dimension — with the correct answer and a full explanation of the reasoning required."
      maxWidth={840}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <div style={{
        padding: "16px 20px", marginBottom: 40,
        background: "rgba(0,85,255,0.05)", border: `1px solid ${blue2}`, borderRadius: 6,
        fontSize: 14, color: dim, lineHeight: 1.7,
      }}>
        <strong style={{ color: "#D6E4FF" }}>Note:</strong> The actual test questions are different from these samples.
        Familiarising yourself with the question formats will help you perform better, but the patterns
        and sequences used in the live test are unique. The correct answers are shown here (highlighted in green)
        so you can understand the reasoning before you take the full assessment.
      </div>

      {/* ─── LOGICAL REASONING ─────────────────────────────── */}
      <DimHeader icon="⬡" n="01" name="Logical Reasoning"
        note="Raven progressive matrices: identify the rule(s) governing an abstract 3×3 grid and select the missing cell. No language or prior knowledge required." />

      <SampleQ
        n="Q1.1" badge="Easy — 30 seconds"
        q="Each row contains three shapes in sequence. What rule governs the grid, and which option completes the bottom-right cell?"
        opts={["3 filled triangles", "1 filled triangle", "3 filled squares", "3 filled circles"]}
        ans={0}
        exp="Rule: each row contains 1, 2, then 3 of the same shape. Row 1 = circles, Row 2 = squares, Row 3 = triangles. The missing cell (row 3, col 3) must be 3 filled triangles."
      />

      <SampleQ
        n="Q1.2" badge="Medium — 25 seconds"
        q="Two rules operate simultaneously. The shape type changes each row, and the fill alternates by column. What belongs in the missing cell?"
        opts={["3 filled triangles", "3 outline triangles", "3 filled squares", "1 filled triangle"]}
        ans={0}
        exp="Rule 1: shape per row (circles row 1, squares row 2, triangles row 3). Rule 2: count per row (1→2→3 shapes). Rule 3 (bonus): columns 1 and 3 are filled; column 2 is outline. Missing = 3 filled triangles."
      />

      <SampleQ
        n="Q1.3" badge="Hard — 20 seconds"
        q="Three rules operate at once: shape, size, and cyclic column order. Which completes the matrix?"
        opts={["Small circle", "Small square", "Small triangle", "Large circle"]}
        ans={0}
        exp="Each row uses all three shapes (circle, square, triangle) in a rotating order. Size decreases left to right (large→medium→small). Row 3 starts with Square, then Triangle → the third must be a Circle (small)."
      />

      {/* ─── VERBAL ───────────────────────────────────────── */}
      <DimHeader icon="◈" n="02" name="Verbal Intelligence"
        note="Analogies, vocabulary, and semantic categorisation. Tests crystallised intelligence and linguistic precision." />

      <SampleQ
        n="Q2.1" badge="Easy — 30 seconds"
        q="Complete the analogy: Light is to Dark as Hot is to _____?"
        opts={["Warm", "Fire", "Cold", "Sun"]}
        ans={2}
        exp="Light and Dark are antonyms (opposites). The antonym of Hot is Cold. The analogy follows the pattern: A : opposite(A) :: B : opposite(B)."
      />

      <SampleQ
        n="Q2.2" badge="Medium — 25 seconds"
        q="Which word does NOT belong with the others?"
        opts={["Simile", "Metaphor", "Algebra", "Alliteration"]}
        ans={2}
        exp="Simile, Metaphor, and Alliteration are all figures of speech — literary devices used to enhance language. Algebra belongs to mathematics and has no connection to literary techniques."
      />

      <SampleQ
        n="Q2.3" badge="Hard — 20 seconds"
        q="Which word is most OPPOSITE in meaning to EPHEMERAL?"
        opts={["Fleeting", "Transient", "Permanent", "Brief"]}
        ans={2}
        exp="Ephemeral means 'lasting a very short time'. Fleeting, transient, and brief are all synonyms of ephemeral. The only antonym among the options is Permanent — something that lasts indefinitely."
      />

      {/* ─── SPATIAL ──────────────────────────────────────── */}
      <DimHeader icon="⟳" n="03" name="Spatial Reasoning"
        note="Mental rotation of asymmetric 2D shapes. Options differ by as little as 45° in harder questions, demanding precise visual manipulation." />

      <SampleQ
        n="Q3.1" badge="Easy — 30 seconds"
        q="An arrow points right (0°). Which option shows it rotated 90° clockwise?"
        opts={["Arrow pointing down", "Arrow pointing right", "Arrow pointing left", "Arrow pointing up"]}
        ans={0}
        exp="Rotating a right-pointing arrow 90° clockwise brings the tip to point downward. Think of a clock hand at 3 o'clock rotating to 6 o'clock — the tip moves from right to down."
      />

      <SampleQ
        n="Q3.2" badge="Medium — 25 seconds"
        q="A Z-shaped figure is shown at 45°. Which option shows it rotated a further 90° clockwise?"
        opts={["Shape at 45°", "Shape at 90°", "Shape at 135°", "Shape at 180°"]}
        ans={2}
        exp="If the shape is shown at 45° and we rotate it a further 90° clockwise, the result is 45° + 90° = 135°. Options are only 45° apart, requiring precise mental rotation rather than rough estimation."
      />

      <SampleQ
        n="Q3.3" badge="Hard — 18 seconds"
        q="A complex G-shaped figure has been rotated 270° clockwise. Which option shows its original (unrotated) position?"
        opts={["0° (original)", "90° clockwise", "180°", "270° clockwise"]}
        ans={0}
        exp="To reverse a 270° clockwise rotation, apply a 90° clockwise rotation (since 270° + 90° = 360° = back to start). Equivalently, rotate 270° counter-clockwise. The original orientation is 0°."
      />

      {/* ─── NUMERICAL ────────────────────────────────────── */}
      <DimHeader icon="∑" n="04" name="Numerical Ability"
        note="Number series visualised as bar charts. The missing bar is shown as empty — identify the rule and calculate the correct value." />

      <SampleQ
        n="Q4.1" badge="Easy — 30 seconds"
        q="The bar chart shows the series: 3, 6, 12, 24, ___. What is the missing value?"
        opts={["36", "42", "48", "30"]}
        ans={2}
        exp="Each bar is double the previous bar: 3×2=6, 6×2=12, 12×2=24, 24×2=48. This is a geometric series with a common ratio of 2."
      />

      <SampleQ
        n="Q4.2" badge="Medium — 22 seconds"
        q="The series: 2, 6, 4, 12, 8, 24, ___. What comes next?"
        opts={["12", "16", "18", "32"]}
        ans={1}
        exp="The series alternates between two operations: ×3 (multiply by 3) then ÷1.5 (divide by 1.5). So: 2×3=6, 6÷1.5=4, 4×3=12, 12÷1.5=8, 8×3=24, 24÷1.5=16."
      />

      <SampleQ
        n="Q4.3" badge="Hard — 18 seconds"
        q="The series: 1, 3, 7, 15, 31, ___. What is the missing value?"
        opts={["57", "61", "63", "65"]}
        ans={2}
        exp="Each term follows the rule: next = previous × 2 + 1. So 1×2+1=3, 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63. Alternatively, each term is 2ⁿ − 1 (n=1,2,3,4,5,6 → 63)."
      />

      {/* ─── WORKING MEMORY ───────────────────────────────── */}
      <DimHeader icon="◉" n="05" name="Working Memory"
        note="A sequence of coloured circles flashes on screen for 1.8–2.8 seconds. When it disappears, answer questions about specific positions or frequencies." />

      <SampleQ
        n="Q5.1" badge="Easy — 30 seconds"
        q="You saw: Red → Blue → Green → Yellow → Purple. What was the last colour in the sequence?"
        opts={["Green", "Yellow", "Purple", "Blue"]}
        ans={2}
        exp="Sequence: Red (1st), Blue (2nd), Green (3rd), Yellow (4th), Purple (5th/last). The last colour was Purple. Strategy: focus your attention on the final item as the sequence ends."
      />

      <SampleQ
        n="Q5.2" badge="Medium — 25 seconds"
        q="You saw: Blue → Red → Yellow → Purple → Red → Green. How many DIFFERENT colours appeared?"
        opts={["4", "5", "6", "7"]}
        ans={1}
        exp="The sequence contains: Blue, Red, Yellow, Purple, Green — 5 distinct colours. Red appeared twice (positions 2 and 5), but it's still counted only once when counting distinct colours. Total distinct colours = 5."
      />

      <SampleQ
        n="Q5.3" badge="Hard — 22 seconds"
        q="You saw 8 colours in 1.8 seconds: Blue → Red → Green → Yellow → Purple → Blue → Orange → Red. How many times did Blue appear?"
        opts={["1", "2", "3", "4"]}
        ans={1}
        exp="Blue appeared at position 1 and position 6 — a total of 2 times. With 8 colours flashed quickly, this requires holding the entire sequence in working memory and actively counting colour frequencies while the sequence is shown."
      />

      {/* ─── PROCESSING SPEED ─────────────────────────────── */}
      <DimHeader icon="⚡" n="06" name="Processing Speed"
        note="Fast and accurate — time limits range from 8 to 12 seconds. The challenge is not complexity but accuracy under pressure." />

      <SampleQ
        n="Q6.1" badge="Easy — 12 seconds"
        q="Which of the following exactly matches the target: 738291?"
        opts={["738921", "738219", "738291", "738912"]}
        ans={2}
        exp="Compare each character: 738291 vs 738921 (positions 4-5 swapped), 738219 (positions 5-6 differ), 738291 ✓ (exact match), 738912 (last 3 digits rearranged). Only option C matches exactly."
      />

      <SampleQ
        n="Q6.2" badge="Medium — 10 seconds"
        q="Solve quickly: 36 ÷ 4 + 7 = ?"
        opts={["15", "16", "17", "18"]}
        ans={1}
        exp="Following order of operations (BODMAS/PEMDAS): division before addition. 36 ÷ 4 = 9. Then 9 + 7 = 16. Under time pressure, the most common error is adding before dividing (36 ÷ 11 ≈ 3), getting a wrong answer."
      />

      <SampleQ
        n="Q6.3" badge="Hard — 8 seconds"
        q="Given: P < R < Q < T < S. Who is the 2nd smallest?"
        opts={["P", "Q", "R", "T"]}
        ans={2}
        exp="Order from smallest to largest: P (1st), R (2nd), Q (3rd), T (4th), S (5th). The 2nd smallest is R. Under the 8-second time limit, the key is to immediately translate the inequality chain into an ordered ranking rather than reading it character by character."
      />

      {/* CTA */}
      <div style={{
        marginTop: 48, padding: "28px", textAlign: "center",
        background: "rgba(0,85,255,0.06)", border: `1px solid ${blue2}`, borderRadius: 6,
      }}>
        <h3 style={{ fontSize: 20, fontWeight: 300, marginBottom: 10, color: "#D6E4FF" }}>
          Ready to try the real test?
        </h3>
        <p style={{ fontSize: 14, color: dim, marginBottom: 24 }}>
          30 unique questions · 6 dimensions · Calibrated scoring · Free result instantly
        </p>
        <a href="/test" style={{
          display: "inline-block", padding: "14px 32px",
          background: blue, color: "#fff", textDecoration: "none",
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", borderRadius: 2,
          boxShadow: "0 0 20px rgba(0,85,255,0.5)",
        }}>Start the Free Test</a>
      </div>
    </ContentShell>
  );
}
