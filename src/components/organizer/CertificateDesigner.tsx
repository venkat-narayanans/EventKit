"use client";

import React, { useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { useStore } from "@/lib/store";
import {
  CanvasElement,
  CertificateBadgeStyle,
  CertificateBorderStyle,
} from "@/types";
import {
  CERTIFICATE_TEMPLATES,
  buildRecipientsFromEvent,
  buildSample50Recipients,
  getElementKind,
  parseRecipientsFromText,
  renderCertificateToPngDataUrl,
  renderCertificateToSvg,
} from "@/lib/certificate";
import { CertificateCanvasRenderer } from "./CertificateCanvasRenderer";
import { CertificateGallery } from "./CertificateGallery";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Award,
  Bold,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Eye,
  EyeOff,
  FileImage,
  FileSpreadsheet,
  Grid,
  ImagePlus,
  Italic,
  Layers,
  LayoutTemplate,
  Lock,
  Magnet,
  Minus,
  Palette,
  PenTool,
  Plus,
  QrCode,
  ShieldCheck,
  Sliders,
  Sparkles,
  Square,
  Trash2,
  Trophy,
  Type,
  Unlock,
  Upload,
  Users,
  Wand2,
  X,
} from "lucide-react";

const FONT_OPTIONS = [
  { label: "Georgia (Classic Serif)", value: "Georgia, serif" },
  { label: "Inter (Clean Sans)", value: "Inter, sans-serif" },
  {
    label: "Fortnite Display (Bold)",
    value: "'FortniteFont', 'Burbank Big Condensed Black', sans-serif",
  },
  { label: "Playfair / Times Serif", value: "'Times New Roman', Times, serif" },
  { label: "Brush Script (Calligraphy)", value: "'Brush Script MT', 'Segoe Script', cursive" },
  { label: "JetBrains Mono (Code)", value: "ui-monospace, SFMono-Regular, Menlo, monospace" },
];

const COLOR_SWATCHES = [
  "#0f172a",
  "#1e3a8a",
  "#2563eb",
  "#0284c7",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#475569",
  "#ffffff",
];

const BORDER_OPTIONS: Array<{ id: CertificateBorderStyle; label: string }> = [
  { id: "modern_accent", label: "Modern Blue" },
  { id: "classic_double", label: "Classic Double" },
  { id: "ornate_corners", label: "Ornate Corners" },
  { id: "minimal_line", label: "Minimal Frame" },
  { id: "none", label: "No Border" },
];

const VARIABLE_TOKENS = [
  { label: "Student Name", token: "{{participant_name}}" },
  { label: "Team / Squad", token: "{{team_name}}" },
  { label: "Project Title", token: "{{project_title}}" },
  { label: "Leaderboard Place", token: "{{leaderboard_place}}" },
  { label: "College", token: "{{college_name}}" },
  { label: "Event Title", token: "{{event_title}}" },
  { label: "Cert ID", token: "{{certificate_id}}" },
  { label: "Issue Date", token: "{{issue_date}}" },
];

