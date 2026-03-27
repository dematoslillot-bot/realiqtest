import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0ede8]">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-[rgba(10,10,15,0.85)] backdrop-blur-md border-b border-[rgba(201,169,110,0.2)]">
        <span className="font-serif text-xl font-bold text-[#c9a96e]">Real<span className="text-[#f0ede8]">IQ</span>Test</span>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#8a8890]">
          <a href="#how" className="hover:text-[#c9a96e] transition-colors">How it works</a>
          <a href="#categories" className="hover:text-[#c9a96e] transition-colors">The Test</a>
          <a href="#pricing" className="hover:text-[#c9a96e] transition-colors">Pricing</a>
        </div>
        <Link href="/test" className="bg-[#c9a96e] text-[#0a0a0f] px-5 py-2 text-xs font-medium tracking-widest uppercase rounded-sm hover:bg-[#e8c98a] transition-colors">
          Start Free
        </Link>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center text-center px-6 pt-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(201,169,110,0.07)_0%,transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(201,169,110,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.8) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-block border border-[rgba(201,169,110,0.2)] px-4 py-1.5 text-xs tracking-widest uppercase text-[#c9a96e] rounded-sm mb-8">
            Scientifically Validated · 2,500+ Questions · 2.4M Tests Completed
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
            Discover your<br /><em className="italic text-[#c9a96e]">true intelligence</em>
          </h1>
          <p className="text-[#8a8890] text-lg max-w-lg mx-auto leading-relaxed mb-10">
            A comprehensive IQ assessment across logical, verbal, spatial and numerical reasoning. Get your score in under 30 minutes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/test" className="bg-[#c9a96e] text-[#0a0a0f] px-9 py-4 text-sm font-medium tracking-widest uppercase rounded-sm hover:bg-[#e8c98a] transition-all hover:-translate-y-0.5">
              Take the Test — Free
            </Link>
            <a href="#how" className="border border-[rgba(240,237,232,0.2)] text-[#f0ede8] px-9 py-4 text-sm tracking-widest uppercase rounded-sm hover:border-[#c9a96e] hover:text-[#c9a96e] transition-all hover:-translate-y-0.5">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="flex border-t border-b border-[rgba(201,169,110,0.2)] bg-[#111118]">
        {[
          { num: "2.4M+", label: "Tests completed" },
          { num: "98%", label: "Accuracy rate" },
          { num: "28 min", label: "Average duration" },
          { num: "4.9 ★", label: "User rating" },
        ].map((s, i) => (
          <div key={i} className="flex-1 text-center py-6 border-r border-[rgba(201,169,110,0.2)] last:border-r-0">
            <div className="font-serif text-3xl font-bold text-[#c9a96e]">{s.num}</div>
            <div className="text-xs tracking-widest uppercase text-[#8a8890] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* CATEGORIES */}
      <section id="categories" className="py-24 px-6 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-[#c9a96e] mb-3">What we measure</p>
          <h2 className="font-serif text-4xl font-bold mb-12">Six pillars of <em className="italic text-[#c9a96e]">intelligence</em></h2>
          <div className="grid grid-cols-2 md:grid-cols-3 border border-[rgba(201,169,110,0.2)]">
            {[
              { icon: "◈", name: "Logical Reasoning", desc: "Identify patterns, complete sequences and solve abstract problems.", count: "9 questions" },
              { icon: "◉", name: "Verbal Intelligence", desc: "Analogies, vocabulary depth and linguistic structure.", count: "9 questions" },
              { icon: "◧", name: "Spatial Reasoning", desc: "Rotate shapes, complete matrices and visualise 3D objects.", count: "8 questions" },
              { icon: "◫", name: "Numerical Ability", desc: "Number sequences, arithmetic and quantitative problem solving.", count: "9 questions" },
              { icon: "◌", name: "Working Memory", desc: "Hold and manipulate information under cognitive load.", count: "8 questions" },
              { icon: "◎", name: "Processing Speed", desc: "Rapid decision-making and cognitive efficiency.", count: "9 questions" },
            ].map((cat, i) => (
              <div key={i} className="p-6 border-r border-b border-[rgba(201,169,110,0.2)] last:border-r-0 hover:bg-[#1a1a26] transition-colors">
                <div className="text-2xl mb-4">{cat.icon}</div>
                <div className="text-sm font-medium mb-2">{cat.name}</div>
                <div className="text-xs text-[#8a8890] leading-relaxed mb-3">{cat.desc}</div>
                <div className="text-xs tracking-widest uppercase text-[#c9a96e]">{cat.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6 bg-[#111118]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#c9a96e] mb-3">How it works</p>
            <h2 className="font-serif text-4xl font-bold mb-10">Simple process,<br /><em className="italic text-[#c9a96e]">deep insights</em></h2>
            <div className="flex flex-col divide-y divide-[rgba(201,169,110,0.2)]">
              {[
                { num: "01", title: "Answer 52 questions", desc: "Adaptive difficulty adjusts in real time across all six categories." },
                { num: "02", title: "Algorithm scores your responses", desc: "Our model weights accuracy, speed and category performance against 2M+ data points." },
                { num: "03", title: "Receive your IQ score", desc: "Free report with your overall IQ. Unlock the detailed breakdown with the full report." },
              ].map((step, i) => (
                <div key={i} className="flex gap-6 py-6">
                  <div className="font-serif text-4xl font-black text-[rgba(201,169,110,0.2)] leading-none min-w-[3rem]">{step.num}</div>
                  <div>
                    <div className="text-sm font-medium mb-1">{step.title}</div>
                    <div className="text-xs text-[#8a8890] leading-relaxed">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Result preview */}
          <div className="bg-[#111118] border border-[rgba(201,169,110,0.2)] rounded p-8 text-center">
            <p className="text-xs tracking-widest uppercase text-[#8a8890] mb-4">Sample result</p>
            <div className="font-serif text-7xl font-black text-[#c9a96e] leading-none">127</div>
            <p className="text-xs tracking-widest uppercase text-[#8a8890] mt-2">Intelligence Quotient</p>
            <div className="inline-block mt-3 border border-[#c9a96e] text-[#c9a96e] px-4 py-1 rounded-sm text-sm">Superior Intelligence</div>
            <div className="mt-5 h-1 bg-[rgba(201,169,110,0.12)] rounded-full overflow-hidden max-w-xs mx-auto">
              <div className="h-full bg-[#c9a96e] rounded-full w-[72%]" />
            </div>
            <div className="flex justify-between text-xs text-[#8a8890] mt-1 max-w-xs mx-auto"><span>70</span><span>Average</span><span>145+</span></div>
            <div className="mt-5 flex flex-col gap-2">
              {[["Logical", 88], ["Verbal", 75], ["Spatial", 70]].map(([label, w]) => (
                <div key={label} className="flex items-center gap-3 text-xs">
                  <span className="w-16 text-right text-[#8a8890]">{label}</span>
                  <div className="flex-1 h-0.5 bg-[rgba(201,169,110,0.1)] rounded-full"><div className="h-full bg-[#c9a96e] rounded-full" style={{ width: `${w}%` }} /></div>
                </div>
              ))}
              {[["Numerical", 82], ["Memory", 65]].map(([label, w]) => (
                <div key={label} className="flex items-center gap-3 text-xs blur-sm opacity-40">
                  <span className="w-16 text-right text-[#8a8890]">{label}</span>
                  <div className="flex-1 h-0.5 bg-[rgba(201,169,110,0.1)] rounded-full"><div className="h-full bg-[#c9a96e] rounded-full" style={{ width: `${w}%` }} /></div>
                </div>
              ))}
            </div>
            <div className="mt-5 p-3 bg-[rgba(201,169,110,0.04)] border border-dashed border-[rgba(201,169,110,0.2)] rounded text-xs text-[#8a8890]">
              🔒 <strong className="text-[#c9a96e]">Unlock full report</strong> — detailed breakdown & cognitive profile
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 bg-[#0a0a0f]">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-xs tracking-widest uppercase text-[#c9a96e] mb-3">Pricing</p>
          <h2 className="font-serif text-4xl font-bold">Free to start,<br /><em className="italic text-[#c9a96e]">powerful when unlocked</em></h2>
        </div>
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { tier: "Basic", price: "Free", desc: "Take the full test and receive your overall IQ score instantly.", features: ["Full 52-question test", "Overall IQ score", "Population percentile"], locked: ["Category breakdown", "Cognitive profile PDF", "Comparison analytics"], cta: "Start Free", href: "/test", featured: false },
            { tier: "Full Report", price: "€9.99", desc: "Everything in Basic plus an in-depth analysis of every cognitive dimension.", features: ["Full 52-question test", "Overall IQ score", "Population percentile", "Category breakdown", "Cognitive profile PDF", "Comparison analytics"], locked: [], cta: "Get Full Report", href: "/test", featured: true },
          ].map((plan, i) => (
            <div key={i} className={`p-8 rounded border ${plan.featured ? "border-[#c9a96e] bg-[#1a1a26]" : "border-[rgba(201,169,110,0.2)] bg-[#111118]"}`}>
              <p className="text-xs tracking-widest uppercase text-[#8a8890] mb-2">{plan.tier}</p>
              <p className="font-serif text-4xl font-bold text-[#f0ede8] mb-3">{plan.price}</p>
              <p className="text-xs text-[#8a8890] leading-relaxed mb-6">{plan.desc}</p>
              <ul className="flex flex-col gap-2 mb-6">
                {plan.features.map((f, j) => <li key={j} className="text-sm flex gap-2"><span className="text-[#c9a96e]">—</span>{f}</li>)}
                {plan.locked.map((f, j) => <li key={j} className="text-sm flex gap-2 opacity-30"><span>—</span>{f}</li>)}
              </ul>
              <Link href={plan.href} className={`block text-center py-3 text-xs font-medium tracking-widest uppercase rounded-sm transition-colors ${plan.featured ? "bg-[#c9a96e] text-[#0a0a0f] hover:bg-[#e8c98a]" : "border border-[rgba(240,237,232,0.2)] text-[#f0ede8] hover:border-[#c9a96e] hover:text-[#c9a96e]"}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-24 px-6 text-center bg-[#111118] border-t border-[rgba(201,169,110,0.2)]">
        <h2 className="font-serif text-5xl font-black mb-6 max-w-lg mx-auto leading-tight">
          Ready to discover your <em className="italic text-[#c9a96e]">true IQ?</em>
        </h2>
        <Link href="/test" className="inline-block bg-[#c9a96e] text-[#0a0a0f] px-12 py-4 text-sm font-medium tracking-widest uppercase rounded-sm hover:bg-[#e8c98a] transition-all hover:-translate-y-0.5">
          Begin the Test — It's Free
        </Link>
        <p className="text-xs text-[#8a8890] mt-4">No registration required · Results in 30 minutes · 2.4 million tests completed</p>
      </section>

      {/* FOOTER */}
      <footer className="flex justify-between items-center px-8 py-6 border-t border-[rgba(201,169,110,0.2)] text-xs text-[#8a8890]">
        <span className="font-serif text-base font-bold text-[#c9a96e]">Real<span className="text-[#f0ede8]">IQ</span>Test</span>
        <span>© 2026 RealIQTest · Privacy · Terms</span>
        <span>realiqtest.com</span>
      </footer>

    </div>
  );
}