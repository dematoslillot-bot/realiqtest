"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ── Neural Network Canvas (electric blue) ────────────────────────────── */

function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const G = "0,85,255";
    const MAX_D = 150;
    const FIRE_MS = 320;

    interface Node {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      phase: number; phaseSpeed: number;
    }
    interface Pulse { i: number; j: number; t: number; speed: number; }

    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    let lastFire = 0;

    function build(w: number, h: number) {
      const count = Math.round(Math.max(32, Math.min(72, (w * h) / 7000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
        r: 1.6 + Math.random() * 2.4,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.012 + Math.random() * 0.018,
      }));
      pulses = [];
    }

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build(w, h);
    }

    function spawnPulse() {
      const n = nodes.length;
      for (let k = 0; k < 40; k++) {
        const i = Math.floor(Math.random() * n);
        const j = Math.floor(Math.random() * n);
        if (i === j) continue;
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        if (dx * dx + dy * dy < MAX_D * MAX_D) {
          pulses.push({ i, j, t: 0, speed: 0.010 + Math.random() * 0.016 });
          return;
        }
      }
    }

    function draw(ts: number) {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      if (ts - lastFire > FIRE_MS) {
        spawnPulse();
        if (Math.random() < 0.6) spawnPulse();
        lastFire = ts;
      }

      for (const nd of nodes) {
        nd.x += nd.vx; nd.y += nd.vy; nd.phase += nd.phaseSpeed;
        if (nd.x < 0) { nd.x = 0; nd.vx *= -1; }
        if (nd.x > w) { nd.x = w; nd.vx *= -1; }
        if (nd.y < 0) { nd.y = 0; nd.vy *= -1; }
        if (nd.y > h) { nd.y = h; nd.vy *= -1; }
      }

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MAX_D * MAX_D) {
            ctx.strokeStyle = `rgba(${G},${(1 - Math.sqrt(d2) / MAX_D) * 0.09})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw pulses
      pulses = pulses.filter(p => {
        p.t += p.speed;
        const a = nodes[p.i], b = nodes[p.j];
        const env = Math.sin(p.t * Math.PI);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${G},${env * 0.55})`;
        ctx.lineWidth = 1.2; ctx.stroke();

        const px = a.x + (b.x - a.x) * p.t;
        const py = a.y + (b.y - a.y) * p.t;

        const halo = ctx.createRadialGradient(px, py, 0, px, py, 10);
        halo.addColorStop(0, `rgba(${G},${env * 0.6})`);
        halo.addColorStop(1, `rgba(${G},0)`);
        ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fillStyle = halo; ctx.fill();

        ctx.beginPath(); ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${G},${env * 0.95})`; ctx.fill();

        return p.t < 1;
      });

      // Draw nodes
      for (const nd of nodes) {
        const pulse = 0.5 + 0.5 * Math.sin(nd.phase);
        const glo = ctx.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, nd.r * 6);
        glo.addColorStop(0, `rgba(${G},${0.12 + pulse * 0.22})`);
        glo.addColorStop(1, `rgba(${G},0)`);
        ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.r * 6, 0, Math.PI * 2);
        ctx.fillStyle = glo; ctx.fill();

        ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.r * (0.7 + pulse * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${G},${0.55 + pulse * 0.45})`; ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas ref={ref} style={{ display: "block", width: "100%", height: "100%" }} aria-hidden="true" />
  );
}

/* ── Stat Counter ──────────────────────────────────────────────────────── */

function StatCounter({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      const dur = 1500, t0 = performance.now();
      const fmt = (v: number) => decimals ? v.toFixed(decimals) : String(Math.round(v));
      const tick = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = fmt(value * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = fmt(value) + suffix;
      };
      requestAnimationFrame(tick);
      io.disconnect();
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, suffix, decimals]);
  return <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>{decimals ? value.toFixed(decimals) : value}{suffix}</span>;
}

/* ── Data ──────────────────────────────────────────────────────────────── */

