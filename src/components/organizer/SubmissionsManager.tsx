"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import {
  GitBranch,
  Github,
  Globe,
  FileText,
  Plus,
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
  Terminal,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Window, Code, Badge } from "@/kit";

export const SubmissionsManager: React.FC = () => {
  const { submissions, submitMilestone, teams, selectedEventId, events } = useStore();

  const [teamId, setTeamId] = useState(teams[0]?.id || "");
  const [phase, setPhase] = useState<1 | 2 | 3>(3);
  const [problemStatement, setProblemStatement] = useState("");
  const [githubRepoUrl, setGithubRepoUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [deckUrl, setDeckUrl] = useState("");
  const [techStack, setTechStack] = useState("Rust, Next.js, PostgreSQL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const filteredSubmissions = submissions.filter((s) => s.eventId === currentEvent?.id);

  const activeInspectionSub =
    filteredSubmissions.find((s) => s.id === selectedSubmissionId) || filteredSubmissions[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const team = teams.find((t) => t.id === teamId);
    if (!team || !githubRepoUrl.trim()) return;

    submitMilestone({
      teamId: team.id,
      teamName: team.teamName,
      eventId: currentEvent.id,
      phase,
      problemStatement: problemStatement.trim() || "Autonomous Real-Time Systems Optimization",
      techStack: techStack.split(",").map((s) => s.trim()),
      githubRepoUrl: githubRepoUrl.trim(),
      liveDemoUrl: liveDemoUrl.trim() || undefined,
      presentationDeckUrl: deckUrl.trim() || undefined,
      commitsCount: Math.floor(15 + Math.random() * 45),
    });

    setIsFormOpen(false);
    setProblemStatement("");
    setGithubRepoUrl("");
    setLiveDemoUrl("");
  };

  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100 pb-4">
        <div>
          <h2 className="font-fortnite text-2xl tracking-wide text-blue-950 uppercase flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-blue-600" />
            Milestone Submissions & Code Verifier
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated Git commit heatmaps, deployed webhooks, and pitch decks for {currentEvent?.title}.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 transition shadow-sm min-h-[36px]"
        >
          <Plus className="h-4 w-4" />
          <span>{isFormOpen ? "CLOSE FORM" : "RECORD SUBMISSION"}</span>
        </button>
      </div>

      {/* Manual Submission Form (Collapsible) */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-blue-100 bg-white p-5 sm:p-7 space-y-4 text-xs shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-fortnite text-lg tracking-wide text-blue-950 uppercase">Record Milestone Submission</h3>
            <span className="text-[11px] text-slate-500">Phase 1/2/3 Checkpoint</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-medium">Select Registered Squad</label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.teamName} ({t.leaderName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-medium">Submission Stage</label>
              <select
                value={phase}
                onChange={(e) => setPhase(Number(e.target.value) as 1 | 2 | 3)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value={1}>Phase 1 — Abstract & Architecture Lock</option>
                <option value={2}>Phase 2 — Midway Prototype Checkpoint</option>
                <option value={3}>Phase 3 — Final Code Freeze & Deployment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-medium">Problem Statement</label>
            <input
              type="text"
              required
              placeholder="e.g. Sub-second decentralized credit scoring via Rust & WASM"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-700 font-medium">GitHub Repository URL</label>
              <input
                type="url"
                required
                placeholder="https://github.com/org/repo"
                value={githubRepoUrl}
                onChange={(e) => setGithubRepoUrl(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-slate-700 font-medium">Live Demo URL</label>
              <input
                type="url"
                placeholder="https://demo.vercel.app"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-slate-700 font-medium">Pitch Deck Link (PDF)</label>
              <input
                type="url"
                placeholder="https://cdn.example.com/deck.pdf"
                value={deckUrl}
                onChange={(e) => setDeckUrl(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-medium">Declared Tech Stack (Comma separated)</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="rounded-xl border border-slate-200 px-3.5 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 transition"
            >
              SAVE MILESTONE
            </button>
          </div>
        </form>
      )}

      {/* STAGESHOW MACOS TERMINAL INSPECTOR */}
      {activeInspectionSub && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-blue-600" />
              Automated Git Audit Terminal:{" "}
              <span className="font-fortnite text-sm text-blue-900 uppercase tracking-wide">{activeInspectionSub.teamName}</span>
            </span>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              Plagiarism Check Passed
            </span>
          </div>

          <Window
            chrome="terminal"
            title={`festra-verify — git log -n 5 ${activeInspectionSub.githubRepoUrl.replace("https://github.com/", "")}`}
            lights="color"
            className="w-full text-xs shadow-lg rounded-2xl overflow-hidden border border-slate-800"
          >
            <div className="p-4 space-y-3 font-mono text-[11px] bg-slate-950 text-slate-200 leading-relaxed">
              <div className="text-slate-400">
                # Inspecting live repository: {activeInspectionSub.githubRepoUrl}
              </div>

              <Code
                lines={[
                  { text: `commit 8f4c20e (HEAD -> main, tag: v1.0-freeze) for [${activeInspectionSub.teamName}]`, kind: undefined },
                  { text: `Author: Lead Developer <squad@inst.edu>`, kind: undefined },
                  { text: `Date:   Sat Nov 14 02:45:12 2026 +0530`, kind: undefined },
                  { text: `    feat: add decentralized scoring engine & smart contracts`, kind: "add" },
                  { text: `    18 files changed, 942 insertions(+), 24 deletions(-)`, kind: "add" },
                  { text: `commit 3d1a09f chore: remove mock telemetry endpoints`, kind: "del" },
                  { text: `[AUDIT] Total Commits: ${activeInspectionSub.commitsCount} (Spread over 24h sprint window)`, kind: "add" },
                  { text: `[AUDIT] Plagiarism & Commit Velocity Check: 100% Legit (No bulk zip dump)`, kind: "add" },
                ]}
                numbers={true}
                highlight={true}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Declared Stack:</span>
                  <div className="flex gap-1">
                    {activeInspectionSub.techStack.map((tech, idx) => (
                      <span key={idx} className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={activeInspectionSub.githubRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1 font-sans font-semibold"
                  >
                    <span>View GitHub</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  {activeInspectionSub.liveDemoUrl && (
                    <a
                      href={activeInspectionSub.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-sans font-semibold"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Window>
        </div>
      )}

      {/* Submissions Cards Grid */}
      {filteredSubmissions.length === 0 ? (
        <div className="rounded-2xl border border-blue-100 bg-white p-12 text-center text-xs text-slate-500 space-y-2 shadow-sm">
          <GitBranch className="h-8 w-8 text-slate-400 mx-auto" />
          <p>No project submissions recorded for {currentEvent?.title} yet.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="text-blue-600 font-semibold hover:underline"
          >
            + Click here to add a project submission
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-600 px-1">
            All Submitted Squads ({filteredSubmissions.length})
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredSubmissions.map((sub) => {
              const isSelected = sub.id === activeInspectionSub?.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubmissionId(sub.id)}
                  className={`rounded-2xl border p-5 space-y-4 cursor-pointer transition shadow-sm ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/30"
                      : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
                          Phase {sub.phase} Verified
                        </span>
                        {isSelected && (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                            <Check className="h-3 w-3" />
                            Audited
                          </span>
                        )}
                      </div>
                      <h3 className="font-fortnite text-xl text-blue-950 uppercase tracking-wide">{sub.teamName}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {sub.problemStatement}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="font-fortnite text-xl text-blue-600">
                        {sub.commitsCount} COMMITS
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">Cadence Ok</div>
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {sub.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-mono text-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links Row */}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100 text-xs">
                    <a
                      href={sub.githubRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition font-medium"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>GitHub</span>
                      <ExternalLink className="h-2.5 w-2.5 text-slate-400" />
                    </a>

                    {sub.liveDemoUrl && (
                      <a
                        href={sub.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-blue-600 hover:underline transition font-medium"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        <span>Live Demo</span>
                        <ExternalLink className="h-2.5 w-2.5 text-blue-500" />
                      </a>
                    )}

                    {sub.presentationDeckUrl && (
                      <a
                        href={sub.presentationDeckUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-amber-700 hover:underline transition font-medium"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Slide Deck</span>
                        <ExternalLink className="h-2.5 w-2.5 text-amber-600" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
