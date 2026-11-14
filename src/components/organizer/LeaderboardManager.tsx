"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import {
  Trophy,
  Medal,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import confetti from "canvas-confetti";

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
    // Apply statistical normalization algorithm
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

  // Sort descending
  standings.sort((a, b) => (showNormalized ? b.normalized - a.normalized : b.avgRaw - a.avgRaw));
  standings.forEach((s, idx) => {
    s.rank = idx + 1;
  });

  const handleConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-400" />
            Live Event Leaderboard & Standings
          </h2>
          <p className="text-xs text-zinc-400">
            Real-time score tally for {currentEvent?.title}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Raw vs Normalized */}
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 p-0.5 text-xs">
            <button
              onClick={() => setShowNormalized(true)}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                showNormalized ? "bg-white text-zinc-950 font-semibold shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              Fair Normalized
            </button>
            <button
              onClick={() => setShowNormalized(false)}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                !showNormalized ? "bg-white text-zinc-950 font-semibold shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              Raw Average
            </button>
          </div>

          <button
            onClick={handleConfetti}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-black hover:bg-amber-400 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Celebrate Winners 🎉</span>
          </button>
        </div>
      </div>

      {standings.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-12 text-center text-xs text-zinc-500 space-y-2">
          <Trophy className="h-8 w-8 text-zinc-600 mx-auto" />
          <p>No teams evaluated for {currentEvent?.title} yet.</p>
          <button
            onClick={() => setActiveSection("judging")}
            className="text-blue-400 font-semibold hover:underline"
          >
            Go to Judging Studio to score a squad
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top 3 Podium */}
          <div className="grid gap-4 sm:grid-cols-3">
            {standings.slice(0, 3).map((item, idx) => {
              const borderStyles = [
                "border-amber-500/50 bg-amber-500/5",
                "border-zinc-500/50 bg-zinc-500/5",
                "border-amber-800/50 bg-amber-800/5",
              ][idx];

              const badges = [
                "bg-amber-400 text-black font-bold",
                "bg-zinc-300 text-black font-bold",
                "bg-amber-700 text-white font-bold",
              ][idx];

              return (
                <div
                  key={item.teamId}
                  className={`rounded-xl border p-5 text-center space-y-2 ${borderStyles}`}
                >
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${badges}`}>
                    #{item.rank} Standings
                  </span>
                  <h3 className="font-bold text-white text-base truncate">{item.teamName}</h3>
                  <div className="font-mono text-3xl font-black text-white">
                    {showNormalized ? item.normalized : item.avgRaw}
                    <span className="text-xs text-zinc-500"> / 100</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 border-t border-zinc-800/60 pt-2">
                    Evaluated by {item.judgeCount} judge(s)
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Table */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>All Evaluated Squads ({standings.length})</span>
              <button
                onClick={() => setActiveSection("certificates")}
                className="text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Issue & Design Certificates</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase">
                  <tr>
                    <th className="pb-2">Rank</th>
                    <th className="pb-2">Team Name</th>
                    <th className="pb-2">Jury Count</th>
                    <th className="pb-2">Jury Feedback</th>
                    <th className="pb-2 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {standings.map((st) => (
                    <tr key={st.teamId} className="hover:bg-zinc-800/20 transition">
                      <td className="py-3 font-mono font-bold text-white">#{st.rank}</td>
                      <td className="py-3 font-semibold text-white">{st.teamName}</td>
                      <td className="py-3 text-zinc-400 font-mono">{st.judgeCount}</td>
                      <td className="py-3 text-zinc-400 max-w-xs truncate">
                        {st.feedback || "—"}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-emerald-400 text-sm">
                        {showNormalized ? st.normalized : st.avgRaw}
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
