"use client";

import React, { useState } from "react";
import { useFestraStore } from "@/lib/store";
import {
  FileCheck2,
  Sliders,
  Sparkles,
  Github,
  Globe,
  FileText,
  Plus,
  CheckCircle2,
  Lock,
  ArrowRight,
  Trophy,
} from "lucide-react";

export const JudgingStudioView: React.FC = () => {
  const {
    rubrics,
    updateRubricWeight,
    addRubricDimension,
    submissions,
    evaluations,
    addEvaluation,
    setActiveTab,
  } = useFestraStore();

  const [selectedSubIndex, setSelectedSubIndex] = useState(0);
  const activeSub = submissions[selectedSubIndex] || submissions[0];

  // Sliders state: rubricId -> score (1-10)
  const [scores, setScores] = useState<Record<string, number>>({
    tech_depth: 9,
    novelty: 8.5,
    ui_ux: 9,
    presentation_qa: 9,
  });

  const [privateNotes, setPrivateNotes] = useState("");
  const [publicFeedback, setPublicFeedback] = useState("");
  const [judgeName, setJudgeName] = useState("Dr. Arun Sundaram");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Rubric customizer modal / drawer state
  const [showRubricCustomizer, setShowRubricCustomizer] = useState(false);
  const [newDimName, setNewDimName] = useState("");
  const [newDimWeight, setNewDimWeight] = useState(15);

  const totalWeight = rubrics.reduce((sum, r) => sum + r.weightPercentage, 0);

  // Calculate live weighted score
  const liveScore = rubrics.reduce((total, r) => {
    const raw = scores[r.id] ?? 5;
    return total + (raw / r.maxPoints) * r.weightPercentage;
  }, 0);

  const handleScoreChange = (rubricId: string, value: number) => {
    setScores((prev) => ({ ...prev, [rubricId]: value }));
  };

  const handleAddCustomDimension = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDimName) return;

    addRubricDimension({
      id: `custom_${Date.now()}`,
      name: newDimName,
      description: "Custom criterion defined by organizer",
      weightPercentage: Number(newDimWeight),
      maxPoints: 10,
      descriptors: {
        low: "Needs significant improvement",
        mid: "Meets institutional expectations",
        high: "Exceptional benchmark performance",
      },
    });

    setScores((prev) => ({ ...prev, [`custom_${Date.now()}`]: 7 }));
    setNewDimName("");
  };

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSub) return;

    addEvaluation(
      "judge-active",
      judgeName,
      "Jury Member",
      activeSub.teamId,
      activeSub.teamName,
      scores,
      privateNotes,
      publicFeedback
    );

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      // Advance to next team if available
      if (selectedSubIndex < submissions.length - 1) {
        setSelectedSubIndex((prev) => prev + 1);
      }
    }, 1500);
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header with Rubric Customizer Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-violet/20 px-2.5 py-0.5 text-xs font-bold text-brand-violet">
              SPLIT-SCREEN JURY SUITE
            </span>
            <span className="text-xs text-zinc-400">Zero-Login Magic Access</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            Live Evaluation & Rubric Studio
          </h1>
          <p className="text-xs text-zinc-400">
            Inspect project artifacts on the left, score on customizable rubrics on the right.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRubricCustomizer(!showRubricCustomizer)}
            className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-white hover:bg-zinc-700 transition"
          >
            <Sliders className="h-3.5 w-3.5 text-brand-cyan" />
            <span>{showRubricCustomizer ? "Close Rubrics" : "Customize Rubrics"}</span>
          </button>

          <button
            onClick={() => setActiveTab("leaderboard")}
            className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-black hover:bg-zinc-200 transition"
          >
            <Trophy className="h-3.5 w-3.5 text-brand-amber" />
            <span>Live Leaderboard</span>
          </button>
        </div>
      </div>

      {/* Organizer Rubric Customizer Panel (Collapsible) */}
      {showRubricCustomizer && (
        <div className="rounded-2xl border border-brand-cyan/30 bg-zinc-950 p-6 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-brand-cyan" />
                Organizer Rubric Studio (Dynamic Weightages)
              </h2>
              <p className="text-xs text-zinc-400">
                Adjust criteria weightages to match your college or departmental event guidelines.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Total Weight:</span>
              <span
                className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                  totalWeight === 100
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {totalWeight}% {totalWeight === 100 ? "(Valid)" : "(Must sum to 100%)"}
              </span>
            </div>
          </div>

          {/* Existing Rubrics Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rubrics.map((r) => (
              <div key={r.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-xs font-bold text-white leading-tight">{r.name}</h3>
                  <span className="font-mono text-xs font-semibold text-brand-cyan">
                    {r.weightPercentage}%
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2">{r.description}</p>
                <div>
                  <input
                    type="range"
                    min={5}
                    max={60}
                    step={5}
                    value={r.weightPercentage}
                    onChange={(e) => updateRubricWeight(r.id, Number(e.target.value))}
                    className="w-full accent-brand-cyan"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Criterion Form */}
          <form onSubmit={handleAddCustomDimension} className="flex flex-wrap items-center gap-3 pt-2">
            <input
              type="text"
              placeholder="e.g. Research Methodology / Hardware Safety"
              value={newDimName}
              onChange={(e) => setNewDimName(e.target.value)}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:border-brand-cyan focus:outline-none flex-1 min-w-[200px]"
            />
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>Weight:</span>
              <input
                type="number"
                min={5}
                max={50}
                value={newDimWeight}
                onChange={(e) => setNewDimWeight(Number(e.target.value))}
                className="w-16 rounded-xl border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs text-white focus:outline-none font-mono"
              />
              <span>%</span>
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-brand-cyan/20 border border-brand-cyan/40 px-3 py-1.5 text-xs font-bold text-brand-cyan hover:bg-brand-cyan/30 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Dimension</span>
            </button>
          </form>
        </div>
      )}

      {/* Team Selection Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap mr-2">
          Select Queue Team:
        </span>
        {submissions.map((sub, index) => {
          const isSelected = index === selectedSubIndex;
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubIndex(index)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition whitespace-nowrap ${
                isSelected
                  ? "bg-brand-violet text-white shadow-glow"
                  : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
            >
              <span>{sub.teamName}</span>
              <span className="rounded-full bg-black/30 px-1.5 py-0.2 text-[10px]">
                {sub.commitStats.totalCommits} commits
              </span>
            </button>
          );
        })}
      </div>

      {/* Split-Screen Workspace (2 Columns) */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* LEFT COLUMN: Project Artifacts & Git Inspection */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
          <div className="space-y-2 border-b border-zinc-800 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400">TEAM QUEUE #{selectedSubIndex + 1}</span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                Code Freeze Validated
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">{activeSub?.teamName}</h2>
            <p className="text-sm text-zinc-300">{activeSub?.problemStatement}</p>
          </div>

          {/* Quick Artifact Access Links */}
          <div className="grid grid-cols-3 gap-3">
            <a
              href={activeSub?.githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs font-semibold text-zinc-300 hover:border-zinc-600 hover:text-white transition"
            >
              <Github className="h-4 w-4" />
              <span>GitHub Repo</span>
            </a>

            {activeSub?.liveDemoUrl ? (
              <a
                href={activeSub.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-brand-cyan/40 bg-brand-cyan/10 p-3 text-xs font-semibold text-brand-cyan hover:bg-brand-cyan/20 transition"
              >
                <Globe className="h-4 w-4" />
                <span>Live Demo</span>
              </a>
            ) : (
              <div className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-xs text-zinc-600">
                <Globe className="h-4 w-4" />
                <span>No Live Demo</span>
              </div>
            )}

            {activeSub?.presentationDeckUrl ? (
              <a
                href={activeSub.presentationDeckUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-brand-amber/40 bg-brand-amber/10 p-3 text-xs font-semibold text-brand-amber hover:bg-brand-amber/20 transition"
              >
                <FileText className="h-4 w-4" />
                <span>Pitch Deck</span>
              </a>
            ) : (
              <div className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-xs text-zinc-600">
                <FileText className="h-4 w-4" />
                <span>No Deck</span>
              </div>
            )}
          </div>

          {/* Git Heatmap & Tech Stack Audit Box */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Automated Codebase Audit
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-lg border border-zinc-900 bg-zinc-900/60 p-3">
                <div className="text-zinc-500 text-[10px]">TOTAL COMMITS</div>
                <div className="font-mono text-lg font-bold text-white">
                  {activeSub?.commitStats.totalCommits} commits
                </div>
              </div>
              <div className="rounded-lg border border-zinc-900 bg-zinc-900/60 p-3">
                <div className="text-zinc-500 text-[10px]">ACTIVE DEV HOURS</div>
                <div className="font-mono text-lg font-bold text-brand-cyan">
                  {activeSub?.commitStats.activeHours} hours
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] text-zinc-400">Declared Tech Stack:</div>
              <div className="flex flex-wrap gap-1.5">
                {activeSub?.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Rubric Sliders & Scoring */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-brand-violet" />
                Scorecard for {activeSub?.teamName}
              </h2>
              <p className="text-xs text-zinc-400">
                Judge: <span className="font-semibold text-zinc-200">{judgeName}</span>
              </p>
            </div>

            {/* Live Weighted Score Display */}
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-zinc-400">Calculated Score</div>
              <div className="font-mono text-2xl font-black text-brand-lime">
                {liveScore.toFixed(1)} <span className="text-xs text-zinc-500">/ 100</span>
              </div>
            </div>
          </div>

          {isSubmitted && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>Evaluation recorded and normalized via Z-Score algorithm!</span>
            </div>
          )}

          <form onSubmit={handleSubmitEvaluation} className="space-y-5">
            {/* Rubrics Sliders */}
            <div className="space-y-4">
              {rubrics.map((r) => {
                const currentVal = scores[r.id] ?? 7;
                return (
                  <div key={r.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white">{r.name}</span>
                        <span className="ml-2 text-[10px] font-mono text-brand-cyan">({r.weightPercentage}%)</span>
                      </div>
                      <span className="font-mono text-sm font-black text-white">
                        {currentVal} <span className="text-xs text-zinc-500">/ {r.maxPoints}</span>
                      </span>
                    </div>

                    <input
                      type="range"
                      min={1}
                      max={r.maxPoints}
                      step={0.5}
                      value={currentVal}
                      onChange={(e) => handleScoreChange(r.id, Number(e.target.value))}
                      className="w-full accent-brand-violet cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] text-zinc-500 pt-0.5">
                      <span>1: {r.descriptors.low}</span>
                      <span>10: {r.descriptors.high}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Notes & Feedback */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                  <Lock className="h-3 w-3" />
                  Private Jury Notes (Hidden from participants)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Good architecture, but API auth is missing edge cases."
                  value={privateNotes}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-brand-violet focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400">
                  Constructive Feedback for Team
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Fantastic pitch and clear value proposition. Next step is load-testing."
                  value={publicFeedback}
                  onChange={(e) => setPublicFeedback(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-brand-violet focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-violet to-brand-coral py-3 text-xs font-bold text-white hover:opacity-95 transition shadow-glow"
            >
              <Sparkles className="h-4 w-4" />
              <span>Submit Evaluation & Next Team</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
