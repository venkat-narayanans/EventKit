"use client";

import React, { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { CanvasElement } from "@/types";
import {
  Award,
  Upload,
  Download,
  Sliders,
  Type,
  Palette,
  Eye,
  CheckCircle2,
  Trash2,
  Plus,
  QrCode,
  Share2,
  Layers,
  Sparkles,
} from "lucide-react";
import { calculateAutoFontSize, generateLinkedInCertificateUrl } from "@/lib/certificate";
import { Window } from "@/kit";

export const CertificateDesigner: React.FC = () => {
  const {
    certConfig,
    updateCertElement,
    updateCertBackground,
    events,
    selectedEventId,
  } = useStore();

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const [selectedElementId, setSelectedElementId] = useState<string>("el-name");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedElement = certConfig.elements.find((el) => el.id === selectedElementId) || certConfig.elements[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateCertBackground(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadSvg = () => {
    const nameEl = certConfig.elements.find((el) => el.type === "name");
    const recipient = nameEl ? nameEl.text.replace(/\s+/g, "_") : "certificate";

    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="grad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#18181b"/>
      <stop offset="100%" stop-color="#08080a"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#grad)"/>
  <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#27272a" stroke-width="4"/>
  <rect x="80" y="80" width="1760" height="920" fill="none" stroke="#3770ff" stroke-width="1" stroke-opacity="0.3"/>
  ${certConfig.elements
    .filter((el) => el.enabled)
    .map((el) => {
      const x = (el.xPercent / 100) * 1920;
      const y = (el.yPercent / 100) * 1080;
      const scaledSize = el.fontSize * 2.2;
      return `<text x="${x}" y="${y}" font-family="${el.fontFamily}" font-size="${scaledSize}" font-weight="${el.fontWeight}" fill="${el.color}" text-anchor="middle" dominant-baseline="middle">${el.text}</text>`;
    })
    .join("\n")}
</svg>`.trim();

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Certificate_${recipient}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const linkedInUrl = generateLinkedInCertificateUrl({
    certificateCode: "CF-2026-8921",
    eventName: currentEvent?.title || "HackPulse 2026",
    institutionName: "National Institute of Technology, Trichy",
    issueDate: "2026-11-21",
    verificationUrl: "https://festra.dev/verify/CF-2026-8921",
  });

  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-4">
        <div>
          <h2 className="font-fortnite text-2xl tracking-wide text-blue-950 uppercase flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            BYOD Certificate Designer
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload custom Canva artwork, calibrate dynamic fields, and generate cryptographically verifiable credentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3.5 py-2 font-fortnite text-sm tracking-wide text-blue-900 hover:bg-blue-50 transition shadow-sm min-h-[36px]"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>UPLOAD ARTWORK</span>
          </button>

          <button
            onClick={handleDownloadSvg}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 transition min-h-[36px] shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>DOWNLOAD VECTOR SVG</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* LEFT: Live Interactive Canvas framed in Stageshow macOS Window (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-fortnite text-base text-blue-950 uppercase tracking-wide">Interactive Vector Studio</span>
            <span className="text-[11px] text-slate-500">Click any label to calibrate position</span>
          </div>

          <Window
            chrome="native"
            title="Festra Vector Studio — 1920 × 1080 (300 DPI Edge Render)"
            lights="color"
            className="w-full shadow-lg rounded-2xl overflow-hidden border border-slate-200"
          >
            <div
              className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 select-none"
              style={{
                backgroundImage: certConfig.backgroundDataUrl
                  ? `url(${certConfig.backgroundDataUrl})`
                  : "radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!certConfig.backgroundDataUrl && (
                <div className="pointer-events-none absolute inset-3 sm:inset-4 rounded-xl border border-blue-400/20" />
              )}

              {/* Canvas Dynamic Text Elements */}
              {certConfig.elements
                .filter((el) => el.enabled)
                .map((el) => {
                  const isSelected = el.id === selectedElementId;
                  const computedSize =
                    el.type === "name"
                      ? calculateAutoFontSize(el.text, el.fontSize, 28)
                      : el.fontSize;

                  return (
                    <div
                      key={el.id}
                      onClick={() => setSelectedElementId(el.id)}
                      style={{
                        position: "absolute",
                        left: `${el.xPercent}%`,
                        top: `${el.yPercent}%`,
                        transform: "translate(-50%, -50%)",
                        fontSize: `${computedSize}px`,
                        fontWeight: el.fontWeight,
                        color: el.color,
                        fontFamily: el.fontFamily,
                      }}
                      className={`cursor-pointer transition-all px-2 py-0.5 rounded whitespace-nowrap ${
                        isSelected
                          ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 bg-blue-500/20"
                          : "hover:bg-white/10"
                      }`}
                    >
                      {el.text}
                    </div>
                  );
                })}

              {/* Verifiable QR Code & Security Hash Overlay */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "88%",
                  transform: "translate(-50%, -50%)",
                }}
                className="flex items-center gap-2 rounded-lg bg-blue-950/80 px-2.5 py-1 backdrop-blur-md border border-blue-500/30 text-white"
              >
                <QrCode className="h-4 w-4 text-white" />
                <span className="font-mono text-[9px] text-blue-200">
                  VERIFIED: CF-2026-8921 • SHA-256
                </span>
              </div>
            </div>
          </Window>

          {/* Quick Select Pill Strip */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-500 mr-1 font-medium">Layer:</span>
            {certConfig.elements.map((el) => (
              <button
                key={el.id}
                onClick={() => setSelectedElementId(el.id)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                  el.id === selectedElementId
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:text-blue-900 hover:bg-slate-50"
                }`}
              >
                {el.label}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Typography & Positioning Calibration Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-blue-100 bg-white p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-fortnite text-base text-blue-950 uppercase tracking-wide flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-blue-600" />
                <span>Element Inspector: {selectedElement.label}</span>
              </h3>
              <span className="text-[10px] uppercase font-fortnite text-blue-600">
                {selectedElement.type}
              </span>
            </div>

            {/* Content Text Field */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-700 font-medium">Text Value / Variable</label>
              <input
                type="text"
                value={selectedElement.text}
                onChange={(e) =>
                  updateCertElement(selectedElement.id, { text: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            {/* Position Sliders */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Horizontal (X)</span>
                  <span className="font-fortnite text-blue-600 text-sm">{selectedElement.xPercent}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={selectedElement.xPercent}
                  onChange={(e) =>
                    updateCertElement(selectedElement.id, {
                      xPercent: Number(e.target.value),
                    })
                  }
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Vertical (Y)</span>
                  <span className="font-fortnite text-blue-600 text-sm">{selectedElement.yPercent}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={selectedElement.yPercent}
                  onChange={(e) =>
                    updateCertElement(selectedElement.id, {
                      yPercent: Number(e.target.value),
                    })
                  }
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>
            </div>

            {/* Font Size & Weight */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Font Size</span>
                  <span className="font-fortnite text-blue-600 text-sm">{selectedElement.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="64"
                  value={selectedElement.fontSize}
                  onChange={(e) =>
                    updateCertElement(selectedElement.id, {
                      fontSize: Number(e.target.value),
                    })
                  }
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-700 font-medium">Text Color</label>
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* LinkedIn 1-Click Integration Card */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-fortnite text-sm text-blue-950 uppercase tracking-wide flex items-center gap-1.5">
                  <Share2 className="h-3.5 w-3.5 text-blue-600" />
                  <span>LinkedIn 1-Click Verification</span>
                </span>
                <span className="rounded bg-blue-600 text-white px-2 py-0.5 text-[9px] font-bold uppercase">
                  Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Students can add this certificate straight to their LinkedIn Licenses & Certifications with the official Festra cryptographic verification token.
              </p>
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block w-full rounded-xl bg-blue-600 py-2.5 text-center font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 transition min-h-[34px] shadow-sm"
              >
                TEST "ADD TO LINKEDIN" FLOW
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
