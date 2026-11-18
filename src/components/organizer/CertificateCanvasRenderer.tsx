"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CanvasElement,
  CertificateBadgeStyle,
  CertificateConfig,
  CertificateRecipient,
} from "@/types";
import {
  CERT_CANVAS_HEIGHT,
  CERT_CANVAS_WIDTH,
  calculateAutoFontSize,
  getElementKind,
  resolveElementText,
} from "@/lib/certificate";
import { QrCode, Lock } from "lucide-react";

interface CertificateCanvasRendererProps {
  config: CertificateConfig;
  recipient?: CertificateRecipient | null;
  eventTitle: string;
  interactive?: boolean;
  selectedElementId?: string | null;
  onSelectElement?: (id: string | null) => void;
  onUpdateElement?: (id: string, updates: Partial<CanvasElement>) => void;
  showGrid?: boolean;
  snapEnabled?: boolean;
  className?: string;
}

const VectorBadge: React.FC<{ style?: CertificateBadgeStyle; color: string }> = ({
  style = "blue_crest",
  color,
}) => {
  if (style === "gold_seal") {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="50%" stopColor={color || "#d97706"} />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
        </defs>
        {/* Ribbon tails */}
        <path d="M40 84 L30 116 L48 106 L58 118 L58 86 Z" fill={color || "#b45309"} opacity="0.88" />
        <path d="M80 84 L90 116 L72 106 L62 118 L62 86 Z" fill={color || "#d97706"} opacity="0.95" />
        {/* Scalloped medallion */}
        <circle cx="60" cy="52" r="40" fill="url(#goldGrad)" stroke="#fef3c7" strokeWidth="2.5" />
        <circle cx="60" cy="52" r="32" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 3" />
        <polygon
          points="60,26 66,42 83,42 69,52 74,68 60,58 46,68 51,52 37,42 54,42"
          fill="#ffffff"
          opacity="0.95"
        />
      </svg>
    );
  }

  if (style === "star_ribbon") {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm">
        <circle cx="60" cy="60" r="48" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="3" />
        <circle cx="60" cy="60" r="38" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="5 3" />
        <polygon
          points="60,24 68,45 90,45 72,58 79,80 60,67 41,80 48,58 30,45 52,45"
          fill={color}
        />
      </svg>
    );
  }

  if (style === "verified_stamp") {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <circle cx="60" cy="60" r="50" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="3.5" />
        <circle cx="60" cy="60" r="41" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
        <path
          d="M40 60 L54 74 L82 44"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="60"
          y="96"
          textAnchor="middle"
          fontSize="10"
          fontWeight="800"
          letterSpacing="2"
          fill={color}
          fontFamily="Inter, sans-serif"
        >
          VERIFIED
        </text>
      </svg>
    );
  }

  // Default: blue_crest
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm">
      <path
        d="M60 10 L102 26 L102 62 C102 88 83 104 60 112 C37 104 18 88 18 62 L18 26 Z"
        fill={color}
        fillOpacity="0.12"
        stroke={color}
        strokeWidth="4"
      />
      <path
        d="M60 22 L91 34 L91 60 C91 80 77 93 60 100 C43 93 29 80 29 60 L29 34 Z"
        fill={color}
        fillOpacity="0.92"
      />
      <polygon
        points="60,38 65,51 79,51 68,59 72,72 60,64 48,72 52,59 41,51 55,51"
        fill="#ffffff"
      />
    </svg>
  );
};