export const CertificateDesigner: React.FC = () => {
  const {
    certConfig,
    updateCertConfig,
    applyCertTemplate,
    updateCertElement,
    updateCertBackground,
    addCertElement,
    deleteCertElement,
    duplicateCertElement,
    reorderCertElement,
    events,
    teams,
    judgeScores,
    selectedEventId,
    setActiveSection,
    finalizedLeaderboards,
    certStudioView,
    setCertStudioView,
    certGalleryTab,
    setCertGalleryTab,
    customRecipients,
    addCustomRecipients,
    replaceCustomRecipients,
    clearCustomRecipients,
    generatedCertificates,
    generateAllCertificates,
    generateWinnerCertificatesFromLeaderboard,
    markCertificateEmailsSent,
  } = useStore();

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const eventId = currentEvent?.id || "hack-ai-2026";
  const eventTitle = currentEvent?.title || "HackCampus 2026";
  const isLeaderboardFinalized = Boolean(finalizedLeaderboards[eventId]);

  // View mode synced with store so Leaderboard -> "Generate Certificates for Winners" opens Gallery directly
  const studioView = certStudioView;
  const setStudioView = setCertStudioView;
  const [leftTab, setLeftTab] = useState<"templates" | "assets" | "text" | "layers">("templates");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    certConfig.elements[0]?.id || null
  );
  const [showGrid, setShowGrid] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [csvPasteText, setCsvPasteText] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hidden file inputs for Canva-style uploads
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const sigFileInputRef = useRef<HTMLInputElement>(null);
  const replaceImgInputRef = useRef<HTMLInputElement>(null);
  const csvFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // All merged recipients from live Event Registrations + imported/demo batch
  const allRecipients = useMemo(
    () =>
      buildRecipientsFromEvent(
        teams,
        judgeScores,
        currentEvent,
        customRecipients[eventId] || []
      ),
    [teams, judgeScores, currentEvent, customRecipients, eventId]
  );

  const eventGeneratedCerts = useMemo(
    () => generatedCertificates.filter((c) => c.eventId === eventId),
    [generatedCertificates, eventId]
  );

  const participationCerts = useMemo(
    () => eventGeneratedCerts.filter((c) => c.batchType !== "winner"),
    [eventGeneratedCerts]
  );

  const winnerCerts = useMemo(
    () => eventGeneratedCerts.filter((c) => c.batchType === "winner"),
    [eventGeneratedCerts]
  );

  const safePreviewIdx =
    allRecipients.length > 0 ? Math.min(previewIdx, allRecipients.length - 1) : 0;
  const previewRecipient = allRecipients[safePreviewIdx] || null;

  const selectedElement =
    certConfig.elements.find((el) => el.id === selectedElementId) || null;
  const selectedKind = selectedElement ? getElementKind(selectedElement) : null;

  // Upload Handlers
  const readFileAsDataUrl = (file: File, onLoad: (dataUrl: string) => void) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) onLoad(result);
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFileAsDataUrl(file, (url) => {
      updateCertBackground(url);
      showToast("Custom certificate background artwork applied!");
    });
    e.target.value = "";
  };

  const handleAddImageLayer = (
    e: React.ChangeEvent<HTMLInputElement>,
    kindType: "logo" | "signature_img"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFileAsDataUrl(file, (dataUrl) => {
      const isLogo = kindType === "logo";
      const newId = addCertElement({
        kind: "image",
        type: kindType,
        label: isLogo ? "College Logo" : "Signature Image",
        text: "",
        imageDataUrl: dataUrl,
        xPercent: isLogo ? 14 : 78,
        yPercent: isLogo ? 16 : 78,
        widthPercent: isLogo ? 11 : 18,
        heightPercent: isLogo ? 14 : 9,
        borderRadius: 0,
        fontSize: 16,
        fontFamily: "Inter, sans-serif",
        color: "#2563eb",
        fontWeight: "600",
        opacity: 1,
        enabled: true,
      });
      setSelectedElementId(newId);
      showToast(isLogo ? "College logo added! Drag & resize anywhere." : "Signature image added!");
    });
    e.target.value = "";
  };

  const handleReplaceSelectedImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedElement) return;
    readFileAsDataUrl(file, (dataUrl) => {
      updateCertElement(selectedElement.id, { imageDataUrl: dataUrl });
      showToast("Image updated!");
    });
    e.target.value = "";
  };

  const handleAddTextPreset = (
    label: string,
    text: string,
    fontSize: number,
    fontWeight: string,
    type: CanvasElement["type"] = "custom_text"
  ) => {
    const newId = addCertElement({
      kind: "text",
      type,
      label,
      text,
      xPercent: 50,
      yPercent: 50,
      fontSize,
      fontFamily: fontSize >= 36 ? "Georgia, serif" : "Inter, sans-serif",
      color: certConfig.backgroundColor === "#0f172a" ? "#ffffff" : "#0f172a",
      fontWeight,
      enabled: true,
    });
    setSelectedElementId(newId);
  };

  const handleAddBadge = (style: CertificateBadgeStyle, label: string, color: string) => {
    const newId = addCertElement({
      kind: "badge",
      type: "seal",
      label,
      text: "",
      xPercent: 90,
      yPercent: 16,
      widthPercent: 9,
      heightPercent: 12.5,
      badgeStyle: style,
      fontSize: 16,
      fontFamily: "Inter, sans-serif",
      color,
      fontWeight: "700",
      opacity: 1,
      enabled: true,
    });
    setSelectedElementId(newId);
  };

  const handleAddShape = (
    shapeType: "line" | "rectangle" | "pill",
    label: string,
    widthPercent: number,
    heightPercent: number
  ) => {
    const newId = addCertElement({
      kind: "shape",
      type: shapeType === "line" ? "divider" : "box",
      label,
      text: "",
      xPercent: 50,
      yPercent: 58,
      widthPercent,
      heightPercent,
      shapeType,
      fontSize: 12,
      fontFamily: "Inter, sans-serif",
      color: certConfig.borderColor || "#2563eb",
      fontWeight: "400",
      opacity: 0.9,
      enabled: true,
    });
    setSelectedElementId(newId);
  };

  const handleAddQrLayer = () => {
    const existingQr = certConfig.elements.find((e) => getElementKind(e) === "qr");
    if (existingQr) {
      updateCertElement(existingQr.id, { enabled: true });
      setSelectedElementId(existingQr.id);
      return;
    }
    const newId = addCertElement({
      kind: "qr",
      type: "qr",
      label: "Verification QR Badge",
      text: "VERIFY: {{certificate_id}}",
      xPercent: 50,
      yPercent: 85,
      fontSize: 12,
      fontFamily: "monospace",
      color: "#2563eb",
      fontWeight: "700",
      widthPercent: 22,
      heightPercent: 10,
      enabled: true,
    });
    setSelectedElementId(newId);
  };

  // Sample Download Handlers
  const handleDownloadSampleSvg = () => {
    const svg = renderCertificateToSvg(certConfig, previewRecipient, eventTitle);
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = (previewRecipient?.name || "Sample").replace(/[^a-zA-Z0-9]+/g, "_");
    link.href = url;
    link.download = `Sample_Certificate_${safeName}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSamplePng = async () => {
    try {
      const dataUrl = await renderCertificateToPngDataUrl(
        certConfig,
        previewRecipient,
        eventTitle,
        2
      );
      const link = document.createElement("a");
      const safeName = (previewRecipient?.name || "Sample").replace(/[^a-zA-Z0-9]+/g, "_");
      link.href = dataUrl;
      link.download = `Sample_Certificate_${safeName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      handleDownloadSampleSvg();
    }
  };

  // 1-CLICK PARTICIPATION BULK GENERATION (Identical content, ONLY student name & ID change!)
  const handleGenerateAllCertificates = () => {
    if (allRecipients.length === 0) {
      setIsRosterModalOpen(true);
      return;
    }
    setIsGenerating(true);

    setTimeout(() => {
      generateAllCertificates(eventId, allRecipients, eventTitle);
      setIsGenerating(false);
      confetti({
        particleCount: 95,
        spread: 70,
        origin: { y: 0.55 },
        colors: ["#2563eb", "#38bdf8", "#f59e0b", "#10b981", "#ffffff"],
      });
      showToast(
        `Generated ${allRecipients.length} uniform Participation certificates — same design, unique student names!`
      );
    }, 300);
  };

  // 1-CLICK WINNER CERTIFICATES GENERATION (From Finalized Leaderboard)
  const handleGenerateWinnerCertificates = () => {
    if (!isLeaderboardFinalized) {
      setActiveSection("leaderboard");
      return;
    }
    const created = generateWinnerCertificatesFromLeaderboard(eventId);
    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.55 },
      colors: ["#f59e0b", "#2563eb", "#10b981", "#ffffff"],
    });
    showToast(
      `Generated ${created.length} Winner certificates with Leaderboard Place, Team Name & Project Title!`
    );
  };

  // Load 50 realistic registered participants with 1 click
  const handleLoad50DemoStudents = () => {
    const sample50 = buildSample50Recipients(eventId);
    replaceCustomRecipients(eventId, sample50);
    setPreviewIdx(0);
    showToast("50 registered participants loaded! Click 'Generate All' to create all 50 certificates.");
  };

  // Import pasted names or CSV
  const handleImportCsvText = () => {
    if (!csvPasteText.trim()) return;
    const parsed = parseRecipientsFromText(csvPasteText, eventId);
    if (parsed.length === 0) return;
    addCustomRecipients(eventId, parsed);
    setCsvPasteText("");
    showToast(`Imported ${parsed.length} participant(s) into certificate roster!`);
  };

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (content) {
        const parsed = parseRecipientsFromText(content, eventId);
        if (parsed.length > 0) {
          addCustomRecipients(eventId, parsed);
          showToast(`Imported ${parsed.length} participants from ${file.name}!`);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-5 py-4 sm:py-6">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={bgFileInputRef}
        onChange={handleBackgroundUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={logoFileInputRef}
        onChange={(e) => handleAddImageLayer(e, "logo")}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={sigFileInputRef}
        onChange={(e) => handleAddImageLayer(e, "signature_img")}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={replaceImgInputRef}
        onChange={handleReplaceSelectedImage}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={csvFileInputRef}
        onChange={handleCsvFileUpload}
        accept=".csv,.txt"
        className="hidden"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-950 px-4 py-3 text-xs font-semibold text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP STUDIO HEADER & 1-CLICK BULK GENERATE BAR */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-blue-100 pb-4">
        <div className="space-y-1">
          <h2 className="font-fortnite text-2xl sm:text-3xl tracking-wide text-blue-950 uppercase flex items-center gap-2">
            <Award className="h-6 w-6 text-blue-600" />
            CANVA-STYLE CERTIFICATE STUDIO & BULK GENERATOR
          </h2>
          <p className="text-xs text-slate-500">
            Design 1 fully customized sample certificate (college logos, signatures, fonts, borders) and generate personalized certificates for all{" "}
            <span className="font-bold text-blue-700">{allRecipients.length}</span> registered participants in 1 click.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher: Design Sample vs Generated Gallery */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5 text-xs">
            <button
              onClick={() => setStudioView("editor")}
              className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                studioView === "editor"
                  ? "bg-white text-blue-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              1. Design Sample
            </button>
            <button
              onClick={() => setStudioView("gallery")}
              className={`rounded-lg px-3 py-1.5 font-semibold transition flex items-center gap-1.5 ${
                studioView === "gallery"
                  ? "bg-white text-blue-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>2. Generated Gallery</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  eventGeneratedCerts.length > 0
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {eventGeneratedCerts.length}
              </span>
            </button>
          </div>

          {/* Roster Button */}
          <button
            onClick={() => setIsRosterModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3.5 py-2 text-xs font-bold text-blue-900 hover:bg-blue-50 transition shadow-sm min-h-[38px]"
          >
            <Users className="h-3.5 w-3.5 text-blue-600" />
            <span>Roster ({allRecipients.length})</span>
          </button>

          {/* HERO 1-CLICK PARTICIPATION BULK GENERATE BUTTON */}
          <button
            onClick={handleGenerateAllCertificates}
            disabled={isGenerating}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 font-fortnite text-sm sm:text-base tracking-wide text-white hover:bg-blue-700 transition shadow-md shadow-blue-600/20 min-h-[38px] disabled:opacity-70"
          >
            <Wand2 className="h-4 w-4" />
            <span>
              {isGenerating
                ? "GENERATING..."
                : `GENERATE PARTICIPATION (${allRecipients.length})`}
            </span>
          </button>

          {/* WINNER CERTIFICATES FROM FINALIZED LEADERBOARD BUTTON */}
          <button
            onClick={handleGenerateWinnerCertificates}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 font-fortnite text-sm sm:text-base tracking-wide transition shadow-sm min-h-[38px] ${
              isLeaderboardFinalized
                ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                : "border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>
              {isLeaderboardFinalized
                ? "GENERATE WINNERS"
                : "FINALIZE LEADERBOARD → WINNERS"}
            </span>
          </button>
        </div>
      </div>

      {/* VIEW 2: GENERATED CERTIFICATES GALLERY PAGE */}
      {studioView === "gallery" ? (
        <CertificateGallery
          participationCerts={participationCerts}
          winnerCerts={winnerCerts}
          activeTab={certGalleryTab}
          onChangeTab={setCertGalleryTab}
          isLeaderboardFinalized={isLeaderboardFinalized}
          onBackToEditor={() => setStudioView("editor")}
          onRegenerateParticipation={handleGenerateAllCertificates}
          onGenerateWinners={handleGenerateWinnerCertificates}
          onGoToLeaderboard={() => setActiveSection("leaderboard")}
          onMarkEmailsSent={markCertificateEmailsSent}
        />
      ) : (
        /* VIEW 1: CANVA-STYLE 3-PANE SAMPLE DESIGN STUDIO */
        <div className="grid gap-4 lg:grid-cols-12 items-start">
          {/* LEFT PANEL: Canva Tool Rail (Templates, Logos & Assets, Text, Layers) — 3 Cols */}
          <div className="lg:col-span-3 rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
            {/* Tool Tabs */}
            <div className="grid grid-cols-4 border-b border-slate-100 bg-slate-50/70 p-1 text-[10px] font-bold">
              {[
                { id: "templates", label: "Templates", icon: LayoutTemplate },
                { id: "assets", label: "Logos", icon: ImagePlus },
                { id: "text", label: "Text", icon: Type },
                { id: "layers", label: "Layers", icon: Layers },
              ].map((t) => {
                const Icon = t.icon;
                const active = leftTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setLeftTab(t.id as typeof leftTab)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition ${
                      active
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-white hover:text-blue-900"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tool Tab Contents */}
            <div className="p-3.5 space-y-4 max-h-[680px] overflow-y-auto text-xs">
              {/* TAB 1: TEMPLATES, BACKGROUNDS & BORDERS */}
              {leftTab === "templates" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-fortnite text-sm text-blue-950 uppercase tracking-wide">
                      1-Click Designer Themes
                    </div>
                    <div className="space-y-2">
                      {CERTIFICATE_TEMPLATES.map((tpl) => {
                        const isActive = certConfig.templateId === tpl.id;
                        return (
                          <button
                            key={tpl.id}
                            onClick={() => {
                              applyCertTemplate({ ...tpl.config, eventId });
                              setSelectedElementId(tpl.config.elements[0]?.id || null);
                              showToast(`Applied "${tpl.name}" template!`);
                            }}
                            className={`w-full text-left rounded-xl border p-2.5 transition flex items-center gap-3 ${
                              isActive
                                ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-600/30"
                                : "border-slate-200 bg-white hover:border-blue-300"
                            }`}
                          >
                            <div
                              style={{
                                background: tpl.previewBg,
                                borderColor: tpl.previewAccent,
                              }}
                              className="h-10 w-14 flex-shrink-0 rounded-lg border-2 shadow-inner"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 text-xs truncate">
                                {tpl.name}
                              </div>
                              <div className="text-[10px] text-slate-500 line-clamp-1">
                                {tpl.tagline}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Artwork Upload */}
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <div className="font-fortnite text-sm text-blue-950 uppercase tracking-wide">
                      Custom Background Artwork
                    </div>
                    <button
                      onClick={() => bgFileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 py-2.5 font-semibold text-blue-700 hover:bg-blue-50 transition"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Canva / Custom BG</span>
                    </button>
                    {certConfig.backgroundDataUrl && (
                      <button
                        onClick={() => updateCertBackground("")}
                        className="w-full text-[11px] text-rose-600 font-semibold hover:underline"
                      >
                        Remove Uploaded Background
                      </button>
                    )}
                  </div>

                  {/* Background Color & Frame Border */}
                  <div className="space-y-2.5 border-t border-slate-100 pt-3">
                    <div className="font-fortnite text-sm text-blue-950 uppercase tracking-wide">
                      Canvas Color & Frame
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-600 font-medium">Canvas Fill</span>
                      <input
                        type="color"
                        value={certConfig.backgroundColor || "#ffffff"}
                        onChange={(e) =>
                          updateCertConfig({
                            backgroundColor: e.target.value,
                            backgroundGradient: "",
                            backgroundDataUrl: "",
                          })
                        }
                        className="h-7 w-10 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] text-slate-600 font-medium">Border Style</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {BORDER_OPTIONS.map((b) => (
                          <button
                            key={b.id}
                            onClick={() => updateCertConfig({ borderStyle: b.id })}
                            className={`rounded-lg px-2 py-1.5 text-[11px] font-semibold border transition ${
                              (certConfig.borderStyle || "modern_accent") === b.id
                                ? "border-blue-600 bg-blue-50 text-blue-700"
                                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
                            }`}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-600 font-medium">Border Accent</span>
                      <input
                        type="color"
                        value={certConfig.borderColor || "#2563eb"}
                        onChange={(e) => updateCertConfig({ borderColor: e.target.value })}
                        className="h-7 w-10 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COLLEGE LOGOS, SIGNATURES, SEALS & SHAPES */}
              {leftTab === "assets" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-fortnite text-sm text-blue-950 uppercase tracking-wide">
                      Upload Logos & Signatures
                    </div>
                    <button
                      onClick={() => logoFileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 transition shadow-sm"
                    >
                      <ImagePlus className="h-4 w-4" />
                      <span>+ UPLOAD COLLEGE LOGO</span>
                    </button>
                    <button
                      onClick={() => sigFileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50/70 py-2 font-semibold text-blue-800 hover:bg-blue-100 transition"
                    >
                      <PenTool className="h-3.5 w-3.5" />
                      <span>+ Upload Dean / HOD Signature PNG</span>
                    </button>
                  </div>

                  {/* Built-in Vector Seals & Crests */}
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <div className="font-fortnite text-sm text-blue-950 uppercase tracking-wide">
                      Vector Seals & Crests
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAddBadge("gold_seal", "Gold Excellence Seal", "#d97706")}
                        className="rounded-xl border border-amber-200 bg-amber-50/60 p-2.5 text-center font-semibold text-amber-900 hover:bg-amber-100/70 transition"
                      >
                        Gold Seal
                      </button>
                      <button
                        onClick={() => handleAddBadge("blue_crest", "College Blue Crest", "#2563eb")}
                        className="rounded-xl border border-blue-200 bg-blue-50/60 p-2.5 text-center font-semibold text-blue-900 hover:bg-blue-100/70 transition"
                      >
                        Blue Crest
                      </button>
                      <button
                        onClick={() => handleAddBadge("star_ribbon", "Honor Star Crest", "#059669")}
                        className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-2.5 text-center font-semibold text-emerald-900 hover:bg-emerald-100/70 transition"
                      >
                        Star Crest
                      </button>
                      <button
                        onClick={() => handleAddBadge("verified_stamp", "Verified Stamp", "#0284c7")}
                        className="rounded-xl border border-sky-200 bg-sky-50/60 p-2.5 text-center font-semibold text-sky-900 hover:bg-sky-100/70 transition"
                      >
                        Verified Stamp
                      </button>
                    </div>
                  </div>

                  {/* Shapes, Dividers & QR Code */}
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <div className="font-fortnite text-sm text-blue-950 uppercase tracking-wide">
                      Shapes, Dividers & QR
                    </div>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => handleAddShape("line", "Accent Divider Line", 40, 0.4)}
                        className="w-full flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-700 hover:bg-white hover:border-blue-300 transition"
                      >
                        <Minus className="h-3.5 w-3.5 text-blue-600" />
                        <span>Add Accent Divider Line</span>
                      </button>
                      <button
                        onClick={() => handleAddShape("pill", "Header Accent Ribbon", 28, 3.8)}
                        className="w-full flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-700 hover:bg-white hover:border-blue-300 transition"
                      >
                        <Square className="h-3.5 w-3.5 text-blue-600" />
                        <span>Add Pill Banner Shape</span>
                      </button>
                      <button
                        onClick={handleAddQrLayer}
                        className="w-full flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-700 hover:bg-white hover:border-blue-300 transition"
                      >
                        <QrCode className="h-3.5 w-3.5 text-blue-600" />
                        <span>Add / Focus Verification QR</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TEXT & DYNAMIC REGISTRATION VARIABLES */}
              {leftTab === "text" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-fortnite text-sm text-blue-950 uppercase tracking-wide">
                      Add Text Elements
                    </div>
                    <button
                      onClick={() => handleAddTextPreset("Custom Heading", "CERTIFICATE TITLE", 46, "800")}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left hover:bg-blue-50 hover:border-blue-300 transition"
                    >
                      <div className="font-fortnite text-base text-blue-950 uppercase">
                        + Add a Heading
                      </div>
                    </button>
                    <button
                      onClick={() =>
                        handleAddTextPreset("Custom Subheading", "Awarded for Outstanding Innovation", 24, "600")
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left hover:bg-blue-50 hover:border-blue-300 transition"
                    >
                      <div className="font-bold text-slate-800 text-xs">+ Add a Subheading</div>
                    </button>
                    <button
                      onClick={() =>
                        handleAddTextPreset("Body Text", "Organized by Department of CSE, NIT", 16, "500")
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left hover:bg-blue-50 hover:border-blue-300 transition"
                    >
                      <div className="text-slate-600 text-[11px]">+ Add Body / Citation Line</div>
                    </button>
                  </div>

                  {/* Dynamic Auto-Replace Registration Variables */}
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <div className="font-fortnite text-sm text-blue-950 uppercase tracking-wide">
                      Auto-Merge Student Fields
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      These fields automatically change for every student when you click <strong>Generate All</strong>!
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {VARIABLE_TOKENS.map((v) => (
                        <button
                          key={v.token}
                          onClick={() =>
                            handleAddTextPreset(
                              v.label,
                              v.token,
                              v.token === "{{participant_name}}" ? 60 : 20,
                              "700",
                              v.token === "{{participant_name}}" ? "name" : "custom_text"
                            )
                          }
                          className="rounded-lg border border-blue-200 bg-blue-50/70 px-2.5 py-1.5 text-[11px] font-semibold text-blue-800 hover:bg-blue-100 transition"
                        >
                          + {v.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: LAYERS MANAGER */}
              {leftTab === "layers" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-fortnite text-sm text-blue-950 uppercase tracking-wide">
                      Canvas Layers ({certConfig.elements.length})
                    </span>
                    <span className="text-[10px] text-slate-400">Top to bottom</span>
                  </div>

                  <div className="space-y-1.5">
                    {[...certConfig.elements].reverse().map((el) => {
                      const isSelected = el.id === selectedElementId;
                      return (
                        <div
                          key={el.id}
                          onClick={() => setSelectedElementId(el.id)}
                          className={`flex items-center justify-between gap-1.5 rounded-xl border px-2.5 py-2 cursor-pointer transition ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/70"
                              : "border-slate-200 bg-white hover:border-blue-300"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-slate-800 text-[11px] truncate">
                              {el.label}
                            </div>
                            <div className="text-[9px] uppercase text-slate-400 font-mono">
                              {getElementKind(el)}
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                reorderCertElement(el.id, "up");
                              }}
                              title="Bring Forward"
                              className="p-1 text-slate-400 hover:text-blue-600"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                reorderCertElement(el.id, "down");
                              }}
                              title="Send Backward"
                              className="p-1 text-slate-400 hover:text-blue-600"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateCertElement(el.id, { enabled: !el.enabled });
                              }}
                              title={el.enabled ? "Hide Layer" : "Show Layer"}
                              className="p-1 text-slate-400 hover:text-blue-600"
                            >
                              {el.enabled ? (
                                <Eye className="h-3 w-3" />
                              ) : (
                                <EyeOff className="h-3 w-3 text-slate-300" />
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCertElement(el.id);
                                if (selectedElementId === el.id) setSelectedElementId(null);
                              }}
                              title="Delete Layer"
                              className="p-1 text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CENTER STAGE: INTERACTIVE CANVA ARTBOARD — 6 Cols */}
          <div className="lg:col-span-6 space-y-3">
            {/* Top Mini Canvas Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-blue-100 bg-white px-3.5 py-2 text-xs shadow-sm">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSnapEnabled(!snapEnabled)}
                  title="Magnetic Center Snapping"
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                    snapEnabled
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Magnet className="h-3 w-3" />
                  <span>Snap</span>
                </button>
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  title="Toggle Design Grid"
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                    showGrid
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Grid className="h-3 w-3" />
                  <span>Grid</span>
                </button>
                {selectedElement && (
                  <button
                    onClick={() => updateCertElement(selectedElement.id, { xPercent: 50 })}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                  >
                    Center H
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleDownloadSamplePng}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                >
                  <FileImage className="h-3 w-3" />
                  <span>Sample PNG</span>
                </button>
                <button
                  onClick={handleDownloadSampleSvg}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                >
                  <Download className="h-3 w-3" />
                  <span>Sample SVG</span>
                </button>
              </div>
            </div>

            {/* Interactive Certificate Artboard */}
            <div className="rounded-2xl border border-slate-200 bg-slate-200/70 p-2.5 sm:p-4 shadow-inner">
              <div className="rounded-xl overflow-hidden shadow-xl ring-1 ring-slate-900/10 bg-white">
                <CertificateCanvasRenderer
                  config={certConfig}
                  recipient={previewRecipient}
                  eventTitle={eventTitle}
                  interactive={true}
                  selectedElementId={selectedElementId}
                  onSelectElement={setSelectedElementId}
                  onUpdateElement={updateCertElement}
                  showGrid={showGrid}
                  snapEnabled={snapEnabled}
                />
              </div>
            </div>

            {/* Live Student Preview Scrubber + Quick 50-Student Test Loader */}
            <div className="rounded-2xl border border-blue-100 bg-white p-3.5 shadow-sm space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-lg bg-blue-50 border border-blue-200 px-2 py-0.5 font-fortnite text-xs text-blue-700 uppercase">
                    LIVE SAMPLE PREVIEW
                  </span>
                  <span className="font-semibold text-slate-800 truncate max-w-[230px] sm:max-w-xs">
                    {previewRecipient
                      ? `${previewRecipient.name} (${previewRecipient.collegeName})`
                      : "No recipients loaded"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={() => setPreviewIdx(Math.max(0, safePreviewIdx - 1))}
                    disabled={safePreviewIdx === 0}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-700 hover:bg-blue-50 disabled:opacity-40 transition"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-mono text-[11px] font-bold text-slate-600 px-1">
                    {allRecipients.length > 0 ? safePreviewIdx + 1 : 0} / {allRecipients.length}
                  </span>
                  <button
                    onClick={() =>
                      setPreviewIdx(Math.min(allRecipients.length - 1, safePreviewIdx + 1))
                    }
                    disabled={safePreviewIdx >= allRecipients.length - 1}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-700 hover:bg-blue-50 disabled:opacity-40 transition"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <span className="text-slate-500">
                  Drag any element directly on canvas. Step through students to verify auto-scaling.
                </span>

                {allRecipients.length < 50 && (
                  <button
                    onClick={handleLoad50DemoStudents}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 font-bold text-blue-700 hover:bg-blue-100 transition"
                  >
                    <Users className="h-3 w-3" />
                    <span>+ Load 50 Registered Students (Demo)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: CONTEXT-AWARE ELEMENT INSPECTOR — 3 Cols */}
          <div className="lg:col-span-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm space-y-4 text-xs max-h-[680px] overflow-y-auto">
            {!selectedElement ? (
              <div className="py-12 text-center space-y-2 text-slate-400">
                <Sliders className="h-7 w-7 mx-auto text-slate-300" />
                <div className="font-fortnite text-base text-blue-950 uppercase">
                  SELECT AN ELEMENT
                </div>
                <p className="text-[11px] text-slate-500">
                  Click any text, logo, seal, or divider on the canvas to edit its font, size, color, or position.
                </p>
              </div>
            ) : (
              <>
                {/* Selected Element Header + Quick Actions */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="min-w-0">
                    <div className="font-fortnite text-base text-blue-950 uppercase tracking-wide truncate">
                      {selectedElement.label}
                    </div>
                    <div className="text-[10px] font-mono uppercase text-blue-600 font-bold">
                      {selectedKind} Layer
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        updateCertElement(selectedElement.id, {
                          locked: !selectedElement.locked,
                        })
                      }
                      title={selectedElement.locked ? "Unlock" : "Lock"}
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
                    >
                      {selectedElement.locked ? (
                        <Lock className="h-3.5 w-3.5 text-amber-600" />
                      ) : (
                        <Unlock className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        const copyId = duplicateCertElement(selectedElement.id);
                        if (copyId) setSelectedElementId(copyId);
                      }}
                      title="Duplicate Layer"
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        deleteCertElement(selectedElement.id);
                        setSelectedElementId(null);
                      }}
                      title="Delete Layer"
                      className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* TEXT INSPECTOR CONTROLS */}
                {(selectedKind === "text" || selectedKind === "qr") && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-600 font-semibold">
                        Text Content / Variable
                      </label>
                      <input
                        type="text"
                        value={selectedElement.text}
                        onChange={(e) =>
                          updateCertElement(selectedElement.id, { text: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
                      />
                      {/* Quick insert variable tokens */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {VARIABLE_TOKENS.slice(0, 5).map((v) => (
                          <button
                            key={v.token}
                            type="button"
                            onClick={() =>
                              updateCertElement(selectedElement.id, {
                                text: `${selectedElement.text} ${v.token}`.trim(),
                              })
                            }
                            className="rounded bg-blue-50 border border-blue-200 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 hover:bg-blue-100"
                          >
                            +{v.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedKind === "text" && (
                      <>
                        {/* Font Family */}
                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-600 font-semibold">
                            Font Family
                          </label>
                          <select
                            value={selectedElement.fontFamily}
                            onChange={(e) =>
                              updateCertElement(selectedElement.id, {
                                fontFamily: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
                          >
                            {FONT_OPTIONS.map((f) => (
                              <option key={f.value} value={f.value}>
                                {f.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Font Size */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-600">
                            <span className="font-semibold">Font Size</span>
                            <span className="font-fortnite text-sm text-blue-600">
                              {selectedElement.fontSize}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min={12}
                            max={96}
                            value={selectedElement.fontSize}
                            onChange={(e) =>
                              updateCertElement(selectedElement.id, {
                                fontSize: Number(e.target.value),
                              })
                            }
                            className="w-full accent-blue-600 cursor-pointer"
                          />
                        </div>

                        {/* Style Buttons: Bold, Italic, Uppercase, Align */}
                        <div className="flex items-center justify-between gap-1 pt-1">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                updateCertElement(selectedElement.id, {
                                  fontWeight:
                                    Number(selectedElement.fontWeight) >= 700 ? "400" : "700",
                                })
                              }
                              className={`rounded-lg border p-1.5 ${
                                Number(selectedElement.fontWeight) >= 700
                                  ? "border-blue-600 bg-blue-50 text-blue-700"
                                  : "border-slate-200 text-slate-600"
                              }`}
                            >
                              <Bold className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                updateCertElement(selectedElement.id, {
                                  fontStyle:
                                    selectedElement.fontStyle === "italic"
                                      ? "normal"
                                      : "italic",
                                })
                              }
                              className={`rounded-lg border p-1.5 ${
                                selectedElement.fontStyle === "italic"
                                  ? "border-blue-600 bg-blue-50 text-blue-700"
                                  : "border-slate-200 text-slate-600"
                              }`}
                            >
                              <Italic className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                updateCertElement(selectedElement.id, {
                                  textTransform:
                                    selectedElement.textTransform === "uppercase"
                                      ? "none"
                                      : "uppercase",
                                })
                              }
                              className={`rounded-lg border px-2 py-1 text-[10px] font-bold ${
                                selectedElement.textTransform === "uppercase"
                                  ? "border-blue-600 bg-blue-50 text-blue-700"
                                  : "border-slate-200 text-slate-600"
                              }`}
                            >
                              AA
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            {(["left", "center", "right"] as const).map((al) => {
                              const Icon =
                                al === "left"
                                  ? AlignLeft
                                  : al === "right"
                                  ? AlignRight
                                  : AlignCenter;
                              return (
                                <button
                                  key={al}
                                  onClick={() =>
                                    updateCertElement(selectedElement.id, { textAlign: al })
                                  }
                                  className={`rounded-lg border p-1.5 ${
                                    (selectedElement.textAlign || "center") === al
                                      ? "border-blue-600 bg-blue-50 text-blue-700"
                                      : "border-slate-200 text-slate-600"
                                  }`}
                                >
                                  <Icon className="h-3.5 w-3.5" />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Letter Spacing */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-600">
                            <span className="font-semibold">Letter Spacing</span>
                            <span className="font-mono text-blue-600 font-bold">
                              {selectedElement.letterSpacing || 0}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={12}
                            step={0.5}
                            value={selectedElement.letterSpacing || 0}
                            onChange={(e) =>
                              updateCertElement(selectedElement.id, {
                                letterSpacing: Number(e.target.value),
                              })
                            }
                            className="w-full accent-blue-600 cursor-pointer"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* IMAGE / LOGO INSPECTOR CONTROLS */}
                {selectedKind === "image" && (
                  <div className="space-y-3">
                    <button
                      onClick={() => replaceImgInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 py-2 font-semibold text-blue-800 hover:bg-blue-100 transition"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Replace Logo / Image</span>
                    </button>

                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-600 font-semibold">
                        Quick Corner Place
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { label: "Top Left", x: 13, y: 16 },
                          { label: "Top Center", x: 50, y: 12 },
                          { label: "Top Right", x: 87, y: 16 },
                          { label: "Bottom Right", x: 80, y: 78 },
                        ].map((pos) => (
                          <button
                            key={pos.label}
                            onClick={() =>
                              updateCertElement(selectedElement.id, {
                                xPercent: pos.x,
                                yPercent: pos.y,
                              })
                            }
                            className="rounded-lg border border-slate-200 bg-slate-50 py-1 text-[10px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-600">
                          <span>Width</span>
                          <span className="font-mono font-bold text-blue-600">
                            {selectedElement.widthPercent || 12}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={4}
                          max={45}
                          value={selectedElement.widthPercent || 12}
                          onChange={(e) =>
                            updateCertElement(selectedElement.id, {
                              widthPercent: Number(e.target.value),
                            })
                          }
                          className="w-full accent-blue-600"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-600">
                          <span>Height</span>
                          <span className="font-mono font-bold text-blue-600">
                            {selectedElement.heightPercent || 14}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={4}
                          max={45}
                          value={selectedElement.heightPercent || 14}
                          onChange={(e) =>
                            updateCertElement(selectedElement.id, {
                              heightPercent: Number(e.target.value),
                            })
                          }
                          className="w-full accent-blue-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Corner Rounding</span>
                        <span className="font-mono font-bold text-blue-600">
                          {(selectedElement.borderRadius || 0) >= 90
                            ? "Circle"
                            : `${selectedElement.borderRadius || 0}px`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={selectedElement.borderRadius || 0}
                        onChange={(e) =>
                          updateCertElement(selectedElement.id, {
                            borderRadius: Number(e.target.value),
                          })
                        }
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>
                )}

                {/* BADGE / SEAL INSPECTOR CONTROLS */}
                {selectedKind === "badge" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-600 font-semibold">Seal Style</label>
                      <select
                        value={selectedElement.badgeStyle || "blue_crest"}
                        onChange={(e) =>
                          updateCertElement(selectedElement.id, {
                            badgeStyle: e.target.value as CertificateBadgeStyle,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-900"
                      >
                        <option value="gold_seal">Gold Excellence Seal</option>
                        <option value="blue_crest">Blue Academic Crest</option>
                        <option value="star_ribbon">Star Honor Ribbon</option>
                        <option value="verified_stamp">Official Verified Stamp</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Seal Size</span>
                        <span className="font-mono font-bold text-blue-600">
                          {selectedElement.widthPercent || 10}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={28}
                        value={selectedElement.widthPercent || 10}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          updateCertElement(selectedElement.id, {
                            widthPercent: v,
                            heightPercent: Math.round(v * 1.35),
                          });
                        }}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>
                )}

                {/* SHAPE / DIVIDER INSPECTOR CONTROLS */}
                {selectedKind === "shape" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Width</span>
                        <span className="font-mono font-bold text-blue-600">
                          {selectedElement.widthPercent || 40}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={90}
                        value={selectedElement.widthPercent || 40}
                        onChange={(e) =>
                          updateCertElement(selectedElement.id, {
                            widthPercent: Number(e.target.value),
                          })
                        }
                        className="w-full accent-blue-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Thickness</span>
                        <span className="font-mono font-bold text-blue-600">
                          {selectedElement.heightPercent || 0.4}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.2}
                        max={12}
                        step={0.2}
                        value={selectedElement.heightPercent || 0.4}
                        onChange={(e) =>
                          updateCertElement(selectedElement.id, {
                            heightPercent: Number(e.target.value),
                          })
                        }
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>
                )}

                {/* COLOR PICKER (for Text, Badge, Shape, QR) */}
                {selectedKind !== "image" && (
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <label className="text-[11px] text-slate-600 font-semibold flex items-center gap-1">
                      <Palette className="h-3 w-3 text-blue-600" />
                      <span>Color</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {COLOR_SWATCHES.map((hex) => (
                        <button
                          key={hex}
                          onClick={() => updateCertElement(selectedElement.id, { color: hex })}
                          style={{ backgroundColor: hex }}
                          className={`h-5 w-5 rounded-full border shadow-sm transition ${
                            selectedElement.color.toLowerCase() === hex
                              ? "ring-2 ring-blue-600 ring-offset-1"
                              : "border-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedElement.color}
                        onChange={(e) =>
                          updateCertElement(selectedElement.id, { color: e.target.value })
                        }
                        className="h-8 w-10 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
                      />
                      <input
                        type="text"
                        value={selectedElement.color}
                        onChange={(e) =>
                          updateCertElement(selectedElement.id, { color: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-xs text-slate-900"
                      />
                    </div>
                  </div>
                )}

                {/* POSITION, OPACITY & ROTATION (ALL LAYERS) */}
                <div className="space-y-2.5 border-t border-slate-100 pt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>X Pos</span>
                        <span className="font-mono font-bold text-blue-600">
                          {selectedElement.xPercent}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={3}
                        max={97}
                        step={0.5}
                        value={selectedElement.xPercent}
                        onChange={(e) =>
                          updateCertElement(selectedElement.id, {
                            xPercent: Number(e.target.value),
                          })
                        }
                        className="w-full accent-blue-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Y Pos</span>
                        <span className="font-mono font-bold text-blue-600">
                          {selectedElement.yPercent}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={3}
                        max={97}
                        step={0.5}
                        value={selectedElement.yPercent}
                        onChange={(e) =>
                          updateCertElement(selectedElement.id, {
                            yPercent: Number(e.target.value),
                          })
                        }
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Opacity</span>
                        <span className="font-mono font-bold text-blue-600">
                          {Math.round((selectedElement.opacity ?? 1) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={Math.round((selectedElement.opacity ?? 1) * 100)}
                        onChange={(e) =>
                          updateCertElement(selectedElement.id, {
                            opacity: Number(e.target.value) / 100,
                          })
                        }
                        className="w-full accent-blue-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Rotate</span>
                        <span className="font-mono font-bold text-blue-600">
                          {selectedElement.rotation || 0}°
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-45}
                        max={45}
                        value={selectedElement.rotation || 0}
                        onChange={(e) =>
                          updateCertElement(selectedElement.id, {
                            rotation: Number(e.target.value),
                          })
                        }
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* PARTICIPANT ROSTER & BULK IMPORT MODAL */}
      {isRosterModalOpen && (
        <div
          onClick={() => setIsRosterModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-blue-100 bg-white p-6 shadow-2xl space-y-5 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-fortnite text-2xl text-blue-950 uppercase tracking-wide flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  CERTIFICATE RECIPIENT ROSTER ({allRecipients.length})
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Automatically synced with event registrations. Add 50 demo students or paste/upload a CSV list.
                </p>
              </div>
              <button
                onClick={() => setIsRosterModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick 1-Click 50 Student Loader & CSV Upload */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleLoad50DemoStudents}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 transition shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>LOAD 50 REGISTERED PARTICIPANTS (DEMO)</span>
              </button>

              <button
                onClick={() => csvFileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 font-semibold text-blue-800 hover:bg-blue-100 transition"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Upload CSV File</span>
              </button>

              {(customRecipients[eventId]?.length || 0) > 0 && (
                <button
                  onClick={() => {
                    clearCustomRecipients(eventId);
                    setPreviewIdx(0);
                  }}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 font-semibold text-rose-700 hover:bg-rose-100 transition"
                >
                  Clear Imported
                </button>
              )}
            </div>

            {/* Paste Student Names / CSV Box */}
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="font-bold text-slate-700">
                Paste Student Names (1 per line, or CSV: Name, Team, College, Award)
              </label>
              <textarea
                rows={4}
                value={csvPasteText}
                onChange={(e) => setCsvPasteText(e.target.value)}
                placeholder={"Aarav Sharma, Team Alpha, IIT Madras, 1st Place Winner\nPriya Nair, CodePulse, NIT Trichy, Certificate of Participation\nVikram Patel"}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-[11px] text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleImportCsvText}
                  disabled={!csvPasteText.trim()}
                  className="rounded-xl bg-blue-950 px-4 py-1.5 font-fortnite text-xs tracking-wide text-white hover:bg-blue-800 disabled:opacity-40 transition"
                >
                  + ADD PASTED PARTICIPANTS
                </button>
              </div>
            </div>

            {/* Live Merged Recipients Preview Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">
                  Ready for Bulk Generation ({allRecipients.length} Students)
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Unique SHA-256 IDs assigned
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-[11px]">
                  <thead className="sticky top-0 bg-slate-100 text-[10px] font-bold uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">Student Name</th>
                      <th className="px-3 py-2">Team & College</th>
                      <th className="px-3 py-2">Cert ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {allRecipients.map((r, i) => (
                      <tr key={r.id} className="hover:bg-blue-50/40">
                        <td className="px-3 py-2 font-mono text-slate-400">{i + 1}</td>
                        <td className="px-3 py-2 font-bold text-slate-900">{r.name}</td>
                        <td className="px-3 py-2 text-slate-600">
                          {r.teamName} • {r.collegeName}
                        </td>
                        <td className="px-3 py-2 font-mono text-blue-600 font-semibold">
                          {r.certificateCode}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setIsRosterModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsRosterModalOpen(false);
                  handleGenerateAllCertificates();
                }}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 shadow-sm"
              >
                <Wand2 className="h-4 w-4" />
                <span>GENERATE ALL {allRecipients.length} CERTIFICATES</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
