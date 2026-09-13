// components/landing/Stats.tsx
// Full-width dark band with 4 concrete stats — confident, not decorative.

export default function Stats() {
  const stats = [
    { value: "25+", label: "Colleges in our database" },
    { value: "7", label: "Streams covered" },
    { value: "8", label: "Cities across India" },
    { value: "Free", label: "No subscription required" },
  ];

  return (
    <section className="bg-[#0D1829] py-16 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-slate-700">
          {stats.map((stat, i) => (
            <div key={i} className="md:px-12 first:md:pl-0 last:md:pr-0 text-center md:text-left">
              <div
                className="text-4xl md:text-5xl text-[#E09C2D] font-bold mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
