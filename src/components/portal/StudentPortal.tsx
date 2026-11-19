"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Event, TeamMember } from "@/types";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  CheckCircle2,
  QrCode,
  ArrowRight,
  ArrowLeft,
  GitBranch,
  Github,
  Globe,
  FileText,
  Sparkles,
  Smartphone,
  CreditCard,
  ShieldCheck,
  Code2,
  Search,
  Filter,
  Copy,
  Check,
  Medal,
  ChevronRight,
  AlertCircle,
  Plus,
  Trash2,
  Layers,
} from "lucide-react";
import { Phone, Notification, Badge } from "@/kit";

export const StudentPortal: React.FC = () => {
  const { events, registerTeam, submitMilestone } = useStore();

  // State: selectedEventId is null when student is browsing the Events Catalog
  // When an event is clicked, selectedEventId is set to that event's id
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Search & category filter on the selection catalog
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Tab inside selected event: "register" | "submit"
  const [activeTab, setActiveTab] = useState<"register" | "submit">("register");

  // Form registration state
  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [collegeName, setCollegeName] = useState("National Institute of Technology, Trichy");
  const [teammates, setTeammates] = useState<{ id: string; name: string; email: string }[]>([
    { id: "m2", name: "", email: "" },
  ]);
  const [utrNumber, setUtrNumber] = useState("");
  const [issuedTicket, setIssuedTicket] = useState<{ id: string; ticketId: string; teamName: string } | null>(null);
  const [showMobileDeviceMockup, setShowMobileDeviceMockup] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Milestone submission state
  const [subTeamName, setSubTeamName] = useState("");
  const [subGithub, setSubGithub] = useState("");
  const [subDemo, setSubDemo] = useState("");
  const [subDeck, setSubDeck] = useState("");
  const [subProblem, setSubProblem] = useState("");
  const [isSubSubmitted, setIsSubSubmitted] = useState(false);

  // URL Query Sync on mount (e.g. ?event=hack-ai-2026)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const eventParam = p.get("event");
      if (eventParam && events.some((e) => e.id === eventParam)) {
        setSelectedEventId(eventParam);
      }
    }
  }, [events]);

  const currentEvent = selectedEventId
    ? events.find((e) => e.id === selectedEventId) || null
    : null;

  // Format date helper
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setIssuedTicket(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToCatalog = () => {
    setSelectedEventId(null);
    setIssuedTicket(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopyUpi = (upiId?: string) => {
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleAddTeammate = () => {
    if (!currentEvent) return;
    if (teammates.length < currentEvent.teamSizeMax - 1) {
      setTeammates([
        ...teammates,
        { id: `m-${Date.now()}`, name: "", email: "" },
      ]);
    }
  };

  const handleRemoveTeammate = (index: number) => {
    setTeammates(teammates.filter((_, i) => i !== index));
  };

  const handleUpdateTeammate = (index: number, field: "name" | "email", val: string) => {
    const updated = [...teammates];
    updated[index][field] = val;
    setTeammates(updated);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent || !teamName.trim() || !leaderEmail.trim()) return;

    const members: TeamMember[] = [
      {
        id: "m1",
        name: leaderName.trim() || "Lead",
        email: leaderEmail.trim(),
        college: collegeName.trim(),
        role: "lead",
      },
    ];

    teammates.forEach((tm, idx) => {
      if (tm.name.trim()) {
        members.push({
          id: tm.id || `m${idx + 2}`,
          name: tm.name.trim(),
          email: tm.email.trim() || `member${idx + 2}@college.edu`,
          college: collegeName.trim(),
          role: "member",
        });
      }
    });

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
    if (!currentEvent || !subTeamName.trim() || !subGithub.trim()) return;

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

  /* Apple Wallet Pass Content */
  const renderWalletPassContent = (isMockupInside: boolean) => (
    <div
      className={`space-y-4 ${
        isMockupInside
          ? "p-4 text-white"
          : "p-6 rounded-3xl border border-blue-100 bg-white text-slate-900 shadow-sm"
      }`}
    >
      <div
        className={`flex items-center justify-between border-b pb-3 ${
          isMockupInside ? "border-white/[0.08]" : "border-slate-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center font-fortnite text-sm text-white">
            F
          </div>
          <span
            className={`text-[11px] font-fortnite tracking-wide uppercase ${
              isMockupInside ? "text-zinc-300" : "text-blue-950"
            }`}
          >
            FESTRA WALLET
          </span>
        </div>
        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-fortnite tracking-wide text-emerald-700 uppercase">
          {issuedTicket ? "VERIFIED ADMIT" : "LIVE PREVIEW"}
        </span>
      </div>

      <div
        className={`rounded-2xl border p-5 space-y-4 shadow-md relative overflow-hidden ${
          isMockupInside
            ? "border-white/[0.1] bg-slate-900"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600" />

        <div className="space-y-1 pt-1">
          <div className="text-[10px] font-fortnite uppercase tracking-wider text-blue-600">
            {currentEvent?.category.replace("_", " ")}
          </div>
          <div
            className={`text-base font-fortnite uppercase tracking-wide leading-tight ${
              isMockupInside ? "text-white" : "text-blue-950"
            }`}
          >
            {currentEvent?.title}
          </div>
          <div
            className={`text-[11px] ${
              isMockupInside ? "text-zinc-400" : "text-slate-500"
            }`}
          >
            {currentEvent?.venue}
          </div>
        </div>

        <div
          className={`border-t border-dashed pt-3 grid grid-cols-2 gap-2 text-xs ${
            isMockupInside ? "border-white/[0.12]" : "border-slate-200"
          }`}
        >
          <div>
            <div className="text-[9px] uppercase font-bold text-slate-400">Squad Name</div>
            <div
              className={`font-fortnite uppercase tracking-wide truncate text-sm ${
                isMockupInside ? "text-white" : "text-blue-950"
              }`}
            >
              {issuedTicket?.teamName || teamName.trim() || "Nexus Protocol"}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase font-bold text-slate-400">Lead Participant</div>
            <div
              className={`font-medium truncate ${
                isMockupInside ? "text-zinc-200" : "text-slate-700"
              }`}
            >
              {leaderName.trim() || "Aditya Krishnan"}
            </div>
          </div>
          <div className="col-span-2 pt-1">
            <div className="text-[9px] uppercase font-bold text-slate-400">Institution</div>
            <div
              className={`text-[11px] truncate ${
                isMockupInside ? "text-zinc-300" : "text-slate-600"
              }`}
            >
              {collegeName.trim() || "NIT Trichy"}
            </div>
          </div>
        </div>

        <div
          className={`border-t pt-3 flex items-center justify-between gap-3 ${
            isMockupInside ? "border-white/[0.08]" : "border-slate-200"
          }`}
        >
          <div className="rounded-xl bg-white p-2 shadow-sm flex-shrink-0 border border-slate-200">
            <QrCode className="h-14 w-14 text-slate-900" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="text-[9px] uppercase font-bold text-slate-400">Admit Token</div>
            <div className="font-fortnite text-base text-blue-600 tracking-wider">
              {issuedTicket?.ticketId || "TK-PREVIEW-8842"}
            </div>
            <div
              className={`text-[10px] leading-tight ${
                isMockupInside ? "text-zinc-400" : "text-slate-500"
              }`}
            >
              Present at Security Kiosk for physical badge print & booth assignment.
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>Cryptographically signed by Festra Engine</span>
      </div>
    </div>
  );

  const renderMilestonePhoneContent = () => (
    <div className="p-4 space-y-4 text-white">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
            <GitBranch className="h-3.5 w-3.5" />
          </div>
          <span className="text-[11px] font-fortnite tracking-wide uppercase text-zinc-300">
            Phase 3 Terminal
          </span>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-fortnite tracking-wide uppercase ${
            isSubSubmitted
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
          }`}
        >
          {isSubSubmitted ? "CODE FROZEN" : "AUDIT ACTIVE"}
        </span>
      </div>

      <div className="rounded-2xl border border-white/[0.1] bg-slate-900 p-5 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500" />

        <div className="space-y-1 pt-1">
          <div className="text-[10px] font-fortnite uppercase tracking-wider text-blue-400">
            Milestone Checkpoint
          </div>
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

  // Filter events for the Catalog View
  const categories = ["all", ...Array.from(new Set(events.map((e) => e.category)))];

  const filteredEvents = events.filter((ev) => {
    const matchesCategory = selectedCategory === "all" || ev.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      ev.title.toLowerCase().includes(q) ||
      ev.tagline.toLowerCase().includes(q) ||
      ev.venue.toLowerCase().includes(q) ||
      ev.category.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  // Calculate fest-wide summary numbers
  const totalPrizePools = events.map((e) => e.prizes.pool);

  // =========================================================================
  // STEP 1: CHOOSE WHICH EVENT TO PARTICIPATE (EVENTS CATALOG / SELECTION PAGE)
  // =========================================================================
  if (!currentEvent) {
    return (
      <div className="max-w-6xl mx-auto py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Selection Hero Banner */}
        <div className="rounded-3xl border border-blue-100 bg-white p-6 sm:p-10 space-y-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 h-56 w-56 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-fortnite uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>FESTRA 2026 • OFFICIAL CAMPUS FESTIVAL</span>
              </div>
              <h1 className="font-fortnite text-3xl sm:text-4xl lg:text-5xl text-blue-950 uppercase tracking-wide leading-tight">
                CHOOSE AN EVENT TO PARTICIPATE
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Scan detected. Select any active event track below to review full guidelines, schedule, venue, and prize pool, then complete your squad registration.
              </p>
            </div>

            {/* Fest Quick Stats Card */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-center sm:min-w-[200px] flex-shrink-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Available Tracks</div>
              <div className="font-fortnite text-3xl sm:text-4xl text-blue-600 mt-0.5">
                {events.length} ACTIVE
              </div>
              <div className="text-[11px] font-semibold text-emerald-700 mt-1">
                Instant QR Admit Cards
              </div>
            </div>
          </div>

          {/* Quick Search & Category Filters */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events by title, keyword, or venue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none transition shadow-sm"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-xl px-3 py-1.5 font-fortnite text-xs tracking-wide uppercase whitespace-nowrap transition min-h-[36px] ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:text-blue-900 hover:bg-blue-50"
                    }`}
                  >
                    {cat.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Events Cards Grid */}
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => handleSelectEvent(ev.id)}
              className="group relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-6 transition cursor-pointer flex flex-col justify-between hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10"
            >
              {/* Top Accent Ribbon */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600/70 group-hover:bg-blue-600 transition" />

              <div className="space-y-4 pt-1">
                {/* Badges: Category & Ticket Price */}
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full px-3 py-1 text-[10px] font-fortnite uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                    {ev.category.replace("_", " ")}
                  </span>
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {ev.isPaid ? `₹${ev.ticketPrice} / Squad` : "FREE ENTRY"}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="font-fortnite text-2xl text-blue-950 uppercase tracking-wide group-hover:text-blue-600 transition leading-snug">
                    {ev.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs text-slate-600 leading-relaxed">
                    {ev.tagline}
                  </p>
                </div>

                {/* Logistics Info Row */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{ev.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                    <span>{formatDate(ev.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Users className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                    <span>{ev.teamSizeMin}–{ev.teamSizeMax} Members</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Trophy className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                    <span>Pool: <strong className="text-blue-950">{ev.prizes.pool}</strong></span>
                  </div>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {ev.maxTeams - ev.currentTeamsCount} slots open
                </span>

                <div className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 font-fortnite text-xs uppercase tracking-wider text-white group-hover:bg-blue-700 transition shadow-sm shadow-blue-500/20">
                  <span>VIEW DETAILS & REGISTER</span>
                  <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="rounded-3xl border border-blue-100 bg-white p-12 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-slate-400 mx-auto" />
            <h3 className="font-fortnite text-xl text-blue-950 uppercase">No Matching Events Found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search query or category filter.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-2 inline-flex items-center gap-1 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // STEP 2 & 3: EVENT DETAILS VIEW + REGISTRATION FORM
  // =========================================================================
  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Top Navigation: Back to Selection Catalog */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackToCatalog}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 transition shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Events</span>
          </button>
          <span className="text-xs text-slate-400">/</span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {currentEvent.category.replace("_", " ")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#registration-section"
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 font-fortnite text-xs uppercase tracking-wider text-white hover:bg-blue-700 transition shadow-sm"
          >
            <span>REGISTER SQUAD ↓</span>
          </a>
        </div>
      </div>

      {/* EVENT DETAILS SECTION */}
      <div className="space-y-6">
        {/* Main Hero Header */}
        <div className="rounded-3xl border border-blue-100 bg-white p-6 sm:p-8 space-y-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 pt-1">
            <div className="space-y-2">
              <span className="inline-block rounded-full px-3 py-0.5 text-[10px] font-fortnite uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                {currentEvent.category.replace("_", " ")}
              </span>
              <h1 className="font-fortnite text-3xl sm:text-4xl text-blue-950 uppercase tracking-wide">
                {currentEvent.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                {currentEvent.tagline}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-center sm:min-w-[190px] flex-shrink-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Prize Pool</div>
              <div className="font-fortnite text-3xl text-blue-600 mt-0.5">{currentEvent.prizes.pool}</div>
              <div className="text-xs font-fortnite tracking-wide text-emerald-700 font-bold mt-1">
                {currentEvent.isPaid ? `₹${currentEvent.ticketPrice} / SQUAD` : "FREE ENTRY"}
              </div>
            </div>
          </div>

          {/* Logistics Quick Pill Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-slate-800 font-medium">{currentEvent.venue}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-blue-500" />
              <span>{currentEvent.teamSizeMin}–{currentEvent.teamSizeMax} Members / Squad</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-emerald-700 font-semibold">Registration Live</span>
            </div>
          </div>
        </div>

        {/* 2-Column Details Grid: Description & Schedule + Prizes & Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Full Description & Schedule Timeline */}
          <div className="lg:col-span-7 space-y-6">
            {/* About / Description Card */}
            <div className="rounded-3xl border border-blue-100 bg-white p-6 space-y-3 shadow-sm">
              <h3 className="font-fortnite text-lg text-blue-950 uppercase tracking-wide flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>ABOUT THIS TRACK</span>
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {currentEvent.description}
              </p>
            </div>

            {/* Schedule & Timing Card */}
            <div className="rounded-3xl border border-blue-100 bg-white p-6 space-y-4 shadow-sm">
              <h3 className="font-fortnite text-lg text-blue-950 uppercase tracking-wide flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>SCHEDULE & TIMING</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Event Starts</div>
                  <div className="font-bold text-slate-900">{formatDate(currentEvent.startDate)}</div>
                  <div className="text-[11px] text-slate-500">{formatTime(currentEvent.startDate)}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Event Concludes</div>
                  <div className="font-bold text-slate-900">{formatDate(currentEvent.endDate)}</div>
                  <div className="text-[11px] text-slate-500">{formatTime(currentEvent.endDate)}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-rose-500">Registration Deadline</div>
                  <div className="font-bold text-rose-950">{formatDate(currentEvent.registrationDeadline)}</div>
                  <div className="text-[11px] text-rose-700">{formatTime(currentEvent.registrationDeadline)}</div>
                </div>
              </div>
            </div>

            {/* Participation Rules & Guidelines Card */}
            <div className="rounded-3xl border border-blue-100 bg-white p-6 space-y-4 shadow-sm">
              <h3 className="font-fortnite text-lg text-blue-950 uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span>OFFICIAL RULES & GUIDELINES</span>
              </h3>

              <div className="space-y-2.5">
                {currentEvent.rules && currentEvent.rules.length > 0 ? (
                  currentEvent.rules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs text-slate-700"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rule}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Standard campus hackathon regulations apply.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Prizes Breakdown & Payment Information */}
          <div className="lg:col-span-5 space-y-6">
            {/* Prizes Breakdown Card */}
            <div className="rounded-3xl border border-blue-100 bg-white p-6 space-y-4 shadow-sm">
              <h3 className="font-fortnite text-lg text-blue-950 uppercase tracking-wide flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span>PRIZES & RECOGNITION</span>
              </h3>

              <div className="space-y-3 text-xs">
                {/* 1st Prize */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white font-fortnite text-sm shadow-sm">
                      1st
                    </div>
                    <div>
                      <div className="font-fortnite uppercase tracking-wide text-amber-950 text-sm">
                        CHAMPIONS
                      </div>
                      <div className="text-[11px] text-amber-800">Trophy + Winner Certificate</div>
                    </div>
                  </div>
                  <div className="font-fortnite text-xl text-amber-700">
                    {currentEvent.prizes.first}
                  </div>
                </div>

                {/* 2nd Prize */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 border border-slate-300">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-400 text-white font-fortnite text-sm shadow-sm">
                      2nd
                    </div>
                    <div>
                      <div className="font-fortnite uppercase tracking-wide text-slate-900 text-sm">
                        RUNNERS-UP
                      </div>
                      <div className="text-[11px] text-slate-600">Medal + Merit Certificate</div>
                    </div>
                  </div>
                  <div className="font-fortnite text-xl text-slate-800">
                    {currentEvent.prizes.second}
                  </div>
                </div>

                {/* 3rd Prize */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-50 border border-orange-200">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-400 text-white font-fortnite text-sm shadow-sm">
                      3rd
                    </div>
                    <div>
                      <div className="font-fortnite uppercase tracking-wide text-orange-950 text-sm">
                        THIRD PLACE
                      </div>
                      <div className="text-[11px] text-orange-800">Merit Certificate</div>
                    </div>
                  </div>
                  <div className="font-fortnite text-xl text-orange-700">
                    {currentEvent.prizes.third}
                  </div>
                </div>

                {/* Participation Certificates for all */}
                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span>
                    Official verified digital certificates provided to all participants upon completion.
                  </span>
                </div>
              </div>
            </div>

            {/* Payment & Fee Card (if Paid Event) */}
            {currentEvent.isPaid && (
              <div className="rounded-3xl border border-blue-100 bg-white p-6 space-y-4 shadow-sm">
                <h3 className="font-fortnite text-lg text-blue-950 uppercase tracking-wide flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  <span>REGISTRATION FEE & UPI PAYMENT</span>
                </h3>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Entry Fee:</span>
                    <span className="font-fortnite text-xl text-blue-950">
                      ₹{currentEvent.ticketPrice} / Squad
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-3 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Pay via Official UPI ID:</div>
                    <div className="flex items-center justify-between gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs">
                      <span className="text-blue-600 font-bold">{currentEvent.upiId || "fest@okicici"}</span>
                      <button
                        onClick={() => handleCopyUpi(currentEvent.upiId || "fest@okicici")}
                        className="text-[11px] font-bold text-slate-600 hover:text-blue-600 transition flex items-center gap-1"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Pay using Google Pay, PhonePe, or Paytm. Copy your 12-digit Bank UTR/Transaction number to enter in the registration form below.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REGISTRATION FORM SECTION */}
      <div id="registration-section" className="space-y-4 pt-4 border-t border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-fortnite text-2xl sm:text-3xl text-blue-950 uppercase tracking-wide">
              SQUAD REGISTRATION FORM
            </h2>
            <p className="text-xs text-slate-500">
              Registering for <strong className="text-blue-900">{currentEvent.title}</strong>. Fill in details to receive your digital admit ticket.
            </p>
          </div>

          {/* Portal Tabs: Register vs Milestone Submit */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("register")}
              className={`px-3 py-1.5 font-fortnite tracking-wide uppercase rounded-lg transition ${
                activeTab === "register"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              1. Register Squad
            </button>
            <button
              onClick={() => setActiveTab("submit")}
              className={`px-3 py-1.5 font-fortnite tracking-wide uppercase rounded-lg transition ${
                activeTab === "submit"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              2. Code Freeze & Pitch
            </button>
          </div>
        </div>

        {/* Form and Stageshow iPhone Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Form */}
          <div className={`space-y-6 ${showMobileDeviceMockup ? "hidden lg:block lg:col-span-7" : "lg:col-span-7"}`}>
            {activeTab === "register" && (
              <>
                {issuedTicket ? (
                  /* Confirmed Card (Mobile friendly) */
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-3">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                      <div>
                        <h3 className="font-fortnite text-2xl text-emerald-950 uppercase tracking-wide">
                          Squad Confirmed!
                        </h3>
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
                        <button
                          onClick={handleBackToCatalog}
                          className="rounded-xl bg-blue-600 px-4 py-2 font-fortnite text-xs text-white hover:bg-blue-700 tracking-wide uppercase transition shadow-sm"
                        >
                          Browse Other Events
                        </button>
                      </div>
                    </div>

                    <div className="lg:hidden">
                      {renderWalletPassContent(false)}
                    </div>
                  </div>
                ) : (
                  /* Registration Input Form */
                  <form
                    onSubmit={handleRegister}
                    className="rounded-3xl border border-blue-100 bg-white p-5 sm:p-7 space-y-4 text-xs shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-fortnite text-lg text-blue-950 uppercase tracking-wide">
                        Squad Information
                      </h3>
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

                    {/* Teammates Section */}
                    {currentEvent.teamSizeMax > 1 && (
                      <div className="space-y-2 border-t border-slate-100 pt-3">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-700 font-medium">
                            Teammates ({teammates.filter((t) => t.name.trim()).length + 1} / {currentEvent.teamSizeMax} Members)
                          </label>
                          {teammates.length < currentEvent.teamSizeMax - 1 && (
                            <button
                              type="button"
                              onClick={handleAddTeammate}
                              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Teammate</span>
                            </button>
                          )}
                        </div>

                        {teammates.map((tm, idx) => (
                          <div key={tm.id} className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder={`Teammate ${idx + 2} Name`}
                              value={tm.name}
                              onChange={(e) => handleUpdateTeammate(idx, "name", e.target.value)}
                              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                            />
                            {teammates.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveTeammate(idx)}
                                className="p-2 text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Paid Event UTR Input */}
                    {currentEvent.isPaid && (
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
                  className="rounded-3xl border border-blue-100 bg-white p-5 sm:p-7 space-y-4 text-xs shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-fortnite text-lg text-blue-950 uppercase tracking-wide">
                      Phase 3 Submission & Code Freeze
                    </h3>
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

          {/* Right Column: Stageshow Authentic iPhone 18 Pro Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
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
              {issuedTicket && activeTab === "register" && (
                <Notification
                  banner
                  icon={<CheckCircle2 className="h-5 w-5 text-white" />}
                  title="Festra Wallet"
                  body={`Admit Pass active for ${issuedTicket.teamName}`}
                  time="now"
                />
              )}

              {activeTab === "register" ? renderWalletPassContent(true) : renderMilestonePhoneContent()}
            </Phone>
          </div>
        </div>
      </div>
    </div>
  );
};
