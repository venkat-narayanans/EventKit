"use client";

import React, { useState } from "react";
import {
  QrCode,
  GitBranch,
  FileCheck2,
  Award,
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Printer,
  ChevronRight,
  ExternalLink,
  Code2,
  Sparkles,
  Trophy,
} from "lucide-react";

export const LandingInteractiveShowcase: React.FC<{
  onLaunchOrganizer: () => void;
  onOpenStudentPortal: () => void;
}> = ({ onLaunchOrganizer, onOpenStudentPortal }) => {
  const [activeTab, setActiveTab] = useState<
    "qr" | "git" | "judging" | "certs" | "naac"
  >("qr");

  // Tab 1: QR Pass View state
  const [qrPassMode, setQrPassMode] = useState<"wallet" | "standee">("wallet");

  // Tab 3: Z-Score demo state
  const [judgeScore, setJudgeScore] = useState<number>(8);
  const [judgeType, setJudgeType] = useState<"strict" | "lenient">("strict");

  // Calculate live z-score
  // Strict judge: mean = 5.5, sd = 1.2
  // Lenient judge: mean = 8.5, sd = 1.0
  const mean = judgeType === "strict" ? 5.5 : 8.5;
  const sd = judgeType === "strict" ? 1.2 : 1.0;
  const zScore = ((judgeScore - mean) / sd).toFixed(2);
  const normalizedOutOf100 = Math.min(
    100,
    Math.max(0, Math.round(50 + Number(zScore) * 18))
  );

  // Tab 4: Certificate preview recipient
  const [certRecipient, setCertRecipient] = useState<
    "Aditya Krishnan" | "Karthik Raja" | "Sneha Roy"
  >("Aditya Krishnan");
  const [certType, setCertType] = useState<"participation" | "winner">("winner");

  return (
    <div className="rounded-3xl border border-blue-200/80 bg-white shadow-xl shadow-blue-500/5 overflow-hidden">
      {/* Top Interactive Tab Bar */}
      <div className="border-b border-slate-200 bg-slate-50/80 px-3 sm:px-6 py-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("qr")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
              activeTab === "qr"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <QrCode className="h-4 w-4" />
            <span>1. QR Admit Passes</span>
          </button>

          <button
            onClick={() => setActiveTab("git")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
              activeTab === "git"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GitBranch className="h-4 w-4" />
            <span>2. Git Commit Radar</span>
          </button>

          <button
            onClick={() => setActiveTab("judging")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
              activeTab === "judging"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileCheck2 className="h-4 w-4" />
            <span>3. Fair $Z$-Score Judging</span>
          </button>

          <button
            onClick={() => setActiveTab("certs")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
              activeTab === "certs"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Award className="h-4 w-4" />
            <span>4. Certificate Studio</span>
          </button>

          <button
            onClick={() => setActiveTab("naac")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
              activeTab === "naac"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>5. NAAC IQAC Dossier</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="p-5 sm:p-8">
        {/* TAB 1: QR PASSES */}
        {activeTab === "qr" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                Zero Gate Bottlenecks
              </span>
              <h3 className="font-fortnite text-2xl sm:text-3xl text-blue-950 uppercase tracking-wide leading-tight">
                ENCRYPTED QR PASSES & PRINTABLE A4 STANDEES
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Generate high-resolution printable posters for campus notice boards.
                Students scan on mobile to claim digital Apple Wallet passes with cryptographic Admit Tokens.
              </p>

              {/* Mode Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setQrPassMode("wallet")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    qrPassMode === "wallet"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Mobile Wallet Pass</span>
                </button>
                <button
                  onClick={() => setQrPassMode("standee")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    qrPassMode === "standee"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>A4 Notice Board Poster</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={onLaunchOrganizer}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                >
                  <span>Open Registration QR Generator in Workspace</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Right: Live Interactive Card Render */}
            <div className="lg:col-span-7 flex justify-center">
              {qrPassMode === "wallet" ? (
                <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center font-fortnite text-sm text-white">
                        F
                      </div>
                      <span className="font-fortnite text-xs uppercase tracking-wider text-slate-300">
                        FESTRA WALLET PASS
                      </span>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold uppercase">
                      VERIFIED ADMIT
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      24h AI Systems Hackathon
                    </div>
                    <div className="font-fortnite text-xl uppercase tracking-wide">
                      TEAM NEXUS PROTOCOL
                    </div>
                    <div className="text-xs text-slate-400">
                      Aditya Krishnan • NIT Trichy
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-3.5 flex items-center justify-between gap-3 text-slate-900">
                    <div className="h-16 w-16 bg-slate-900 rounded-xl p-1 flex items-center justify-center flex-shrink-0">
                      <QrCode className="h-14 w-14 text-white" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[9px] uppercase font-bold text-slate-400">Admit Token</div>
                      <div className="font-fortnite text-base text-blue-600">CF-TKT-6751</div>
                      <div className="text-[10px] text-slate-500">Fast Track Gate Kiosk Active</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-sm rounded-3xl border-2 border-blue-600 bg-white p-5 text-center space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-fortnite text-sm text-blue-950">FESTRA 2026</span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-full">
                      CAMPUS FLYER
                    </span>
                  </div>
                  <h4 className="font-fortnite text-lg text-blue-950 uppercase leading-snug">
                    HACKCAMPUS 24H SPRINT
                  </h4>
                  <div className="rounded-2xl border-2 border-dashed border-blue-300 p-3 mx-auto w-fit">
                    <QrCode className="h-28 w-28 text-slate-900" />
                  </div>
                  <div className="text-[11px] font-bold text-blue-600 uppercase">
                    SCAN WITH ANY PHONE TO REGISTER
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    festra.io/?view=portal&event=hack-ai-2026
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: GIT COMMIT RADAR */}
        {activeTab === "git" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                <Code2 className="h-3.5 w-3.5 text-blue-600" />
                Anti-Plagiarism Engine
              </span>
              <h3 className="font-fortnite text-2xl sm:text-3xl text-blue-950 uppercase tracking-wide leading-tight">
                REAL-TIME COMMIT CADENCE & MILESTONE AUDITING
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Eliminate 11th-hour zip code dumping and pre-built tutorial clones.
                Enforce 3 progress milestones (Abstract ➔ Prototype ➔ Final Freeze) with Git cryptographic commit audits.
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Phase 1: Abstract & Architecture Lock (Verified)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Phase 2: Working Deployed Prototype (Audited)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Phase 3: Code Freeze Checkpoint (#9f2a7bc1 Locked)</span>
                </div>
              </div>
            </div>

            {/* Right: Mock Git Terminal */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 font-mono text-xs text-slate-300 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-rose-500" />
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-slate-500 text-[11px] ml-2">festra-git-radar — v2.4</span>
                  </div>
                  <span className="text-emerald-400 text-[10px] font-bold">● AUDIT PASSED</span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="text-slate-500">$ festra audit --repo github.com/squad/nexus --freeze</div>
                  <div className="text-blue-400">✓ Audited 28 git commits authored within 24-hr sprint window.</div>
                  <div className="text-emerald-400">✓ Plagiarism similarity check: 4.2% (Passed threshold &lt; 15%).</div>
                  <div className="text-amber-400">✓ No 11th-hour zip code injection detected. Cadence normal.</div>
                  <div className="text-slate-400">Commit Freeze Hash: <span className="text-white">#c41f9a88</span> [Frozen for Jury]</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FAIR Z-SCORE JUDGING */}
        {activeTab === "judging" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                Zero Jury Bias
              </span>
              <h3 className="font-fortnite text-2xl sm:text-3xl text-blue-950 uppercase tracking-wide leading-tight">
                GAUSSIAN $Z$-SCORE FAIR JUDGING ENGINE
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                A harsh judge giving 6/10 shouldn&apos;t penalize a brilliant team, and an easy judge giving 10/10 shouldn&apos;t inflate mediocrity.
                Statistical Gaussian normalization converts raw ratings into fair standard scores [Z = (X - &mu;) / &sigma;].
              </p>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Judge Persona:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setJudgeType("strict")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        judgeType === "strict"
                          ? "bg-rose-600 text-white"
                          : "bg-white text-slate-600"
                      }`}
                    >
                      Harsh Judge (Avg 5.5)
                    </button>
                    <button
                      onClick={() => setJudgeType("lenient")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        judgeType === "lenient"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-600"
                      }`}
                    >
                      Lenient Judge (Avg 8.5)
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Raw Judge Score:</span>
                    <span className="font-fortnite text-sm text-blue-600">{judgeScore} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={judgeScore}
                    onChange={(e) => setJudgeScore(Number(e.target.value))}
                    className="w-full mt-1 accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right: Real-time Gaussian Normalization Output */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase">
                    Gaussian Normalization Live Output
                  </span>
                  <span className="text-xs font-bold text-emerald-700 font-mono">
                    Fairness Guaranteed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white p-4 border border-blue-100 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Statistical $Z$-Score</div>
                    <div className="font-fortnite text-3xl text-blue-950 font-mono">
                      {Number(zScore) >= 0 ? `+${zScore}` : zScore}σ
                    </div>
                    <div className="text-[10px] text-slate-500">Standard deviations from judge mean</div>
                  </div>

                  <div className="rounded-xl bg-white p-4 border border-blue-100 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Normalized Index</div>
                    <div className="font-fortnite text-3xl text-emerald-600 font-mono">
                      {normalizedOutOf100} / 100
                    </div>
                    <div className="text-[10px] text-slate-500">Unbiased tournament leaderboard rating</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  Notice: An 8/10 from a <strong>Harsh Judge</strong> yields <strong>+{((8 - 5.5) / 1.2).toFixed(2)}σ</strong> (top 2%), whereas an 8/10 from a <strong>Lenient Judge</strong> normalizes to <strong>{((8 - 8.5) / 1.0).toFixed(2)}σ</strong>. Festra ensures true merit wins!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CERTIFICATE STUDIO */}
        {activeTab === "certs" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                <Award className="h-3.5 w-3.5 text-blue-600" />
                1-Click 50+ Bulk Generator
              </span>
              <h3 className="font-fortnite text-2xl sm:text-3xl text-blue-950 uppercase tracking-wide leading-tight">
                CANVA-GRADE CERTIFICATES WITH AUTOMATED WINNER BATCHING
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Design once in the built-in studio or upload custom Canva/Figma artwork.
                Click 1 button to batch-generate 50+ uniform participation certificates and auto-populate winner medals directly from the finalized leaderboard!
              </p>

              {/* Recipient Switcher */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCertType("winner")}
                    className={`px-3 py-1.5 rounded-xl font-bold transition ${
                      certType === "winner"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    1st Prize Winner Pass
                  </button>
                  <button
                    onClick={() => setCertType("participation")}
                    className={`px-3 py-1.5 rounded-xl font-bold transition ${
                      certType === "participation"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    Uniform Participation Pass
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Test Recipient:</span>
                  {(["Aditya Krishnan", "Karthik Raja", "Sneha Roy"] as const).map((name) => (
                    <button
                      key={name}
                      onClick={() => setCertRecipient(name)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                        certRecipient === name
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Live Certificate Graphic Preview */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-md rounded-2xl border-4 border-blue-600 bg-white p-6 shadow-xl relative overflow-hidden text-center space-y-3">
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  NATIONAL INSTITUTE OF TECHNOLOGY • FESTRA 2026
                </div>
                <div className="font-fortnite text-xl uppercase text-blue-950">
                  {certType === "winner" ? "CERTIFICATE OF EXCELLENCE" : "CERTIFICATE OF PARTICIPATION"}
                </div>
                <div className="text-xs text-slate-500">This credential is proud to verify that</div>
                <div className="font-fortnite text-2xl text-blue-600 uppercase border-b-2 border-dashed border-slate-200 pb-1 mx-8">
                  {certRecipient}
                </div>
                <div className="text-[11px] text-slate-600">
                  {certType === "winner"
                    ? "Secured 1st Place Champions in HackCampus 24h AI Systems Hackathon with Project Nexus."
                    : "Actively participated in the HackCampus 24h AI Systems Sprint at NIT Trichy."}
                </div>

                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100">
                  <span>ID: CERT-2026-8842</span>
                  <span className="text-emerald-600 font-bold">✓ Blockchain Verified</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: NAAC DOSSIER */}
        {activeTab === "naac" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                Accreditation Audit Ready
              </span>
              <h3 className="font-fortnite text-2xl sm:text-3xl text-blue-950 uppercase tracking-wide leading-tight">
                1-CLICK NAAC IQAC CRITERIA 3.3.2 & 5.3.3 REPORT
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No more scrambling through old WhatsApp chats months after the event.
                Festra automatically compiles verified participant counts, institutional diversity, jury score distributions, and geo-tagged photos into an IQAC-compliant PDF audit dossier.
              </p>

              <button
                onClick={onLaunchOrganizer}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 font-fortnite text-xs text-white uppercase tracking-wider hover:bg-blue-700 transition shadow-sm"
              >
                <span>OPEN COMPLIANCE STUDIO IN WORKSPACE</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Right: Mock NAAC Report Summary */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm space-y-3 text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="font-fortnite text-base text-blue-950">IQAC COMPLIANCE DOSSIER</div>
                  <span className="rounded-full bg-blue-50 text-blue-700 font-bold px-2 py-0.5 text-[10px]">
                    CRITERION 3.3.2
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-400 font-bold">TOTAL PARTICIPANTS</div>
                    <div className="font-fortnite text-xl text-blue-950">142</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-400 font-bold">OUTSIDE COLLEGES</div>
                    <div className="font-fortnite text-xl text-blue-600">18</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-400 font-bold">GENDER DIVERSITY</div>
                    <div className="font-fortnite text-xl text-emerald-600">38% F</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  ✓ Verified Attendee Signatures Attached<br />
                  ✓ Statistical Score Distributions Graph Included<br />
                  ✓ Signed by Faculty Coordinator & Technical Council President
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
