"use client";

import React from "react";
import { useFestraStore } from "@/lib/store";
import {
  Sparkles,
  Trophy,
  Layers,
  Award,
  FileCheck2,
  Wifi,
  WifiOff,
  QrCode,
  Compass,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isOfflineMode,
    toggleOfflineMode,
    offlineScannedCount,
    scanTicketOffline,
  } = useFestraStore();

  const navItems = [
    { id: "explore", label: "Explore", icon: Compass },
    { id: "fest", label: "Fest Hub", icon: Layers },
    { id: "pipeline", label: "Hack Pipeline", icon: Sparkles },
    { id: "judging", label: "Judge Studio", icon: FileCheck2 },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "certificates", label: "Cert Studio", icon: Award },
    { id: "naac", label: "NAAC Dossier", icon: FileCheck2 },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("explore")}
            className="flex items-center gap-2.5 transition hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-violet via-brand-coral to-brand-amber shadow-glow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg font-black tracking-tight text-white">
                FESTRA<span className="text-brand-coral">.</span>
              </span>
              <span className="text-[10px] font-medium tracking-wider text-zinc-400">
                CAMPUS EVENT OS
              </span>
            </div>
          </button>

          <div className="hidden h-5 w-px bg-zinc-800 md:block" />

          {/* Institutional anchor badge */}
          <div className="hidden items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-xs text-zinc-300 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>NIT Trichy</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">Pragyan &apos;26</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 rounded-full border border-zinc-800/80 bg-zinc-900/60 p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white text-zinc-950 shadow-sm font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Quick Offline PWA Check-In Tool */}
        <div className="flex items-center gap-2">
          {/* Offline Mode Switch */}
          <button
            onClick={toggleOfflineMode}
            title="Toggle simulated offline PWA mode for auditoriums without Wi-Fi"
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              isOfflineMode
                ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Offline Mode</span>
              </>
            ) : (
              <>
                <Wifi className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Cloud Synced</span>
              </>
            )}
          </button>

          {/* Quick Scan Badge */}
          <button
            onClick={scanTicketOffline}
            className="flex items-center gap-1.5 rounded-lg border border-brand-violet/40 bg-brand-violet/20 px-3 py-1.5 text-xs font-semibold text-brand-violet hover:bg-brand-violet/30 transition shadow-sm"
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>Scan Ticket</span>
            <span className="rounded-full bg-brand-violet/40 px-1.5 py-0.2 text-[10px] text-white">
              {offlineScannedCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sub-navigation bar */}
      <div className="flex lg:hidden overflow-x-auto border-t border-zinc-800/60 bg-zinc-950 px-2 py-1.5 no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${
                  isActive ? "bg-white text-zinc-950 font-semibold" : "text-zinc-400"
                }`}
              >
                <Icon className="h-3 w-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
