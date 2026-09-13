"use client";
// components/landing/Footer.tsx

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaTwitter, FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";

export default function Footer() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("cc_token"));
  }, [pathname]);

  return (
    <footer className="bg-[#16213E] border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between gap-8">
        {/* Left */}
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <Image 
              src="/logo-campuscompass-cropped.svg" 
              alt="CampusCompass Logo" 
              width={220} 
              height={40} 
              className="invert" 
            />
          </Link>
          <p className="text-slate-400 text-sm max-w-xs">
            AI-powered college &amp; career guidance for Indian students.
          </p>
        </div>

        {/* Right — links */}
        <div className="flex flex-col md:flex-row md:flex-wrap md:gap-x-10 gap-y-4 text-sm text-slate-400">
          <Link href="/colleges" className="hover:text-white transition-colors">Colleges</Link>
          {loggedIn ? (
            <>
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="/chat" className="hover:text-white transition-colors">AI Counselor</Link>
            </>
          ) : (
            <>
              <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
              <Link href="/login" className="hover:text-white transition-colors">Log In</Link>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} CampusCompass. Built for students, by builders who remember the anxiety.
          </p>
          <button
            onClick={() => window.dispatchEvent(new Event("openCookieNotice"))}
            className="text-slate-500 hover:text-white text-xs transition-colors underline underline-offset-2"
          >
            Cookie Preferences
          </button>
        </div>
        <div className="flex gap-4 text-slate-300">
          <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
            <FaFacebook className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
            <FaTwitter className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
            <FaLinkedin className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
            <FaInstagram className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
