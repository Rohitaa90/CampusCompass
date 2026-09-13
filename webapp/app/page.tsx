import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";

export default function LandingPage() {
  return (
    <SmoothScroll>
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <Testimonials />
    </SmoothScroll>
  );
}
