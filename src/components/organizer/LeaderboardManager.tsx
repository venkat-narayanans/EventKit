"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import {
  Trophy,
  Sparkles,
  ArrowRight,
  Lock,
  Unlock,
  Award,
  CheckCircle2,
  Users,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Count } from "@/kit";

export const LeaderboardManager: React.FC = () => {
  const {
    judgeScores,
    teams,
    submissions,
    selectedEventId,
    events,
    setActiveSection,
    finalizedLeaderboards,
    toggleFinalizeLeaderboard,
    generateWinnerCertificatesFromLeaderboard,
  } = useStore();
  const [showNormalized, setShowNormalized] = useState(true);

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const eventId = currentEvent?.id || "hack-ai-2026";
  const eventScores = judgeScores.filter((s) => s.eventId === eventId);
  const isFinalized = Boolean(finalizedLeaderboards[eventId]);

  // Aggregate scores per team
  const teamScoreMap = new Map<
    string,
    { teamName: string; totalRaw: number; count: number; feedback: string }
  >();

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
    const team =
      teams.find((t) => t.id === teamId && t.eventId === eventId) ||
      teams.find((t) => t.teamName.toLowerCase() === data.teamName.toLowerCase());
    const submission = submissions.find(
      (s) =>
        s.eventId === eventId &&
        (s.teamId === teamId || s.teamName.toLowerCase() === data.teamName.toLowerCase())
    );
    return {
      teamId,
      teamName: data.teamName,
      projectTitle: submission?.problemStatement || `${data.teamName} — Verified Project`,
      memberCount: team?.members?.length || 1,
      collegeName: team?.collegeName || "NIT Trichy",
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

  const top3MembersTotal = standings
    .slice(0, 3)
    .reduce((sum, st) => sum + st.memberCount, 0);

  const handleConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#2563eb", "#38bdf8", "#f59e0b", "#10b981", "#ffffff"],
    });
  };

  const handleFinalize = () => {
    toggleFinalizeLeaderboard(eventId, true);
    handleConfetti();
  };

  const handleGenerateWinnerCerts = () => {
    handleConfetti();
    generateWinnerCertificatesFromLeaderboard(eventId);
  };

  return (
    <div className="space-y-6 sm:space-y-7 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-4">
        <div>
          <h2 className="font-fortnite text-2xl tracking-wide text-blue-950 uppercase flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Live Event Leaderboard & Standings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time score tally and normalized rankings for {currentEvent?.title}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Raw vs Normalized */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5 text-xs">
            <button
              onClick={() => setShowNormalized(true)}
              className={`rounded-lg px-2.5 sm:px-3 py-1.5 font-medium transition ${
                showNormalized
                  ? "bg-white text-blue-950 font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Fair Normalized
            </button>
            <button
              onClick={() => setShowNormalized(false)}
              className={`rounded-lg px-2.5 sm:px-3 py-1.5 font-medium transition ${
                !showNormalized
                  ? "bg-white text-blue-950 font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Raw Average
            </button>
          </div>

          <button
            onClick={handleConfetti}
            className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3.5 py-1.5 font-fortnite text-sm tracking-wide text-blue-900 hover:bg-blue-50 transition shadow-sm min-h-[34px]"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>CELEBRATE</span>
          </button>
        </div>
      </div>

      {/* FINALIZE LEADERBOARD & 1-CLICK WINNER CERTIFICATES BANNER */}
      {standings.length > 0 && (
        <div
          className={`rounded-2xl border p-4 sm:p-5 shadow-sm transition ${
            isFinalized
              ? "border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-blue-50"
              : "border-blue-200 bg-gradient-to-r from-blue-50 via-white to-slate-50"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isFinalized ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Leaderboard Finalized & Locked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-800">
                    <Lock className="h-3 w-3 text-blue-600" />
                    Step 1: Finalize Results
                  </span>
                )}
              </div>

              <h3 className="font-fortnite text-xl sm:text-2xl text-blue-950 uppercase tracking-wide">
                {isFinalized
                  ? "TOP 3 WINNERS LOCKED — READY TO ISSUE WINNER CERTIFICATES"
                  : "FINALIZE LEADERBOARD TO GENERATE WINNER CERTIFICATES"}
              </h3>
              <p className="text-xs text-slate-600 max-w-2xl">
                {isFinalized
                  ? `Automatically pulls Team Name, Project Title, Leaderboard Place (#1, #2, #3), and registered emails for all ${top3MembersTotal} winning team members.`
                  : "Once jury scoring is complete, finalize the leaderboard to lock the Top 3 standings and auto-generate personalized Winner Certificates."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {!isFinalized ? (
                <button
                  onClick={handleFinalize}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-fortnite text-base tracking-wide text-white hover:bg-blue-700 transition shadow-md shadow-blue-600/20"
                >
                  <Lock className="h-4 w-4" />
                  <span>FINALIZE LEADERBOARD</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => toggleFinalizeLeaderboard(eventId, false)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    <Unlock className="h-3.5 w-3.5" />
                    <span>Unlock</span>
                  </button>
                  <button
                    onClick={handleGenerateWinnerCerts}
                    className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 font-fortnite text-base tracking-wide text-slate-950 hover:bg-amber-400 transition shadow-md shadow-amber-500/25"
                  >
                    <Award className="h-4 w-4" />
                    <span>GENERATE CERTIFICATES FOR WINNERS ({top3MembersTotal})</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {standings.length === 0 ? (
        <div className="rounded-2xl border border-blue-100 bg-white p-12 text-center text-xs text-slate-500 space-y-2 shadow-sm">
          <Trophy className="h-8 w-8 text-slate-400 mx-auto" />
          <p>No teams evaluated for {currentEvent?.title} yet.</p>
          <button
            onClick={() => setActiveSection("judging")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Go to Judging Studio to score a squad
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top 3 Podium Cards */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
            {standings.slice(0, 3).map((item, idx) => {
              const borderStyles = [
                "border-2 border-amber-400 bg-amber-50/40",
                "border-2 border-slate-300 bg-slate-50/60",
                "border-2 border-amber-700/30 bg-orange-50/30",
              ][idx];

              const badges = [
                "bg-amber-400 text-amber-950 font-fortnite text-xs",
                "bg-slate-200 text-slate-800 font-fortnite text-xs",
                "bg-amber-800 text-white font-fortnite text-xs",
              ][idx];

              const placeTitle = ["1ST PLACE WINNER", "2ND PLACE RUNNER-UP", "3RD PLACE"][idx];

              const scoreColors = ["text-amber-600", "text-slate-700", "text-amber-800"][idx];

              return (
                <div
                  key={item.teamId}
                  className={`rounded-2xl p-5 text-center space-y-2.5 shadow-sm ${borderStyles}`}
                >
                  <span
                    className={`inline-block rounded-full px-3 py-0.5 uppercase tracking-wider ${badges}`}
                  >
                    #{item.rank} • {placeTitle}
                  </span>
                  <h3 className="font-fortnite text-xl text-blue-950 uppercase tracking-wide truncate">
                    {item.teamName}
                  </h3>
                  <p className="text-[11px] text-slate-600 line-clamp-2 min-h-[32px] leading-snug">
                    {item.projectTitle}
                  </p>
                  <div
                    className={`font-fortnite text-4xl sm:text-5xl ${scoreColors} flex items-center justify-center leading-none`}
                  >
                    <Count
                      value={showNormalized ? item.normalized : item.avgRaw}
                      format={(n) => (showNormalized ? Math.round(n).toString() : n.toFixed(1))}
                      duration={600}
                    />
                    <span className="text-xs font-sans font-normal text-slate-400 ml-1"> / 100</span>
                  </div>
                  <div className="text-[11px] text-slate-500 border-t border-slate-200/60 pt-2 font-medium flex items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3 text-blue-600" />
                      {item.memberCount} member(s)
                    </span>
                    <span>•</span>
                    <span>{item.collegeName}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Standings Table */}
          <div className="rounded-2xl border border-blue-100 bg-white p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
              <span className="font-fortnite text-lg text-blue-950 uppercase tracking-wide">
                All Evaluated Squads ({standings.length})
              </span>
              <button
                onClick={() => setActiveSection("certificates")}
                className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Open Cert Studio</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead className="border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="pb-2.5">Rank</th>
                    <th className="pb-2.5">Squad & Institution</th>
                    <th className="pb-2.5">Project Title</th>
                    <th className="pb-2.5">Feedback</th>
                    <th className="pb-2.5 text-right">Final Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {standings.map((st) => (
                    <tr key={st.teamId} className="hover:bg-blue-50/40 transition">
                      <td className="py-3 font-fortnite text-lg text-blue-950">#{st.rank}</td>
                      <td className="py-3">
                        <div className="font-fortnite text-base text-blue-950 uppercase tracking-wide">
                          {st.teamName}
                        </div>
                        <div className="text-[10px] text-slate-500">{st.collegeName}</div>
                      </td>
                      <td className="py-3 text-slate-700 font-medium max-w-xs truncate">
                        {st.projectTitle}
                      </td>
                      <td className="py-3 text-slate-500 max-w-xs truncate">
                        {st.feedback || "—"}
                      </td>
                      <td className="py-3 text-right font-fortnite text-xl text-blue-600">
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
