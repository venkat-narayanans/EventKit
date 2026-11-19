"use client";

import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { useStore } from "@/lib/store";
import {
  QrCode,
  X,
  Copy,
  Check,
  Download,
  ExternalLink,
  Printer,
  Sparkles,
  MapPin,
  Calendar,
  Trophy,
  Users,
  CreditCard,
  Share2,
  Smartphone,
  Layers,
  FileText,
} from "lucide-react";

interface EventRegistrationQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEventId?: string | null;
}

export const EventRegistrationQrModal: React.FC<EventRegistrationQrModalProps> = ({
  isOpen,
  onClose,
  initialEventId = null,
}) => {
  const { events } = useStore();

  // "all" = General Fest Portal; otherwise specific event ID
  const [selectedTarget, setSelectedTarget] = useState<string>("all");
  const [modalTab, setModalTab] = useState<"qr" | "poster">("qr");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrSvg, setQrSvg] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync initial event id when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialEventId && events.some((e) => e.id === initialEventId)) {
        setSelectedTarget(initialEventId);
      } else {
        setSelectedTarget("all");
      }
      setModalTab("qr");
      setIsCopied(false);
    }
  }, [isOpen, initialEventId, events]);

  const selectedEvent =
    selectedTarget !== "all"
      ? events.find((e) => e.id === selectedTarget) || null
      : null;

  // Build target URL
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "http://localhost:3000";

  const targetUrl =
    selectedTarget === "all"
      ? `${origin}/?view=portal`
      : `${origin}/?view=portal&event=${selectedTarget}`;

  // Generate QR code whenever targetUrl changes
  useEffect(() => {
    let isCancelled = false;
    setIsGenerating(true);

    const generateCodes = async () => {
      try {
        const [dataUrl, svg] = await Promise.all([
          QRCode.toDataURL(targetUrl, {
            width: 800,
            margin: 2,
            color: {
              dark: "#0f172a", // Deep slate
              light: "#ffffff",
            },
            errorCorrectionLevel: "H",
          }),
          QRCode.toString(targetUrl, {
            type: "svg",
            margin: 2,
            color: {
              dark: "#0f172a",
              light: "#ffffff",
            },
            errorCorrectionLevel: "H",
          }),
        ]);

        if (!isCancelled) {
          setQrDataUrl(dataUrl);
          setQrSvg(svg);
          setIsGenerating(false);
        }
      } catch (err) {
        console.error("Failed to generate QR code", err);
        if (!isCancelled) {
          setIsGenerating(false);
        }
      }
    };

    generateCodes();

    return () => {
      isCancelled = true;
    };
  }, [targetUrl]);

  // Copy link handler
  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(targetUrl);
      } else {
        const el = document.createElement("textarea");
        el.value = targetUrl;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  // Download PNG handler
  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    const filename =
      selectedTarget === "all"
        ? "festra-all-events-registration-qr.png"
        : `festra-qr-${selectedEvent?.id || "event"}.png`;
    a.href = qrDataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download SVG handler
  const handleDownloadSvg = () => {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const filename =
      selectedTarget === "all"
        ? "festra-all-events-registration-qr.svg"
        : `festra-qr-${selectedEvent?.id || "event"}.svg`;
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Direct print handler for A4 poster
  const handlePrintPoster = () => {
    window.print();
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "";
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Modal Card */}
      <div className="relative w-full max-w-3xl rounded-3xl border border-blue-100 bg-white p-5 sm:p-7 shadow-2xl z-10 space-y-5 my-8 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-blue-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/20">
                <QrCode className="h-4 w-4" />
              </div>
              <span className="font-fortnite text-xs uppercase tracking-wider text-blue-600">
                CAMPUS REGISTRATION QR ENGINE
              </span>
            </div>
            <h2 className="font-fortnite text-2xl sm:text-3xl text-blue-950 uppercase tracking-wide">
              GENERATE REGISTRATION QR
            </h2>
            <p className="text-xs text-slate-500">
              Students scan this QR code with any mobile camera to explore all available events, inspect guidelines & schedule, and register.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Target Scope Selection & Tab Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="flex-1 space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <span>QR Destination:</span>
            </label>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="all">
                🌐 All Available Events (General Fest Portal)
              </option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  🎯 Specific Track: {ev.title} ({ev.category.replace("_", " ")})
                </option>
              ))}
            </select>
          </div>

          {/* View Tab Toggle: QR Digital vs Printable A4 Poster */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 text-xs self-stretch sm:self-end">
            <button
              onClick={() => setModalTab("qr")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition ${
                modalTab === "qr"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>Digital QR & Link</span>
            </button>
            <button
              onClick={() => setModalTab("poster")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition ${
                modalTab === "poster"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print A4 Standee</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DIGITAL QR & LINK HUB */}
        {modalTab === "qr" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Column: Big Scannable QR Code */}
            <div className="md:col-span-5 flex flex-col items-center justify-center space-y-3 p-5 rounded-2xl border border-blue-100 bg-blue-50/40 text-center">
              <div className="relative rounded-2xl bg-white p-3.5 shadow-md border border-slate-200/80 group">
                {isGenerating ? (
                  <div className="h-52 w-52 sm:h-56 sm:w-56 flex items-center justify-center text-xs text-slate-400">
                    Generating high-res QR...
                  </div>
                ) : qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrDataUrl}
                    alt="Registration QR Code"
                    className="h-52 w-52 sm:h-56 sm:w-56 object-contain rounded-lg"
                  />
                ) : null}

                {/* Center Badge Accent */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="h-10 w-10 rounded-xl bg-white shadow-lg border border-blue-200 flex items-center justify-center">
                    <div className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-fortnite text-sm">
                      F
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 font-fortnite text-xs uppercase tracking-wide text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full border border-blue-200">
                  <Smartphone className="h-3 w-3" />
                  <span>Scan to Register</span>
                </span>
                <p className="text-[11px] text-slate-500 pt-1">
                  Works on iOS Camera, Google Lens, and WhatsApp Scanner
                </p>
              </div>
            </div>

            {/* Right Column: Destination Info, Live URL & Export Buttons */}
            <div className="md:col-span-7 space-y-4">
              {/* Destination Card Summary */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Target Destination
                  </span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active & Live
                  </span>
                </div>

                <div className="font-fortnite text-lg sm:text-xl text-blue-950 uppercase leading-snug">
                  {selectedTarget === "all"
                    ? "Fest Portal: All Available Events & Tracks"
                    : selectedEvent?.title}
                </div>

                {selectedEvent ? (
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 border-t border-slate-100 pt-2 font-medium">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                      <span className="truncate">{selectedEvent.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                      <span className="truncate">{formatDate(selectedEvent.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Trophy className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                      <span className="truncate">Prize: {selectedEvent.prizes.pool}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <CreditCard className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">
                        {selectedEvent.isPaid ? `₹${selectedEvent.ticketPrice} / Squad` : "FREE Entry"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Students will see all <strong>{events.length} active campus event tracks</strong>, choose their preferred category, and proceed to squad registration.
                  </p>
                )}
              </div>

              {/* URL Display with 1-Click Copy */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Registration URL Link
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 truncate rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700 select-all">
                    {targetUrl}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center gap-1 rounded-xl px-3.5 py-2 text-xs font-bold transition min-h-[36px] shadow-sm ${
                      isCopied
                        ? "bg-emerald-600 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button
                  onClick={handleDownloadPng}
                  disabled={!qrDataUrl}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition min-h-[38px]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PNG</span>
                </button>

                <button
                  onClick={handleDownloadSvg}
                  disabled={!qrSvg}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 hover:border-blue-300 transition min-h-[38px]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Vector SVG</span>
                </button>

                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 hover:border-blue-300 transition min-h-[38px]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Test Link</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRINTABLE A4 STANDEE / NOTICE BOARD POSTER PREVIEW */}
        {modalTab === "poster" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-fortnite text-lg text-blue-950 uppercase tracking-wide">
                  A4 NOTICE BOARD POSTER & DESK STANDEE
                </h3>
                <p className="text-xs text-slate-500">
                  Ready to print or save as PDF. Pin on college notice boards, WhatsApp class groups, or reception desks.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintPoster}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 transition shadow-sm shadow-blue-500/20 min-h-[36px]"
                >
                  <Printer className="h-4 w-4" />
                  <span>PRINT / SAVE PDF</span>
                </button>
                <button
                  onClick={handleDownloadPng}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition min-h-[36px]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download QR</span>
                </button>
              </div>
            </div>

            {/* Poster Canvas Preview */}
            <div className="flex justify-center p-2 sm:p-4 bg-slate-100/70 rounded-2xl overflow-x-auto">
              <div
                id="festra-printable-poster"
                className="w-full max-w-lg bg-white rounded-3xl border-2 border-blue-600 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden text-center"
              >
                {/* Decorative Top Bar */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600" />

                {/* Fest Brand Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-fortnite text-xl shadow-sm">
                      F
                    </div>
                    <div className="text-left">
                      <div className="font-fortnite text-xl text-blue-950 uppercase leading-none">
                        FESTRA 2026
                      </div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-blue-600">
                        CAMPUS EVENT SYSTEM
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full px-3 py-1 text-[10px] font-fortnite uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                    OFFICIAL PASS
                  </span>
                </div>

                {/* Event Title Banner */}
                <div className="space-y-1.5 pt-1">
                  <span className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {selectedEvent ? selectedEvent.category.replace("_", " ") : "COLLEGE FEST TRACKS"}
                  </span>
                  <h1 className="font-fortnite text-2xl sm:text-3xl text-blue-950 uppercase tracking-wide leading-tight">
                    {selectedEvent ? selectedEvent.title : "CAMPUS EVENTS & REGISTRATION"}
                  </h1>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    {selectedEvent
                      ? selectedEvent.tagline
                      : "Scan with any phone camera to browse available events, view rules & schedules, and register your team."}
                  </p>
                </div>

                {/* High Impact QR Display */}
                <div className="flex flex-col items-center justify-center space-y-2 py-1">
                  <div className="rounded-2xl border-2 border-dashed border-blue-400 bg-white p-3 shadow-md">
                    {qrDataUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={qrDataUrl}
                        alt="Scan QR"
                        className="h-48 w-48 sm:h-56 sm:w-56 object-contain"
                      />
                    )}
                  </div>
                  <div className="font-fortnite text-sm uppercase tracking-wider text-blue-600">
                    SCAN WITH ANY PHONE CAMERA TO EXPLORE & REGISTER
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 break-all max-w-sm">
                    {targetUrl}
                  </div>
                </div>

                {/* Key Event Details Grid */}
                {selectedEvent ? (
                  <div className="grid grid-cols-2 gap-3 text-left border-t border-b border-slate-100 py-4 text-xs">
                    <div className="space-y-0.5">
                      <div className="text-[9px] uppercase font-bold text-slate-400">Venue</div>
                      <div className="font-semibold text-slate-800 truncate">{selectedEvent.venue}</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[9px] uppercase font-bold text-slate-400">Date</div>
                      <div className="font-semibold text-slate-800 truncate">{formatDate(selectedEvent.startDate)}</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[9px] uppercase font-bold text-slate-400">Prizes</div>
                      <div className="font-bold text-blue-600 font-fortnite text-sm">{selectedEvent.prizes.pool}</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[9px] uppercase font-bold text-slate-400">Registration Fee</div>
                      <div className="font-bold text-emerald-600 font-mono">
                        {selectedEvent.isPaid ? `₹${selectedEvent.ticketPrice} / Squad` : "FREE ENTRY"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-b border-slate-100 py-3 text-xs text-slate-600">
                    <div className="font-bold text-blue-950">
                      {events.length} Tracks Available • Spot Registration • Digital Admit Cards
                    </div>
                  </div>
                )}

                {/* Poster Footer */}
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Powered by Festra Engine</span>
                  <span>Instant Verification</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>High-error-correction QR code optimized for print banners and dim lighting.</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
