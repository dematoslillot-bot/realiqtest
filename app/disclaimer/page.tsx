import ContentShell, { Section } from "../components/ContentShell";

export const metadata = {
  title: "Disclaimer — RealIQTest",
  description: "Important disclaimer: RealIQTest is an informational cognitive assessment tool and is not a clinical diagnostic instrument. Read our full disclaimer before using results.",
};

const LAST_UPDATED = "1 May 2026";

export default function DisclaimerPage() {
  const cyan = "#00AAFF";

  return (
    <ContentShell
      eyebrow="Legal"
      title="Disclaimer"
      subtitle={`Last updated: ${LAST_UPDATED}`}
    >
      <Section title="1. Nature of the Assessment">
        <p style={{ marginBottom: 14 }}>
          RealIQTest provides an online cognitive assessment tool (&quot;the test&quot;) designed to give users an approximate estimate of their cognitive abilities across six dimensions: Logical Reasoning, Verbal Intelligence, Spatial Reasoning, Numerical Ability, Working Memory, and Processing Speed.
        </p>
        <p style={{ marginBottom: 14 }}>
          The test and all associated results, reports, scores, and percentile rankings are provided <strong style={{ color: "#D6E4FF" }}>for informational and educational purposes only</strong>. They are not a substitute for, and should not be interpreted as, a formal psychological assessment, psychometric evaluation, neuropsychological examination, or clinical diagnosis of any kind.
        </p>
        <p>
          All scores produced by the RealIQTest algorithm are <strong style={{ color: "#D6E4FF" }}>estimates</strong>. They represent our best approximation of cognitive performance under unsupervised online conditions and have not been independently validated against a stratified normative sample using clinical administration procedures.
        </p>
      </Section>

      <Section title="2. Not a Clinical Tool">
        <p style={{ marginBottom: 14 }}>
          RealIQTest is <strong style={{ color: "#D6E4FF" }}>not a clinically validated psychometric instrument</strong>. Our test has not been submitted to peer-reviewed validation studies, is not registered with any professional psychological association, and is not intended to replicate or replace any standardised intelligence battery such as the Wechsler Adult Intelligence Scale (WAIS-IV), Stanford-Binet Intelligence Scales (SB-5), or Raven&apos;s Standard Progressive Matrices.
        </p>
        <p>
          Results should <strong style={{ color: "#D6E4FF" }}>not</strong> be used for:
        </p>
        <ul style={{ marginTop: 10, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          <li>Diagnosing or screening for intellectual disability, learning difficulties, ADHD, or any other medical or psychological condition</li>
          <li>Educational placement decisions, including gifted and talented programmes</li>
          <li>Employment screening, hiring, or promotion decisions</li>
          <li>Legal or forensic proceedings</li>
          <li>Clinical treatment planning or therapeutic decision-making</li>
          <li>Any high-stakes personal, academic, or professional decision</li>
        </ul>
        <p style={{ marginTop: 14 }}>
          If you require a formal cognitive assessment for any of the above purposes, please consult a qualified clinical psychologist or neuropsychologist.
        </p>
      </Section>

      <Section title="3. Factors Affecting Online Test Scores">
        <p style={{ marginBottom: 14 }}>
          Unlike supervised clinical assessments, online tests are subject to a range of factors that can substantially influence results, including but not limited to:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          <li><strong style={{ color: "#D6E4FF" }}>Environmental distractions</strong> — noise, interruptions, or ambient stress</li>
          <li><strong style={{ color: "#D6E4FF" }}>Physical state</strong> — fatigue, illness, hunger, or the effect of medication</li>
          <li><strong style={{ color: "#D6E4FF" }}>Device and screen differences</strong> — varying screen sizes, resolutions, and rendering affect visual questions</li>
          <li><strong style={{ color: "#D6E4FF" }}>Practice effects</strong> — familiarity with IQ-style questions from prior exposure inflates scores</li>
          <li><strong style={{ color: "#D6E4FF" }}>Test anxiety</strong> — time pressure may disproportionately affect anxious individuals</li>
          <li><strong style={{ color: "#D6E4FF" }}>Language factors</strong> — verbal questions assume proficiency in English</li>
        </ul>
        <p style={{ marginTop: 14 }}>
          For these reasons, a single sitting of our test should not be considered definitive. Scores can vary by ±10–15 IQ points across sittings even for the same individual.
        </p>
      </Section>

      <Section title="4. No Professional Relationship">
        <p style={{ marginBottom: 14 }}>
          Using RealIQTest does not create a professional relationship of any kind — psychological, medical, legal, or otherwise — between you and RealIQTest or any of its staff, contractors, or affiliates. We are not licensed psychologists, and we do not provide psychological advice or counselling.
        </p>
        <p>
          If you have concerns about your cognitive health, memory, or mental functioning, please contact a qualified healthcare professional.
        </p>
      </Section>

      <Section title="5. Limitation of Liability">
        <p style={{ marginBottom: 14 }}>
          To the fullest extent permitted by applicable law, RealIQTest, its owners, operators, employees, contractors, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages arising from:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          <li>Your reliance on or misuse of any score, report, or result produced by the test</li>
          <li>Any decision made, in whole or in part, based on RealIQTest results</li>
          <li>Inaccuracies, errors, or omissions in test content or scoring</li>
          <li>Technical failures, interruptions, or data loss during the test</li>
          <li>Emotional distress arising from test results</li>
        </ul>
      </Section>

      <Section title="6. Intellectual Property">
        <p>
          All test content, questions, visual patterns, scoring algorithms, reports, and website content are the intellectual property of RealIQTest. You may not reproduce, distribute, reverse-engineer, or commercially exploit any part of the test or its outputs without written permission.
        </p>
      </Section>

      <Section title="7. Changes to This Disclaimer">
        <p>
          We reserve the right to update this disclaimer at any time. Continued use of RealIQTest after any changes constitutes your acceptance of the updated disclaimer. The date at the top of this page indicates when it was last revised.
        </p>
      </Section>

      <Section title="8. Contact">
        <p>
          Questions about this disclaimer? Contact us at{" "}
          <a href="mailto:supportrealitest@gmail.com" style={{ color: cyan, textDecoration: "underline" }}>supportrealitest@gmail.com</a>
          {" "}or visit our <a href="/contact" style={{ color: cyan, textDecoration: "underline" }}>contact page</a>.
        </p>
      </Section>
    </ContentShell>
  );
}
