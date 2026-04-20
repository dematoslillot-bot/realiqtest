"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/* ─── Neural Network Canvas ──────────────────────────────────────────────── */

function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const G = "201,169,110"; // #c9a96e
    const MAX_DIST = 135;
    const FIRE_INTERVAL = 380;

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

    function initNodes(w: number, h: number) {
      const count = Math.round(Math.max(30, Math.min(72, (w * h) / 7000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 1.8 + Math.random() * 2.8,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.011 + Math.random() * 0.017,
      }));
    }

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes(w, h);
    }

    function spawnPulse() {
      const n = nodes.length;
      for (let tries = 0; tries < 40; tries++) {
        const i = Math.floor(Math.random() * n);
        const j = Math.floor(Math.random() * n);
        if (i === j) continue;
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (dx * dx + dy * dy < MAX_DIST * MAX_DIST) {
          pulses.push({ i, j, t: 0, speed: 0.011 + Math.random() * 0.017 });
          return;
        }
      }
    }

    function draw(ts: number) {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Spawn new pulses
      if (ts - lastFire > FIRE_INTERVAL) {
        spawnPulse();
        if (Math.random() < 0.55) spawnPulse();
        lastFire = ts;
      }

      // Move nodes
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy; n.phase += n.phaseSpeed;
        if (n.x < 0)  { n.x = 0;  n.vx *= -1; }
        if (n.x > w)  { n.x = w;  n.vx *= -1; }
        if (n.y < 0)  { n.y = 0;  n.vy *= -1; }
        if (n.y > h)  { n.y = h;  n.vy *= -1; }
      }

      // Static edges
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MAX_DIST * MAX_DIST) {
            const a = (1 - Math.sqrt(d2) / MAX_DIST) * 0.11;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${G},${a})`;
            ctx.stroke();
          }
        }
      }

      // Firing pulses
      pulses = pulses.filter(p => {
        p.t += p.speed;
        const a = nodes[p.i], b = nodes[p.j];
        const env = Math.sin(p.t * Math.PI); // 0→1→0 envelope

        // Lit edge
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${G},${env * 0.65})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Traveling dot
        const px = a.x + (b.x - a.x) * p.t;
        const py = a.y + (b.y - a.y) * p.t;

        // Halo
        const halo = ctx.createRadialGradient(px, py, 0, px, py, 8);
        halo.addColorStop(0, `rgba(${G},${env * 0.55})`);
        halo.addColorStop(1, `rgba(${G},0)`);
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${G},${env * 0.95})`;
        ctx.fill();

        return p.t < 1;
      });

      // Nodes
      for (const n of nodes) {
        const pulse = 0.5 + 0.5 * Math.sin(n.phase);

        // Glow halo
        const glo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5.5);
        glo.addColorStop(0, `rgba(${G},${0.1 + pulse * 0.22})`);
        glo.addColorStop(1, `rgba(${G},0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 5.5, 0, Math.PI * 2);
        ctx.fillStyle = glo;
        ctx.fill();

        // Core node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (0.75 + pulse * 0.45), 0, Math.PI * 2);
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
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}

/* ─── Animated stat counter ─────────────────────────────────────────────── */

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
    if (!ref.current) return;
    let started = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          const t0 = performance.now();
          const dur = 1400;
          const el = ref.current!;
          const fmt = (v: number) =>
            decimals ? v.toFixed(decimals) : String(Math.round(v));
          const step = (now: number) => {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = fmt(value * eased) + suffix;
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = fmt(value) + suffix;
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [value, decimals, suffix]);

  return (
    <span
      ref={ref}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {decimals ? value.toFixed(decimals) : value}{suffix}
    </span>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function Home() {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);

  /* Nav scroll border */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 10) nav.classList.add("nav-scrolled");
      else nav.classList.remove("nav-scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll-reveal wiring */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
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
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div style={{ background: "#0a0a0a", color: "#e8e6e0" }}>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          background: "rgba(10,10,10,0.88)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid transparent",
          transition: "border-color 0.3s ease",
        }}
      >
        <button
          onClick={() => router.push("/")}
          className="font-serif text-lg tracking-tight"
          style={{ color: "#e8e6e0" }}
        >
          Real<span style={{ color: "#c9a96e" }}>IQ</span>Test
        </button>

        <ul className="hidden md:flex gap-8 text-sm">
          {["The Test", "How it works", "Pricing"].map(l => (
            <li
              key={l}
              className="cursor-pointer transition-colors duration-150"
              style={{ color: "#6b6b6b" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e8e6e0")}
              onMouseLeave={e => (e.currentTarget.style.color = "#6b6b6b")}
            >
              {l}
            </li>
          ))}
        </ul>

        <button
          onClick={() => router.push("/test")}
          className="btn-gold text-xs font-medium tracking-widest uppercase px-5 py-2.5"
        >
          Start Free
        </button>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex items-center min-h-[100dvh] overflow-hidden">

        {/* Neural canvas — right 52% on desktop, full-width dim bg on mobile */}
        <div
          className="absolute top-0 bottom-0 right-0 left-0 md:left-[48%] opacity-30 md:opacity-100"
          style={{ pointerEvents: "none" }}
        >
          <NeuralCanvas />
          {/* Gradient fade where canvas meets text (desktop) */}
          <div
            className="hidden md:block absolute inset-y-0 left-0 w-48"
            style={{
              background: "linear-gradient(to right, #0a0a0a 20%, rgba(10,10,10,0.7) 60%, transparent)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Solid left-half background on desktop keeps text crisp */}
        <div
          className="hidden md:block absolute top-0 bottom-0 left-0"
          style={{ width: "46%", background: "#0a0a0a", pointerEvents: "none" }}
        />

        {/* Mobile dark overlay so text stays readable */}
        <div
          className="md:hidden absolute inset-0"
          style={{ background: "rgba(10,10,10,0.62)", pointerEvents: "none" }}
        />

        {/* Text content */}
        <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center pt-28 pb-16 px-8 md:px-16 min-h-[100dvh]">

          <div className="hero-1 flex items-center gap-3 mb-10">
            <span className="w-5 h-px" style={{ background: "#c9a96e" }} />
            <span
              className="text-xs tracking-[0.18em] uppercase font-medium"
              style={{ color: "#c9a96e" }}
            >
              Scientifically calibrated
            </span>
          </div>

          <h1
            className="hero-2 leading-[1.02] mb-6"
            style={{ fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 300, letterSpacing: "-2px" }}
          >
            Measure<br />what matters.
          </h1>

          <p
            className="hero-3 text-base leading-[1.75] mb-10 max-w-sm"
            style={{ color: "#6b6b6b" }}
          >
            A 52-question cognitive assessment calibrated against a population
            of 2.4 million. No fluff. No estimates. A score.
          </p>

          <div className="hero-4 flex gap-4 flex-wrap items-center">
            <button
              onClick={() => router.push("/test")}
              className="btn-gold text-xs font-medium tracking-widest uppercase"
            >
              Begin Assessment — Free
            </button>
            <button className="btn-outline text-xs tracking-widest uppercase">
              Sample Report
            </button>
          </div>

          {/* Social proof line */}
          <p
            className="hero-4 mt-8 text-xs tracking-wide"
            style={{ color: "#444444" }}
          >
            2.4M tests completed &nbsp;·&nbsp; Results in 15 min &nbsp;·&nbsp; No signup
          </p>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#141414",
          borderTop: "1px solid #141414",
          borderBottom: "1px solid #141414",
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
          {[
            { value: 2.4, suffix: "M+", decimals: 1, label: "Tests completed" },
            { value: 98,  suffix: "%",              label: "Accuracy rate" },
            { value: 15,  suffix: " min",           label: "Average duration" },
            { value: 4.9, suffix: "/5", decimals: 1, label: "User rating" },
          ].map((s, i) => (
            <div
              key={i}
              className="py-8 px-6 text-center reveal"
              style={{ background: "#0a0a0a", transitionDelay: `${i * 60}ms` }}
            >
              <div
                className="font-mono text-3xl mb-1.5 font-medium"
                style={{ color: "#c9a96e" }}
              >
                <StatCounter value={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div
                className="text-xs tracking-[0.14em] uppercase"
                style={{ color: "#6b6b6b" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="py-24 px-8 md:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="reveal mb-14">
            <p
              className="text-xs tracking-[0.18em] uppercase mb-3"
              style={{ color: "#c9a96e" }}
            >
              What we measure
            </p>
            <h2
              className="font-serif text-4xl leading-tight"
              style={{ letterSpacing: "-0.01em" }}
            >
              Six pillars of intelligence
            </h2>
          </div>

          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-px"
            style={{ background: "#141414" }}
          >
            {[
              { n: "01", name: "Logical Reasoning",  desc: "Identify patterns and solve abstract problems under time pressure." },
              { n: "02", name: "Verbal Intelligence", desc: "Analogies, vocabulary depth and linguistic structure." },
              { n: "03", name: "Spatial Reasoning",   desc: "Rotate and manipulate 2D and 3D shapes mentally." },
              { n: "04", name: "Numerical Ability",   desc: "Number sequences, arithmetic and quantitative reasoning." },
              { n: "05", name: "Working Memory",      desc: "Hold and manipulate information under cognitive load." },
              { n: "06", name: "Processing Speed",    desc: "Rapid decisions and reaction-based cognitive efficiency." },
            ].map((cat, i) => (
              <div
                key={i}
                className="p-7 reveal"
                style={{ background: "#0a0a0a", transitionDelay: `${i * 50}ms` }}
              >
                <div
                  className="font-mono text-xs mb-4 tracking-widest"
                  style={{ color: "#c9a96e", opacity: 0.45 }}
                >
                  {cat.n}
                </div>
                <div className="text-sm font-medium mb-2">{cat.name}</div>
                <div
                  className="text-xs leading-relaxed"
                  style={{ color: "#6b6b6b" }}
                >
                  {cat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="py-24 px-8 md:px-16" style={{ background: "#0d0d0d" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          <div className="reveal">
            <p
              className="text-xs tracking-[0.18em] uppercase mb-3"
              style={{ color: "#c9a96e" }}
            >
              How it works
            </p>
            <h2
              className="font-serif text-4xl mb-12"
              style={{ letterSpacing: "-0.01em" }}
            >
              Simple process,<br />deep insights
            </h2>
            <div style={{ borderTop: "1px solid #1e1e1e" }}>
              {[
                { n: "01", title: "Answer 52 questions", desc: "6 categories, varying question counts. All designed to be solved mentally — no pen or paper needed." },
                { n: "02", title: "Algorithm scores your responses", desc: "Our model weights accuracy, speed and category performance against 2.4 million data points." },
                { n: "03", title: "Receive your IQ score instantly", desc: "Free report with your overall IQ. Unlock the full premium report for €4.99." },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex gap-6 py-7"
                  style={{ borderBottom: "1px solid #1e1e1e" }}
                >
                  <div
                    className="font-mono text-2xl leading-none min-w-[3rem]"
                    style={{ color: "#c9a96e", opacity: 0.22 }}
                  >
                    {s.n}
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1.5">{s.title}</div>
                    <div className="text-xs leading-relaxed" style={{ color: "#6b6b6b" }}>
                      {s.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample result card */}
          <div
            className="reveal p-7"
            style={{
              background: "#0a0a0a",
              border: "1px solid #1e1e1e",
              transitionDelay: "120ms",
            }}
          >
            <p
              className="text-xs tracking-[0.14em] uppercase mb-6"
              style={{ color: "#6b6b6b" }}
            >
              Sample result
            </p>
            <div
              className="font-serif leading-none mb-2"
              style={{ fontSize: "88px", color: "#c9a96e" }}
            >
              127
            </div>
            <p
              className="text-xs tracking-[0.14em] uppercase mb-3"
              style={{ color: "#6b6b6b" }}
            >
              Intelligence Quotient
            </p>
            <div
              className="inline-block text-xs tracking-widest uppercase px-4 py-1.5 mb-6"
              style={{ border: "1px solid #c9a96e", color: "#c9a96e" }}
            >
              Superior Intelligence
            </div>
            <div
              className="h-px relative overflow-hidden mb-1"
              style={{ background: "#1e1e1e" }}
            >
              <div
                className="absolute left-0 top-0 h-full"
                style={{ width: "72%", background: "#c9a96e" }}
              />
            </div>
            <div
              className="flex justify-between text-xs mb-6"
              style={{ color: "#444444" }}
            >
              <span>70</span><span>100</span><span>145+</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {[["Logic", 88], ["Verbal", 75], ["Spatial", 70]].map(([n, w]) => (
                <div key={String(n)} className="flex items-center gap-3 text-xs">
                  <span className="w-16 text-right" style={{ color: "#6b6b6b" }}>{n}</span>
                  <div className="flex-1 h-px relative" style={{ background: "#1e1e1e" }}>
                    <div
                      className="absolute left-0 top-0 h-full"
                      style={{ width: `${w}%`, background: "#c9a96e" }}
                    />
                  </div>
                </div>
              ))}
              {[["Numerical", 82], ["Memory", 65]].map(([n, w]) => (
                <div
                  key={String(n)}
                  className="flex items-center gap-3 text-xs blur-sm opacity-25 select-none"
                >
                  <span className="w-16 text-right" style={{ color: "#6b6b6b" }}>{n}</span>
                  <div className="flex-1 h-px relative" style={{ background: "#1e1e1e" }}>
                    <div
                      className="absolute left-0 top-0 h-full"
                      style={{ width: `${w}%`, background: "#c9a96e" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs mt-5" style={{ color: "#444444" }}>
              Full breakdown unlocked with Premium Report
            </p>
          </div>
        </div>
      </section>

      {/* ── Premium features ─────────────────────────────────────────────── */}
      <section className="py-24 px-8 md:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="reveal mb-12">
            <p
              className="text-xs tracking-[0.18em] uppercase mb-3"
              style={{ color: "#c9a96e" }}
            >
              Premium Report
            </p>
            <h2
              className="font-serif text-4xl mb-3"
              style={{ letterSpacing: "-0.01em" }}
            >
              Everything in the full report
            </h2>
            <p className="text-sm" style={{ color: "#6b6b6b" }}>
              One-time payment. €4.99. Instant access.
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-px"
            style={{ background: "#141414" }}
          >
            {[
              { title: "Cognitive Radar Chart",          desc: "Visual spider chart showing your strengths and weaknesses across all 6 dimensions at a glance." },
              { title: "Full Category Breakdown",        desc: "Detailed score and analysis for each of the 6 cognitive categories with personalised feedback." },
              { title: "Global Percentile Rank",         desc: "See exactly where you stand compared to 2.4 million test takers worldwide." },
              { title: "Career Matches",                 desc: "Discover which careers and professions align best with your unique cognitive profile." },
              { title: "Improvement Tips",               desc: "Personalised, actionable advice to strengthen each cognitive area — backed by neuroscience." },
              { title: "Famous IQ Comparisons",          desc: "See how your score compares to well-known figures and historical geniuses." },
              { title: "Official PDF Certificate",       desc: "Download your personalised IQ certificate to share or keep as a record." },
              { title: "Strengths and Weaknesses Profile", desc: "Clear identification of your cognitive superpowers and areas with the most room to grow." },
            ].map((item, i) => (
              <div
                key={i}
                className="p-7 flex gap-5 reveal"
                style={{ background: "#0a0a0a", transitionDelay: `${i * 40}ms` }}
              >
                <span
                  className="text-sm mt-0.5 select-none font-mono"
                  style={{ color: "#c9a96e" }}
                >
                  +
                </span>
                <div>
                  <div className="text-sm font-medium mb-1.5">{item.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "#6b6b6b" }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 reveal" style={{ transitionDelay: "200ms" }}>
            <button
              onClick={() => router.push("/test")}
              className="btn-gold text-xs font-medium tracking-widest uppercase"
            >
              Take the Free Test First
            </button>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-8 md:px-16" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto">
          <div className="reveal mb-12">
            <p
              className="text-xs tracking-[0.18em] uppercase mb-3"
              style={{ color: "#c9a96e" }}
            >
              Pricing
            </p>
            <h2 className="font-serif text-4xl" style={{ letterSpacing: "-0.01em" }}>
              Free to start,<br />powerful when unlocked
            </h2>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-px"
            style={{ background: "#1e1e1e" }}
          >
            {/* Free tier */}
            <div
              className="p-8 reveal"
              style={{ background: "#0d0d0d", transitionDelay: "60ms" }}
            >
              <p
                className="text-xs tracking-[0.14em] uppercase mb-4"
                style={{ color: "#6b6b6b" }}
              >
                Basic
              </p>
              <div className="font-serif text-5xl mb-2" style={{ color: "#e8e6e0" }}>
                Free
              </div>
              <p
                className="text-xs leading-relaxed mb-8"
                style={{ color: "#6b6b6b" }}
              >
                Take the full test and receive your overall IQ score instantly.
              </p>
              <ul className="flex flex-col gap-2.5 mb-8">
                {["Full 52-question test", "Overall IQ score", "Population percentile"].map(f => (
                  <li key={f} className="flex gap-3 text-xs">
                    <span style={{ color: "#c9a96e" }}>+</span><span>{f}</span>
                  </li>
                ))}
                {["Radar chart", "Category breakdown", "Career matches", "PDF certificate"].map(f => (
                  <li key={f} className="flex gap-3 text-xs opacity-25">
                    <span>+</span><span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => router.push("/test")}
                className="btn-outline w-full py-3 text-xs font-medium tracking-widest uppercase"
              >
                Start Free
              </button>
            </div>

            {/* Premium tier */}
            <div
              className="p-8 reveal"
              style={{
                background: "#0d0d0d",
                borderLeft: "3px solid #c9a96e",
                transitionDelay: "120ms",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <p
                  className="text-xs tracking-[0.14em] uppercase"
                  style={{ color: "#6b6b6b" }}
                >
                  Premium Report
                </p>
                <span
                  className="text-xs tracking-wider uppercase px-2.5 py-1"
                  style={{
                    background: "rgba(201,169,110,0.1)",
                    color: "#c9a96e",
                    border: "1px solid rgba(201,169,110,0.25)",
                  }}
                >
                  Save 50%
                </span>
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-sm line-through" style={{ color: "#444444" }}>
                  €9.99
                </span>
                <span className="font-serif text-5xl" style={{ color: "#e8e6e0" }}>
                  €4.99
                </span>
              </div>
              <p
                className="text-xs leading-relaxed mb-8"
                style={{ color: "#6b6b6b" }}
              >
                Complete cognitive profile with everything you need to understand your intelligence.
              </p>
              <ul className="flex flex-col gap-2.5 mb-8">
                {[
                  "Full 52-question test", "Overall IQ score", "Population percentile",
                  "Radar chart", "Category breakdown", "Career matches",
                  "Improvement tips", "Famous comparisons", "PDF certificate",
                ].map(f => (
                  <li key={f} className="flex gap-3 text-xs">
                    <span style={{ color: "#c9a96e" }}>+</span><span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => router.push("/test")}
                className="btn-gold w-full py-3 text-xs font-medium tracking-widest uppercase"
              >
                Get Premium Report
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ───────────────────────────────────────────────────── */}
      <section
        className="py-24 px-8 md:px-16"
        style={{ borderTop: "1px solid #1e1e1e" }}
      >
        <div className="max-w-4xl mx-auto reveal">
          <h2
            className="font-serif text-5xl md:text-6xl mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            Ready to discover<br />your true IQ?
          </h2>
          <p
            className="text-sm mb-8 max-w-xs"
            style={{ color: "#6b6b6b", lineHeight: "1.7" }}
          >
            No registration required. Results in 15 minutes. 2.4 million tests completed.
          </p>
          <button
            onClick={() => router.push("/test")}
            className="btn-gold text-xs font-medium tracking-widest uppercase"
          >
            Begin the Test — Free
          </button>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        className="flex flex-wrap justify-between items-center px-8 py-6 gap-4"
        style={{ borderTop: "1px solid #1e1e1e" }}
      >
        <span className="font-serif text-sm" style={{ color: "#e8e6e0" }}>
          Real<span style={{ color: "#c9a96e" }}>IQ</span>Test
        </span>
        <span className="text-xs" style={{ color: "#444444" }}>
          © 2026 RealIQTest · Privacy · Terms
        </span>
        <span className="text-xs" style={{ color: "#444444" }}>realiqtest.co</span>
      </footer>
    </div>
  );
}
