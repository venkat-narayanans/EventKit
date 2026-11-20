"use client";

import React from "react";

/**
 * 1. HERO COMMAND RADAR SVG
 * Full interactive vector radar visual depicting the Festra live event arena:
 * central scanning beacon, animated laser data paths, active squad nodes,
 * floating QR pass with scanning laser, and victory crown.
 * Highly optimized, responsive, and lightweight (<12KB SVG).
 */
export const HeroCommandRadarSvg: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 640 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto select-none"
        aria-label="Festra Live Event Arena Command Radar"
      >
        <defs>
          {/* Subtle Radial Blue Gradient */}
          <radialGradient
            id="festraRadarGlow"
            cx="320"
            cy="180"
            r="200"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.12" />
            <stop offset="60%" stopColor="#2563eb" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </radialGradient>

          {/* Rotating Radar Sweep Gradient */}
          <linearGradient
            id="festraRadarSweep"
            x1="320"
            y1="180"
            x2="480"
            y2="180"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
            <stop offset="80%" stopColor="#60a5fa" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>

          {/* Laser Line Gradient */}
          <linearGradient id="festraLaser" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          {/* Card Surface Gradient */}
          <linearGradient id="festraCardBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.9" />
          </linearGradient>

          {/* Golden Crown Gradient */}
          <linearGradient id="festraGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Scanline Gradient */}
          <linearGradient id="festraLaserBeam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>

          {/* Drop Shadows */}
          <filter id="festraShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1e3a8a" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Outer Background Border Frame */}
        <rect
          x="12"
          y="12"
          width="616"
          height="336"
          rx="24"
          fill="url(#festraCardBg)"
          stroke="#e2e8f0"
          strokeWidth="1.5"
          filter="url(#festraShadow)"
        />

        {/* Ambient Center Glow */}
        <circle cx="320" cy="180" r="180" fill="url(#festraRadarGlow)" />

        {/* Concentric Radar Rings */}
        <circle cx="320" cy="180" r="50" stroke="#bfdbfe" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
        <circle cx="320" cy="180" r="100" stroke="#bfdbfe" strokeWidth="1" opacity="0.6" />
        <circle cx="320" cy="180" r="150" stroke="#bfdbfe" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

        {/* Coordinate Crosshairs */}
        <line x1="170" y1="180" x2="470" y2="180" stroke="#93c5fd" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
        <line x1="320" y1="40" x2="320" y2="320" stroke="#93c5fd" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />

        {/* Distance Range Markers */}
        <text x="375" y="175" fill="#94a3b8" fontSize="8" fontFamily="monospace" fontWeight="600">R-50M</text>
        <text x="425" y="175" fill="#94a3b8" fontSize="8" fontFamily="monospace" fontWeight="600">R-100M</text>
        <text x="475" y="175" fill="#94a3b8" fontSize="8" fontFamily="monospace" fontWeight="600">R-150M</text>

        {/* Rotating Radar Sweep Cone */}
        <g className="animate-festra-radar">
          <path
            d="M 320 180 L 480 180 A 160 160 0 0 0 433 67 Z"
            fill="url(#festraRadarSweep)"
          />
          <line x1="320" y1="180" x2="480" y2="180" stroke="#3b82f6" strokeWidth="1.5" opacity="0.8" />
        </g>

        {/* Flowing Data Laser Connection Paths */}
        {/* Path to Left Squad Node */}
        <path
          d="M 320 180 Q 210 140 120 130"
          stroke="url(#festraLaser)"
          strokeWidth="2"
          fill="none"
          className="animate-festra-dash"
        />
        {/* Path to Right Leaderboard Node */}
        <path
          d="M 320 180 Q 420 130 520 120"
          stroke="url(#festraLaser)"
          strokeWidth="2"
          fill="none"
          className="animate-festra-dash"
        />
        {/* Path to Bottom QR Gate Node */}
        <path
          d="M 320 180 Q 300 240 230 270"
          stroke="url(#festraLaser)"
          strokeWidth="2"
          fill="none"
          className="animate-festra-dash"
        />
        {/* Path to Right NAAC Node */}
        <path
          d="M 320 180 Q 400 240 460 260"
          stroke="url(#festraLaser)"
          strokeWidth="2"
          fill="none"
          className="animate-festra-dash"
        />

        {/* Center Engine Core Hub */}
        <g>
          {/* Pulsing Outer Core Ring */}
          <circle cx="320" cy="180" r="32" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" className="animate-festra-pulse" />
          <circle cx="320" cy="180" r="22" fill="#2563eb" />
          {/* Festra "F" Emblem */}
          <text
            x="320"
            y="188"
            fill="#ffffff"
            fontSize="20"
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'FortniteFont', 'Burbank Big Condensed Black', sans-serif"
          >
            F
          </text>
          {/* Status Label */}
          <rect x="270" y="218" width="100" height="18" rx="9" fill="#1e293b" />
          <circle cx="280" cy="227" r="3" fill="#10b981" />
          <text x="324" y="230" fill="#f8fafc" fontSize="8" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">
            ENGINE ACTIVE
          </text>
        </g>

        {/* NODE 1 (TOP LEFT): SQUAD ALPHA HACKATHON NODE */}
        <g className="animate-festra-float" transform="translate(40, 70)">
          <rect
            width="140"
            height="72"
            rx="14"
            fill="#ffffff"
            stroke="#bfdbfe"
            strokeWidth="1.5"
            filter="url(#festraShadow)"
          />
          <rect x="0" y="0" width="140" height="4" rx="2" fill="#2563eb" />

          {/* Node Header */}
          <circle cx="18" cy="20" r="4" fill="#3b82f6" />
          <text x="28" y="23" fill="#1e3a8a" fontSize="10" fontWeight="800" fontFamily="sans-serif">
            SQUAD ALPHA
          </text>
          <rect x="95" y="13" width="36" height="14" rx="7" fill="#dbeafe" />
          <text x="113" y="23" fill="#1d4ed8" fontSize="8" fontWeight="700" textAnchor="middle">
            GIT LIVE
          </text>

          {/* Details */}
          <text x="14" y="42" fill="#475569" fontSize="9" fontWeight="600">
            HackCampus: 24h AI Sprint
          </text>
          <text x="14" y="56" fill="#10b981" fontSize="9" fontWeight="700" fontFamily="monospace">
            ✓ 28 Audited Commits
          </text>
        </g>

        {/* NODE 2 (TOP RIGHT): VICTORY CROWN LEADERBOARD NODE */}
        <g className="animate-festra-float-reverse" transform="translate(450, 60)">
          <rect
            width="145"
            height="76"
            rx="14"
            fill="#ffffff"
            stroke="#fde68a"
            strokeWidth="1.5"
            filter="url(#festraShadow)"
          />
          <rect x="0" y="0" width="145" height="4" rx="2" fill="url(#festraGold)" />

          {/* Crown Icon */}
          <g transform="translate(14, 14)">
            <path
              d="M 2 14 L 5 4 L 9 9 L 13 4 L 16 14 Z"
              fill="url(#festraGold)"
              stroke="#b45309"
              strokeWidth="1"
            />
            <circle cx="5" cy="3" r="1.5" fill="#f59e0b" />
            <circle cx="9" cy="8" r="1.5" fill="#f59e0b" />
            <circle cx="13" cy="3" r="1.5" fill="#f59e0b" />
          </g>

          <text x="36" y="24" fill="#78350f" fontSize="10" fontWeight="800">
            LEADERBOARD #1
          </text>

          <rect x="14" y="36" width="117" height="18" rx="6" fill="#fef3c7" />
          <text x="20" y="49" fill="#92400e" fontSize="9" fontWeight="700">
            Nexus Protocol: 98.4 Pts
          </text>
          <text x="14" y="66" fill="#64748b" fontSize="8" fontWeight="600">
            Z-Score: +2.18σ (Fair Grade)
          </text>
        </g>

        {/* NODE 3 (BOTTOM LEFT): ENCRYPTED QR ADMIT PASS */}
        <g className="animate-festra-float-reverse" transform="translate(80, 210)">
          <rect
            width="160"
            height="85"
            rx="14"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            filter="url(#festraShadow)"
          />
          <rect x="0" y="0" width="160" height="4" rx="2" fill="#10b981" />

          {/* Mini QR Box */}
          <rect x="12" y="14" width="46" height="46" rx="6" fill="#0f172a" />
          {/* QR Pattern Simulation */}
          <rect x="16" y="18" width="14" height="14" fill="#ffffff" />
          <rect x="19" y="21" width="8" height="8" fill="#0f172a" />
          <rect x="40" y="18" width="14" height="14" fill="#ffffff" />
          <rect x="43" y="21" width="8" height="8" fill="#0f172a" />
          <rect x="16" y="42" width="14" height="14" fill="#ffffff" />
          <rect x="19" y="45" width="8" height="8" fill="#0f172a" />
          <rect x="36" y="38" width="6" height="6" fill="#ffffff" />
          <rect x="44" y="46" width="6" height="6" fill="#ffffff" />

          {/* Laser Scanner Line moving across QR */}
          <g className="animate-festra-scanline">
            <line x1="12" y1="20" x2="58" y2="20" stroke="#38bdf8" strokeWidth="2" filter="drop-shadow(0 0 3px #38bdf8)" />
          </g>

          {/* Admit Pass Text */}
          <text x="66" y="26" fill="#0f172a" fontSize="10" fontWeight="800">
            ADMIT PASS
          </text>
          <text x="66" y="38" fill="#2563eb" fontSize="9" fontWeight="700" fontFamily="monospace">
            TK-PREVIEW-8842
          </text>
          <text x="66" y="50" fill="#64748b" fontSize="8">
            Gate 4 Kiosk • Verified
          </text>
          <rect x="66" y="56" width="80" height="14" rx="7" fill="#ecfdf5" />
          <text x="106" y="66" fill="#059669" fontSize="8" fontWeight="700" textAnchor="middle">
            ● FAST TRACK ENTRY
          </text>
        </g>

        {/* NODE 4 (BOTTOM RIGHT): NAAC & NIRF ACCREDITATION DOSSIER */}
        <g className="animate-festra-float" transform="translate(420, 220)">
          <rect
            width="155"
            height="80"
            rx="14"
            fill="#ffffff"
            stroke="#bfdbfe"
            strokeWidth="1.5"
            filter="url(#festraShadow)"
          />
          <rect x="0" y="0" width="155" height="4" rx="2" fill="#3b82f6" />

          {/* Accreditation Seal */}
          <circle cx="26" cy="28" r="12" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.5" />
          <path d="M 21 28 L 24 32 L 31 24" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          <text x="46" y="25" fill="#1e3a8a" fontSize="10" fontWeight="800">
            NAAC CRITERIA
          </text>
          <text x="46" y="37" fill="#64748b" fontSize="8">
            IQAC Section 3.3.2 & 5.3.3
          </text>

          <rect x="14" y="48" width="127" height="20" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <text x="20" y="62" fill="#0284c7" fontSize="8" fontWeight="700" fontFamily="monospace">
            ✓ 1-Click PDF Dossier Ready
          </text>
        </g>

        {/* Sparkles / Battle Star Accents */}
        <g className="animate-festra-sparkle" transform="translate(260, 80)">
          <path d="M 0 6 L 2 2 L 6 0 L 2 -2 L 0 -6 L -2 -2 L -6 0 L -2 2 Z" fill="#60a5fa" />
        </g>
        <g className="animate-festra-sparkle" transform="translate(390, 100)">
          <path d="M 0 5 L 1.5 1.5 L 5 0 L 1.5 -1.5 L 0 -5 L -1.5 -1.5 L -5 0 L -1.5 1.5 Z" fill="#fbbf24" />
        </g>
        <g className="animate-festra-sparkle" transform="translate(360, 270)">
          <path d="M 0 4 L 1 1 L 4 0 L 1 -1 L 0 -4 L -1 -1 L -4 0 L -1 1 Z" fill="#38bdf8" />
        </g>

        {/* Bottom Tactical Ticker Bar */}
        <rect x="12" y="318" width="616" height="30" rx="12" fill="#0f172a" />
        <circle cx="28" cy="333" r="3.5" fill="#10b981" className="animate-festra-pulse" />
        <text
          x="38"
          y="336"
          fill="#f8fafc"
          fontSize="9"
          fontWeight="700"
          fontFamily="monospace"
          letterSpacing="0.08em"
        >
          CAMPUS RADAR: 50 SQUADS ACTIVE • ZERO FAIRNESS BIAS • REAL-TIME COMMIT AUDIT
        </text>
      </svg>
    </div>
  );
};

