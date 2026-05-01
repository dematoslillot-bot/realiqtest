import ContentShell, { Section, InfoCard, Table } from "../components/ContentShell";

export const metadata = {
  title: "What is IQ? Complete Guide to Intelligence Quotient — RealIQTest",
  description: "A comprehensive guide to IQ: its history, how it is measured, what your score means, and how the normal distribution works. Includes a full IQ score table.",
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
      <Section title="The Definition of IQ">
        <p style={{ marginBottom: 14 }}>
          IQ stands for <strong style={{ color: "#D6E4FF" }}>Intelligence Quotient</strong>. It is a numerical score derived from a standardised test designed to assess human intelligence. The term &quot;quotient&quot; comes from the original calculation method: a child&apos;s mental age (determined by test performance) divided by their chronological age, multiplied by 100. This ratio produced the original IQ score.
        </p>
        <p style={{ marginBottom: 14 }}>
          Today, modern IQ tests use a different method called <strong style={{ color: "#D6E4FF" }}>deviation IQ</strong>, introduced by David Wechsler in 1939. Rather than the mental age ratio, deviation IQ compares an individual&apos;s performance to a large normative sample of the same age group. The score is expressed on a scale where 100 represents exactly average performance for that age group, and 15 points equals one standard deviation.
        </p>
        <p>
          IQ tests measure a variety of cognitive abilities, including abstract reasoning, verbal comprehension, working memory, processing speed, and spatial visualisation. Most major IQ batteries — including the Wechsler Adult Intelligence Scale (WAIS-IV) and the Stanford-Binet 5 — produce both a composite (full-scale) IQ and subscale scores for individual cognitive domains.
        </p>
      </Section>

      <Section title="A Brief History of IQ Testing">
        <InfoCard icon="📅" title="1905 — Binet-Simon Scale (France)">
          Alfred Binet and Théodore Simon developed the first practical intelligence test for the French Ministry of Education, designed to identify children who needed additional educational support. The test measured a range of cognitive tasks including memory, attention, problem-solving, and verbal reasoning.
        </InfoCard>
        <InfoCard icon="📅" title="1916 — Stanford-Binet (USA)">
          Lewis Terman at Stanford University adapted and translated the Binet-Simon scale for American use, introducing the concept of the &quot;Intelligence Quotient&quot; — the ratio of mental age to chronological age × 100.
        </InfoCard>
        <InfoCard icon="📅" title="1936 — Raven&apos;s Progressive Matrices">
          John C. Raven introduced the progressive matrix test as a culture-fair measure of fluid intelligence — the ability to solve novel abstract problems independent of language or educational background.
        </InfoCard>
        <InfoCard icon="📅" title="1939 — Wechsler-Bellevue Scale">
          David Wechsler published the first version of what would become the WAIS — the world&apos;s most widely used intelligence test. He introduced the deviation IQ score still used today, and established 100 as the population mean.
        </InfoCard>
        <InfoCard icon="📅" title="1971 — Mental Rotation Research">
          Roger Shepard and Jacqueline Metzler published landmark research demonstrating that people mentally rotate 3D objects, establishing spatial reasoning as a measurable and quantifiable cognitive ability.
        </InfoCard>
        <InfoCard icon="📅" title="1994 — The Bell Curve Debate">
          The publication of Herrnstein and Murray&apos;s &quot;The Bell Curve&quot; sparked intense public debate about IQ, group differences, and social policy — highlighting how IQ scores are often misunderstood and misused in public discourse.
        </InfoCard>
      </Section>

      <Section title="The Normal Distribution of IQ">
        <p style={{ marginBottom: 14 }}>
          IQ scores in the population follow a <strong style={{ color: "#D6E4FF" }}>normal distribution</strong> (the famous &quot;bell curve&quot;): most people cluster around the average of 100, with progressively fewer people at the extremes. This distribution has specific mathematical properties:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <li><strong style={{ color: "#D6E4FF" }}>68%</strong> of people score between 85 and 115 (one standard deviation either side of 100)</li>
          <li><strong style={{ color: "#D6E4FF" }}>95%</strong> of people score between 70 and 130 (two standard deviations)</li>
          <li><strong style={{ color: "#D6E4FF" }}>99.7%</strong> of people score between 55 and 145 (three standard deviations)</li>
          <li>Only about <strong style={{ color: "#D6E4FF" }}>2.3%</strong> of people score above 130 (commonly cited as the threshold for &quot;gifted&quot; classification)</li>
          <li>Only about <strong style={{ color: "#D6E4FF" }}>0.13%</strong> of people score above 145</li>
        </ul>
        <p style={{ marginTop: 14 }}>
          This symmetrical distribution means IQ scores above and below the mean are equally common. A score of 115 (one standard deviation above average) is just as unusual as a score of 85 (one standard deviation below average) — each occurs in approximately 16% of the population.
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
          <a href="/iq-score-ranges" style={{ color: cyan }}>IQ Score Ranges guide</a> for more detail.
        </p>
      </Section>

      <Section title="What IQ Measures — and What It Doesn't">
        <p style={{ marginBottom: 14 }}>
          IQ tests primarily measure <strong style={{ color: "#D6E4FF" }}>g</strong> — the general factor of cognitive ability identified by Charles Spearman in 1904. This general factor underlies performance across diverse cognitive tasks and is the most stable, heritable, and predictive cognitive construct known to psychology. IQ scores correlate meaningfully with:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          <li>Academic achievement (r ≈ 0.50)</li>
          <li>Job performance across most occupations (r ≈ 0.20–0.50)</li>
          <li>Income level (r ≈ 0.30)</li>
          <li>Health literacy and life expectancy (r ≈ 0.15–0.30)</li>
          <li>Brain volume and neural conduction speed (r ≈ 0.40)</li>
        </ul>
        <p style={{ marginBottom: 14 }}>
          However, IQ does <strong style={{ color: "#D6E4FF" }}>not</strong> measure many important human capacities:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          <li>Emotional intelligence (EQ) and interpersonal skills</li>
          <li>Creativity, artistic talent, and innovation</li>
          <li>Practical wisdom and common sense</li>
          <li>Work ethic, persistence, and conscientiousness</li>
          <li>Leadership, charisma, and social influence</li>
          <li>Moral reasoning and ethical judgement</li>
          <li>Physical, athletic, or musical abilities</li>
        </ul>
        <p style={{ marginTop: 14 }}>
          Many highly successful individuals have achieved extraordinary things through combination of moderate IQ, exceptional emotional intelligence, relentless work ethic, and strong interpersonal skills — rather than exceptional IQ alone.
        </p>
      </Section>

      <Section title="Nature vs Nurture — What Determines IQ?">
        <p style={{ marginBottom: 14 }}>
          IQ is influenced by both genetic and environmental factors. Twin and adoption studies consistently show that heritability of IQ in adults is approximately <strong style={{ color: "#D6E4FF" }}>50–80%</strong> — meaning genetics explains 50-80% of the variance in IQ scores between individuals in a given environment. The remaining variance comes from environmental factors including:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          <li><strong style={{ color: "#D6E4FF" }}>Education:</strong> Access to quality schooling, especially in early childhood, strongly influences IQ scores</li>
          <li><strong style={{ color: "#D6E4FF" }}>Nutrition:</strong> Iodine deficiency, malnutrition, and lead exposure all measurably reduce cognitive development</li>
          <li><strong style={{ color: "#D6E4FF" }}>Socioeconomic environment:</strong> Chronic stress and limited cognitive stimulation in childhood reduce IQ</li>
          <li><strong style={{ color: "#D6E4FF" }}>Physical health:</strong> Exercise, sleep quality, and cardiovascular health all influence cognitive performance</li>
          <li><strong style={{ color: "#D6E4FF" }}>Flynn Effect:</strong> Average IQ scores have risen by approximately 3 points per decade throughout the 20th century, likely due to improved education, nutrition, and environmental stimulation</li>
        </ul>
      </Section>

      <Section title="Frequently Misunderstood IQ Facts">
        <p style={{ marginBottom: 14 }}>
          IQ is one of the most misunderstood concepts in popular culture. Here are some important clarifications:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <li><strong style={{ color: "#D6E4FF" }}>IQ is not fixed:</strong> While IQ is relatively stable in adults, it can change — especially during childhood and adolescence, and following major environmental changes.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Higher isn&apos;t always better:</strong> Beyond a threshold of approximately IQ 120, additional IQ points contribute diminishing returns to most life outcomes.</li>
          <li><strong style={{ color: "#D6E4FF" }}>Online scores are estimates:</strong> Pop-psychology online tests often inflate scores to make users feel good. Our test is designed to be honest and calibrated.</li>
          <li><strong style={{ color: "#D6E4FF" }}>IQ doesn&apos;t define potential:</strong> Motivation, emotional regulation, social skills, and environment are equally if not more important than IQ in determining success.</li>
        </ul>
      </Section>

      <div style={{ marginTop: 48, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <a href="/iq-score-ranges" style={{
          padding: "12px 24px", background: "rgba(0,85,255,0.12)",
          border: "1px solid rgba(0,85,255,0.30)", color: "#00AAFF",
          textDecoration: "none", borderRadius: 4, fontSize: 13,
        }}>IQ Score Ranges →</a>
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
