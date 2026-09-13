"use client";
// app/onboarding/page.tsx — Collect student profile preferences
// Protected route. POSTs to /api/profile, then redirects to /colleges.

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { saveProfile } from "@/lib/api";

const STREAMS = ["Engineering", "Medical", "Commerce", "Arts", "Design", "Management", "Law"];
const INTEREST_OPTIONS = [
  "AI & Technology", "Business", "Healthcare", "Design & Creativity",
  "Law & Policy", "Environment", "Finance", "Education", "Media & Journalism",
  "Research & Science",
];
const LOCATIONS = ["Delhi NCR", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Anywhere"];

export default function OnboardingPage() {
  return (
    <ProtectedRoute>
      <OnboardingForm />
    </ProtectedRoute>
  );
}

function OnboardingForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    interests: [] as string[],
    preferredStream: "",
    budget: 500000,
    locationPreference: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleInterest = (interest: string) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await saveProfile(form);
      router.push("/colleges");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE] pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl text-[#16213E] mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Tell us about yourself
          </h1>
          <p className="text-[#64748B]">
            This helps us personalise your college matches and AI counselor responses.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Stream */}
          <div>
            <label className="block text-sm font-semibold text-[#16213E] mb-3">
              Preferred stream
            </label>
            <div className="flex flex-wrap gap-2">
              {STREAMS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, preferredStream: s })}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${
                    form.preferredStream === s
                      ? "bg-[#3D7A6B] text-white border-[#3D7A6B]"
                      : "bg-white text-[#16213E] border-slate-200 hover:border-[#3D7A6B]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-semibold text-[#16213E] mb-3">
              Your interests <span className="font-normal text-[#64748B]">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${
                    form.interests.includes(interest)
                      ? "bg-[#E09C2D] text-white border-[#E09C2D]"
                      : "bg-white text-[#16213E] border-slate-200 hover:border-[#E09C2D]"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Budget slider */}
          <div>
            <label className="block text-sm font-semibold text-[#16213E] mb-1">
              Annual budget
            </label>
            <p className="text-2xl font-bold text-[#3D7A6B] mb-3">
              ₹{(form.budget / 100000).toFixed(1)}L / year
            </p>
            <input
              type="range"
              min={50000}
              max={2500000}
              step={50000}
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
              className="w-full accent-[#3D7A6B]"
            />
            <div className="flex justify-between text-xs text-[#64748B] mt-1">
              <span>₹0.5L</span>
              <span>₹25L</span>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-[#16213E] mb-3">
              Preferred city / location
            </label>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setForm({ ...form, locationPreference: loc === "Anywhere" ? "" : loc })}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${
                    (loc === "Anywhere" && !form.locationPreference) || form.locationPreference === loc
                      ? "bg-[#16213E] text-white border-[#16213E]"
                      : "bg-white text-[#16213E] border-slate-200 hover:border-[#16213E]"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#16213E] text-white font-medium hover:bg-[#1e2d4a] transition-colors disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save and explore colleges"}
          </button>
        </form>
      </div>
    </div>
  );
}
