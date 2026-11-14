"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import {
  FileCheck2,
  Sliders,
  Plus,
  Trash2,
  CheckCircle2,
  Trophy,
  Github,
  Globe,
  Sparkles,
} from "lucide-react";

export const JudgingRubricsStudio: React.FC = () => {
  const {
    rubrics,
    addRubric,
    updateRubric,
    deleteRubric,
    teams,
    submissions,
    judgeScores,
    submitScore,
    selectedEventId,
    events,
    setActiveSection,
  } = useStore();

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const eventRubrics = rubrics.filter((r) => r.eventId === currentEvent?.id);
  const eventTeams = teams.filter((t) => t.eventId === currentEvent?.id);

  // Rubric creator state
  const [newRubricName, setNewRubricName] = useState("");
  const [newRubricDesc, setNewRubricDesc] = useState("");
  const [newRubricWeight, setNewRubricWeight] = useState(25);

  // Judge scoring state
  const [selectedTeamId, setSelectedTeamId] = useState(eventTeams[0]?.id || "");
  const [judgeName, setJudgeName] = useState("Dr. K. Ramanathan");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");
  const [isScoreSaved, setIsScoreSaved] = useState(false);

  const totalWeight = eventRubrics.reduce((acc, r) => acc + r.weightPercentage, 0);
  const selectedTeam = eventTeams.find((t) => t.id === selectedTeamId) || eventTeams[0];
  const teamSubmission = submissions.find((s) => s.teamId === selectedTeam?.id);

  // Compute live weighted score
  const computedTotal = eventRubrics.reduce((acc, r) => {
    const val = scores[r.id] ?? 8;
    return acc + (val / r.maxPoints) * r.weightPercentage;
  }, 0);

  const handleAddRubric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRubricName.trim()) return;

    addRubric({
      eventId: currentEvent.id,
      name: newRubricName.trim(),
      description: newRubricDesc.trim() || "Criteria defined by event committee",
      weightPercentage: Number(newRubricWeight),
      maxPoints: 10,
    });

    setNewRubricName("");
    setNewRubricDesc("");
  };

  const handleScoreChange = (rubricId: string, val: number) => {
    setScores((prev) => ({ ...prev, [rubricId]: val }));
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;

    // Fill in default for any untouched rubric
    const finalScores: Record<string, number> = {};
    eventRubrics.forEach((r) => {
      finalScores[r.id] = scores[r.id] ?? 8;
    });

    submitScore({
      eventId: currentEvent.id,
      teamId: selectedTeam.id,
      teamName: selectedTeam.teamName,
      judgeName,
      scores: finalScores,
      feedback,
    });

    setIsScoreSaved(true);
    setTimeout(() => setIsScoreSaved(false), 2500);
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="h-4 w-4 text-blue-400" />
            Customizable Rubrics & Judging Studio
          </h2>
          <p className="text-xs text-zinc-400">
            Define custom evaluation dimensions for {currentEvent?.title} and score competing teams live.
          </p>
        </div>

        <button
          onClick={() => setActiveSection("leaderboard")}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white transition"
        >
          <Trophy className="h-3.5 w-3.5 text-amber-400" />
          <span>View Live Leaderboard</span>
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* LEFT COLUMN: Organizer Rubric Builder (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Configured Criteria</h3>
                <p className="text-[11px] text-zinc-400">Total weight must equal 100%</p>
              </div>

              <span
                className={`rounded px-2 py-0.5 text-xs font-mono font-bold ${
                  totalWeight === 100
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                }`}
              >
                {totalWeight}%
              </span>
            </div>

            {/* Rubrics List */}
            <div className="space-y-3">
              {eventRubrics.map((r) => (
                <div key={r.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs">{r.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-blue-400 font-bold">{r.weightPercentage}%</span>
                      {eventRubrics.length > 1 && (
                        <button
                          onClick={() => deleteRubric(r.id)}
                          className="text-zinc-500 hover:text-rose-400 transition"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{r.description}</p>
                  <div>
                    <input
                      type="range"
                      min={5}
                      max={60}
                      step={5}
                      value={r.weightPercentage}
                      onChange={(e) => updateRubric(r.id, { weightPercentage: Number(e.target.value) })}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Criterion Form */}
            <form onSubmit={handleAddRubric} className="pt-3 border-t border-zinc-800/80 space-y-3 text-xs">
              <h4 className="font-bold text-zinc-300">Add New Evaluation Dimension</h4>
              <div>
                <input
                  type="text"
                  required
                  placeholder="e.g. System Security, Feasibility, Novelty"
                  value={newRubricName}
                  onChange={(e) => setNewRubricName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Brief descriptor for judges"
                  value={newRubricDesc}
                  onChange={(e) => setNewRubricDesc(e.target.value)}
                  className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-white placeholder-zinc-500 focus:outline-none"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={newRubricWeight}
                    onChange={(e) => setNewRubricWeight(Number(e.target.value))}
                    className="w-14 rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-white font-mono text-center focus:outline-none"
                  />
                  <span className="text-zinc-400">%</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 py-1.5 font-semibold text-white hover:bg-zinc-700 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Criterion</span>
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Judge Scoring Pad (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-emerald-400" />
                  Live Scoring Pad
                </h3>
                <p className="text-xs text-zinc-400">Score competing squads on the custom rubrics</p>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-zinc-400 uppercase font-medium">Calculated Score</div>
                <div className="font-mono text-2xl font-black text-emerald-400">
                  {computedTotal.toFixed(1)} <span className="text-xs text-zinc-500">/ 100</span>
                </div>
              </div>
            </div>

            {isScoreSaved && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>Evaluation recorded! Leaderboard and standings updated live.</span>
              </div>
            )}

            <form onSubmit={handleSaveEvaluation} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-medium">Select Team to Evaluate</label>
                  <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:outline-none"
                  >
                    {eventTeams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.teamName} ({t.collegeName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 font-medium">Judge Name</label>
                  <input
                    type="text"
                    required
                    value={judgeName}
                    onChange={(e) => setJudgeName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Selected Team Project Context */}
              {selectedTeam && (
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{selectedTeam.teamName}</span>
                    <span className="text-zinc-400">{selectedTeam.collegeName}</span>
                  </div>
                  {teamSubmission ? (
                    <div className="text-zinc-400 text-[11px] space-y-1">
                      <div>Problem: {teamSubmission.problemStatement}</div>
                      <div className="flex items-center gap-3 pt-1">
                        <a
                          href={teamSubmission.githubRepoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <Github className="h-3 w-3" />
                          <span>Code Repository</span>
                        </a>
                        {teamSubmission.liveDemoUrl && (
                          <a
                            href={teamSubmission.liveDemoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <Globe className="h-3 w-3" />
                            <span>Live Deployment</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-zinc-500 text-[11px]">No formal project submission linked yet.</div>
                  )}
                </div>
              )}

              {/* Rubric Sliders */}
              <div className="space-y-3 pt-2">
                {eventRubrics.map((r) => {
                  const currentVal = scores[r.id] ?? 8;
                  return (
                    <div key={r.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-white">{r.name}</span>
                          <span className="ml-2 text-zinc-400 text-[10px]">({r.weightPercentage}%)</span>
                        </div>
                        <span className="font-mono font-bold text-white text-sm">
                          {currentVal} <span className="text-xs text-zinc-500">/ 10</span>
                        </span>
                      </div>

                      <input
                        type="range"
                        min={1}
                        max={10}
                        step={0.5}
                        value={currentVal}
                        onChange={(e) => handleScoreChange(r.id, Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="text-zinc-400 font-medium">Constructive Jury Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Exceptional architecture, solid answers during technical defense."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder-zinc-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-600 py-2.5 font-bold text-white hover:bg-emerald-500 transition"
              >
                Submit Scorecard & Update Leaderboard
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
