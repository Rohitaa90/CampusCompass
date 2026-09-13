"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getColleges, addBookmark } from "@/lib/api";
import { Star, Bookmark } from "lucide-react";

interface College {
  _id: string;
  name: string;
  stream: string;
  location: string;
  fees: number;
  rating: number;
}

const STREAMS = ["", "Engineering", "Medical", "Commerce", "Arts", "Design", "Management"];
const LOCATIONS = ["", "Delhi NCR", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata"];

export default function CollegesPage() {
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarking, setBookmarking] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({ stream: "", location: "", maxBudget: "" });
  const [visibleCount, setVisibleCount] = useState(9);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getColleges({
        stream: filters.stream || undefined,
        location: filters.location || undefined,
        maxBudget: filters.maxBudget || undefined,
      }) as { colleges: College[] };
      setColleges(data.colleges);
      setVisibleCount(9); // Reset pagination on new search
    } catch {
      setColleges([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const handleBookmark = async (collegeId: string) => {
    const token = localStorage.getItem("cc_token");
    if (!token) {
      router.push("/login");
      return;
    }
    setBookmarking(collegeId);
    try {
      await addBookmark(collegeId);
      setBookmarked((prev) => new Set(prev).add(collegeId));
    } catch {
      // Already bookmarked or error — still mark locally
      setBookmarked((prev) => new Set(prev).add(collegeId));
    } finally {
      setBookmarking(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE] pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl text-[#16213E] mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Explore colleges
          </h1>
          <p className="text-[#64748B]">
            Filtered to what matters: stream, city, and your budget.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 mb-8 border border-slate-100 flex flex-wrap gap-4">
          <select
            value={filters.stream}
            onChange={(e) => setFilters({ ...filters, stream: e.target.value })}
            className="flex-1 min-w-[140px] border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-[#16213E] focus:outline-none focus:border-[#3D7A6B]"
          >
            <option value="">All streams</option>
            {STREAMS.filter(Boolean).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="flex-1 min-w-[140px] border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-[#16213E] focus:outline-none focus:border-[#3D7A6B]"
          >
            <option value="">All cities</option>
            {LOCATIONS.filter(Boolean).map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Max budget (₹)"
            value={filters.maxBudget}
            onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
            className="flex-1 min-w-[160px] border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-[#16213E] focus:outline-none focus:border-[#3D7A6B]"
          />

          <button
            onClick={() => setFilters({ stream: "", location: "", maxBudget: "" })}
            className="px-5 py-2.5 rounded-lg border border-slate-200 text-sm text-[#64748B] hover:border-slate-400 transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 rounded-full border-2 border-[#3D7A6B] border-t-transparent animate-spin" />
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-24 text-[#64748B]">
            No colleges match your filters. Try adjusting them.
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.slice(0, visibleCount).map((college) => (
                <CollegeCard
                  key={college._id}
                  college={college}
                  isBookmarked={bookmarked.has(college._id)}
                  isBookmarking={bookmarking === college._id}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
            
            {visibleCount < colleges.length && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 9)}
                  className="px-6 py-3 rounded-full border border-slate-300 text-sm font-semibold text-[#16213E] hover:bg-slate-50 transition-colors"
                >
                  Load more colleges
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── College Card ─────────────────────────────────────────────────────────────
function CollegeCard({
  college,
  isBookmarked,
  isBookmarking,
  onBookmark,
}: {
  college: College;
  isBookmarked: boolean;
  isBookmarking: boolean;
  onBookmark: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-semibold text-[#16213E] leading-tight">{college.name}</h3>
          <span className="inline-block mt-1 text-xs px-2.5 py-1 rounded-full bg-[#F5F3EE] text-[#3D7A6B] font-medium">
            {college.stream}
          </span>
        </div>
        <button
          onClick={() => onBookmark(college._id)}
          disabled={isBookmarked || isBookmarking}
          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isBookmarked
              ? "bg-[#E09C2D] text-white"
              : "bg-[#F5F3EE] text-[#64748B] hover:bg-[#E09C2D] hover:text-white"
          }`}
          title={isBookmarked ? "Bookmarked" : "Bookmark this college"}
        >
          {isBookmarking ? (
            <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : isBookmarked ? (
            <Bookmark className="w-4 h-4" fill="currentColor" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-[#64748B]">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {college.location}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
        <div>
          <div className="text-xs text-[#64748B] mb-0.5">Annual fees</div>
          <div className="font-semibold text-[#16213E]">
            ₹{(college.fees / 100000).toFixed(1)}L
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[#64748B] mb-0.5">Rating</div>
          <div className="flex items-center gap-1">
            <Star className="text-[#E09C2D] w-3 h-3" fill="currentColor" />
            <span className="font-semibold text-[#16213E]">{college.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
