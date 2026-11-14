"use client";

import React, { useState } from "react";
import { useFestraStore } from "@/lib/store";
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  QrCode,
} from "lucide-react";

export const FestDetailView: React.FC = () => {
  const { fest, selectedEventId, setSelectedEventId, setActiveTab } = useFestraStore();
  const event = fest.events.find((e) => e.id === selectedEventId) || fest.events[0];

  const [teamName, setTeamName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [collegeName, setCollegeName] = useState("National Institute of Technology, Trichy");
  const [utrNumber, setUtrNumber] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !leaderEmail) return;
    setIsRegistered(true);
  };

  return (
    <div className="space-y-8 py-6">
      {/* Event Track Selector Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-zinc-800 pb-3 no-scrollbar">
        {fest.events.map((ev) => {
          const isSelected = ev.id === event.id;
          return (
            <button
              key={ev.id}
              onClick={() => {
                setSelectedEventId(ev.id);
                setIsRegistered(false);
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap ${
                isSelected
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: ev.trackColor }}
              />
              {ev.title}
            </button>
          );
        })}
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-10">
        <div
          className="absolute top-0 right-0 h-40 w-96 opacity-20 blur-3xl rounded-full"
          style={{ backgroundColor: event.trackColor }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span
                className="rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-black"
                style={{ backgroundColor: event.trackColor }}
              >
                {event.category.replace("_", " ")}
              </span>
              <span className="text-xs font-medium text-zinc-400">
                Part of {fest.name}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              {event.title}
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {event.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-brand-cyan" />
                <span>Starts Nov 20, 09:00 AM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-brand-coral" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-brand-lime" />
                <span>{event.currentTeamsCount} / {event.maxTeams} Teams Registered</span>
              </div>
            </div>
          </div>

          {/* Prize Pool Callout */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 text-center min-w-[220px] space-y-2">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Total Prize Pool
            </span>
            <div className="text-2xl font-black text-brand-amber">
              {event.prizes.pool}
            </div>
            <div className="text-[11px] text-zinc-400 space-y-0.5 border-t border-zinc-800/80 pt-2 text-left">
              <div>🥇 1st: <span className="font-semibold text-zinc-200">{event.prizes.first}</span></div>
              <div>🥈 2nd: <span className="font-semibold text-zinc-200">{event.prizes.second}</span></div>
              <div>🥉 3rd: <span className="font-semibold text-zinc-200">{event.prizes.third}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Timeline & Rules */}
        <div className="space-y-8 lg:col-span-2">
          {/* Milestone Schedule */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-cyan" />
              Event Schedule & Milestone Gates
            </h3>

            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
              {event.schedule.map((item, idx) => (
                <div key={idx} className="relative flex items-start gap-4 pl-8">
                  <div
                    className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-zinc-950"
                    style={{ backgroundColor: event.trackColor }}
                  />
                  <div>
                    <span className="text-xs font-semibold text-brand-amber">
                      {item.time}
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules & Eligibility */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-lime" />
              Evaluation Guidelines & Rules
            </h3>

            <ul className="space-y-2 text-xs text-zinc-300">
              {event.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-brand-coral font-bold">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Instant Registration & Fraud-Proof UPI Checkout */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Team Registration
              </h3>
              <p className="text-xs text-zinc-400">
                {event.isPaid ? `Entry Fee: ₹${event.ticketPrice} per squad` : "Free Registration"}
              </p>
            </div>

            {isRegistered ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">
                  Registration Confirmed!
                </h4>
                <p className="text-xs text-zinc-300">
                  Team <span className="font-semibold text-white">{teamName}</span> is registered for {event.title}.
                </p>

                <div className="p-3 bg-zinc-950 rounded-lg text-xs font-mono text-zinc-400 space-y-1 text-left">
                  <div>TICKET: <span className="text-brand-cyan">#TK-84920</span></div>
                  <div>PASS: <span className="text-emerald-400">VERIFIED ACTIVE</span></div>
                  <div>LEADER: {leaderEmail}</div>
                </div>

                <button
                  onClick={() => setActiveTab("pipeline")}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-white py-2 text-xs font-bold text-black hover:bg-zinc-200 transition"
                >
                  <span>Go to Submission Pipeline</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400">
                    Team Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nexus Protocol"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-brand-violet focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400">
                    Team Leader College Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="aditya@nitt.edu"
                    value={leaderEmail}
                    onChange={(e) => setLeaderEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-brand-violet focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400">
                    Institution / University
                  </label>
                  <input
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-brand-violet focus:outline-none"
                  />
                </div>

                {event.isPaid && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Pay via UPI Intent:</span>
                      <span className="font-bold text-white">₹{event.ticketPrice}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
                        <QrCode className="h-10 w-10 text-brand-cyan" />
                      </div>
                      <div className="text-[11px] text-zinc-400 space-y-1">
                        <div>VPA: <span className="font-mono text-zinc-200">festra@icici</span></div>
                        <div className="text-[10px] text-zinc-500">Auto-verified against fake screenshots</div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-zinc-400">
                        12-Digit Bank UTR / Reference ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 432190887123"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:border-brand-cyan focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-violet to-brand-coral py-2.5 text-xs font-bold text-white hover:opacity-95 transition shadow-glow"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Confirm Registration</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
