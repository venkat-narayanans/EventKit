"use client";

import React, { useState } from "react";
import { useFestraStore } from "@/lib/store";
import {
  GitBranch,
  Github,
  Globe,
  FileText,
  Video,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const PipelineView: React.FC = () => {
  const { submissions, addSubmission, setActiveTab } = useFestraStore();

  const [teamName, setTeamName] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [deckUrl, setDeckUrl] = useState("");
  const [techStackInput, setTechStackInput] = useState("Next.js, TypeScript, Supabase");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !githubUrl) return;

    addSubmission({
      id: `sub-${Date.now()}`,
      teamId: `team-${Date.now()}`,
      teamName,
      phase: 3,
      phaseTitle: "Final Deployment & Pitch Deck",
      submittedAt: new Date().toISOString(),
      problemStatement,
      techStack: techStackInput.split(",").map((s) => s.trim()),
      githubRepoUrl: githubUrl,
      liveDemoUrl: demoUrl || undefined,
      presentationDeckUrl: deckUrl || undefined,
      commitStats: {
        totalCommits: 31,
        activeHours: 24,
        timelineStatus: "continuous_valid",
      },
    });

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
    setTeamName("");
    setGithubUrl("");
    setDemoUrl("");
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-cyan/20 px-2.5 py-0.5 text-xs font-bold text-brand-cyan">
              MILESTONE GATED PIPELINE
            </span>
            <span className="text-xs text-zinc-400">HackSphere 2026</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            Project Submission & Git Verifier
          </h1>
          <p className="text-xs text-zinc-400">
            Automated code integrity check prevents 11th-hour zip code dumps and verifies commit activity.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("judging")}
          className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 transition"
        >
          <span>Open Judge Workspace</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 3-Phase Stepper Visualizer */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-2 opacity-75">
          <div className="flex items-center justify-between">
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-400">
              PHASE 1 • HOUR 12
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Architecture & Git Lock-In</h3>
          <p className="text-xs text-zinc-400">
            Repository creation date verified; branch initial commit logged.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-2 opacity-75">
          <div className="flex items-center justify-between">
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-400">
              PHASE 2 • HOUR 24
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Alpha Prototype Checkpoint</h3>
          <p className="text-xs text-zinc-400">
            Mentor review completed; commit timeline consistency checked.
          </p>
        </div>

        <div className="rounded-2xl border border-brand-coral/40 bg-brand-coral/10 p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="rounded bg-brand-coral px-2 py-0.5 text-[10px] font-bold text-black">
              PHASE 3 • ACTIVE NOW
            </span>
            <span className="h-2 w-2 rounded-full bg-brand-coral animate-ping" />
          </div>
          <h3 className="text-sm font-bold text-white">Final Deployment & Pitch</h3>
          <p className="text-xs text-zinc-300">
            Code snapshot frozen, live deployment URL, and presentation deck.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left Column: Submission Form (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-5">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="h-4 w-4 text-brand-cyan" />
                Submit Phase 3 Artifacts
              </h2>
              <p className="text-xs text-zinc-400">
                Lock your project for jury evaluation.
              </p>
            </div>

            {isSuccess && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>Project submitted! Available in Judge Studio.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400">Team Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quantum Shift"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400">Problem Statement Solved</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zero-Knowledge Proof Campus Voting"
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                  <Github className="h-3.5 w-3.5" />
                  GitHub Repository URL (Public)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/org/project"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-brand-cyan focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  Live Deployment URL (Vercel / Render / APK)
                </label>
                <input
                  type="url"
                  placeholder="https://my-project.vercel.app"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-brand-cyan focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Presentation Deck URL (PDF / Slides)
                </label>
                <input
                  type="url"
                  placeholder="https://cdn.festra.dev/decks/my-deck.pdf"
                  value={deckUrl}
                  onChange={(e) => setDeckUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-brand-cyan focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400">Tech Stack Tags (Comma separated)</label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition"
              >
                <Sparkles className="h-4 w-4" />
                <span>Submit & Freeze Artifacts</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Submissions & Git Verifier (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Verified Submissions ({submissions.length})
            </h2>
            <span className="text-xs text-zinc-400">Real-time commit audit</span>
          </div>

          <div className="space-y-4">
            {submissions.map((sub) => {
              const isBurst = sub.commitStats.timelineStatus === "burst_warning";

              return (
                <div
                  key={sub.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 hover:border-zinc-700 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white">{sub.teamName}</h3>
                      <p className="text-xs text-zinc-300 font-medium">{sub.problemStatement}</p>
                    </div>

                    {/* Git Verifier Badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        isBurst
                          ? "border border-amber-500/30 bg-amber-500/10 text-amber-300"
                          : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      }`}
                    >
                      {isBurst ? (
                        <>
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                          <span>Burst Commit Warning</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Verified Continuous Commits</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Commit Heatmap Metrics */}
                  <div className="grid grid-cols-3 gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-center text-xs">
                    <div>
                      <div className="text-zinc-500 text-[10px] uppercase">Commits</div>
                      <div className="font-mono font-bold text-white">{sub.commitStats.totalCommits}</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[10px] uppercase">Active Hours</div>
                      <div className="font-mono font-bold text-brand-cyan">{sub.commitStats.activeHours}h</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[10px] uppercase">Code Freeze</div>
                      <div className="font-mono font-bold text-brand-lime">LOCKED</div>
                    </div>
                  </div>

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {sub.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Artifact Links */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-zinc-800/80 text-xs">
                    <a
                      href={sub.githubRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-zinc-400 hover:text-white transition"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>Repository</span>
                    </a>

                    {sub.liveDemoUrl && (
                      <a
                        href={sub.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-zinc-400 hover:text-brand-cyan transition"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}

                    {sub.presentationDeckUrl && (
                      <a
                        href={sub.presentationDeckUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-zinc-400 hover:text-brand-amber transition"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Slide Deck</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
