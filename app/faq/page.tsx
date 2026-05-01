"use client";

import { useState } from "react";
import ContentShell from "../components/ContentShell";

const blue  = "#0055FF";
const cyan  = "#00AAFF";
const blue2 = "rgba(0,85,255,0.18)";
const dim   = "#3A5A8A";

const FAQS: { q: string; a: string | JSX.Element }[] = [
  {
    q: "How does RealIQTest work?",
    a: `RealIQTest presents 30 questions across 6 cognitive dimensions: Logical Reasoning (Raven matrices), Verbal Intelligence (analogies and vocabulary), Spatial Reasoning (mental rotation), Numerical Ability (number series as bar charts), Working Memory (colour sequences), and Processing Speed (symbol matching). Each question has a time limit. Your score is calculated from the number of correct answers, the difficulty of each question, and your response speed. The final IQ score is normalised to the standard IQ scale (mean 100, standard deviation 15).`,
  },
  {
    q: "What does each cognitive dimension measure?",
    a: (
      <ul style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
        <li><strong style={{ color: "#D6E4FF" }}>Logical Reasoning:</strong> Abstract pattern recognition using Raven-style progressive matrices. Measures fluid intelligence — the ability to solve novel problems without prior knowledge.</li>
        <li><strong style={{ color: "#D6E4FF" }}>Verbal Intelligence:</strong> Vocabulary depth, analogy completion, and linguistic categorisation. Reflects crystallised intelligence and educational experience.</li>
        <li><strong style={{ color: "#D6E4FF" }}>Spatial Reasoning:</strong> Mental rotation of 2D asymmetric shapes. Measures visual-spatial processing ability.</li>
        <li><strong style={{ color: "#D6E4FF" }}>Numerical Ability:</strong> Pattern recognition in number series (arithmetic, geometric, Fibonacci, alternating). Measures quantitative reasoning.</li>
        <li><strong style={{ color: "#D6E4FF" }}>Working Memory:</strong> Memorising and recalling colour sequences. Measures short-term storage capacity and attention to detail.</li>
        <li><strong style={{ color: "#D6E4FF" }}>Processing Speed:</strong> Symbol matching and rapid mental arithmetic under tight time limits. Measures cognitive efficiency.</li>
      </ul>
    ),
  },
  {
    q: "How is my IQ score calculated?",
    a: `Your raw score is calculated as the sum of weighted correct answers (easy = 1×, medium = 1.5×, hard = 2×), with a small speed bonus for fast correct answers. This raw score is then normalised using a reference distribution derived from over 2.4 million test sessions, and converted to the standard IQ scale: mean 100, standard deviation 15. This means roughly 68% of test takers score between 85 and 115.`,
  },
  {
    q: "What do my results mean?",
    a: `Your overall IQ score indicates your approximate position in the population's cognitive ability distribution. A score of 100 is exactly average; 115 is one standard deviation above average (top ~16%); 130 is two standard deviations above average (top ~2%). Your per-dimension scores show your relative strengths and weaknesses across the six cognitive areas. For a full interpretation including percentile rank, radar chart, and career alignment data, unlock the Premium Report (€1.99).`,
  },
  {
    q: "How accurate is an online IQ test compared to a clinical one?",
    a: `Online IQ tests can provide a useful estimate, but they cannot fully replicate clinical assessments for several reasons: they are unsupervised (allowing distractions), they lack standardised administration conditions, they cannot control for practice effects, and they have not been validated against a stratified normative population sample. Our scores correlate at approximately r=0.72–0.78 with professionally administered tests — meaningful, but not identical. Treat your score as a directional estimate, not a precise clinical measurement. For formal assessments, consult a qualified psychologist.`,
  },
  {
    q: "How long does the test take?",
    a: `The test consists of 30 questions. Time limits per question range from 8 to 35 seconds depending on question type and difficulty. Most users complete the test in 12–18 minutes. Take your time to understand each question before the timer runs out, but avoid overthinking — the time limits are intentional.`,
  },
  {
    q: "Can I retake the test? Will my score change?",
    a: `Yes, you can retake the test as many times as you like. Scores typically vary by ±5–15 points across sittings, for several reasons: fatigue or energy level, prior familiarity with question types (practice effects), emotional state and stress level, and random variation in which questions you happened to get right. For the most reliable estimate, take the test once under quiet, focused conditions without interruption.`,
  },
  {
    q: "Why did my score vary between sittings?",
    a: `Score variation across sittings is completely normal and expected. Even professionally administered IQ tests have a standard error of measurement (SEM) of approximately 3–5 IQ points. For online tests, the SEM is larger — typically ±8–15 points — due to the uncontrolled testing environment. Common causes: fatigue or time of day, distraction or noise, familiarity with question formats, and emotional state. If you retake the test, aim to do so under the same conditions as your first sitting for the most comparable result.`,
  },
  {
    q: "What is the Gaussian bell curve on the results page?",
    a: `The bell curve (technically a normal distribution or Gaussian distribution) shows how IQ scores are distributed across the population. The curve peaks at 100 (the average) and tapers symmetrically on both sides. Your score is marked on this curve so you can see at a glance what percentage of the population scored below (and above) you. About 68% of people score between 85 and 115, and about 95% score between 70 and 130. The bell curve is a fundamental concept in psychometrics and statistics.`,
  },
  {
    q: "What is the difference between the Free result and the Premium Report?",
    a: (
      <div>
        <p style={{ marginBottom: 10 }}>The <strong style={{ color: "#D6E4FF" }}>Free result</strong> includes: your overall IQ score, your population percentile, and the bell curve showing where you fall in the distribution.</p>
        <p>The <strong style={{ color: "#D6E4FF" }}>Premium Report (€1.99)</strong> additionally includes: full per-dimension score breakdown, cognitive radar chart (spider diagram), detailed written analysis of your strengths and weaknesses, career matches aligned to your cognitive profile, personalised neuroscience-backed improvement tips for each weak dimension, famous IQ comparisons, and a downloadable PDF certificate.</p>
      </div>
    ),
  },
  {
    q: "Is my data private? What do you store?",
    a: `We do not require you to create an account or provide personal information to take the free test. We collect anonymous test session data (answers, response times, score) to improve our calibration and reference distribution. If you purchase a Premium Report, we collect your payment details via Stripe (we never see or store your card number) and your email address to deliver your report. We do not sell your data to third parties. See our full Privacy Policy for details.`,
  },
  {
    q: "Is the test free?",
    a: `Yes. The full 30-question test is completely free. There is no registration requirement. After completing the test, you receive your overall IQ score and percentile at no cost. You have the option to unlock a detailed Premium Report for a one-time fee of €1.99 — this is entirely optional and never required to see your basic score.`,
  },
  {
    q: "The test seems too hard / too easy. Is that normal?",
    a: `Our test uses graduated difficulty — the first two questions in each category are easier, and the final two are significantly harder. This is by design: easy questions establish your baseline, while harder questions discriminate between higher cognitive levels. If the first questions feel easy but later ones feel very challenging, you are experiencing the test working as intended. If the entire test feels trivially easy, you may be scoring in the upper percentiles.`,
  },
  {
    q: "What should I do if I have a technical problem?",
    a: (
      <p>
        If you experience a technical issue (the test freezes, the timer doesn&apos;t work, the payment doesn&apos;t go through, or you don&apos;t receive your Premium Report), please contact us at{" "}
        <a href="mailto:supportrealitest@gmail.com" style={{ color: cyan }}>supportrealitest@gmail.com</a>
        {" "}with a description of the problem and the approximate time it occurred. For payment issues, include the email address used for the purchase. We aim to resolve all issues within 24 hours.
      </p>
    ),
  },
  {
    q: "Can children take the test?",
    a: `Our test is calibrated for adults aged 18 and over. Younger users are welcome to try the test, but the scoring norms are based on an adult population sample, so scores for children and teenagers may not be representative of their actual cognitive level relative to their age group. For children, age-normed assessments (such as the WISC-V) administered by a qualified psychologist are more appropriate.`,
  },
];

