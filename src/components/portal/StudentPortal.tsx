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
  ShieldCheck,
  QrCode,
  ArrowRight,
  GitBranch,
  Github,
  Globe,
  FileText,
  Sparkles,
} from "lucide-react";

export const StudentPortal: React.FC = () => {
  const { events, selectedEventId, setSelectedEventId, registerTeam, teams, submitMilestone } = useStore();

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const [activeTab, setActiveTab] = useState<"register" | "submit" | "verify">("register");

  // Registration state
  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [collegeName, setCollegeName] = useState("National Institute of Technology, Trichy");
  const [member2Name, setMember2Name] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [issuedTicket, setIssuedTicket] = useState<{ id: string; ticketId: string; teamName: string } | null>(null);

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
      members.push({ id: "m2", name: member2Name.trim(), email: "member@college.edu", college: collegeName.trim(), role: "member" as const });
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
      problemStatement: subProblem.trim() || "Real-Time Campus Logistics & AI Optimization",
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
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Event Track Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-zinc-800">
        <span className="text-xs font-semibold text-zinc-500 mr-2 whitespace-nowrap">Choose Track:</span>
        {events.map((ev) => (
          <button
            key={ev.id}
            onClick={() => {
              setSelectedEventId(ev.id);
              setIssuedTicket(null);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
              ev.id === currentEvent?.id
                ? "bg-white text-zinc-950 font-semibold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            {ev.title}
          </button>
        ))}
      </div>

      {/* Luma-style Clean Event Header */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="rounded px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {currentEvent?.category.replace("_", " ")}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {currentEvent?.title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
              {currentEvent?.tagline}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-center sm:min-w-[180px]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Prize Pool</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">{currentEvent?.prizes.pool}</div>
            <div className="text-xs text-emerald-400 font-semibold mt-1">
              {currentEvent?.isPaid ? `₹${currentEvent.ticketPrice} / Squad` : "FREE"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 border-t border-zinc-800/60 pt-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-zinc-500" />
            <span>{currentEvent?.venue}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-zinc-500" />
            <span>{currentEvent?.teamSizeMin}–{currentEvent?.teamSizeMax} Members per Squad</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-zinc-500" />
            <span>Registration Open</span>
          </div>
        </div>
      </div>

      {/* Portal Tabs: Register vs Submit Code vs Check Pass */}
      <div className="flex items-center border-b border-zinc-800 text-xs">
        <button
          onClick={() => setActiveTab("register")}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === "register"
              ? "border-white text-white"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          1. Squad Registration & Ticket
        </button>
        <button
          onClick={() => setActiveTab("submit")}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === "submit"
              ? "border-white text-white"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          2. Milestone Project Submission
        </button>
      </div>

      {/* TAB 1: Registration Form */}
      {activeTab === "register" && (
        <div className="space-y-6">
          {issuedTicket ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center space-y-4 max-w-md mx-auto">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-white">Squad Registered Successfully!</h3>
                <p className="text-xs text-zinc-300 mt-1">
                  Team <span className="font-semibold text-white">{issuedTicket.teamName}</span> is confirmed for {currentEvent?.title}.
                </p>
              </div>

              {/* Digital Pass / Ticket */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-3 text-left">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase font-bold">DIGITAL BADGE</div>
                    <div className="font-mono text-sm font-bold text-white">{issuedTicket.ticketId}</div>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    ADMIT ACTIVE
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-white p-2">
                    <QrCode className="h-12 w-12 text-black" />
                  </div>
                  <div className="text-[11px] text-zinc-400 space-y-0.5">
                    <div>Team: <span className="text-white font-medium">{issuedTicket.teamName}</span></div>
                    <div>Event: <span className="text-white">{currentEvent?.title}</span></div>
                    <div>Status: <span className="text-emerald-400">Ready for On-Ground QR Scan</span></div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIssuedTicket(null)}
                className="text-xs text-zinc-400 hover:text-white hover:underline"
              >
                Register Another Squad
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4 text-xs max-w-xl mx-auto">
              <h3 className="text-sm font-bold text-white">Squad Details</h3>

              <div>
                <label className="text-zinc-400 font-medium">Squad / Team Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Builders"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-medium">Team Leader Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Aditya Krishnan"
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:outline-none"
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
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:outline-none"
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
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-medium">Teammate 2 Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Leave empty if solo or add teammate"
                  value={member2Name}
                  onChange={(e) => setMember2Name(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:outline-none"
                />
              </div>

              {currentEvent?.isPaid && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-300 font-medium">Registration Fee</span>
                    <span className="font-bold text-white">₹{currentEvent.ticketPrice}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Pay via UPI ID: <span className="font-mono text-blue-400 font-semibold">{currentEvent.upiId || "fest@okicici"}</span>
                  </div>
                  <div className="pt-2">
                    <label className="text-[11px] text-zinc-400 font-medium">12-Digit Bank UTR / Reference ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 432190887123"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-white py-2.5 font-bold text-zinc-950 hover:bg-zinc-200 transition"
              >
                Confirm Registration & Get Digital Pass
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: Project Milestone Submission */}
      {activeTab === "submit" && (
        <div className="max-w-xl mx-auto">
          {isSubSubmitted && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>Project artifacts submitted! Routed to jury evaluation studio.</span>
            </div>
          )}

          <form onSubmit={handleSubmitMilestone} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white">Phase 3 Submission & Code Freeze</h3>

            <div>
              <label className="text-zinc-400 font-medium">Your Squad Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Nexus Protocol"
                value={subTeamName}
                onChange={(e) => setSubTeamName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 font-medium">Problem Statement Solved</label>
              <input
                type="text"
                required
                placeholder="e.g. Decentralized Sub-Second Credit Scoring"
                value={subProblem}
                onChange={(e) => setSubProblem(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 font-medium flex items-center gap-1">
                <Github className="h-3.5 w-3.5" />
                Public GitHub Repository Link
              </label>
              <input
                type="url"
                required
                placeholder="https://github.com/my-org/my-project"
                value={subGithub}
                onChange={(e) => setSubGithub(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white font-mono focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 font-medium flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  Live Deployment URL
                </label>
                <input
                  type="url"
                  placeholder="https://my-demo.vercel.app"
                  value={subDemo}
                  onChange={(e) => setSubDemo(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-medium flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  Slide Deck URL (PDF)
                </label>
                <input
                  type="url"
                  placeholder="https://slides.com/my-deck"
                  value={subDeck}
                  onChange={(e) => setSubDeck(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 transition"
            >
              Freeze & Submit Code for Jury Review
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
