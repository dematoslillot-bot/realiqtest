import Link from "next/link";

export const metadata = {
  title: "Terms of Service — RealIQTest",
  description: "Terms of Service for RealIQTest.co",
};

const LAST_UPDATED = "22 April 2026";
const CONTACT_EMAIL = "legal@realiqtest.co";

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p style={{ fontSize: 13, color: "#6b6b6b", marginBottom: 48 }}>
          Last updated: {LAST_UPDATED}
        </p>

        <Section title="1. Agreement to terms">
          <p>By accessing or using RealIQTest.co (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree, you must not use the Service. We reserve the right to update these Terms at any time. Continued use constitutes acceptance of any revisions.</p>
        </Section>

        <Section title="2. Nature of the service">
          <p>RealIQTest provides an online cognitive assessment designed for educational and entertainment purposes. <strong>Important limitations:</strong></p>
          <ul>
            <li>RealIQTest is <strong>not</strong> a clinically validated or medically certified IQ assessment.</li>
            <li>Results are estimates based on your performance on a 30-question test. They should not be used as a basis for medical, educational, employment, or clinical decisions.</li>
            <li>If you require a certified IQ assessment, please consult a licensed psychologist or neuropsychologist.</li>
            <li>Your score may vary between attempts due to factors including familiarity with question types, mood, and attention.</li>
          </ul>
        </Section>

        <Section title="3. Eligibility">
          <p>You must be at least 13 years of age to use this Service. By using the Service, you represent and warrant that you meet this age requirement. If you are under 18, you should have parental or guardian consent before making a purchase.</p>
        </Section>

        <Section title="4. Premium report — purchase terms">
          <p><strong>4.1 What you receive:</strong> Upon successful payment of €1.99, you receive immediate access to a detailed digital Premium Report for the test attempt associated with your payment session. This report includes category breakdowns, a radar chart, career matches, improvement tips, famous IQ comparisons, and a downloadable certificate.</p>
          <p style={{ marginTop: 10 }}><strong>4.2 Digital product:</strong> The Premium Report is a digital product delivered immediately upon purchase. By completing your purchase, you explicitly consent to immediate access and acknowledge that your right of withdrawal under EU consumer law is therefore lost upon delivery.</p>
          <p style={{ marginTop: 10 }}><strong>4.3 Refunds:</strong> Because the Premium Report is a digital product with immediate access, we do not offer refunds once the report has been delivered, except where:</p>
          <ul>
            <li>A technical error prevents you from accessing the report, and the error is on our side.</li>
            <li>You were charged multiple times for the same purchase due to a system error.</li>
          </ul>
          <p style={{ marginTop: 10 }}>To request a refund on eligible grounds, contact <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#c9a96e" }}>{CONTACT_EMAIL}</a> within 14 days of purchase, including your payment confirmation.</p>
          <p style={{ marginTop: 10 }}><strong>4.4 No subscription:</strong> The Premium Report is a one-time purchase. There is no recurring charge or subscription.</p>
          <p style={{ marginTop: 10 }}><strong>4.5 Payment processing:</strong> Payments are processed by Stripe. Your card details are handled securely by Stripe and are never stored by us. You can review Stripe&rsquo;s terms at <a href="https://stripe.com/ssa" target="_blank" rel="noopener noreferrer" style={{ color: "#c9a96e" }}>stripe.com/ssa</a>.</p>
        </Section>

        <Section title="5. Intellectual property">
          <p>All content on this website — including but not limited to the test questions, scoring algorithms, report design, graphics, text, and code — is owned by or licensed to RealIQTest and is protected by applicable intellectual property laws.</p>
          <p style={{ marginTop: 10 }}>You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any content from this Service without our prior written consent, except for your own personal, non-commercial use (such as downloading your own certificate).</p>
        </Section>

        <Section title="6. Prohibited uses">
          <p>You agree not to:</p>
          <ul>
            <li>Use automated bots, scrapers, or scripts to access or extract content from the Service.</li>
            <li>Attempt to circumvent payment systems or obtain premium content without paying.</li>
            <li>Reverse-engineer, decompile, or otherwise attempt to extract the source code or test questions for redistribution.</li>
            <li>Misrepresent your RealIQTest score as a certified clinical IQ score.</li>
            <li>Use the Service in any way that violates applicable law.</li>
          </ul>
        </Section>

        <Section title="7. Accuracy of results">
          <p>We make no warranties — express or implied — regarding the accuracy, completeness, or reliability of IQ scores produced by this Service. The assessment is designed to be cognitively engaging and is calibrated against standardised question formats, but it is not equivalent to a full psychometric evaluation administered by a qualified professional.</p>
          <p style={{ marginTop: 10 }}>Career match suggestions and famous IQ comparisons are provided for entertainment and general guidance only and should not be taken as career advice.</p>
        </Section>

        <Section title="8. Limitation of liability">
          <p>To the maximum extent permitted by law, RealIQTest and its operators shall not be liable for:</p>
          <ul>
            <li>Any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.</li>
            <li>Any loss of data, revenue, or profits.</li>
            <li>Any decisions made in reliance on your IQ score or report.</li>
          </ul>
          <p style={{ marginTop: 10 }}>In any case, our total liability to you for any claim arising from the Service shall not exceed the amount you paid us in the 12 months preceding the claim (which, in most cases, is €1.99).</p>
        </Section>

        <Section title="9. Disclaimer of warranties">
          <p>The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any warranty of any kind. We do not guarantee that the Service will be uninterrupted, error-free, or free of viruses or other harmful components. We reserve the right to modify, suspend, or discontinue the Service at any time without notice.</p>
        </Section>

        <Section title="10. Governing law">
          <p>These Terms are governed by the laws of Portugal. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts of Portugal, without prejudice to any mandatory consumer protection rights you may have under EU law.</p>
        </Section>

        <Section title="11. EU consumer rights">
          <p>If you are a consumer resident in the European Union, you have certain statutory rights that cannot be waived by these Terms, including rights under the EU Consumer Rights Directive. Nothing in these Terms limits or excludes those rights.</p>
        </Section>

        <Section title="12. Contact">
          <p>For legal enquiries, contact:<br />
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
          <Link href="/privacy" style={{ color: "#6b6b6b", textDecoration: "none" }}>Privacy</Link>
          <Link href="/terms" style={{ color: "#c9a96e", textDecoration: "none" }}>Terms</Link>
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