export const CertificateCanvasRenderer: React.FC<CertificateCanvasRendererProps> = ({
  config,
  recipient,
  eventTitle,
  interactive = false,
  selectedElementId = null,
  onSelectElement,
  onUpdateElement,
  showGrid = false,
  snapEnabled = true,
  className = "",
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  const [snapGuides, setSnapGuides] = useState<{ x: boolean; y: boolean }>({ x: false, y: false });

  const W = config.width || CERT_CANVAS_WIDTH;
  const H = config.height || CERT_CANVAS_HEIGHT;

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const updateScale = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        setScale(rect.width / W);
      }
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [W]);

  // Smooth Canva-style Drag & Drop handler
  const handleDragStart = (e: React.PointerEvent, el: CanvasElement) => {
    if (!interactive || !onUpdateElement) return;
    e.stopPropagation();
    onSelectElement?.(el.id);

    if (el.locked) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = el.xPercent;
    const origY = el.yPercent;

    const handleMove = (moveEvent: PointerEvent) => {
      const dxPercent = ((moveEvent.clientX - startX) / rect.width) * 100;
      const dyPercent = ((moveEvent.clientY - startY) / rect.height) * 100;

      let nextX = Math.max(3, Math.min(97, origX + dxPercent));
      let nextY = Math.max(3, Math.min(97, origY + dyPercent));

      let snappedX = false;
      let snappedY = false;

      if (snapEnabled) {
        if (Math.abs(nextX - 50) < 1.4) {
          nextX = 50;
          snappedX = true;
        }
        if (Math.abs(nextY - 50) < 1.4) {
          nextY = 50;
          snappedY = true;
        }
      }

      setSnapGuides({ x: snappedX, y: snappedY });
      onUpdateElement(el.id, {
        xPercent: Number(nextX.toFixed(1)),
        yPercent: Number(nextY.toFixed(1)),
      });
    };

    const handleUp = () => {
      setSnapGuides({ x: false, y: false });
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  // Corner Resize handler for logos, images, badges, and shapes
  const handleResizeStart = (e: React.PointerEvent, el: CanvasElement) => {
    if (!interactive || !onUpdateElement || el.locked) return;
    e.stopPropagation();

    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const origW = el.widthPercent || 12;
    const origH = el.heightPercent || 14;
    const kind = getElementKind(el);

    const handleMove = (moveEvent: PointerEvent) => {
      const dxPercent = ((moveEvent.clientX - startX) / rect.width) * 100 * 2;
      const dyPercent = ((moveEvent.clientY - startY) / rect.height) * 100 * 2;

      const nextW = Math.max(3, Math.min(90, origW + dxPercent));
      const nextH =
        kind === "shape" && el.shapeType === "line"
          ? origH
          : Math.max(2, Math.min(80, origH + dyPercent));

      onUpdateElement(el.id, {
        widthPercent: Number(nextW.toFixed(1)),
        heightPercent: Number(nextH.toFixed(2)),
      });
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const borderStyle = config.borderStyle || "modern_accent";
  const borderColor = config.borderColor || "#2563eb";
  const bgStyle: React.CSSProperties = config.backgroundDataUrl
    ? {
        backgroundImage: `url(${config.backgroundDataUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: config.backgroundColor || "#ffffff",
      }
    : {
        background: config.backgroundGradient || config.backgroundColor || "#ffffff",
      };

  return (
    <div
      ref={wrapperRef}
      onClick={() => interactive && onSelectElement?.(null)}
      style={{ aspectRatio: `${W} / ${H}` }}
      className={`relative w-full overflow-hidden select-none ${className}`}
    >
      {/* Virtual 1200x850 Artboard scaled uniformly */}
      <div
        style={{
          width: `${W}px`,
          height: `${H}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          ...bgStyle,
        }}
        className="relative overflow-hidden"
      >
        {/* Decorative Borders Layer */}
        {borderStyle === "classic_double" && (
          <>
            <div
              style={{ borderColor }}
              className="pointer-events-none absolute inset-[26px] border-[5px]"
            />
            <div
              style={{ borderColor, opacity: 0.65 }}
              className="pointer-events-none absolute inset-[40px] border-[1.5px]"
            />
          </>
        )}

        {borderStyle === "modern_accent" && (
          <>
            <div
              style={{ backgroundColor: borderColor }}
              className="pointer-events-none absolute top-0 left-0 right-0 h-[14px]"
            />
            <div
              style={{ backgroundColor: borderColor }}
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-[14px]"
            />
            <div
              style={{ borderColor, opacity: 0.25 }}
              className="pointer-events-none absolute inset-x-[28px] inset-y-[32px] rounded-[18px] border-[2px]"
            />
          </>
        )}

        {borderStyle === "ornate_corners" && (
          <>
            <div
              style={{ borderColor, opacity: 0.35 }}
              className="pointer-events-none absolute inset-[30px] border-[2px]"
            />
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="pointer-events-none absolute inset-0 w-full h-full"
            >
              <path d="M22 96 L22 22 L96 22" fill="none" stroke={borderColor} strokeWidth="6" />
              <path
                d={`M${W - 96} 22 L${W - 22} 22 L${W - 22} 96`}
                fill="none"
                stroke={borderColor}
                strokeWidth="6"
              />
              <path
                d={`M22 ${H - 96} L22 ${H - 22} L96 ${H - 22}`}
                fill="none"
                stroke={borderColor}
                strokeWidth="6"
              />
              <path
                d={`M${W - 96} ${H - 22} L${W - 22} ${H - 22} L${W - 22} ${H - 96}`}
                fill="none"
                stroke={borderColor}
                strokeWidth="6"
              />
            </svg>
          </>
        )}

        {borderStyle === "minimal_line" && (
          <div
            style={{ borderColor }}
            className="pointer-events-none absolute inset-[36px] border-[2px]"
          />
        )}

        {/* Editor Optional Grid Overlay */}
        {interactive && showGrid && (
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, #2563eb 1px, transparent 1px), linear-gradient(to bottom, #2563eb 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        )}

        {/* Smart Center Alignment Snap Guides */}
        {interactive && snapGuides.x && (
          <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 border-l-2 border-dashed border-blue-500 z-50" />
        )}
        {interactive && snapGuides.y && (
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 border-t-2 border-dashed border-blue-500 z-50" />
        )}

        {/* Render All Enabled Canvas Elements */}
        {config.elements
          .filter((el) => el.enabled)
          .map((el) => {
            const isSelected = interactive && el.id === selectedElementId;
            const kind = getElementKind(el);
            const opacity = el.opacity ?? 1;
            const rotation = el.rotation || 0;

            const baseStyle: React.CSSProperties = {
              position: "absolute",
              left: `${el.xPercent}%`,
              top: `${el.yPercent}%`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              opacity,
            };

            const selectionRing = isSelected
              ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent bg-blue-500/[0.06]"
              : interactive
              ? "hover:ring-1 hover:ring-blue-400/70"
              : "";

            // 1. IMAGE / COLLEGE LOGO / SIGNATURE PNG
            if (kind === "image") {
              const iw = ((el.widthPercent || 12) / 100) * W;
              const ih = ((el.heightPercent || 14) / 100) * H;
              return (
                <div
                  key={el.id}
                  onPointerDown={(e) => handleDragStart(e, el)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ ...baseStyle, width: `${iw}px`, height: `${ih}px` }}
                  className={`flex items-center justify-center ${
                    interactive ? (el.locked ? "cursor-not-allowed" : "cursor-move") : ""
                  } ${selectionRing}`}
                >
                  {el.imageDataUrl ? (
                    <img
                      src={el.imageDataUrl}
                      alt={el.label}
                      draggable={false}
                      style={{
                        borderRadius:
                          el.borderRadius && el.borderRadius >= 90
                            ? "9999px"
                            : `${el.borderRadius || 0}px`,
                      }}
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  ) : (
                    <div className="w-full h-full border-2 border-dashed border-blue-400 rounded-xl flex items-center justify-center text-blue-500 text-xs font-semibold bg-blue-50/50">
                      Logo Placeholder
                    </div>
                  )}

                  {isSelected && !el.locked && (
                    <div
                      onPointerDown={(e) => handleResizeStart(e, el)}
                      title="Drag to resize"
                      className="absolute -right-2 -bottom-2 h-4 w-4 rounded-full bg-blue-600 border-2 border-white shadow cursor-nwse-resize z-30"
                    />
                  )}
                  {isSelected && el.locked && (
                    <div className="absolute -top-3 -right-3 rounded-full bg-slate-800 text-white p-1">
                      <Lock className="h-3 w-3" />
                    </div>
                  )}
                </div>
              );
            }

            // 2. VECTOR SEAL / BADGE
            if (kind === "badge") {
              const bw = ((el.widthPercent || 10) / 100) * W;
              const bh = ((el.heightPercent || 14) / 100) * H;
              return (
                <div
                  key={el.id}
                  onPointerDown={(e) => handleDragStart(e, el)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ ...baseStyle, width: `${bw}px`, height: `${bh}px` }}
                  className={`flex items-center justify-center ${
                    interactive ? (el.locked ? "cursor-not-allowed" : "cursor-move") : ""
                  } ${selectionRing}`}
                >
                  <VectorBadge style={el.badgeStyle} color={el.color} />
                  {isSelected && !el.locked && (
                    <div
                      onPointerDown={(e) => handleResizeStart(e, el)}
                      title="Drag to resize"
                      className="absolute -right-2 -bottom-2 h-4 w-4 rounded-full bg-blue-600 border-2 border-white shadow cursor-nwse-resize z-30"
                    />
                  )}
                </div>
              );
            }

            // 3. SHAPE / DIVIDER LINE / ACCENT BOX
            if (kind === "shape") {
              const sw = ((el.widthPercent || 40) / 100) * W;
              const sh = Math.max(3, ((el.heightPercent || 0.4) / 100) * H);
              return (
                <div
                  key={el.id}
                  onPointerDown={(e) => handleDragStart(e, el)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    ...baseStyle,
                    width: `${sw}px`,
                    height: `${Math.max(18, sh)}px`,
                  }}
                  className={`flex items-center justify-center ${
                    interactive ? (el.locked ? "cursor-not-allowed" : "cursor-move") : ""
                  } ${selectionRing}`}
                >
                  <div
                    style={{
                      width: "100%",
                      height: `${sh}px`,
                      backgroundColor: el.color,
                      borderRadius: el.shapeType === "pill" ? "9999px" : `${el.borderRadius || 2}px`,
                    }}
                  />
                  {isSelected && !el.locked && (
                    <div
                      onPointerDown={(e) => handleResizeStart(e, el)}
                      title="Drag to resize"
                      className="absolute -right-2 -bottom-2 h-4 w-4 rounded-full bg-blue-600 border-2 border-white shadow cursor-nwse-resize z-30"
                    />
                  )}
                </div>
              );
            }

            // 4. QR VERIFICATION BADGE
            if (kind === "qr") {
              const qrText = resolveElementText(el, recipient, eventTitle);
              return (
                <div
                  key={el.id}
                  onPointerDown={(e) => handleDragStart(e, el)}
                  onClick={(e) => e.stopPropagation()}
                  style={baseStyle}
                  className={`flex items-center gap-3 rounded-xl bg-white/95 px-4 py-2.5 shadow-sm border-[1.5px] ${
                    interactive ? (el.locked ? "cursor-not-allowed" : "cursor-move") : ""
                  } ${selectionRing}`}
                >
                  <div
                    style={{ borderColor: el.color }}
                    className="rounded-lg bg-slate-50 p-1.5 border"
                  >
                    <QrCode className="h-9 w-9 text-slate-900" />
                  </div>
                  <div className="text-left">
                    <div
                      style={{ color: el.color, fontFamily: el.fontFamily || "monospace" }}
                      className="text-[13px] font-bold tracking-wider whitespace-nowrap"
                    >
                      {qrText}
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                      SHA-256 FESTRA VERIFIED
                    </div>
                  </div>
                </div>
              );
            }

            // 5. TEXT ELEMENT (with automatic smart variable resolution + long-name auto-scaling)
            const resolvedText = resolveElementText(el, recipient, eventTitle);
            const displayText =
              el.textTransform === "uppercase"
                ? resolvedText.toUpperCase()
                : resolvedText;
            const computedSize =
              el.type === "name"
                ? calculateAutoFontSize(displayText, W * 0.78, el.fontSize, 26)
                : el.fontSize;

            return (
              <div
                key={el.id}
                onPointerDown={(e) => handleDragStart(e, el)}
                onClick={(e) => e.stopPropagation()}
                style={{
                  ...baseStyle,
                  fontSize: `${computedSize}px`,
                  fontWeight: el.fontWeight,
                  fontStyle: el.fontStyle || "normal",
                  fontFamily: el.fontFamily,
                  color: el.color,
                  letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
                  textAlign: el.textAlign || "center",
                  lineHeight: 1.2,
                }}
                className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                  interactive ? (el.locked ? "cursor-not-allowed" : "cursor-move") : ""
                } ${selectionRing}`}
              >
                {displayText}
                {isSelected && el.locked && (
                  <span className="ml-2 inline-flex align-middle text-slate-500">
                    <Lock className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
