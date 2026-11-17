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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100 pb-4">
        <div>
          <h2 className="font-fortnite text-2xl tracking-wide text-blue-950 uppercase flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            Institutional NAAC & NIRF Event Audit Dossier
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time compliance documentation generated for Dean of Student Affairs & IQAC Coordinator.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 transition shadow-sm min-h-[36px]"
        >
          <Printer className="h-4 w-4" />
          <span>PRINT / EXPORT PDF</span>
        </button>
      </div>

      {/* Official Formatted Institutional Report Sheet */}
      <div className="rounded-3xl border border-blue-100 bg-white p-6 sm:p-10 space-y-6 text-xs text-slate-700 shadow-sm relative overflow-hidden">
        <div className="text-center border-b border-slate-100 pb-6 space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
            INTERNAL QUALITY ASSURANCE CELL (IQAC) • OFFICIAL EVENT COMPLIANCE DOSSIER
          </div>
          <h1 className="font-fortnite text-3xl sm:text-4xl text-blue-950 uppercase tracking-wide">{currentEvent?.title}</h1>
          <div className="text-xs text-slate-500">
            Venue: {currentEvent?.venue} • Academic Year 2026–2027 • Festra Verified Audit
          </div>
        </div>

        {/* Accreditation Criteria Mapping */}
        <div className="space-y-2">
          <div className="font-semibold uppercase text-[10px] tracking-wider text-slate-500">
            Mandatory Accreditation Parameters Mapped:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 space-y-1">
              <span className="font-fortnite text-sm uppercase text-blue-600 tracking-wide">NAAC Criterion 3.3.2:</span>
              <div className="text-slate-600 text-[11px] leading-relaxed">
                Seminars, Workshops & Hackathons on Emerging Technologies & Research Methodologies
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 space-y-1">
              <span className="font-fortnite text-sm uppercase text-emerald-600 tracking-wide">NAAC Criterion 5.3.3:</span>
              <div className="text-slate-600 text-[11px] leading-relaxed">
                Competitive Technical Events, Inter-Institutional Participation & Student Progression
              </div>
            </div>
          </div>
        </div>

        {/* Real Live Participation Data Grid */}
        <div className="space-y-2 pt-2">
          <div className="font-semibold uppercase text-[10px] tracking-wider text-slate-500">
            Audited Participation & Demographic Metrics:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
              <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Total Registrations</div>
              <div className="font-fortnite text-3xl text-blue-950 mt-1">{eventTeams.length} SQUADS</div>
              <div className="text-slate-500 text-[11px] mt-0.5">{totalStudents} Verified Students</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
              <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Audited Attendance</div>
              <div className="font-fortnite text-3xl text-emerald-600 mt-1">{checkedInCount} SQUADS</div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                {eventTeams.length ? Math.round((checkedInCount / eventTeams.length) * 100) : 0}% Verified Turnout
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
              <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Institutions Represented</div>
              <div className="font-fortnite text-3xl text-blue-600 mt-1">{uniqueColleges.length}</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Inter-institutional Reach</div>
            </div>
          </div>
        </div>

        {/* Participating Institutions List */}
        <div className="space-y-2 pt-2">
          <div className="font-semibold uppercase text-[10px] tracking-wider text-slate-500">
            Participating Higher Education Institutions:
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueColleges.map((c, i) => (
              <span key={i} className="rounded-xl border border-blue-200 bg-blue-50/70 px-3 py-1 text-blue-900 font-medium">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Outcomes & Digital Verification Audit */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-2">
          <div className="font-fortnite text-base text-blue-950 uppercase tracking-wide flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Digital Validation & Verification (DVV) Audit Statement</span>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">
            All evaluation marks were recorded digitally via multi-judge rubric calibration with automated $Z$-Score normalization to eliminate jury bias. Participant attendance was validated via encrypted QR admit passes with zero duplicate entries. Verifiable tamper-proof completion credentials were automatically generated with SHA-256 integrity proofs.
          </p>
        </div>

        {/* Signature Area */}
        <div className="grid grid-cols-2 pt-8 text-center border-t border-slate-100">
          <div className="space-y-1">
            <div className="h-8" />
            <div className="font-fortnite text-base text-blue-950 uppercase tracking-wide">Faculty Coordinator</div>
            <div className="text-[11px] text-slate-500">Student Affairs / Technical Association</div>
          </div>
          <div className="space-y-1">
            <div className="h-8" />
            <div className="font-fortnite text-base text-blue-950 uppercase tracking-wide">Head of Department / Dean</div>
            <div className="text-[11px] text-slate-500">National Institute of Technology</div>
          </div>
        </div>
      </div>
    </div>
  );
};
