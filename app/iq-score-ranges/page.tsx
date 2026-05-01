import ContentShell, { Section, Table } from "../components/ContentShell";

export const metadata = {
  title: "IQ Score Ranges — What Does Your Score Mean? | RealIQTest",
  description: "Complete IQ score ranges table: below 70 to 130+. Understand what each IQ range means, population percentiles, famous examples, and see the bell curve distribution.",
};

/* Bell curve SVG — pure SVG Gaussian distribution with score marker */
function BellCurveChart({ markerIQ = 100 }: { markerIQ?: number }) {
  const W = 700, H = 220;
  const mean = 100, sd = 15;
  const xMin = 55, xMax = 145;

  function xToPixel(x: number) {
    return ((x - xMin) / (xMax - xMin)) * W;
  }
  function pdf(x: number) {
    const z = (x - mean) / sd;
    return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
  }

  const pdfMax = pdf(mean);
  const pdfScale = (H - 30) / pdfMax;

  function yToPixel(y: number) {
    return H - y * pdfScale;
  }

  // Generate curve points
  const points: [number, number][] = [];
  for (let x = xMin; x <= xMax; x += 0.5) {
    points.push([xToPixel(x), yToPixel(pdf(x))]);
  }
  const pathD = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  // Filled area up to marker
  const fillPoints: [number, number][] = [];
  for (let x = xMin; x <= Math.min(markerIQ, xMax); x += 0.5) {
    fillPoints.push([xToPixel(x), yToPixel(pdf(x))]);
  }
  const fillD = fillPoints.length > 1
    ? `${fillPoints.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ")} L${xToPixel(Math.min(markerIQ, xMax)).toFixed(1)},${H} L${xToPixel(xMin).toFixed(1)},${H} Z`
    : "";

  const markerX = xToPixel(markerIQ);
  const markerY = yToPixel(pdf(markerIQ));

  // Tick labels
  const ticks = [70, 85, 100, 115, 130];
  const bands = [
    { from: 55, to: 70,  label: "<70",      color: "#FF3B3B" },
    { from: 70, to: 85,  label: "70-84",    color: "#FF8C00" },
    { from: 85, to: 100, label: "85-99",    color: "#FFD700" },
    { from: 100, to: 115, label: "100-114", color: "#00D87A" },
    { from: 115, to: 130, label: "115-129", color: "#00AAFF" },
    { from: 130, to: 145, label: "130+",    color: "#0055FF" },
  ];

  return (
    <div style={{ overflowX: "auto", marginBottom: 32 }}>
      <svg viewBox={`0 0 ${W} ${H + 30}`} style={{ width: "100%", maxWidth: W, display: "block" }} aria-label="IQ score bell curve distribution">
        {/* Band backgrounds */}
        {bands.map((b, i) => (
          <rect
            key={i}
            x={xToPixel(b.from)} y={0}
            width={xToPixel(b.to) - xToPixel(b.from)} height={H}
            fill={b.color} opacity="0.06"
          />
        ))}

        {/* Filled area below marker */}
        {fillD && <path d={fillD} fill="rgba(0,85,255,0.18)" />}

        {/* Curve */}
        <path d={pathD} fill="none" stroke="#0055FF" strokeWidth="2.5" />
        <path d={`${pathD} L${xToPixel(xMax)},${H} L${xToPixel(xMin)},${H} Z`} fill="rgba(0,85,255,0.06)" />

        {/* Vertical tick lines */}
        {ticks.map(t => (
          <line key={t} x1={xToPixel(t)} y1={0} x2={xToPixel(t)} y2={H}
            stroke="rgba(0,85,255,0.20)" strokeWidth="1" strokeDasharray="4,4" />
        ))}

        {/* Tick labels */}
        {ticks.map(t => (
          <text key={t} x={xToPixel(t)} y={H + 18} textAnchor="middle"
            fill="#3A5A8A" fontSize="11" fontFamily="monospace">{t}</text>
        ))}

        {/* Marker */}
        {markerIQ >= xMin && markerIQ <= xMax && (
          <>
            <line x1={markerX} y1={markerY} x2={markerX} y2={H}
              stroke="#00AAFF" strokeWidth="1.5" strokeDasharray="5,3" />
            <circle cx={markerX} cy={markerY} r="5" fill="#00AAFF"
              style={{ filter: "drop-shadow(0 0 6px rgba(0,170,255,0.8))" }} />
            <text x={markerX} y={markerY - 12} textAnchor="middle"
              fill="#00AAFF" fontSize="11" fontFamily="monospace" fontWeight="600">
              You
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

export default function IQScoreRangesPage() {
  const blue = "#0055FF";
  const cyan = "#00AAFF";

  const RANGES = [
    {
      range: "130 +", label: "Very Superior", pct: "~2.3%", percentile: "Top 2%",
      color: blue, glow: "rgba(0,85,255,0.5)",
      desc: "Scores in this range indicate exceptional cognitive ability across multiple domains. Individuals in this range often excel in highly complex fields — theoretical physics, advanced mathematics, competitive law, medical research, and other domains requiring rapid synthesis of complex information.",
      famous: "Often associated with Nobel laureates, chess grandmasters, elite academics, and many successful entrepreneurs in technically demanding industries.",
      note: "Only 1 in 44 people score in this range. Tests become less precise at extremes due to ceiling effects — very high scorers are better assessed by specialised high-range tests.",
    },
    {
      range: "120 – 129", label: "Superior", pct: "~6.7%", percentile: "Top 9%",
      color: "#3B80FF", glow: "rgba(59,128,255,0.4)",
      desc: "Superior intelligence indicates strong performance across most cognitive domains. This range is associated with academic success at the graduate and postgraduate level, and strong professional performance in intellectually demanding careers.",
      famous: "Typical range for many professionals in medicine, law, engineering, and science. Strong performers in business strategy and management consulting.",
      note: "Approximately 1 in 14 people score in this range — uncommon, but not rare.",
    },
    {
      range: "110 – 119", label: "High Average", pct: "~16.1%", percentile: "Top 25%",
      color: "#00AAFF", glow: "rgba(0,170,255,0.4)",
      desc: "High average intelligence reflects above-average cognitive ability across the board. This range is associated with success in a wide range of professional and academic contexts, including most bachelor's-level degree programmes and many graduate programmes.",
      famous: "Broadly associated with university-educated professionals across many fields — teachers, managers, accountants, journalists, nurses, and skilled tradespeople.",
      note: "This range represents the top quarter of the population — a meaningful above-average score.",
    },
    {
      range: "90 – 109", label: "Average", pct: "~50%", percentile: "25th – 75th",
      color: "#00D87A", glow: "rgba(0,216,122,0.4)",
      desc: "The average range contains fully half of the population. Scores in this range indicate typical cognitive functioning — sufficient for the vast majority of everyday tasks, most educational and vocational paths, and a rich, productive life. IQ is one of many factors in success, and average cognitive ability combined with strong motivation, emotional intelligence, and practical skills frequently outperforms higher IQ without those traits.",
      famous: "The average range includes most people across most walks of life. IQ alone is a poor predictor of success, wellbeing, or happiness in this range.",
      note: "An average IQ does not mean average potential. Conscientiousness, emotional intelligence, and grit predict life outcomes more than IQ in this range.",
    },
    {
      range: "80 – 89", label: "Low Average", pct: "~16.1%", percentile: "Bottom 25%",
      color: "#FFD700", glow: "rgba(255,215,0,0.4)",
      desc: "Scores in this range may indicate some difficulties with complex academic work, but the vast majority of people in this range function entirely independently and hold productive careers across many fields. Many factors beyond IQ determine life outcomes.",
      famous: null,
      note: "Online test scores in this range should be interpreted cautiously — anxiety, fatigue, or distraction during an online test can significantly deflate scores.",
    },
    {
      range: "70 – 79", label: "Borderline", pct: "~6.7%", percentile: "Bottom 9%",
      color: "#FF8C00", glow: "rgba(255,140,0,0.4)",
      desc: "Scores in this range fall between average and what is clinically classified as intellectual disability. A single online test score in this range is not diagnostic — it should be confirmed with formal, professionally administered assessment before drawing any conclusions.",
      famous: null,
      note: "If a professional assessment is needed, please consult a clinical psychologist. Online tests cannot diagnose intellectual disability.",
    },
    {
      range: "Below 70", label: "Extremely Low", pct: "~2.3%", percentile: "Bottom 2%",
      color: "#FF3B3B", glow: "rgba(255,59,59,0.4)",
      desc: "Scores below 70 on a professionally administered test are associated with intellectual disability in clinical classification systems (DSM-5, ICD-11). However, online test scores below 70 frequently reflect poor testing conditions rather than true cognitive limitations.",
      famous: null,
      note: "This range requires formal clinical assessment by a qualified psychologist. Online test results cannot and should not be used for clinical or educational purposes.",
    },
  ];

  return (
    <ContentShell
      eyebrow="Reference guide"
      title="IQ Score Ranges"
      subtitle="What does your IQ score actually mean? A complete breakdown of every IQ range, its population frequency, and what it indicates about cognitive ability."
      maxWidth={860}
    >
      {/* Bell curve */}
      <Section title="The Bell Curve Distribution">
        <p style={{ marginBottom: 20 }}>
          IQ scores follow a normal distribution: most people cluster around 100, with progressively fewer people at the extremes. The graph below shows this distribution. Your score marker (shown in cyan) indicates where your score falls relative to the population.
        </p>
        <BellCurveChart markerIQ={115} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {[
            { label: "Below 70", color: "#FF3B3B" },
            { label: "70–84", color: "#FF8C00" },
            { label: "85–99", color: "#FFD700" },
            { label: "100–114", color: "#00D87A" },
            { label: "115–129", color: "#00AAFF" },
            { label: "130+", color: "#0055FF" },
          ].map(b => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: b.color }} />
              <span style={{ color: "#3A5A8A" }}>{b.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Quick reference table */}
      <Section title="Quick Reference Table">
        <Table
          headers={["IQ Score", "Classification", "Population %", "Percentile"]}
          rows={RANGES.map(r => [
            <span key="r" style={{ color: r.color, fontWeight: 500 }}>{r.range}</span>,
            r.label,
            r.pct,
            r.percentile,
          ])}
        />
      </Section>

      {/* Detailed breakdown */}
      <Section title="Detailed Range Breakdown">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {RANGES.map((r, i) => (
            <div key={i} style={{
              padding: "20px 24px",
              background: "rgba(3,10,30,0.85)",
              border: `1px solid ${r.color}30`,
              borderLeft: `3px solid ${r.color}`,
              borderRadius: 6,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 20, fontWeight: 300, color: r.color }}>{r.range}</span>
                  <span style={{ fontSize: 13, color: "#8AAAD0", marginLeft: 12 }}>{r.label}</span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, padding: "3px 10px", background: `${r.color}15`, color: r.color, borderRadius: 2 }}>{r.pct} of population</span>
                  <span style={{ fontSize: 11, padding: "3px 10px", background: "rgba(0,85,255,0.10)", color: "#3A5A8A", borderRadius: 2 }}>{r.percentile}</span>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "#8AAAD0", lineHeight: 1.75, marginBottom: r.famous || r.note ? 10 : 0 }}>{r.desc}</p>
              {r.famous && <p style={{ fontSize: 13, color: "#3A5A8A", lineHeight: 1.65, marginBottom: r.note ? 8 : 0 }}><strong style={{ color: "#5A78B0" }}>Context:</strong> {r.famous}</p>}
              {r.note && <p style={{ fontSize: 12, color: "#2A4060", lineHeight: 1.6, fontStyle: "italic" }}>{r.note}</p>}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Important Caveats">
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <li>IQ score ranges are <strong style={{ color: "#D6E4FF" }}>descriptive, not prescriptive</strong>. They describe group averages, not individual destinies.</li>
          <li>Online tests, including ours, have a <strong style={{ color: "#D6E4FF" }}>measurement error of ±8–15 points</strong>. Your true score likely falls within a range around your result.</li>
          <li>IQ measures a subset of cognitive abilities. <strong style={{ color: "#D6E4FF" }}>Emotional intelligence, creativity, practical wisdom, and character</strong> are not captured.</li>
          <li>IQ scores are <strong style={{ color: "#D6E4FF" }}>not fully fixed</strong>. Lifestyle, education, and cognitive training all influence cognitive performance over time.</li>
          <li>Never make major life decisions solely based on an online IQ score. For clinical purposes, consult a qualified psychologist.</li>
        </ul>
      </Section>

      <div style={{ marginTop: 40, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <a href="/what-is-iq" style={{ padding: "12px 24px", background: "rgba(0,85,255,0.12)", border: "1px solid rgba(0,85,255,0.30)", color: cyan, textDecoration: "none", borderRadius: 4, fontSize: 13 }}>What is IQ? →</a>
        <a href="/how-to-improve-iq" style={{ padding: "12px 24px", background: "rgba(0,85,255,0.12)", border: "1px solid rgba(0,85,255,0.30)", color: cyan, textDecoration: "none", borderRadius: 4, fontSize: 13 }}>How to Improve →</a>
        <a href="/test" style={{ padding: "12px 24px", background: blue, color: "#fff", textDecoration: "none", borderRadius: 4, fontSize: 13, boxShadow: "0 0 16px rgba(0,85,255,0.45)" }}>Take the Test →</a>
      </div>
    </ContentShell>
  );
}