/**
 * 2. CARD 1 MICRO-SVG: DIGITAL WALLET & QR PASSES
 */
export const Card1QrPassSvg: React.FC = () => {
  return (
    <svg viewBox="0 0 140 85" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Smartphone Pass Shell */}
      <rect x="35" y="6" width="70" height="74" rx="12" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1.5" />
      <rect x="35" y="6" width="70" height="4" rx="2" fill="#2563eb" />

      {/* Notch */}
      <rect x="58" y="10" width="24" height="3" rx="1.5" fill="#cbd5e1" />

      {/* Mini QR Code */}
      <rect x="46" y="18" width="48" height="42" rx="6" fill="#0f172a" />
      <rect x="50" y="22" width="12" height="12" fill="#ffffff" />
      <rect x="53" y="25" width="6" height="6" fill="#0f172a" />
      <rect x="78" y="22" width="12" height="12" fill="#ffffff" />
      <rect x="81" y="25" width="6" height="6" fill="#0f172a" />
      <rect x="50" y="44" width="12" height="12" fill="#ffffff" />
      <rect x="53" y="47" width="6" height="6" fill="#0f172a" />
      <rect x="74" y="40" width="6" height="6" fill="#ffffff" />
      <rect x="82" y="48" width="6" height="6" fill="#ffffff" />

      {/* Sweeping Laser Beam */}
      <g className="animate-festra-scanline">
        <line x1="46" y1="26" x2="94" y2="26" stroke="#38bdf8" strokeWidth="2" filter="drop-shadow(0 0 2px #38bdf8)" />
      </g>

      {/* Verified Badge */}
      <g className="animate-festra-float" transform="translate(85, 45)">
        <circle cx="12" cy="12" r="10" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
        <path d="M 8 12 L 11 15 L 16 9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
};

