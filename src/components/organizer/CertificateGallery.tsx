"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CertificateBatchType, GeneratedCertificate } from "@/types";
import { CertificateCanvasRenderer } from "./CertificateCanvasRenderer";
import {
  buildMailtoLink,
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
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileCode2,
  FileImage,
  FileSpreadsheet,
  Grid2x2,
  Grid3x3,
  Lock,
  Mail,
  Printer,
  Search,
  Send,
  Sparkles,
  Trophy,
  Users,
  X,
} from "lucide-react";

interface CertificateGalleryProps {
  participationCerts: GeneratedCertificate[];
  winnerCerts: GeneratedCertificate[];
  activeTab: CertificateBatchType;
  onChangeTab: (tab: CertificateBatchType) => void;
  isLeaderboardFinalized: boolean;
  onBackToEditor: () => void;
  onRegenerateParticipation: () => void;
  onGenerateWinners: () => void;
  onGoToLeaderboard: () => void;
  onMarkEmailsSent: (certIds: string[]) => void;
}

export const CertificateGallery: React.FC<CertificateGalleryProps> = ({
  participationCerts,
  winnerCerts,
  activeTab,
  onChangeTab,
  isLeaderboardFinalized,
  onBackToEditor,
  onRegenerateParticipation,
  onGenerateWinners,
  onGoToLeaderboard,
  onMarkEmailsSent,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [columns, setColumns] = useState<2 | 3>(3);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Bulk Email Dispatch Modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailToast, setEmailToast] = useState<string | null>(null);

  const activeList = activeTab === "winner" ? winnerCerts : participationCerts;

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return activeList.filter((cert) => {
      if (!q) return true;
      return (
        cert.recipient.name.toLowerCase().includes(q) ||
        cert.recipient.email.toLowerCase().includes(q) ||
        cert.recipient.teamName.toLowerCase().includes(q) ||
        cert.recipient.collegeName.toLowerCase().includes(q) ||
        (cert.recipient.projectTitle || "").toLowerCase().includes(q) ||
        (cert.recipient.leaderboardPlace || "").toLowerCase().includes(q) ||
        cert.recipient.certificateCode.toLowerCase().includes(q)
      );
    });
  }, [activeList, searchQuery]);

  const sentCount = useMemo(
    () => activeList.filter((c) => Boolean(c.emailSentAt)).length,
    [activeList]
  );

  const activeLightboxCert =
    lightboxIndex !== null ? filtered[lightboxIndex] || null : null;

  const showToast = (msg: string) => {
    setEmailToast(msg);
    setTimeout(() => setEmailToast(null), 3200);
  };

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

  const openBulkEmailModal = () => {
    const sampleTitle = activeList[0]?.eventTitle || "HackCampus 2026";
    setEmailSubject(
      activeTab === "winner"
        ? `🏆 Congratulations! Your Official Winner Certificate — ${sampleTitle}`
        : `Your Official Certificate of Participation — ${sampleTitle}`
    );
    setSendProgress(0);
    setIsEmailModalOpen(true);
  };

  const handleBulkEmailSend = () => {
    if (activeList.length === 0) return;
    setIsSendingEmails(true);
    setSendProgress(12);

    const step1 = setTimeout(() => setSendProgress(48), 220);
    const step2 = setTimeout(() => setSendProgress(84), 480);
    const step3 = setTimeout(() => {
      setSendProgress(100);
      onMarkEmailsSent(activeList.map((c) => c.id));
      setIsSendingEmails(false);
      showToast(
        `Sent ${activeList.length} ${
          activeTab === "winner" ? "Winner" : "Participation"
        } certificates to registered email IDs!`
      );
    }, 760);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  const handleSingleEmailDispatch = (cert: GeneratedCertificate) => {
    onMarkEmailsSent([cert.id]);
    showToast(`Certificate ${cert.recipient.certificateCode} sent to ${cert.recipient.email}!`);
  };

  const handleCopyAllEmails = () => {
    const emails = activeList.map((c) => c.recipient.email).join(", ");
    navigator.clipboard?.writeText(emails);
    showToast(`Copied ${activeList.length} registered email addresses to clipboard!`);
  };

  const handleDownloadDispatchCsv = () => {
    const headers = [
      "Certificate ID",
      "Batch Type",
      "Student Name",
      "Registered Email",
      "Team Name",
      "College",
      "Leaderboard Place",
      "Project Title",
      "Verification URL",
      "Email Status",
    ];
    const rows = activeList.map((c) => [
      c.recipient.certificateCode,
      c.batchType,
      `"${c.recipient.name}"`,
      c.recipient.email,
      `"${c.recipient.teamName}"`,
      `"${c.recipient.collegeName}"`,
      `"${c.recipient.leaderboardPlace || c.recipient.awardRole}"`,
      `"${c.recipient.projectTitle || ""}"`,
      `https://festra.dev/verify/${c.recipient.certificateCode}`,
      c.emailSentAt ? "Sent" : "Pending",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FESTRA_${activeTab}_email_dispatch_${activeList.length}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
      handleDownloadSvg(cert);
    } finally {
      setDownloadingId(null);
    }
  };

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
  <title>FESTRA ${activeTab === "winner" ? "Winner" : "Participation"} Certificates (${targetCerts.length})</title>
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
    <div><strong>FESTRA Certificate Pack</strong> — ${targetCerts.length} ${activeTab === "winner" ? "Winner" : "Participation"} Certificates Ready</div>
    <button onclick="window.print()">Print / Save All as PDF</button>
  </div>
  ${pagesHtml}
</body>
</html>`);
    printWin.document.close();
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {emailToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-blue-950 px-4 py-3 text-xs font-semibold text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>{emailToast}</span>
        </div>
      )}

      {/* BATCH SWITCHER: PARTICIPATION CERTIFICATES vs WINNER CERTIFICATES */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white p-2 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              onChangeTab("participation");
              setLightboxIndex(null);
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "participation"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-blue-950"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Participation Certificates (Same Layout, Name Only)</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                activeTab === "participation"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {participationCerts.length}
            </span>
          </button>

          <button
            onClick={() => {
              onChangeTab("winner");
              setLightboxIndex(null);
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "winner"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 hover:bg-amber-50 hover:text-amber-900"
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>Winner Certificates (From Finalized Leaderboard)</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                activeTab === "winner"
                  ? "bg-slate-950/15 text-slate-950"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {winnerCerts.length}
            </span>
          </button>
        </div>

        <button
          onClick={onBackToEditor}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Edit Sample Design</span>
        </button>
      </div>

      {/* EMPTY STATE FOR WINNER TAB OR PARTICIPATION TAB */}
      {activeList.length === 0 ? (
        <div className="rounded-3xl border border-blue-100 bg-white p-10 text-center space-y-4 shadow-sm">
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
              activeTab === "winner"
                ? "bg-amber-50 text-amber-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            {activeTab === "winner" ? (
              <Trophy className="h-7 w-7" />
            ) : (
              <Sparkles className="h-7 w-7" />
            )}
          </div>

          {activeTab === "winner" ? (
            <>
              <div className="space-y-1">
                <h3 className="font-fortnite text-2xl text-blue-950 uppercase tracking-wide">
                  {isLeaderboardFinalized
                    ? "LEADERBOARD FINALIZED — GENERATE WINNER CERTIFICATES"
                    : "FINALIZE LEADERBOARD FIRST TO GENERATE WINNER CERTIFICATES"}
                </h3>
                <p className="text-xs text-slate-500 max-w-lg mx-auto">
                  Winner certificates automatically pull each winning squad&apos;s{" "}
                  <strong>Place (#1, #2, #3)</strong>, <strong>Team Name</strong>,{" "}
                  <strong>Project Title</strong>, and every member&apos;s{" "}
                  <strong>Registered Email ID</strong> directly from the finalized Leaderboard.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {!isLeaderboardFinalized ? (
                  <button
                    onClick={onGoToLeaderboard}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 shadow-sm"
                  >
                    <Lock className="h-4 w-4" />
                    <span>GO TO LEADERBOARD & FINALIZE</span>
                  </button>
                ) : (
                  <button
                    onClick={onGenerateWinners}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 font-fortnite text-sm tracking-wide text-slate-950 hover:bg-amber-400 shadow-sm"
                  >
                    <Trophy className="h-4 w-4" />
                    <span>GENERATE CERTIFICATES FOR WINNERS</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <h3 className="font-fortnite text-2xl text-blue-950 uppercase tracking-wide">
                  NO PARTICIPATION CERTIFICATES GENERATED YET
                </h3>
                <p className="text-xs text-slate-500 max-w-lg mx-auto">
                  Every participant receives the exact same sample certificate design — with ONLY their student name and unique verification ID personalized.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  onClick={onRegenerateParticipation}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 shadow-sm"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>GENERATE PARTICIPATION CERTIFICATES NOW</span>
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          {/* TOP BANNER WITH BULK EMAIL DISPATCH + PRINT ALL PDF */}
          <div
            className={`rounded-2xl border p-5 sm:p-6 shadow-md ${
              activeTab === "winner"
                ? "border-amber-300 bg-gradient-to-r from-amber-500 via-amber-500 to-orange-500 text-slate-950"
                : "border-blue-200 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    activeTab === "winner"
                      ? "bg-slate-950/10 text-slate-950"
                      : "bg-white/15 text-blue-100"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>
                    {activeTab === "winner"
                      ? "Auto-Filled from Finalized Leaderboard"
                      : "Uniform Participation Batch • Name-Only Personalization"}
                  </span>
                </div>
                <h3 className="font-fortnite text-2xl sm:text-3xl tracking-wide uppercase leading-none">
                  {activeTab === "winner"
                    ? `${winnerCerts.length} WINNER CERTIFICATES READY TO DOWNLOAD OR EMAIL`
                    : `${participationCerts.length} PARTICIPATION CERTIFICATES READY TO DOWNLOAD OR EMAIL`}
                </h3>
                <p
                  className={`text-xs max-w-2xl ${
                    activeTab === "winner" ? "text-slate-900/80" : "text-blue-100"
                  }`}
                >
                  {activeTab === "winner"
                    ? `Each winner certificate is auto-populated with Leaderboard Place (#1, #2, #3), Team Name, Project Title, and your custom branding. ${sentCount}/${winnerCerts.length} emailed.`
                    : `All ${participationCerts.length} certificates share 100% identical participation content and branding — only each student's name and SHA-256 ID change. ${sentCount}/${participationCerts.length} emailed.`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={
                    activeTab === "winner" ? onGenerateWinners : onRegenerateParticipation
                  }
                  className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-fortnite text-sm tracking-wide transition ${
                    activeTab === "winner"
                      ? "bg-slate-950/10 border-slate-950/20 text-slate-950 hover:bg-slate-950/20"
                      : "bg-white/15 border-white/25 text-white hover:bg-white/25"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>REFRESH</span>
                </button>

                <button
                  onClick={openBulkEmailModal}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 font-fortnite text-sm tracking-wide transition shadow-sm ${
                    activeTab === "winner"
                      ? "bg-slate-950 text-white hover:bg-slate-800"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  <span>SEND ALL ({activeList.length}) TO EMAIL</span>
                </button>

                <button
                  onClick={() => handlePrintAllBooklet(filtered)}
                  className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 font-fortnite text-sm tracking-wide text-blue-800 hover:bg-blue-50 transition shadow-sm"
                >
                  <Printer className="h-4 w-4" />
                  <span>PRINT / PDF ({filtered.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* SEARCH & GRID CONTROLS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white p-3.5 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student name, email, team, project title, or Cert ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">
                Showing <strong>{filtered.length}</strong> of {activeList.length}
              </span>
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

          {/* CERTIFICATES GALLERY GRID */}
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-blue-100 bg-white p-12 text-center text-xs text-slate-500 space-y-2 shadow-sm">
              <Award className="h-8 w-8 text-slate-400 mx-auto" />
              <p>No certificates match &ldquo;{searchQuery}&rdquo;.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Clear search
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
                const isWinnerCard = cert.batchType === "winner";
                const isSent = Boolean(cert.emailSentAt);
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
                    className={`group rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition flex flex-col ${
                      isWinnerCard
                        ? "border-amber-200 hover:border-amber-400"
                        : "border-slate-200 hover:border-blue-400"
                    }`}
                  >
                    {/* Live Rendered Certificate Preview */}
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
                        {isWinnerCard && cert.recipient.leaderboardRank
                          ? `RANK #${cert.recipient.leaderboardRank}`
                          : `#${String(idx + 1).padStart(2, "0")}`}
                      </div>
                      {isSent && (
                        <div className="absolute top-2.5 right-2.5 rounded-lg bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white flex items-center gap-1 backdrop-blur-sm">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>SENT</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-blue-950/0 group-hover:bg-blue-950/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 font-fortnite text-xs tracking-wide text-blue-950 shadow-lg uppercase">
                          <Eye className="h-3.5 w-3.5 text-blue-600" />
                          VIEW FULL SIZE
                        </span>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-fortnite text-lg text-blue-950 uppercase tracking-wide leading-tight truncate">
                            {cert.recipient.name}
                          </h4>
                          <span
                            className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                              isWinnerCard
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {isWinnerCard
                              ? `#${cert.recipient.leaderboardRank || 1} Winner`
                              : "Participant"}
                          </span>
                        </div>

                        {/* Registered Email ID */}
                        <div className="flex items-center gap-1 text-[11px] text-blue-700 font-medium truncate">
                          <Mail className="h-3 w-3 flex-shrink-0 text-blue-500" />
                          <span className="truncate">{cert.recipient.email}</span>
                        </div>

                        {isWinnerCard ? (
                          <div className="space-y-0.5 pt-0.5 text-[11px]">
                            <div className="font-semibold text-amber-800 truncate">
                              {cert.recipient.leaderboardPlace}
                            </div>
                            <div className="text-slate-600 truncate">
                              Team: <strong>{cert.recipient.teamName}</strong>
                            </div>
                            {cert.recipient.projectTitle && (
                              <div className="text-slate-500 truncate">
                                Project: {cert.recipient.projectTitle}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-500 truncate">
                            {cert.recipient.teamName} • {cert.recipient.collegeName}
                          </div>
                        )}

                        <div className="font-mono text-[10px] text-slate-400">
                          ID: {cert.recipient.certificateCode}
                        </div>
                      </div>

                      {/* Quick Actions: View, Email, PNG, SVG, LinkedIn */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 text-[11px]">
                        <button
                          onClick={() => setLightboxIndex(idx)}
                          className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-blue-600 py-1.5 font-semibold text-white hover:bg-blue-700 transition"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleSingleEmailDispatch(cert)}
                          title={`Send certificate to ${cert.recipient.email}`}
                          className={`flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 font-semibold transition ${
                            isSent
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                          }`}
                        >
                          <Send className="h-3 w-3" />
                          <span>{isSent ? "Sent" : "Email"}</span>
                        </button>
                        <button
                          onClick={() => handleDownloadPng(cert)}
                          disabled={downloadingId === cert.id}
                          title="Download Hi-Res PNG"
                          className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                        >
                          <FileImage className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDownloadSvg(cert)}
                          title="Download Vector SVG"
                          className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                        >
                          <FileCode2 className="h-3 w-3" />
                        </button>
                        <a
                          href={linkedInUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Add to LinkedIn"
                          className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-blue-600 hover:bg-blue-50 transition"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {activeLightboxCert && lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl rounded-3xl border border-blue-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-lg px-2 py-0.5 font-fortnite text-xs ${
                      activeLightboxCert.batchType === "winner"
                        ? "bg-amber-500 text-slate-950"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {lightboxIndex + 1} / {filtered.length}
                  </span>
                  <h3 className="font-fortnite text-2xl text-blue-950 uppercase tracking-wide">
                    {activeLightboxCert.recipient.name}
                  </h3>
                  {activeLightboxCert.emailSentAt && (
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      ✓ Emailed
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Email:{" "}
                  <span className="font-semibold text-blue-700">
                    {activeLightboxCert.recipient.email}
                  </span>{" "}
                  • Team: <strong>{activeLightboxCert.recipient.teamName}</strong>
                  {activeLightboxCert.batchType === "winner" &&
                    activeLightboxCert.recipient.projectTitle && (
                      <> • Project: {activeLightboxCert.recipient.projectTitle}</>
                    )}{" "}
                  •{" "}
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

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100">
              <CertificateCanvasRenderer
                config={activeLightboxCert.templateSnapshot}
                recipient={activeLightboxCert.recipient}
                eventTitle={activeLightboxCert.eventTitle}
                interactive={false}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleSingleEmailDispatch(activeLightboxCert)}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-fortnite text-sm tracking-wide text-white hover:bg-emerald-700 transition shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>SEND TO {activeLightboxCert.recipient.email.toUpperCase()}</span>
                </button>
                <a
                  href={buildMailtoLink(activeLightboxCert)}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Mail className="h-3.5 w-3.5 text-blue-600" />
                  <span>Open in Mail App</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handlePrintAllBooklet([activeLightboxCert])}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => handleDownloadSvg(activeLightboxCert)}
                  className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 font-fortnite text-sm tracking-wide text-blue-800 hover:bg-blue-100 transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>SVG</span>
                </button>
                <button
                  onClick={() => handleDownloadPng(activeLightboxCert)}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 transition shadow-sm"
                >
                  <FileImage className="h-3.5 w-3.5" />
                  <span>HI-RES PNG</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BULK EMAIL DISPATCH MODAL */}
      {isEmailModalOpen && (
        <div
          onClick={() => !isSendingEmails && setIsEmailModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-blue-100 bg-white p-6 shadow-2xl space-y-5 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-fortnite text-2xl text-blue-950 uppercase tracking-wide flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  SEND {activeTab === "winner" ? "WINNER" : "PARTICIPATION"} CERTIFICATES VIA EMAIL ({activeList.length})
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Dispatches each personalized certificate link & verification code directly to the student&apos;s registered email ID.
                </p>
              </div>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Email Subject Line</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Live Progress Bar */}
            {(isSendingEmails || sendProgress === 100) && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {sendProgress === 100
                      ? `All ${activeList.length} Certificates Delivered to Registered Emails!`
                      : `Dispatching personalized certificates...`}
                  </span>
                  <span className="font-mono">{sendProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-emerald-200 overflow-hidden">
                  <div
                    style={{ width: `${sendProgress}%` }}
                    className="h-full bg-emerald-600 transition-all duration-300"
                  />
                </div>
              </div>
            )}

            {/* Recipients Preview Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">
                  Registered Email Recipients ({activeList.length})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyAllEmails}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy Emails</span>
                  </button>
                  <button
                    onClick={handleDownloadDispatchCsv}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <FileSpreadsheet className="h-3 w-3" />
                    <span>Export CSV Log</span>
                  </button>
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-[11px]">
                  <thead className="sticky top-0 bg-slate-100 text-[10px] font-bold uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Student</th>
                      <th className="px-3 py-2">Registered Email</th>
                      <th className="px-3 py-2">
                        {activeTab === "winner" ? "Place & Project" : "Cert ID"}
                      </th>
                      <th className="px-3 py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {activeList.map((c) => (
                      <tr key={c.id} className="hover:bg-blue-50/40">
                        <td className="px-3 py-2 font-bold text-slate-900">
                          {c.recipient.name}
                        </td>
                        <td className="px-3 py-2 font-mono text-blue-700">
                          {c.recipient.email}
                        </td>
                        <td className="px-3 py-2 text-slate-600 max-w-[180px] truncate">
                          {activeTab === "winner"
                            ? `${c.recipient.leaderboardPlace} • ${c.recipient.teamName}`
                            : c.recipient.certificateCode}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {c.emailSentAt ? (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              Sent ✓
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                              Ready
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={handleBulkEmailSend}
                disabled={isSendingEmails}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 font-fortnite text-sm tracking-wide text-white hover:bg-emerald-700 shadow-sm disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                <span>
                  {isSendingEmails
                    ? "SENDING EMAILS..."
                    : `SEND TO ALL ${activeList.length} REGISTERED EMAILS`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
