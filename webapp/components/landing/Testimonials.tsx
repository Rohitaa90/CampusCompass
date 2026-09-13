"use client";
// components/landing/Testimonials.tsx

export default function Testimonials() {
  const baseTestimonials = [
    {
      quote:
        "I was stuck between Engineering and BCA. Everyone kept saying 'follow your passion' but nobody told me what the actual fee difference was or which had better placement in Pune. CampusCompass gave me the answer in one conversation.",
      name: "Rohan Mehta",
      detail: "Class 12, Science — Pune",
      stream: "Engineering",
      theme: "light",
    },
    {
      quote:
        "My parents wanted MBBS but my budget was under ₹5L per year. The AI counselor didn't dismiss it — it showed me government medical colleges I didn't know existed and explained the NEET cutoffs realistically.",
      name: "Priya Nair",
      detail: "NEET aspirant — Bangalore",
      stream: "Medical",
      theme: "dark",
    },
    {
      quote:
        "Finding an affordable B.Com college in Delhi was exhausting. The filters here saved me weeks of manual searching, and the bookmarking feature helped me compare my top 3 choices easily.",
      name: "Arjun Singh",
      detail: "Class 12, Commerce — Delhi NCR",
      stream: "Commerce",
      theme: "light",
    },
    {
      quote:
        "The AI doesn't just throw links at you. It actually asked me about my interest in Design and showed me NID and NIFT options along with private colleges that fit my exact budget.",
      name: "Sneha Kapoor",
      detail: "Design aspirant — Mumbai",
      stream: "Design",
      theme: "dark",
    },
    {
      quote:
        "Finally a platform that understands the anxiety of Indian students. Being able to compare fees and placement ratings side-by-side saved my family from making a very expensive mistake.",
      name: "Karan Patel",
      detail: "B.Tech student — Ahmedabad",
      stream: "Engineering",
      theme: "light",
    },
    {
      quote:
        "I had no idea what to do after 12th Commerce. The AI counselor walked me through CA, CS, and regular degree options with such clarity that I finally felt confident discussing it with my parents.",
      name: "Aditi Sharma",
      detail: "Class 12, Commerce — Jaipur",
      stream: "Commerce",
      theme: "dark",
    },
  ];

  // Duplicate the array to create a seamless infinite loop
  const testimonials = [...baseTestimonials, ...baseTestimonials];

  return (
    <section className="bg-[#F5F3EE] py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12 max-w-xl text-center md:text-left">
          <h2
            className="text-4xl md:text-5xl text-[#16213E] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What students are saying
          </h2>
          <p className="text-[#64748B] text-lg">
            Join thousands of Indian students navigating their college journey with confidence.
          </p>
        </div>

        {/* Marquee Container with CSS Mask for faded edges - Now inside the max-w-7xl container */}
        <div 
          className="w-full relative py-4"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="flex animate-marquee w-max hover:[animation-play-state:paused]">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 w-[280px] md:w-[360px] mx-3 rounded-xl p-6 flex flex-col justify-between transition-transform duration-300 ${
                  testimonial.theme === "dark" 
                    ? "bg-[#16213E] text-slate-300 border-none shadow-md" 
                    : "bg-white text-[#16213E] border border-slate-200 shadow-sm"
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base ${
                      testimonial.theme === "dark" ? "bg-[#E09C2D]" : "bg-[#3D7A6B]"
                    }`}
                  >
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${testimonial.theme === "dark" ? "text-white" : "text-[#16213E]"}`}>
                      {testimonial.name}
                    </div>
                    <div className={`text-xs mt-0.5 ${testimonial.theme === "dark" ? "text-slate-400" : "text-[#64748B]"}`}>
                      {testimonial.detail}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