/**
 * 3. CARD 2 MICRO-SVG: GIT COMMIT RADAR & MILESTONE AUDITING
 */
export const Card2GitRadarSvg: React.FC = () => {
  return (
    <svg viewBox="0 0 140 85" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Background card grid */}
      <rect x="15" y="10" width="110" height="65" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />

      {/* Main Branch Line */}
      <line x1="30" y1="52" x2="110" y2="52" stroke="#94a3b8" strokeWidth="2" />

      {/* Feature Branch Curve */}
      <path
        d="M 45 52 C 55 52, 60 28, 75 28 L 95 28 C 102 28, 105 52, 110 52"
        stroke="#2563eb"
        strokeWidth="2"
        strokeDasharray="3 3"
        fill="none"
        className="animate-festra-dash"
      />

      {/* Commit Nodes */}
      {/* Commit 1: Abstract */}
      <circle cx="45" cy="52" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
      <text x="45" y="68" fill="#64748b" fontSize="7" fontWeight="700" textAnchor="middle">M1</text>

      {/* Commit 2: Prototype */}
      <circle cx="75" cy="28" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" className="animate-festra-pulse" />
      <text x="75" y="20" fill="#2563eb" fontSize="7" fontWeight="700" textAnchor="middle">M2</text>

      {/* Commit 3: Code Freeze with Lock */}
      <circle cx="95" cy="28" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
      <g transform="translate(92, 24)">
        <rect x="1" y="3" width="5" height="4" rx="1" fill="#ffffff" />
        <path d="M 2 3 L 2 1.5 C 2 0.8, 5 0.8, 5 1.5 L 5 3" stroke="#ffffff" strokeWidth="1" fill="none" />
      </g>
      <text x="95" y="44" fill="#059669" fontSize="7" fontWeight="800" textAnchor="middle">FREEZE</text>
    </svg>
  );
};

