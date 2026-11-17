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
  Check,
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
      {/* Top Metric Bar (Clean Blue & White Cards) */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-blue-100 bg-white p-4 sm:p-5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Active Tracks
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-fortnite text-blue-950">
            {events.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across this fest</div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-blue-100 bg-white p-4 sm:p-5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Registered Squads
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-fortnite text-blue-950">
            {teams.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {teams.reduce((acc, t) => acc + (t.members?.length || 1), 0)} students
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-blue-100 bg-white p-4 sm:p-5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            On-Ground Check-Ins
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-fortnite text-emerald-600">
            {teams.filter((t) => t.checkedIn).length} / {teams.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Verified attendance</div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-blue-100 bg-white p-4 sm:p-5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-700" />
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Prize Pool
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-fortnite text-blue-600">
            {currentEvent?.prizes.pool || "₹55,000"}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 truncate">In active track</div>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="font-fortnite text-2xl text-blue-950 uppercase tracking-wide">
            Competition Tracks
          </h2>
          <p className="text-xs text-slate-600">
            Select an active event track to manage attendance, rubrics, and project submissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreate}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition min-h-[38px] shadow-sm shadow-blue-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Create Track</span>
          </button>

          <button
            onClick={() => setViewMode("portal")}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 transition min-h-[38px]"
          >
            <span>Student View</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Events Card Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {events.map((ev) => {
          const isSelected = ev.id === currentEvent?.id;
          const regCount = teams.filter((t) => t.eventId === ev.id).length;

          return (
            <div
              key={ev.id}
              onClick={() => setSelectedEventId(ev.id)}
              className={`group relative overflow-hidden rounded-2xl border p-5 transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600 shadow-md shadow-blue-500/10"
                  : "border-blue-100 bg-white hover:border-blue-300 hover:shadow-sm"
              }`}
            >
              {/* Top Accent Stripe */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  isSelected ? "bg-blue-600" : "bg-blue-200"
                }`}
              />

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                    {ev.category.replace("_", " ")}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 font-mono">
                    {ev.isPaid ? `₹${ev.ticketPrice}` : "FREE"}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
                    {ev.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600 leading-relaxed">
                    {ev.tagline}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-slate-700 truncate">{ev.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-slate-700">
                      {regCount} / {ev.maxTeams} Squads ({ev.teamSizeMin}–{ev.teamSizeMax} per squad)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600">
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
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Participant Roster Table (Blue & White) */}
      <div className="rounded-2xl border border-blue-100 bg-white p-4 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Live Participant Roster — {currentEvent?.title}
            </h3>
            <p className="text-xs text-slate-500">
              {eventTeams.length} registered squads • {checkedInCount} checked in
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search squad or college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {filteredTeams.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No registered teams match your search. Switch to Student View to register a squad.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="pb-2.5">Squad & Leader</th>
                  <th className="pb-2.5">Institution</th>
                  <th className="pb-2.5">Ticket ID</th>
                  <th className="pb-2.5">Payment</th>
                  <th className="pb-2.5 text-right">Venue Entry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3">
                      <div className="font-bold text-slate-900">{team.teamName}</div>
                      <div className="text-[11px] text-slate-500">
                        {team.leaderName} ({team.leaderEmail})
                      </div>
                    </td>
                    <td className="py-3 text-slate-700 font-medium">
                      {team.collegeName}
                    </td>
                    <td className="py-3 font-mono text-[11px] text-slate-600 font-semibold">
                      {team.ticketId}
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          team.paymentStatus === "verified"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {team.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => toggleCheckIn(team.id)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition min-h-[32px] ${
                          team.checkedIn
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                            : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
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
