"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "realiqtest_cookie_consent";

function loadAnalytics() {
  if (typeof document === "undefined") return;
  if (document.getElementById("ga-script")) return;

  // Google Analytics
  const s1 = document.createElement("script");
  s1.id = "ga-script";
  s1.src = "https://www.googletagmanager.com/gtag/js?id=G-GSBY8RNB29";
  s1.async = true;
  document.head.appendChild(s1);

  const s2 = document.createElement("script");
  s2.id = "ga-inline";
  s2.innerHTML = `window['dataLayer']=window['dataLayer']||[];function gtag(){window['dataLayer'].push(arguments);}gtag('js',new Date());gtag('config','G-GSBY8RNB29');`;
  document.head.appendChild(s2);

  // Google AdSense
  const s3 = document.createElement("script");
  s3.id = "adsense-script";
  s3.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1926703547029071";
  s3.async = true;
  s3.crossOrigin = "anonymous";
  document.head.appendChild(s3);
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted") {
      loadAnalytics();
    } else if (!stored) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
    loadAnalytics();
  }

  function reject() {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "rgba(3,10,30,0.97)",
        borderTop: "1px solid rgba(0,85,255,0.30)",
        backdropFilter: "blur(12px)",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        flexWrap: "wrap",
        boxShadow: "0 -4px 40px rgba(0,85,255,0.12)",
      }}
    >
      {/* Text */}
      <div style={{ flex: "1 1 360px", maxWidth: 680 }}>
        <p style={{ fontSize: 13, color: "#8AAAD0", lineHeight: 1.65, margin: 0 }}>
          <span style={{ color: "#D6E4FF", fontWeight: 500 }}>We use cookies</span>{" "}
          to analyse site traffic (Google Analytics) and display relevant advertising (Google AdSense).
          By clicking <strong style={{ color: "#D6E4FF" }}>Accept</strong>, you consent to the use of cookies for these purposes.
          You may <strong style={{ color: "#D6E4FF" }}>Reject</strong> non-essential cookies — the test will still work normally.
          See our{" "}
          <a href="/privacy" style={{ color: "#00AAFF", textDecoration: "underline" }}>Privacy Policy</a>{" "}
          for full details.
        </p>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <button
          onClick={reject}
          style={{
            padding: "10px 20px",
            background: "transparent",
            border: "1px solid rgba(0,85,255,0.35)",
            color: "#8AAAD0",
            borderRadius: 3,
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.06em",
            cursor: "pointer",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,85,255,0.65)";
            (e.currentTarget as HTMLButtonElement).style.color = "#D6E4FF";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,85,255,0.35)";
            (e.currentTarget as HTMLButtonElement).style.color = "#8AAAD0";
          }}
        >
          Reject
        </button>
        <button
          onClick={accept}
          style={{
            padding: "10px 24px",
            background: "#0055FF",
            border: "1px solid #0055FF",
            color: "#fff",
            borderRadius: 3,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.08em",
            cursor: "pointer",
            boxShadow: "0 0 16px rgba(0,85,255,0.45)",
            transition: "box-shadow 0.2s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 24px rgba(0,85,255,0.7)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(0,85,255,0.45)";
          }}
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
