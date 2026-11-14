"use client";

import React, { useState } from "react";
import { useFestraStore } from "@/lib/store";
import {
  Trophy,
  Medal,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";

export const LeaderboardView: React.FC = () => {
  const { getRankings, setActiveTab } = useFestraStore();
  const [showNormalized, setShowNormalized] = useState(true);

  const rankings = getRankings();

  const handleConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FF4757", "#00D2D3", "#A8FF3E", "#FFA502", "#6C5CE7"],
    });
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-amber/20 px-2.5 py-0.5 text-xs font-bold text-brand-amber">
              AUDITORIUM LIVE PROJECTOR MODE
            </span>
            <span className="text-xs text-zinc-400">HackSphere 2026 Finals</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            Live Leaderboard & Normalized Standings
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time score tally with automated $Z$-score statistical normalization to neutralize judge bias.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Normalized vs Raw Toggle */}
          <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900 p-1 text-xs">
            <button
              onClick={() => setShowNormalized(true)}
              className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                showNormalized ? "bg-white text-zinc-950 shadow" : "text-zinc-400 hover:text-white"
              }`}
            >
              Normalized (Fair)
            </button>
            <button
              onClick={() => setShowNormalized(false)}
              className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                !showNormalized ? "bg-white text-zinc-950 shadow" : "text-zinc-400 hover:text-white"
              }`}
            >
              Raw Average
            </button>
          </div>

          <button
            onClick={handleConfetti}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-coral via-brand-amber to-brand-lime px-4 py-2 text-xs font-bold text-black shadow-lg hover:scale-105 transition"
          >
            <Sparkles className="h-4 w-4" />
            <span>Celebrate! 🎉</span>
          </button>
        </div>
      </div>

      {/* Podium Cards for Top 3 (Kahoot Inspired) */}
      <div className="grid gap-4 sm:grid-cols-3 pt-4">
        {rankings.slice(0, 3).map((team, idx) => {
          const colors = [
            { border: "border-brand-amber", bg: "bg-brand-amber/10", badge: "bg-brand-amber text-black", label: "🥇 1ST PLACE" },
            { border: "border-zinc-400", bg: "bg-zinc-400/10", badge: "bg-zinc-300 text-black", label: "🥈 2ND PLACE" },
            { border: "border-amber-700", bg: "bg-amber-700/10", badge: "bg-amber-600 text-white", label: "🥉 3RD PLACE" },
          ][idx] || { border: "border-zinc-800", bg: "bg-zinc-900", badge: "bg-zinc-800 text-white", label: `#${idx + 1}` };

          return (
            <div
              key={team.teamId}
              className={`relative overflow-hidden rounded-3xl border ${colors.border} ${colors.bg} p-6 text-center space-y-3 transition-transform hover:-translate-y-1 shadow-xl`}
            >
              <div className="inline-block">
                <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${colors.badge}`}>
                  {colors.label}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">{team.teamName}</h3>
                <div className="mt-1 font-mono text-3xl font-black text-white">
                  {showNormalized ? team.averageNormalizedScore : team.averageRawScore}
                  <span className="text-xs font-normal text-zinc-400"> / 100</span>
                </div>
              </div>

              <div className="border-t border-zinc-800/80 pt-3 text-[11px] text-zinc-400">
                <span>Evaluated across {team.judgeCount} independent judges</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <ShieldCheck className="h-4 w-4 text-brand-lime" />
            <span>Statistical Z-Score Algorithm active (Mean: 75.0 • StdDev: 12.5)</span>
          </div>

          <button
            onClick={() => setActiveTab("certificates")}
            className="flex items-center gap-1.5 font-semibold text-brand-cyan hover:underline"
          >
            <span>Batch Mint Verifiable Certificates</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {rankings.map((team) => (
            <div
              key={team.teamId}
              className="flex items-center justify-between p-4 px-6 hover:bg-zinc-800/30 transition text-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800 font-mono font-bold text-zinc-300">
                  #{team.rank}
                </div>
                <div>
                  <h4 className="font-bold text-white">{team.teamName}</h4>
                  <div className="text-xs text-zinc-500">
                    Jury count: {team.judgeCount} • Raw: {team.averageRawScore}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono text-lg font-black text-brand-lime">
                  {showNormalized ? team.averageNormalizedScore : team.averageRawScore}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  {showNormalized ? "Normalized" : "Raw Average"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
