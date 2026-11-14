import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "FESTRA — The Unified Campus Event & Fest Operating System",
  description:
    "An all-in-one operations platform for college technical fests, hackathons, and symposiums with customizable rubrics, verifiable credentials, and 1-click NAAC/NIRF accreditation dossiers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased bg-grid-pattern selection:bg-brand-coral selection:text-white">
        <div className="relative min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </main>
          <footer className="border-t border-zinc-800/80 bg-zinc-950/80 py-6 mt-16 text-center text-xs text-zinc-500">
            <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-wider">FESTRA.</span>
                <span>• Built for 1,000+ Person College Technical Fests</span>
              </div>
              <div className="flex items-center gap-4 text-zinc-400">
                <span>Zero AI Slop</span>
                <span>•</span>
                <span>High Craft & Speed</span>
                <span>•</span>
                <span>NIT Trichy Pilot</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
