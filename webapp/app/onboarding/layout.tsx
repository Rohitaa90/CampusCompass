import type { Metadata } from "next";
export const metadata: Metadata = { title: "Set Up Your Profile" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
