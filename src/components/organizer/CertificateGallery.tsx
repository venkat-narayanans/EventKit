"use client";

import React, { useEffect, useMemo, useState } from "react";
import { GeneratedCertificate } from "@/types";
import { CertificateCanvasRenderer } from "./CertificateCanvasRenderer";
import {
  generateLinkedInCertificateUrl,
  renderCertificateToPngDataUrl,
  renderCertificateToSvg,
} from "@/lib/certificate";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Eye,
  FileImage,
  FileCode2,
  Grid2x2,
  Grid3x3,
  Printer,
  Search,
  Sparkles,
  X,
} from "lucide-react";

interface CertificateGalleryProps {
  certificates: GeneratedCertificate[];
  onBackToEditor: () => void;
  onRegenerate: () => void;
}

export const CertificateGallery: React.FC<CertificateGalleryProps> = ({
  certificates,
  onBackToEditor,
  onRegenerate,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | "winners" | "participants">("all");
  const [columns, setColumns] = useState<2 | 3>(3);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const isWinner = (awardRole: string) =>
    /winner|place|runner|best|merit/i.test(awardRole);

  const winnersCount = useMemo(
    () => certificates.filter((c) => isWinner(c.recipient.awardRole)).length,
    [certificates]
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return certificates.filter((cert) => {
      if (tierFilter === "winners" && !isWinner(cert.recipient.awardRole)) return false;
      if (tierFilter === "participants" && isWinner(cert.recipient.awardRole)) return false;
      if (!q) return true;
      return (
        cert.recipient.name.toLowerCase().includes(q) ||
        cert.recipient.teamName.toLowerCase().includes(q) ||
        cert.recipient.collegeName.toLowerCase().includes(q) ||
        cert.recipient.certificateCode.toLowerCase().includes(q)
      );
    });
  }, [certificates, searchQuery, tierFilter]);

  const activeLightboxCert =
    lightboxIndex !== null ? filtered[lightboxIndex] || null : null;

  // Keyboard navigation inside Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev === null ? null : Math.min(filtered.length - 1, prev + 1)
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev === null ? null : Math.max(0, prev - 1)));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, filtered.length]);

  const handleDownloadSvg = (cert: GeneratedCertificate) => {
    const svg = renderCertificateToSvg(
      cert.templateSnapshot,
      cert.recipient,
      cert.eventTitle
    );
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = cert.recipient.name.replace(/[^a-zA-Z0-9]+/g, "_");
    link.href = url;
    link.download = `${cert.recipient.certificateCode}_${safeName}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = async (cert: GeneratedCertificate) => {
    try {
      setDownloadingId(cert.id);
      const dataUrl = await renderCertificateToPngDataUrl(
        cert.templateSnapshot,
        cert.recipient,
        cert.eventTitle,
        2
      );
      const link = document.createElement("a");
      const safeName = cert.recipient.name.replace(/[^a-zA-Z0-9]+/g, "_");
      link.href = dataUrl;
      link.download = `${cert.recipient.certificateCode}_${safeName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // Fallback to SVG if cross-origin image blocks canvas export
      handleDownloadSvg(cert);
    } finally {
      setDownloadingId(null);
    }
  };

  /**
   * Opens a clean print-ready multi-page landscape booklet containing ALL filtered certificates
   * (1 certificate per A4 landscape page) for instant Save as PDF / Print!
   */
  const handlePrintAllBooklet = (targetCerts: GeneratedCertificate[]) => {
    const printWin = window.open("", "_blank", "width=1200,height=850");
    if (!printWin) {
      window.print();
      return;
    }

    const pagesHtml = targetCerts
      .map((cert) => {
        const svg = renderCertificateToSvg(
          cert.templateSnapshot,
          cert.recipient,
          cert.eventTitle
        );
        return `<div class="cert-page">${svg}</div>`;
      })
      .join("\n");

    printWin.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>FESTRA Bulk Certificates (${targetCerts.length})</title>
  <style>
    @page { size: A4 landscape; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #e2e8f0; font-family: Inter, sans-serif; }
    .toolbar { position: sticky; top: 0; z-index: 10; background: #0f172a; color: #fff; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; }
    .toolbar button { background: #2563eb; color: #fff; border: none; padding: 8px 18px; border-radius: 8px; font-weight: 700; cursor: pointer; }
    .cert-page { width: 100%; max-width: 1120px; margin: 20px auto; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.12); page-break-after: always; break-after: page; }
    .cert-page svg { width: 100%; height: auto; display: block; }
    @media print {
      body { background: #fff; }
      .toolbar { display: none; }
      .cert-page { margin: 0; max-width: none; width: 100vw; height: 100vh; box-shadow: none; display: flex; align-items: center; justify-content: center; }
      .cert-page svg { width: 100%; height: 100%; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div><strong>FESTRA Bulk Certificate Pack</strong> — ${targetCerts.length} Personalized Certificates Ready to Print / Save as PDF</div>
    <button onclick="window.print()">Print / Save All as PDF</button>
  </div>
  ${pagesHtml}
</body>
</html>`);
    printWin.document.close();
  };

  return (
    <div className="space-y-5">
      {/* Top Celebration & Batch Actions Banner */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-5 sm:p-6 text-white shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-100">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
              <span>1-Click Bulk Generation Complete</span>
            </div>
            <h3 className="font-fortnite text-2xl sm:text-3xl tracking-wide uppercase leading-none">
              {certificates.length} PERSONALIZED CERTIFICATES READY TO VIEW
            </h3>
            <p className="text-xs text-blue-100 max-w-2xl">
              Generated automatically from your 1 sample template. Every certificate carries the participant&apos;s exact name, college, squad, logos, and unique SHA-256 verification code.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onBackToEditor}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 border border-white/25 px-3.5 py-2 font-fortnite text-sm tracking-wide text-white hover:bg-white/25 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>EDIT SAMPLE</span>
            </button>
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 border border-white/25 px-3.5 py-2 font-fortnite text-sm tracking-wide text-white hover:bg-white/25 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>SYNC LATEST EDITS</span>
            </button>
            <button
              onClick={() => handlePrintAllBooklet(filtered)}
              className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 font-fortnite text-sm tracking-wide text-blue-700 hover:bg-blue-50 transition shadow-sm"
            >
              <Printer className="h-4 w-4" />
              <span>PRINT / EXPORT ALL ({filtered.length}) PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white p-3.5 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, team, college, or FST-2026 ID..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5 text-xs">
            <button
              onClick={() => setTierFilter("all")}
              className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                tierFilter === "all"
                  ? "bg-white text-blue-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({certificates.length})
            </button>
            <button
              onClick={() => setTierFilter("winners")}
              className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                tierFilter === "winners"
                  ? "bg-white text-blue-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Winners ({winnersCount})
            </button>
            <button
              onClick={() => setTierFilter("participants")}
              className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                tierFilter === "participants"
                  ? "bg-white text-blue-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Participants ({certificates.length - winnersCount})
            </button>
          </div>

          <div className="hidden md:flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5">
            <button
              onClick={() => setColumns(2)}
              title="2 Columns"
              className={`rounded-lg p-1.5 transition ${
                columns === 2 ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
              }`}
            >
              <Grid2x2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setColumns(3)}
              title="3 Columns"
              className={`rounded-lg p-1.5 transition ${
                columns === 3 ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
              }`}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Generated Certificates Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-blue-100 bg-white p-12 text-center text-xs text-slate-500 space-y-2 shadow-sm">
          <Award className="h-8 w-8 text-slate-400 mx-auto" />
          <p>No generated certificates match your search filter.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setTierFilter("all");
            }}
            className="text-blue-600 font-semibold hover:underline"
          >
            Clear search filters
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-4 ${
            columns === 2
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {filtered.map((cert, idx) => {
            const winner = isWinner(cert.recipient.awardRole);
            const linkedInUrl = generateLinkedInCertificateUrl({
              certificateCode: cert.recipient.certificateCode,
              eventName: cert.eventTitle,
              institutionName: cert.recipient.collegeName,
              issueDate: "2026-11-21",
              verificationUrl: `https://festra.dev/verify/${cert.recipient.certificateCode}`,
            });

            return (
              <div
                key={cert.id}
                className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:border-blue-400 hover:shadow-md transition flex flex-col"
              >
                {/* Live Rendered Certificate Thumbnail */}
                <div
                  onClick={() => setLightboxIndex(idx)}
                  className="relative cursor-pointer bg-slate-100 border-b border-slate-100 overflow-hidden"
                >
                  <CertificateCanvasRenderer
                    config={cert.templateSnapshot}
                    recipient={cert.recipient}
                    eventTitle={cert.eventTitle}
                    interactive={false}
                  />
                  <div className="absolute top-2.5 left-2.5 rounded-lg bg-slate-900/75 px-2 py-0.5 font-fortnite text-xs text-white backdrop-blur-sm">
                    #{String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="absolute inset-0 bg-blue-950/0 group-hover:bg-blue-950/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 font-fortnite text-xs tracking-wide text-blue-950 shadow-lg uppercase">
                      <Eye className="h-3.5 w-3.5 text-blue-600" />
                      VIEW FULL SIZE
                    </span>
                  </div>
                </div>

                {/* Card Footer Info & Quick Export */}
                <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-fortnite text-lg text-blue-950 uppercase tracking-wide leading-tight truncate">
                        {cert.recipient.name}
                      </h4>
                      <span
                        className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          winner
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {winner ? "Winner" : "Participant"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {cert.recipient.teamName} • {cert.recipient.collegeName}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">
                      ID: {cert.recipient.certificateCode}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 text-[11px]">
                    <button
                      onClick={() => setLightboxIndex(idx)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-blue-600 py-1.5 font-semibold text-white hover:bg-blue-700 transition"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleDownloadPng(cert)}
                      disabled={downloadingId === cert.id}
                      title="Download High-Res PNG"
                      className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition"
                    >
                      <FileImage className="h-3 w-3" />
                      <span>PNG</span>
                    </button>
                    <button
                      onClick={() => handleDownloadSvg(cert)}
                      title="Download Vector SVG"
                      className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition"
                    >
                      <FileCode2 className="h-3 w-3" />
                      <span>SVG</span>
                    </button>
                    <a
                      href={linkedInUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Add to LinkedIn"
                      className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full-Screen Certificate Lightbox Modal */}
      {activeLightboxCert && lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl rounded-3xl border border-blue-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto"
          >
            {/* Lightbox Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-blue-600 px-2 py-0.5 font-fortnite text-xs text-white">
                    {lightboxIndex + 1} / {filtered.length}
                  </span>
                  <h3 className="font-fortnite text-2xl text-blue-950 uppercase tracking-wide">
                    {activeLightboxCert.recipient.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  {activeLightboxCert.recipient.awardRole} • {activeLightboxCert.recipient.teamName} ({activeLightboxCert.recipient.collegeName}) •{" "}
                  <span className="font-mono text-blue-600 font-semibold">
                    {activeLightboxCert.recipient.certificateCode}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLightboxIndex(Math.max(0, lightboxIndex - 1))}
                  disabled={lightboxIndex === 0}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Prev</span>
                </button>
                <button
                  onClick={() =>
                    setLightboxIndex(Math.min(filtered.length - 1, lightboxIndex + 1))
                  }
                  disabled={lightboxIndex === filtered.length - 1}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Full-Resolution Certificate Preview */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100">
              <CertificateCanvasRenderer
                config={activeLightboxCert.templateSnapshot}
                recipient={activeLightboxCert.recipient}
                eventTitle={activeLightboxCert.eventTitle}
                interactive={false}
              />
            </div>

            {/* Lightbox Footer Export Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="text-[11px] font-mono text-slate-400">
                SHA-256 Proof: {activeLightboxCert.recipient.verificationHash}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handlePrintAllBooklet([activeLightboxCert])}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => handleDownloadSvg(activeLightboxCert)}
                  className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 font-fortnite text-sm tracking-wide text-blue-800 hover:bg-blue-100 transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>DOWNLOAD SVG</span>
                </button>
                <button
                  onClick={() => handleDownloadPng(activeLightboxCert)}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 transition shadow-sm"
                >
                  <FileImage className="h-3.5 w-3.5" />
                  <span>DOWNLOAD HI-RES PNG</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
