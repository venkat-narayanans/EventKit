"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import {
  Trophy,
  Sparkles,
  Zap,
  Shield,
  Award,
  GitBranch,
  QrCode,
  Volume2,
  VolumeX,
  ChevronRight,
  Flame,
  CheckCircle2,
  ArrowRight,
  Users,
  Target,
  Clock,
  ExternalLink,
  Code2,
  Star,
  Swords,
  Box,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  playButtonPop,
  playReadyUpSound,
  playLootOpenSound,
  playVictorySound,
  toggleSound,
  isSoundEnabled,
} from "@/lib/audio";

interface LootItem {
  id: string;
  name: string;
  tier: "mythic" | "legendary" | "epic" | "rare" | "uncommon";
  category: string;
  power: string;
  description: string;
  stats: { label: string; value: string }[];
  vbucksReward: number;
}

const LOOT_ITEMS: LootItem[] = [
  {
    id: "loot-naac",
    name: "MYTHIC ACCREDITATION SHIELD",
    tier: "mythic",
    category: "Institutional Defense",
    power: "Instant IQAC Approval",
    description: "Auto-generates Criterion 3.3.2 & 5.3.3 official dossiers with verified attendance and college reach. Dean-approved in 1 click.",
    stats: [
      { label: "NAAC Audit Speed", value: "0.2s" },
      { label: "Paperwork Eliminated", value: "100%" },
    ],
    vbucksReward: 500,
  },
  {
    id: "loot-zscore",
    name: "LEGENDARY Z-SCORE SNIPER",
    tier: "legendary",
    category: "Jury Normalizer",
    power: "Eliminates Harsh Judges",
    description: "Applies Gaussian standard deviation normalization across all juries. Mild and harsh judges calibrated automatically.",
    stats: [
      { label: "Jury Bias", value: "0.0%" },
      { label: "Fairness Index", value: "99.9%" },
    ],
    vbucksReward: 400,
  },
  {
    id: "loot-cert",
    name: "EPIC BYOD CERTIFICATE LAUNCHER",
    tier: "epic",
    category: "Vector Studio",
    power: "Canva & Figma Upload",
    description: "Upload any custom artwork, position dynamic variables, auto-scale long student names, and output 300 DPI vectors with LinkedIn verification.",
    stats: [
      { label: "Resolution", value: "1920x1080" },
      { label: "LinkedIn 1-Click", value: "Active" },
    ],
    vbucksReward: 300,
  },
  {
    id: "loot-git",
    name: "RARE GIT COMMIT RADAR",
    tier: "rare",
    category: "Anti-Plagiarism Radar",
    power: "Catches 11th-Hour Dumps",
    description: "Monitors continuous commit frequency over the 24h sprint window. Flags unverified pre-built zip uploads instantly.",
    stats: [
      { label: "Commit Check", value: "Real-Time" },
      { label: "Zip Plagiarism", value: "Blocked" },
    ],
    vbucksReward: 250,
  },
  {
    id: "loot-wallet",
    name: "UNCOMMON APPLE WALLET PASS",
    tier: "uncommon",
    category: "Gate Access",
    power: "Instant QR Check-In",
    description: "Mobile-ready wallet tickets with encrypted barcodes and bank UTR resolver. 100% duplicate scan prevention at entrance.",
    stats: [
      { label: "Gate Scan Time", value: "0.8s" },
      { label: "Fake Passes", value: "0 Allowed" },
    ],
    vbucksReward: 150,
  },
];

const BATTLE_PASS_TIERS = [
  { tier: 1, name: "Drop In & Squad Up", reward: "Apple Wallet Admit Pass", status: "Unlocked", unlocked: true },
  { tier: 20, name: "Abstract Freeze", reward: "Phase 1 Architecture Lock", status: "Checkpoint", unlocked: true },
  { tier: 40, name: "Prototype Sprint", reward: "Slurp Boost & Midway Git Check", status: "Checkpoint", unlocked: true },
  { tier: 60, name: "Supply Drop Code Freeze", reward: "Phase 3 Repo Freeze & Webhook", status: "Critical", unlocked: true },
  { tier: 80, name: "The Storm Pitch", reward: "Live Normalized Jury Scoring", status: "Final Circle", unlocked: true },
  { tier: 100, name: "#1 VICTORY ROYALE", reward: "₹55k Bounty + LinkedIn Trophy", status: "Mythic Reward", unlocked: true },
];

