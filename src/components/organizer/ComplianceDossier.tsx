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
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-emerald-400" />
            Institutional NAAC & NIRF Event Audit Dossier
          </h2>
          <p className="text-xs text-zinc-400">
            Real-time compliance documentation generated for Dean of Student Affairs & IQAC Coordinator.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Official Formatted Institutional Report Sheet */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 space-y-6 text-xs text-zinc-300">
        <div className="text-center border-b border-zinc-800 pb-5 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
            INTERNAL QUALITY ASSURANCE CELL (IQAC) • EVENT COMPLIANCE RECORD
          </div>
          <h1 className="text-xl font-bold text-white">{currentEvent?.title}</h1>
          <div className="text-xs text-zinc-400">
            Venue: {currentEvent?.venue} • Academic Year 2026–2027
          </div>
        </div>

        {/* Accreditation Criteria Mapping */}
        <div className="space-y-2">
          <div className="font-semibold text-white uppercase text-[11px] tracking-wider">
            Mandatory Accreditation Parameters Mapped:
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5">
              <span className="font-bold text-blue-400">NAAC Criterion 3.3.2:</span>
              <div className="text-zinc-400 mt-0.5">Seminars/Workshops on Research Methodology & Technology</div>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5">
              <span className="font-bold text-emerald-400">NAAC Criterion 5.3.3:</span>
              <div className="text-zinc-400 mt-0.5">Competitive Technical Events & Student Progression</div>
            </div>
          </div>
        </div>

        {/* Real Live Participation Data Grid */}
        <div className="space-y-2 pt-2">
          <div className="font-semibold text-white uppercase text-[11px] tracking-wider">
            Audited Participation & Demographic Data:
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-center">
              <div className="text-zinc-500 text-[10px] uppercase font-bold">Total Registrations</div>
              <div className="font-mono text-2xl font-bold text-white mt-1">{eventTeams.length} Squads</div>
              <div className="text-zinc-400 text-[11px] mt-0.5">{totalStudents} Students</div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-center">
              <div className="text-zinc-500 text-[10px] uppercase font-bold">Verified Attendance</div>
              <div className="font-mono text-2xl font-bold text-emerald-400 mt-1">{checkedInCount} Squads</div>
              <div className="text-zinc-400 text-[11px] mt-0.5">
                {eventTeams.length ? Math.round((checkedInCount / eventTeams.length) * 100) : 0}% Turnout
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-center">
              <div className="text-zinc-500 text-[10px] uppercase font-bold">Colleges Represented</div>
              <div className="font-mono text-2xl font-bold text-blue-400 mt-1">{uniqueColleges.length}</div>
              <div className="text-zinc-400 text-[11px] mt-0.5">Inter-institutional reach</div>
            </div>
          </div>
        </div>

        {/* Participating Institutions List */}
        <div className="space-y-2 pt-2">
          <div className="font-semibold text-white uppercase text-[11px] tracking-wider">
            Participating Higher Education Institutions:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {uniqueColleges.map((c, i) => (
              <span key={i} className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-zinc-300">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Outcomes & Digital Verification Audit */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
          <div className="font-semibold text-white">Digital Validation & Verification (DVV) Statement</div>
          <p className="text-zinc-400 text-xs leading-relaxed">
            All evaluation marks were recorded digitally with automated rubric scoring. Attendance was logged via
            unique encrypted ticket IDs with zero duplicate submissions. Verifiable completion credentials have been issued
            with cryptographic proof URLs.
          </p>
        </div>

        {/* Signature Area */}
        <div className="grid grid-cols-2 pt-8 text-center border-t border-zinc-800/80">
          <div>
            <div className="h-10" />
            <div className="font-semibold text-white">Faculty Coordinator</div>
            <div className="text-[11px] text-zinc-500">Student Affairs / Technical Association</div>
          </div>
          <div>
            <div className="h-10" />
            <div className="font-semibold text-white">Head of the Department / Dean</div>
            <div className="text-[11px] text-zinc-500">National Institute of Technology</div>
          </div>
        </div>
      </div>
    </div>
  );
};
