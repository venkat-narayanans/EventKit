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
  QrCode,
} from "lucide-react";

interface HeaderProps {
  onOpenCreateEvent: () => void;
  onOpenQrModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateEvent, onOpenQrModal }) => {
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
    <header className="sticky top-0 z-40 w-full border-b border-blue-100 bg-white/95 backdrop-blur-md shadow-sm">
      {/* Top Application Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6">
        {/* Left: Brand & Event Context */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            onClick={() => setViewMode("landing")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-fortnite text-xl shadow-sm shadow-blue-500/25">
              F
            </div>
            <span className="font-fortnite text-2xl tracking-wide text-blue-950 uppercase">
              FESTRA<span className="text-blue-600">.</span>
            </span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-200" />

          {/* Event Dropdown Picker */}
          <div className="relative flex items-center gap-1.5">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 pr-7 text-xs font-semibold text-slate-800 hover:border-blue-400 focus:outline-none cursor-pointer max-w-[140px] sm:max-w-[220px] truncate"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-slate-500" />

            <button
              onClick={onOpenCreateEvent}
              title="Create New Event Track"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Center: Mode Switcher (Landing vs Organizer vs Student View) */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5 text-xs">
          <button
            onClick={() => setViewMode("landing")}
            className={`rounded-lg px-2.5 sm:px-3 py-1 font-semibold transition ${
              viewMode === "landing"
                ? "bg-blue-600 text-white font-bold shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Landing
          </button>
          <button
            onClick={() => setViewMode("dashboard")}
            className={`rounded-lg px-2.5 sm:px-3 py-1 font-semibold transition ${
              viewMode === "dashboard"
                ? "bg-blue-600 text-white font-bold shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Organizer
          </button>
          <button
            onClick={() => setViewMode("portal")}
            className={`rounded-lg px-2.5 sm:px-3 py-1 font-semibold transition ${
              viewMode === "portal"
                ? "bg-blue-600 text-white font-bold shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Student View
          </button>
        </div>

        {/* Right: QR Code Pass & Reset Action */}
        <div className="flex items-center gap-1.5">
          {onOpenQrModal && (
            <button
              onClick={onOpenQrModal}
              title="Generate Student Registration QR Code"
              className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition"
            >
              <QrCode className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Registration QR</span>
            </button>
          )}

          <button
            onClick={() => {
              if (confirm("Reset demo data to default clean state?")) {
                resetAll();
              }
            }}
            title="Reset to clean defaults"
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <RefreshCw className="h-3 w-3" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Subnav (for Organizer Studio) with clean horizontal touch scroll */}
      {viewMode === "dashboard" && (
        <div className="border-t border-blue-100 bg-white px-3 sm:px-6">
          <nav className="mx-auto flex max-w-7xl gap-1.5 overflow-x-auto py-2 no-scrollbar">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition min-h-[34px] ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
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
