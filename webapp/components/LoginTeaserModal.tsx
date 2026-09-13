"use client";

import { Brain, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface LoginTeaserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginTeaserModal({ isOpen, onClose }: LoginTeaserModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-16 h-16 bg-[#E09C2D]/10 rounded-xl flex items-center justify-center mb-6">
            <Brain className="w-8 h-8 text-[#E09C2D]" />
          </div>
          
          <h2 className="text-2xl font-bold text-[#16213E] mb-3">
            Unlock the AI Counselor
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Create a free account to chat with our advanced AI. Get personalized college recommendations based on your stream, budget, and location.
          </p>

          <div className="flex flex-col w-full gap-3">
            <Link 
              href="/signup"
              onClick={onClose}
              className="w-full bg-[#3D7A6B] text-white font-semibold py-3.5 rounded-full hover:bg-[#2d5c50] transition-colors"
            >
              Create Free Account
            </Link>
            <Link 
              href="/login"
              onClick={onClose}
              className="w-full bg-slate-50 text-slate-700 font-semibold py-3.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
            >
              Log in to existing account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    const { createPortal } = require('react-dom');
    return createPortal(modalContent, document.body);
  }
  return null;
}
