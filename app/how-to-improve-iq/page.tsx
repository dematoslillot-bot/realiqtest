import ContentShell, { Section, InfoCard } from "../components/ContentShell";

export const metadata = {
  title: "How to Improve Your IQ — Science-Backed Strategies | RealIQTest",
  description: "Evidence-based methods to improve each of the 6 cognitive dimensions: logical reasoning, verbal skills, spatial ability, numerical reasoning, working memory, and processing speed.",
  openGraph: {
    title: "How to Improve Your IQ — Science-Backed Strategies",
    description: "Sleep, exercise, working memory training, spatial practice — the evidence-based guide to cognitive improvement.",
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Improve Your IQ — Science-Backed Strategies",
  "description": "Evidence-based methods to improve each of the six cognitive dimensions measured by IQ tests.",
  "url": "https://realiqtest.co/how-to-improve-iq",
  "author": { "@type": "Organization", "name": "RealIQTest" },
  "publisher": { "@type": "Organization", "name": "RealIQTest", "url": "https://realiqtest.co" },
  "datePublished": "2026-05-01",
  "dateModified": "2026-05-03",
};

export default function HowToImproveIQPage() {
  const blue = "#0055FF";
  const cyan = "#00AAFF";

  return (
    <ContentShell
      eyebrow="Cognitive training"
      title="How to Improve Your IQ"
      subtitle="Science-backed strategies for developing each cognitive dimension. Based on peer-reviewed research in cognitive training, neuroplasticity, and lifestyle neuroscience."
      maxWidth={820}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <Section title="Can You Actually Improve Your IQ?">
        <p style={{ marginBottom: 14 }}>
          This is one of the most debated questions in cognitive psychology. The honest answer is: <strong style={{ color: "#D6E4FF" }}>it depends on what you mean by &quot;improve&quot;</strong>.
        </p>
        <p style={{ marginBottom: 14 }}>
          Your <strong style={{ color: "#D6E4FF" }}>general cognitive ability (g)</strong> — the underlying factor that IQ tests measure — is substantially heritable and relatively stable in adults. Large-scale studies have not found strong evidence that any specific training programme produces lasting improvements in g itself.
        </p>
        <p style={{ marginBottom: 14 }}>
          However, <strong style={{ color: "#D6E4FF" }}>individual cognitive dimensions can absolutely be trained</strong>. Working memory capacity, processing speed, spatial reasoning, and numerical skill all respond to targeted practice. And while trained improvements don&apos;t always &quot;transfer&quot; to general IQ, they improve performance on the specific tasks that matter in education and work.
        </p>
        <p>
          Additionally, <strong style={{ color: "#D6E4FF" }}>lifestyle factors</strong> — sleep quality, aerobic exercise, stress management, nutrition — have robust scientific evidence for influencing cognitive performance, sometimes dramatically. Optimising these foundations may be the highest-leverage cognitive investment available.
        </p>
      </Section>

      <Section title="The Non-Negotiable Foundations">
        <p style={{ marginBottom: 16 }}>Before any specific training, these lifestyle factors have the strongest and most consistent scientific evidence:</p>

        <InfoCard icon="😴" title="Sleep — The #1 Cognitive Lever">
          <p style={{ marginBottom: 10 }}>Chronic sleep deprivation (less than 7 hours per night) reduces cognitive performance on par with a blood alcohol concentration of 0.08% — the legal drink-driving limit in most countries. Sleep serves critical cognitive functions:</p>
          <ul style={{ paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6 }}>
            <li>Memory consolidation — transferring short-term memories to long-term storage during slow-wave sleep</li>
            <li>Glymphatic cleaning — the brain&apos;s waste-removal system operates during sleep, clearing metabolic by-products including amyloid-beta proteins linked to Alzheimer&apos;s disease</li>
            <li>Neural pruning — selectively strengthening important synaptic connections while eliminating redundant ones</li>
          </ul>
          <p style={{ marginTop: 10 }}><strong style={{ color: "#D6E4FF" }}>Practical target:</strong> 7–9 hours of sleep per night for adults, with consistent sleep and wake times. Even a single night of full sleep after a period of restriction can restore most cognitive performance.</p>
        </InfoCard>

        <InfoCard icon="🏃" title="Aerobic Exercise — Brain Volume & BDNF">
          <p style={{ marginBottom: 10 }}>Aerobic exercise is one of the most robustly proven cognitive enhancers available without a prescription. A meta-analysis of 29 randomised controlled trials found that regular aerobic exercise produces a mean improvement of 0.52 standard deviations in cognitive function — equivalent to raising IQ by approximately 8 points from a baseline of 100.</p>
          <p>Mechanisms include: increased secretion of BDNF (brain-derived neurotrophic factor), which promotes neurogenesis in the hippocampus; improved cerebrovascular health and cerebral blood flow; and reduced cortisol levels, which improve prefrontal cortex function.</p>
          <p style={{ marginTop: 10 }}><strong style={{ color: "#D6E4FF" }}>Practical target:</strong> 150+ minutes of moderate-intensity aerobic exercise per week (brisk walking, cycling, swimming) or 75+ minutes of vigorous exercise. Even a single 20-minute session produces acute cognitive improvements lasting several hours.</p>
        </InfoCard>

        <InfoCard icon="🧘" title="Stress Management — Cortisol & the Prefrontal Cortex">
          <p>Chronic stress dramatically impairs prefrontal cortex function — the brain region responsible for planning, working memory, and cognitive control. Stress reduces dendritic branching in the prefrontal cortex and shifts neural processing towards the more automatic, reactive limbic system. Mindfulness meditation (8-week MBSR programmes) has been shown in RCTs to reduce cortisol, increase grey matter density in the hippocampus, and improve sustained attention and working memory.</p>
          <p style={{ marginTop: 10 }}><strong style={{ color: "#D6E4FF" }}>Practical target:</strong> Daily 10-20 minutes of mindfulness meditation, combined with regular sleep, exercise, and social connection — the most effective long-term stress reduction protocol.</p>
        </InfoCard>

        <InfoCard icon="🥗" title="Nutrition — What Feeds the Brain">
          <p>Key dietary factors with strong cognitive evidence:</p>
          <ul style={{ paddingLeft: 16, marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <li><strong style={{ color: "#D6E4FF" }}>Omega-3 fatty acids</strong> (DHA/EPA) — essential for synaptic plasticity; found in fatty fish, walnuts, flaxseed</li>
            <li><strong style={{ color: "#D6E4FF" }}>Hydration</strong> — even 2% dehydration measurably impairs short-term memory and attention</li>
            <li><strong style={{ color: "#D6E4FF" }}>Glucose regulation</strong> — stable blood sugar (avoid sugar spikes) sustains cognitive performance across the day</li>
            <li><strong style={{ color: "#D6E4FF" }}>Mediterranean diet</strong> — the dietary pattern with the strongest evidence for cognitive preservation with age</li>
          </ul>
        </InfoCard>
      </Section>

      <Section title="Training Each Cognitive Dimension">
        {[
          {
            icon: "⬡",
            name: "Logical Reasoning",
            strategies: [
              { title: "Progressive matrix practice", desc: "Regular practice with Raven-style matrices builds familiarity with pattern recognition strategies. Apps like Lumosity, Cambridge Brain Sciences, or free matrix puzzle collections online provide structured practice." },
              { title: "Chess", desc: "Chess has been shown in multiple studies to improve abstract reasoning, planning, and pattern recognition — the same capacities tapped by fluid intelligence tests." },
              { title: "Logic puzzles and syllogisms", desc: "Formal logic exercises — syllogisms, conditional reasoning, and set theory problems — train the systematic, rule-based reasoning required for matrix tasks." },
              { title: "Programming", desc: "Learning to code (especially in functional or logical paradigms) builds the habit of thinking in precise, rule-based systems — directly analogous to Raven matrix reasoning." },
            ],
          },
          {
            icon: "◈",
            name: "Verbal Intelligence",
            strategies: [
              { title: "Extensive reading", desc: "Wide reading — fiction, non-fiction, academic papers — is the single best predictor of vocabulary growth and verbal reasoning. Target 30+ minutes per day of challenging material above your comfort level." },
              { title: "Vocabulary expansion", desc: "Deliberately acquiring new words through spaced repetition systems (Anki, Quizlet) is more efficient than passive reading alone. Target 5-10 new words per day." },
              { title: "Debate and argumentation", desc: "Practising structured argumentation — debate clubs, essay writing, Socratic discussion — trains the verbal reasoning required for analogy tasks and conceptual categorisation." },
              { title: "Learning a second language", desc: "Bilingualism and second-language acquisition develop metalinguistic awareness and vocabulary discrimination — skills that transfer to verbal IQ tasks." },
            ],
          },
          {
            icon: "⟳",
            name: "Spatial Reasoning",
            strategies: [
              { title: "Mental rotation practice", desc: "Direct practice with 2D and 3D mental rotation tasks (available in many cognitive training apps) produces some of the largest training gains of any cognitive domain — studies show 10-20% improvement over 4-6 weeks." },
              { title: "Video games (action/strategy)", desc: "Action video games have been shown in multiple RCTs to improve spatial attention, mental rotation speed, and visual field tracking — one of the most robust gaming-cognition effects." },
              { title: "Drawing, sculpting, and 3D modelling", desc: "Artistic practices that require translating 3D mental images into 2D representations (or vice versa) directly train the visual-spatial processing system." },
              { title: "Navigation without GPS", desc: "Actively navigating and building cognitive maps of environments trains hippocampal-dependent spatial memory and the ability to visualise spatial relationships." },
            ],
          },
          {
            icon: "∑",
            name: "Numerical Ability",
            strategies: [
              { title: "Mental arithmetic practice", desc: "Regular mental arithmetic — avoiding the calculator for everyday calculations — strengthens numerical fluency and pattern recognition in number relationships." },
              { title: "Number pattern puzzles", desc: "Sudoku, Ken Ken, and number sequence puzzles specifically train the rule-identification skills required for our bar chart series questions." },
              { title: "Statistics and data literacy", desc: "Learning basic statistics (mean, standard deviation, correlation) builds quantitative intuition and the ability to recognise mathematical patterns in real data." },
              { title: "Mathematical reading", desc: "Popular mathematics books (Thinking, Fast and Slow; Gödel, Escher, Bach; The Man Who Knew Infinity) develop number sense and comfort with abstract mathematical structures." },
            ],
          },
          {
            icon: "◉",
            name: "Working Memory",
            strategies: [
              { title: "Dual N-back training", desc: "Dual N-back is the most studied working memory training paradigm, with mixed but positive evidence for near-transfer to working memory tasks. Available free via Brain Workshop software." },
              { title: "Musical instrument practice", desc: "Learning and practising music — especially sight-reading — demands high working memory load (holding notation in mind while executing motor sequences) and produces documented working memory improvements." },
              { title: "Meditation (open monitoring style)", desc: "Open monitoring meditation, which involves attending to all sensory inputs without fixating on any, improves working memory capacity and reduces mind-wandering." },
              { title: "Memory palace (Method of loci)", desc: "The ancient mnemonic technique of mentally placing items to remember in imagined spatial locations builds working memory encoding strategies and dramatically improves recall capacity." },
            ],
          },
          {
            icon: "⚡",
            name: "Processing Speed",
            strategies: [
              { title: "Action video games", desc: "Action video games are the single best-validated intervention for processing speed, improving visual search speed, target discrimination time, and reaction time — improvements that transfer to real-world perceptual-motor tasks." },
              { title: "Speed drills with accuracy", desc: "Timed mental arithmetic drills and rapid symbol-matching exercises specifically train the accuracy-under-pressure skill measured by our processing speed questions." },
              { title: "Reaction time training", desc: "Dedicated reaction time training apps and reflex training exercises (used by athletes, eSports players, and pilots) improve perceptual-motor processing speed." },
              { title: "Eliminating cognitive load barriers", desc: "Reducing decision fatigue (fewer daily micro-decisions), practising habits and routines (freeing cognitive resources for novel challenges), and adequate caffeine use can meaningfully improve real-world processing speed." },
            ],
          },
        ].map((dim, i) => (
          <div key={i} style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>{dim.icon}</span>
              <h3 style={{ fontSize: 18, fontWeight: 400, color: "#D6E4FF" }}>{dim.name}</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {dim.strategies.map((s, j) => (
                <div key={j} style={{
                  padding: "14px 18px",
                  background: "rgba(3,10,30,0.80)", border: "1px solid rgba(0,85,255,0.14)",
                  borderRadius: 4,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: i % 2 === 0 ? "#7AC0FF" : "#00CCFF", marginBottom: 5 }}>
                    {j + 1}. {s.title}
                  </div>
                  <div style={{ fontSize: 13, color: "#8AAAD0", lineHeight: 1.7 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Realistic Expectations">
        <p style={{ marginBottom: 14 }}>
          Based on the research evidence, here is what you can realistically expect from a dedicated 8-12 week cognitive training programme:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <li><strong style={{ color: "#D6E4FF" }}>Working memory:</strong> 10-20% improvement on trained tasks; some evidence of transfer to fluid intelligence</li>
          <li><strong style={{ color: "#D6E4FF" }}>Processing speed:</strong> 15-30% improvement in reaction time and discrimination speed with targeted practice</li>
          <li><strong style={{ color: "#D6E4FF" }}>Spatial reasoning:</strong> 15-25% improvement with mental rotation practice — one of the largest trainable effects</li>
          <li><strong style={{ color: "#D6E4FF" }}>Verbal ability:</strong> Ongoing vocabulary growth with consistent reading; 5-15 new words per week is achievable</li>
          <li><strong style={{ color: "#D6E4FF" }}>Lifestyle interventions:</strong> Sleep, exercise, and stress management can produce 5-15% performance improvements even without any cognitive training</li>
        </ul>
        <p style={{ marginTop: 14 }}>
          The most important principle: <strong style={{ color: "#D6E4FF" }}>specificity of training</strong>. You improve most on tasks similar to what you practise. Broad lifestyle improvements (sleep, exercise, nutrition) produce the most general cognitive benefits; specific cognitive exercises improve performance on similar tasks.
        </p>
      </Section>

      <div style={{ marginTop: 40, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <a href="/cognitive-dimensions" style={{
          padding: "12px 24px", background: "rgba(0,85,255,0.12)",
          border: "1px solid rgba(0,85,255,0.30)", color: cyan,
          textDecoration: "none", borderRadius: 4, fontSize: 13,
        }}>The 6 Dimensions Explained →</a>
        <a href="/test" style={{
          padding: "12px 24px", background: blue, color: "#fff",
          textDecoration: "none", borderRadius: 4, fontSize: 13,
          boxShadow: "0 0 16px rgba(0,85,255,0.45)",
        }}>Test Your Baseline Now →</a>
      </div>
    </ContentShell>
  );
}
