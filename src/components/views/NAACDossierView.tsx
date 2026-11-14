"use client";

import React from "react";
import { useFestraStore } from "@/lib/store";
import {
  GraduationCap,
  FileCheck2,
  Download,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  Building,
  Award,
} from "lucide-react";

export const NAACDossierView: React.FC = () => {
  const { naacDossier, fest } = useFestraStore();

  const handleDownloadDossier = () => {
    alert("Official NAAC/NIRF Institutional Dossier compiled! Downloading audit-ready PDF dossier with geo-tagged photographic evidence.");
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
              INSTITUTIONAL ACCREDITATION AUDIT READY
            </span>
            <span className="text-xs text-zinc-400">IQAC & Dean Office Portal</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            1-Click NAAC & NIRF Event Dossier
          </h1>
          <p className="text-xs text-zinc-400">
            Automates the 200+ hours spent collecting attendance sheets, gender ratios, and geo-photos for university rankings.
          </p>
        </div>

        <button
          onClick={handleDownloadDossier}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition shadow-lg"
        >
          <Download className="h-4 w-4" />
          <span>Export 15-Page Official Dossier (PDF)</span>
        </button>
      </div>

      {/* Institutional Metadata Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-white">{naacDossier.eventTitle}</h2>
            <p className="text-xs text-zinc-400">{naacDossier.institution} • Academic Year {naacDossier.academicYear}</p>
          </div>
          <div className="rounded-lg bg-zinc-800 px-3 py-1 font-mono text-xs text-zinc-200">
            STATUS: AUDIT VERIFIED
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Mapped Accreditation Criteria:
          </span>
          <div className="flex flex-wrap gap-2">
            {naacDossier.naacCriteria.map((crit, i) => (
              <span
                key={i}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs font-medium text-brand-cyan"
              >
                {crit}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Key Demographic Metrics Grid (For DVV Data Validation & Verification) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Verified Attendance</span>
            <Users className="h-4 w-4 text-brand-cyan" />
          </div>
          <div className="font-mono text-3xl font-black text-white">
            {naacDossier.stats.verifiedAttendees}
          </div>
          <p className="text-[11px] text-zinc-500">
            from {naacDossier.stats.totalRegistrations} total registrations (83.6% turnout)
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Gender Inclusivity Ratio</span>
            <GraduationCap className="h-4 w-4 text-brand-coral" />
          </div>
          <div className="font-mono text-3xl font-black text-brand-coral">
            62% : 38%
          </div>
          <p className="text-[11px] text-zinc-500">
            {naacDossier.stats.maleCount} Male • {naacDossier.stats.femaleCount} Female attendees
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>External Outreach Ratio</span>
            <Building className="h-4 w-4 text-brand-amber" />
          </div>
          <div className="font-mono text-3xl font-black text-brand-amber">
            58.1% External
          </div>
          <p className="text-[11px] text-zinc-500">
            {naacDossier.stats.externalCount} Delegates from {naacDossier.stats.externalInstitutionsCount} colleges
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Verifiable Certificates</span>
            <Award className="h-4 w-4 text-brand-lime" />
          </div>
          <div className="font-mono text-3xl font-black text-brand-lime">
            1,240 Minted
          </div>
          <p className="text-[11px] text-zinc-500">
            100% paperless with cryptographic proof URLs
          </p>
        </div>
      </div>

      {/* Geo-Tagged Photographic Evidence (NAAC Mandatory Requirement) */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-coral" />
              Geo-Tagged Photographic Evidence (GPS Timestamped)
            </h3>
            <p className="text-xs text-zinc-400">
              Photographs captured on-site with verified latitude, longitude, and timestamps for DVV audit compliance.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400">3/3 Audited</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {naacDossier.geoPhotos.map((photo, idx) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 transition hover:border-zinc-700"
            >
              <div className="aspect-video w-full overflow-hidden bg-zinc-900">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="p-3 space-y-1 text-xs">
                <p className="font-medium text-white truncate">{photo.caption}</p>
                <div className="font-mono text-[10px] text-zinc-400 flex items-center justify-between">
                  <span>GPS: {photo.lat.toFixed(4)}, {photo.lng.toFixed(4)}</span>
                  <span>{new Date(photo.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post-Event Learning Outcomes Summary */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          Executive Outcomes & Impact Summary
        </h3>
        <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-800/80">
          {naacDossier.outcomesSummary}
        </p>
      </div>
    </div>
  );
};
