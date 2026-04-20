"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [display, setDisplay] = useState(decimals ? "0.0" : "0");
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
          const step = (now: number) => {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const cur = value * eased;
            setDisplay(decimals ? cur.toFixed(decimals) : String(Math.round(cur)));
            if (p < 1) requestAnimationFrame(step);
            else setDisplay(decimals ? value.toFixed(decimals) : String(value));
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [value, decimals]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {display}{suffix}
    </span>
  );
}

/* ─── Scientific radar orb — hero visual ────────────────────────────────── */

function RadarOrb() {
  const cx = 200, cy = 200, R = 185;
  const rings = [44, 88, 132, 160, R];
  const spokes = Array.from({ length: 12 }, (_, i) => (i * 30 * Math.PI) / 180);

  const dataAngles = [0, 60, 120, 180, 240, 300].map(d => (d * Math.PI) / 180);
  const dataRadii  = [120, 118, 82, 152, 98, 138];
  const poly = dataAngles
    .map((a, i) => `${cx + dataRadii[i] * Math.cos(a)},${cy + dataRadii[i] * Math.sin(a)}`)
    .join(" ");

  return (
    <svg viewBox="0 0 400 400" fill="none" aria-hidden="true">
      {rings.map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={r}
          stroke="#9a8463" strokeWidth="0.5"
          opacity={i === rings.length - 1 ? undefined : 0.05 + i * 0.025}
          className={i === rings.length - 1 ? "animate-breathe-ring" : undefined}
        />
      ))}
      {spokes.map((a, i) => (
        <line key={i}
          x1={cx} y1={cy}
          x2={cx + R * Math.cos(a)} y2={cy + R * Math.sin(a)}
          stroke="#9a8463" strokeWidth="0.5" opacity="0.05"
        />
      ))}
      <polygon points={poly}
        fill="rgba(154,132,99,0.07)" stroke="#9a8463" strokeWidth="1" opacity="0.35"
      />
      {dataAngles.map((a, i) => (
        <circle key={i}
          cx={cx + dataRadii[i] * Math.cos(a)}
          cy={cy + dataRadii[i] * Math.sin(a)}
          r="2.5" fill="#9a8463" opacity="0.45"
        />
      ))}
      <circle cx={cx} cy={cy} r="3.5" fill="#9a8463" className="animate-breathe" />
    </svg>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function Home() {
  const router = useRouter();

  /* Scroll-reveal wiring */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add("is-visible");
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          background: "rgba(11,12,15,0.88)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <button onClick={() => router.push("/")}
          className="font-serif text-lg tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Real<span style={{ color: "var(--accent)" }}>IQ</span>Test
        </button>

        <ul className="hidden md:flex gap-8 text-sm" style={{ color: "var(--text-secondary)" }}>
          {["The Test", "How it works", "Pricing"].map(l => (
            <li key={l}
              className="cursor-pointer transition-colors duration-150"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
            >{l}</li>
          ))}
        </ul>

        <button onClick={() => router.push("/test")}
          className="btn-primary text-xs font-medium tracking-widest uppercase px-5 py-2.5"
        >
          Start Free
        </button>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex items-center min-h-[100dvh] pt-24 pb-16 px-8 md:px-16 overflow-hidden">
        {/* Subtle radial glow on the right */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 55% 55% at 72% 50%, rgba(154,132,99,0.05) 0%, transparent 70%)" }}
        />

        {/* Left: text */}
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-10 animate-fade-up" style={{ animationDelay: "60ms" }}>
            <span className="w-5 h-px" style={{ background: "var(--accent)" }} />
            <span className="text-xs tracking-[0.18em] uppercase font-medium" style={{ color: "var(--accent)" }}>
              Scientifically calibrated
            </span>
          </div>

          <h1 className="font-serif text-6xl md:text-[72px] leading-[1.05] mb-6 animate-fade-up"
            style={{ letterSpacing: "-0.02em", animationDelay: "160ms" }}
          >
            Measure<br />what matters.
          </h1>

          <p className="text-base leading-[1.7] mb-10 max-w-md animate-fade-up"
            style={{ color: "var(--text-secondary)", animationDelay: "260ms" }}
          >
            A 40-question cognitive assessment calibrated against a population
            of 2.4 million. No fluff. No estimates. A score.
          </p>

          <div className="flex gap-4 flex-wrap items-center animate-fade-up" style={{ animationDelay: "340ms" }}>
            <button onClick={() => router.push("/test")}
              className="btn-primary text-xs font-medium tracking-widest uppercase px-8 py-4"
            >
              Begin Assessment — Free
            </button>
            <button className="btn-ghost text-xs tracking-widest uppercase px-8 py-4">
              Sample Report
            </button>
          </div>
        </div>

        {/* Right: radar orb (hidden on mobile) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[460px] h-[460px] hidden md:block pointer-events-none">
          <RadarOrb />
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div style={{ background: "var(--border-subtle)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
          {[
            { value: 2.4, suffix: "M+", decimals: 1, label: "Tests completed" },
            { value: 98,  suffix: "%",             label: "Accuracy rate" },
            { value: 15,  suffix: " min",           label: "Average duration" },
            { value: 4.9, suffix: "★",  decimals: 1, label: "User rating" },
          ].map((s, i) => (
            <div key={i} className="py-8 px-6 text-center reveal"
              style={{ background: "var(--bg-base)", transitionDelay: `${i * 60}ms` }}
            >
              <div className="font-mono text-3xl mb-1.5 font-medium" style={{ color: "var(--accent)" }}>
                <StatCounter value={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="text-xs tracking-[0.14em] uppercase" style={{ color: "var(--text-secondary)" }}>
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
            <p className="text-xs tracking-[0.18em] uppercase mb-3" style={{ color: "var(--accent)" }}>
              What we measure
            </p>
            <h2 className="font-serif text-4xl leading-tight" style={{ letterSpacing: "-0.01em" }}>
              Six pillars of intelligence
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-px" style={{ background: "var(--border-subtle)" }}>
            {[
              { n: "01", name: "Logical Reasoning",  desc: "Identify patterns and solve abstract problems under time pressure." },
              { n: "02", name: "Verbal Intelligence", desc: "Analogies, vocabulary depth and linguistic structure." },
              { n: "03", name: "Spatial Reasoning",   desc: "Rotate and manipulate 2D and 3D shapes mentally." },
              { n: "04", name: "Numerical Ability",   desc: "Number sequences, arithmetic and quantitative reasoning." },
              { n: "05", name: "Working Memory",      desc: "Hold and manipulate information under cognitive load." },
              { n: "06", name: "Processing Speed",    desc: "Rapid decisions and reaction-based cognitive efficiency." },
            ].map((cat, i) => (
              <div key={i} className="p-7 reveal"
                style={{ background: "var(--bg-base)", transitionDelay: `${i * 50}ms` }}
              >
                <div className="font-mono text-xs mb-4 tracking-widest" style={{ color: "var(--accent)", opacity: 0.45 }}>
                  {cat.n}
                </div>
                <div className="text-sm font-medium mb-2">{cat.name}</div>
                <div className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {cat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="py-24 px-8 md:px-16" style={{ background: "var(--bg-surface)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          <div className="reveal">
            <p className="text-xs tracking-[0.18em] uppercase mb-3" style={{ color: "var(--accent)" }}>
              How it works
            </p>
            <h2 className="font-serif text-4xl mb-12" style={{ letterSpacing: "-0.01em" }}>
              Simple process,<br />deep insights
            </h2>
            <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
              {[
                { n: "01", title: "Answer 30 questions", desc: "6 categories, 5 questions each. All designed to be solved mentally — no pen or paper needed." },
                { n: "02", title: "Algorithm scores your responses", desc: "Our model weights accuracy, speed and category performance against 2.4 million data points." },
                { n: "03", title: "Receive your IQ score instantly", desc: "Free report with your overall IQ. Unlock the full premium report for €4.99." },
              ].map((s, i) => (
                <div key={i} className="flex gap-6 py-7" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <div className="font-mono text-2xl leading-none min-w-[3rem]" style={{ color: "var(--accent)", opacity: 0.22 }}>
                    {s.n}
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1.5">{s.title}</div>
                    <div className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample result card */}
          <div className="reveal p-7"
            style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", transitionDelay: "120ms" }}
          >
            <p className="text-xs tracking-[0.14em] uppercase mb-6" style={{ color: "var(--text-secondary)" }}>
              Sample result
            </p>
            <div className="font-serif leading-none mb-2" style={{ fontSize: "88px", color: "var(--accent)" }}>
              127
            </div>
            <p className="text-xs tracking-[0.14em] uppercase mb-3" style={{ color: "var(--text-secondary)" }}>
              Intelligence Quotient
            </p>
            <div className="inline-block text-xs tracking-widest uppercase px-4 py-1.5 mb-6"
              style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}
            >
              Superior Intelligence
            </div>
            <div className="h-px relative overflow-hidden mb-1" style={{ background: "var(--border-subtle)" }}>
              <div className="absolute left-0 top-0 h-full" style={{ width: "72%", background: "var(--accent)" }} />
            </div>
            <div className="flex justify-between text-xs mb-6" style={{ color: "var(--text-muted)" }}>
              <span>70</span><span>100</span><span>145+</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {[["Logic", 88], ["Verbal", 75], ["Spatial", 70]].map(([n, w]) => (
                <div key={String(n)} className="flex items-center gap-3 text-xs">
                  <span className="w-16 text-right" style={{ color: "var(--text-secondary)" }}>{n}</span>
                  <div className="flex-1 h-px relative" style={{ background: "var(--border-subtle)" }}>
                    <div className="absolute left-0 top-0 h-full" style={{ width: `${w}%`, background: "var(--accent)" }} />
                  </div>
                </div>
              ))}
              {[["Numerical", 82], ["Memory", 65]].map(([n, w]) => (
                <div key={String(n)} className="flex items-center gap-3 text-xs blur-sm opacity-25 select-none">
                  <span className="w-16 text-right" style={{ color: "var(--text-secondary)" }}>{n}</span>
                  <div className="flex-1 h-px relative" style={{ background: "var(--border-subtle)" }}>
                    <div className="absolute left-0 top-0 h-full" style={{ width: `${w}%`, background: "var(--accent)" }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs mt-5" style={{ color: "var(--text-muted)" }}>
              Full breakdown unlocked with Premium Report
            </p>
          </div>
        </div>
      </section>

      {/* ── Premium features ─────────────────────────────────────────────── */}
      <section className="py-24 px-8 md:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="reveal mb-12">
            <p className="text-xs tracking-[0.18em] uppercase mb-3" style={{ color: "var(--accent)" }}>
              Premium Report
            </p>
            <h2 className="font-serif text-4xl mb-3" style={{ letterSpacing: "-0.01em" }}>
              Everything in the full report
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              One-time payment. €4.99. Instant access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "var(--border-subtle)" }}>
            {[
              { title: "Cognitive Radar Chart",          desc: "Visual spider chart showing your strengths and weaknesses across all 6 dimensions at a glance." },
              { title: "Full Category Breakdown",        desc: "Detailed score and analysis for each of the 6 cognitive categories with personalised feedback." },
              { title: "Global Percentile Rank",         desc: "See exactly where you stand compared to 2.4 million test takers worldwide." },
              { title: "Career Matches",                 desc: "Discover which careers and professions align best with your unique cognitive profile." },
              { title: "Improvement Tips",               desc: "Personalised, actionable advice to strengthen each cognitive area — backed by neuroscience." },
              { title: "Famous IQ Comparisons",          desc: "See how your score compares to well-known figures and historical geniuses." },
              { title: "Official PDF Certificate",       desc: "Download your personalised IQ certificate to share or keep as a record." },
              { title: "Strengths & Weaknesses Profile", desc: "Clear identification of your cognitive superpowers and areas with the most room to grow." },
            ].map((item, i) => (
              <div key={i} className="p-7 flex gap-5 reveal"
                style={{ background: "var(--bg-base)", transitionDelay: `${i * 40}ms` }}
              >
                <span className="text-sm mt-0.5 select-none" style={{ color: "var(--accent)" }}>—</span>
                <div>
                  <div className="text-sm font-medium mb-1.5">{item.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 reveal" style={{ transitionDelay: "200ms" }}>
            <button onClick={() => router.push("/test")}
              className="btn-primary text-xs font-medium tracking-widest uppercase px-10 py-4"
            >
              Take the Free Test First
            </button>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-8 md:px-16" style={{ background: "var(--bg-surface)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="reveal mb-12">
            <p className="text-xs tracking-[0.18em] uppercase mb-3" style={{ color: "var(--accent)" }}>
              Pricing
            </p>
            <h2 className="font-serif text-4xl" style={{ letterSpacing: "-0.01em" }}>
              Free to start,<br />powerful when unlocked
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "var(--border-subtle)" }}>

            {/* Free tier */}
            <div className="p-8 reveal" style={{ background: "var(--bg-surface)", transitionDelay: "60ms" }}>
              <p className="text-xs tracking-[0.14em] uppercase mb-4" style={{ color: "var(--text-secondary)" }}>Basic</p>
              <div className="font-serif text-5xl mb-2" style={{ color: "var(--text-primary)" }}>Free</div>
              <p className="text-xs leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
                Take the full test and receive your overall IQ score instantly.
              </p>
              <ul className="flex flex-col gap-2.5 mb-8">
                {["Full 30-question test", "Overall IQ score", "Population percentile"].map(f => (
                  <li key={f} className="flex gap-3 text-xs">
                    <span style={{ color: "var(--accent)" }}>—</span><span>{f}</span>
                  </li>
                ))}
                {["Radar chart", "Category breakdown", "Career matches", "PDF certificate"].map(f => (
                  <li key={f} className="flex gap-3 text-xs opacity-25">
                    <span>—</span><span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push("/test")}
                className="btn-ghost w-full py-3 text-xs font-medium tracking-widest uppercase"
              >
                Start Free
              </button>
            </div>

            {/* Premium tier */}
            <div className="p-8 reveal"
              style={{ background: "var(--bg-surface)", borderLeft: "3px solid var(--accent)", transitionDelay: "120ms" }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs tracking-[0.14em] uppercase" style={{ color: "var(--text-secondary)" }}>Premium Report</p>
                <span className="text-xs tracking-wider uppercase px-2.5 py-1"
                  style={{ background: "rgba(29,158,117,0.1)", color: "var(--success)", border: "1px solid rgba(29,158,117,0.2)" }}
                >
                  Save 50%
                </span>
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-sm line-through" style={{ color: "var(--text-muted)" }}>€9.99</span>
                <span className="font-serif text-5xl" style={{ color: "var(--text-primary)" }}>€4.99</span>
              </div>
              <p className="text-xs leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
                Complete cognitive profile with everything you need to understand your intelligence.
              </p>
              <ul className="flex flex-col gap-2.5 mb-8">
                {["Full 30-question test","Overall IQ score","Population percentile","Radar chart","Category breakdown","Career matches","Improvement tips","Famous comparisons","PDF certificate"].map(f => (
                  <li key={f} className="flex gap-3 text-xs">
                    <span style={{ color: "var(--accent)" }}>—</span><span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push("/test")}
                className="btn-primary w-full py-3 text-xs font-medium tracking-widest uppercase"
              >
                Get Premium Report
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 px-8 md:px-16" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <div className="max-w-4xl mx-auto reveal">
          <h2 className="font-serif text-5xl md:text-6xl mb-6" style={{ letterSpacing: "-0.02em" }}>
            Ready to discover<br />your true IQ?
          </h2>
          <p className="text-sm mb-8 max-w-xs" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
            No registration required. Results in 15 minutes. 2.4 million tests completed.
          </p>
          <button onClick={() => router.push("/test")}
            className="btn-primary text-xs font-medium tracking-widest uppercase px-10 py-4"
          >
            Begin the Test — Free
          </button>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="flex flex-wrap justify-between items-center px-8 py-6 gap-4"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <span className="font-serif text-sm" style={{ color: "var(--text-primary)" }}>
          Real<span style={{ color: "var(--accent)" }}>IQ</span>Test
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>© 2026 RealIQTest · Privacy · Terms</span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>realiqtest.co</span>
      </footer>
    </div>
  );
}
