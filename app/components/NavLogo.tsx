import Link from "next/link";

/* Shared nav logo — brain SVG + RealIQTest text, always links to "/" */
export default function NavLogo({ size = 17 }: { size?: number }) {
  return (
    <Link href="/" style={{
      display: "flex", alignItems: "center",
      textDecoration: "none",
      fontSize: size, fontWeight: 700,
      color: "#D6E4FF", letterSpacing: "-0.02em",
      fontFamily: "inherit",
    }}>
      <svg width="26" height="22" viewBox="0 0 28 24" fill="none"
        style={{ animation: "brain-pulse 2.5s ease-in-out infinite", flexShrink: 0, marginRight: 7 }}
        aria-hidden="true">
        <path d="M14 2 C14 2 8 2.5 5.5 5.5 C3 8.5 3 11 4 13.5 C5 16 7 17 8 19 C9 20.5 9.5 21.5 11.5 21.5 C12.5 21.5 13.5 21 14 20.5"
          stroke="#0055FF" strokeWidth="1.6" fill="rgba(0,85,255,0.08)" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2 C14 2 20 2.5 22.5 5.5 C25 8.5 25 11 24 13.5 C23 16 21 17 20 19 C19 20.5 18.5 21.5 16.5 21.5 C15.5 21.5 14.5 21 14 20.5"
          stroke="#00AAFF" strokeWidth="1.6" fill="rgba(0,170,255,0.06)" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 10 C8.5 8 10.5 9 11.5 11" stroke="#0055FF" strokeWidth="0.85" strokeLinecap="round" opacity="0.65"/>
        <path d="M6.5 14.5 C8.5 13 10 15 10.5 17" stroke="#0055FF" strokeWidth="0.85" strokeLinecap="round" opacity="0.55"/>
        <path d="M21 10 C19.5 8 17.5 9 16.5 11" stroke="#00AAFF" strokeWidth="0.85" strokeLinecap="round" opacity="0.65"/>
        <path d="M21.5 14.5 C19.5 13 18 15 17.5 17" stroke="#00AAFF" strokeWidth="0.85" strokeLinecap="round" opacity="0.55"/>
        <line x1="14" y1="2" x2="14" y2="20.5" stroke="rgba(0,170,255,0.25)" strokeWidth="0.7" strokeDasharray="2,2.5"/>
        <circle cx="8.5" cy="10" r="1.3" fill="#0055FF" opacity="0.85">
          <animate attributeName="opacity" values="0.85;1;0.5;1;0.85" dur="2.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="19.5" cy="10" r="1.3" fill="#00AAFF" opacity="0.75">
          <animate attributeName="opacity" values="0.75;1;0.5;1;0.75" dur="2.8s" repeatCount="indefinite" begin="0.6s"/>
        </circle>
        <circle cx="7.5" cy="15" r="1.1" fill="#0055FF" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.4;1;0.7" dur="1.9s" repeatCount="indefinite" begin="1.1s"/>
        </circle>
        <circle cx="20.5" cy="15" r="1.1" fill="#00AAFF" opacity="0.65">
          <animate attributeName="opacity" values="0.65;1;0.4;1;0.65" dur="2.4s" repeatCount="indefinite" begin="0.3s"/>
        </circle>
        <line x1="8.5" y1="10" x2="19.5" y2="10" stroke="rgba(0,170,255,0.22)" strokeWidth="0.5">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite"/>
        </line>
        <line x1="7.5" y1="15" x2="20.5" y2="15" stroke="rgba(0,85,255,0.18)" strokeWidth="0.5">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.1s" repeatCount="indefinite" begin="0.8s"/>
        </line>
      </svg>
      Real<span style={{ color: "#0055FF", textShadow: "0 0 14px rgba(0,85,255,0.8)" }}>IQ</span>Test
    </Link>
  );
}
