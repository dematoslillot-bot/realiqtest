"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0ede8]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-[rgba(10,10,15,0.85)] backdrop-blur border-b border-[rgba(201,169,110,0.2)]">
        <span className="font-serif text-xl font-bold text-[#c9a96e]">Real<span className="text-[#f0ede8]">IQ</span>Test</span>
        <ul className="hidden md:flex gap-8 text-sm text-[#8a8890]">
          <li className="hover:text-[#c9a96e] cursor-pointer transition-colors">The Test</li>
          <li className="hover:text-[#c9a96e] cursor-pointer transition-colors">How it works</li>
          <li className="hover:text-[#c9a96e] cursor-pointer transition-colors">Pricing</li>
        </ul>
        <button onClick={() => router.push("/test")}
          className="bg-[#c9a96e] text-[#0a0a0f] px-5 py-2 text-xs font-medium tracking-widest uppercase rounded-sm hover:bg-[#e8c98a] transition-colors">
          Start Free
        </button>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center text-center px-6 pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(201,169,110,0.07)_0%,transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(201,169,110,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.8) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-block border border-[rgba(201,169,110,0.2)] text-[#c9a96e] text-xs tracking-widest uppercase px-4 py-1.5 rounded-sm mb-8">
            Scientifically Validated · 30 Questions · 2.4M Tests Completed
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-black leading-tight mb-6">
            Discover your<br /><em className="text-[#c9a96e]">true intelligence</em>
          </h1>
          <p className="text-[#8a8890] text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            A comprehensive IQ assessment across 6 cognitive dimensions. Get your score in under 15 minutes — completely free.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => router.push("/test")}
              className="bg-[#c9a96e] text-[#0a0a0f] px-8 py-4 text-sm font-medium tracking-widest uppercase rounded-sm hover:bg-[#e8c98a] transition-all hover:-translate-y-0.5">
              Take the Test — Free
            </button>
            <button className="border border-[rgba(240,237,232,0.2)] text-[#f0ede8] px-8 py-4 text-sm tracking-widest uppercase rounded-sm hover:border-[#c9a96e] hover:text-[#c9a96e] transition-all hover:-translate-y-0.5">
              See Sample Questions
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="flex border-t border-b border-[rgba(201,169,110,0.2)] bg-[#111118]">
        {[
          { num: "2.4M+", label: "Tests completed" },
          { num: "98%", label: "Accuracy rate" },
          { num: "15 min", label: "Average duration" },
          { num: "4.9 ★", label: "User rating" },
        ].map((s, i) => (
          <div key={i} className="flex-1 text-center py-6 border-r border-[rgba(201,169,110,0.2)] last:border-r-0">
            <div className="font-serif text-3xl font-bold text-[#c9a96e]">{s.num}</div>
            <div className="text-xs tracking-widest uppercase text-[#8a8890] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-[#c9a96e] mb-3">What we measure</p>
          <h2 className="font-serif text-4xl font-bold mb-12">Six pillars of <em className="text-[#c9a96e]">intelligence</em></h2>
          <div className="grid grid-cols-2 md:grid-cols-3 border border-[rgba(201,169,110,0.2)]">
            {[
              { icon: "◈", name: "Logical Reasoning", desc: "Identify patterns and solve abstract problems under time pressure.", q: "5 questions" },
              { icon: "◉", name: "Verbal Intelligence", desc: "Analogies, vocabulary depth and linguistic structure.", q: "5 questions" },
              { icon: "◧", name: "Spatial Reasoning", desc: "Rotate and manipulate 2D and 3D shapes.", q: "5 questions" },
              { icon: "◫", name: "Numerical Ability", desc: "Number sequences, arithmetic and quantitative reasoning.", q: "5 questions" },
              { icon: "◌", name: "Working Memory", desc: "Hold and manipulate information under cognitive load.", q: "5 questions" },
              { icon: "◎", name: "Processing Speed", desc: "Rapid decisions and reaction-based cognitive efficiency.", q: "5 questions" },
            ].map((cat, i) => (
              <div key={i} className="p-6 border-r border-b border-[rgba(201,169,110,0.2)] last:border-r-0 hover:bg-[#111118] transition-colors">
                <div className="text-2xl mb-4">{cat.icon}</div>
                <div className="text-sm font-medium mb-2">{cat.name}</div>
                <div className="text-xs text-[#8a8890] leading-relaxed mb-3">{cat.desc}</div>
                <div className="text-xs tracking-widest uppercase text-[#c9a96e]">{cat.q}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-[#111118]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#c9a96e] mb-3">How it works</p>
            <h2 className="font-serif text-4xl font-bold mb-10">Simple process, <em className="text-[#c9a96e]">deep insights</em></h2>
            <div className="flex flex-col divide-y divide-[rgba(201,169,110,0.2)]">
              {[
                { n: "01", title: "Answer 30 questions", desc: "6 categories, 5 questions each. All designed to be solved mentally — no pen or paper needed." },
                { n: "02", title: "Algorithm scores your responses", desc: "Our model weights accuracy, speed and category performance against 2M+ data points." },
                { n: "03", title: "Receive your IQ score instantly", desc: "Free report with your overall IQ. Unlock the full premium report for €4.99." },
              ].map((s, i) => (
                <div key={i} className="flex gap-6 py-6">
                  <div className="font-serif text-4xl font-black text-[rgba(201,169,110,0.2)] min-w-[3rem]">{s.n}</div>
                  <div>
                    <div className="text-sm font-medium mb-1">{s.title}</div>
                    <div className="text-xs text-[#8a8890] leading-relaxed">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Result preview */}
          <div className="bg-[#0a0a0f] border border-[rgba(201,169,110,0.2)] rounded p-6 text-center">
            <p className="text-xs tracking-widest uppercase text-[#8a8890] mb-4">Sample result</p>
            <div className="font-serif text-7xl font-black text-[#c9a96e] leading-none">127</div>
            <p className="text-xs tracking-widest uppercase text-[#8a8890] mt-2">Intelligence Quotient</p>
            <div className="inline-block mt-3 border border-[#c9a96e] text-[#c9a96e] px-4 py-1 rounded-sm text-sm">Superior Intelligence</div>
            <div className="mt-5 h-1 bg-[rgba(201,169,110,0.12)] rounded-full overflow-hidden max-w-xs mx-auto">
              <div className="h-full w-[72%] bg-[#c9a96e] rounded-full" />
            </div>
            <div className="flex justify-between text-xs text-[#8a8890] max-w-xs mx-auto mt-1"><span>70</span><span>100</span><span>145+</span></div>
            <div className="flex flex-col gap-2 mt-5 text-left max-w-xs mx-auto">
              {[["Logic", 88], ["Verbal", 75], ["Spatial", 70]].map(([name, w]) => (
                <div key={name} className="flex items-center gap-2 text-xs">
                  <span className="w-16 text-right text-[#8a8890]">{name}</span>
                  <div className="flex-1 h-0.5 bg-[rgba(201,169,110,0.12)]"><div className="h-full bg-[#c9a96e]" style={{ width: `${w}%` }} /></div>
                </div>
              ))}
              {[["Numerical", 82], ["Memory", 65]].map(([name, w]) => (
                <div key={name} className="flex items-center gap-2 text-xs blur-sm opacity-40">
                  <span className="w-16 text-right text-[#8a8890]">{name}</span>
                  <div className="flex-1 h-0.5 bg-[rgba(201,169,110,0.12)]"><div className="h-full bg-[#c9a96e]" style={{ width: `${w}%` }} /></div>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#8a8890] mt-3">🔒 Full breakdown unlocked with Premium Report</p>
          </div>
        </div>
      </section>

      {/* What's in the premium report */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-[#c9a96e] mb-3">Premium Report</p>
          <h2 className="font-serif text-4xl font-bold mb-4">Everything in the <em className="text-[#c9a96e]">full report</em></h2>
          <p className="text-[#8a8890] text-sm mb-12 max-w-lg">Unlock a complete picture of your intelligence for just €4.99 — one-time payment, instant access.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: "◈", title: "Cognitive Radar Chart", desc: "Visual spider chart showing your strengths and weaknesses across all 6 dimensions at a glance." },
              { icon: "◉", title: "Full Category Breakdown", desc: "Detailed score and analysis for each of the 6 cognitive categories with personalised feedback." },
              { icon: "◧", title: "Global Percentile Rank", desc: "See exactly where you stand compared to 2.4 million test takers worldwide." },
              { icon: "◫", title: "Career Matches", desc: "Discover which careers and professions align best with your unique cognitive profile." },
              { icon: "◌", title: "Improvement Tips", desc: "Personalised, actionable advice to strengthen each cognitive area — backed by neuroscience." },
              { icon: "◎", title: "Famous IQ Comparisons", desc: "See how your score compares to well-known figures and historical geniuses." },
              { icon: "★", title: "Official PDF Certificate", desc: "Download your personalised IQ certificate to share or keep as a record." },
              { icon: "✦", title: "Strengths & Weaknesses Profile", desc: "Clear identification of your cognitive superpowers and areas with the most room to grow." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-[#111118] border border-[rgba(201,169,110,0.2)] rounded hover:border-[rgba(201,169,110,0.4)] transition-colors">
                <div className="text-[#c9a96e] text-lg min-w-[24px]">{item.icon}</div>
                <div>
                  <div className="text-sm font-medium mb-1">{item.title}</div>
                  <div className="text-xs text-[#8a8890] leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => router.push("/test")}
              className="bg-[#c9a96e] text-[#0a0a0f] px-10 py-4 text-sm font-medium tracking-widest uppercase rounded-sm hover:bg-[#e8c98a] transition-colors">
              Take the Free Test First
            </button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-[#111118]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase text-[#c9a96e] mb-3">Pricing</p>
          <h2 className="font-serif text-4xl font-bold mb-12">Free to start, <em className="text-[#c9a96e]">powerful when unlocked</em></h2>
          <div className="grid grid-cols-2 gap-5">
            {[
              {
                tier: "Basic", price: "Free", orig: null,
                desc: "Take the full test and receive your overall IQ score instantly.",
                features: ["Full 30-question test", "Overall IQ score", "Population percentile"],
                locked: ["Radar chart", "Category breakdown", "Career matches", "Improvement tips", "Famous comparisons", "PDF certificate"],
                btn: "Start Free", primary: false
              },
              {
                tier: "Premium Report", price: "€4.99", orig: "€9.99",
                desc: "Complete cognitive profile with everything you need to understand your intelligence.",
                features: ["Full 30-question test", "Overall IQ score", "Population percentile", "Radar chart", "Category breakdown", "Career matches", "Improvement tips", "Famous comparisons", "PDF certificate"],
                locked: [],
                btn: "Get Premium Report", primary: true
              },
            ].map((plan, i) => (
              <div key={i} className={`bg-[#0a0a0f] border rounded p-6 text-left ${plan.primary ? "border-[#c9a96e]" : "border-[rgba(201,169,110,0.2)]"}`}>
                {plan.primary && (
                  <div className="text-xs tracking-widest uppercase text-center bg-[rgba(29,158,117,0.1)] text-[#1d9e75] border border-[rgba(29,158,117,0.3)] px-2 py-1 rounded-sm mb-4">Limited offer — Save 50%</div>
                )}
                <p className="text-xs tracking-widest uppercase text-[#8a8890] mb-2">{plan.tier}</p>
                <div className="flex items-baseline gap-2 mb-2">
                  {plan.orig && <span className="text-sm line-through text-[#8a8890]">{plan.orig}</span>}
                  <span className="font-serif text-4xl font-bold text-[#f0ede8]">{plan.price}</span>
                </div>
                <p className="text-xs text-[#8a8890] leading-relaxed mb-5">{plan.desc}</p>
                <ul className="flex flex-col gap-2 mb-5">
                  {plan.features.map((f, j) => <li key={j} className="text-xs text-[#f0ede8] flex gap-2"><span className="text-[#c9a96e]">—</span>{f}</li>)}
                  {plan.locked.map((f, j) => <li key={j} className="text-xs text-[#8a8890] flex gap-2 opacity-40"><span>—</span>{f}</li>)}
                </ul>
                <button onClick={() => router.push("/test")}
                  className={`w-full py-3 text-xs font-medium tracking-widest uppercase rounded-sm transition-colors ${plan.primary ? "bg-[#c9a96e] text-[#0a0a0f] hover:bg-[#e8c98a]" : "border border-[rgba(240,237,232,0.2)] text-[#f0ede8] hover:border-[#c9a96e] hover:text-[#c9a96e]"}`}>
                  {plan.btn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 text-center border-t border-[rgba(201,169,110,0.2)]">
        <h2 className="font-serif text-5xl font-black mb-6">Ready to discover<br />your <em className="text-[#c9a96e]">true IQ?</em></h2>
        <button onClick={() => router.push("/test")}
          className="bg-[#c9a96e] text-[#0a0a0f] px-12 py-4 text-sm font-medium tracking-widest uppercase rounded-sm hover:bg-[#e8c98a] transition-colors">
          Begin the Test — It&apos;s Free
        </button>
        <p className="text-xs text-[#8a8890] mt-4">No registration required · Results in 15 minutes · 2.4 million tests completed</p>
      </section>

      {/* Footer */}
      <footer className="flex justify-between items-center px-8 py-5 border-t border-[rgba(201,169,110,0.2)] text-xs text-[#8a8890]">
        <span className="font-serif text-sm font-bold text-[#c9a96e]">Real<span className="text-[#f0ede8]">IQ</span>Test</span>
        <span>© 2026 RealIQTest · Privacy · Terms</span>
        <span>realiqtest.co</span>
      </footer>
    </div>
  );
}