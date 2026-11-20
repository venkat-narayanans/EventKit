import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FESTRA — Campus Event Operations & Hackathon Platform",
  description:
    "The all-in-one operating system for college hackathons, technical symposiums, and paper presentations. Features encrypted QR entrance passes, Git milestone verification, Gaussian Z-score fair judging, 1-click bulk certificate generation, and NAAC IQAC accreditation dossiers.",
  keywords: [
    "campus event management",
    "college hackathon platform",
    "hackathon judging software",
    "Z-score score normalization",
    "NAAC criteria 3.3.2 dossier",
    "digital admit ticket QR pass",
    "college tech fest certificates",
  ],
  openGraph: {
    title: "FESTRA — Campus Event Operations & Hackathon Platform",
    description:
      "All-in-one operating system for college hackathons, paper symposiums, and tech fests. Automated QR passes, Git milestone audits, fair Z-score judging, and 1-click NAAC dossiers.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FESTRA — Campus Event Operations Platform",
    description: "The modern operating system for college hackathons and technical fests.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
