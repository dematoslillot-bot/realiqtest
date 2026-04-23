"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ── Neural Network Canvas ─────────────────────────────────────────────── */

function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const G = "201,169,110";
    const MAX_D = 138;
    const FIRE_MS = 360;

    interface Node {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      phase: number; phaseSpeed: number;
    }
    interface Pulse {
      i: number; j: number;
      t: number; speed: number;
    }

    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    let lastFire = 0;

    function build(w: number, h: number) {
      const count = Math.round(Math.max(28, Math.min(68, (w * h) / 7500)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 1.8 + Math.random() * 2.6,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.011 + Math.random() * 0.017,
      }));
      pulses = [];
    }

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build(w, h);
    }

    function spawnPulse() {
      const n = nodes.length;
      for (let k = 0; k < 40; k++) {
        const i = Math.floor(Math.random() * n);
        const j = Math.floor(Math.random() * n);
        if (i === j) continue;
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (dx * dx + dy * dy < MAX_D * MAX_D) {
          pulses.push({ i, j, t: 0, speed: 0.011 + Math.random() * 0.017 });
          return;
        }
      }
    }

    function draw(ts: number) {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      if (ts - lastFire > FIRE_MS) {
        spawnPulse();
        if (Math.random() < 0.55) spawnPulse();
        lastFire = ts;
      }

      for (const nd of nodes) {
        nd.x += nd.vx; nd.y += nd.vy;
        nd.phase += nd.phaseSpeed;
        if (nd.x < 0) { nd.x = 0; nd.vx *= -1; }
        if (nd.x > w) { nd.x = w; nd.vx *= -1; }
        if (nd.y < 0) { nd.y = 0; nd.vy *= -1; }
        if (nd.y > h) { nd.y = h; nd.vy *= -1; }
      }

      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MAX_D * MAX_D) {
            ctx.strokeStyle = `rgba(${G},${(1 - Math.sqrt(d2) / MAX_D) * 0.11})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      pulses = pulses.filter(p => {
        p.t += p.speed;
        const a = nodes[p.i];
        const b = nodes[p.j];
        const env = Math.sin(p.t * Math.PI);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${G},${env * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        const px = a.x + (b.x - a.x) * p.t;
        const py = a.y + (b.y - a.y) * p.t;

        const halo = ctx.createRadialGradient(px, py, 0, px, py, 9);
        halo.addColorStop(0, `rgba(${G},${env * 0.5})`);
        halo.addColorStop(1, `rgba(${G},0)`);
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${G},${env * 0.92})`;
        ctx.fill();

        return p.t < 1;
      });

      for (const nd of nodes) {
        const pulse = 0.5 + 0.5 * Math.sin(nd.phase);

        const glo = ctx.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, nd.r * 5.5);
        glo.addColorStop(0, `rgba(${G},${0.1 + pulse * 0.2})`);
        glo.addColorStop(1, `rgba(${G},0)`);
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, nd.r * 5.5, 0, Math.PI * 2);
        ctx.fillStyle = glo;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(nd.x, nd.y, nd.r * (0.75 + pulse * 0.45), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${G},${0.5 + pulse * 0.5})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}

/* ── Stat Counter ──────────────────────────────────────────────────────── */

function StatCounter({
  value,
  suffix,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        const dur = 1500;
        const t0 = performance.now();
        const fmt = (v: number) =>
          decimals ? v.toFixed(decimals) : String(Math.round(v));
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(value * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = fmt(value) + suffix;
        };
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, suffix, decimals]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {decimals ? value.toFixed(decimals) : value}
      {suffix}
    </span>
  );
}

/* ── Data ──────────────────────────────────────────────────────────────── */

const PILLARS = [
  { n: "01", name: "Logical Reasoning",   desc: "Identify patterns and solve abstract problems under time pressure." },
  { n: "02", name: "Verbal Intelligence", desc: "Analogies, vocabulary depth and linguistic structure." },
  { n: "03", name: "Spatial Reasoning",   desc: "Rotate and manipulate 2D and 3D shapes mentally." },
  { n: "04", name: "Numerical Ability",   desc: "Number sequences, arithmetic and quantitative reasoning." },
  { n: "05", name: "Working Memory",      desc: "Hold and manipulate information under cognitive load." },
  { n: "06", name: "Processing Speed",    desc: "Rapid decisions and reaction-based cognitive efficiency." },
];

