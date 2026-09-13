"use client";
// components/landing/Hero.tsx
// Left-aligned headline + CTA. Hero illustration on the right.
// Animation: headline words stagger in — the ONLY entrance animation on the site.

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Tiny delay so the animation feels intentional, not instant
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="min-h-screen bg-[#16213E] flex items-center pt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid md:grid-cols-2 gap-12 items-center py-20">

        {/* Left — Copy */}
        <div className="space-y-8">
          {/* Tag line */}
          <span className="text-[#3D7A6B] text-sm font-medium tracking-wide uppercase">
            For Class 12 students &amp; beyond
          </span>

          {/* Main headline — stagger animation per word */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {["Find your", "path.", "Not someone", "else's."].map((word, i) => (
              <span
                key={i}
                className="block transition-all duration-700"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: `${i * 120}ms`,
                }}
              >
                {i === 1 ? (
                  <span className="text-[#E09C2D]">{word}</span>
                ) : (
                  word
                )}
              </span>
            ))}
          </h1>

          <p
            className="text-slate-400 text-lg max-w-md leading-relaxed"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "all 0.7s ease",
              transitionDelay: "500ms",
            }}
          >
            CampusCompass gives you a knowledgeable friend who actually knows
            Indian colleges — not generic advice, real answers for your
            stream, budget, and city.
          </p>

          <div
            className="flex flex-wrap items-center gap-4"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.7s ease",
              transitionDelay: "650ms",
            }}
          >
            <Link
              href="/signup"
              className="px-8 py-3.5 rounded-full bg-[#3D7A6B] text-white font-medium hover:bg-[#4a9180] transition-colors text-sm"
            >
              Get Started Free
            </Link>
            <Link
              href="/colleges"
              className="px-8 py-3.5 rounded-full border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white transition-all text-sm"
            >
              Browse Colleges
            </Link>
          </div>

          {/* Social proof micro-stat */}
          <p className="text-slate-500 text-sm">
            Trusted by students from IIT, BITS, AIIMS aspirants and beyond.
          </p>
        </div>

        {/* Right — Illustration */}
        <div
          className="relative flex justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 1s ease",
            transitionDelay: "300ms",
          }}
        >
          <div className="relative w-full max-w-lg aspect-[4/3] rounded-xl overflow-hidden">
            <Image
              src="/hero-illustration.jpg"
              alt="Student studying with map and compass, exploring college options"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          {/* Floating badges — concrete details that ground the illustration */}
          <div className="absolute -bottom-4 -left-4 bg-white rounded-xl px-4 py-3 shadow-lg text-sm">
            <span className="text-[#3D7A6B] font-semibold">25+ colleges</span>
            <span className="text-slate-500"> across 8 cities</span>
          </div>
          <div className="absolute -top-4 -right-4 bg-[#E09C2D] rounded-xl px-4 py-3 shadow-lg text-sm text-white font-medium">
            AI powered
          </div>
        </div>

      </div>
    </section>
  );
}
