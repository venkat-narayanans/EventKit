import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FESTRA — Campus Event Operations & Accreditation Platform",
  description:
    "All-in-one operations platform for college hackathons, technical symposiums, and expos with custom rubrics, verifiable credentials, and 1-click NAAC/NIRF accreditation dossiers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
