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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-devfolio-blue" />
            Milestone Submissions & Code Verifier
          </h2>
          <p className="text-xs text-zinc-400">
            Automated Git commit heatmaps, deployed webhooks, and pitch decks for {currentEvent?.title}.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition shadow-sm min-h-[36px]"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{isFormOpen ? "Close Form" : "Record Submission"}</span>
        </button>
      </div>

      {/* Manual Submission Form (Collapsible) */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/[0.08] bg-[#111114] p-5 sm:p-7 space-y-4 text-xs shadow-luma-card"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h3 className="font-bold text-white text-sm">Record Milestone Submission</h3>
            <span className="text-[11px] text-zinc-400">Phase 1/2/3 Checkpoint</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-400 font-medium">Select Registered Squad</label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#08080a] px-3.5 py-2.5 text-white focus:outline-none"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.teamName} ({t.leaderName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-zinc-400 font-medium">Submission Stage</label>
              <select
                value={phase}
                onChange={(e) => setPhase(Number(e.target.value) as 1 | 2 | 3)}
                className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#08080a] px-3.5 py-2.5 text-white focus:outline-none"
              >
                <option value={1}>Phase 1 — Abstract & Architecture Lock</option>
                <option value={2}>Phase 2 — Midway Prototype Checkpoint</option>
                <option value={3}>Phase 3 — Final Code Freeze & Deployment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-zinc-400 font-medium">Problem Statement</label>
            <input
              type="text"
              required
              placeholder="e.g. Sub-second decentralized credit scoring via Rust & WASM"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#08080a] px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-zinc-400 font-medium">GitHub Repository URL</label>
              <input
                type="url"
                required
                placeholder="https://github.com/org/repo"
                value={githubRepoUrl}
                onChange={(e) => setGithubRepoUrl(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#08080a] px-3.5 py-2.5 text-white placeholder-zinc-500 font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-medium">Live Demo URL</label>
              <input
                type="url"
                placeholder="https://demo.vercel.app"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#08080a] px-3.5 py-2.5 text-white placeholder-zinc-500 font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-medium">Pitch Deck Link (PDF)</label>
              <input
                type="url"
                placeholder="https://cdn.example.com/deck.pdf"
                value={deckUrl}
                onChange={(e) => setDeckUrl(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#08080a] px-3.5 py-2.5 text-white placeholder-zinc-500 font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 font-medium">Declared Tech Stack (Comma separated)</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#08080a] px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="rounded-xl border border-white/[0.08] px-3.5 py-2 text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-devfolio-blue px-4 py-2 font-bold text-white hover:opacity-95"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* STAGESHOW MACOS TERMINAL INSPECTOR */}
      {activeInspectionSub && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-kahoot-green" />
              Automated Git Audit Terminal:{" "}
              <span className="text-zinc-300 font-mono">{activeInspectionSub.teamName}</span>
            </span>
            <span className="text-[11px] text-kahoot-green font-mono flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Plagiarism Check Passed
            </span>
          </div>

          <Window
            chrome="terminal"
            title={`festra-verify — git log -n 5 ${activeInspectionSub.githubRepoUrl.replace("https://github.com/", "")}`}
            lights="color"
            className="w-full text-xs shadow-2xl rounded-2xl overflow-hidden border border-white/[0.08]"
          >
            <div className="p-4 space-y-3 font-mono text-[11px] bg-[#0a0a0c] text-zinc-300 leading-relaxed">
              <div className="text-zinc-500">
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

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.08] text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Declared Stack:</span>
                  <div className="flex gap-1">
                    {activeInspectionSub.techStack.map((tech, idx) => (
                      <span key={idx} className="rounded bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-300">
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
                    className="text-devfolio-blue hover:underline flex items-center gap-1 font-sans font-semibold"
                  >
                    <span>View GitHub</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  {activeInspectionSub.liveDemoUrl && (
                    <a
                      href={activeInspectionSub.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-kahoot-green hover:underline flex items-center gap-1 font-sans font-semibold"
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
        <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-12 text-center text-xs text-zinc-500 space-y-2">
          <GitBranch className="h-8 w-8 text-zinc-600 mx-auto" />
          <p>No project submissions recorded for {currentEvent?.title} yet.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="text-devfolio-blue font-semibold hover:underline"
          >
            + Click here to add a project submission
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs font-semibold text-white px-1">
            All Submitted Squads ({filteredSubmissions.length})
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredSubmissions.map((sub) => {
              const isSelected = sub.id === activeInspectionSub?.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubmissionId(sub.id)}
                  className={`rounded-2xl border p-5 space-y-4 cursor-pointer transition shadow-luma-card ${
                    isSelected
                      ? "border-devfolio-blue/60 bg-[#141418] ring-1 ring-devfolio-blue/40"
                      : "border-white/[0.08] bg-[#111114] hover:border-white/[0.16]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-devfolio-blue/15 border border-devfolio-blue/30 px-2 py-0.5 text-[10px] font-bold text-devfolio-blue uppercase">
                          Phase {sub.phase} Verified
                        </span>
                        {isSelected && (
                          <span className="text-[10px] text-kahoot-green font-bold flex items-center gap-0.5">
                            <Check className="h-3 w-3" />
                            Audited
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-base">{sub.teamName}</h3>
                      <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                        {sub.problemStatement}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-mono font-bold text-kahoot-green">
                        {sub.commitsCount} Commits
                      </div>
                      <div className="text-[10px] text-zinc-400">Cadence Ok</div>
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {sub.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-[#08080a] border border-white/[0.06] px-2 py-0.5 text-[10px] font-mono text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links Row */}
                  <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06] text-xs">
                    <a
                      href={sub.githubRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-zinc-300 hover:text-white transition font-medium"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>GitHub</span>
                      <ExternalLink className="h-2.5 w-2.5 text-zinc-500" />
                    </a>

                    {sub.liveDemoUrl && (
                      <a
                        href={sub.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-devfolio-blue hover:underline transition font-medium"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        <span>Live Demo</span>
                        <ExternalLink className="h-2.5 w-2.5 text-devfolio-blue" />
                      </a>
                    )}

                    {sub.presentationDeckUrl && (
                      <a
                        href={sub.presentationDeckUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-kahoot-yellow hover:underline transition font-medium"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Slide Deck</span>
                        <ExternalLink className="h-2.5 w-2.5 text-kahoot-yellow" />
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
