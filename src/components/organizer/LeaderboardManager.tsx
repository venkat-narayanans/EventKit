"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import {
  Trophy,
  Medal,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Count, Badge } from "@/kit";

export const LeaderboardManager: React.FC = () => {
  const { judgeScores, teams, selectedEventId, events, setActiveSection } = useStore();
  const [showNormalized, setShowNormalized] = useState(true);

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const eventScores = judgeScores.filter((s) => s.eventId === currentEvent?.id);

  // Aggregate scores per team
  const teamScoreMap = new Map<string, { teamName: string; totalRaw: number; count: number; feedback: string }>();

  eventScores.forEach((sc) => {
    const existing = teamScoreMap.get(sc.teamId) || {
      teamName: sc.teamName,
      totalRaw: 0,
      count: 0,
      feedback: sc.feedback || "",
    };
    existing.totalRaw += sc.totalRaw;
    existing.count += 1;
    if (sc.feedback) existing.feedback = sc.feedback;
    teamScoreMap.set(sc.teamId, existing);
  });

  const standings = Array.from(teamScoreMap.entries()).map(([teamId, data]) => {
    const avgRaw = Number((data.totalRaw / data.count).toFixed(1));
    const normalized = Math.min(100, Math.round(avgRaw * 1.01));
    return {
      teamId,
      teamName: data.teamName,
      judgeCount: data.count,
      avgRaw,
      normalized,
      feedback: data.feedback,
      rank: 0,
    };
  });

  standings.sort((a, b) => (showNormalized ? b.normalized - a.normalized : b.avgRaw - a.avgRaw));
  standings.forEach((s, idx) => {
    s.rank = idx + 1;
  });

  const handleConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#e21b3c", "#1368ce", "#ffa602", "#2ecc71", "#46178f"],
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Trophy className="h-4 w-4 text-kahoot-yellow" />
            Live Event Leaderboard & Standings
          </h2>
          <p className="text-xs text-zinc-400">
            Real-time score tally and normalized rankings for {currentEvent?.title}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Raw vs Normalized */}
          <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#111114] p-0.5 text-xs">
            <button
              onClick={() => setShowNormalized(true)}
              className={`rounded-lg px-2.5 sm:px-3 py-1.5 font-medium transition ${
                showNormalized ? "bg-white text-zinc-950 font-semibold shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              Fair Normalized
            </button>
            <button
              onClick={() => setShowNormalized(false)}
              className={`rounded-lg px-2.5 sm:px-3 py-1.5 font-medium transition ${
                !showNormalized ? "bg-white text-zinc-950 font-semibold shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              Raw Average
            </button>
          </div>

          <button
            onClick={handleConfetti}
            className="flex items-center gap-1.5 rounded-xl bg-kahoot-yellow px-3.5 py-1.5 text-xs font-bold text-black hover:opacity-95 transition shadow-kahoot-yellow min-h-[34px]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Celebrate 🎉</span>
          </button>
        </div>
      </div>

      {standings.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-12 text-center text-xs text-zinc-500 space-y-2">
          <Trophy className="h-8 w-8 text-zinc-600 mx-auto" />
          <p>No teams evaluated for {currentEvent?.title} yet.</p>
          <button
            onClick={() => setActiveSection("judging")}
            className="text-devfolio-blue font-semibold hover:underline"
          >
            Go to Judging Studio to score a squad
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top 3 Podium (Kahoot High-Energy Cards with Stageshow Count Roll) */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
            {standings.slice(0, 3).map((item, idx) => {
              const borderStyles = [
                "border-kahoot-yellow/40 bg-kahoot-yellow/[0.03]",
                "border-white/[0.18] bg-white/[0.02]",
                "border-amber-700/40 bg-amber-700/[0.03]",
              ][idx];

              const badges = [
                "bg-kahoot-yellow text-black font-extrabold",
                "bg-zinc-200 text-black font-extrabold",
                "bg-amber-700 text-white font-extrabold",
              ][idx];

              return (
                <div
                  key={item.teamId}
                  className={`rounded-2xl border p-5 text-center space-y-2.5 shadow-luma-card ${borderStyles}`}
                >
                  <span className={`inline-block rounded-full px-3 py-0.5 text-[10px] uppercase tracking-wider ${badges}`}>
                    #{item.rank} Standings
                  </span>
                  <h3 className="font-bold text-white text-base sm:text-lg truncate">{item.teamName}</h3>
                  <div className="font-mono text-3xl sm:text-4xl font-black text-white flex items-center justify-center">
                    <Count
                      value={showNormalized ? item.normalized : item.avgRaw}
                      format={(n) => (showNormalized ? Math.round(n).toString() : n.toFixed(1))}
                      duration={600}
                    />
                    <span className="text-xs font-normal text-zinc-400 ml-1"> / 100</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 border-t border-white/[0.06] pt-2">
                    Evaluated by {item.judgeCount} judge(s)
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Standings Table */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-4 sm:p-5 space-y-3 shadow-luma-card">
            <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-white/[0.06] pb-3">
              <span className="font-semibold text-white">All Evaluated Squads ({standings.length})</span>
              <button
                onClick={() => setActiveSection("certificates")}
                className="text-devfolio-blue font-semibold hover:underline flex items-center gap-1"
              >
                <span>Design Certificates</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead className="border-b border-white/[0.06] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <tr>
                    <th className="pb-2.5">Rank</th>
                    <th className="pb-2.5">Squad Name</th>
                    <th className="pb-2.5">Jury Count</th>
                    <th className="pb-2.5">Feedback</th>
                    <th className="pb-2.5 text-right">Final Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {standings.map((st) => (
                    <tr key={st.teamId} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 font-mono font-bold text-white">#{st.rank}</td>
                      <td className="py-3 font-semibold text-white">{st.teamName}</td>
                      <td className="py-3 text-zinc-400 font-mono">{st.judgeCount}</td>
                      <td className="py-3 text-zinc-400 max-w-xs truncate">
                        {st.feedback || "—"}
                      </td>
                      <td className="py-3 text-right font-mono font-extrabold text-kahoot-green text-sm">
                        <Count
                          value={showNormalized ? st.normalized : st.avgRaw}
                          format={(n) => (showNormalized ? Math.round(n).toString() : n.toFixed(1))}
                          duration={500}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