const STEPS = [
  { n: "01", title: "Answer 30 questions",               desc: "5 questions across each of the 6 cognitive dimensions. All solvable mentally — no pen or paper needed." },
  { n: "02", title: "Algorithm scores your responses",   desc: "Our model weights accuracy, speed and category performance against 2.4 million data points." },
  { n: "03", title: "Receive your IQ score instantly",   desc: "Free report with your overall IQ. Unlock the full premium report for €1.99." },
];

const FEATURES = [
  { title: "Cognitive Radar Chart",        desc: "Visual spider chart showing your strengths across all 6 dimensions at a glance." },
  { title: "Full Category Breakdown",      desc: "Detailed score and analysis for each cognitive category with personalised feedback." },
  { title: "Global Percentile Rank",       desc: "See exactly where you stand compared to thousands of other test takers." },
  { title: "Career Matches",               desc: "Discover which careers align best with your unique cognitive profile." },
  { title: "Improvement Tips",             desc: "Personalised advice to strengthen each cognitive area — backed by neuroscience." },
  { title: "Famous IQ Comparisons",        desc: "See how your score compares to well-known figures and historical geniuses." },
  { title: "Official PDF Certificate",     desc: "Download your personalised IQ certificate to share or keep as a record." },
  { title: "Strengths and Weaknesses",     desc: "Clear identification of your cognitive superpowers and areas for growth." },
];

