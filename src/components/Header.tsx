"use client";

import React from "react";
import { useStore } from "@/lib/store";
import {
  Layers,
  GitBranch,
  FileCheck2,
  Trophy,
  Award,
  GraduationCap,
  Plus,
  RefreshCw,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  onOpenCreateEvent: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateEvent }) => {
  const {
    viewMode,
    setViewMode,
    activeSection,
    setActiveSection,
    events,
    selectedEventId,
    setSelectedEventId,
    resetAll,
  } = useStore();

  const sections = [
    { id: "events", label: "Events & Roster", icon: Layers },
    { id: "submissions", label: "Submissions", icon: GitBranch },
    { id: "judging", label: "Rubrics & Judging", icon: FileCheck2 },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "certificates", label: "Cert Studio", icon: Award },
    { id: "compliance", label: "NAAC Dossier", icon: GraduationCap },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#08080a]/90 backdrop-blur-xl">
      {/* Top Application Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6">
        {/* Left: Brand & Event Context */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-devfolio-blue text-white font-black text-sm shadow-luma-glow">
              F
            </div>
            <span className="font-extrabold tracking-tight text-white text-base">
              FESTRA<span className="text-kahoot-red">.</span>
            </span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-white/[0.12]" />

          {/* Event Dropdown Picker */}
          <div className="relative flex items-center gap-1.5">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="appearance-none rounded-lg border border-white/[0.08] bg-[#111114] px-2.5 py-1.5 pr-7 text-xs font-medium text-zinc-200 hover:border-white/[0.2] focus:outline-none cursor-pointer max-w-[140px] sm:max-w-[220px] truncate"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 h-3 w-3 text-zinc-400" />

            <button
              onClick={onOpenCreateEvent}
              title="Create New Event Track"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-[#111114] text-zinc-300 hover:text-white hover:bg-white/[0.06] transition"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Mode Switcher (Organizer vs Student View) */}
        <div className="flex items-center rounded-lg border border-white/[0.08] bg-[#111114] p-0.5 text-xs">
          <button
            onClick={() => setViewMode("dashboard")}
            className={`rounded-md px-2.5 sm:px-3 py-1 font-medium transition ${
              viewMode === "dashboard"
                ? "bg-white text-zinc-950 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Organizer
          </button>
          <button
            onClick={() => setViewMode("portal")}
            className={`rounded-md px-2.5 sm:px-3 py-1 font-medium transition ${
              viewMode === "portal"
                ? "bg-white text-zinc-950 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Student View
          </button>
        </div>

        {/* Right: Reset Action */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (confirm("Reset demo data to default clean state?")) {
                resetAll();
              }
            }}
            title="Reset to clean defaults"
            className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-[#111114] px-2 py-1 text-[11px] font-medium text-zinc-400 hover:text-zinc-200 hover:border-white/[0.15] transition"
          >
            <RefreshCw className="h-3 w-3" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Subnav (for Organizer Studio) with clean horizontal touch scroll */}
      {viewMode === "dashboard" && (
        <div className="border-t border-white/[0.06] bg-[#08080a] px-3 sm:px-6">
          <nav className="mx-auto flex max-w-7xl gap-1.5 overflow-x-auto py-2 no-scrollbar">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition min-h-[36px] ${
                    isActive
                      ? "bg-devfolio-blue text-white font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
