"use client";

import { usePathname } from "next/navigation";
import ProfileCompletionCard from "./ProfileCompletionCard";
import { useEffect, useState } from "react";

export default function GlobalProfilePopup() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLoggedIn(!!localStorage.getItem("cc_token"));
  }, [pathname]);

  if (!mounted || !loggedIn) return null;

  // Do not show floating popup on chat or dashboard
  if (pathname === "/chat" || pathname === "/dashboard") {
    return null;
  }

  return <ProfileCompletionCard layout="floating" />;
}
