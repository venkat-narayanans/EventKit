"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { TeamMember } from "@/types";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  CheckCircle2,
  QrCode,
  ArrowRight,
  GitBranch,
  Github,
  Globe,
  FileText,
  Sparkles,
  Smartphone,
  CreditCard,
  ShieldCheck,
  Code2,
} from "lucide-react";
import { Phone, Notification, Badge } from "@/kit";

export const StudentPortal: React.FC = () => {
  const { events, selectedEventId, setSelectedEventId, registerTeam, submitMilestone } = useStore();

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const [activeTab, setActiveTab] = useState<"register" | "submit">("register");

  // Registration state
  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [collegeName, setCollegeName] = useState("National Institute of Technology, Trichy");
  const [member2Name, setMember2Name] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [issuedTicket, setIssuedTicket] = useState<{ id: string; ticketId: string; teamName: string } | null>(null);
  const [showMobileDeviceMockup, setShowMobileDeviceMockup] = useState(false);

  // Milestone submission state
  const [subTeamName, setSubTeamName] = useState("");
  const [subGithub, setSubGithub] = useState("");
  const [subDemo, setSubDemo] = useState("");
  const [subDeck, setSubDeck] = useState("");
  const [subProblem, setSubProblem] = useState("");
  const [isSubSubmitted, setIsSubSubmitted] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !leaderEmail.trim()) return;

    const members: TeamMember[] = [
      { id: "m1", name: leaderName.trim() || "Lead", email: leaderEmail.trim(), college: collegeName.trim(), role: "lead" },
    ];

    if (member2Name.trim()) {
      members.push({ id: "m2", name: member2Name.trim(), email: "member@college.edu", college: collegeName.trim(), role: "member" });
    }

    const created = registerTeam({
      eventId: currentEvent.id,
      teamName: teamName.trim(),
      leaderName: leaderName.trim() || "Team Lead",
      leaderEmail: leaderEmail.trim(),
      collegeName: collegeName.trim(),
      members,
      paymentStatus: currentEvent.isPaid ? "verified" : "free",
      utrNumber: currentEvent.isPaid ? utrNumber.trim() : undefined,
    });

    setIssuedTicket({
      id: created.id,
      ticketId: created.ticketId,
      teamName: created.teamName,
    });
  };

  const handleSubmitMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subTeamName.trim() || !subGithub.trim()) return;

    submitMilestone({
      teamId: `tm-${Date.now()}`,
      teamName: subTeamName.trim(),
      eventId: currentEvent.id,
      phase: 3,
      problemStatement: subProblem.trim() || "Autonomous Real-Time Optimization",
      techStack: ["Next.js", "TypeScript", "PostgreSQL"],
      githubRepoUrl: subGithub.trim(),
      liveDemoUrl: subDemo.trim() || undefined,
      presentationDeckUrl: subDeck.trim() || undefined,
      commitsCount: Math.floor(20 + Math.random() * 30),
    });

    setIsSubSubmitted(true);
    setTimeout(() => {
      setIsSubSubmitted(false);
      setSubTeamName("");
      setSubGithub("");
      setSubDemo("");
    }, 3500);
  };

  /* Apple Wallet Pass Content Component (Reused inside Phone and in mobile edge-to-edge view) */
  const renderWalletPassContent = (isMockupInside: boolean) => (
    <div className={`space-y-4 ${isMockupInside ? "p-4 text-white" : "p-6 rounded-3xl border border-blue-100 bg-white text-slate-900 shadow-sm"}`}>
      {/* Wallet Pass Header */}
      <div className={`flex items-center justify-between border-b pb-3 ${isMockupInside ? "border-white/[0.08]" : "border-slate-100"}`}>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center font-fortnite text-sm text-white">
            F
          </div>
          <span className={`text-[11px] font-fortnite tracking-wide uppercase ${isMockupInside ? "text-zinc-300" : "text-blue-950"}`}>
            FESTRA WALLET
          </span>
        </div>
        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-fortnite tracking-wide text-emerald-700 uppercase">
          {issuedTicket ? "VERIFIED ADMIT" : "LIVE PREVIEW"}
        </span>
      </div>

      {/* Main Ticket Surface */}
      <div className={`rounded-2xl border p-5 space-y-4 shadow-md relative overflow-hidden ${isMockupInside ? "border-white/[0.1] bg-slate-900" : "border-slate-200 bg-slate-50"}`}>
        {/* Track Color Ribbon Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600" />

        <div className="space-y-1 pt-1">
          <div className="text-[10px] font-fortnite uppercase tracking-wider text-blue-600">
            {currentEvent?.category.replace("_", " ")}
          </div>
          <div className={`text-base font-fortnite uppercase tracking-wide leading-tight ${isMockupInside ? "text-white" : "text-blue-950"}`}>
            {currentEvent?.title}
          </div>
          <div className={`text-[11px] ${isMockupInside ? "text-zinc-400" : "text-slate-500"}`}>
            {currentEvent?.venue}
          </div>
        </div>

        <div className={`border-t border-dashed pt-3 grid grid-cols-2 gap-2 text-xs ${isMockupInside ? "border-white/[0.12]" : "border-slate-200"}`}>
          <div>
            <div className="text-[9px] uppercase font-bold text-slate-400">Squad Name</div>
            <div className={`font-fortnite uppercase tracking-wide truncate text-sm ${isMockupInside ? "text-white" : "text-blue-950"}`}>
              {issuedTicket?.teamName || teamName.trim() || "Nexus Protocol"}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase font-bold text-slate-400">Lead Participant</div>
            <div className={`font-medium truncate ${isMockupInside ? "text-zinc-200" : "text-slate-700"}`}>
              {leaderName.trim() || "Aditya Krishnan"}
            </div>
          </div>
          <div className="col-span-2 pt-1">
            <div className="text-[9px] uppercase font-bold text-slate-400">Institution</div>
            <div className={`text-[11px] truncate ${isMockupInside ? "text-zinc-300" : "text-slate-600"}`}>
              {collegeName.trim() || "NIT Trichy"}
            </div>
          </div>
        </div>

        {/* QR Code & Barcode Section */}
        <div className={`border-t pt-3 flex items-center justify-between gap-3 ${isMockupInside ? "border-white/[0.08]" : "border-slate-200"}`}>
          <div className="rounded-xl bg-white p-2 shadow-sm flex-shrink-0 border border-slate-200">
            <QrCode className="h-14 w-14 text-slate-900" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="text-[9px] uppercase font-bold text-slate-400">Admit Token</div>
            <div className="font-fortnite text-base text-blue-600 tracking-wider">
              {issuedTicket?.ticketId || "TK-PREVIEW-8842"}
            </div>
            <div className={`text-[10px] leading-tight ${isMockupInside ? "text-zinc-400" : "text-slate-500"}`}>
              Present at Security Kiosk for physical badge print & booth assignment.
            </div>
          </div>
        </div>
      </div>

      {/* Security Watermark */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>Cryptographically signed by Festra Engine</span>
      </div>
    </div>
  );

  /* Hacker Milestone Pass Content for Tab 2 */
  const renderMilestonePhoneContent = () => (
    <div className="p-4 space-y-4 text-white">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
            <GitBranch className="h-3.5 w-3.5" />
          </div>
          <span className="text-[11px] font-fortnite tracking-wide uppercase text-zinc-300">Phase 3 Terminal</span>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-fortnite tracking-wide uppercase ${isSubSubmitted ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/15 text-amber-400 border border-amber-500/30"}`}>
          {isSubSubmitted ? "CODE FROZEN" : "AUDIT ACTIVE"}
        </span>
      </div>

      <div className="rounded-2xl border border-white/[0.1] bg-slate-900 p-5 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500" />

        <div className="space-y-1 pt-1">
          <div className="text-[10px] font-fortnite uppercase tracking-wider text-blue-400">Milestone Checkpoint</div>
          <div className="text-base font-fortnite uppercase tracking-wide text-white leading-tight">
            {subTeamName.trim() || teamName.trim() || "Nexus Protocol"}
          </div>
          <div className="text-xs text-zinc-400">
            {subProblem.trim() || "Real-Time AI & Systems Optimization"}
          </div>
        </div>

        <div className="border-t border-white/[0.08] pt-3 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Repository:</span>
            <span className="text-blue-400 truncate max-w-[180px]">
              {subGithub.trim() || "github.com/festra/core"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Commits Audited:</span>
            <span className="text-emerald-400 font-bold font-fortnite text-sm">28 Verified Commits</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Commit Freeze Hash:</span>
            <span className="text-zinc-300">#9f2a7bc1</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-950 border border-white/[0.06] p-3 text-[11px] text-zinc-400 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
            <Code2 className="h-3.5 w-3.5 text-blue-400" />
            <span>Automated Anti-Plagiarism & Commit Check</span>
          </div>
          <div>✓ No 11th-hour zip code dump detected.</div>
          <div>✓ Commit velocity matches 24-hr sprint cadence.</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Event Track Selector (Touch Friendly Pill Bar) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-blue-100">
        <span className="text-xs font-fortnite uppercase tracking-wide text-slate-500 mr-2 whitespace-nowrap">TRACK:</span>
        {events.map((ev) => (
          <button
            key={ev.id}
            onClick={() => {
              setSelectedEventId(ev.id);
              setIssuedTicket(null);
            }}
            className={`rounded-xl px-3.5 py-1.5 font-fortnite text-sm tracking-wide uppercase whitespace-nowrap transition min-h-[34px] ${
              ev.id === currentEvent?.id
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:text-blue-900 hover:bg-blue-50"
            }`}
          >
            {ev.title}
          </button>
        ))}
      </div>

      {/* Blue & White Event Hero Header */}
      <div className="rounded-3xl border border-blue-100 bg-white p-6 sm:p-8 space-y-5 shadow-sm relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 h-48 w-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <span className="inline-block rounded-full px-3 py-0.5 text-[10px] font-fortnite uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              {currentEvent?.category.replace("_", " ")}
            </span>
            <h1 className="font-fortnite text-3xl sm:text-4xl text-blue-950 uppercase tracking-wide">
              {currentEvent?.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              {currentEvent?.tagline}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-center sm:min-w-[190px]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Prize Pool</div>
            <div className="font-fortnite text-3xl text-blue-600 mt-0.5">{currentEvent?.prizes.pool}</div>
            <div className="text-xs font-fortnite tracking-wide text-emerald-700 font-bold mt-1">
              {currentEvent?.isPaid ? `₹${currentEvent.ticketPrice} / SQUAD` : "FREE ENTRY"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>{currentEvent?.venue}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span>{currentEvent?.teamSizeMin}–{currentEvent?.teamSizeMax} Members / Squad</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-emerald-700 font-semibold">Registration Live</span>
          </div>
        </div>
      </div>

      {/* Portal Tabs: Register vs Submit Code */}
      <div className="flex items-center justify-between border-b border-blue-100">
        <div className="flex items-center text-xs">
          <button
            onClick={() => setActiveTab("register")}
            className={`px-4 py-2.5 font-fortnite text-sm tracking-wide uppercase border-b-2 transition min-h-[40px] ${
              activeTab === "register"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            1. Squad Registration & Digital Ticket
          </button>
          <button
            onClick={() => setActiveTab("submit")}
            className={`px-4 py-2.5 font-fortnite text-sm tracking-wide uppercase border-b-2 transition min-h-[40px] ${
              activeTab === "submit"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            2. Phase 3 Code Freeze & Pitch
          </button>
        </div>

        {/* Mobile Mockup Toggle (visible on screens < 1024px) */}
        <div className="lg:hidden pb-1">
          <button
            onClick={() => setShowMobileDeviceMockup(!showMobileDeviceMockup)}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900"
          >
            <Smartphone className="h-3 w-3 text-blue-600" />
            <span>{showMobileDeviceMockup ? "Form View" : "Device View"}</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Column Stage: Left Form / Right Stageshow Authentic iPhone 18 Pro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Interactive Form (or full-width pass when confirmed on mobile) */}
        <div className={`space-y-6 ${showMobileDeviceMockup ? "hidden lg:block lg:col-span-7" : "lg:col-span-7"}`}>
          {activeTab === "register" && (
            <>
              {issuedTicket ? (
                /* Confirmed Card (Mobile friendly) */
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-3">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                    <div>
                      <h3 className="font-fortnite text-2xl text-emerald-950 uppercase tracking-wide">Squad Confirmed!</h3>
                      <p className="text-xs text-slate-700 mt-1">
                        Team <span className="font-bold text-slate-900">{issuedTicket.teamName}</span> is registered for {currentEvent.title}.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setIssuedTicket(null)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-fortnite text-xs text-slate-700 hover:bg-slate-50 tracking-wide uppercase transition shadow-sm"
                      >
                        Register Another Squad
                      </button>
                    </div>
                  </div>

                  {/* On Mobile screens, show the full pass card directly */}
                  <div className="lg:hidden">
                    {renderWalletPassContent(false)}
                  </div>
                </div>
              ) : (
                /* Registration Input Form */
                <form
                  onSubmit={handleRegister}
                  className="rounded-2xl border border-blue-100 bg-white p-5 sm:p-7 space-y-4 text-xs shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-fortnite text-lg text-blue-950 uppercase tracking-wide">Squad Registration Form</h3>
                    <span className="text-[11px] text-slate-500">Live preview updates on right</span>
                  </div>

                  <div>
                    <label className="text-slate-700 font-medium">Squad / Team Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nexus Protocol"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-medium">Team Leader Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Aditya Krishnan"
                        value={leaderName}
                        onChange={(e) => setLeaderName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-medium">Leader College Email</label>
                      <input
                        type="email"
                        required
                        placeholder="aditya@nitt.edu"
                        value={leaderEmail}
                        onChange={(e) => setLeaderEmail(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-medium">Institution / University</label>
                    <input
                      type="text"
                      required
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 font-medium">Teammate 2 Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="Leave empty if solo or add teammate"
                      value={member2Name}
                      onChange={(e) => setMember2Name(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  {currentEvent?.isPaid && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-700 font-medium">Registration Fee</span>
                        <span className="font-fortnite text-lg text-blue-950">₹{currentEvent.ticketPrice}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Pay via UPI ID: <span className="font-mono text-blue-600 font-bold">{currentEvent.upiId || "fest@okicici"}</span>
                      </div>
                      <div className="pt-1">
                        <label className="text-[11px] text-slate-700 font-medium">12-Digit Bank UTR / Reference ID</label>
                        <input
                          type="text"
                          placeholder="e.g. 432190887123"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 py-3.5 font-fortnite text-base tracking-wide text-white hover:bg-blue-700 transition shadow-sm min-h-[44px]"
                  >
                    CONFIRM REGISTRATION & ISSUE PASS
                  </button>
                </form>
              )}
            </>
          )}

          {activeTab === "submit" && (
            <div className="space-y-4">
              {isSubSubmitted && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                  <span>Project artifacts submitted! Code freeze checkpoint verified.</span>
                </div>
              )}

              <form
                onSubmit={handleSubmitMilestone}
                className="rounded-2xl border border-blue-100 bg-white p-5 sm:p-7 space-y-4 text-xs shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-fortnite text-lg text-blue-950 uppercase tracking-wide">Phase 3 Submission & Code Freeze</h3>
                  <span className="text-[11px] text-slate-500">Jury evaluation ready</span>
                </div>

                <div>
                  <label className="text-slate-700 font-medium">Your Squad Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nexus Protocol"
                    value={subTeamName}
                    onChange={(e) => setSubTeamName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-medium">Problem Statement Solved</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autonomous Sub-Second Credit Scoring"
                    value={subProblem}
                    onChange={(e) => setSubProblem(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-medium flex items-center gap-1.5">
                    <Github className="h-3.5 w-3.5 text-slate-500" />
                    Public GitHub Repository Link
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/my-org/my-project"
                    value={subGithub}
                    onChange={(e) => setSubGithub(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 font-mono focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-medium flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-slate-500" />
                      Live Deployed URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://my-demo.vercel.app"
                      value={subDemo}
                      onChange={(e) => setSubDemo(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 font-mono focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 font-medium flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-slate-500" />
                      Pitch Deck URL (PDF)
                    </label>
                    <input
                      type="url"
                      placeholder="https://slides.com/my-deck"
                      value={subDeck}
                      onChange={(e) => setSubDeck(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 font-mono focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 py-3.5 font-fortnite text-base tracking-wide text-white hover:bg-blue-700 transition shadow-sm min-h-[44px]"
                >
                  FREEZE & SUBMIT CODE FOR JURY REVIEW
                </button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Stageshow Authentic iPhone 18 Pro Preview (Desktop or when toggled on mobile) */}
        <div className={`lg:col-span-5 flex flex-col items-center justify-center ${showMobileDeviceMockup ? "block" : "hidden lg:flex"}`}>
          <div className="text-center mb-3">
            <span className="text-[10px] font-fortnite uppercase tracking-wider text-slate-400">
              {activeTab === "register" ? "Apple Wallet Live Pass Preview" : "Hacker Milestone Device Terminal"}
            </span>
          </div>

          <Phone
            width={340}
            frame="pro"
            dark
            time="10:00"
            className="shadow-xl transition duration-300 hover:scale-[1.01]"
          >
            {/* Live iOS Notification Banner if ticket was issued */}
            {issuedTicket && activeTab === "register" && (
              <Notification
                banner
                icon={<CheckCircle2 className="h-5 w-5 text-white" />}
                title="Festra Wallet"
                body={`Admit Pass active for ${issuedTicket.teamName}`}
                time="now"
              />
            )}

            {/* Screen Content */}
            {activeTab === "register" ? renderWalletPassContent(true) : renderMilestonePhoneContent()}
          </Phone>
        </div>
      </div>
    </div>
  );
};
