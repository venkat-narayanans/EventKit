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
} from "lucide-react";
import { calculateAutoFontSize, generateLinkedInCertificateUrl } from "@/lib/certificate";

export const CertificateDesigner: React.FC = () => {
  const {
    certConfig,
    updateCertElement,
    updateCertBackground,
    addCertElement,
    deleteCertElement,
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

    // Generate pure standalone SVG with clean vectors
    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="grad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#18181b"/>
      <stop offset="100%" stop-color="#09090b"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#grad)"/>
  <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#27272a" stroke-width="4"/>
  <rect x="80" y="80" width="1760" height="920" fill="none" stroke="#3b82f6" stroke-width="1" stroke-opacity="0.3"/>
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
    eventName: currentEvent?.title || "HackCampus",
    institutionName: "Department of Computer Science & Engineering",
    issueDate: "2026-11-21",
    verificationUrl: "https://festra.dev/verify/CF-2026-8921",
  });

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-blue-400" />
            BYOD Certificate Designer (Bring Your Own Design)
          </h2>
          <p className="text-xs text-zinc-400">
            Upload your college Canva or Photoshop artwork, position dynamic student metadata, and issue vector credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white hover:border-zinc-700 transition"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Custom Design</span>
          </button>

          <button
            onClick={handleDownloadSvg}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Vector SVG</span>
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* LEFT: Live Interactive Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Visual Canvas Preview (16:9)</span>
            <span>Click any text to edit properties</span>
          </div>

          <div
            className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl select-none"
            style={{
              backgroundImage: certConfig.backgroundDataUrl
                ? `url(${certConfig.backgroundDataUrl})`
                : "radial-gradient(circle at 50% 50%, #18181b 0%, #09090b 100%)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Subtle inner framing border if no custom image */}
            {!certConfig.backgroundDataUrl && (
              <div className="pointer-events-none absolute inset-4 rounded-xl border border-zinc-800/80" />
            )}

            {/* Canvas Dynamic Text Elements */}
            {certConfig.elements
              .filter((el) => el.enabled)
              .map((el) => {
                const isSelected = el.id === selectedElementId;
                // Auto font scale for long names
                const displayFontSize =
                  el.type === "name"
                    ? calculateAutoFontSize(el.text, 500, el.fontSize, 20)
                    : el.fontSize;

                return (
                  <div
                    key={el.id}
                    onClick={() => setSelectedElementId(el.id)}
                    className={`absolute cursor-pointer transition-all transform -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-center whitespace-nowrap ${
                      isSelected
                        ? "ring-1 ring-blue-500 bg-blue-500/10"
                        : "hover:bg-white/5"
                    }`}
                    style={{
                      left: `${el.xPercent}%`,
                      top: `${el.yPercent}%`,
                      fontSize: `${displayFontSize}px`,
                      fontFamily: el.fontFamily,
                      color: el.color,
                      fontWeight: el.fontWeight,
                    }}
                  >
                    {el.text}
                  </div>
                );
              })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-zinc-500 font-mono">
              VERIFICATION HASH: 0x7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c
            </span>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Share2 className="h-3 w-3" />
              <span>Preview 1-Click LinkedIn Add Button</span>
            </a>
          </div>
        </div>

        {/* RIGHT: Element Property Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="font-bold text-white text-sm">Element Properties</h3>
              <select
                value={selectedElementId}
                onChange={(e) => setSelectedElementId(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-white focus:outline-none"
              >
                {certConfig.elements.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedElement && (
              <div className="space-y-4">
                <div>
                  <label className="text-zinc-400 font-medium">Text Content</label>
                  <input
                    type="text"
                    value={selectedElement.text}
                    onChange={(e) => updateCertElement(selectedElement.id, { text: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 font-medium">Font Family</label>
                    <select
                      value={selectedElement.fontFamily}
                      onChange={(e) => updateCertElement(selectedElement.id, { fontFamily: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-white focus:outline-none"
                    >
                      <option value="Inter, sans-serif">Modern Sans (Inter)</option>
                      <option value="Georgia, serif">Classic Serif (Georgia)</option>
                      <option value="monospace">Code Monospace</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-400 font-medium">Text Color</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={selectedElement.color}
                        onChange={(e) => updateCertElement(selectedElement.id, { color: e.target.value })}
                        className="h-8 w-8 rounded border border-zinc-800 bg-zinc-950 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={selectedElement.color}
                        onChange={(e) => updateCertElement(selectedElement.id, { color: e.target.value })}
                        className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-white font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium text-zinc-400">
                    <span>Font Size</span>
                    <span className="font-mono text-white">{selectedElement.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    value={selectedElement.fontSize}
                    onChange={(e) => updateCertElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                    className="w-full mt-1 accent-blue-500 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between font-medium text-zinc-400">
                      <span>Horizontal X</span>
                      <span className="font-mono text-white">{selectedElement.xPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={95}
                      value={selectedElement.xPercent}
                      onChange={(e) => updateCertElement(selectedElement.id, { xPercent: Number(e.target.value) })}
                      className="w-full mt-1 accent-blue-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-medium text-zinc-400">
                      <span>Vertical Y</span>
                      <span className="font-mono text-white">{selectedElement.yPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={95}
                      value={selectedElement.yPercent}
                      onChange={(e) => updateCertElement(selectedElement.id, { yPercent: Number(e.target.value) })}
                      className="w-full mt-1 accent-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="element-enabled"
                      checked={selectedElement.enabled}
                      onChange={(e) => updateCertElement(selectedElement.id, { enabled: e.target.checked })}
                      className="rounded accent-blue-600"
                    />
                    <label htmlFor="element-enabled" className="text-zinc-300 font-medium">
                      Show on Certificate
                    </label>
                  </div>

                  {certConfig.backgroundDataUrl && (
                    <button
                      onClick={() => updateCertBackground("")}
                      className="text-[11px] text-zinc-500 hover:text-rose-400"
                    >
                      Clear Uploaded Background
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
