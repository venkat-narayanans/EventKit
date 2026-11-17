"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import {
  ShieldCheck,
  QrCode,
  GitBranch,
  Award,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Building,
  Layers,
  Sparkles,
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const { setViewMode, events, selectedEventId } = useStore();
  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // Auth Section State
  const [authTab, setAuthTab] = useState<"organizer" | "student">("organizer");

  // Organizer Form State
  const [orgCollege, setOrgCollege] = useState("National Institute of Technology, Trichy");
  const [orgEmail, setOrgEmail] = useState("coordinator@nitt.edu");
  const [orgPassword, setOrgPassword] = useState("••••••••");

  // Student Form State
  const [studentSquad, setStudentSquad] = useState("Nexus Protocol");
  const [studentEmail, setStudentEmail] = useState("aditya@nitt.edu");
  const [ticketSearchCode, setTicketSearchCode] = useState("");

  const handleOrganizerSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setViewMode("dashboard");
  };

  const handleStudentGo = (e: React.FormEvent) => {
    e.preventDefault();
    setViewMode("portal");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* MINIMAL TOP NAVIGATION */}
      <header className="sticky top-0 z-40 w-full border-b border-blue-100 bg-white/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo in the user's authentic Fortnite font */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-fortnite text-2xl shadow-sm shadow-blue-500/20">
              F
            </div>
            <span className="font-fortnite text-2xl tracking-wide text-blue-950 uppercase">
              FESTRA<span className="text-blue-600">.</span>
            </span>
          </div>

          {/* Minimal Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition">
              Platform Features
            </a>
            <a href="#accreditation" className="hover:text-blue-600 transition">
              NAAC Compliance
            </a>
            <a href="#auth" className="hover:text-blue-600 transition">
              Sign In
            </a>
          </nav>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setAuthTab("organizer");
                const el = document.getElementById("auth");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else setViewMode("dashboard");
              }}
              className="px-3.5 py-1.5 rounded-xl border border-blue-200 text-xs font-bold text-blue-700 hover:bg-blue-50 transition"
            >
              Organizer Sign In
            </button>
            <button
              onClick={() => setViewMode("portal")}
              className="px-4 py-1.5 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 transition shadow-sm shadow-blue-600/25"
            >
              Student Portal
            </button>
          </div>
        </div>
      </header>

      {/* CLEAN MINIMAL HERO SECTION */}
      <section className="relative px-4 pt-12 sm:pt-20 pb-12 sm:pb-16 max-w-5xl mx-auto text-center space-y-6">
        {/* Subtle background ambient blue radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-50 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Institution Category Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1 text-xs font-semibold text-blue-700">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
          <span>All-In-One Operations for Engineering Colleges & Technical Clubs</span>
        </div>

        {/* Headline in authentic Fortnite Font */}
        <h1 className="font-fortnite text-4xl sm:text-6xl md:text-7xl tracking-tight text-blue-950 uppercase leading-none max-w-4xl mx-auto">
          CAMPUS EVENT OPERATIONS, <span className="text-blue-600">UNIFIED.</span>
        </h1>

        {/* Concise Value Proposition */}
        <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Create, coordinate, evaluate, and conclude hackathons, symposiums, and paper presentations.
          Replace the fragmented Google Franken-stack with automated QR admit passes, Git milestone verification, fair $Z$-score rubrics, and 1-click NAAC/NIRF accreditation reports.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#auth"
            onClick={() => setAuthTab("organizer")}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition shadow-md shadow-blue-600/25 flex items-center gap-2"
          >
            <span>Organizer Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </a>

          <button
            onClick={() => setViewMode("portal")}
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition"
          >
            Student Squad Registration
          </button>
        </div>

        {/* Quick Product Stats Strip */}
        <div className="pt-8 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center max-w-3xl mx-auto">
          <div>
            <div className="text-2xl font-black text-blue-600">100%</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Unified Tool</div>
          </div>
          <div>
            <div className="text-2xl font-black text-blue-600">0.0%</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Jury Bias ($Z$-Score)</div>
          </div>
          <div>
            <div className="text-2xl font-black text-blue-600">&lt; 1 Sec</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">QR Gate Scan</div>
          </div>
          <div>
            <div className="text-2xl font-black text-blue-600">1-Click</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">NAAC IQAC Dossier</div>
          </div>
        </div>
      </section>

      {/* 4 CORE PRODUCT PILLARS (Clean Minimal Blue & White Cards) */}
      <section id="features" className="px-4 py-12 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Engineered For Higher Education
          </span>
          <h2 className="font-fortnite text-3xl sm:text-4xl text-blue-950 uppercase tracking-wide">
            FOUR CORE CAPABILITIES IN ONE WORKSPACE
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-3 shadow-sm hover:shadow-md hover:border-blue-300 transition">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <QrCode className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Registrations & Digital Wallet Passes
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant squad ticketing with Apple Wallet-grade passes, encrypted QR codes, and bank UTR verification. Zero entrance gate bottlenecks.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-3 shadow-sm hover:shadow-md hover:border-blue-300 transition">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <GitBranch className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Git Commit Radar & Milestone Auditing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enforce 3-stage hackathon progress (Abstract, Prototype, Final Freeze). Analyzes commit cadence to eliminate pre-built zip code dumping.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-3 shadow-sm hover:shadow-md hover:border-blue-300 transition">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Custom Rubrics & $Z$-Score Normalization
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Design event-specific evaluation criteria. Automated Gaussian $Z$-score normalization neutralizes harsh vs lenient judge grading curves.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-3 shadow-sm hover:shadow-md hover:border-blue-300 transition">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              BYOD Certificates & NAAC Compliance
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload custom Canva/Figma art with auto-scaling recipient names and LinkedIn proofs. Export IQAC dossiers mapping NAAC Criteria 3.3.2 & 5.3.3.
            </p>
          </div>
        </div>
      </section>

      {/* LOGIN & REGISTRATION WORKSPACE PORTAL (Minimal Blue & White Card) */}
      <section id="auth" className="px-4 py-16 max-w-xl mx-auto">
        <div className="rounded-3xl border border-blue-200 bg-white p-6 sm:p-8 shadow-xl shadow-blue-500/5 space-y-6">
          {/* Section Header */}
          <div className="text-center space-y-1">
            <h2 className="font-fortnite text-2xl sm:text-3xl text-blue-950 uppercase tracking-wide">
              ENTER FESTRA WORKSPACE
            </h2>
            <p className="text-xs text-slate-500">
              Select your role below to manage your event or access your squad pass.
            </p>
          </div>

          {/* Clean Segmented Tab Switcher */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
            <button
              onClick={() => setAuthTab("organizer")}
              className={`flex-1 py-2 rounded-lg transition ${
                authTab === "organizer"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "hover:text-slate-900"
              }`}
            >
              College Event Organizer
            </button>
            <button
              onClick={() => setAuthTab("student")}
              className={`flex-1 py-2 rounded-lg transition ${
                authTab === "student"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "hover:text-slate-900"
              }`}
            >
              Participant / Student
            </button>
          </div>

          {/* TAB 1: ORGANIZER SIGN IN */}
          {authTab === "organizer" && (
            <form onSubmit={handleOrganizerSignIn} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-blue-600" />
                  <span>College / Department / Club</span>
                </label>
                <input
                  type="text"
                  required
                  value={orgCollege}
                  onChange={(e) => setOrgCollege(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-blue-600" />
                  <span>Official Institutional Email</span>
                </label>
                <input
                  type="email"
                  required
                  value={orgEmail}
                  onChange={(e) => setOrgEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-blue-600" />
                  <span>Access Password / Coordinator PIN</span>
                </label>
                <input
                  type="password"
                  required
                  value={orgPassword}
                  onChange={(e) => setOrgPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition shadow-md shadow-blue-600/25 mt-2"
              >
                Sign In & Launch Organizer Workspace
              </button>

              <div className="text-center text-[11px] text-slate-500 pt-1">
                Demo mode: Click to immediately open the full organizer dashboard.
              </div>
            </form>
          )}

          {/* TAB 2: STUDENT SQUAD PORTAL */}
          {authTab === "student" && (
            <form onSubmit={handleStudentGo} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Event Track</label>
                <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 font-medium">
                  {currentEvent.title}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-blue-600" />
                  <span>Squad / Team Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={studentSquad}
                  onChange={(e) => setStudentSquad(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-blue-600" />
                  <span>Team Leader Email</span>
                </label>
                <input
                  type="email"
                  required
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition shadow-md shadow-blue-600/25 mt-2"
              >
                Access Squad Registration & Admit Pass
              </button>

              {/* Ticket Search Shortcut */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="text-[11px] font-semibold text-slate-500">
                  Already have an issued ticket ID?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. CF-TKT-5266"
                    value={ticketSearchCode}
                    onChange={(e) => setTicketSearchCode(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setViewMode("portal")}
                    className="px-3.5 py-2 rounded-xl border border-blue-200 text-blue-600 text-xs font-bold hover:bg-blue-50 transition"
                  >
                    Lookup Pass
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* MINIMAL FOOTER */}
      <footer className="border-t border-slate-100 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-fortnite text-lg text-blue-950">FESTRA</span>
            <span>— Campus Event Operations & Accreditation Platform</span>
          </div>
          <div>All-in-one software for College Technical Fests, Hackathons & Symposiums</div>
        </div>
      </footer>
    </div>
  );
};
