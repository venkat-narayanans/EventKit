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
} from "lucide-react";

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

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const filteredSubmissions = submissions.filter((s) => s.eventId === currentEvent?.id);

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
    <div className="space-y-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-blue-400" />
            Milestone Submissions & Code Verifier
          </h2>
          <p className="text-xs text-zinc-400">
            Track GitHub commit histories, deployed endpoints, and pitch decks for {currentEvent?.title}.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{isFormOpen ? "Cancel" : "Add Submission"}</span>
        </button>
      </div>

      {/* Manual Submission Form (Collapsible) */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4 text-xs"
        >
          <h3 className="font-bold text-white text-sm">Record Milestone Submission</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-400 font-medium">Select Team</label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:outline-none"
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
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:outline-none"
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
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-zinc-400 font-medium">GitHub Repository URL</label>
              <input
                type="url"
                required
                placeholder="https://github.com/org/repo"
                value={githubRepoUrl}
                onChange={(e) => setGithubRepoUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder-zinc-500 font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-medium">Live Demo URL</label>
              <input
                type="url"
                placeholder="https://demo.vercel.app"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder-zinc-500 font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-medium">Pitch Deck Link (PDF)</label>
              <input
                type="url"
                placeholder="https://cdn.example.com/deck.pdf"
                value={deckUrl}
                onChange={(e) => setDeckUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder-zinc-500 font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 font-medium">Declared Tech Stack (Comma separated)</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="rounded-lg border border-zinc-800 px-3 py-1.5 text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-1.5 font-semibold text-white hover:bg-blue-500"
            >
              Save Submission
            </button>
          </div>
        </form>
      )}

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-12 text-center text-xs text-zinc-500 space-y-2">
          <GitBranch className="h-8 w-8 text-zinc-600 mx-auto" />
          <p>No project submissions recorded for {currentEvent?.title} yet.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="text-blue-400 font-semibold hover:underline"
          >
            + Click here to add a project submission
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredSubmissions.map((sub) => (
            <div
              key={sub.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 hover:border-zinc-700 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400 uppercase">
                    Phase {sub.phase} Completed
                  </span>
                  <h3 className="font-bold text-white text-base mt-1.5">{sub.teamName}</h3>
                  <p className="text-xs text-zinc-300 mt-0.5">{sub.problemStatement}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    {sub.commitsCount} Commits
                  </div>
                  <div className="text-[10px] text-zinc-500">Verified Activity</div>
                </div>
              </div>

              {/* Tech Stack Tags */}
              <div className="flex flex-wrap gap-1">
                {sub.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Artifact Links */}
              <div className="flex items-center gap-3 pt-3 border-t border-zinc-800/80 text-xs">
                <a
                  href={sub.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
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
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition font-medium"
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
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition font-medium"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Slide Deck</span>
                    <ExternalLink className="h-2.5 w-2.5 text-amber-500" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
