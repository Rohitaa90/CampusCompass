// components/landing/Features.tsx
// 4 features in an asymmetric 2x2 layout — NOT identical equal-column cards.

import { Brain, Bookmark, Search, BarChart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Sub-component so we can use Icon as a proper JSX element
function FeatureCard({
  Icon,
  title,
  description,
  iconColor = "text-[#3D7A6B]",
  iconBg = "bg-[#3D7A6B]/10",
  textColor = "text-[#64748B]",
  titleColor = "text-[#16213E]",
  bg = "bg-white border border-slate-100",
}: {
  Icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  iconBg?: string;
  textColor?: string;
  titleColor?: string;
  bg?: string;
}) {
  return (
    <div className={`group rounded-xl p-8 h-full ${bg} transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-default`}>
      <div className={`inline-flex items-center justify-center p-3.5 rounded-xl mb-6 transition-transform duration-300 group-hover:scale-110 ${iconBg}`}>
        <Icon className={`w-7 h-7 ${iconColor}`} />
      </div>
      <h3 className={`text-xl font-semibold mb-3 ${titleColor} transition-colors`}>{title}</h3>
      <p className={`leading-relaxed ${textColor}`}>{description}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section className="bg-[#F5F3EE] py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 max-w-xl">
          <h2
            className="text-4xl md:text-5xl text-[#16213E] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What makes this different
          </h2>
          <p className="text-[#64748B] text-lg">
            Built specifically for Indian students navigating streams, entrance exams, and fees — not a generic global tool.
          </p>
        </div>

        {/* Asymmetric grid: row 1 is wide-left, narrow-right; row 2 is reversed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Row 1: wide (2 cols) + narrow (1 col) */}
          <div className="md:col-span-2">
            <FeatureCard
              Icon={Brain}
              title="AI Counselor that actually listens"
              description="Tell it your stream, budget, and city — it cross-references real college data and gives you an answer like a mentor would, not a search engine."
            />
          </div>
          <FeatureCard
            Icon={Search}
            title="Smart College Search"
            description="Filter by stream (Engineering, Medical, Commerce, Arts), location, and annual fees. No noise — just colleges that fit."
            bg="bg-[#16213E] border border-[#16213E]"
            iconColor="text-[#E09C2D]"
            iconBg="bg-[#E09C2D]/15"
            titleColor="text-white"
            textColor="text-slate-400"
          />

          {/* Row 2: narrow (1 col) + wide (2 cols) */}
          <FeatureCard
            Icon={Bookmark}
            title="Save your shortlist"
            description="Bookmark colleges as you explore. Your dashboard keeps everything in one place so you can compare without losing track."
            bg="bg-[#3D7A6B] border border-[#3D7A6B]"
            iconColor="text-white"
            iconBg="bg-white/20"
            titleColor="text-white"
            textColor="text-[#b5d9d1]"
          />
          <div className="md:col-span-2">
            <FeatureCard
              Icon={BarChart}
              title="Verified college data"
              description="Every college in our database has real fee data and ratings — not crowd-sourced guesses. We cover IITs, NITs, private universities, and more."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
