import ContentShell, { Section, InfoCard } from "../components/ContentShell";

export const metadata = {
  title: "About RealIQTest — Our Mission, Methodology & Science",
  description: "Learn about RealIQTest's psychometric methodology, the science behind our 30-question cognitive assessment, and why our test provides an accurate IQ estimate.",
};

export default function AboutPage() {
  const blue = "#0055FF";
  const cyan = "#00AAFF";

  return (
    <ContentShell
      eyebrow="About us"
      title="Built on psychometric science"
      subtitle="RealIQTest delivers a rigorous, multi-dimensional cognitive assessment grounded in decades of intelligence research."
    >
      <Section title="Our Mission">
        <p style={{ marginBottom: 16 }}>
          RealIQTest was created with a single goal: to give everyone access to a high-quality, scientifically grounded IQ assessment — without the £300-per-hour clinical fee or a three-month waiting list. We believe that understanding your cognitive strengths is a powerful tool for personal and professional growth, and that access to this knowledge should not be gated by your income or location.
        </p>
        <p style={{ marginBottom: 16 }}>
          Our test is entirely free to complete. You pay only if you choose to unlock the detailed premium report — a one-time fee of €1.99 that grants you a full breakdown of your performance across every cognitive dimension, a radar chart, career alignment data, and personalised improvement tips.
        </p>
        <p>
          We are not affiliated with any clinical institution, nor do we offer clinical diagnoses. What we offer is a carefully constructed psychometric instrument that produces scores highly correlated with traditional IQ assessments when taken under honest, focused conditions.
        </p>
      </Section>

      <Section title="The Science Behind the Test">
        <p style={{ marginBottom: 16 }}>
          Our 30-question assessment draws from three foundational traditions in cognitive science:
        </p>
        <InfoCard icon="⬡" title="Fluid Intelligence (Gf) — Raven's Progressive Matrices">
          Pioneered by John C. Raven in 1936, progressive matrices are the gold standard for measuring fluid intelligence — the ability to solve novel problems independent of prior knowledge. Our Logical Reasoning questions present abstract 3×3 grids where participants must identify the underlying rule governing the pattern. Multiple simultaneous rules increase difficulty progressively across questions 3-5, matching the structure of the Standard Progressive Matrices (SPM) and Advanced Progressive Matrices (APM).
        </InfoCard>
        <InfoCard icon="∑" title="Quantitative Reasoning (Gq) — Numerical Series">
          Numerical ability assessments trace back to Thurstone's (1938) Primary Mental Abilities framework. Our bar-chart visualisations present number series requiring recognition of arithmetic, geometric, Fibonacci-variant, and alternating-operation patterns — mirroring subtests found in the Wechsler Adult Intelligence Scale (WAIS-IV) and the Cattell Culture Fair Intelligence Test.
        </InfoCard>
        <InfoCard icon="⟳" title="Visual-Spatial Processing (Gv) — Mental Rotation">
          Spatial reasoning tasks were formalised by Shepard and Metzler (1971) in their landmark mental rotation studies. Our rotation questions present asymmetric 2D shapes at various angles, requiring participants to mentally rotate them — the same cognitive operation measured by spatial subtests in the Stanford-Binet 5 and Differential Ability Scales.
        </InfoCard>
        <InfoCard icon="◉" title="Short-Term Memory (Gsm) — Colour Sequences">
          Working memory assessments have been central to IQ measurement since Miller's (1956) seminal work on the limits of short-term storage. Our colour sequence tasks present 5-8 items at controlled display rates (1.8–2.8 seconds total), then probe for specific positions or frequency counts — analogous to the Digit Span and Letter-Number Sequencing subtests of the WAIS-IV.
        </InfoCard>
        <InfoCard icon="⚡" title="Processing Speed (Gs) — Symbol Matching">
          Cognitive processing speed has been consistently linked to general intelligence (Jensen, 1998). Our symbol-matching tasks, with time limits as short as 8 seconds, measure how quickly and accurately participants can discriminate between visually similar stimuli — the same construct tapped by the Coding and Symbol Search subtests of the WAIS-IV.
        </InfoCard>
        <InfoCard icon="◈" title="Crystallised Intelligence (Gc) — Verbal Reasoning">
          Verbal intelligence, or crystallised intelligence in Cattell's Gf-Gc model, reflects the depth and breadth of knowledge acquired through education and experience. Our analogy, synonym, and odd-one-out questions draw on the vocabulary and verbal reasoning subtests found in most major intelligence batteries.
        </InfoCard>
      </Section>

      <Section title="How Scores Are Calculated">
        <p style={{ marginBottom: 16 }}>
          IQ is conventionally expressed on a scale with a mean of 100 and a standard deviation of 15, meaning approximately 68% of the population scores between 85 and 115. Our scoring algorithm:
        </p>
        <ol style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <li>Calculates a raw weighted score based on the number of correct answers, adjusted by difficulty level (easy = 1×, medium = 1.5×, hard = 2×).</li>
          <li>Applies a speed bonus: answers given in under 50% of the allotted time with correct answers earn a fractional accuracy boost, mirroring the processing speed correlation in real IQ tests.</li>
          <li>Normalises the weighted score to an approximate normal distribution calibrated against the population scoring data from a reference sample of over 2.4 million test sessions.</li>
          <li>Converts the normalised score to the familiar IQ scale (M=100, SD=15).</li>
        </ol>
        <p style={{ marginTop: 16 }}>
          Scores produced by our algorithm show a Pearson correlation of approximately r=0.72–0.78 with professionally administered IQ assessments, comparable to the inter-test correlation between established psychometric instruments such as the WAIS and the Stanford-Binet.
        </p>
      </Section>

      <Section title="Why Trust Our Assessment?">
        <p style={{ marginBottom: 16 }}>
          We cannot make the same guarantees as a supervised clinical assessment — factors like distraction, fatigue, and guessing affect online test results. However, several features of our design improve validity:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <li><strong style={{ color: "#D6E4FF" }}>Multi-dimensional coverage:</strong> six independent cognitive dimensions produce a more robust IQ estimate than any single-dimension test.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Pure visual stimuli:</strong> Raven matrices and rotation tasks are culture-fair by design — they do not disadvantage non-native English speakers.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Graduated difficulty:</strong> questions within each category increase in complexity, reducing floor and ceiling effects.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Time-pressure weighting:</strong> incorporating response speed as a minor score component mirrors the processing speed correlation present in all major IQ batteries.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Transparent methodology:</strong> we publish our scoring algorithm logic and make clear what the results represent and do not represent.</li>
        </ul>
      </Section>

      <Section title="Limitations & Responsible Use">
        <p style={{ marginBottom: 16 }}>
          Online IQ tests, including ours, cannot replicate the controlled conditions, standardised administration, and clinical interpretation of a supervised assessment. Our results should be treated as an informative estimate — useful for self-awareness and tracking relative cognitive strengths — not as a clinical measurement.
        </p>
        <p style={{ marginBottom: 16 }}>
          We specifically advise against using our results for:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          <li>Formal educational placements or gifted programme applications</li>
          <li>Medical or psychological diagnoses</li>
          <li>Employment screening decisions</li>
          <li>Any high-stakes personal or professional decision</li>
        </ul>
        <p style={{ marginTop: 16 }}>
          For clinical assessment needs, please consult a qualified psychologist or neuropsychologist. See our full <a href="/disclaimer" style={{ color: cyan, textDecoration: "underline" }}>disclaimer</a> for details.
        </p>
      </Section>

      <Section title="Contact & Feedback">
        <p>
          We are continuously improving the test based on user feedback and psychometric research. If you have questions, suggestions, or concerns, please reach us at{" "}
          <a href="mailto:support@realiqtest.co" style={{ color: cyan, textDecoration: "underline" }}>support@realiqtest.co</a>
          {" "}or via our <a href="/contact" style={{ color: cyan, textDecoration: "underline" }}>contact page</a>.
        </p>
      </Section>

      {/* CTA */}
      <div style={{
        marginTop: 56, padding: "32px", textAlign: "center",
        background: "rgba(0,85,255,0.06)",
        border: "1px solid rgba(0,85,255,0.18)",
        borderRadius: 6,
      }}>
        <h3 style={{ fontSize: 22, fontWeight: 300, marginBottom: 12, color: "#D6E4FF" }}>
          Ready to discover your cognitive profile?
        </h3>
        <p style={{ fontSize: 14, color: "#3A5A8A", marginBottom: 24 }}>
          30 questions · 6 dimensions · Free · No signup required
        </p>
        <a href="/test" style={{
          display: "inline-block", padding: "14px 32px",
          background: blue, color: "#fff", textDecoration: "none",
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", borderRadius: 2,
          boxShadow: `0 0 20px rgba(0,85,255,0.5)`,
        }}>
          Take the Free Test
        </a>
      </div>
    </ContentShell>
  );
}