const FREE_FEATURES    = ["Full 30-question test", "Overall IQ score", "Population percentile"];
const LOCKED_FEATURES  = ["Radar chart", "Category breakdown", "Career matches", "PDF certificate"];
const PREMIUM_FEATURES = [
  "Full 30-question test", "Overall IQ score", "Population percentile",
  "Radar chart", "Category breakdown", "Career matches",
  "Improvement tips", "Famous comparisons", "PDF certificate",
];

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function Home() {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () =>
      nav.classList.toggle("nav-scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div style={{ background: "#0a0a0a", color: "#e8e6e0" }}>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav
        ref={navRef}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 24px",
          background: "rgba(10,10,10,0.9)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid transparent",
          transition: "border-color 0.3s",
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            fontSize: "17px", fontWeight: 600, color: "#e8e6e0",
            letterSpacing: "-0.02em", fontFamily: "inherit",
          }}
        >
          Real<span style={{ color: "#c9a96e" }}>IQ</span>Test
        </button>

        <ul
          className="nav-links"
          style={{ gap: "32px", listStyle: "none", margin: 0, padding: 0 }}
        >
          {["The Test", "How it works", "Pricing"].map(l => (
            <li
              key={l}
              style={{ fontSize: "13px", color: "#6b6b6b", cursor: "pointer", transition: "color 0.15s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#e8e6e0")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#6b6b6b")}
            >
              {l}
            </li>
          ))}
        </ul>

        <button onClick={() => router.push("/test")} className="btn btn-gold">
          Start Free
        </button>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative", minHeight: "100dvh",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div className="canvas-wrap">
          <NeuralCanvas />
        </div>

        <div style={{
          position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
          background: "rgba(10,10,10,0.54)", pointerEvents: "none",
        }} />

        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", padding: "96px 16px 64px",
          width: "100%", minHeight: "100dvh", justifyContent: "center",
        }}>
          <div className="h1" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <span style={{ width: 20, height: 1, background: "#c9a96e", display: "block" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: "#c9a96e" }}>
              Scientifically calibrated
            </span>
            <span style={{ width: 20, height: 1, background: "#c9a96e", display: "block" }} />
          </div>

          <h1 className="h2 hero-title">
            Discover your<br />true intelligence
          </h1>

          <p className="h3 hero-sub">
            30 questions across 6 cognitive dimensions — designed around
            standardised assessment formats. No fluff. Your actual score.
          </p>

          <div className="h4 hero-ctas">
            <button onClick={() => router.push("/test")} className="btn btn-gold">
              Take the Test — Free
            </button>
            <button className="btn btn-outline">
              View Sample Report
            </button>
          </div>

          <p className="h4" style={{
            marginTop: 28, fontSize: 11, letterSpacing: "0.08em",
            color: "#555", textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          }}>
            30 questions · 6 dimensions · ~15 min · No signup required
          </p>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div style={{ background: "#111", borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
        <div className="stats-grid">
          {[
            { value: 30,  suffix: "",       label: "Questions" },
            { value: 6,   suffix: "",       label: "Cognitive dimensions" },
            { value: 15,  suffix: " min",   label: "Average duration" },
            { value: 1.99, suffix: "€", decimals: 2, label: "Full report" },
          ].map((s, i) => (
            <div key={i} className="stat-cell reveal" style={{ transitionDelay: `${i * 60}ms` }}>
              <div style={{ fontSize: 32, fontWeight: 500, color: "#c9a96e", fontVariantNumeric: "tabular-nums", marginBottom: 6 }}>
                <StatCounter value={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b6b6b" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Six Pillars ──────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="reveal sec-hd">
            <p className="label">What we measure</p>
            <h2 className="sec-title">Six pillars of intelligence</h2>
            <p className="sec-sub">5 questions per dimension · 30 questions total</p>
          </div>
          <div className="pillars-grid">
            {PILLARS.map((p, i) => (
              <div key={i} className="card reveal" style={{ transitionDelay: `${i * 50}ms` }}>
                <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.2em", color: "#c9a96e", opacity: 0.5, marginBottom: 14 }}>
                  {p.n}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: "#6b6b6b", lineHeight: 1.65 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="section" style={{ background: "#0d0d0d" }}>
        <div className="container">
          <div className="how-grid">
            <div className="reveal">
              <p className="label">How it works</p>
              <h2 className="sec-title" style={{ marginBottom: 48 }}>
                Simple process,<br />deep insights
              </h2>
              <div style={{ borderTop: "1px solid #1e1e1e" }}>
                {STEPS.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 24, padding: "28px 0", borderBottom: "1px solid #1e1e1e" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 22, color: "#c9a96e", opacity: 0.22, minWidth: 44, lineHeight: 1 }}>
                      {s.n}
                    </span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{s.title}</div>
                      <div style={{ fontSize: 13, color: "#6b6b6b", lineHeight: 1.65 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card reveal" style={{ transitionDelay: "100ms", padding: 28 }}>
              <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b6b6b", marginBottom: 24 }}>
                Sample result
              </p>
              <div style={{ fontSize: 88, fontWeight: 300, color: "#c9a96e", lineHeight: 1, marginBottom: 8, letterSpacing: "-0.03em" }}>
                127
              </div>
              <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b6b6b", marginBottom: 12 }}>
                Intelligence Quotient
              </p>
              <div style={{ display: "inline-block", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", padding: "6px 16px", marginBottom: 24, border: "1px solid #c9a96e", color: "#c9a96e" }}>
                Superior Intelligence
              </div>
              <div style={{ height: 1, background: "#1e1e1e", position: "relative", overflow: "hidden", marginBottom: 4 }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "72%", background: "#c9a96e" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#444", marginBottom: 24 }}>
                <span>70</span><span>100</span><span>145+</span>
              </div>
              {[["Logic", 88], ["Verbal", 75], ["Spatial", 70]].map(([n, w]) => (
                <div key={String(n)} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, marginBottom: 10 }}>
                  <span style={{ width: 64, textAlign: "right", color: "#6b6b6b", flexShrink: 0 }}>{n}</span>
                  <div style={{ flex: 1, height: 1, background: "#1e1e1e", position: "relative" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${w}%`, background: "#c9a96e" }} />
                  </div>
                </div>
              ))}
              {[["Numerical", 82], ["Memory", 65]].map(([n, w]) => (
                <div key={String(n)} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, marginBottom: 10, filter: "blur(4px)", opacity: 0.18, userSelect: "none" }}>
                  <span style={{ width: 64, textAlign: "right", color: "#6b6b6b", flexShrink: 0 }}>{n}</span>
                  <div style={{ flex: 1, height: 1, background: "#1e1e1e", position: "relative" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${w}%`, background: "#c9a96e" }} />
                  </div>
                </div>
              ))}
              <p style={{ fontSize: 12, marginTop: 16, color: "#444" }}>
                Full breakdown unlocked with Premium Report
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Premium Features ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="reveal sec-hd">
            <p className="label">Premium Report</p>
            <h2 className="sec-title">Everything in the full report</h2>
            <p className="sec-sub">One-time payment · €1.99 · Instant access</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="card reveal" style={{ transitionDelay: `${i * 35}ms`, display: "flex", gap: 16 }}>
                <span style={{ color: "#c9a96e", fontFamily: "monospace", fontSize: 14, marginTop: 2, flexShrink: 0 }}>+</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: "#6b6b6b", lineHeight: 1.65 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ marginTop: 40, transitionDelay: "160ms" }}>
            <button onClick={() => router.push("/test")} className="btn btn-gold">
              Take the Free Test First
            </button>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: "#0d0d0d" }}>
        <div className="container">
          <div className="reveal sec-hd">
            <p className="label">Pricing</p>
            <h2 className="sec-title">Free to start,<br />powerful when unlocked</h2>
          </div>
          <div className="pricing-grid">
            <div className="card reveal" style={{ transitionDelay: "60ms", padding: 32 }}>
              <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b6b6b", marginBottom: 16 }}>Basic</p>
              <div style={{ fontSize: 48, fontWeight: 300, letterSpacing: "-0.03em", marginBottom: 8 }}>Free</div>
              <p style={{ fontSize: 13, color: "#6b6b6b", lineHeight: 1.65, marginBottom: 28 }}>
                Take the full test and receive your overall IQ score instantly.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                {FREE_FEATURES.map(f => (
                  <li key={f} style={{ display: "flex", gap: 12, fontSize: 13 }}>
                    <span style={{ color: "#c9a96e" }}>+</span><span>{f}</span>
                  </li>
                ))}
                {LOCKED_FEATURES.map(f => (
                  <li key={f} style={{ display: "flex", gap: 12, fontSize: 13, opacity: 0.22 }}>
                    <span>+</span><span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push("/test")} className="btn btn-outline" style={{ width: "100%" }}>
                Start Free
              </button>
            </div>

            <div className="card reveal" style={{ transitionDelay: "120ms", padding: 32, borderLeft: "3px solid #c9a96e" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b6b6b" }}>
                  Premium Report
                </p>
                <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", background: "rgba(201,169,110,0.1)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.25)" }}>
                  Best value
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 14, textDecoration: "line-through", color: "#444" }}>€3.99</span>
                <span style={{ fontSize: 48, fontWeight: 300, letterSpacing: "-0.03em" }}>€1.99</span>
              </div>
              <p style={{ fontSize: 13, color: "#6b6b6b", lineHeight: 1.65, marginBottom: 28 }}>
                Complete cognitive profile with everything you need.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                {PREMIUM_FEATURES.map(f => (
                  <li key={f} style={{ display: "flex", gap: 12, fontSize: 13 }}>
                    <span style={{ color: "#c9a96e" }}>+</span><span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push("/test")} className="btn btn-gold" style={{ width: "100%" }}>
                Get Premium Report
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ───────────────────────────────────────────────────── */}
      <section className="section" style={{ borderTop: "1px solid #1a1a1a" }}>
        <div className="container">
          <div className="reveal" style={{ maxWidth: 560 }}>
            <h2 style={{ fontSize: "clamp(34px, 5vw, 54px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
              Ready to discover<br />your true IQ?
            </h2>
            <p style={{ fontSize: 14, color: "#6b6b6b", lineHeight: 1.7, marginBottom: 32, maxWidth: 360 }}>
              No registration required. Results in ~15 minutes. Based on standardised cognitive assessment formats.
            </p>
            <button onClick={() => router.push("/test")} className="btn btn-gold">
              Begin the Test — Free
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{
        display: "flex", flexWrap: "wrap", justifyContent: "space-between",
        alignItems: "center", padding: "20px 24px", gap: 12,
        borderTop: "1px solid #1a1a1a",
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>
          Real<span style={{ color: "#c9a96e" }}>IQ</span>Test
        </span>
        <span style={{ fontSize: 12, color: "#444" }}>
          © 2026 RealIQTest ·{" "}
          <Link href="/privacy" style={{ color: "#6b6b6b", textDecoration: "none" }}>Privacy</Link>
          {" · "}
          <Link href="/terms" style={{ color: "#6b6b6b", textDecoration: "none" }}>Terms</Link>
        </span>
        <span style={{ fontSize: 12, color: "#444" }}>realiqtest.co</span>
      </footer>

    </div>
  );
}
