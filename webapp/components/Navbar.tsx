"use client";
// components/Navbar.tsx — Top navigation bar
// Shows different links based on whether the user is logged in.

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import LoginTeaserModal from "./LoginTeaserModal";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("cc_token"));
  }, [pathname]); // Re-check on route change

  const handleLogout = () => {
    localStorage.removeItem("cc_token");
    localStorage.removeItem("cc_user");
    setLoggedIn(false);
    router.push("/");
  };

  const isLanding = pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 ${
        isLanding ? "bg-transparent" : "bg-[#F5F3EE]"
      } transition-colors duration-300 border-b border-slate-200/50`}
      style={isLanding ? { background: "rgba(245,243,238,0.92)", backdropFilter: "blur(8px)" } : {}}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image 
          src="/logo-campuscompass-cropped.svg" 
          alt="CampusCompass Logo" 
          width={220} 
          height={40} 
          priority 
        />
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="/colleges" className="text-sm text-slate-600 hover:text-black transition-colors font-semibold">
          Colleges
        </Link>
        <div className="rainbow-border-wrapper rounded-full p-[2px] shadow-sm">
          {loggedIn ? (
            <Link href="/chat" className="flex items-center gap-1.5 bg-[#F5F3EE] hover:bg-white text-sm text-[#16213E] font-bold px-4 py-1.5 rounded-full transition-colors">
              ✨ AI Counselor
            </Link>
          ) : (
            <button onClick={() => setShowTeaser(true)} className="flex items-center gap-1.5 bg-[#F5F3EE] hover:bg-white text-sm text-[#16213E] font-bold px-4 py-1.5 rounded-full transition-colors">
              ✨ AI Counselor
            </button>
          )}
        </div>
        {loggedIn && (
          <Link href="/dashboard" className="text-sm text-slate-600 hover:text-black transition-colors font-semibold">
            Dashboard
          </Link>
        )}
        {loggedIn ? (
          <button
            onClick={handleLogout}
            className="text-sm px-5 py-2 rounded-full border border-slate-400 text-slate-600 hover:border-[#16213E] hover:bg-[#16213E] hover:text-white transition-all font-semibold"
          >
            Log out
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 hover:text-black transition-colors font-semibold">
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm px-5 py-2 rounded-full bg-[#3D7A6B] text-white hover:bg-[#4a9180] transition-colors"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-slate-600 hover:text-black transition-colors"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#F5F3EE] border-t border-slate-200 py-4 px-6 flex flex-col gap-4 md:hidden shadow-lg">
          <Link href="/colleges" className="text-slate-600 hover:text-black font-semibold" onClick={() => setMenuOpen(false)}>
            Colleges
          </Link>
          {loggedIn ? (
            <Link href="/chat" className="text-slate-600 hover:text-black font-semibold" onClick={() => setMenuOpen(false)}>
              AI Counselor
            </Link>
          ) : (
            <button onClick={() => { setMenuOpen(false); setShowTeaser(true); }} className="text-left text-slate-600 hover:text-black font-semibold">
              AI Counselor
            </button>
          )}
          {loggedIn && (
            <Link href="/dashboard" className="text-slate-600 hover:text-black font-semibold" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
          )}
          {loggedIn ? (
            <button onClick={handleLogout} className="text-left text-slate-600 hover:text-black font-semibold">
              Log out
            </button>
          ) : (
            <>
              <Link href="/login" className="text-slate-600 hover:text-black font-semibold" onClick={() => setMenuOpen(false)}>
                Log in
              </Link>
              <Link href="/signup" className="text-[#E09C2D] font-bold" onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}

      {/* Teaser Modal */}
      <LoginTeaserModal isOpen={showTeaser} onClose={() => setShowTeaser(false)} />
    </nav>
  );
}
