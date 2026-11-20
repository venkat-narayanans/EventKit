"use client";

import React, { useState, useEffect } from "react";
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
  Menu,
  X,
  ChevronDown,
  HelpCircle,
  FileCheck2,
  Clock,
  ExternalLink,
  ChevronRight,
  Code2,
} from "lucide-react";
import {
  HeroCommandRadarSvg,
  Card1QrPassSvg,
  Card2GitRadarSvg,
  Card3ZScoreSvg,
  Card4CertificateSvg,
  EventPipelineSvg,
  AmbientFloatingDecor,
} from "./LandingSvgAnimations";
import { LandingInteractiveShowcase } from "./LandingInteractiveShowcase";
import { LandingCalculator } from "./LandingCalculator";

export const LandingPage: React.FC = () => {
  const { setViewMode, events, selectedEventId } = useStore();
  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // How It Works Perspective Tab: "organizer" | "student"
  const [howItWorksRole, setHowItWorksRole] = useState<"organizer" | "student">(
    "organizer"
  );

  // FAQ Accordion Open State (index of open item or null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Auth Section State
  const [authTab, setAuthTab] = useState<"organizer" | "student">("organizer");

  // Organizer Form State
  const [orgCollege, setOrgCollege] = useState(
    "National Institute of Technology, Trichy"
  );
  const [orgEmail, setOrgEmail] = useState("coordinator@nitt.edu");
  const [orgPassword, setOrgPassword] = useState("••••••••");

  // Student Form State
  const [studentSquad, setStudentSquad] = useState("Nexus Protocol");
  const [studentEmail, setStudentEmail] = useState("aditya@nitt.edu");
  const [ticketSearchCode, setTicketSearchCode] = useState("");

  // Keyboard shortcut listener ('o' -> Organizer, 's' -> Student Portal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "o" || e.key === "O") {
        setViewMode("dashboard");
      } else if (e.key === "s" || e.key === "S") {
        setViewMode("portal");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setViewMode]);

  const handleOrganizerSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setViewMode("dashboard");
  };

  const handleStudentGo = (e: React.FormEvent) => {
    e.preventDefault();
    setViewMode("portal");
  };

  const faqItems = [
    {
      q: "Can we print physical flyers and standees for campus notice boards?",
      a: "Yes! Festra features a built-in A4 Notice Board Poster and Desk Standee generator. With one click, organizers generate high-resolution, print-ready posters displaying a scannable QR code, track schedule, venue, and cash prizes. Students scan with their phone camera to instantly view tracks and register.",
    },
    {
      q: "How does the Gaussian Z-score calculation eliminate judge bias?",
      a: "Different judges naturally have different grading thresholds—some are strict (averaging 5.5/10) while others are lenient (averaging 8.5/10). Festra uses the statistical Gaussian formula Z = (X - μ) / σ to calculate how far each team's score is from their specific judge's average. This neutralizes rating skew and ensures genuine technical merit wins.",
    },
    {
      q: "Can we upload our own custom certificate designs from Canva or Figma?",
      a: "Absolutely. The Certificate Studio allows you to upload any custom background image (PNG, SVG, or JPG) designed in Canva or Figma. You can freely position college logos, signature blocks, and dynamic placeholders like {{student_name}}, {{team_name}}, and {{place_label}}.",
    },
    {
      q: "How does the Git Commit Radar prevent pre-built code dumping?",
      a: "Festra enforces 3 progressive milestone checkpoints (Abstract Architecture, Working Deployed Prototype, and Code Freeze). During the hackathon window, Festra audits commit velocity and commit author timestamps to verify that software was built live rather than dumped from a pre-existing GitHub tutorial.",
    },
    {
      q: "Does this generate compliant reports for NAAC and NIRF accreditation?",
      a: "Yes. Festra compiles verified participant demographics, institutional diversity ratios, gender distribution, statistical judge distributions, and faculty signatures into structured IQAC audit reports directly mapped to NAAC Criteria 3.3.2 (Workshops/Seminars) and 5.3.3 (Sports/Cultural Events).",
    },
    {
      q: "Can Festra be used for free events as well as paid hackathons?",
      a: "Yes. Every event track can be configured as 100% Free Entry or Paid Entry with custom squad pricing. For paid events, Festra verifies student 12-digit Bank UTR / UPI reference IDs before issuing digital admit passes.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* 1. TOP APPLICATION NAVIGATION */}
      <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Campus Live Badge */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-fortnite text-2xl shadow-sm shadow-blue-500/20">
                F
              </div>
              <span className="font-fortnite text-2xl tracking-wide text-blue-950 uppercase">
                FESTRA<span className="text-blue-600">.</span>
              </span>
            </div>

            {/* Live Campus Beacon */}
            <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/70 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>2 Tracks Active</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-slate-600 uppercase tracking-wide">
            <a href="#comparison" className="hover:text-blue-600 transition">
              Comparison
            </a>
            <a href="#showcase" className="hover:text-blue-600 transition">
              Live Showcase
            </a>
            <a href="#how-it-works" className="hover:text-blue-600 transition">
              How It Works
            </a>
            <a href="#features" className="hover:text-blue-600 transition">
              Features
            </a>
            <a href="#calculator" className="hover:text-blue-600 transition">
              ROI Calculator
            </a>
            <a href="#faq" className="hover:text-blue-600 transition">
              FAQ
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => setViewMode("portal")}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:text-blue-600 hover:border-blue-300 transition"
            >
              Student Portal
            </button>
            <button
              onClick={() => setViewMode("dashboard")}
              className="px-4 py-1.5 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 transition shadow-sm shadow-blue-600/25 flex items-center gap-1.5"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setViewMode("dashboard")}
              className="px-3 py-1 rounded-xl bg-blue-600 text-[11px] font-bold text-white"
            >
              Workspace
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg">
            <nav className="flex flex-col gap-2.5 text-xs font-bold text-slate-700 uppercase">
              <a
                href="#comparison"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 hover:text-blue-600"
              >
                Comparison
              </a>
              <a
                href="#showcase"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 hover:text-blue-600"
              >
                Live Interactive Showcase
              </a>
              <a
                href="#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 hover:text-blue-600"
              >
                How It Works
              </a>
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 hover:text-blue-600"
              >
                Features
              </a>
              <a
                href="#calculator"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 hover:text-blue-600"
              >
                Sanity Calculator
              </a>
              <a
                href="#faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 hover:text-blue-600"
              >
                FAQ
              </a>
            </nav>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setViewMode("portal");
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 text-center"
              >
                Open Student Portal
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setViewMode("dashboard");
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-xs font-bold text-white text-center shadow-sm"
              >
                Launch Organizer Workspace
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative px-4 pt-10 sm:pt-16 pb-12 sm:pb-20 max-w-5xl mx-auto text-center space-y-6 overflow-hidden">
        {/* Ambient Fortnite-Inspired Floating Vector Tokens */}
        <AmbientFloatingDecor />

        {/* Ambient Blue Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-50/70 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Eyebrow Category Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-4 py-1 text-xs font-semibold text-blue-700 shadow-sm">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
          <span>FESTRA 2026 • THE CAMPUS EVENT & HACKATHON OPERATING SYSTEM</span>
        </div>

        {/* Headline in authentic Fortnite Typography */}
        <h1 className="font-fortnite text-4xl sm:text-6xl md:text-7xl tracking-tight text-blue-950 uppercase leading-none max-w-4xl mx-auto">
          THE OPERATING SYSTEM FOR COLLEGE HACKATHONS & <span className="text-blue-600">TECH FESTS.</span>
        </h1>

        {/* Concise Value Proposition */}
        <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Eliminate chaotic Google Forms, Excel judge arguments, Canva certificate copy-pasting, and last-minute NAAC panic.
          One unified platform for printable QR entrance posters, Git commit milestone verification, fair Gaussian $Z$-score rubrics, and automated IQAC accreditation dossiers.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <button
            onClick={() => setViewMode("dashboard")}
            className="rounded-xl bg-blue-600 px-6 sm:px-7 py-3 text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/25 flex items-center gap-2"
          >
            <span>Launch Organizer Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => setViewMode("portal")}
            className="rounded-xl border border-slate-300 bg-white px-6 sm:px-7 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition shadow-sm"
          >
            Explore Student Registration Portal
          </button>
        </div>

        {/* Keyboard hint */}
        <div className="text-[11px] text-slate-400 hidden sm:block">
          Quick Navigation: Press <kbd className="font-mono bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-bold">O</kbd> for Organizer Workspace • <kbd className="font-mono bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-bold">S</kbd> for Student Portal
        </div>

        {/* HERO INTERACTIVE SHOWCASE: LIVE CAMPUS EVENT COMMAND RADAR */}
        <div className="pt-4 sm:pt-6">
          <HeroCommandRadarSvg />
        </div>

        {/* Quick Verified Metrics Strip */}
        <div className="pt-8 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center max-w-3xl mx-auto">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 font-fortnite">
              100%
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Unified Platform
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 font-fortnite">
              0.0%
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Jury Bias ($Z$-Score)
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 font-fortnite">
              &lt; 1 Sec
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              QR Gate Scan
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 font-fortnite">
              1-Click
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              NAAC IQAC Dossier
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM VS SOLUTION: THE GOOGLE FRANKEN-STACK VS FESTRA */}
      <section id="comparison" className="px-4 py-16 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] font-fortnite uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            THE CAMPUS PARADIGM SHIFT
          </span>
          <h2 className="font-fortnite text-3xl sm:text-4xl text-blue-950 uppercase tracking-wide">
            THE GOOGLE FRANKEN-STACK VS FESTRA
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every semester, college coordinators suffer through the same fragmented tools. Here is how Festra transforms your fest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left: The Old Way (Franken-stack) */}
          <div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-200 pb-3">
              <div className="font-fortnite text-xl text-rose-950 uppercase tracking-wide">
                THE GOOGLE FRANKEN-STACK
              </div>
              <span className="rounded-full bg-rose-100 text-rose-700 font-bold px-2.5 py-0.5 text-[10px] uppercase">
                Fragmented & Manual
              </span>
            </div>

            <div className="space-y-3 text-xs text-rose-950/80">
              <div className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold text-sm">✕</span>
                <span>
                  <strong>5 Disjointed Google Forms</strong> with duplicate team names, unverified UPI payment screenshots, and messy spreadsheets.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold text-sm">✕</span>
                <span>
                  <strong>45-Minute Door Bottlenecks</strong> with students waiting in long lines while volunteers cross off names on paper clipboards.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold text-sm">✕</span>
                <span>
                  <strong>Plagiarized Zip Code Dumps</strong> submitted 10 minutes before code freeze with no proof of authoring during the sprint.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold text-sm">✕</span>
                <span>
                  <strong>Judge Grading Drama</strong> where a strict professor giving 6/10 unfairly penalizes the best team against an easy judge giving 10/10.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold text-sm">✕</span>
                <span>
                  <strong>3:00 AM Canva Hell</strong> manually re-typing 500 participant names one by one on certificate templates.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold text-sm">✕</span>
                <span>
                  <strong>Accreditation Panic</strong> months later when the IQAC cell demands attendance sheets and jury rubrics for NAAC Criterion 3.3.2.
                </span>
              </div>
            </div>
          </div>

          {/* Right: The Festra Way */}
          <div className="rounded-3xl border-2 border-blue-600 bg-white p-6 sm:p-8 space-y-4 shadow-xl shadow-blue-500/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600" />

            <div className="flex items-center justify-between border-b border-blue-100 pb-3">
              <div className="font-fortnite text-xl text-blue-950 uppercase tracking-wide">
                THE FESTRA ENGINE
              </div>
              <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2.5 py-0.5 text-[10px] uppercase">
                Unified SaaS
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <span className="text-blue-600 font-bold text-sm">✓</span>
                <span>
                  <strong>Printable A4 QR Standees</strong> for campus notice boards; students scan with their phone camera to claim encrypted admit passes.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-blue-600 font-bold text-sm">✓</span>
                <span>
                  <strong>Sub-Second Gate Kiosk Scan</strong> verifying Admit Tokens, payment UTRs, and assigning hackathon booth numbers instantly.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-blue-600 font-bold text-sm">✓</span>
                <span>
                  <strong>3-Milestone Git Radar</strong> analyzing commit cadence, commit freeze hashes, and anti-plagiarism thresholds automatically.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-blue-600 font-bold text-sm">✓</span>
                <span>
                  <strong>Gaussian $Z$-Score Fair Normalization</strong> statistically equalizing judge grading curves so true merit always wins.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-blue-600 font-bold text-sm">✓</span>
                <span>
                  <strong>1-Click 50+ Bulk Certificate Engine</strong> auto-generating participation batches and winner awards in under 2 seconds.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-blue-600 font-bold text-sm">✓</span>
                <span>
                  <strong>1-Click NAAC & NIRF IQAC Dossier</strong> auto-exporting formatted PDF compliance reports with demographic & jury analytics.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE LIVE PRODUCT SHOWCASE (TABBED PLAYGROUND) */}
      <section id="showcase" className="px-4 py-16 max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] font-fortnite uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            TEST DRIVE THE ENGINE
          </span>
          <h2 className="font-fortnite text-3xl sm:text-4xl text-blue-950 uppercase tracking-wide">
            EXPLORE THE CORE WORKSPACE LIVE
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Click through the interactive tabs below to experience the real workflows engineered into Festra.
          </p>
        </div>

        <LandingInteractiveShowcase
          onLaunchOrganizer={() => setViewMode("dashboard")}
          onOpenStudentPortal={() => setViewMode("portal")}
        />
      </section>

      {/* 5. END-TO-END EVENT AUTOMATION PIPELINE (VISUAL SVG TRACK) */}
      <section id="pipeline" className="px-4 py-12 max-w-6xl mx-auto space-y-4 overflow-hidden">
        <div className="text-center space-y-1.5">
          <span className="text-[11px] font-fortnite uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            CONTINUOUS WORKFLOW
          </span>
          <h2 className="font-fortnite text-2xl sm:text-3xl text-blue-950 uppercase tracking-wide">
            FROM QR GATE PASS TO VICTORY CEREMONY
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Real-time synchronization across gate check-ins, automated code freeze checks, and verified credentials.
          </p>
        </div>
        <EventPipelineSvg />
      </section>

      {/* 6. FOUR CORE CAPABILITIES (CARDS WITH ANIMATED MICRO-SVGS) */}
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
          <div className="group rounded-2xl border border-blue-100 bg-white p-5 space-y-3 shadow-sm hover:shadow-md hover:border-blue-300 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-24 w-full flex items-center justify-center p-1 rounded-xl bg-blue-50/50 border border-blue-100/60 overflow-hidden">
                <Card1QrPassSvg />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                Registrations & Digital Wallet Passes
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant squad ticketing with Apple Wallet-grade passes, encrypted QR codes, and bank UTR verification. Zero entrance gate bottlenecks.
              </p>
            </div>
            <div className="text-[11px] font-bold text-blue-600 pt-1">
              Fast Track Entrance →
            </div>
          </div>

          {/* Card 2 */}
          <div className="group rounded-2xl border border-blue-100 bg-white p-5 space-y-3 shadow-sm hover:shadow-md hover:border-blue-300 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-24 w-full flex items-center justify-center p-1 rounded-xl bg-blue-50/50 border border-blue-100/60 overflow-hidden">
                <Card2GitRadarSvg />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                Git Commit Radar & Milestone Auditing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enforce 3-stage hackathon progress (Abstract, Prototype, Final Freeze). Analyzes commit cadence to eliminate pre-built zip code dumping.
              </p>
            </div>
            <div className="text-[11px] font-bold text-blue-600 pt-1">
              Anti-Plagiarism Audit →
            </div>
          </div>

          {/* Card 3 */}
          <div className="group rounded-2xl border border-blue-100 bg-white p-5 space-y-3 shadow-sm hover:shadow-md hover:border-blue-300 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-24 w-full flex items-center justify-center p-1 rounded-xl bg-blue-50/50 border border-blue-100/60 overflow-hidden">
                <Card3ZScoreSvg />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                Custom Rubrics & $Z$-Score Normalization
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Design event-specific evaluation criteria. Automated Gaussian $Z$-score normalization neutralizes harsh vs lenient judge grading curves.
              </p>
            </div>
            <div className="text-[11px] font-bold text-blue-600 pt-1">
              Zero Judge Bias →
            </div>
          </div>

          {/* Card 4 */}
          <div className="group rounded-2xl border border-blue-100 bg-white p-5 space-y-3 shadow-sm hover:shadow-md hover:border-blue-300 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-24 w-full flex items-center justify-center p-1 rounded-xl bg-blue-50/50 border border-blue-100/60 overflow-hidden">
                <Card4CertificateSvg />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                BYOD Certificates & NAAC Compliance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload custom Canva/Figma art with auto-scaling recipient names and LinkedIn proofs. Export IQAC dossiers mapping NAAC Criteria 3.3.2 & 5.3.3.
              </p>
            </div>
            <div className="text-[11px] font-bold text-blue-600 pt-1">
              Accreditation Ready →
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS (DUAL PERSPECTIVE: ORGANIZERS VS STUDENTS) */}
      <section id="how-it-works" className="px-4 py-16 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] font-fortnite uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            SIMPLE, INTENTIONAL WORKFLOWS
          </span>
          <h2 className="font-fortnite text-3xl sm:text-4xl text-blue-950 uppercase tracking-wide">
            HOW FESTRA WORKS IN FOUR SIMPLE STEPS
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Select your role to see how simple campus event operations become.
          </p>

          {/* Role Toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold pt-2">
            <button
              onClick={() => setHowItWorksRole("organizer")}
              className={`px-4 py-2 rounded-lg transition ${
                howItWorksRole === "organizer"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              For College Organizers & Faculty
            </button>
            <button
              onClick={() => setHowItWorksRole("student")}
              className={`px-4 py-2 rounded-lg transition ${
                howItWorksRole === "student"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              For Student Participants
            </button>
          </div>
        </div>

        {/* 4-Step Cards */}
        {howItWorksRole === "organizer" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-3 shadow-sm relative">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-fortnite text-sm">
                1
              </span>
              <h3 className="font-fortnite text-lg text-blue-950 uppercase">
                Create Tracks & Print Standees
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Set up hackathons, paper symposiums, or coding contests in 60 seconds. Download print-ready A4 QR flyers for campus notice boards.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-3 shadow-sm relative">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-fortnite text-sm">
                2
              </span>
              <h3 className="font-fortnite text-lg text-blue-950 uppercase">
                Kiosk Check-In & Verification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scan students' Apple Wallet QR passes at the entrance kiosk in under 1 second. Verify payment UTRs and assign booth numbers automatically.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-3 shadow-sm relative">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-fortnite text-sm">
                3
              </span>
              <h3 className="font-fortnite text-lg text-blue-950 uppercase">
                Audit Git & Fair $Z$-Score
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enforce 3-stage milestone checkpoints. Review code velocity and let the Gaussian $Z$-score engine normalize judge rating curves.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-3 shadow-sm relative">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-fortnite text-sm">
                4
              </span>
              <h3 className="font-fortnite text-lg text-blue-950 uppercase">
                1-Click Certs & NAAC Dossier
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate 50+ participation certificates and automatic winner medals from the leaderboard, then export the ready-to-file NAAC audit PDF.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-3 shadow-sm relative">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-fortnite text-sm">
                1
              </span>
              <h3 className="font-fortnite text-lg text-blue-950 uppercase">
                Scan QR On Campus Notice Board
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Point any smartphone camera, Google Lens, or WhatsApp scanner at the event standee to open the mobile registration portal.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-3 shadow-sm relative">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-fortnite text-sm">
                2
              </span>
              <h3 className="font-fortnite text-lg text-blue-950 uppercase">
                Browse Tracks & Squad Register
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect rules, venues, deadlines, and prize pools. Enter your squad name and teammate details in under 2 minutes.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-3 shadow-sm relative">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-fortnite text-sm">
                3
              </span>
              <h3 className="font-fortnite text-lg text-blue-950 uppercase">
                Claim Apple Wallet Admit Pass
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive an encrypted admit card with your unique Admit Token. Flash your phone at the security kiosk for fast-track entry.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-3 shadow-sm relative">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-fortnite text-sm">
                4
              </span>
              <h3 className="font-fortnite text-lg text-blue-950 uppercase">
                Submit Code & Claim Certificates
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Push code milestones, pitch to juries, track live leaderboard rankings, and download verified digital certificates directly.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 8. TIME-SAVED & SANITY CALCULATOR */}
      <section id="calculator" className="px-4 py-16 max-w-6xl mx-auto">
        <LandingCalculator onLaunchOrganizer={() => setViewMode("dashboard")} />
      </section>

      {/* 9. FAST WORKSPACE SIGN-IN & DEMO LAUNCH HUB */}
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
                Demo mode active: Click to immediately open the full organizer dashboard.
              </div>
            </form>
          )}

          {/* TAB 2: STUDENT SQUAD PORTAL */}
          {authTab === "student" && (
            <form onSubmit={handleStudentGo} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Active Track</label>
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
                    placeholder="e.g. CF-TKT-6751"
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

      {/* 10. COMPREHENSIVE FAQ ACCORDION */}
      <section id="faq" className="px-4 py-16 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-fortnite uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            COMMON INQUIRIES
          </span>
          <h2 className="font-fortnite text-3xl sm:text-4xl text-blue-950 uppercase tracking-wide">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Everything faculty coordinators and technical councils need to know about deploying Festra.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 transition"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. HIGH-CONVERTING CLOSING HERO CTA */}
      <section className="px-4 py-16 max-w-5xl mx-auto">
        <div className="rounded-3xl border-2 border-blue-600 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 p-8 sm:p-12 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400" />

          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="inline-block rounded-full px-3 py-1 text-[10px] font-fortnite uppercase tracking-wider bg-white/10 text-blue-300 border border-white/20">
              CAMPUS FEST 2026 READY
            </span>
            <h2 className="font-fortnite text-3xl sm:text-5xl uppercase tracking-wide leading-tight">
              READY TO RUN YOUR CLEANEST CAMPUS HACKATHON EVER?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join engineering colleges, student technical councils, and IEEE student branches running seamless, anti-plagiarism audited, NAAC-accredited events.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setViewMode("dashboard")}
              className="rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-500/30 flex items-center gap-2"
            >
              <span>Launch Organizer Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("portal")}
              className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition"
            >
              Explore Student Registration
            </button>
          </div>
        </div>
      </section>

      {/* 12. ENTERPRISE FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Brand column */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-fortnite text-lg">
                  F
                </div>
                <span className="font-fortnite text-xl text-blue-950 uppercase tracking-wide">
                  FESTRA<span className="text-blue-600">.</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
                The unified operating system for college hackathons, technical symposiums, and paper presentations. Built for student councils and faculty coordinators.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>All systems operational • Festra Engine v2.4</span>
              </div>
            </div>

            {/* Links column 1 */}
            <div className="md:col-span-2 space-y-2.5">
              <div className="font-bold uppercase tracking-wider text-slate-900 text-[11px]">
                Product
              </div>
              <ul className="space-y-1.5 text-slate-600">
                <li>
                  <a href="#showcase" className="hover:text-blue-600 transition">
                    QR Passes
                  </a>
                </li>
                <li>
                  <a href="#showcase" className="hover:text-blue-600 transition">
                    Git Radar
                  </a>
                </li>
                <li>
                  <a href="#showcase" className="hover:text-blue-600 transition">
                    $Z$-Score Judging
                  </a>
                </li>
                <li>
                  <a href="#showcase" className="hover:text-blue-600 transition">
                    Certificate Studio
                  </a>
                </li>
              </ul>
            </div>

            {/* Links column 2 */}
            <div className="md:col-span-2 space-y-2.5">
              <div className="font-bold uppercase tracking-wider text-slate-900 text-[11px]">
                Accreditation
              </div>
              <ul className="space-y-1.5 text-slate-600">
                <li>
                  <a href="#showcase" className="hover:text-blue-600 transition">
                    NAAC Criteria 3.3.2
                  </a>
                </li>
                <li>
                  <a href="#showcase" className="hover:text-blue-600 transition">
                    NAAC Criteria 5.3.3
                  </a>
                </li>
                <li>
                  <a href="#showcase" className="hover:text-blue-600 transition">
                    NIRF Outreach Index
                  </a>
                </li>
                <li>
                  <a href="#showcase" className="hover:text-blue-600 transition">
                    IQAC Audit Dossiers
                  </a>
                </li>
              </ul>
            </div>

            {/* Links column 3 */}
            <div className="md:col-span-3 space-y-2.5">
              <div className="font-bold uppercase tracking-wider text-slate-900 text-[11px]">
                Campus Access
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Engineered for college technical fest coordinators, club leads, and academic institutions across India.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => setViewMode("dashboard")}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-blue-600 text-xs font-bold hover:bg-blue-50 transition"
                >
                  Enter Demo Workspace →
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 FESTRA Campus Event Engine. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>IQAC Compliance</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
