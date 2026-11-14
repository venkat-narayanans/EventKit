"use client";

import React from "react";
import { useFestraStore } from "@/lib/store";
import {
  Sparkles,
  Trophy,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  ChevronRight,
  Cpu,
  GraduationCap,
  Flame,
} from "lucide-react";

export const ExploreView: React.FC = () => {
  const { fest, setSelectedEventId, setActiveTab } = useFestraStore();

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setActiveTab("fest");
  };

  return (
    <div className="space-y-12 py-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-8 sm:p-12 shadow-2xl">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-violet/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand-coral/15 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-coral/30 bg-brand-coral/10 px-3.5 py-1 text-xs font-semibold text-brand-coral">
            <Flame className="h-3.5 w-3.5" />
            <span>ANNUAL FLAGSHIP FESTIVAL IS LIVE</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
            Build. Ship. <span className="bg-gradient-to-r from-brand-coral via-brand-amber to-brand-cyan bg-clip-text text-transparent">Get Verified.</span>
          </h1>

          <p className="text-base text-zinc-300 sm:text-lg leading-relaxed">
            Welcome to <span className="font-semibold text-white">{fest.name}</span> at{" "}
            <span className="font-semibold text-white">{fest.institutionName}</span>. A unified, zero-friction operations platform powering multi-track technical hackathons, research expos, and verifiable proof-of-work credentials.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs sm:text-sm text-zinc-400">
            <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5">
              <Calendar className="h-4 w-4 text-brand-cyan" />
              <span>{fest.dates}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5">
              <MapPin className="h-4 w-4 text-brand-coral" />
              <span>{fest.location}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5">
              <GraduationCap className="h-4 w-4 text-brand-amber" />
              <span>{fest.naacGrade}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flagship Sub-Events Showcase */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Featured Competition Tracks
            </h2>
            <p className="text-sm text-zinc-400">
              Select an event to view milestone pipelines, register your squad, or inspect the custom judging rubrics.
            </p>
          </div>
          <span className="text-xs font-medium text-zinc-500">
            {fest.events.length} Tracks Open
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {fest.events.map((event) => {
            const isFull = event.currentTeamsCount >= event.maxTeams;
            const slotsLeft = event.maxTeams - event.currentTeamsCount;

            return (
              <div
                key={event.id}
                onClick={() => handleSelectEvent(event.id)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900/70 hover:shadow-xl cursor-pointer"
              >
                {/* Accent top stripe */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5 transition-all group-hover:h-2"
                  style={{ backgroundColor: event.trackColor }}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-black"
                      style={{ backgroundColor: event.trackColor }}
                    >
                      {event.category.replace("_", " ")}
                    </span>

                    <span className="text-xs font-semibold text-brand-amber">
                      🏆 {event.prizes.pool}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-cyan transition">
                      {event.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
                      {event.tagline}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-zinc-800/80 pt-3 text-xs text-zinc-400">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-zinc-500" />
                        Team Size
                      </span>
                      <span className="font-medium text-zinc-200">
                        {event.teamSizeMin}–{event.teamSizeMax} Members
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Trophy className="h-3.5 w-3.5 text-zinc-500" />
                        Registration
                      </span>
                      <span className="font-semibold text-emerald-400">
                        {event.isPaid ? `₹${event.ticketPrice} / Team` : "FREE"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Venue</span>
                      <span className="font-medium text-zinc-300 truncate max-w-[150px]">
                        {event.venue}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <span className={`text-[11px] font-medium ${isFull ? "text-rose-400" : "text-zinc-400"}`}>
                    {isFull ? "Capacity Reached" : `${slotsLeft} team slots remaining`}
                  </span>

                  <span className="flex items-center gap-1 text-xs font-semibold text-white group-hover:text-brand-coral transition">
                    View Track <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why Festra Beats Legacy Tools (Feature Highlights) */}
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/60 p-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-violet">
            Engineered for Ground Reality
          </span>
          <h3 className="text-2xl font-bold text-white">
            Built for 1,000+ Person Campus Chaos
          </h3>
          <p className="text-xs text-zinc-400">
            Say goodbye to crashed Google Forms, fake UPI screenshots, lost paper rubrics, and delayed certificates.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-coral/10 text-brand-coral">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Fraud-Proof UPI Flow</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Direct UTR bank validation terminates fake screenshot uploads and automates ticket confirmations.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-cyan/10 text-brand-cyan">
              <Cpu className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Milestone Git Verification</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Gated Phase 1, Phase 2, and Final submissions track commit heatmaps to detect pre-built code dumping.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-amber/10 text-brand-amber">
              <Trophy className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Z-Score Normalization</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Standardizes harsh vs. generous judges across different rooms to guarantee fair, undisputed rankings.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-lime/10 text-brand-lime">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Verifiable Proof-of-Work</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dynamic QR credentials link directly to GitHub repos, project demos, and 1-click LinkedIn badges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