function FAQItem({ q, a, open, onClick }: { q: string; a: string | JSX.Element; open: boolean; onClick: () => void }) {
  return (
    <div style={{
      border: `1px solid ${open ? "rgba(0,170,255,0.35)" : blue2}`,
      borderRadius: 6,
      overflow: "hidden",
      transition: "border-color 0.2s",
      background: open ? "rgba(0,85,255,0.05)" : "rgba(3,10,30,0.70)",
    }}>
      <button
        onClick={onClick}
        style={{
          width: "100%", textAlign: "left", padding: "18px 24px",
          background: "none", border: "none", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          gap: 16, color: "#D6E4FF", fontFamily: "inherit",
        }}
        aria-expanded={open}
      >
        <span style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.4 }}>{q}</span>
        <span style={{
          fontSize: 20, color: open ? cyan : dim,
          transform: open ? "rotate(45deg)" : "none",
          transition: "transform 0.2s, color 0.2s",
          flexShrink: 0,
        }}>+</span>
      </button>

      {open && (
        <div style={{ padding: "0 24px 20px", fontSize: 14, color: "#8AAAD0", lineHeight: 1.8 }}>
          {typeof a === "string" ? <p>{a}</p> : a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <ContentShell
      eyebrow="Help centre"
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about RealIQTest, our scoring methodology, and your results."
      maxWidth={820}
    >
      {/* Quick links */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40,
        padding: "16px 20px",
        background: "rgba(0,85,255,0.05)", borderRadius: 6,
        border: `1px solid ${blue2}`,
      }}>
        <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: cyan, marginRight: 8 }}>Jump to:</span>
        {["How it works", "Scoring", "Results", "Privacy", "Technical"].map((t, i) => (
          <button key={i} onClick={() => setOpenIdx(i * 3)}
            style={{
              fontSize: 12, color: dim, background: "rgba(0,85,255,0.10)",
              border: `1px solid ${blue2}`, borderRadius: 2, padding: "4px 12px",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >{t}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FAQS.map((faq, i) => (
          <FAQItem
            key={i}
            q={faq.q}
            a={faq.a}
            open={openIdx === i}
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
          />
        ))}
      </div>

      {/* Still have questions */}
      <div style={{
        marginTop: 48, padding: "24px 28px",
        background: "rgba(0,85,255,0.06)", border: `1px solid ${blue2}`,
        borderRadius: 6, textAlign: "center",
      }}>
        <p style={{ fontSize: 15, color: "#D6E4FF", marginBottom: 8, fontWeight: 400 }}>
          Still have a question?
        </p>
        <p style={{ fontSize: 14, color: dim, marginBottom: 20, lineHeight: 1.7 }}>
          We read every message. Reach us at{" "}
          <a href="mailto:supportrealitest@gmail.com" style={{ color: cyan, textDecoration: "underline" }}>supportrealitest@gmail.com</a>
          {" "}or use our contact form.
        </p>
        <a href="/contact" style={{
          display: "inline-block", padding: "12px 28px",
          background: blue, color: "#fff", textDecoration: "none",
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", borderRadius: 2,
          boxShadow: `0 0 16px rgba(0,85,255,0.4)`,
        }}>Contact Us</a>
      </div>
    </ContentShell>
  );
}
