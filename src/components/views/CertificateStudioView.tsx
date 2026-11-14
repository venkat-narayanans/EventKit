"use client";

import React, { useState } from "react";
import { useFestraStore } from "@/lib/store";
import {
  Award,
  Sliders,
  QrCode,
  CheckCircle2,
  Share2,
  ExternalLink,
  ShieldCheck,
  Download,
  Sparkles,
  Palette,
} from "lucide-react";
import {
  calculateAutoFontSize,
  generateLinkedInCertificateUrl,
} from "@/lib/certificate";

export const CertificateStudioView: React.FC = () => {
  const { certificate, updateCertificateDesign, fest } = useFestraStore();

  const [studentName, setStudentName] = useState(certificate.recipientName);
  const [eventName, setEventName] = useState(certificate.eventName);
  const [institutionName, setInstitutionName] = useState(certificate.institutionName);
  const [accentColor, setAccentColor] = useState(certificate.designTemplate.accentColor);
  const [backgroundType, setBackgroundType] = useState<"dark_cyber" | "royal_navy" | "gold_minimal">("dark_cyber");

  const backgroundPresets = {
    dark_cyber: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    royal_navy: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80",
    gold_minimal: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
  };

  const handleBackgroundChange = (preset: "dark_cyber" | "royal_navy" | "gold_minimal") => {
    setBackgroundType(preset);
    updateCertificateDesign({ backgroundUrl: backgroundPresets[preset] });
  };

  // Calculate dynamic auto font size so long names never clip
  const computedFontSize = calculateAutoFontSize(studentName, 550, 40, 22);

  const linkedInUrl = generateLinkedInCertificateUrl({
    certificateCode: certificate.certificateCode,
    eventName: eventName,
    institutionName: institutionName,
    issueDate: certificate.issuedDate,
    verificationUrl: certificate.verificationUrl,
  });

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-lime/20 px-2.5 py-0.5 text-xs font-bold text-brand-lime">
              BYOD (BRING YOUR OWN DESIGN) STUDIO
            </span>
            <span className="text-xs text-zinc-400">Verifiable Proof-of-Work Vault</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            Custom Certificate Studio & Verifier
          </h1>
          <p className="text-xs text-zinc-400">
            Customize artwork, institution, event names, and dynamic QR verification codes.
          </p>
        </div>

        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl bg-[#0A66C2] px-4 py-2 text-xs font-bold text-white hover:bg-[#004182] transition shadow-md"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Test Add to LinkedIn</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Live Canvas Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Live Certificate Canvas Preview (16:9)
            </span>
            <span className="text-xs text-brand-cyan font-mono">
              Auto-Font Scaling: {computedFontSize}px
            </span>
          </div>

          {/* Certificate Canvas Box */}
          <div
            className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-zinc-700 p-8 sm:p-10 text-center flex flex-col justify-between shadow-2xl transition-all"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85)), url(${certificate.designTemplate.backgroundUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Top Ornamental Header */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                {institutionName}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                {fest.department}
              </div>
              <div
                className="mt-2 text-xs font-bold uppercase tracking-widest"
                style={{ color: accentColor }}
              >
                ★ Certificate of Achievement ★
              </div>
            </div>

            {/* Middle Recipient & Proof */}
            <div className="space-y-2 py-4">
              <p className="text-xs text-zinc-400">This is proudly presented to</p>
              <h2
                className="font-serif font-black tracking-wide text-white transition-all drop-shadow-md"
                style={{ fontSize: `${computedFontSize}px` }}
              >
                {studentName}
              </h2>
              <p className="text-xs text-zinc-300 max-w-lg mx-auto leading-relaxed">
                for securing <span className="font-bold text-white">{certificate.roleLabel}</span> at{" "}
                <span className="font-semibold text-white">{eventName}</span> held during{" "}
                <span className="font-semibold text-white">{fest.name}</span>.
              </p>
            </div>

            {/* Bottom Footer: Signatures & Dynamic QR */}
            <div className="grid grid-cols-3 items-end border-t border-zinc-800/80 pt-4 text-left">
              {/* Signatory 1 */}
              <div className="space-y-0.5">
                <div className="font-script text-xs font-bold text-zinc-300 italic">Dr. G. Aghila</div>
                <div className="h-px w-24 bg-zinc-700" />
                <div className="text-[10px] text-zinc-400 font-medium">{certificate.designTemplate.signatory1.title}</div>
              </div>

              {/* Dynamic QR Verification Box */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="rounded-lg bg-white p-1.5 shadow-sm">
                  <QrCode className="h-10 w-10 text-black" />
                </div>
                <span className="font-mono text-[9px] text-zinc-400">
                  {certificate.certificateCode}
                </span>
              </div>

              {/* Signatory 2 */}
              <div className="space-y-0.5 text-right">
                <div className="font-script text-xs font-bold text-zinc-300 italic">Dr. B. Janet</div>
                <div className="h-px w-24 bg-zinc-700 ml-auto" />
                <div className="text-[10px] text-zinc-400 font-medium">{certificate.designTemplate.signatory2.title}</div>
              </div>
            </div>
          </div>

          {/* Proof of Work Inspector Box */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Permanent Proof-of-Work Verification Record
              </span>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                CRYPTOGRAPHICALLY SIGNED
              </span>
            </div>

            <div className="p-3 bg-zinc-950 rounded-xl space-y-1.5 font-mono text-xs text-zinc-400">
              <div className="truncate">HASH: <span className="text-zinc-200">{certificate.verificationHash}</span></div>
              <div>PROJECT: <span className="text-brand-cyan">{certificate.proofOfWork.projectName}</span></div>
              <div>STANDINGS: <span className="text-brand-amber">{certificate.proofOfWork.rankText}</span></div>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Palette className="h-4 w-4 text-brand-violet" />
                Design & Artwork Customizer
              </h2>
              <p className="text-xs text-zinc-400">
                Modify event name, host college, and background templates.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400">Student Recipient Name (Test scaling)</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-brand-violet focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400">Event / Competition Name</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-brand-violet focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400">Host Institution / University</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-brand-violet focus:outline-none"
                />
              </div>

              {/* Background Art Presets */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400">Custom Artwork Preset</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleBackgroundChange("dark_cyber")}
                    className={`rounded-xl border p-2 text-xs font-semibold transition ${
                      backgroundType === "dark_cyber"
                        ? "border-brand-coral bg-brand-coral/10 text-white"
                        : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
                    }`}
                  >
                    Dark Cyber
                  </button>
                  <button
                    onClick={() => handleBackgroundChange("royal_navy")}
                    className={`rounded-xl border p-2 text-xs font-semibold transition ${
                      backgroundType === "royal_navy"
                        ? "border-brand-cyan bg-brand-cyan/10 text-white"
                        : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
                    }`}
                  >
                    Royal Blue
                  </button>
                  <button
                    onClick={() => handleBackgroundChange("gold_minimal")}
                    className={`rounded-xl border p-2 text-xs font-semibold transition ${
                      backgroundType === "gold_minimal"
                        ? "border-brand-amber bg-brand-amber/10 text-white"
                        : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
                    }`}
                  >
                    Minimal Gold
                  </button>
                </div>
              </div>

              {/* Accent Color Chooser */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400">Accent Star Color</label>
                <div className="flex items-center gap-3">
                  {["#FFA502", "#00D2D3", "#FF4757", "#A8FF3E", "#FFFFFF"].map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setAccentColor(color);
                        updateCertificateDesign({ accentColor: color });
                      }}
                      className={`h-7 w-7 rounded-full transition-transform ${
                        accentColor === color ? "scale-125 ring-2 ring-white" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800">
                <button
                  onClick={() => alert(`Certificate successfully minted for ${studentName}! Available at ${certificate.verificationUrl}`)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition"
                >
                  <Download className="h-4 w-4" />
                  <span>Download SVG Vector Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
