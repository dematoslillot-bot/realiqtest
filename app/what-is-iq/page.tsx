import ContentShell, { Section, InfoCard, Table } from "../components/ContentShell";

export const metadata = {
  title: "What is IQ? Complete Guide to Intelligence Quotient — RealIQTest",
  description: "A comprehensive guide to IQ: its history, how it is measured, what your score means, the normal distribution, nature vs nurture, and common misconceptions. Includes a full IQ score table.",
  openGraph: {
    title: "What is IQ? Complete Guide to Intelligence Quotient",
    description: "History, science, scoring, and what your IQ score really means — a complete guide from RealIQTest.",
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "What is IQ? A Complete Guide to the Intelligence Quotient",
  "description": "A comprehensive guide to IQ: its history, how it is measured, what your score means, and how the normal distribution works.",
  "url": "https://realiqtest.co/what-is-iq",
  "author": { "@type": "Organization", "name": "RealIQTest" },
  "publisher": { "@type": "Organization", "name": "RealIQTest", "url": "https://realiqtest.co" },
  "datePublished": "2026-05-01",
  "dateModified": "2026-05-03",
};

export default function WhatIsIQPage() {
  const cyan = "#00AAFF";
  const blue = "#0055FF";

  return (
    <ContentShell
      eyebrow="Resource guide"
      title="What is IQ?"
      subtitle="A complete guide to the Intelligence Quotient — its history, scientific basis, what scores mean, and why it matters."
      maxWidth={820}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <Section title="The Definition of IQ">
        <p style={{ marginBottom: 14 }}>
          IQ stands for <strong style={{ color: "#D6E4FF" }}>Intelligence Quotient</strong>. It is a numerical score derived from a standardised test designed to assess human intelligence. The term &quot;quotient&quot; comes from the original calculation method: a child&apos;s mental age (determined by test performance) divided by their chronological age, multiplied by 100. This ratio produced the original IQ score. A 10-year-old performing at the level of a typical 12-year-old would have an IQ of 120 (12 ÷ 10 × 100).
        </p>
        <p style={{ marginBottom: 14 }}>
          Today, modern IQ tests use a different method called <strong style={{ color: "#D6E4FF" }}>deviation IQ</strong>, introduced by David Wechsler in 1939. Rather than the mental age ratio, deviation IQ compares an individual&apos;s performance to a large normative sample of the same age group. The score is expressed on a scale where 100 represents exactly average performance for that age group, and 15 points equals one standard deviation. This is the system used by all major intelligence batteries today — WAIS-IV, Stanford-Binet 5, and Cattell Culture Fair.
        </p>
        <p style={{ marginBottom: 14 }}>
          IQ tests measure a variety of cognitive abilities, including abstract reasoning, verbal comprehension, working memory, processing speed, and spatial visualisation. Most major IQ batteries — including the Wechsler Adult Intelligence Scale (WAIS-IV) and the Stanford-Binet 5 — produce both a composite (full-scale) IQ and subscale scores for individual cognitive domains.
        </p>
        <p>
          The concept underlying all IQ tests is the <strong style={{ color: "#D6E4FF" }}>general factor (g)</strong>, first identified by British psychologist Charles Spearman in 1904. Spearman observed that people who performed well on one cognitive test tended to perform well on all cognitive tests — suggesting a common underlying ability. This general intelligence factor, g, is the most replicated finding in all of cognitive psychology and forms the theoretical foundation of modern IQ testing.
        </p>
      </Section>

      <Section title="A Brief History of IQ Testing">
        <InfoCard icon="📅" title="1905 — Binet-Simon Scale (France)">
          Alfred Binet and Théodore Simon developed the first practical intelligence test for the French Ministry of Education, designed to identify children who needed additional educational support. The test measured a range of cognitive tasks including memory, attention, problem-solving, and verbal reasoning. Crucially, Binet himself warned against interpreting his scale as a fixed measure of innate intelligence — he viewed it as a practical tool for identifying children who needed help, not a label of permanent cognitive capacity.
        </InfoCard>
        <InfoCard icon="📅" title="1916 — Stanford-Binet (USA)">
          Lewis Terman at Stanford University adapted and translated the Binet-Simon scale for American use, introducing the concept of the &quot;Intelligence Quotient&quot; — the ratio of mental age to chronological age × 100. Terman extended the test to adults and popularised the notion that IQ was a largely fixed, hereditary trait — a position that remains controversial and scientifically disputed.
        </InfoCard>
        <InfoCard icon="📅" title="1917 — Army Alpha and Beta Tests">
          The United States Army administered mass intelligence testing during World War I using the Army Alpha (verbal) and Army Beta (non-verbal) tests to classify recruits. This was the first large-scale application of group intelligence testing and established the precedent for using IQ-style assessments in selection and classification contexts.
        </InfoCard>
        <InfoCard icon="📅" title="1936 — Raven&apos;s Progressive Matrices">
          John C. Raven introduced the progressive matrix test as a culture-fair measure of fluid intelligence — the ability to solve novel abstract problems independent of language or educational background. Raven matrices remain the most widely used research tool in intelligence science and form the backbone of our Logical Reasoning dimension.
        </InfoCard>
        <InfoCard icon="📅" title="1939 — Wechsler-Bellevue Scale">
          David Wechsler published the first version of what would become the WAIS — the world&apos;s most widely used intelligence test. He introduced the deviation IQ score still used today, establishing 100 as the population mean and 15 as the standard deviation. Wechsler also pioneered the use of subscale scores to profile cognitive strengths and weaknesses within an individual.
        </InfoCard>
        <InfoCard icon="📅" title="1971 — Mental Rotation Research">
          Roger Shepard and Jacqueline Metzler published landmark research demonstrating that people mentally rotate 3D objects — and that rotation time increases linearly with the angle of rotation, exactly as if people were physically rotating the object in their mind. This established spatial reasoning as a measurable and quantifiable cognitive ability distinct from verbal or numerical intelligence.
        </InfoCard>
        <InfoCard icon="📅" title="1994 — The Bell Curve Debate">
          The publication of Herrnstein and Murray&apos;s &quot;The Bell Curve&quot; sparked intense public debate about IQ, group differences, and social policy — highlighting how IQ scores are often misunderstood and misused in public discourse. The ensuing controversy prompted the American Psychological Association to publish a comprehensive scientific consensus report, &quot;Intelligence: Knowns and Unknowns&quot; (1995), which remains the most authoritative scientific summary of the field.
        </InfoCard>
      </Section>

      <Section title="The Normal Distribution of IQ">
        <p style={{ marginBottom: 14 }}>
          IQ scores in the population follow a <strong style={{ color: "#D6E4FF" }}>normal distribution</strong> (the famous &quot;bell curve&quot;): most people cluster around the average of 100, with progressively fewer people at the extremes. This distribution has specific mathematical properties:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          <li><strong style={{ color: "#D6E4FF" }}>68%</strong> of people score between 85 and 115 (one standard deviation either side of 100)</li>
          <li><strong style={{ color: "#D6E4FF" }}>95%</strong> of people score between 70 and 130 (two standard deviations)</li>
          <li><strong style={{ color: "#D6E4FF" }}>99.7%</strong> of people score between 55 and 145 (three standard deviations)</li>
          <li>Only about <strong style={{ color: "#D6E4FF" }}>2.3%</strong> of people score above 130 (commonly cited as the threshold for &quot;gifted&quot; classification)</li>
          <li>Only about <strong style={{ color: "#D6E4FF" }}>0.13%</strong> of people score above 145</li>
        </ul>
        <p style={{ marginBottom: 14 }}>
          This symmetrical distribution means IQ scores above and below the mean are equally common. A score of 115 (one standard deviation above average) is just as unusual as a score of 85 (one standard deviation below average) — each occurs in approximately 16% of the population.
        </p>
        <p>
          The normal distribution of IQ is the result of IQ test <strong style={{ color: "#D6E4FF" }}>norming</strong>: each new edition of an IQ test is administered to a large representative sample of the population, and the scoring is adjusted so that the population average equals exactly 100. This renorming process is necessary because average IQ scores have been rising over time (the Flynn Effect), and without renorming, old tests would produce inflated scores for modern test-takers.
        </p>
      </Section>

      <Section title="IQ Score Ranges Table">
        <Table
          headers={["IQ Range", "Classification", "% of Population", "Percentile"]}
          rows={[
            ["130 +", "Very Superior / Gifted", "~2.3%", "Top 2%"],
            ["120 – 129", "Superior", "~6.7%", "Top 9%"],
            ["110 – 119", "High Average", "~16.1%", "Top 25%"],
            ["90 – 109", "Average", "~50%", "25th – 75th"],
            ["80 – 89", "Low Average", "~16.1%", "Bottom 25%"],
            ["70 – 79", "Borderline", "~6.7%", "Bottom 9%"],
            ["Below 70", "Extremely Low", "~2.3%", "Bottom 2%"],
          ]}
        />
        <p style={{ fontSize: 12, color: "#3A5A8A", marginTop: 8 }}>
          Note: Classification labels vary between test publishers. The ranges above reflect the most widely used conventions (WAIS-IV / DSM-5 framework). See our full{" "}
          <a href="/iq-score-ranges" style={{ color: cyan }}>IQ Score Ranges guide</a> for detailed descriptions of what each range means in practice.
        </p>
      </Section>

      <Section title="What IQ Measures — and What It Doesn't">
        <p style={{ marginBottom: 14 }}>
          IQ tests primarily measure <strong style={{ color: "#D6E4FF" }}>g</strong> — the general factor of cognitive ability identified by Charles Spearman in 1904. This general factor underlies performance across diverse cognitive tasks and is the most stable, heritable, and predictive cognitive construct known to psychology. IQ scores correlate meaningfully with:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          <li>Academic achievement (r ≈ 0.50 — a strong and well-replicated correlation)</li>
          <li>Job performance across most occupations (r ≈ 0.20–0.50, depending on job complexity)</li>
          <li>Income level (r ≈ 0.30, though this relationship is mediated by education)</li>
          <li>Health literacy and life expectancy (r ≈ 0.15–0.30)</li>
          <li>Brain volume and neural conduction speed (r ≈ 0.40)</li>
          <li>Learning rate for complex skills (r ≈ 0.40–0.60)</li>
        </ul>
        <p style={{ marginBottom: 14 }}>
          However, IQ does <strong style={{ color: "#D6E4FF" }}>not</strong> measure many important human capacities:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          <li>Emotional intelligence (EQ) and interpersonal skills</li>
          <li>Creativity, artistic talent, and innovation</li>
          <li>Practical wisdom and common sense</li>
          <li>Work ethic, persistence, and conscientiousness (which predict success independently of IQ)</li>
          <li>Leadership, charisma, and social influence</li>
          <li>Moral reasoning and ethical judgement</li>
          <li>Physical, athletic, or musical abilities</li>
        </ul>
        <p style={{ marginTop: 14 }}>
          Many highly successful individuals have achieved extraordinary things through a combination of moderate IQ, exceptional emotional intelligence, relentless work ethic, and strong interpersonal skills — rather than exceptional IQ alone. Conscientiousness (the personality trait associated with discipline, organisation, and persistence) is approximately as strong a predictor of academic and professional success as IQ in most domains studied.
        </p>
      </Section>

      <Section title="Nature vs Nurture — What Determines IQ?">
        <p style={{ marginBottom: 14 }}>
          IQ is influenced by both genetic and environmental factors. Twin and adoption studies consistently show that heritability of IQ in adults is approximately <strong style={{ color: "#D6E4FF" }}>50–80%</strong> — meaning genetics explains 50–80% of the variance in IQ scores between individuals in a given environment. This heritability estimate increases with age: the influence of genetics on IQ grows stronger from childhood to adulthood, while shared environmental influences (family, school) diminish.
        </p>
        <p style={{ marginBottom: 14 }}>
          The remaining variance comes from environmental factors including:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          <li><strong style={{ color: "#D6E4FF" }}>Education:</strong> Access to quality schooling, especially in early childhood, strongly influences IQ scores. Years of education causally increases IQ by approximately 1–5 points per year of schooling.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Nutrition:</strong> Iodine deficiency, malnutrition, and lead exposure all measurably reduce cognitive development. Adequate nutrition in the first 1,000 days of life is critical for cognitive development.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Socioeconomic environment:</strong> Chronic stress and limited cognitive stimulation in childhood reduce IQ. The IQ gap between low and high-SES children narrows significantly when environmental quality is equalised.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Physical health:</strong> Exercise, sleep quality, and cardiovascular health all influence cognitive performance. Aerobic fitness is associated with larger hippocampal volume and better executive function.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Flynn Effect:</strong> Average IQ scores have risen by approximately 3 points per decade throughout the 20th century, likely due to improved education, nutrition, and environmental stimulation — direct evidence that IQ can be raised by environmental improvement.</li>
        </ul>
      </Section>

      <Section title="The Flynn Effect — Rising IQ Scores Over Time">
        <p style={{ marginBottom: 14 }}>
          One of the most striking findings in intelligence research is the <strong style={{ color: "#D6E4FF" }}>Flynn Effect</strong>: average IQ scores have increased by approximately 3 points per decade in developed nations throughout the 20th century. Named after researcher James Flynn, who documented the phenomenon across 14 countries, the Flynn Effect implies that if today&apos;s children took a test normed in 1950, they would score approximately 30 points higher — a two standard deviation advantage.
        </p>
        <p style={{ marginBottom: 14 }}>
          The Flynn Effect is too large and too fast to be explained by genetics, ruling out a purely hereditary explanation for the IQ increases. The most likely causes include better nutrition (especially in the first years of life), expansion of formal education, increased familiarity with abstract and hypothetical thinking, reduced exposure to environmental toxins such as lead, and a more cognitively stimulating environment through technology and media.
        </p>
        <p>
          Crucially, the Flynn Effect appears to have plateaued or reversed in some developed nations since the 1990s, raising new questions about what environmental factors drove the increases and whether the benefits have been exhausted. This remains an active area of research in intelligence science.
        </p>
      </Section>

      <Section title="Frequently Misunderstood IQ Facts">
        <p style={{ marginBottom: 14 }}>
          IQ is one of the most misunderstood concepts in popular culture. Here are some important clarifications:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <li><strong style={{ color: "#D6E4FF" }}>IQ is not fixed for life:</strong> While IQ is relatively stable in adults, it can change — especially during childhood and adolescence, and following major environmental changes such as severe illness, brain injury, or dramatic changes in education and cognitive stimulation.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Higher isn&apos;t always better:</strong> Beyond a threshold of approximately IQ 120, additional IQ points contribute diminishing returns to most life outcomes. The difference between IQ 140 and IQ 160 is far less practically significant than the difference between 80 and 100.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Online scores are estimates:</strong> Pop-psychology online tests often inflate scores to make users feel good — sometimes by 15–25 points. Our test is designed to be honest and calibrated. See our <a href="/about" style={{ color: cyan }}>About page</a> for details on our scoring methodology.</li>
          <li><strong style={{ color: "#D6E4FF" }}>IQ doesn&apos;t define potential:</strong> Motivation, emotional regulation, social skills, and environment are equally if not more important than IQ in determining success, wellbeing, and life satisfaction.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Group differences are not individual differences:</strong> Statistical averages between groups say nothing about any individual. IQ is always an individual measure, not a group label.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Culture matters:</strong> IQ tests, including Raven matrices, are more culture-fair than verbal tests — but no test is fully culture-free. Familiarity with test-taking conventions, abstract thinking styles, and competitive performance settings all influence results.</li>
        </ul>
      </Section>

      <div style={{ marginTop: 48, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <a href="/iq-score-ranges" style={{
          padding: "12px 24px", background: "rgba(0,85,255,0.12)",
          border: "1px solid rgba(0,85,255,0.30)", color: "#00AAFF",
          textDecoration: "none", borderRadius: 4, fontSize: 13,
        }}>IQ Score Ranges →</a>
        <a href="/cognitive-dimensions" style={{
          padding: "12px 24px", background: "rgba(0,85,255,0.12)",
          border: "1px solid rgba(0,85,255,0.30)", color: "#00AAFF",
          textDecoration: "none", borderRadius: 4, fontSize: 13,
        }}>6 Cognitive Dimensions →</a>
        <a href="/how-to-improve-iq" style={{
          padding: "12px 24px", background: "rgba(0,85,255,0.12)",
          border: "1px solid rgba(0,85,255,0.30)", color: "#00AAFF",
          textDecoration: "none", borderRadius: 4, fontSize: 13,
        }}>How to Improve Your IQ →</a>
        <a href="/test" style={{
          padding: "12px 24px", background: blue, color: "#fff",
          textDecoration: "none", borderRadius: 4, fontSize: 13,
          boxShadow: "0 0 16px rgba(0,85,255,0.45)",
        }}>Take the Free Test →</a>
      </div>
    </ContentShell>
  );
}
