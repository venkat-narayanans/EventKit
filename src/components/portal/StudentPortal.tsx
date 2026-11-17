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
    <div className={`space-y-4 ${isMockupInside ? "p-4 text-white" : "p-6 rounded-3xl border border-white/[0.12] bg-[#111114]"}`}>
      {/* Wallet Pass Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-devfolio-blue flex items-center justify-center font-bold text-xs text-white">
            F
          </div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-300">Festra Wallet</span>
        </div>
        <span className="rounded-full bg-kahoot-green/15 border border-kahoot-green/30 px-2 py-0.5 text-[10px] font-bold text-kahoot-green">
          {issuedTicket ? "VERIFIED ADMIT" : "LIVE PREVIEW"}
        </span>
      </div>

      {/* Main Ticket Surface */}
      <div className="rounded-2xl border border-white/[0.1] bg-[#0c0c0e] p-5 space-y-4 shadow-xl relative overflow-hidden">
        {/* Track Color Ribbon Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-devfolio-blue via-kahoot-yellow to-kahoot-green" />

        <div className="space-y-1 pt-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-devfolio-blue">
            {currentEvent?.category.replace("_", " ")}
          </div>
          <div className="text-base font-extrabold text-white leading-tight">
            {currentEvent?.title}
          </div>
          <div className="text-[11px] text-zinc-400">
            {currentEvent?.venue}
          </div>
        </div>

        <div className="border-t border-dashed border-white/[0.12] pt-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-[9px] uppercase font-bold text-zinc-500">Squad Name</div>
            <div className="font-bold text-white truncate text-sm">
              {issuedTicket?.teamName || teamName.trim() || "Nexus Protocol"}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase font-bold text-zinc-500">Lead Participant</div>
            <div className="font-semibold text-zinc-200 truncate">
              {leaderName.trim() || "Aditya Krishnan"}
            </div>
          </div>
          <div className="col-span-2 pt-1">
            <div className="text-[9px] uppercase font-bold text-zinc-500">Institution</div>
            <div className="text-[11px] text-zinc-300 truncate">
              {collegeName.trim() || "NIT Trichy"}
            </div>
          </div>
        </div>

        {/* QR Code & Barcode Section */}
        <div className="border-t border-white/[0.08] pt-3 flex items-center justify-between gap-3">
          <div className="rounded-xl bg-white p-2 shadow-md flex-shrink-0">
            <QrCode className="h-16 w-16 text-black" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="text-[9px] uppercase font-bold text-zinc-500">Admit Token</div>
            <div className="font-mono text-xs font-black text-kahoot-yellow tracking-wider">
              {issuedTicket?.ticketId || "TK-PREVIEW-8842"}
            </div>
            <div className="text-[10px] text-zinc-400 leading-tight">
              Present at Security Kiosk for physical badge print & booth assignment.
            </div>
          </div>
        </div>
      </div>

      {/* Security Watermark */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 pt-1">
        <ShieldCheck className="h-3.5 w-3.5 text-kahoot-green" />
        <span>Cryptographically signed by Festra Engine</span>
      </div>
    </div>
  );

  /* Hacker Milestone Pass Content for Tab 2 */
  const renderMilestonePhoneContent = () => (
    <div className="p-4 space-y-4 text-white">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-devfolio-blue flex items-center justify-center font-bold text-xs text-white">
            <GitBranch className="h-3.5 w-3.5" />
          </div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-300">Phase 3 Terminal</span>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isSubSubmitted ? "bg-kahoot-green/15 text-kahoot-green border border-kahoot-green/30" : "bg-amber-500/15 text-amber-400 border border-amber-500/30"}`}>
          {isSubSubmitted ? "CODE FROZEN" : "AUDIT ACTIVE"}
        </span>
      </div>

      <div className="rounded-2xl border border-white/[0.1] bg-[#0c0c0e] p-5 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />

        <div className="space-y-1 pt-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Milestone Checkpoint</div>
          <div className="text-base font-extrabold text-white leading-tight">
            {subTeamName.trim() || teamName.trim() || "Nexus Protocol"}
          </div>
          <div className="text-xs text-zinc-400">
            {subProblem.trim() || "Real-Time AI & Systems Optimization"}
          </div>
        </div>

        <div className="border-t border-white/[0.08] pt-3 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Repository:</span>
            <span className="text-devfolio-blue truncate max-w-[180px]">
              {subGithub.trim() || "github.com/festra/core"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Commits Audited:</span>
            <span className="text-kahoot-green font-bold">28 Verified Commits</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Commit Freeze Hash:</span>
            <span className="text-zinc-300">#9f2a7bc1</span>
          </div>
        </div>

        <div className="rounded-xl bg-zinc-900/80 border border-white/[0.06] p-3 text-[11px] text-zinc-400 space-y-1">
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
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar border-b border-white/[0.08]">
        <span className="text-xs font-semibold text-zinc-500 mr-2 whitespace-nowrap">Track:</span>
        {events.map((ev) => (
          <button
            key={ev.id}
            onClick={() => {
              setSelectedEventId(ev.id);
              setIssuedTicket(null);
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition min-h-[34px] ${
              ev.id === currentEvent?.id
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            {ev.title}
          </button>
        ))}
      </div>

      {/* Luma-style Event Hero Header */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#111114] p-6 sm:p-8 space-y-5 shadow-luma-card relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 h-48 w-48 bg-devfolio-blue/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <span className="inline-block rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-devfolio-blue/15 text-devfolio-blue border border-devfolio-blue/30">
              {currentEvent?.category.replace("_", " ")}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentEvent?.title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
              {currentEvent?.tagline}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#08080a] p-4 text-center sm:min-w-[190px]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Prize Pool</div>
            <div className="text-2xl font-black text-kahoot-yellow mt-0.5">{currentEvent?.prizes.pool}</div>
            <div className="text-xs text-kahoot-green font-bold mt-1">
              {currentEvent?.isPaid ? `₹${currentEvent.ticketPrice} / Squad` : "FREE ENTRY"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-zinc-500" />
            <span>{currentEvent?.venue}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-zinc-500" />
            <span>{currentEvent?.teamSizeMin}–{currentEvent?.teamSizeMax} Members / Squad</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-kahoot-green font-semibold">Registration Live</span>
          </div>
        </div>
      </div>

      {/* Portal Tabs: Register vs Submit Code */}
      <div className="flex items-center justify-between border-b border-white/[0.08]">
        <div className="flex items-center text-xs">
          <button
            onClick={() => setActiveTab("register")}
            className={`px-4 py-2.5 font-bold border-b-2 transition min-h-[40px] ${
              activeTab === "register"
                ? "border-devfolio-blue text-white"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            1. Squad Registration & Digital Ticket
          </button>
          <button
            onClick={() => setActiveTab("submit")}
            className={`px-4 py-2.5 font-bold border-b-2 transition min-h-[40px] ${
              activeTab === "submit"
                ? "border-devfolio-blue text-white"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            2. Phase 3 Code Freeze & Pitch
          </button>
        </div>

        {/* Mobile Mockup Toggle (visible on screens < 1024px) */}
        <div className="lg:hidden pb-1">
          <button
            onClick={() => setShowMobileDeviceMockup(!showMobileDeviceMockup)}
            className="flex items-center gap-1 rounded-lg border border-white/[0.1] bg-[#111114] px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:text-white"
          >
            <Smartphone className="h-3 w-3 text-devfolio-blue" />
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
                  <div className="rounded-2xl border border-kahoot-green/30 bg-kahoot-green/10 p-5 text-center space-y-3">
                    <CheckCircle2 className="h-8 w-8 text-kahoot-green mx-auto" />
                    <div>
                      <h3 className="text-base font-bold text-white">Squad Confirmed!</h3>
                      <p className="text-xs text-zinc-300 mt-1">
                        Team <span className="font-semibold text-white">{issuedTicket.teamName}</span> is registered for {currentEvent.title}.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setIssuedTicket(null)}
                        className="rounded-xl border border-white/[0.1] bg-[#111114] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
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
                  className="rounded-2xl border border-white/[0.08] bg-[#111114] p-5 sm:p-7 space-y-4 text-xs shadow-luma-card"
                >
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <h3 className="text-sm font-bold text-white">Squad Registration Form</h3>
                    <span className="text-[11px] text-zinc-400">Live preview updates on right</span>
                  </div>

                  <div>
                    <label className="text-zinc-400 font-medium">Squad / Team Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nexus Protocol"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#08080a] px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-devfolio-blue focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 font-medium">Team Leader Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Aditya Krishnan"
                        value={leaderName}
                        onChange={(e) => setLeaderName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#08080a] px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-devfolio-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 font-medium">Leader College Email</label>
                      <input
                        type="email"
                        required
                        placeholder="aditya@nitt.edu"
                        value={leaderEmail}
                        onChange={(e) => setLeaderEmail(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#08080a] px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-devfolio-blue focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 font-medium">Institution / University</label>
                    <input
                      type="text"
                      required
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#08080a] px-3.5 py-2.5 text-white focus:border-devfolio-blue focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 font-medium">Teammate 2 Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="Leave empty if solo or add teammate"
                      value={member2Name}
                      onChange={(e) => setMember2Name(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#08080a] px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-devfolio-blue focus:outline-none"
                    />
                  </div>

                  {currentEvent?.isPaid && (
                    <div className="rounded-xl border border-white/[0.08] bg-[#08080a] p-4 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-300 font-medium">Registration Fee</span>
                        <span className="font-bold text-white text-sm">₹{currentEvent.ticketPrice}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Pay via UPI ID: <span className="font-mono text-devfolio-blue font-bold">{currentEvent.upiId || "fest@okicici"}</span>
                      </div>
                      <div className="pt-1">
                        <label className="text-[11px] text-zinc-400 font-medium">12-Digit Bank UTR / Reference ID</label>
                        <input
                          type="text"
                          placeholder="e.g. 432190887123"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#111114] px-3.5 py-2.5 text-white font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-devfolio-blue py-3 font-bold text-white hover:opacity-95 transition shadow-luma-glow min-h-[44px]"
                  >
                    Confirm Registration & Issue Pass
                  </button>
                </form>
              )}
            </>
          )}

          {activeTab === "submit" && (
            <div className="space-y-4">
              {isSubSubmitted && (
                <div className="rounded-2xl border border-kahoot-green/30 bg-kahoot-green/10 p-4 text-xs text-kahoot-green flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>Project artifacts submitted! Code freeze checkpoint verified.</span>
                </div>
              )}

              <form
                onSubmit={handleSubmitMilestone}
                className="rounded-2xl border border-white/[0.08] bg-[#111114] p-5 sm:p-7 space-y-4 text-xs shadow-luma-card"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <h3 className="text-sm font-bold text-white">Phase 3 Submission & Code Freeze</h3>
                  <span className="text-[11px] text-zinc-400">Jury evaluation ready</span>
                </div>

                <div>
                  <label className="text-zinc-400 font-medium">Your Squad Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nexus Protocol"
                    value={subTeamName}
                    onChange={(e) => setSubTeamName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#08080a] px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-medium">Problem Statement Solved</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autonomous Sub-Second Credit Scoring"
                    value={subProblem}
                    onChange={(e) => setSubProblem(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#08080a] px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-medium flex items-center gap-1.5">
                    <Github className="h-3.5 w-3.5" />
                    Public GitHub Repository Link
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/my-org/my-project"
                    value={subGithub}
                    onChange={(e) => setSubGithub(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#08080a] px-3.5 py-2.5 text-white font-mono focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 font-medium flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      Live Deployed URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://my-demo.vercel.app"
                      value={subDemo}
                      onChange={(e) => setSubDemo(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#08080a] px-3.5 py-2.5 text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 font-medium flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      Pitch Deck URL (PDF)
                    </label>
                    <input
                      type="url"
                      placeholder="https://slides.com/my-deck"
                      value={subDeck}
                      onChange={(e) => setSubDeck(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#08080a] px-3.5 py-2.5 text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-devfolio-blue py-3 font-bold text-white hover:opacity-95 transition shadow-luma-glow min-h-[44px]"
                >
                  Freeze & Submit Code for Jury Review
                </button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Stageshow Authentic iPhone 18 Pro Preview (Desktop or when toggled on mobile) */}
        <div className={`lg:col-span-5 flex flex-col items-center justify-center ${showMobileDeviceMockup ? "block" : "hidden lg:flex"}`}>
          <div className="text-center mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              {activeTab === "register" ? "Apple Wallet Live Pass Preview" : "Hacker Milestone Device Terminal"}
            </span>
          </div>

          <Phone
            width={340}
            frame="pro"
            dark
            time="10:00"
            className="shadow-2xl transition duration-300 hover:scale-[1.01]"
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
