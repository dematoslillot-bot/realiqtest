import Link from "next/link";
import type { ReactNode } from "react";

/* Shared wrapper for all content/resource pages.
   Server component — no "use client" needed. */

const blue  = "#0055FF";
const cyan  = "#00AAFF";
const blue2 = "rgba(0,85,255,0.15)";
const dim   = "#8AABCC";
const bg    = "#03050F";

const NAV_LINKS = [
  { href: "/rankings",    label: "Rankings" },
  { href: "/about",       label: "About" },
  { href: "/faq",         label: "FAQ" },
  { href: "/what-is-iq",  label: "What is IQ?" },
];

const RESOURCE_LINKS = [
  { href: "/what-is-iq",           label: "What is IQ?" },
  { href: "/cognitive-dimensions",  label: "Cognitive Dimensions" },
  { href: "/iq-score-ranges",       label: "IQ Score Ranges" },
  { href: "/how-to-improve-iq",     label: "How to Improve IQ" },
  { href: "/sample-questions",      label: "Sample Questions" },
];

const LEGAL_LINKS = [
  { href: "/about",      label: "About" },
  { href: "/contact",    label: "Contact" },
  { href: "/faq",        label: "FAQ" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/privacy",    label: "Privacy Policy" },
  { href: "/terms",      label: "Terms" },
];

interface ContentShellProps {
  children: ReactNode;
  /** Optional label shown above the page title in blue caps */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Prose area max-width (default 760px) */
  maxWidth?: number;
}

export default function ContentShell({ children, eyebrow, title, subtitle, maxWidth = 760 }: ContentShellProps) {
  return (
    <div style={{ background: bg, color: "#D6E4FF", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px", flexWrap: "wrap", gap: 12,
        borderBottom: `1px solid ${blue2}`,
        background: "rgba(3,5,15,0.95)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{
          fontSize: 17, fontWeight: 600, color: "#D6E4FF",
          textDecoration: "none", letterSpacing: "-0.02em",
        }}>
          Real<span style={{ color: blue, textShadow: `0 0 14px rgba(0,85,255,0.8)` }}>IQ</span>Test
        </Link>

        <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontSize: 13, color: dim, textDecoration: "none",
              transition: "color 0.15s",
            }}>{l.label}</Link>
          ))}
          <Link href="/test" style={{
            fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
            textTransform: "uppercase", padding: "10px 22px",
            background: blue, color: "#fff", textDecoration: "none",
            borderRadius: 2,
            boxShadow: `0 0 16px rgba(0,85,255,0.45)`,
          }}>Take Test — Free</Link>
        </div>
      </nav>

      {/* Page header */}
      <header style={{
        borderBottom: `1px solid ${blue2}`,
        background: "rgba(0,20,60,0.15)",
        padding: "48px 24px 40px",
      }}>
        <div style={{ maxWidth, margin: "0 auto" }}>
          {eyebrow && (
            <p style={{
              fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
              color: cyan, marginBottom: 12,
              textShadow: `0 0 12px rgba(0,170,255,0.6)`,
            }}>{eyebrow}</p>
          )}
          <h1 style={{
            fontSize: "clamp(28px,4vw,44px)", fontWeight: 300,
            letterSpacing: "-0.02em", lineHeight: 1.1,
            marginBottom: subtitle ? 12 : 0,
            color: "#D6E4FF",
          }}>{title}</h1>
          {subtitle && (
            <p style={{ fontSize: 15, color: dim, lineHeight: 1.65, maxWidth: 560, margin: 0 }}>{subtitle}</p>
          )}
        </div>
      </header>

      {/* Page content */}
      <main style={{ maxWidth, margin: "0 auto", padding: "56px 24px 80px" }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${blue2}`,
        background: "#020408",
        padding: "40px 24px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "grid", gap: 32,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            marginBottom: 36,
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, letterSpacing: "-0.01em" }}>
                Real<span style={{ color: blue }}>IQ</span>Test
              </div>
              <p style={{ fontSize: 12, color: dim, lineHeight: 1.7, maxWidth: 200 }}>
                Scientifically calibrated cognitive assessment across 6 dimensions.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: cyan, marginBottom: 14 }}>Resources</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {RESOURCE_LINKS.map(l => (
                  <Link key={l.href} href={l.href} style={{ fontSize: 13, color: dim, textDecoration: "none" }}>{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: cyan, marginBottom: 14 }}>Company</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {LEGAL_LINKS.map(l => (
                  <Link key={l.href} href={l.href} style={{ fontSize: 13, color: dim, textDecoration: "none" }}>{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: cyan, marginBottom: 14 }}>Start Testing</div>
              <Link href="/test" style={{
                display: "inline-block", fontSize: 11, fontWeight: 600,
                letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "12px 24px", background: blue, color: "#fff",
                textDecoration: "none", borderRadius: 2,
                boxShadow: `0 0 18px rgba(0,85,255,0.45)`,
              }}>Take Free Test</Link>
              <p style={{ fontSize: 12, color: dim, marginTop: 12, lineHeight: 1.6 }}>
                30 questions · 6 dimensions<br />~15 minutes · No signup
              </p>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${blue2}`, paddingTop: 20, fontSize: 12, color: "#6A88AA", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span>© 2026 RealIQTest · realiqtest.co</span>
            <span>For informational purposes only. Not a clinical diagnostic tool.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Prose helpers — use inside pages */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{
        fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 400,
        letterSpacing: "-0.01em", marginBottom: 16,
        color: "#D6E4FF",
        paddingBottom: 10,
        borderBottom: "1px solid rgba(0,85,255,0.12)",
      }}>{title}</h2>
      <div style={{ fontSize: 15, color: "#C0C8D8", lineHeight: 1.8 }}>{children}</div>
    </section>
  );
}

export function InfoCard({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <div style={{
      background: "rgba(3,10,30,0.85)", border: "1px solid rgba(0,85,255,0.18)",
      borderRadius: 6, padding: "20px 24px", marginBottom: 16,
      backdropFilter: "blur(12px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#D6E4FF" }}>{title}</span>
      </div>
      <div style={{ fontSize: 14, color: "#C0C8D8", lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}

export function Table({ headers, rows }: { headers: string[]; rows: (string | ReactNode)[][] }) {
  return (
    <div style={{ overflowX: "auto", marginBottom: 24 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                textAlign: "left", padding: "10px 16px",
                fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
                color: "#00AAFF", background: "rgba(0,85,255,0.08)",
                borderBottom: "1px solid rgba(0,85,255,0.25)",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid rgba(0,85,255,0.08)" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "10px 16px", color: "#C0C8D8", verticalAlign: "top" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