/**
 * 4. CARD 3 MICRO-SVG: CUSTOM RUBRICS & Z-SCORE NORMALIZATION
 */
export const Card3ZScoreSvg: React.FC = () => {
  return (
    <svg viewBox="0 0 140 85" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Background card surface */}
      <rect x="15" y="10" width="110" height="65" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />

      {/* Normal Distribution Bell Curve Fill */}
      <path
        d="M 25 60 C 45 60, 55 58, 65 30 C 70 16, 70 16, 75 30 C 85 58, 95 60, 115 60 Z"
        fill="#dbeafe"
        opacity="0.8"
      />

      {/* Bell Curve Stroke */}
      <path
        d="M 25 60 C 45 60, 55 58, 65 30 C 70 16, 70 16, 75 30 C 85 58, 95 60, 115 60"
        stroke="#2563eb"
        strokeWidth="2"
        fill="none"
      />

      {/* Baseline */}
      <line x1="22" y1="60" x2="118" y2="60" stroke="#cbd5e1" strokeWidth="1.5" />

      {/* Standard Deviation markers */}
      <line x1="50" y1="58" x2="50" y2="62" stroke="#94a3b8" strokeWidth="1" />
      <line x1="70" y1="58" x2="70" y2="62" stroke="#2563eb" strokeWidth="1.5" />
      <line x1="90" y1="58" x2="90" y2="62" stroke="#94a3b8" strokeWidth="1" />

      <text x="50" y="70" fill="#94a3b8" fontSize="7" textAnchor="middle">-1σ</text>
      <text x="70" y="70" fill="#2563eb" fontSize="7" fontWeight="800" textAnchor="middle">μ (0)</text>
      <text x="90" y="70" fill="#94a3b8" fontSize="7" textAnchor="middle">+1σ</text>

      {/* Floating Balance Scale Icon */}
      <g className="animate-festra-float" transform="translate(62, 10)">
        <circle cx="8" cy="8" r="8" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.5" />
        <path d="M 5 6 L 11 6 M 8 6 L 8 12 M 5 12 L 11 12" stroke="#2563eb" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </svg>
  );
};

