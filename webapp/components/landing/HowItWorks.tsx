// components/landing/HowItWorks.tsx
// Numbered steps — sequential content so numbers are appropriate here.

export default function HowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Tell us about yourself",
      description:
        "Fill in your preferred stream (Engineering, Medical, Commerce, etc.), budget, location, and interests. Takes 2 minutes. No long forms.",
    },
    {
      num: "2",
      title: "Explore your matches",
      description:
        "We show you colleges that actually fit — filtered by your stream, within your budget, in cities you're open to. Browse, compare, and shortlist.",
    },
    {
      num: "3",
      title: "Ask your AI counselor anything",
      description:
        "\"Should I pick VIT over SRM for CSE?\" \"What's the scope of commerce without maths?\" Get reasoned, personalised answers — not generic search results.",
    },
  ];

  return (
    <section className="bg-[#16213E] py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 max-w-xl">
          <h2
            className="text-4xl md:text-5xl text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How it works
          </h2>
          <p className="text-slate-400 text-lg">
            Three steps from confusion to clarity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-0 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-700">
          {steps.map((step, i) => (
            <div
              key={i}
              className="py-8 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0 space-y-4"
            >
              {/* Number badge */}
              <div className="w-10 h-10 rounded-full border border-[#E09C2D] flex items-center justify-center text-[#E09C2D] font-semibold text-sm">
                {step.num}
              </div>
              <h3 className="text-xl font-semibold text-white">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
