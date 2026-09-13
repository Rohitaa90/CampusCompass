"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

export default function CookieNotice() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasAccepted = localStorage.getItem("cc_cookie_accepted");
    if (!hasAccepted) {
      setShow(true);
    }

    const handleOpen = () => setShow(true);
    window.addEventListener("openCookieNotice", handleOpen);
    return () => window.removeEventListener("openCookieNotice", handleOpen);
  }, []);

  if (!mounted || !show) return null;

  const handleAccept = () => {
    localStorage.setItem("cc_cookie_accepted", "true");
    setShow(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-[#F5F3EE] text-[#16213E] p-6 rounded-xl shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 text-[#E09C2D]">
          <Cookie className="w-5 h-5" />
          <h3 className="font-semibold text-sm text-[#16213E]">Cookie Policy</h3>
        </div>
        <button
          onClick={handleAccept}
          className="text-slate-400 hover:text-[#16213E] transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-slate-600 text-xs leading-relaxed mb-5">
        We use cookies to improve your experience, remember your preferences, and provide personalized AI counseling. By continuing to use our site, you agree to our use of cookies.
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleAccept}
          className="flex-1 bg-[#3D7A6B] hover:bg-[#2d5c50] text-white text-xs font-semibold py-2 rounded-lg transition-colors shadow-sm"
        >
          Accept All
        </button>
        <button
          onClick={handleAccept}
          className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2 rounded-lg transition-colors shadow-sm"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
