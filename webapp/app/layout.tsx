import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/landing/Footer";
import GlobalProfilePopup from "@/components/GlobalProfilePopup";
import CookieNotice from "@/components/CookieNotice";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: {
    default: "CampusCompass — Find your college, your way",
    template: "%s — CampusCompass",
  },
  description:
    "AI-powered college and career guidance for Indian students. Search colleges by stream, budget, and city. Ask your AI counselor anything.",
  icons: {
    icon: [
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicons/favicon.ico",
    apple: "/favicons/apple-touch-icon.png",
  },
  manifest: "/favicons/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sora.variable}>
      <body className="font-sora bg-[#F5F3EE] antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <GlobalProfilePopup />
        <CookieNotice />
      </body>
    </html>
  );
}