/**
 * 5. CARD 4 MICRO-SVG: CANVA CERTIFICATES & NAAC COMPLIANCE
 */
export const Card4CertificateSvg: React.FC = () => {
  return (
    <svg viewBox="0 0 140 85" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Certificate Scroll Parchment */}
      <rect x="25" y="12" width="90" height="60" rx="8" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1.5" />
      <rect x="30" y="17" width="80" height="50" rx="4" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" fill="none" />

      {/* Certificate Header Banner */}
      <rect x="42" y="23" width="56" height="4" rx="2" fill="#2563eb" />
      <rect x="48" y="31" width="44" height="2" rx="1" fill="#94a3b8" />
      <rect x="44" y="37" width="52" height="2" rx="1" fill="#94a3b8" />

      {/* Golden Seal with Ribbon */}
      <g className="animate-festra-pulse" transform="translate(70, 42)">
        <circle cx="10" cy="10" r="9" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
        {/* Ribbons */}
        <path d="M 6 18 L 4 25 L 8 23 L 12 25 L 10 18" fill="#d97706" />
        <path d="M 10 18 L 8 25 L 12 23 L 16 25 L 14 18" fill="#b45309" />
        {/* Star */}
        <path d="M 10 6 L 11 8.5 L 14 9 L 11.5 11 L 12 14 L 10 12.5 L 8 14 L 8.5 11 L 6 9 L 9 8.5 Z" fill="#ffffff" />
      </g>

      {/* NAAC Badge */}
      <g transform="translate(32, 46)">
        <rect width="28" height="14" rx="7" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1" />
        <text x="14" y="10" fill="#1d4ed8" fontSize="6" fontWeight="800" textAnchor="middle">
          IQAC 3.3
        </text>
      </g>
    </svg>
  );
};

/**
 * 6. LIVE EVENT PIPELINE SVG (CAMPUS BATTLE-PASS JOURNEY)
 * Shows the full event progression:
 * 1. QR Admit Scan ──> 2. 24h Git Sprint ──> 3. Z-Score Judging ──> 4. Victory Podium
 */
