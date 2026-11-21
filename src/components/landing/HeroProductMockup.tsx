"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import {
  ShieldCheck,
  QrCode,
  GitBranch,
  Award,
  CheckCircle2,
  FileCheck2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Users,
  Terminal,
  Cpu,
  Layers,
  Printer,
  FileText,
} from "lucide-react";

export const HeroProductMockup: React.FC = () => {
  const { setViewMode, events, selectedEventId } = useStore();
  const [activeTab, setActiveTab] = useState<"overview" | "roster" | "judging">("overview");

  return (
    <div className="relative mx-auto w-full max-w-5xl text-left select-none">
      {/* Outer Browser / macOS Style App Window */}
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-blue-950/10">
        {/* Window Chrome Title Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-400/80 border border-rose-500/30" />
            <div className="h-3 w-3 rounded-full bg-amber-400/80 border border-amber-500/30" />
            <div className="h-3 w-3 rounded-full bg-emerald-400/80 border border-emerald-500/30" />
            <div className="hidden sm:flex items-center gap-2 ml-3 pl-3 border-l border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span>FESTRA ARENA CONSOLE • v2.4</span>
            </div>
          </div>

          {/* Center Simulated URL / Secure Badge */}
          <div className="hidden md:flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1 text-xs text-slate-500 shadow-xs">
            <span className="text-emerald-500 font-bold">https://</span>
            <span className="font-medium text-slate-700">festra.campus.edu/live/hackcampus-2026</span>
          </div>

          {/* Live Arena Status Pill */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>50 SQUADS ACTIVE</span>
            </span>
          </div>
        </div>

        {/* Console Action Bar / Track Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>HackCampus 24h AI</span>
            </button>
            <button
              onClick={() => setActiveTab("roster")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "roster"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Live Roster</span>
            </button>
            <button
              onClick={() => setActiveTab("judging")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "judging"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Z-Score Leaderboard</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <button
              onClick={() => setViewMode("dashboard")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition"
              title="Open Printable A4 Notice Board Poster"
            >
              <Printer className="h-3.5 w-3.5 text-blue-600" />
              <span>Print A4 Poster</span>
            </button>
            <button
              onClick={() => setViewMode("dashboard")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition"
              title="Generate NAAC IQAC Compliance Dossier"
            >
              <FileText className="h-3.5 w-3.5 text-blue-600" />
              <span>NAAC Dossier</span>
            </button>
          </div>
        </div>

        {/* Dashboard Main Canvas Grid */}
        <div className="p-4 sm:p-6 bg-slate-50/60 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT COLUMN: Student Live Pass & QR Station (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Student Admit Pass (Apple Wallet / Passcard aesthetic) */}
            <div className="rounded-2xl border border-blue-200/80 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-fortnite text-sm">
                    F
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      STUDENT ADMIT PASS
                    </div>
                    <div className="font-bold text-xs text-slate-900">
                      HackCampus 24h AI Hackathon
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  GATE SCANNED
                </span>
              </div>

              {/* Pass Holder Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <span className="block text-[10px] uppercase font-semibold text-slate-400">
                    Lead Attendee
                  </span>
                  <span className="font-bold text-slate-800 truncate block">
                    Aditya Sharma
                  </span>
                  <span className="text-[10px] text-slate-500">Roll #24CS089</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <span className="block text-[10px] uppercase font-semibold text-slate-400">
                    Squad Name
                  </span>
                  <span className="font-bold text-blue-700 truncate block">
                    Nexus Protocol
                  </span>
                  <span className="text-[10px] text-slate-500">4 Members Verified</span>
                </div>
              </div>

              {/* Dynamic QR Pass Code Box */}
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-3 flex items-center gap-4">
                {/* Simulated Scannable Vector QR Code Matrix */}
                <div className="h-16 w-16 bg-white rounded-lg border border-slate-200 p-1.5 flex flex-col justify-between shrink-0 shadow-xs">
                  <div className="flex justify-between">
                    <div className="h-4 w-4 bg-slate-900 rounded-xs flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-xs flex items-center justify-center">
                        <div className="h-1 w-1 bg-slate-900" />
                      </div>
                    </div>
                    <div className="h-4 w-4 bg-slate-900 rounded-xs flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-xs flex items-center justify-center">
                        <div className="h-1 w-1 bg-slate-900" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-ping" />
                    <div className="h-2 w-4 bg-slate-800" />
                    <div className="h-1.5 w-1.5 bg-slate-800" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-4 bg-slate-900 rounded-xs flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-xs flex items-center justify-center">
                        <div className="h-1 w-1 bg-slate-900" />
                      </div>
                    </div>
                    <div className="h-3 w-3 bg-blue-600 rounded-xs" />
                  </div>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Digital Ticket Token
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-900">
                    CF-TKT-6751-NX
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Checked in at Gate B • Mech Block 3F
                  </div>
                </div>
              </div>
            </div>

            {/* Printable Notice Board Standee Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Physical Notice Board Poster
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Printable A4 QR poster with registration deep-link
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewMode("dashboard")}
                className="shrink-0 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg px-2.5 py-1.5 transition"
              >
                View Poster →
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Real-Time Git Audit & Fair Judging (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Git Commit Milestone Radar & Velocity */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                    <GitBranch className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      LIVE CODE AUDIT
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      Milestone Velocity & Git Verification
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  28 Commits Audited • 0% Pre-built
                </span>
              </div>

              {/* 3 Milestones Pipeline Indicator */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-2">
                  <div className="text-[10px] font-bold text-blue-600 uppercase">
                    M1: Architecture
                  </div>
                  <div className="text-xs font-bold text-slate-800">100% Passed</div>
                </div>
                <div className="rounded-xl border border-blue-300 bg-blue-100/50 p-2">
                  <div className="text-[10px] font-bold text-blue-700 uppercase">
                    M2: Working MVP
                  </div>
                  <div className="text-xs font-bold text-blue-900">Live Pushes</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    M3: Code Freeze
                  </div>
                  <div className="text-xs font-semibold text-slate-500">Locks 11:59 PM</div>
                </div>
              </div>

              {/* Mini Terminal / Commit Stream */}
              <div className="rounded-xl bg-slate-950 p-3 text-slate-300 font-mono text-[11px] space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 text-[10px] border-b border-slate-800 pb-1">
                  <span>RECENT REPO PUSHES (NEXUS-PROTOCOL/AI-AGENT)</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    SYNCED
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span className="truncate">
                    <span className="text-blue-400 font-bold">commit 8f3c1a:</span> feat: implement z-score normalizer
                  </span>
                  <span className="text-slate-500 text-[10px] shrink-0 ml-2">2m ago</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="truncate">
                    <span className="text-blue-400 font-bold">commit 4b29df:</span> test: mock 50 judge scores calibration
                  </span>
                  <span className="text-slate-500 text-[10px] shrink-0 ml-2">14m ago</span>
                </div>
              </div>
            </div>

            {/* Real-time Fair Jury Leaderboard (Z-Score Normalizer) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      FAIR JURY RUBRICS
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      Gaussian $Z$-Score Leaderboard
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  Z = (X - μ) / σ
                </span>
              </div>

              {/* Leaderboard Table Snippet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between rounded-xl bg-blue-50/60 border border-blue-200/80 px-3 py-2 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="h-5 w-5 rounded-md bg-amber-400 text-white font-fortnite text-xs flex items-center justify-center shrink-0 shadow-xs">
                      #1
                    </span>
                    <div className="truncate">
                      <div className="font-bold text-slate-900 truncate">
                        Nexus Protocol <span className="text-[10px] font-normal text-slate-500">(AI MedCare)</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Judge Dr. Ramanathan (Strict: μ=5.8)
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-blue-700 text-xs">
                      +2.18σ <span className="text-[10px] font-normal text-slate-500">(94.6)</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase text-emerald-600 bg-emerald-100/60 px-1.5 py-0.2 rounded">
                      Gold 1st Prize
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="h-5 w-5 rounded-md bg-slate-300 text-slate-700 font-fortnite text-xs flex items-center justify-center shrink-0">
                      #2
                    </span>
                    <div className="truncate">
                      <div className="font-bold text-slate-800 truncate">
                        Aura Vision <span className="text-[10px] font-normal text-slate-500">(Assistive AR)</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Judge Prof. Sengupta (Lenient: μ=8.2)
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-slate-700 text-xs">
                      +1.84σ <span className="text-[10px] font-normal text-slate-500">(91.2)</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase text-blue-600 bg-blue-100/60 px-1.5 py-0.2 rounded">
                      Silver 2nd Prize
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom One-Click Certificate & NAAC Banner */}
              <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-blue-700 font-medium">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  Winner Certificates & NAAC Dossier automatically synced
                </span>
                <button
                  onClick={() => setViewMode("dashboard")}
                  className="font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-0.5"
                >
                  <span>Open Certificate Studio</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