export const FortniteLandingPage: React.FC = () => {
  const { setViewMode, events, selectedEventId } = useStore();
  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const [soundOn, setSoundOn] = useState(true);
  const [vbucks, setVbucks] = useState(2500);

  // Supply Drop State
  const [supplyDropOpened, setSupplyDropOpened] = useState(false);
  const [currentLoot, setCurrentLoot] = useState<LootItem>(LOOT_ITEMS[0]);
  const [lootCount, setLootCount] = useState(0);

  // Battle Pass State
  const [selectedPassTier, setSelectedPassTier] = useState(100);

  // Squad Lobby State
  const [customGamerTag, setCustomGamerTag] = useState("PixelWarrior");
  const [selectedClass, setSelectedClass] = useState("Full-Stack Slayer");
  const [isReady, setIsReady] = useState(false);

  // Victory Royale Fullscreen Overlay
  const [showVictoryRoyale, setShowVictoryRoyale] = useState(false);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleOpenSupplyDrop = () => {
    playLootOpenSound();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ffe600", "#00f0ff", "#a855f7", "#10b981", "#f97316"],
    });

    const nextIndex = (lootCount + 1) % LOOT_ITEMS.length;
    const awardedLoot = LOOT_ITEMS[nextIndex];
    setCurrentLoot(awardedLoot);
    setSupplyDropOpened(true);
    setLootCount((prev) => prev + 1);
    setVbucks((prev) => prev + awardedLoot.vbucksReward);
  };

  const handleReadyUp = () => {
    playReadyUpSound();
    setIsReady(!isReady);
    if (!isReady) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10b981", "#00f0ff", "#ffe600"],
      });
      setVbucks((prev) => prev + 200);
    }
  };

  const triggerVictoryRoyaleCelebration = () => {
    playVictorySound();
    setShowVictoryRoyale(true);
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      colors: ["#ffe600", "#ffffff", "#00f0ff", "#a855f7"],
    });
  };

  const getTierBadgeStyle = (tier: LootItem["tier"]) => {
    switch (tier) {
      case "mythic":
        return "bg-gradient-to-r from-amber-400 to-yellow-500 text-black border-yellow-200 shadow-[0_0_15px_rgba(255,230,0,0.8)]";
      case "legendary":
        return "bg-gradient-to-r from-orange-500 to-amber-600 text-black border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.8)]";
      case "epic":
        return "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.8)]";
      case "rare":
        return "bg-gradient-to-r from-cyan-500 to-blue-600 text-black border-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.8)]";
      case "uncommon":
        return "bg-gradient-to-r from-emerald-400 to-green-600 text-black border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.8)]";
    }
  };

  const getCardBorderStyle = (tier: LootItem["tier"]) => {
    switch (tier) {
      case "mythic":
        return "border-amber-400 hover:shadow-[0_0_25px_rgba(255,230,0,0.6)]";
      case "legendary":
        return "border-orange-500 hover:shadow-[0_0_25px_rgba(249,115,22,0.6)]";
      case "epic":
        return "border-purple-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]";
      case "rare":
        return "border-cyan-400 hover:shadow-[0_0_25px_rgba(0,240,255,0.6)]";
      case "uncommon":
        return "border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]";
    }
  };

  return (
    <div className="min-h-screen bg-fortnite-grid text-white font-sans selection:bg-amber-400 selection:text-black overflow-x-hidden relative">
      {/* FULL-SCREEN VICTORY ROYALE CELEBRATION MODAL */}
      {showVictoryRoyale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="max-w-2xl w-full text-center space-y-6 relative">
            <button
              onClick={() => setShowVictoryRoyale(false)}
              className="absolute -top-10 right-0 text-zinc-400 hover:text-white font-hud text-xl uppercase tracking-wider"
            >
              [CLOSE ESC]
            </button>

            {/* Huge Victory Royale Ribbon */}
            <div className="relative inline-block transform -rotate-2 scale-105 sm:scale-125">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 blur-xl opacity-70 animate-pulse" />
              <div className="relative rounded-2xl border-4 border-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 px-8 py-4 fortnite-card-shadow-lg">
                <div className="flex items-center justify-center gap-2">
                  <Star className="h-8 w-8 text-black fill-black animate-spin" style={{ animationDuration: "8s" }} />
                  <h1 className="font-fortnite text-4xl sm:text-6xl text-black tracking-wider uppercase stroke-black drop-shadow-[0_4px_0_rgba(0,0,0,0.4)]">
                    #1 VICTORY ROYALE!
                  </h1>
                  <Star className="h-8 w-8 text-black fill-black animate-spin" style={{ animationDuration: "8s" }} />
                </div>
                <div className="font-hud text-black text-lg sm:text-xl tracking-widest font-black uppercase mt-1">
                  CAMPUS BATTLE PASS COMPLETED • FESTRA CHAMPION
                </div>
              </div>
            </div>

            <div className="rounded-3xl border-3 border-black bg-[#121324] p-6 sm:p-8 space-y-4 fortnite-card-shadow-lg text-left max-w-xl mx-auto">
              <div className="flex items-center justify-between border-b-2 border-white/10 pb-3">
                <span className="font-hud text-lg uppercase text-cyan-400">Match Rewards Claimed</span>
                <span className="font-hud text-amber-400 text-lg">Ⓥ +2,500 HACK-BUCKS</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-zinc-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>Verified 1st Place Standing in {currentEvent.title}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>Official Cryptographic Completion Credential (LinkedIn Ready)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>Institutional NAAC IQAC Compliance Logged for College</span>
                </li>
              </ul>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  onClick={() => {
                    setShowVictoryRoyale(false);
                    setViewMode("portal");
                  }}
                  className="rounded-xl border-2 border-black bg-gradient-to-r from-cyan-400 to-blue-500 py-3 font-fortnite text-black text-sm uppercase fortnite-btn text-center"
                >
                  View Squad Pass
                </button>
                <button
                  onClick={() => {
                    setShowVictoryRoyale(false);
                    setViewMode("dashboard");
                  }}
                  className="rounded-xl border-2 border-black bg-gradient-to-r from-amber-400 to-yellow-500 py-3 font-fortnite text-black text-sm uppercase fortnite-btn text-center"
                >
                  Leaderboard Podiums
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOP FORTNITE SEASON HUD BAR */}
      <div className="sticky top-0 z-40 w-full border-b-3 border-black bg-[#0d0e1b]/95 backdrop-blur-xl px-4 py-2.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Battle Pass Season */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 transform -skew-x-6">
              <div className="h-9 w-9 rounded-xl border-2 border-black bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 flex items-center justify-center font-fortnite text-black text-xl fortnite-card-shadow">
                F
              </div>
              <span className="font-fortnite text-2xl tracking-wider text-white uppercase fortnite-stroke">
                FESTRA
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 rounded-lg border-2 border-black bg-cyan-400/20 px-2.5 py-1 transform -skew-x-6">
              <Flame className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-hud text-xs text-cyan-300 tracking-wider uppercase">
                SEASON 1: CAMPUS ROYALE
              </span>
            </div>
          </div>

          {/* V-Bucks & Audio Controls & Mode Switch */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hack-Bucks Counter */}
            <div
              onClick={() => {
                playButtonPop();
                setVbucks((v) => v + 100);
              }}
              title="Click to earn Hack-Bucks!"
              className="cursor-pointer flex items-center gap-1.5 rounded-xl border-2 border-black bg-amber-400/20 hover:bg-amber-400/30 px-3 py-1 transform -skew-x-6 transition fortnite-card-shadow"
            >
              <div className="h-5 w-5 rounded-full bg-amber-400 border border-black flex items-center justify-center font-black text-[11px] text-black">
                Ⓥ
              </div>
              <span className="font-hud text-sm font-bold text-amber-300 tracking-wider">
                {vbucks.toLocaleString()}
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundOn ? "Mute Game SFX" : "Unmute Game SFX"}
              className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-[#1a1b2e] hover:bg-[#25263d] text-zinc-300 hover:text-white transition transform -skew-x-6"
            >
              {soundOn ? <Volume2 className="h-4 w-4 text-cyan-400" /> : <VolumeX className="h-4 w-4 text-zinc-500" />}
            </button>

            {/* Direct App Mode Buttons */}
            <button
              onClick={() => {
                playButtonPop();
                setViewMode("portal");
              }}
              className="rounded-xl border-2 border-black bg-gradient-to-r from-cyan-400 to-blue-500 px-3.5 py-1.5 font-fortnite text-xs text-black uppercase tracking-wider fortnite-btn hidden sm:block"
            >
              Drop In (Student)
            </button>
            <button
              onClick={() => {
                playButtonPop();
                setViewMode("dashboard");
              }}
              className="rounded-xl border-2 border-black bg-gradient-to-r from-amber-400 to-yellow-500 px-3.5 py-1.5 font-fortnite text-xs text-black uppercase tracking-wider fortnite-btn"
            >
              Command Tower
            </button>
          </div>
        </div>
      </div>

      {/* HERO SECTION: CAMPUS ROYALE */}
      <section className="relative px-4 pt-10 sm:pt-16 pb-12 sm:pb-20 max-w-7xl mx-auto overflow-hidden">
        {/* Glow Halftone Blobs */}
        <div className="absolute top-0 right-1/4 h-96 w-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-10 h-80 w-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-6 sm:space-y-8 relative z-10">
          {/* Battle Bus Status Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#17182c] px-4 py-1.5 transform -skew-x-6 fortnite-card-shadow">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-hud text-xs sm:text-sm tracking-widest text-yellow-300 uppercase font-black">
              🚌 BATTLE BUS INBOUND: {currentEvent.title}
            </span>
          </div>

          {/* Epic Main Headline */}
          <div className="space-y-2">
            <h1 className="font-fortnite text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase fortnite-stroke text-white leading-none transform -rotate-1">
              SURVIVE THE <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">CODE SPRINT</span>
            </h1>
            <h2 className="font-fortnite text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight uppercase fortnite-stroke text-cyan-400 leading-none transform rotate-1">
              CLAIM THE <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">VICTORY ROYALE!</span>
            </h2>
          </div>

          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-zinc-300 font-medium leading-relaxed">
            The high-octane operations battleground for engineering colleges, hackathons, and symposiums.
            Replace the disconnected Google Franken-stack with automated git commit radar, fair $Z$-Score judging, and 1-click NAAC accreditation dossiers.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                playReadyUpSound();
                setViewMode("portal");
              }}
              className="rounded-2xl border-3 border-black bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 px-8 py-4 font-fortnite text-black text-lg sm:text-xl uppercase tracking-wider fortnite-btn flex items-center gap-2.5"
            >
              <Zap className="h-6 w-6 fill-black text-black" />
              <span>DROP IN & SQUAD UP</span>
              <ChevronRight className="h-6 w-6 stroke-[3]" />
            </button>

            <button
              onClick={() => {
                playButtonPop();
                setViewMode("dashboard");
              }}
              className="rounded-2xl border-3 border-black bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 px-7 py-4 font-fortnite text-black text-lg sm:text-xl uppercase tracking-wider fortnite-btn flex items-center gap-2.5"
            >
              <Swords className="h-6 w-6 text-black" />
              <span>ORGANIZER TOWER</span>
            </button>

            <button
              onClick={triggerVictoryRoyaleCelebration}
              className="rounded-2xl border-3 border-black bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 px-6 py-4 font-fortnite text-white text-base sm:text-lg uppercase tracking-wider fortnite-btn flex items-center gap-2"
            >
              <Trophy className="h-5 w-5 fill-yellow-300 text-yellow-300" />
              <span>VICTORY ROYALE</span>
            </button>
          </div>

          {/* Arena Ticker Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6 text-center">
            <div className="rounded-2xl border-2 border-black bg-[#121324] p-3.5 transform -skew-x-3 fortnite-card-shadow">
              <div className="font-hud text-xs text-zinc-400 uppercase tracking-widest">Lobby Capacity</div>
              <div className="font-fortnite text-2xl sm:text-3xl text-amber-400 mt-0.5">50 SQUADS</div>
            </div>
            <div className="rounded-2xl border-2 border-black bg-[#121324] p-3.5 transform -skew-x-3 fortnite-card-shadow">
              <div className="font-hud text-xs text-zinc-400 uppercase tracking-widest">Bounty Pool</div>
              <div className="font-fortnite text-2xl sm:text-3xl text-emerald-400 mt-0.5">{currentEvent.prizes.pool}</div>
            </div>
            <div className="rounded-2xl border-2 border-black bg-[#121324] p-3.5 transform -skew-x-3 fortnite-card-shadow">
              <div className="font-hud text-xs text-zinc-400 uppercase tracking-widest">Jury Normalization</div>
              <div className="font-fortnite text-2xl sm:text-3xl text-cyan-400 mt-0.5">Z-SCORE (0% BIAS)</div>
            </div>
            <div className="rounded-2xl border-2 border-black bg-[#121324] p-3.5 transform -skew-x-3 fortnite-card-shadow">
              <div className="font-hud text-xs text-zinc-400 uppercase tracking-widest">Accreditation Dossier</div>
              <div className="font-fortnite text-2xl sm:text-3xl text-purple-400 mt-0.5">1-CLICK NAAC</div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FEATURE 1: SUPPLY DROP UNBOXER */}
      <section className="px-4 py-12 max-w-5xl mx-auto">
        <div className="rounded-3xl border-3 border-black bg-[#111222] p-6 sm:p-10 fortnite-card-shadow-lg relative overflow-hidden">
          {/* Accent Hazard Pattern */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-400 via-cyan-400 to-purple-500" />

          <div className="text-center space-y-2 mb-8">
            <span className="font-hud text-xs sm:text-sm text-cyan-400 uppercase tracking-widest font-bold">
              [INTERACTIVE MINIGAME]
            </span>
            <h2 className="font-fortnite text-3xl sm:text-4xl uppercase fortnite-stroke text-white tracking-wide">
              CRACK OPEN THE FESTRA SUPPLY DROP!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              Tap the supply crate below to unbox randomized Mythic, Legendary, and Epic tools that eliminate campus event operational friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* The Supply Drop Box Button */}
            <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4">
              <div
                onClick={handleOpenSupplyDrop}
                className="cursor-pointer group relative transform transition hover:scale-105 active:scale-95"
              >
                {/* Floating Balloon */}
                <div className="h-16 w-16 mx-auto rounded-full bg-cyan-400 border-2 border-black flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.7)] animate-bounce">
                  <Box className="h-8 w-8 text-black" />
                </div>
                <div className="h-6 w-0.5 bg-cyan-300 mx-auto" />

                {/* Wooden / Metal Crate */}
                <div className="w-48 h-48 rounded-3xl border-4 border-black bg-gradient-to-b from-amber-500 via-amber-600 to-amber-800 p-4 fortnite-card-shadow-lg flex flex-col items-center justify-center text-center space-y-2 group-hover:shadow-[0_0_35px_rgba(255,230,0,0.8)] transition">
                  <span className="font-fortnite text-4xl text-yellow-300 fortnite-stroke">
                    📦
                  </span>
                  <span className="font-fortnite text-lg text-white uppercase tracking-wider fortnite-stroke leading-tight">
                    OPEN SUPPLY DROP
                  </span>
                  <span className="font-hud text-[11px] text-amber-200 uppercase font-black">
                    TAP TO UNBOX (+V-BUCKS)
                  </span>
                </div>
              </div>

              <div className="font-hud text-xs text-zinc-400 uppercase tracking-wider text-center">
                Unboxed Drops: <span className="text-yellow-400 font-bold">{lootCount}</span> • Tap crate to cycle all loot!
              </div>
            </div>

            {/* Revealed Loot Card */}
            <div className="md:col-span-7">
              <div
                className={`rounded-3xl border-3 bg-[#0d0e1b] p-6 sm:p-7 space-y-4 fortnite-card-shadow transition duration-300 ${getCardBorderStyle(
                  currentLoot.tier
                )}`}
              >
                <div className="flex items-center justify-between border-b-2 border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-0.5 font-hud text-xs uppercase font-black border ${getTierBadgeStyle(
                        currentLoot.tier
                      )}`}
                    >
                      {currentLoot.tier}
                    </span>
                    <span className="font-hud text-xs text-zinc-400 uppercase">
                      {currentLoot.category}
                    </span>
                  </div>
                  <span className="font-hud text-xs text-amber-400 font-bold">
                    +Ⓥ {currentLoot.vbucksReward} HACK-BUCKS
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-fortnite text-2xl text-white uppercase tracking-wide">
                    {currentLoot.name}
                  </h3>
                  <div className="font-hud text-sm text-cyan-300 uppercase tracking-wider">
                    Special Ability: {currentLoot.power}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-1">
                    {currentLoot.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {currentLoot.stats.map((st, i) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-[#16172e] p-3 text-center">
                      <div className="font-hud text-[11px] text-zinc-400 uppercase">{st.label}</div>
                      <div className="font-fortnite text-lg text-amber-300 mt-0.5">{st.value}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-between items-center text-xs text-zinc-400">
                  <span>Cryptographically verified by FESTRA Engine</span>
                  <button
                    onClick={handleOpenSupplyDrop}
                    className="font-hud text-xs text-cyan-400 hover:text-cyan-300 uppercase underline"
                  >
                    Unbox Next Loot Item →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOOT LOADOUT GRID: ALL FEATURES AS FORTNITE WEAPON CARDS */}
      <section className="px-4 py-12 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="font-hud text-xs sm:text-sm text-yellow-400 uppercase tracking-widest font-black">
            [LEGENDARY LOADOUT]
          </span>
          <h2 className="font-fortnite text-3xl sm:text-5xl uppercase fortnite-stroke text-white tracking-wide">
            THE ALL-IN-ONE FESTRA ARSENAL
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Everything your college needs to defeat administrative overhead, uncoordinated judges, and delayed results.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LOOT_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`rounded-3xl border-3 bg-[#111224] p-6 space-y-4 transform hover:-translate-y-1.5 transition duration-200 fortnite-card-shadow ${getCardBorderStyle(
                item.tier
              )}`}
            >
              <div className="flex items-center justify-between border-b-2 border-white/10 pb-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 font-hud text-[11px] uppercase font-black border ${getTierBadgeStyle(
                    item.tier
                  )}`}
                >
                  {item.tier}
                </span>
                <span className="font-hud text-xs text-zinc-400 uppercase tracking-wider">
                  ★★★★★
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-fortnite text-xl text-white uppercase tracking-wide leading-tight">
                  {item.name}
                </h3>
                <div className="font-hud text-xs text-cyan-300 uppercase tracking-wider">
                  {item.power}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-center">
                {item.stats.map((st, i) => (
                  <div key={i} className="rounded-lg bg-black/40 p-2">
                    <div className="font-hud text-[10px] text-zinc-400 uppercase truncate">{st.label}</div>
                    <div className="font-fortnite text-base text-amber-300">{st.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Bonus 6th Card: Zero-Cost Serverless Cloud */}
          <div className="rounded-3xl border-3 border-cyan-400 bg-[#111224] p-6 space-y-4 transform hover:-translate-y-1.5 transition duration-200 fortnite-card-shadow hover:shadow-[0_0_25px_rgba(0,240,255,0.6)]">
            <div className="flex items-center justify-between border-b-2 border-white/10 pb-3">
              <span className="rounded-full px-2.5 py-0.5 font-hud text-[11px] uppercase font-black border bg-gradient-to-r from-cyan-400 to-blue-500 text-black border-cyan-200">
                MYTHIC ARCHITECTURE
              </span>
              <span className="font-hud text-xs text-cyan-300 uppercase tracking-wider">
                &lt; ₹1k / MO
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-fortnite text-xl text-white uppercase tracking-wide leading-tight">
                ZERO-COST SCALE TO ZERO
              </h3>
              <div className="font-hud text-xs text-cyan-300 uppercase tracking-wider">
                Cloudflare R2 + Supabase Free Tier
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Zero idle server billing. Automated keep-alive cron prevents the Supabase 7-day sleep cycle, keeping the entire platform running permanently under ₹1,000/month.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-center">
              <div className="rounded-lg bg-black/40 p-2">
                <div className="font-hud text-[10px] text-zinc-400 uppercase">Monthly Cost</div>
                <div className="font-fortnite text-base text-emerald-400">&lt; ₹850</div>
              </div>
              <div className="rounded-lg bg-black/40 p-2">
                <div className="font-hud text-[10px] text-zinc-400 uppercase">7-Day Sleep</div>
                <div className="font-fortnite text-base text-yellow-300">Prevented</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FEATURE 2: BATTLE PASS TIER TRACKER */}
      <section className="px-4 py-12 max-w-7xl mx-auto">
        <div className="rounded-3xl border-3 border-black bg-[#111222] p-6 sm:p-10 fortnite-card-shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-white/10 pb-4">
            <div>
              <span className="font-hud text-xs sm:text-sm text-amber-400 uppercase tracking-widest font-black">
                [HACKATHON LIFECYCLE TRACKER]
              </span>
              <h2 className="font-fortnite text-2xl sm:text-4xl uppercase fortnite-stroke text-white tracking-wide">
                THE FESTRA EVENT PASS: TIERS 1 TO 100
              </h2>
            </div>

            <button
              onClick={triggerVictoryRoyaleCelebration}
              className="rounded-xl border-2 border-black bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2 font-fortnite text-xs text-black uppercase tracking-wider fortnite-btn self-start sm:self-auto"
            >
              Claim Tier 100 Royale 🎉
            </button>
          </div>

          {/* Interactive Tier Clickable Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {BATTLE_PASS_TIERS.map((tier) => {
              const isSelected = selectedPassTier === tier.tier;
              return (
                <div
                  key={tier.tier}
                  onClick={() => {
                    playButtonPop();
                    setSelectedPassTier(tier.tier);
                  }}
                  className={`cursor-pointer rounded-2xl border-2 p-4 text-center space-y-2 transition transform hover:-translate-y-1 ${
                    isSelected
                      ? "border-amber-400 bg-amber-400/20 ring-2 ring-amber-400/60 shadow-[0_0_15px_rgba(255,230,0,0.6)]"
                      : "border-black bg-[#16172e] hover:border-white/20"
                  }`}
                >
                  <div className="font-fortnite text-xl sm:text-2xl text-yellow-300">
                    TIER {tier.tier}
                  </div>
                  <div className="font-hud text-xs text-white uppercase font-bold truncate">
                    {tier.name}
                  </div>
                  <div className="text-[11px] text-zinc-400 line-clamp-2">
                    {tier.reward}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Tier Deep-Dive Preview */}
          <div className="rounded-2xl border-2 border-black bg-[#0d0e1b] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-hud text-xs text-cyan-400 uppercase tracking-widest font-bold">
                Selected Battle Milestone: Tier {selectedPassTier}
              </div>
              <div className="font-fortnite text-xl sm:text-2xl text-white uppercase">
                {BATTLE_PASS_TIERS.find((t) => t.tier === selectedPassTier)?.name}
              </div>
              <div className="text-xs sm:text-sm text-zinc-300">
                Reward: <span className="text-amber-300 font-semibold">{BATTLE_PASS_TIERS.find((t) => t.tier === selectedPassTier)?.reward}</span>
              </div>
            </div>

            <button
              onClick={() => {
                playButtonPop();
                if (selectedPassTier <= 40) setViewMode("portal");
                else setViewMode("dashboard");
              }}
              className="rounded-xl border-2 border-black bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-2.5 font-fortnite text-black text-sm uppercase tracking-wider fortnite-btn flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Inspect in App</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FEATURE 3: SQUAD LOBBY READY-UP SIMULATOR */}
      <section className="px-4 py-12 max-w-5xl mx-auto">
        <div className="rounded-3xl border-3 border-black bg-[#111222] p-6 sm:p-10 fortnite-card-shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <span className="font-hud text-xs sm:text-sm text-cyan-400 uppercase tracking-widest font-black">
              [SQUAD SPAWN LOBBY]
            </span>
            <h2 className="font-fortnite text-3xl sm:text-4xl uppercase fortnite-stroke text-white tracking-wide">
              ASSEMBLE YOUR 4-PERSON HACK SQUAD
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              Ready up with your team members before deploying into the 24-hour sprint arena.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Slot 1: Lead (Fixed ready) */}
            <div className="rounded-2xl border-2 border-black bg-[#17182c] p-4 text-center space-y-2 relative overflow-hidden">
              <div className="h-16 w-16 mx-auto rounded-full bg-blue-500 border-2 border-black flex items-center justify-center font-fortnite text-2xl text-white">
                AK
              </div>
              <div className="font-fortnite text-base text-white">Aditya Krishnan</div>
              <div className="font-hud text-xs text-cyan-300 uppercase">Squad Lead (Full-Stack)</div>
              <span className="inline-block rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-hud text-xs px-3 py-0.5 uppercase font-bold">
                ✓ READY
              </span>
            </div>

            {/* Slot 2: UI Architect */}
            <div className="rounded-2xl border-2 border-black bg-[#17182c] p-4 text-center space-y-2 relative overflow-hidden">
              <div className="h-16 w-16 mx-auto rounded-full bg-purple-500 border-2 border-black flex items-center justify-center font-fortnite text-2xl text-white">
                PS
              </div>
              <div className="font-fortnite text-base text-white">Priya Sharma</div>
              <div className="font-hud text-xs text-purple-300 uppercase">UI/UX Alchemist</div>
              <span className="inline-block rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-hud text-xs px-3 py-0.5 uppercase font-bold">
                ✓ READY
              </span>
            </div>

            {/* Slot 3: Backend Titan */}
            <div className="rounded-2xl border-2 border-black bg-[#17182c] p-4 text-center space-y-2 relative overflow-hidden">
              <div className="h-16 w-16 mx-auto rounded-full bg-amber-500 border-2 border-black flex items-center justify-center font-fortnite text-2xl text-white">
                KR
              </div>
              <div className="font-fortnite text-base text-white">Karthik Rao</div>
              <div className="font-hud text-xs text-amber-300 uppercase">Rust / Systems Titan</div>
              <span className="inline-block rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-hud text-xs px-3 py-0.5 uppercase font-bold">
                ✓ READY
              </span>
            </div>

            {/* Slot 4: YOU (Interactive Player Slot) */}
            <div
              className={`rounded-2xl border-2 p-4 text-center space-y-2 transition ${
                isReady
                  ? "border-emerald-400 bg-emerald-500/10 ring-2 ring-emerald-400/50"
                  : "border-black bg-[#17182c]"
              }`}
            >
              <div className="h-16 w-16 mx-auto rounded-full bg-cyan-400 border-2 border-black flex items-center justify-center font-fortnite text-2xl text-black">
                YOU
              </div>
              <input
                type="text"
                value={customGamerTag}
                onChange={(e) => setCustomGamerTag(e.target.value)}
                placeholder="Your Gamer Tag"
                className="w-full text-center bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-fortnite focus:outline-none"
              />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full text-center bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-cyan-300 font-hud focus:outline-none cursor-pointer"
              >
                <option value="Full-Stack Slayer">Full-Stack Slayer</option>
                <option value="AI Prompt Sniper">AI Prompt Sniper</option>
                <option value="Pitch Deck General">Pitch Deck General</option>
                <option value="Bug Terminator">Bug Terminator</option>
              </select>

              <button
                onClick={handleReadyUp}
                className={`w-full rounded-xl border-2 border-black py-1.5 font-fortnite text-xs uppercase tracking-wider fortnite-btn ${
                  isReady
                    ? "bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.7)]"
                    : "bg-amber-400 text-black"
                }`}
              >
                {isReady ? "✓ SQUAD READY!" : "READY UP!"}
              </button>
            </div>
          </div>

          {/* Lobby Status Action */}
          {isReady && (
            <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-500/20 p-4 text-center space-y-2 animate-in fade-in duration-300">
              <div className="font-fortnite text-xl text-emerald-300 uppercase">
                ⚡ SQUAD 4/4 FULLY ASSEMBLED!
              </div>
              <p className="text-xs text-zinc-300">
                Squad [{customGamerTag}] is ready to jump. Proceed to the Student Registration Portal to lock in your squad's admit pass!
              </p>
              <button
                onClick={() => {
                  playReadyUpSound();
                  setViewMode("portal");
                }}
                className="rounded-xl border-2 border-black bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 px-6 py-2.5 font-fortnite text-black text-sm uppercase tracking-wider fortnite-btn inline-flex items-center gap-2"
              >
                <span>CLAIM DIGITAL SQUAD PASS NOW</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* VS SECTION: THE STORM CIRCLE (GOOGLE FRANKEN-STACK VS FESTRA) */}
      <section className="px-4 py-12 max-w-5xl mx-auto">
        <div className="rounded-3xl border-3 border-black bg-[#111222] p-6 sm:p-10 fortnite-card-shadow-lg space-y-8">
          <div className="text-center space-y-2">
            <span className="font-hud text-xs sm:text-sm text-purple-400 uppercase tracking-widest font-black">
              [THE STORM IS CLOSING IN]
            </span>
            <h2 className="font-fortnite text-3xl sm:text-5xl uppercase fortnite-stroke text-white tracking-wide">
              ELIMINATE THE FRANKEN-STACK
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              Why running college hackathons on disconnected WhatsApp groups and Google Sheets is a recipe for chaos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IN THE STORM (The Chaos of Legacy Tools) */}
            <div className="rounded-2xl border-3 border-red-500/50 bg-red-950/20 p-6 space-y-4 fortnite-card-shadow">
              <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
                <span className="font-fortnite text-red-400 text-lg uppercase tracking-wide">
                  ☠️ TRAPPED IN THE STORM
                </span>
                <span className="font-hud text-xs text-red-400 uppercase font-black">
                  LEGACY CHAOS
                </span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>15 disparate Google Sheets that crash when 400 students submit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Lost UPI screenshots in WhatsApp causing admission gate delays.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Harsh vs lenient judge bias sparking post-event student protests.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Typo-ridden Canva certificates taking 3 weeks of manual exports.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Zero NAAC/NIRF accreditation documentation for the Dean's office.</span>
                </li>
              </ul>
            </div>

            {/* IN THE SAFE ZONE (FESTRA) */}
            <div className="rounded-2xl border-3 border-emerald-400 bg-emerald-950/20 p-6 space-y-4 fortnite-card-shadow">
              <div className="flex items-center justify-between border-b border-emerald-400/30 pb-3">
                <span className="font-fortnite text-emerald-400 text-lg uppercase tracking-wide">
                  🛡️ THE SAFE ZONE
                </span>
                <span className="font-hud text-xs text-emerald-400 uppercase font-black">
                  FESTRA PLATFORM
                </span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-200">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Unified real-time event command tower with zero sheet sync lag.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Apple Wallet admit passes with encrypted QR gate verification.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Gaussian $Z$-Score rubric studio that standardizes judge scorecards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>BYOD Canva studio with auto-font scaling and LinkedIn 1-click verification.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Automated NAAC Criteria 3.3.2 & 5.3.3 official accreditation dossiers.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* EPIC CALL TO ACTION FOOTER BANNER */}
      <section className="px-4 py-16 max-w-5xl mx-auto text-center space-y-6">
        <div className="rounded-3xl border-4 border-black bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 p-8 sm:p-12 fortnite-card-shadow-lg text-black space-y-4 transform -rotate-1">
          <h2 className="font-fortnite text-3xl sm:text-5xl uppercase tracking-wider text-black stroke-black">
            READY TO DROP IN?
          </h2>
          <p className="font-hud text-sm sm:text-base text-black max-w-lg mx-auto font-bold uppercase tracking-wider">
            Launch your next college hackathon, symposium, or project expo with mythic operational perfection.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                playReadyUpSound();
                setViewMode("portal");
              }}
              className="rounded-2xl border-3 border-black bg-black text-white hover:bg-zinc-900 px-8 py-3.5 font-fortnite text-base sm:text-lg uppercase tracking-wider fortnite-btn"
            >
              Enter Squad Registration
            </button>
            <button
              onClick={() => {
                playButtonPop();
                setViewMode("dashboard");
              }}
              className="rounded-2xl border-3 border-black bg-cyan-400 text-black hover:bg-cyan-300 px-8 py-3.5 font-fortnite text-base sm:text-lg uppercase tracking-wider fortnite-btn"
            >
              Launch Organizer Tower
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-zinc-500 font-hud tracking-widest uppercase space-y-1">
          <div>FESTRA ENGINE • INSPIRED BY FORTNITE BATTLE ROYALE CRAFT • SEASON 1</div>
          <div>ZERO SERVERLESS IDLE BILLING • DEPLOYED & TESTED LIVE</div>
        </div>
      </section>
    </div>
  );
};
