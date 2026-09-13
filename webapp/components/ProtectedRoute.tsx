"use client";
// components/ProtectedRoute.tsx — Redirects to /login if no JWT is found
// Wrap any page that requires authentication with this component.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("cc_token");
    if (!token) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  // Show nothing while checking — avoids flash of protected content
  if (!checked) {
    return (
      <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#3D7A6B] border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