const PILLARS = [
  { n: "01", name: "Logical Reasoning",   desc: "Identify patterns and solve abstract matrix problems under time pressure." },
  { n: "02", name: "Verbal Intelligence", desc: "Analogies, vocabulary depth and linguistic structure comprehension." },
  { n: "03", name: "Spatial Reasoning",   desc: "Rotate and manipulate 2D and 3D shapes mentally." },
  { n: "04", name: "Numerical Ability",   desc: "Number series visualised as bar charts — quantitative reasoning." },
  { n: "05", name: "Working Memory",      desc: "Memorise colour sequences and recall them under cognitive load." },
  { n: "06", name: "Processing Speed",    desc: "Symbol matching and rapid decisions — cognitive efficiency." },
];

const STEPS = [
  { n: "01", title: "Answer 30 questions",               desc: "5 questions across each of the 6 cognitive dimensions. Visual patterns, rotations, series and sequences." },
  { n: "02", title: "Algorithm scores your responses",   desc: "Our model weights accuracy, speed and category performance against 2.4 million data points." },
  { n: "03", title: "Receive your IQ score instantly",   desc: "Free report with your overall IQ. Unlock the full premium report for €1.99." },
];

const FEATURES = [
  { title: "Cognitive Radar Chart",    desc: "Visual spider chart across all 6 dimensions at a glance." },
  { title: "Full Category Breakdown",  desc: "Detailed score and personalised analysis for each category." },
  { title: "Global Percentile Rank",   desc: "See exactly where you stand vs thousands of test takers." },
  { title: "Career Matches",           desc: "Careers that align with your unique cognitive profile." },
  { title: "Improvement Tips",         desc: "Personalised neuroscience-backed advice for each area." },
  { title: "Famous IQ Comparisons",    desc: "See how your score compares to historical geniuses." },
  { title: "Official PDF Certificate", desc: "Download your personalised IQ certificate." },
  { title: "Strengths and Weaknesses", desc: "Clear identification of cognitive superpowers and growth areas." },
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
    const onScroll = () => nav.classList.toggle("nav-scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add("visible"); io.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const blue  = "#0055FF";
  const blue2 = "rgba(0,85,255,0.18)";
  const dim   = "#3A5A8A";

  return (
    <div style={{ background: "#050A14", color: "#D6E4FF" }}>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav ref={navRef} style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px",
        background: "rgba(5,10,20,0.88)",
        backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid transparent",
        transition: "border-color 0.3s, background 0.3s, box-shadow 0.3s",
      }}>
        <button onClick={() => router.push("/")} style={{
          background: "none", border: "none", cursor: "pointer", padding: 0,
          fontSize: "17px", fontWeight: 600, color: "#D6E4FF",
          letterSpacing: "-0.02em", fontFamily: "inherit",
        }}>
          Real<span style={{ color: blue }}>IQ</span>Test
        </button>

        <ul className="nav-links" style={{ gap: "32px", listStyle: "none", margin: 0, padding: 0 }}>
          {["The Test", "How it works", "Pricing"].map(l => (
            <li key={l} style={{ fontSize: "13px", color: dim, cursor: "pointer", transition: "color 0.15s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#D6E4FF")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = dim)}>
              {l}
            </li>
          ))}
        </ul>

        <button onClick={() => router.push("/test")} className="btn btn-primary">
          Start Free
        </button>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div className="canvas-wrap"><NeuralCanvas /></div>

        <div style={{ position: "absolute", inset: 0, background: "rgba(5,10,20,0.52)", pointerEvents: "none" }} />

        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", padding: "96px 16px 64px",
          width: "100%", minHeight: "100dvh", justifyContent: "center",
        }}>
          <div className="h1" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <span style={{ width: 20, height: 1, background: blue, display: "block" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, color: blue, textShadow: `0 0 14px rgba(0,85,255,0.7)` }}>
              Scientifically calibrated
            </span>
            <span style={{ width: 20, height: 1, background: blue, display: "block" }} />
          </div>

          <h1 className="h2 hero-title">
            Discover your<br />true intelligence
          </h1>

          <p className="h3 hero-sub">
            30 visual questions across 6 cognitive dimensions — matrix patterns,
            mental rotation, number series and memory sequences. Your actual score.
          </p>

          <div className="h4 hero-ctas">
            <button onClick={() => router.push("/test")} className="btn btn-primary">
              Take the Test — Free
            </button>
            <button className="btn btn-outline">
              View Sample Report
            </button>
          </div>

          <p className="h4" style={{ marginTop: 28, fontSize: 10, letterSpacing: "0.10em", color: "#243A5A", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
            30 questions · 6 dimensions · ~15 min · No signup required
          </p>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div style={{ background: "#080E1A", borderTop: `1px solid ${blue2}`, borderBottom: `1px solid ${blue2}` }}>
        <div className="stats-grid">
          {[
            { value: 30,   suffix: "",    label: "Questions" },
            { value: 6,    suffix: "",    label: "Cognitive dimensions" },
            { value: 15,   suffix: " min",label: "Average duration" },
            { value: 1.99, suffix: "€", decimals: 2, label: "Full report" },
          ].map((s, i) => (
            <div key={i} className="stat-cell reveal" style={{ transitionDelay: `${i * 60}ms` }}>
              <div style={{ fontSize: 32, fontWeight: 500, color: blue, fontVariantNumeric: "tabular-nums", marginBottom: 6, textShadow: `0 0 20px rgba(0,85,255,0.5)` }}>
                <StatCounter value={s.value} suffix={s.suffix} decimals={(s as { decimals?: number }).decimals} />
              </div>
              <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: dim }}>{s.label}</div>
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
                <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.22em", color: blue, opacity: 0.5, marginBottom: 14 }}>{p.n}</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: dim, lineHeight: 1.65 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="section" style={{ background: "#080E1A" }}>
        <div className="container">
          <div className="how-grid">
            <div className="reveal">
              <p className="label">How it works</p>
              <h2 className="sec-title" style={{ marginBottom: 48 }}>Simple process,<br />deep insights</h2>
              <div style={{ borderTop: `1px solid ${blue2}` }}>
                {STEPS.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 24, padding: "28px 0", borderBottom: `1px solid ${blue2}` }}>
                    <span style={{ fontFamily: "monospace", fontSize: 22, color: blue, opacity: 0.22, minWidth: 44, lineHeight: 1 }}>{s.n}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{s.title}</div>
                      <div style={{ fontSize: 13, color: dim, lineHeight: 1.65 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card reveal" style={{ transitionDelay: "100ms", padding: 28 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: dim, marginBottom: 24 }}>Sample result</p>
              <div style={{ fontSize: 88, fontWeight: 300, color: blue, lineHeight: 1, marginBottom: 8, letterSpacing: "-0.03em", textShadow: `0 0 40px rgba(0,85,255,0.4)` }}>
                127
              </div>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: dim, marginBottom: 12 }}>Intelligence Quotient</p>
              <div style={{ display: "inline-block", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", padding: "6px 16px", marginBottom: 24, border: `1px solid ${blue}`, color: blue }}>
                Superior Intelligence
              </div>
              <div style={{ height: 3, background: blue2, position: "relative", overflow: "hidden", marginBottom: 4, borderRadius: 2 }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "72%", borderRadius: 2 }} className="progress-neon" />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: dim, marginBottom: 24 }}>
                <span>70</span><span>100</span><span>145+</span>
              </div>
              {[["Logic", 88], ["Verbal", 75], ["Spatial", 70]].map(([n, w]) => (
                <div key={String(n)} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, marginBottom: 10 }}>
                  <span style={{ width: 64, textAlign: "right", color: dim, flexShrink: 0 }}>{n}</span>
                  <div style={{ flex: 1, height: 2, background: blue2, position: "relative", borderRadius: 1 }}>
                    <div className="progress-neon" style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${w}%`, borderRadius: 1 }} />
                  </div>
                </div>
              ))}
              {[["Numerical", 82], ["Memory", 65]].map(([n, w]) => (
                <div key={String(n)} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, marginBottom: 10, filter: "blur(4px)", opacity: 0.15, userSelect: "none" }}>
                  <span style={{ width: 64, textAlign: "right", color: dim, flexShrink: 0 }}>{n}</span>
                  <div style={{ flex: 1, height: 2, background: blue2, position: "relative", borderRadius: 1 }}>
                    <div className="progress-neon" style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${w}%`, borderRadius: 1 }} />
                  </div>
                </div>
              ))}
              <p style={{ fontSize: 12, marginTop: 16, color: "#1E3460" }}>Full breakdown unlocked with Premium Report</p>
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
                <span style={{ color: blue, fontFamily: "monospace", fontSize: 14, marginTop: 2, flexShrink: 0, textShadow: `0 0 8px rgba(0,85,255,0.6)` }}>+</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: dim, lineHeight: 1.65 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ marginTop: 40, transitionDelay: "160ms" }}>
            <button onClick={() => router.push("/test")} className="btn btn-primary">
              Take the Free Test First
            </button>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: "#080E1A" }}>
        <div className="container">
          <div className="reveal sec-hd">
            <p className="label">Pricing</p>
            <h2 className="sec-title">Free to start,<br />powerful when unlocked</h2>
          </div>
          <div className="pricing-grid">
            <div className="card reveal" style={{ transitionDelay: "60ms", padding: 32 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: dim, marginBottom: 16 }}>Basic</p>
              <div style={{ fontSize: 48, fontWeight: 300, letterSpacing: "-0.03em", marginBottom: 8 }}>Free</div>
              <p style={{ fontSize: 13, color: dim, lineHeight: 1.65, marginBottom: 28 }}>Take the full test and receive your overall IQ score instantly.</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                {FREE_FEATURES.map(f => (
                  <li key={f} style={{ display: "flex", gap: 12, fontSize: 13 }}>
                    <span style={{ color: blue }}>+</span><span>{f}</span>
                  </li>
                ))}
                {LOCKED_FEATURES.map(f => (
                  <li key={f} style={{ display: "flex", gap: 12, fontSize: 13, opacity: 0.2 }}>
                    <span>+</span><span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push("/test")} className="btn btn-outline" style={{ width: "100%" }}>Start Free</button>
            </div>

            <div className="card reveal" style={{ transitionDelay: "120ms", padding: 32, borderLeft: `3px solid ${blue}`, boxShadow: `0 0 32px rgba(0,85,255,0.12)` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: dim }}>Premium Report</p>
                <span style={{ fontSize: 10, letterSpacing: "0.10em", textTransform: "uppercase", padding: "4px 10px", background: "rgba(0,85,255,0.12)", color: blue, border: `1px solid rgba(0,85,255,0.3)` }}>Best value</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 14, textDecoration: "line-through", color: dim }}>€3.99</span>
                <span style={{ fontSize: 48, fontWeight: 300, letterSpacing: "-0.03em" }}>€1.99</span>
              </div>
              <p style={{ fontSize: 13, color: dim, lineHeight: 1.65, marginBottom: 28 }}>Complete cognitive profile with everything you need.</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                {PREMIUM_FEATURES.map(f => (
                  <li key={f} style={{ display: "flex", gap: 12, fontSize: 13 }}>
                    <span style={{ color: blue }}>+</span><span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push("/test")} className="btn btn-primary" style={{ width: "100%" }}>Get Premium Report</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ───────────────────────────────────────────────────── */}
      <section className="section" style={{ borderTop: `1px solid ${blue2}` }}>
        <div className="container">
          <div className="reveal" style={{ maxWidth: 560 }}>
            <h2 style={{ fontSize: "clamp(34px,5vw,54px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
              Ready to discover<br />your true IQ?
            </h2>
            <p style={{ fontSize: 14, color: dim, lineHeight: 1.7, marginBottom: 32, maxWidth: 360 }}>
              No registration required. Results in ~15 minutes. Based on standardised cognitive assessment formats.
            </p>
            <button onClick={() => router.push("/test")} className="btn btn-primary">Begin the Test — Free</button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", gap: 12, borderTop: `1px solid ${blue2}` }}>
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>
          Real<span style={{ color: blue }}>IQ</span>Test
        </span>
        <span style={{ fontSize: 12, color: "#1E3460" }}>
          © 2026 RealIQTest ·{" "}
          <Link href="/privacy" style={{ color: dim, textDecoration: "none" }}>Privacy</Link>
          {" · "}
          <Link href="/terms" style={{ color: dim, textDecoration: "none" }}>Terms</Link>
        </span>
        <span style={{ fontSize: 12, color: "#1E3460" }}>realiqtest.co</span>
      </footer>
    </div>
  );
}
