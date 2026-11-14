"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import {
  Sparkles,
  Layers,
  Users,
  GitBranch,
  FileCheck2,
  Trophy,
  Award,
  GraduationCap,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronDown,
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

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const sections = [
    { id: "events", label: "Events", icon: Layers },
    { id: "submissions", label: "Submissions", icon: GitBranch },
    { id: "judging", label: "Rubrics & Judging", icon: FileCheck2 },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "certificates", label: "Cert Studio", icon: Award },
    { id: "compliance", label: "NAAC Dossier", icon: GraduationCap },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      {/* Top Application Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Left: Brand & Event Context */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black font-black text-sm">
              F
            </div>
            <span className="font-bold tracking-tight text-white text-base">
              FESTRA
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-800" />

          {/* Event Dropdown Picker */}
          <div className="relative flex items-center gap-1.5">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="appearance-none rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 pr-7 text-xs font-medium text-zinc-200 hover:border-zinc-700 focus:outline-none cursor-pointer max-w-[200px] truncate"
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
              className="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Mode Switcher (Organizer vs Student View) */}
        <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 p-0.5 text-xs">
          <button
            onClick={() => setViewMode("dashboard")}
            className={`rounded-md px-3 py-1 font-medium transition ${
              viewMode === "dashboard"
                ? "bg-white text-zinc-950 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Organizer Studio
          </button>
          <button
            onClick={() => setViewMode("portal")}
            className={`rounded-md px-3 py-1 font-medium transition ${
              viewMode === "portal"
                ? "bg-white text-zinc-950 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Student View
          </button>
        </div>

        {/* Right: Reset & Quick Helpers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm("Reset demo data to default clean state?")) {
                resetAll();
              }
            }}
            title="Reset to clean defaults"
            className="flex items-center gap-1 rounded-lg border border-zinc-800/80 bg-zinc-900/50 px-2 py-1 text-[11px] font-medium text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition"
          >
            <RefreshCw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Subnav (for Organizer Studio) */}
      {viewMode === "dashboard" && (
        <div className="border-t border-zinc-800/60 bg-zinc-950 px-4 sm:px-6">
          <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto py-1.5 no-scrollbar">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap transition ${
                    isActive
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
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
