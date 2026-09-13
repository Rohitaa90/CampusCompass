"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getBookmarks, getProfile, removeBookmark } from "@/lib/api";
import { Brain, Search, Star, X, Camera, Loader2 } from "lucide-react";
import ProfileCompletionCard from "@/components/ProfileCompletionCard";
import EditProfileModal from "@/components/EditProfileModal";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";

interface College {
  _id: string;
  name: string;
  stream: string;
  location: string;
  fees: number;
  rating: number;
}

interface Bookmark {
  _id: string;
  college: College;
}

interface Profile {
  preferredStream?: string;
  budget?: number;
  locationPreference?: string;
  interests?: string[];
  photoUrl?: string;
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { uploadFile, uploading, completionPercentage } = useProfileCompletion();

  const loadProfileData = async () => {
    try {
      const pData = await getProfile() as { profile: Profile };
      setProfile(pData.profile);
    } catch {
      // Keep existing profile or null
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [bData, pData] = await Promise.all([
          getBookmarks() as Promise<{ bookmarks: Bookmark[] }>,
          getProfile().catch(() => null) as Promise<{ profile: Profile } | null>,
        ]);
        setBookmarks(bData.bookmarks);
        if (pData) setProfile(pData.profile);
      } catch {
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleRemove = async (bookmarkId: string) => {
    setRemoving(bookmarkId);
    try {
      await removeBookmark(bookmarkId);
      setBookmarks((prev) => prev.filter((b) => b._id !== bookmarkId));
    } catch {
      // Silent fail
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center pt-16">
        <div className="w-8 h-8 rounded-full border-2 border-[#3D7A6B] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EE] pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl text-[#16213E] mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Your dashboard
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left — Profile summary */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-xl p-6 border border-slate-100 flex flex-col items-center text-center">
              {/* Large Avatar with SVG Progress Ring */}
              <div className="relative w-36 h-36 mb-4">
                {/* SVG Ring Background */}
                <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full transform -rotate-90 overflow-visible">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="6"
                  />
                  {/* SVG Progress Ring */}
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#3D7A6B"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="339.29"
                    strokeDashoffset={339.29 - (completionPercentage / 100) * 339.29}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                {/* Avatar & Upload Input */}
                <label className="absolute inset-2 cursor-pointer group rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading === "photo"}
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        await uploadFile(e.target.files[0], "photo");
                        await loadProfileData();
                      }
                    }}
                  />
                  {profile?.photoUrl ? (
                    <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-4xl font-bold text-slate-300">?</div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    {uploading === "photo" ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </div>
                </label>

                {/* Percentage Pin Badge */}
                <div className="absolute bottom-0 right-1 bg-[#E09C2D] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md border-2 border-white">
                  {completionPercentage}%
                </div>
              </div>

              <div>
                <h2 className="font-semibold text-[#16213E] text-xl leading-tight">Your profile</h2>
                <p className="text-xs text-slate-500 mt-1">Click avatar to update photo</p>
              </div>

              <div className="w-full h-px bg-slate-100 my-5"></div>

              {profile ? (
                <div className="space-y-3 text-sm">
                  {profile.preferredStream && (
                    <div>
                      <span className="text-[#64748B]">Stream </span>
                      <span className="font-medium text-[#16213E]">{profile.preferredStream}</span>
                    </div>
                  )}
                  {profile.budget && (
                    <div>
                      <span className="text-[#64748B]">Budget </span>
                      <span className="font-medium text-[#16213E]">₹{(profile.budget / 100000).toFixed(1)}L / yr</span>
                    </div>
                  )}
                  {profile.locationPreference && (
                    <div>
                      <span className="text-[#64748B]">Location </span>
                      <span className="font-medium text-[#16213E]">{profile.locationPreference}</span>
                    </div>
                  )}
                  {profile.interests && profile.interests.length > 0 && (
                    <div>
                      <div className="text-[#64748B] mb-1.5">Interests</div>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.interests.map((i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-[#F5F3EE] text-[#3D7A6B] rounded-full">
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[#64748B]">No profile yet.</p>
              )}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="mt-4 text-sm font-medium text-[#3D7A6B] hover:underline"
              >
                Edit profile details
              </button>
            </div>

            {/* Quick links */}
            <div className="bg-[#16213E] rounded-xl p-6 space-y-5">
              {/* Quick links */}
              <Link
                href="/chat"
                className="flex items-center gap-3 text-white text-sm hover:text-[#E09C2D] transition-colors"
              >
                <Brain className="text-lg" /> Ask AI Counselor
              </Link>
              <Link
                href="/colleges"
                className="flex items-center gap-3 text-white text-sm hover:text-[#E09C2D] transition-colors"
              >
                <Search className="text-lg" /> Browse colleges
              </Link>
            </div>
          </div>

          {/* Right — Bookmarks */}
          <div className="md:col-span-2">
            <h2 className="font-semibold text-[#16213E] mb-4">
              Saved colleges{" "}
              <span className="text-[#64748B] font-normal">({bookmarks.length})</span>
            </h2>

            {bookmarks.length === 0 ? (
              <div className="bg-white rounded-xl p-10 border border-slate-100 text-center">
                <p className="text-[#64748B] mb-4">No saved colleges yet.</p>
                <Link
                  href="/colleges"
                  className="inline-block px-6 py-3 rounded-full bg-[#3D7A6B] text-white text-sm hover:bg-[#4a9180] transition-colors"
                >
                  Browse and bookmark
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookmarks.map((bm) => (
                  <div
                    key={bm._id}
                    className="bg-white rounded-xl p-5 border border-slate-100 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#16213E] text-sm truncate">{bm.college.name}</h3>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-[#64748B]">
                        <span className="text-[#3D7A6B] font-medium">{bm.college.stream}</span>
                        <span>{bm.college.location}</span>
                        <span>₹{(bm.college.fees / 100000).toFixed(1)}L/yr</span>
                        <div className="flex items-center gap-0.5">
                          <Star className="text-[#E09C2D] w-3 h-3" fill="currentColor" /> {bm.college.rating}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(bm._id)}
                      disabled={removing === bm._id}
                      className="flex-shrink-0 text-slate-400 hover:text-red-500 transition-colors p-1 disabled:opacity-40"
                      title="Remove bookmark"
                    >
                      {removing === bm._id ? (
                        <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={profile}
        onSuccess={() => {
          setIsEditModalOpen(false);
          loadProfileData();
        }}
      />
    </div>
  );
}
