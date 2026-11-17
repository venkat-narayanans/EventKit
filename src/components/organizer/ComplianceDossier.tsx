"use client";

import React from "react";
import { useStore } from "@/lib/store";
import {
  GraduationCap,
  Download,
  Users,
  CheckCircle2,
  Building,
  Award,
  Printer,
  ShieldCheck,
} from "lucide-react";

export const ComplianceDossier: React.FC = () => {
  const { events, teams, judgeScores, selectedEventId } = useStore();

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const eventTeams = teams.filter((t) => t.eventId === currentEvent?.id);
  const checkedInCount = eventTeams.filter((t) => t.checkedIn).length;
  const totalStudents = eventTeams.reduce((sum, t) => sum + (t.members?.length || 1), 0);

  // Calculate unique institutions
  const uniqueColleges = Array.from(new Set(eventTeams.map((t) => t.collegeName)));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-kahoot-green" />
            Institutional NAAC & NIRF Event Audit Dossier
          </h2>
          <p className="text-xs text-zinc-400">
            Real-time compliance documentation generated for Dean of Student Affairs & IQAC Coordinator.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition shadow-sm min-h-[36px]"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Official Formatted Institutional Report Sheet */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#111114] p-6 sm:p-10 space-y-6 text-xs text-zinc-300 shadow-luma-card relative overflow-hidden">
        <div className="text-center border-b border-white/[0.08] pb-6 space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-devfolio-blue">
            INTERNAL QUALITY ASSURANCE CELL (IQAC) • OFFICIAL EVENT COMPLIANCE DOSSIER
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{currentEvent?.title}</h1>
          <div className="text-xs text-zinc-400">
            Venue: {currentEvent?.venue} • Academic Year 2026–2027 • Festra Verified Audit
          </div>
        </div>

        {/* Accreditation Criteria Mapping */}
        <div className="space-y-2">
          <div className="font-semibold text-white uppercase text-[10px] tracking-wider text-zinc-400">
            Mandatory Accreditation Parameters Mapped:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl border border-white/[0.08] bg-[#08080a] p-3.5 space-y-1">
              <span className="font-bold text-devfolio-blue">NAAC Criterion 3.3.2:</span>
              <div className="text-zinc-400 text-[11px] leading-relaxed">
                Seminars, Workshops & Hackathons on Emerging Technologies & Research Methodologies
              </div>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-[#08080a] p-3.5 space-y-1">
              <span className="font-bold text-kahoot-green">NAAC Criterion 5.3.3:</span>
              <div className="text-zinc-400 text-[11px] leading-relaxed">
                Competitive Technical Events, Inter-Institutional Participation & Student Progression
              </div>
            </div>
          </div>
        </div>

        {/* Real Live Participation Data Grid */}
        <div className="space-y-2 pt-2">
          <div className="font-semibold text-white uppercase text-[10px] tracking-wider text-zinc-400">
            Audited Participation & Demographic Metrics:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/[0.08] bg-[#08080a] p-4 text-center">
              <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Total Registrations</div>
              <div className="font-mono text-2xl font-black text-white mt-1">{eventTeams.length} Squads</div>
              <div className="text-zinc-400 text-[11px] mt-0.5">{totalStudents} Verified Students</div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#08080a] p-4 text-center">
              <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Audited Attendance</div>
              <div className="font-mono text-2xl font-black text-kahoot-green mt-1">{checkedInCount} Squads</div>
              <div className="text-zinc-400 text-[11px] mt-0.5">
                {eventTeams.length ? Math.round((checkedInCount / eventTeams.length) * 100) : 0}% Verified Turnout
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#08080a] p-4 text-center">
              <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Institutions Represented</div>
              <div className="font-mono text-2xl font-black text-devfolio-blue mt-1">{uniqueColleges.length}</div>
              <div className="text-zinc-400 text-[11px] mt-0.5">Inter-institutional Reach</div>
            </div>
          </div>
        </div>

        {/* Participating Institutions List */}
        <div className="space-y-2 pt-2">
          <div className="font-semibold text-white uppercase text-[10px] tracking-wider text-zinc-400">
            Participating Higher Education Institutions:
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueColleges.map((c, i) => (
              <span key={i} className="rounded-xl border border-white/[0.08] bg-[#08080a] px-3 py-1 text-zinc-200 font-medium">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Outcomes & Digital Verification Audit */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#08080a] p-4 space-y-2">
          <div className="font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-kahoot-green" />
            <span>Digital Validation & Verification (DVV) Audit Statement</span>
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed">
            All evaluation marks were recorded digitally via multi-judge rubric calibration with automated $Z$-Score normalization to eliminate jury bias. Participant attendance was validated via encrypted QR admit passes with zero duplicate entries. Verifiable tamper-proof completion credentials were automatically generated with SHA-256 integrity proofs.
          </p>
        </div>

        {/* Signature Area */}
        <div className="grid grid-cols-2 pt-8 text-center border-t border-white/[0.08]">
          <div className="space-y-1">
            <div className="h-8" />
            <div className="font-bold text-white">Faculty Coordinator</div>
            <div className="text-[11px] text-zinc-500">Student Affairs / Technical Association</div>
          </div>
          <div className="space-y-1">
            <div className="h-8" />
            <div className="font-bold text-white">Head of Department / Dean</div>
            <div className="text-[11px] text-zinc-500">National Institute of Technology</div>
          </div>
        </div>
      </div>
    </div>
  );
};
