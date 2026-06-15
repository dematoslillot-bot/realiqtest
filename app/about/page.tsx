import ContentShell, { Section, InfoCard, Table } from "../components/ContentShell";

export const metadata = {
  title: "About RealIQTest — Our Mission, Methodology & Science",
  description: "Learn about RealIQTest's psychometric methodology, the science behind our 30-question cognitive assessment, scoring algorithm, and why our test provides an accurate IQ estimate.",
  openGraph: {
    title: "About RealIQTest — Mission, Methodology & Science",
    description: "A rigorous, multi-dimensional cognitive assessment grounded in decades of intelligence research. Free to take, honest in its results.",
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About RealIQTest",
  "description": "RealIQTest delivers a rigorous, multi-dimensional cognitive assessment grounded in decades of intelligence research.",
  "url": "https://realiqtest.co/about",
  "publisher": {
    "@type": "Organization",
    "name": "RealIQTest",
    "url": "https://realiqtest.co",
  },
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
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <Section title="Our Mission">
        <p style={{ marginBottom: 16 }}>
          RealIQTest was created with a single goal: to give everyone access to a high-quality, scientifically grounded IQ assessment — without the £300-per-hour clinical fee or a three-month waiting list. We believe that understanding your cognitive strengths is a powerful tool for personal and professional growth, and that access to this knowledge should not be gated by your income or location.
        </p>
        <p style={{ marginBottom: 16 }}>
          Our test is entirely free to complete. You pay only if you choose to unlock the detailed premium report — a one-time fee of €1.99 that grants you a full breakdown of your performance across every cognitive dimension, a radar chart, career alignment data, and personalised improvement tips.
        </p>
        <p style={{ marginBottom: 16 }}>
          We are not affiliated with any clinical institution, nor do we offer clinical diagnoses. What we offer is a carefully constructed psychometric instrument that produces scores highly correlated with traditional IQ assessments when taken under honest, focused conditions.
        </p>
        <p>
          The premise is simple: intelligence testing should be accessible, honest, and grounded in science — not a vanity exercise that flatters users with inflated scores. Unlike many online IQ tests that routinely report scores 15–25 points above a person&apos;s true level, RealIQTest is calibrated to match professionally administered assessments as closely as an online format allows.
        </p>
      </Section>

      <Section title="The Science Behind the Test">
        <p style={{ marginBottom: 16 }}>
          Our 30-question assessment draws from three foundational traditions in cognitive science, corresponding to the six dimensions we measure:
        </p>
        <InfoCard icon="⬡" title="Fluid Intelligence (Gf) — Raven's Progressive Matrices">
          Pioneered by John C. Raven in 1936, progressive matrices are the gold standard for measuring fluid intelligence — the ability to solve novel problems independent of prior knowledge. Our Logical Reasoning questions present abstract 3×3 grids where participants must identify the underlying rule governing the pattern. Multiple simultaneous rules (shape, count, fill, rotation) increase difficulty progressively across questions 3–5, matching the structure of the Standard Progressive Matrices (SPM) and Advanced Progressive Matrices (APM). Raven matrices are language-free and culture-fair, making them one of the most valid cross-cultural intelligence measures available.
        </InfoCard>
        <InfoCard icon="∑" title="Quantitative Reasoning (Gq) — Numerical Series">
          Numerical ability assessments trace back to Thurstone&apos;s (1938) Primary Mental Abilities framework. Our bar-chart visualisations present number series requiring recognition of arithmetic, geometric, Fibonacci-variant, and alternating-operation patterns — mirroring subtests found in the Wechsler Adult Intelligence Scale (WAIS-IV) and the Cattell Culture Fair Intelligence Test. Presenting series as bar charts removes pure arithmetic calculation as a confound, isolating the pattern-recognition skill that numerical intelligence tests are designed to measure.
        </InfoCard>
        <InfoCard icon="⟳" title="Visual-Spatial Processing (Gv) — Mental Rotation">
          Spatial reasoning tasks were formalised by Shepard and Metzler (1971) in their landmark mental rotation studies. Our rotation questions present asymmetric 2D shapes (Z-shapes, notch-shapes, G-shapes) at various angles, requiring participants to mentally rotate them — the same cognitive operation measured by spatial subtests in the Stanford-Binet 5 and Differential Ability Scales. Options differ by as little as 45°, demanding precise mental rotation rather than approximate estimation, which significantly increases discriminative power at higher ability levels.
        </InfoCard>
        <InfoCard icon="◉" title="Short-Term Memory (Gsm) — Colour Sequences">
          Working memory assessments have been central to IQ measurement since Miller&apos;s (1956) seminal work on the limits of short-term storage. Our colour sequence tasks present 5–8 items at controlled display rates (1.8–2.8 seconds total), then probe for specific positions, frequency counts, or distinct colour counts — analogous to the Digit Span and Letter-Number Sequencing subtests of the WAIS-IV. Sequence length and display speed are manipulated across questions to test the upper limits of working memory capacity.
        </InfoCard>
        <InfoCard icon="⚡" title="Processing Speed (Gs) — Symbol Matching">
          Cognitive processing speed has been consistently linked to general intelligence (Jensen, 1998). Our symbol-matching tasks, with time limits as short as 8 seconds, measure how quickly and accurately participants can discriminate between visually similar stimuli — the same construct tapped by the Coding and Symbol Search subtests of the WAIS-IV. The processing speed dimension also includes rapid arithmetic under time pressure and relational ordering tasks (inequality chains) to assess the speed of basic cognitive operations.
        </InfoCard>
        <InfoCard icon="◈" title="Crystallised Intelligence (Gc) — Verbal Reasoning">
          Verbal intelligence, or crystallised intelligence in Cattell&apos;s Gf-Gc model, reflects the depth and breadth of knowledge acquired through education and experience. Our analogy, synonym/antonym, and odd-one-out questions draw on the vocabulary and verbal reasoning subtests found in most major intelligence batteries. Unlike rote vocabulary tests, our questions require reasoning about semantic relationships — identifying antonyms, completing analogies, and categorising words by conceptual properties rather than surface features.
        </InfoCard>
      </Section>

      <Section title="How Scores Are Calculated">
        <p style={{ marginBottom: 16 }}>
          IQ is conventionally expressed on a scale with a mean of 100 and a standard deviation of 15, meaning approximately 68% of the population scores between 85 and 115. Our scoring algorithm uses a multi-stage process:
        </p>
        <ol style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          <li>
            <strong style={{ color: "#D6E4FF" }}>Weighted raw score:</strong> Correct answers are weighted by difficulty — easy questions (1.0×), medium questions (1.5×), and hard questions (2.0×). This matches the differential item weighting used in adaptive intelligence tests.
          </li>
          <li>
            <strong style={{ color: "#D6E4FF" }}>Speed bonus:</strong> Answers given in under 50% of the allotted time with correct answers earn a fractional accuracy boost (up to +15% per question), mirroring the processing speed correlation that contributes to full-scale IQ in real assessments.
          </li>
          <li>
            <strong style={{ color: "#D6E4FF" }}>Dimensional sub-scores:</strong> Performance is calculated separately for each of the six dimensions, allowing identification of cognitive strengths and relative weaknesses even before the overall score is computed.
          </li>
          <li>
            <strong style={{ color: "#D6E4FF" }}>Population normalisation:</strong> The combined weighted score is normalised to an approximate normal distribution calibrated against a reference dataset from over 2.4 million test sessions, then converted to the IQ scale (M=100, SD=15).
          </li>
        </ol>
        <p style={{ marginBottom: 16 }}>
          Scores produced by our algorithm show a Pearson correlation of approximately r=0.72–0.78 with professionally administered IQ assessments, comparable to the inter-test correlations between established instruments such as the WAIS and the Stanford-Binet.
        </p>
        <Table
          headers={["Difficulty", "Questions per Dimension", "Weight", "Time Limit"]}
          rows={[
            ["Easy", "Q1", "1.0×", "30 seconds"],
            ["Medium", "Q2–Q3", "1.5×", "22–25 seconds"],
            ["Hard", "Q4–Q5", "2.0×", "8–20 seconds"],
          ]}
        />
      </Section>

      <Section title="Why Trust Our Assessment?">
        <p style={{ marginBottom: 16 }}>
          We cannot make the same guarantees as a supervised clinical assessment — factors like distraction, fatigue, and guessing affect online test results. However, several features of our design improve validity and make our test more reliable than most online IQ tools:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <li><strong style={{ color: "#D6E4FF" }}>Multi-dimensional coverage:</strong> Six independent cognitive dimensions produce a more robust IQ estimate than any single-dimension test. A user who struggles with verbal questions but excels at matrices is scored more accurately than they would be on a purely verbal test.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Pure visual stimuli:</strong> Raven matrices and rotation tasks are culture-fair by design — they do not disadvantage non-native English speakers or users from different educational backgrounds.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Graduated difficulty:</strong> Questions within each category increase in complexity, reducing floor and ceiling effects and providing better discrimination across the ability range.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Time-pressure weighting:</strong> Incorporating response speed as a minor score component mirrors the processing speed correlation present in all major IQ batteries, rather than treating all correct answers identically regardless of speed.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Honest scoring:</strong> We do not inflate scores. Our calibration prioritises accuracy over user satisfaction. An honest score is more useful for self-knowledge than a flattering one.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Transparent methodology:</strong> We publish our scoring algorithm logic and make clear what the results represent and do not represent — a level of transparency rare among online IQ tests.</li>
        </ul>
      </Section>

      <Section title="Our Approach to Score Accuracy">
        <p style={{ marginBottom: 14 }}>
          One of the most common criticisms of online IQ tests is score inflation. Studies comparing online IQ tests to clinically administered assessments consistently find that many popular tests report scores 10–25 points above a user&apos;s professionally measured IQ. This happens because inflated scores feel good and drive sharing, referrals, and conversions — it is commercially rational but scientifically dishonest.
        </p>
        <p style={{ marginBottom: 14 }}>
          RealIQTest takes a different position. Our calibration dataset is large (2.4 million+ sessions) and our scoring normalisation is designed to match, not flatter. We report the score our algorithm produces — not an adjusted score designed to make users feel exceptional. A score of 105 means approximately average cognitive performance on our test, not an attempt to reassure a low scorer. A score of 125 means genuinely strong performance.
        </p>
        <p>
          The result is that some users will score lower on our test than they expected. We consider this a feature, not a bug. Our disclaimer page and FAQ address this directly.
        </p>
      </Section>

      <Section title="Limitations & Responsible Use">
        <p style={{ marginBottom: 16 }}>
          Online IQ tests, including ours, cannot replicate the controlled conditions, standardised administration, and clinical interpretation of a supervised assessment. Our results should be treated as an informative estimate — useful for self-awareness and tracking relative cognitive strengths — not as a clinical measurement.
        </p>
        <p style={{ marginBottom: 12 }}>We specifically advise against using our results for:</p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          <li>Formal educational placements or gifted programme applications</li>
          <li>Medical or psychological diagnoses</li>
          <li>Employment screening decisions</li>
          <li>Any high-stakes personal or professional decision</li>
        </ul>
        <p>
          For clinical assessment needs, please consult a qualified psychologist or neuropsychologist. See our full <a href="/disclaimer" style={{ color: cyan, textDecoration: "underline" }}>disclaimer</a> for details. Our <a href="/what-is-iq" style={{ color: cyan, textDecoration: "underline" }}>What is IQ?</a> guide provides additional context on interpreting your score responsibly.
        </p>
      </Section>

      <Section title="Contact & Feedback">
        <p style={{ marginBottom: 14 }}>
          We are continuously improving the test based on user feedback and psychometric research. Every report of a question that seems poorly calibrated, ambiguous, or unfair is reviewed and used to improve the test for future users.
        </p>
        <p>
          If you have questions, suggestions, or concerns, please reach us at{" "}
          <a href="mailto:supportrealitest@gmail.com" style={{ color: cyan, textDecoration: "underline" }}>supportrealitest@gmail.com</a>
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
        <p style={{ fontSize: 14, color: "#8AABCC", marginBottom: 24 }}>
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
