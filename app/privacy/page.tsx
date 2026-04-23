import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — RealIQTest",
  description: "Privacy Policy for RealIQTest.co",
};

const LAST_UPDATED = "22 April 2026";
const CONTACT_EMAIL = "privacy@realiqtest.co";

export default function PrivacyPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#e8e6e0", minHeight: "100vh" }}>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px", borderBottom: "1px solid #1a1a1a",
        background: "rgba(10,10,10,0.95)",
      }}>
        <Link href="/" style={{ fontSize: 17, fontWeight: 600, color: "#e8e6e0", textDecoration: "none", letterSpacing: "-0.02em" }}>
          Real<span style={{ color: "#c9a96e" }}>IQ</span>Test
        </Link>
        <Link href="/" style={{ fontSize: 12, color: "#6b6b6b", textDecoration: "none" }}>← Back to home</Link>
      </nav>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 12 }}>
          Legal
        </p>
        <h1 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 300, letterSpacing: "-0.02em", marginBottom: 8 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 13, color: "#6b6b6b", marginBottom: 48 }}>
          Last updated: {LAST_UPDATED}
        </p>

        <Section title="1. Who we are">
          <p>RealIQTest (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the website realiqtest.co. We provide an online cognitive assessment tool and sell digital reports. Our contact address is <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#c9a96e" }}>{CONTACT_EMAIL}</a>.</p>
        </Section>

        <Section title="2. What data we collect">
          <p><strong>Data you provide directly:</strong></p>
          <ul>
            <li>Email address — collected when you purchase a premium report, passed to Stripe for payment processing.</li>
            <li>Payment information — your card details are entered directly into Stripe&rsquo;s secure hosted fields. We never see or store raw card data.</li>
          </ul>
          <p style={{ marginTop: 12 }}><strong>Data collected automatically:</strong></p>
          <ul>
            <li>Test answers and scores, stored in your browser&rsquo;s <code>localStorage</code> only. This data never leaves your device unless you proceed to purchase.</li>
            <li>Usage analytics via Google Analytics 4 (anonymised IP, page views, session duration). You can opt out via browser settings or a GA opt-out extension.</li>
            <li>Advertising data via Google AdSense, which may set cookies to serve contextual ads. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#c9a96e" }}>Google&rsquo;s Privacy Policy</a>.</li>
          </ul>
        </Section>

        <Section title="3. How we use your data">
          <ul>
            <li>To process your payment via Stripe and grant access to your premium report.</li>
            <li>To send a purchase receipt (handled by Stripe, not us).</li>
            <li>To understand how visitors use our site so we can improve it (Google Analytics).</li>
            <li>To serve advertising (Google AdSense).</li>
          </ul>
          <p style={{ marginTop: 12 }}>We do not sell, rent, or trade your personal data with third parties for their own marketing purposes.</p>
        </Section>

        <Section title="4. Legal basis for processing (GDPR)">
          <p>Where GDPR applies (EEA residents), we process your data on the following bases:</p>
          <ul>
            <li><strong>Contract performance</strong> — processing payment and delivering your purchased report.</li>
            <li><strong>Legitimate interests</strong> — site analytics to improve our service.</li>
            <li><strong>Consent</strong> — non-essential cookies (advertising). You may withdraw consent at any time via your browser settings.</li>
          </ul>
        </Section>

        <Section title="5. Cookies">
          <p>We use the following cookies:</p>
          <ul>
            <li><strong>Strictly necessary:</strong> None set by us. Stripe may set a session cookie during checkout.</li>
            <li><strong>Analytics:</strong> Google Analytics (_ga, _gid, _ga_*) — expire after up to 2 years. Used to measure site usage.</li>
            <li><strong>Advertising:</strong> Google AdSense (IDE, DSID, __gads) — expire after up to 13 months. Used for ad personalisation.</li>
          </ul>
          <p style={{ marginTop: 12 }}>You can manage or delete cookies via your browser settings at any time.</p>
        </Section>

        <Section title="6. Data retention">
          <ul>
            <li>Test scores in <code>localStorage</code>: stored in your browser until you clear site data. We cannot access this.</li>
            <li>Email addresses collected via Stripe: retained for up to 5 years for tax and accounting purposes, per Stripe&rsquo;s terms.</li>
            <li>Analytics data: retained by Google for 14 months (our GA4 setting), then automatically deleted.</li>
          </ul>
        </Section>

        <Section title="7. Third-party services">
          <ul>
            <li><strong>Stripe</strong> — payment processing. Stripe is PCI-DSS Level 1 certified. See <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#c9a96e" }}>Stripe Privacy Policy</a>.</li>
            <li><strong>Google Analytics 4</strong> — site analytics. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#c9a96e" }}>Google Privacy Policy</a>.</li>
            <li><strong>Google AdSense</strong> — advertising. See <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: "#c9a96e" }}>Google Ads Policy</a>.</li>
            <li><strong>Vercel</strong> — hosting. Vercel may log IP addresses in server logs for up to 7 days. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#c9a96e" }}>Vercel Privacy Policy</a>.</li>
          </ul>
        </Section>

        <Section title="8. Your rights">
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Erasure:</strong> Request deletion of your personal data.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate data.</li>
            <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
            <li><strong>Objection:</strong> Object to processing based on legitimate interests.</li>
            <li><strong>Withdraw consent:</strong> Withdraw consent for cookie-based processing at any time.</li>
          </ul>
          <p style={{ marginTop: 12 }}>To exercise any of these rights, email us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#c9a96e" }}>{CONTACT_EMAIL}</a>. We will respond within 30 days.</p>
        </Section>

        <Section title="9. Children">
          <p>RealIQTest is not directed at children under 13. We do not knowingly collect personal data from anyone under 13 years of age. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.</p>
        </Section>

        <Section title="10. International transfers">
          <p>Our service is operated from within the EU/EEA. However, our third-party providers (Stripe, Google) may transfer data internationally. These transfers are covered by Standard Contractual Clauses or equivalent safeguards recognised under GDPR.</p>
        </Section>

        <Section title="11. Changes to this policy">
          <p>We may update this Privacy Policy from time to time. When we do, we will update the &ldquo;Last updated&rdquo; date at the top. Continued use of our site after changes constitutes acceptance of the revised policy.</p>
        </Section>

        <Section title="12. Contact">
          <p>For any privacy-related questions or requests, contact us at:<br />
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#c9a96e" }}>{CONTACT_EMAIL}</a>
          </p>
        </Section>
      </main>

      <footer style={{
        borderTop: "1px solid #1a1a1a", padding: "20px 24px",
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Real<span style={{ color: "#c9a96e" }}>IQ</span>Test</span>
        <div style={{ display: "flex", gap: 24, fontSize: 12, color: "#444" }}>
          <Link href="/privacy" style={{ color: "#c9a96e", textDecoration: "none" }}>Privacy</Link>
          <Link href="/terms" style={{ color: "#6b6b6b", textDecoration: "none" }}>Terms</Link>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: "#e8e6e0", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #1a1a1a" }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, color: "#8a8890", lineHeight: 1.75 }}>
        {children}
      </div>
    </section>
  );
}
