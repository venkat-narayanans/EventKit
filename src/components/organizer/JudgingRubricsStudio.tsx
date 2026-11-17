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
  ArrowRight,
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

  // Mobile view tab toggle: "rubrics" vs "scoring"
  const [mobileTab, setMobileTab] = useState<"rubrics" | "scoring">("scoring");

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
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-4">
        <div>
          <h2 className="font-fortnite text-2xl tracking-wide text-blue-950 uppercase flex items-center gap-2">
            <Sliders className="h-5 w-5 text-blue-600" />
            Rubrics & Live Judging Studio
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Define criteria weightages and score competing teams for {currentEvent?.title}.
          </p>
        </div>

        <button
          onClick={() => setActiveSection("leaderboard")}
          className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3.5 py-2 font-fortnite text-sm tracking-wide text-blue-900 hover:bg-blue-50 transition shadow-sm self-start sm:self-auto"
        >
          <Trophy className="h-4 w-4 text-amber-500" />
          <span>LIVE LEADERBOARD</span>
        </button>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs">
        <button
          onClick={() => setMobileTab("scoring")}
          className={`flex-1 py-2 font-fortnite tracking-wide uppercase rounded-lg transition ${
            mobileTab === "scoring" ? "bg-white text-blue-950 shadow-sm" : "text-slate-600"
          }`}
        >
          Live Scoring Pad
        </button>
        <button
          onClick={() => setMobileTab("rubrics")}
          className={`flex-1 py-2 font-fortnite tracking-wide uppercase rounded-lg transition ${
            mobileTab === "rubrics" ? "bg-white text-blue-950 shadow-sm" : "text-slate-600"
          }`}
        >
          Rubric Config ({totalWeight}%)
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: Organizer Rubric Builder (5 Cols) */}
        <div
          className={`lg:col-span-5 space-y-4 ${
            mobileTab === "scoring" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="rounded-2xl border border-blue-100 bg-white p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-fortnite text-lg tracking-wide text-blue-950 uppercase">Configured Dimensions</h3>
                <p className="text-[11px] text-slate-500">Total weight must equal 100%</p>
              </div>

              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-fortnite tracking-wide ${
                  totalWeight === 100
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {totalWeight}% TOTAL
              </span>
            </div>

            {/* Rubrics List */}
            <div className="space-y-3">
              {eventRubrics.map((r) => (
                <div key={r.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-fortnite text-base text-blue-950 uppercase tracking-wide">{r.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-fortnite text-base text-blue-600">{r.weightPercentage}%</span>
                      {eventRubrics.length > 1 && (
                        <button
                          onClick={() => deleteRubric(r.id)}
                          className="text-slate-400 hover:text-rose-500 transition p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{r.description}</p>
                  <div>
                    <input
                      type="range"
                      min={5}
                      max={60}
                      step={5}
                      value={r.weightPercentage}
                      onChange={(e) => updateRubric(r.id, { weightPercentage: Number(e.target.value) })}
                      className="w-full accent-blue-600 cursor-pointer h-2"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Criterion Form */}
            <form onSubmit={handleAddRubric} className="pt-3 border-t border-slate-100 space-y-3 text-xs">
              <h4 className="font-fortnite text-sm text-blue-950 uppercase tracking-wide">Add Evaluation Dimension</h4>
              <div>
                <input
                  type="text"
                  required
                  placeholder="e.g. System Security, Feasibility, Novelty"
                  value={newRubricName}
                  onChange={(e) => setNewRubricName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Short descriptor for jury"
                  value={newRubricDesc}
                  onChange={(e) => setNewRubricDesc(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={newRubricWeight}
                    onChange={(e) => setNewRubricWeight(Number(e.target.value))}
                    className="w-14 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-slate-900 font-fortnite text-base text-center focus:outline-none"
                  />
                  <span className="text-slate-500 font-bold">%</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 transition shadow-sm min-h-[38px]"
              >
                <Plus className="h-4 w-4" />
                <span>ADD DIMENSION</span>
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Judge Scoring Pad (7 Cols) */}
        <div
          className={`lg:col-span-7 space-y-4 ${
            mobileTab === "rubrics" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="rounded-2xl border border-blue-100 bg-white p-5 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-fortnite text-lg tracking-wide text-blue-950 uppercase flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-blue-600" />
                  Live Scoring Pad
                </h3>
                <p className="text-xs text-slate-500">Select squad and slide criteria scores</p>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Calculated Score</div>
                <div className="font-fortnite text-3xl sm:text-4xl text-blue-600 leading-none mt-1">
                  {computedTotal.toFixed(1)} <span className="text-xs font-sans text-slate-400">/ 100</span>
                </div>
              </div>
            </div>

            {isScoreSaved && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                <span>Scorecard recorded! Live leaderboard and standings updated.</span>
              </div>
            )}

            <form onSubmit={handleSaveEvaluation} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-medium">Select Squad</label>
                  <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    {eventTeams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.teamName} ({t.collegeName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-medium">Judge Name</label>
                  <input
                    type="text"
                    required
                    value={judgeName}
                    onChange={(e) => setJudgeName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Selected Squad Project Context */}
              {selectedTeam && (
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-fortnite text-base text-blue-950 uppercase tracking-wide">{selectedTeam.teamName}</span>
                    <span className="text-slate-500 text-[11px]">{selectedTeam.collegeName}</span>
                  </div>
                  {teamSubmission ? (
                    <div className="text-slate-600 text-[11px] space-y-1">
                      <div>Problem: <span className="text-slate-900 font-medium">{teamSubmission.problemStatement}</span></div>
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <a
                          href={teamSubmission.githubRepoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                        >
                          <Github className="h-3.5 w-3.5" />
                          <span>Code Repository</span>
                        </a>
                        {teamSubmission.liveDemoUrl && (
                          <a
                            href={teamSubmission.liveDemoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-600 hover:underline flex items-center gap-1 font-medium"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            <span>Live Deployed URL</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-[11px]">No formal project submission linked yet.</div>
                  )}
                </div>
              )}

              {/* Rubric Sliders with Large Touch Targets */}
              <div className="space-y-3 pt-1">
                {eventRubrics.map((r) => {
                  const currentVal = scores[r.id] ?? 8;
                  return (
                    <div key={r.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-fortnite text-base text-blue-950 uppercase tracking-wide">{r.name}</span>
                          <span className="ml-2 text-slate-500 text-[11px]">({r.weightPercentage}%)</span>
                        </div>
                        <span className="font-fortnite text-xl text-blue-600">
                          {currentVal} <span className="text-xs font-sans text-slate-400">/ 10</span>
                        </span>
                      </div>

                      <input
                        type="range"
                        min={1}
                        max={10}
                        step={0.5}
                        value={currentVal}
                        onChange={(e) => handleScoreChange(r.id, Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer h-2"
                      />
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="text-slate-700 font-medium">Jury Evaluation Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Robust architecture, crisp technical defense on concurrency."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3.5 font-fortnite text-base tracking-wide text-white hover:bg-blue-700 transition shadow-sm min-h-[44px]"
              >
                SUBMIT SCORECARD & UPDATE LEADERBOARD
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
