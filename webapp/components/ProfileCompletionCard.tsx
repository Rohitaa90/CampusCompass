"use client";

import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { X, UploadCloud, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  layout: "embedded" | "floating";
}

export default function ProfileCompletionCard({ layout }: Props) {
  const { completionPercentage, missingFields, loading, uploading, uploadFile } = useProfileCompletion();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (layout === "floating") {
      const isDismissed = sessionStorage.getItem("cc_profile_prompt_dismissed");
      if (isDismissed) {
        setDismissed(true);
      }
    }
  }, [layout]);

  if (loading || completionPercentage === 100 || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    sessionStorage.setItem("cc_profile_prompt_dismissed", "true");
    setDismissed(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "document") => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file, type);
    }
  };

  const containerClasses =
    layout === "embedded"
      ? "bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-8"
      : "fixed bottom-6 right-6 w-80 bg-white rounded-xl p-5 border border-slate-200 shadow-xl z-50 animate-in slide-in-from-bottom-5";

  return (
    <div className={containerClasses}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-[#16213E] text-base leading-snug">
          Complete your profile to get extremely accurate results
        </h3>
        {layout === "floating" && (
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 transition-colors ml-3"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Profile Completion
          </span>
          <span className="text-sm font-bold text-[#3D7A6B]">{completionPercentage}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3D7A6B] transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {missingFields.photo && (
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
            <div>
              <p className="text-sm font-semibold text-[#16213E]">Profile Photo</p>
              <p className="text-xs text-slate-500">+15% completion</p>
            </div>
            <label className="cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, "photo")}
                disabled={!!uploading}
              />
              <div className="bg-white border border-slate-200 text-slate-600 hover:text-[#3D7A6B] hover:border-[#3D7A6B] w-9 h-9 rounded-full flex items-center justify-center transition-colors">
                {uploading === "photo" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#3D7A6B]" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
              </div>
            </label>
          </div>
        )}

        {missingFields.document && (
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
            <div>
              <p className="text-sm font-semibold text-[#16213E]">Academic Document</p>
              <p className="text-xs text-slate-500">+15% completion</p>
            </div>
            <label className="cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, "document")}
                disabled={!!uploading}
              />
              <div className="bg-white border border-slate-200 text-slate-600 hover:text-[#3D7A6B] hover:border-[#3D7A6B] w-9 h-9 rounded-full flex items-center justify-center transition-colors">
                {uploading === "document" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#3D7A6B]" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
              </div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