export const EventPipelineSvg: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`w-full overflow-x-auto no-scrollbar py-2 ${className}`}>
      <div className="min-w-[620px] max-w-5xl mx-auto px-4">
        <svg
          viewBox="0 0 740 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto select-none"
        >
          {/* Main Connecting Track Line */}
          <line x1="60" y1="45" x2="680" y2="45" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />

          {/* Animated Flowing Laser Beam */}
          <line
            x1="60"
            y1="45"
            x2="680"
            y2="45"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
            className="animate-festra-dash"
          />

          {/* STAGE 1: QR GATE CHECK-IN */}
          <g transform="translate(60, 45)">
            <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="16" fill="#eff6ff" />
            {/* QR Icon */}
            <rect x="-7" y="-7" width="14" height="14" rx="2" fill="#2563eb" />
            <rect x="-4" y="-4" width="4" height="4" fill="#ffffff" />
            <rect x="0" y="0" width="4" height="4" fill="#ffffff" />

            <text x="0" y="36" fill="#0f172a" fontSize="10" fontWeight="800" textAnchor="middle">
              1. QR GATE SCAN
            </text>
            <text x="0" y="48" fill="#64748b" fontSize="8" textAnchor="middle">
              Instant Admit Pass
            </text>
          </g>

          {/* STAGE 2: GIT SPRINT */}
          <g transform="translate(260, 45)">
            <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#3b82f6" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="16" fill="#eff6ff" />
            {/* Git Branch Icon */}
            <circle cx="-5" cy="4" r="2.5" fill="#2563eb" />
            <circle cx="5" cy="-4" r="2.5" fill="#2563eb" />
            <circle cx="5" cy="4" r="2.5" fill="#2563eb" />
            <path d="M -5 4 L 5 4 M -5 4 Q -1 -4 5 -4" stroke="#2563eb" strokeWidth="1.5" fill="none" />

            <text x="0" y="36" fill="#0f172a" fontSize="10" fontWeight="800" textAnchor="middle">
              2. GIT SPRINT
            </text>
            <text x="0" y="48" fill="#64748b" fontSize="8" textAnchor="middle">
              Commit Auditing
            </text>
          </g>

          {/* STAGE 3: Z-SCORE FAIR EVALUATION */}
          <g transform="translate(470, 45)">
            <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#60a5fa" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="16" fill="#eff6ff" />
            {/* Bell Curve Icon */}
            <path d="M -9 5 Q -4 4 0 -6 Q 4 4 9 5" stroke="#2563eb" strokeWidth="2" fill="none" />

            <text x="0" y="36" fill="#0f172a" fontSize="10" fontWeight="800" textAnchor="middle">
              3. Z-SCORE EVAL
            </text>
            <text x="0" y="48" fill="#64748b" fontSize="8" textAnchor="middle">
              Zero Bias Normalization
            </text>
          </g>

          {/* STAGE 4: VICTORY CEREMONY & CERTS */}
          <g transform="translate(670, 45)">
            <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="16" fill="#fef3c7" />
            {/* Trophy Icon */}
            <path d="M -6 -5 L 6 -5 L 4 2 Q 0 5 -4 2 Z" fill="#d97706" />
            <line x1="0" y1="2" x2="0" y2="6" stroke="#d97706" strokeWidth="1.5" />
            <line x1="-4" y1="6" x2="4" y2="6" stroke="#d97706" strokeWidth="1.5" />

            <text x="0" y="36" fill="#0f172a" fontSize="10" fontWeight="800" textAnchor="middle">
              4. PODIUM & CERTS
            </text>
            <text x="0" y="48" fill="#64748b" fontSize="8" textAnchor="middle">
              1-Click Batch Dispatch
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

/**
 * 7. AMBIENT FLOATING DECORATIONS
 * Subtle Fortnite & Campus-inspired geometric tokens gently floating in hero background.
 */
export const AmbientFloatingDecor: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10">
      {/* Top Left: Battle Star / Victory Diamond */}
      <div className="absolute top-16 left-4 sm:left-12 animate-festra-float opacity-75">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
          <polygon points="21,3 27,15 39,21 27,27 21,39 15,27 3,21 15,15" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
          <circle cx="21" cy="21" r="3" fill="#2563eb" />
        </svg>
      </div>

      {/* Top Right: Holographic Tech Shield */}
      <div className="absolute top-20 right-4 sm:right-16 animate-festra-float-reverse opacity-75">
        <svg width="46" height="52" viewBox="0 0 46 52" fill="none">
          <path d="M 23 4 L 40 10 L 40 28 Q 40 44 23 48 Q 6 44 6 28 L 6 10 Z" fill="#eff6ff" stroke="#60a5fa" strokeWidth="1.5" />
          <path d="M 23 12 L 32 16 L 32 26 Q 32 36 23 40 Q 14 36 14 26 L 14 16 Z" fill="#dbeafe" opacity="0.6" />
        </svg>
      </div>

      {/* Bottom Left: Tactical Scope Reticle */}
      <div className="absolute bottom-12 left-6 sm:left-20 animate-festra-float-reverse opacity-60">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="18" stroke="#93c5fd" strokeWidth="1.2" strokeDasharray="4 4" />
          <circle cx="24" cy="24" r="8" stroke="#3b82f6" strokeWidth="1" />
          <line x1="24" y1="2" x2="24" y2="10" stroke="#3b82f6" strokeWidth="1.5" />
          <line x1="24" y1="38" x2="24" y2="46" stroke="#3b82f6" strokeWidth="1.5" />
          <line x1="2" y1="24" x2="10" y2="24" stroke="#3b82f6" strokeWidth="1.5" />
          <line x1="38" y1="24" x2="46" y2="24" stroke="#3b82f6" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Bottom Right: Supply Crate / Tech Token */}
      <div className="absolute bottom-16 right-6 sm:right-24 animate-festra-float opacity-70">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <rect x="6" y="6" width="32" height="32" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
          <line x1="6" y1="6" x2="38" y2="38" stroke="#93c5fd" strokeWidth="1.2" />
          <line x1="38" y1="6" x2="6" y2="38" stroke="#93c5fd" strokeWidth="1.2" />
          <rect x="16" y="16" width="12" height="12" rx="3" fill="#2563eb" />
        </svg>
      </div>
    </div>
  );
};
