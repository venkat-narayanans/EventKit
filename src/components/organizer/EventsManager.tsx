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
  Clock,
  QrCode,
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
    <div className="space-y-8 py-6">
      {/* Top Metric Bar */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="text-xs text-zinc-400 font-medium">Active Competition Tracks</div>
          <div className="mt-1 text-2xl font-bold text-white">{events.length}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Across this symposium</div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="text-xs text-zinc-400 font-medium">Registered Squads</div>
          <div className="mt-1 text-2xl font-bold text-blue-400">
            {teams.length}
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">
            {teams.reduce((acc, t) => acc + (t.members?.length || 1), 0)} individual students
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="text-xs text-zinc-400 font-medium">Auditorium Check-Ins</div>
          <div className="mt-1 text-2xl font-bold text-emerald-400">
            {teams.filter((t) => t.checkedIn).length} / {teams.length}
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Verified on-ground entry</div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="text-xs text-zinc-400 font-medium">Total Cash & Awards</div>
          <div className="mt-1 text-2xl font-bold text-amber-400">
            {currentEvent?.prizes.pool || "₹55,000"}
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">In current active track</div>
        </div>
      </div>

      {/* Events Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Event Operations & Tracks</h2>
          <p className="text-xs text-zinc-400">
            Select an active track to manage participants, QR check-ins, and rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Event</span>
          </button>

          <button
            onClick={() => setViewMode("portal")}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white transition"
          >
            <span>Preview Student Portal</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Events Card Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((ev) => {
          const isSelected = ev.id === currentEvent?.id;
          const regCount = teams.filter((t) => t.eventId === ev.id).length;

          return (
            <div
              key={ev.id}
              onClick={() => setSelectedEventId(ev.id)}
              className={`group relative rounded-xl border p-4 transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-blue-500/80 bg-zinc-900/80 shadow-md"
                  : "border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                    {ev.category.replace("_", " ")}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {ev.isPaid ? `₹${ev.ticketPrice}` : "FREE"}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition">
                    {ev.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{ev.tagline}</p>
                </div>

                <div className="space-y-1 text-xs text-zinc-500 border-t border-zinc-800/60 pt-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="text-zinc-300">{ev.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="text-zinc-300">
                      {regCount} / {ev.maxTeams} Squads ({ev.teamSizeMin}–{ev.teamSizeMax} per team)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                <span className="text-xs font-medium text-blue-400">
                  {isSelected ? "Active Track" : "Click to Manage"}
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
                    className="p-1 text-zinc-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Event: Real Attendee Roster & On-Ground QR Check-In Engine */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              Live Participant Roster — {currentEvent?.title}
            </h3>
            <p className="text-xs text-zinc-400">
              {eventTeams.length} registered squads • {checkedInCount} checked in
            </p>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search team or college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-zinc-950 pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none w-64"
            />
          </div>
        </div>

        {filteredTeams.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No registered teams found for this search. Switch to Student View to register a test team.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="pb-2">Team & Leader</th>
                  <th className="pb-2">Institution</th>
                  <th className="pb-2">Ticket ID</th>
                  <th className="pb-2">Payment</th>
                  <th className="pb-2 text-right">On-Ground Entry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-zinc-800/30 transition">
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
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          team.paymentStatus === "verified"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {team.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => toggleCheckIn(team.id)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                          team.checkedIn
                            ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30"
                            : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                        }`}
                      >
                        {team.checkedIn ? "✓ Checked In" : "Scan / Check In"}
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
