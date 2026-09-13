// lib/api.ts — Centralized fetch helpers for all backend API calls
// All protected calls automatically attach the JWT from localStorage.
// Base URL comes from the NEXT_PUBLIC_API_URL env variable.

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ─── Helper: build headers ────────────────────────────────────────────────────
// Reads the token from localStorage (only runs client-side).
const getHeaders = (isProtected: boolean): HeadersInit => {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (isProtected && typeof window !== "undefined") {
    const token = localStorage.getItem("cc_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// ─── Generic request wrapper ─────────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {},
  isProtected = false
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(isProtected), ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const signup = (name: string, email: string, password: string) =>
  request("/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) });

export const login = (email: string, password: string) =>
  request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });

// ─── Profile ──────────────────────────────────────────────────────────────────
export const getProfile = () =>
  request("/profile", { method: "GET" }, true);

export const saveProfile = (data: object) =>
  request("/profile", { method: "POST", body: JSON.stringify(data) }, true);

// ─── Colleges ─────────────────────────────────────────────────────────────────
export const getColleges = (params?: { stream?: string; location?: string; maxBudget?: string }) => {
  const qs = new URLSearchParams(
    Object.entries(params || {}).filter(([, v]) => v) as [string, string][]
  ).toString();
  return request(`/colleges${qs ? `?${qs}` : ""}`, { method: "GET" });
};

// ─── Bookmarks ────────────────────────────────────────────────────────────────
export const getBookmarks = () =>
  request("/bookmarks", { method: "GET" }, true);

export const addBookmark = (collegeId: string) =>
  request("/bookmarks", { method: "POST", body: JSON.stringify({ collegeId }) }, true);

export const removeBookmark = (id: string) =>
  request(`/bookmarks/${id}`, { method: "DELETE" }, true);

// ─── AI Counselor ─────────────────────────────────────────────────────────────
export const askAI = (question: string) =>
  request("/ai/ask", { method: "POST", body: JSON.stringify({ question }) }, true);
