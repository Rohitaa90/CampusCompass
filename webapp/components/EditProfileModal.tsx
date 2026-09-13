"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { saveProfile } from "@/lib/api";

const STREAMS = ["Engineering", "Medical", "Commerce", "Arts", "Design", "Management"];
const LOCATIONS = ["Delhi NCR", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata"];
const INTEREST_OPTIONS = [
  "Coding", "Research", "Business", "Creative Arts",
  "Healthcare", "Finance", "Social Work", "Technology"
];

interface Profile {
  preferredStream?: string;
  budget?: number;
  locationPreference?: string;
  interests?: string[];
}

interface Props {
  initialData: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProfileModal({ initialData, isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [stream, setStream] = useState(initialData?.preferredStream || "");
  const [budget, setBudget] = useState(initialData?.budget?.toString() || "");
  const [location, setLocation] = useState(initialData?.locationPreference || "");
  const [interests, setInterests] = useState<string[]>(initialData?.interests || []);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await saveProfile({
        preferredStream: stream,
        budget: parseInt(budget),
        locationPreference: location,
        interests,
      });
      onSuccess(); // Triggers a re-fetch in the parent
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-[#16213E]">Edit Profile</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#16213E] mb-2">Preferred Stream</label>
              <select
                required
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3D7A6B]"
              >
                <option value="">Select a stream</option>
                {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#16213E] mb-2">Annual Budget (₹)</label>
              <input
                type="number"
                required
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 500000"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3D7A6B]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#16213E] mb-2">Preferred Location</label>
              <select
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3D7A6B]"
              >
                <option value="">Select a city</option>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#16213E] mb-2">Interests (Select multiple)</label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleInterest(opt)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      interests.includes(opt)
                        ? "bg-[#3D7A6B] text-white border border-[#3D7A6B]"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#3D7A6B] text-white font-medium text-sm hover:bg-[#2d5c50] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
