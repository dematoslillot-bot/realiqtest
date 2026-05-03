import Link from "next/link";

export const metadata = {
  title: "Page Not Found — RealIQTest",
  description: "The page you were looking for doesn't exist. Return to the RealIQTest homepage.",
};

const blue  = "#0055FF";
const cyan  = "#00AAFF";
const blue2 = "rgba(0,85,255,0.18)";
const dim   = "#3A5A8A";
const bg    = "#03050F";

const LINKS = [
  { href: "/",                   label: "Home" },
  { href: "/test",               label: "Take the Test" },
  { href: "/what-is-iq",        label: "What is IQ?" },
  { href: "/iq-score-ranges",   label: "IQ Score Ranges" },
  { href: "/cognitive-dimensions", label: "6 Cognitive Dimensions" },
  { href: "/how-to-improve-iq", label: "How to Improve IQ" },
  { href: "/faq",               label: "FAQ" },
  { href: "/contact",           label: "Contact" },
];

export default function NotFound() {
  return (
    <div style={{
      background: bg,
      color: "#D6E4FF",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Nav */}
      <nav style={{
        padding: "0 24px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${blue2}`,
        flexShrink: 0,
      }}>
        <Link href="/" style={{ textDecoration: "none", color: "#D6E4FF", fontWeight: 500, letterSpacing: "0.05em", fontSize: 15 }}>
          RealIQTest
        </Link>
        <Link href="/test" style={{
          padding: "8px 18px",
          background: blue,
          color: "#fff",
          textDecoration: "none",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          borderRadius: 2,
          boxShadow: "0 0 14px rgba(0,85,255,0.45)",
        }}>
          Take Test — Free
        </Link>
      </nav>

      {/* Main */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        textAlign: "center",
      }}>
        {/* Giant 404 */}
        <div style={{
          fontSize: "clamp(80px, 18vw, 160px)",
          fontWeight: 200,
          letterSpacing: "-0.05em",
          lineHeight: 1,
          color: "transparent",
          background: `linear-gradient(135deg, ${blue} 0%, ${cyan} 100%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          marginBottom: 24,
          filter: "drop-shadow(0 0 40px rgba(0,85,255,0.3))",
        }}>
          404
        </div>

        <p style={{ fontSize: 12, letterSpacing: "0.20em", textTransform: "uppercase", color: cyan, marginBottom: 16 }}>
          Page Not Found
        </p>

        <h1 style={{ fontSize: "clamp(18px, 3vw, 28px)", fontWeight: 300, color: "#D6E4FF", marginBottom: 14, maxWidth: 480 }}>
          This page doesn&apos;t exist — but your cognitive potential does.
        </h1>

        <p style={{ fontSize: 14, color: dim, marginBottom: 48, maxWidth: 400, lineHeight: 1.7 }}>
          The URL you requested wasn&apos;t found. Try one of the links below, or head back to the homepage.
        </p>

        {/* CTA */}
        <Link href="/test" style={{
          display: "inline-block",
          padding: "14px 32px",
          background: blue,
          color: "#fff",
          textDecoration: "none",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          borderRadius: 2,
          boxShadow: "0 0 24px rgba(0,85,255,0.5)",
          marginBottom: 48,
        }}>
          Take the Free IQ Test
        </Link>

        {/* Links grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 10,
          width: "100%",
          maxWidth: 600,
        }}>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{
              padding: "11px 16px",
              background: "rgba(0,85,255,0.06)",
              border: `1px solid ${blue2}`,
              color: "#8AAAD0",
              textDecoration: "none",
              borderRadius: 4,
              fontSize: 13,
              transition: "border-color 0.2s, color 0.2s",
            }}>
              {l.label}
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: "20px 24px",
        borderTop: `1px solid ${blue2}`,
        textAlign: "center",
        fontSize: 12,
        color: dim,
      }}>
        © 2026 RealIQTest · <Link href="/privacy" style={{ color: dim, textDecoration: "none" }}>Privacy</Link>
        {" · "}
        <Link href="/terms" style={{ color: dim, textDecoration: "none" }}>Terms</Link>
      </footer>
    </div>
  );
}
