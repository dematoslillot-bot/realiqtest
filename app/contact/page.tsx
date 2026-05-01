"use client";

import { useState } from "react";
import ContentShell, { Section } from "../components/ContentShell";

const blue = "#0055FF";
const cyan = "#00AAFF";
const blue2 = "rgba(0,85,255,0.18)";
const dim  = "#3A5A8A";

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    // Simulate form submission (replace with real API route if needed)
    await new Promise(r => setTimeout(r, 1000));
    setStatus("sent");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px",
    background: "rgba(3,10,30,0.85)", border: "1px solid rgba(0,85,255,0.22)",
    borderRadius: 4, color: "#D6E4FF", fontSize: 14,
    fontFamily: "inherit", outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, letterSpacing: "0.16em",
    textTransform: "uppercase", color: cyan, marginBottom: 8,
  };

  if (status === "sent") {
    return (
      <div style={{
        padding: "32px", textAlign: "center",
        background: "rgba(0,85,255,0.06)", border: "1px solid rgba(0,85,255,0.25)",
        borderRadius: 6,
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
        <h3 style={{ fontSize: 20, fontWeight: 400, marginBottom: 8, color: "#D6E4FF" }}>Message sent!</h3>
        <p style={{ fontSize: 14, color: dim }}>
          Thank you for getting in touch. We aim to respond to all enquiries within 24–48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label htmlFor="name" style={labelStyle}>Your Name</label>
          <input
            id="name" name="name" type="text" required
            value={form.name} onChange={handleChange}
            placeholder="Jane Smith"
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="email" style={labelStyle}>Email Address</label>
          <input
            id="email" name="email" type="email" required
            value={form.email} onChange={handleChange}
            placeholder="jane@example.com"
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" style={labelStyle}>Subject</label>
        <select
          id="subject" name="subject" required
          value={form.subject} onChange={handleChange}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="">Select a topic…</option>
          <option value="test-question">Question about the test</option>
          <option value="payment">Payment / billing issue</option>
          <option value="report">Premium report issue</option>
          <option value="score">Score or results query</option>
          <option value="data">Data privacy request</option>
          <option value="press">Press / partnership</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" style={labelStyle}>Message</label>
        <textarea
          id="message" name="message" required rows={6}
          value={form.message} onChange={handleChange}
          placeholder="Describe your question or issue in as much detail as you can…"
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          padding: "14px 32px", background: blue, color: "#fff",
          border: "none", borderRadius: 2, cursor: status === "sending" ? "wait" : "pointer",
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase",
          boxShadow: `0 0 18px rgba(0,85,255,0.45)`,
          opacity: status === "sending" ? 0.7 : 1,
          transition: "opacity 0.2s",
          alignSelf: "flex-start",
          fontFamily: "inherit",
        }}
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <ContentShell
      eyebrow="Get in touch"
      title="Contact Us"
      subtitle="We read every message and aim to respond within 24–48 hours on business days."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48 }}>

        {/* Contact details */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 8 }}>
          {[
            { icon: "✉", title: "Email", info: "supportrealitest@gmail.com", sub: "General enquiries & support", href: "mailto:supportrealitest@gmail.com" },
            { icon: "⏱", title: "Response Time", info: "24–48 hours", sub: "On business days (Mon–Fri)", href: null },
            { icon: "🌍", title: "Location", info: "European Union", sub: "GDPR compliant · Data stays in EU", href: null },
          ].map((card, i) => (
            <div key={i} style={{
              padding: "20px 24px",
              background: "rgba(3,10,30,0.85)", border: "1px solid rgba(0,85,255,0.18)",
              borderRadius: 6,
            }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{card.icon}</div>
              <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#00AAFF", marginBottom: 6 }}>{card.title}</div>
              {card.href ? (
                <a href={card.href} style={{ fontSize: 14, color: "#D6E4FF", textDecoration: "underline", display: "block", marginBottom: 4 }}>{card.info}</a>
              ) : (
                <div style={{ fontSize: 14, color: "#D6E4FF", marginBottom: 4 }}>{card.info}</div>
              )}
              <div style={{ fontSize: 12, color: "#3A5A8A" }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div>
          <Section title="Send us a message">
            <ContactForm />
          </Section>
        </div>

        {/* FAQ link */}
        <div style={{
          padding: "24px", background: "rgba(0,85,255,0.05)",
          border: "1px solid rgba(0,85,255,0.15)", borderRadius: 6,
        }}>
          <p style={{ fontSize: 14, color: "#8AAAD0", marginBottom: 10 }}>
            <strong style={{ color: "#D6E4FF" }}>Looking for a quick answer?</strong>
          </p>
          <p style={{ fontSize: 14, color: "#3A5A8A", lineHeight: 1.7 }}>
            Many common questions are answered in our{" "}
            <a href="/faq" style={{ color: "#00AAFF", textDecoration: "underline" }}>FAQ page</a>
            , including information about how scores are calculated, what the premium report includes,
            data privacy, and how to retake the test.
          </p>
        </div>
      </div>
    </ContentShell>
  );
}
