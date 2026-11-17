"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import {
  Layers,
  Users,
  CheckCircle2,
  Trophy,
  Plus,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
  Search,
} from "lucide-react";

interface EventsManagerProps {
  onOpenCreate: () => void;
}

export const EventsManager: React.FC<EventsManagerProps> = ({ onOpenCreate }) => {
  const {
    events,
    selectedEventId,
    setSelectedEventId,
    deleteEvent,
    teams,
    toggleCheckIn,
    setViewMode,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState("");

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const eventTeams = teams.filter((t) => t.eventId === currentEvent?.id);
  const checkedInCount = eventTeams.filter((t) => t.checkedIn).length;

  const filteredTeams = eventTeams.filter(
    (t) =>
      t.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.leaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.collegeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6">
      {/* Top Metric Bar (Luma Clean Panels + Kahoot Accent Indicators) */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-4 sm:p-5 relative overflow-hidden shadow-luma-card">
          <div className="absolute top-0 left-0 w-1 h-full bg-kahoot-blue" />
          <div className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            Active Tracks
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
            {events.length}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Across this fest</div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-4 sm:p-5 relative overflow-hidden shadow-luma-card">
          <div className="absolute top-0 left-0 w-1 h-full bg-devfolio-blue" />
          <div className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            Registered Squads
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
            {teams.length}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            {teams.reduce((acc, t) => acc + (t.members?.length || 1), 0)} students
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-4 sm:p-5 relative overflow-hidden shadow-luma-card">
          <div className="absolute top-0 left-0 w-1 h-full bg-kahoot-green" />
          <div className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            On-Ground Check-Ins
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-kahoot-green">
            {teams.filter((t) => t.checkedIn).length} / {teams.length}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Verified attendance</div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-4 sm:p-5 relative overflow-hidden shadow-luma-card">
          <div className="absolute top-0 left-0 w-1 h-full bg-kahoot-yellow" />
          <div className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            Prize Pool
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-kahoot-yellow">
            {currentEvent?.prizes.pool || "₹55,000"}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1 truncate">In active track</div>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Competition Tracks</h2>
          <p className="text-xs text-zinc-400">
            Select an active event track to manage attendance, rubrics, and project submissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreate}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition min-h-[38px] shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Create Track</span>
          </button>

          <button
            onClick={() => setViewMode("portal")}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#111114] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:border-white/[0.2] transition min-h-[38px]"
          >
            <span>Student View</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Events Card Grid with Kahoot Categorical Accent Ribbons */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {events.map((ev) => {
          const isSelected = ev.id === currentEvent?.id;
          const regCount = teams.filter((t) => t.eventId === ev.id).length;

          // Kahoot 4-quadrant color mapping by category
          const ribbonColor =
            ev.category === "hackathon"
              ? "bg-kahoot-red"
              : ev.category === "paper_presentation"
              ? "bg-kahoot-blue"
              : ev.category === "robotics"
              ? "bg-kahoot-green"
              : "bg-kahoot-yellow";

          return (
            <div
              key={ev.id}
              onClick={() => setSelectedEventId(ev.id)}
              className={`group relative overflow-hidden rounded-2xl border p-5 transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-devfolio-blue/70 bg-[#16161a] shadow-luma-glow"
                  : "border-white/[0.08] bg-[#111114] hover:border-white/[0.18] hover:bg-[#141418]"
              }`}
            >
              {/* Top Accent Stripe */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${ribbonColor}`} />

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/[0.06] text-zinc-300 border border-white/[0.06]">
                    {ev.category.replace("_", " ")}
                  </span>
                  <span className="text-xs font-bold text-kahoot-green font-mono">
                    {ev.isPaid ? `₹${ev.ticketPrice}` : "FREE"}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-devfolio-blue transition">
                    {ev.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-400 leading-relaxed">
                    {ev.tagline}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-400 border-t border-white/[0.06] pt-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="text-zinc-300 truncate">{ev.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="text-zinc-300">
                      {regCount} / {ev.maxTeams} Squads ({ev.teamSizeMin}–{ev.teamSizeMax} per squad)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-semibold text-devfolio-blue">
                  {isSelected ? "Active Track ✓" : "Click to Manage"}
                </span>

                {events.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete "${ev.title}"?`)) {
                        deleteEvent(ev.id);
                      }
                    }}
                    title="Delete track"
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-white/[0.06] transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Participant Roster Table (Mobile Responsive) */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-4 sm:p-6 space-y-4 shadow-luma-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-devfolio-blue" />
              Live Participant Roster — {currentEvent?.title}
            </h3>
            <p className="text-xs text-zinc-400">
              {eventTeams.length} registered squads • {checkedInCount} checked in
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search squad or college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-[#08080a] pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-devfolio-blue focus:outline-none"
            />
          </div>
        </div>

        {filteredTeams.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No registered teams match your search. Switch to Student View to register a squad.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="border-b border-white/[0.06] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="pb-2.5">Squad & Leader</th>
                  <th className="pb-2.5">Institution</th>
                  <th className="pb-2.5">Ticket ID</th>
                  <th className="pb-2.5">Payment</th>
                  <th className="pb-2.5 text-right">Venue Entry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3">
                      <div className="font-semibold text-white">{team.teamName}</div>
                      <div className="text-[11px] text-zinc-400">
                        {team.leaderName} ({team.leaderEmail})
                      </div>
                    </td>
                    <td className="py-3 text-zinc-300 font-medium">
                      {team.collegeName}
                    </td>
                    <td className="py-3 font-mono text-[11px] text-zinc-400">
                      {team.ticketId}
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          team.paymentStatus === "verified"
                            ? "bg-kahoot-green/10 text-kahoot-green border border-kahoot-green/20"
                            : "bg-white/[0.06] text-zinc-400"
                        }`}
                      >
                        {team.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => toggleCheckIn(team.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition min-h-[32px] ${
                          team.checkedIn
                            ? "bg-kahoot-green/15 text-kahoot-green border border-kahoot-green/30 hover:bg-kahoot-green/25"
                            : "bg-white/[0.06] text-zinc-300 hover:text-white hover:bg-white/[0.1]"
                        }`}
                      >
                        {team.checkedIn ? "✓ Checked In" : "Scan Entry"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
