import ContentShell, { Section, InfoCard } from "../components/ContentShell";

export const metadata = {
  title: "The 6 Cognitive Dimensions Measured by RealIQTest",
  description: "Detailed explanation of the six cognitive dimensions in RealIQTest: Logical Reasoning, Verbal Intelligence, Spatial Reasoning, Numerical Ability, Working Memory, and Processing Speed.",
  openGraph: {
    title: "The 6 Cognitive Dimensions of Intelligence — RealIQTest",
    description: "What each cognitive dimension is, how we measure it, and why it matters for real-world performance.",
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The 6 Cognitive Dimensions Measured by RealIQTest",
  "description": "Detailed guide to Logical Reasoning, Verbal Intelligence, Spatial Reasoning, Numerical Ability, Working Memory, and Processing Speed.",
  "url": "https://realiqtest.co/cognitive-dimensions",
  "author": { "@type": "Organization", "name": "RealIQTest" },
  "publisher": { "@type": "Organization", "name": "RealIQTest", "url": "https://realiqtest.co" },
  "datePublished": "2026-05-01",
  "dateModified": "2026-05-03",
};

export default function CognitiveDimensionsPage() {
  const blue = "#0055FF";
  const cyan = "#00AAFF";
  const blue2 = "rgba(0,85,255,0.18)";

  const DIMS = [
    {
      icon: "⬡",
      n: "01",
      name: "Logical Reasoning",
      badge: "Fluid Intelligence (Gf)",
      color: blue,
      desc: `Logical reasoning — also called abstract reasoning or fluid intelligence — is your ability to identify patterns, rules, and relationships in novel, abstract information. It operates independently of language, culture, or prior knowledge, making it one of the most culturally unbiased measures of raw cognitive ability.`,
      how: `Our logical reasoning questions use Raven-style progressive matrices: 3×3 grids of abstract shapes where one cell is missing. You must identify the rule (or rules) governing the pattern — shape type, count, fill, size, or rotation — and select the cell that completes the matrix. Questions 3-5 involve multiple simultaneous rules, significantly increasing difficulty.`,
      why: `Fluid intelligence correlates more strongly with overall IQ than any other single dimension. It predicts performance in engineering, mathematics, programming, scientific research, law, and strategic planning. It is also the cognitive capacity most closely associated with the ability to learn new skills quickly.`,
      examples: ["Air traffic controllers", "Software architects", "Chess grandmasters", "Theoretical physicists", "Surgeons"],
    },
    {
      icon: "◈",
      n: "02",
      name: "Verbal Intelligence",
      badge: "Crystallised Intelligence (Gc)",
      color: cyan,
      desc: `Verbal intelligence reflects the depth and breadth of vocabulary, the ability to understand complex sentence structures, and the capacity to reason about relationships between concepts expressed in language. Unlike fluid intelligence, verbal intelligence is closely tied to education, reading habits, and cultural exposure.`,
      how: `Our verbal questions include word analogies (Light:Dark :: Hot:?), synonyms and antonyms, and odd-one-out categorisation tasks. These measure vocabulary range, understanding of conceptual relationships, and the ability to categorise words by semantic properties rather than surface features.`,
      why: `Verbal intelligence is one of the strongest predictors of academic achievement, particularly in subjects requiring reading comprehension, argumentation, and written expression. It is also highly correlated with social intelligence — the ability to understand and communicate complex ideas clearly to others.`,
      examples: ["Lawyers and barristers", "Journalists and writers", "Psychiatrists and counsellors", "Politicians and diplomats", "University lecturers"],
    },
    {
      icon: "⟳",
      n: "03",
      name: "Spatial Reasoning",
      badge: "Visual-Spatial Processing (Gv)",
      color: blue,
      desc: `Spatial reasoning is the ability to mentally manipulate, rotate, and transform two-dimensional and three-dimensional objects. It encompasses understanding spatial relationships between objects, navigating environments, and visualising how shapes change when viewed from different angles or positions.`,
      how: `Our spatial questions present asymmetric 2D shapes (arrows, Z-shapes, notch-shapes, complex polygons) at a specific angle, and ask you to identify which option shows the shape rotated by a given amount — or to reverse-rotate to find the original orientation. Options differ by as little as 45°, demanding precise mental rotation.`,
      why: `Spatial ability is one of the most practically useful cognitive capacities in STEM fields. It strongly predicts performance in engineering design, architecture, surgery, dentistry, mathematics, and physics. Spatial ability also predicts success in the visual arts, sculpture, and navigation.`,
      examples: ["Architects and designers", "Mechanical engineers", "Surgeons and dentists", "Pilots and navigators", "Sculptors and 3D artists"],
    },
    {
      icon: "∑",
      n: "04",
      name: "Numerical Ability",
      badge: "Quantitative Reasoning (Gq)",
      color: cyan,
      desc: `Numerical ability refers to the capacity to identify patterns in numbers, understand quantitative relationships, and reason about mathematical structures — including arithmetic progressions, geometric series, Fibonacci sequences, and algebraic rules.`,
      how: `Our numerical questions visualise number series as bar charts, where one bar is missing. You must identify the underlying rule — doubling, alternating operations (×3 then ÷1.5), modified Fibonacci, or exponential growth (2ⁿ-1) — and select the correct value. The visual presentation removes pure arithmetic as a barrier, focusing on pattern recognition.`,
      why: `Numerical reasoning ability is strongly predictive of performance in finance, data science, accounting, economics, and scientific research. It is also a key predictor of everyday numeracy — the ability to make sound financial decisions, understand statistics, and evaluate quantitative claims.`,
      examples: ["Data scientists and analysts", "Financial traders", "Actuaries", "Economists", "Research scientists"],
    },
    {
      icon: "◉",
      n: "05",
      name: "Working Memory",
      badge: "Short-Term Memory (Gsm)",
      color: blue,
      desc: `Working memory is the cognitive system responsible for temporarily holding and manipulating information in conscious awareness. It is the mental workspace — sometimes described as the brain's RAM — where you hold information while using it to complete a task. Working memory capacity is strongly associated with attention, learning, and complex reasoning.`,
      how: `Our working memory questions flash a sequence of 5–8 coloured circles on screen for 1.8–2.8 seconds total. When the sequence disappears, you must answer questions about specific positions (2nd colour? last colour?), frequency counts (how many times did blue appear?), or the number of distinct colours. Questions 4 and 5 use longer sequences with shorter display times.`,
      why: `Working memory is one of the most powerful predictors of academic and professional performance, particularly in tasks requiring the simultaneous processing of multiple streams of information — such as comprehension of complex texts, mental arithmetic, following multi-step instructions, or managing multiple projects.`,
      examples: ["Air traffic controllers", "Emergency room doctors", "Project managers", "Musicians (sight-reading)", "Simultaneous interpreters"],
    },
    {
      icon: "⚡",
      n: "06",
      name: "Processing Speed",
      badge: "Cognitive Speed (Gs)",
      color: cyan,
      desc: `Processing speed refers to how quickly and accurately the brain can perform simple cognitive operations — recognising patterns, comparing stimuli, and making decisions. It represents cognitive efficiency: how smoothly and automatically information flows through the neural system.`,
      how: `Our processing speed questions include string-matching tasks (finding exact duplicates among near-identical alphanumeric strings), rapid arithmetic under 10-second time limits, and ordering problems under 8-second limits. The difficulty lies not in the complexity of individual operations but in executing them accurately under intense time pressure.`,
      why: `Processing speed correlates strongly with overall IQ and brain myelination (the insulation of neural pathways). It declines more noticeably with age than other cognitive capacities, making it a useful clinical marker. It also predicts real-world performance in any fast-paced environment — trading floors, emergency medicine, competitive gaming, and athletic decision-making.`,
      examples: ["Day traders", "eSports athletes", "Emergency responders", "Formula 1 drivers", "Professional athletes"],
    },
  ];

  return (
    <ContentShell
      eyebrow="Science"
      title="The 6 Cognitive Dimensions"
      subtitle="RealIQTest measures six independent facets of intelligence. Here is what each one is, how we measure it, and why it matters."
      maxWidth={860}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      {/* Overview grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 1, background: blue2, marginBottom: 56, borderRadius: 4, overflow: "hidden",
      }}>
        {DIMS.map((d, i) => (
          <div key={i} style={{ background: "#03050F", padding: "20px 18px", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{d.icon}</div>
            <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: d.color, marginBottom: 4 }}>{d.n}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#D6E4FF" }}>{d.name}</div>
            <div style={{ fontSize: 11, color: "#8AABCC", marginTop: 4 }}>{d.badge}</div>
          </div>
        ))}
      </div>

      {/* Detailed sections */}
      {DIMS.map((d, i) => (
        <div key={i} style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(0,85,255,0.12)", border: `1px solid ${d.color}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, flexShrink: 0,
            }}>{d.icon}</div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: d.color, marginBottom: 2 }}>Dimension {d.n} · {d.badge}</div>
              <h2 style={{ fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 400, color: "#D6E4FF", letterSpacing: "-0.01em" }}>{d.name}</h2>
            </div>
          </div>

          <div style={{ borderLeft: `2px solid ${d.color}30`, paddingLeft: 24 }}>
            <InfoCard icon="📖" title="What it is">
              <p>{d.desc}</p>
            </InfoCard>
            <InfoCard icon="🧪" title="How we measure it">
              <p>{d.how}</p>
            </InfoCard>
            <InfoCard icon="💡" title="Why it matters">
              <p style={{ marginBottom: 12 }}>{d.why}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {d.examples.map((ex, j) => (
                  <span key={j} style={{
                    fontSize: 11, padding: "3px 10px",
                    background: `${d.color}15`, border: `1px solid ${d.color}30`,
                    borderRadius: 2, color: d.color === blue ? "#7AC0FF" : "#00CCFF",
                  }}>{ex}</span>
                ))}
              </div>
            </InfoCard>
          </div>
        </div>
      ))}

      <div style={{
        marginTop: 24, padding: "28px", textAlign: "center",
        background: "rgba(0,85,255,0.06)", border: `1px solid ${blue2}`, borderRadius: 6,
      }}>
        <h3 style={{ fontSize: 20, fontWeight: 300, marginBottom: 10, color: "#D6E4FF" }}>
          Find your cognitive strengths
        </h3>
        <p style={{ fontSize: 14, color: "#8AABCC", marginBottom: 20 }}>
          Take the free 30-question test to see your score across all 6 dimensions.
        </p>
        <a href="/test" style={{
          display: "inline-block", padding: "13px 30px",
          background: blue, color: "#fff", textDecoration: "none",
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", borderRadius: 2,
          boxShadow: "0 0 18px rgba(0,85,255,0.5)",
        }}>Take the Free Test</a>
      </div>
    </ContentShell>
  );
}
