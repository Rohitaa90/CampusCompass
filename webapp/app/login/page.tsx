"use client";
// app/login/page.tsx — Log in to an existing account

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.email, form.password) as { token: string; user: object };
      localStorage.setItem("cc_token", data.token);
      localStorage.setItem("cc_user", JSON.stringify(data.user));
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl text-[#16213E] mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Welcome back
          </h1>
          <p className="text-[#64748B] text-sm">Continue where you left off.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#16213E]">Email</label>
            <input
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#3D7A6B] focus:ring-1 focus:ring-[#3D7A6B]"
              placeholder="you@email.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#16213E]">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#3D7A6B] focus:ring-1 focus:ring-[#3D7A6B]"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#3D7A6B] text-white font-medium text-sm hover:bg-[#4a9180] transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#3D7A6B] hover:underline font-medium">
              Sign up free
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
