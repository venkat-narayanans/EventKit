"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { Event, RegisteredTeam, TeamMember } from "@/types";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Crown,
  ExternalLink,
  Mail,
  MapPin,
  Pencil,
  Plus,
  QrCode,
  Search,
  Ticket,
  Trash2,
  Trophy,
  User,
  Users,
} from "lucide-react";

interface EventsManagerProps {
  onOpenCreate: () => void;
  onEditEvent: (event: Event) => void;
  onOpenQrModal?: (eventId?: string) => void;
}

export const EventsManager: React.FC<EventsManagerProps> = ({
  onOpenCreate,
  onEditEvent,
  onOpenQrModal,
}) => {
  const {
    events,
    setSelectedEventId,
    deleteEvent,
    teams,
    toggleCheckIn,
    setViewMode,
  } = useStore();

  // Level 1 (null) = list of organizer's events; Level 2 (eventId) = analytics & teams for clicked event
  const [openedEventId, setOpenedEventId] = useState<string | null>(null);
  // Level 3 (teamId) = expanded teammate details for clicked team
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const openedEvent = openedEventId
    ? events.find((e) => e.id === openedEventId) || null
    : null;

  const handleOpenEvent = (eventId: string) => {
    setOpenedEventId(eventId);
    setSelectedEventId(eventId);
    setSelectedTeamId(null);
    setSearchTerm("");
  };

  const handleBackToEvents = () => {
    setOpenedEventId(null);
    setSelectedTeamId(null);
    setSearchTerm("");
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const getTeamMembers = (team: RegisteredTeam): TeamMember[] => {
    if (team.members && team.members.length > 0) return team.members;
    return [
      {
        id: `lead-${team.id}`,
        name: team.leaderName,
        email: team.leaderEmail,
        college: team.collegeName,
        role: "lead",
      },
    ];
  };

  // =========================================================================
  // LEVEL 1: ORGANIZER'S CREATED EVENTS LIST (NO ANALYTICS UNTIL CLICKED)
  // =========================================================================
  if (!openedEvent) {
    return (
      <div className="space-y-6 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-4">
          <div>
            <h2 className="font-fortnite text-2xl sm:text-3xl text-blue-950 uppercase tracking-wide">
              YOUR CREATED EVENTS ({events.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any event below to open its registration analytics, registered teams, and teammate details.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenQrModal && (
              <button
                onClick={() => onOpenQrModal()}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 font-fortnite text-sm tracking-wide text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition min-h-[38px]"
              >
                <QrCode className="h-4 w-4" />
                <span>REGISTRATION QR</span>
              </button>
            )}

            <button
              onClick={onOpenCreate}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 transition min-h-[38px] shadow-sm shadow-blue-500/20"
            >
              <Plus className="h-4 w-4" />
              <span>CREATE EVENT</span>
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

        {/* Empty State */}
        {events.length === 0 ? (
          <div className="rounded-3xl border border-blue-100 bg-white p-12 text-center space-y-3 shadow-sm">
            <h3 className="font-fortnite text-2xl text-blue-950 uppercase">
              NO EVENTS CREATED YET
            </h3>
            <p className="text-xs text-slate-500">
              Create your first campus event to start accepting team registrations.
            </p>
            <button
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 transition shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>CREATE FIRST EVENT</span>
            </button>
          </div>
        ) : (
          /* Clean Organizer Events Grid */
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                onClick={() => handleOpenEvent(ev.id)}
                className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 transition cursor-pointer flex flex-col justify-between hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/10"
              >
                {/* Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600/80 group-hover:bg-blue-600 transition" />

                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                      {ev.category.replace("_", " ")}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 font-mono">
                      {ev.isPaid ? `₹${ev.ticketPrice} / Squad` : "FREE"}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-fortnite text-xl text-blue-950 uppercase tracking-wide group-hover:text-blue-600 transition leading-snug">
                      {ev.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600 leading-relaxed">
                      {ev.tagline}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                      <span className="text-slate-700 truncate">{ev.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                      <span className="text-slate-700">{formatDate(ev.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                      <span className="text-slate-700">
                        Prize Pool: <strong className="text-blue-950">{ev.prizes.pool}</strong> •{" "}
                        {ev.teamSizeMin}–{ev.teamSizeMax} / squad
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 font-fortnite text-sm uppercase tracking-wide text-blue-600 group-hover:translate-x-0.5 transition">
                    <span>VIEW ANALYTICS & TEAMS</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>

                  <div className="flex items-center gap-1">
                    {onOpenQrModal && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenQrModal(ev.id);
                        }}
                        title="Generate Registration QR Code for this track"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-bold text-slate-700 hover:text-blue-600 hover:border-blue-300 transition"
                      >
                        <QrCode className="h-3 w-3" />
                        <span>QR</span>
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEvent(ev);
                      }}
                      title="Edit event track"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50/70 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition"
                    >
                      <Pencil className="h-3 w-3" />
                      <span>Edit</span>
                    </button>

                    {events.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${ev.title}"?`)) {
                            deleteEvent(ev.id);
                          }
                        }}
                        title="Delete event"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // LEVEL 2 & LEVEL 3: SELECTED EVENT ANALYTICS + REGISTERED TEAMS + TEAMMATES
  // =========================================================================
  const eventTeams = teams.filter((t) => t.eventId === openedEvent.id);
  const checkedInCount = eventTeams.filter((t) => t.checkedIn).length;
  const totalParticipants = eventTeams.reduce(
    (acc, t) => acc + getTeamMembers(t).length,
    0
  );
  const turnoutPercent =
    eventTeams.length > 0 ? Math.round((checkedInCount / eventTeams.length) * 100) : 0;

  const filteredTeams = eventTeams.filter((t) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    const memberMatch = getTeamMembers(t).some(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.college.toLowerCase().includes(q)
    );
    return (
      t.teamName.toLowerCase().includes(q) ||
      t.leaderName.toLowerCase().includes(q) ||
      t.collegeName.toLowerCase().includes(q) ||
      t.ticketId.toLowerCase().includes(q) ||
      memberMatch
    );
  });

  return (
    <div className="space-y-6 py-4 sm:py-6">
      {/* Back Breadcrumb + Selected Event Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-4">
        <div className="space-y-1.5">
          <button
            onClick={handleBackToEvents}
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-50 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Events</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-fortnite text-2xl sm:text-3xl text-blue-950 uppercase tracking-wide">
              {openedEvent.title}
            </h2>
            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              {openedEvent.category.replace("_", " ")}
            </span>
          </div>

          <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-blue-500" />
              {openedEvent.venue}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-blue-500" />
              {formatDate(openedEvent.startDate)}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {onOpenQrModal && (
            <button
              onClick={() => onOpenQrModal(openedEvent.id)}
              className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 font-fortnite text-sm tracking-wide text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition min-h-[38px]"
            >
              <QrCode className="h-4 w-4" />
              <span>EVENT QR PASS</span>
            </button>
          )}

          <button
            onClick={() => onEditEvent(openedEvent)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 transition min-h-[38px] shadow-sm shadow-blue-500/20"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>EDIT EVENT</span>
          </button>

          <button
            onClick={() => setViewMode("portal")}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 transition min-h-[38px]"
          >
            <span>Open Student Registration</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* EVENT-SPECIFIC ANALYTICS CARDS */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-100 bg-white p-4 sm:p-5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Teams Registered
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-fortnite text-blue-950">
            {eventTeams.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            of {openedEvent.maxTeams} max capacity
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-4 sm:p-5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-sky-500" />
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Total Participants
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-fortnite text-blue-950">
            {totalParticipants}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {openedEvent.teamSizeMin}–{openedEvent.teamSizeMax} members per team
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-4 sm:p-5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Checked-In Teams
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-fortnite text-emerald-600">
            {checkedInCount} / {eventTeams.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {turnoutPercent}% verified turnout
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-4 sm:p-5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Prize Pool
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-fortnite text-blue-600">
            {openedEvent.prizes.pool}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {openedEvent.isPaid ? `₹${openedEvent.ticketPrice} / Squad` : "Free Entry"}
          </div>
        </div>
      </div>

      {/* REGISTERED TEAMS LIST (CLICK ANY TEAM TO SEE TEAMMATES DETAILS) */}
      <div className="rounded-2xl border border-blue-100 bg-white p-4 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-fortnite text-xl text-blue-950 uppercase tracking-wide flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              REGISTERED TEAMS ({eventTeams.length})
            </h3>
            <p className="text-xs text-slate-500">
              Click any team below to inspect all teammates&apos; details, roles, and registered email IDs.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search team, teammate, or college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {filteredTeams.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500 space-y-2">
            <Users className="h-8 w-8 text-slate-300 mx-auto" />
            <p>
              {eventTeams.length === 0
                ? `No teams have registered for "${openedEvent.title}" yet.`
                : "No teams match your search query."}
            </p>
            {eventTeams.length === 0 && (
              <button
                onClick={() => setViewMode("portal")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Switch to Student View to register a team
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTeams.map((team) => {
              const members = getTeamMembers(team);
              const isExpanded = selectedTeamId === team.id;

              return (
                <div
                  key={team.id}
                  className={`rounded-2xl border transition overflow-hidden ${
                    isExpanded
                      ? "border-blue-500 bg-blue-50/20 shadow-md shadow-blue-500/5"
                      : "border-slate-200 bg-white hover:border-blue-300"
                  }`}
                >
                  {/* Clickable Team Row */}
                  <div
                    onClick={() =>
                      setSelectedTeamId(isExpanded ? null : team.id)
                    }
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl font-fortnite text-lg ${
                          isExpanded
                            ? "bg-blue-600 text-white"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {team.teamName.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-fortnite text-lg text-blue-950 uppercase tracking-wide truncate">
                            {team.teamName}
                          </h4>
                          <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                            {members.length}{" "}
                            {members.length === 1 ? "Teammate" : "Teammates"}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              team.paymentStatus === "verified"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {team.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span className="font-medium text-slate-700">
                            Lead: {team.leaderName}
                          </span>
                          <span>•</span>
                          <span>{team.collegeName}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {team.ticketId}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCheckIn(team.id);
                        }}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition min-h-[32px] ${
                          team.checkedIn
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                            : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                        }`}
                      >
                        {team.checkedIn ? "✓ Checked In" : "Scan Entry"}
                      </button>

                      <span className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                        <span>{isExpanded ? "Hide Teammates" : "View Teammates"}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5 text-blue-600" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                        )}
                      </span>
                    </div>
                  </div>

                  {/* LEVEL 3: EXPANDED TEAMMATES DETAILS PANEL */}
                  {isExpanded && (
                    <div className="border-t border-blue-100 bg-slate-50/70 p-4 sm:p-5 space-y-4">
                      {/* Team Metadata Summary Strip */}
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-600 bg-white rounded-xl border border-slate-200 px-3.5 py-2.5">
                        <span className="inline-flex items-center gap-1.5">
                          <Ticket className="h-3.5 w-3.5 text-blue-600" />
                          Ticket ID: <strong className="font-mono text-slate-900">{team.ticketId}</strong>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-blue-600" />
                          Institution: <strong className="text-slate-900">{team.collegeName}</strong>
                        </span>
                        {team.utrNumber && (
                          <span className="inline-flex items-center gap-1.5">
                            <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                            UTR Ref: <strong className="font-mono text-slate-900">{team.utrNumber}</strong>
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5">
                          <CheckCircle2
                            className={`h-3.5 w-3.5 ${
                              team.checkedIn ? "text-emerald-600" : "text-slate-400"
                            }`}
                          />
                          Status:{" "}
                          <strong className={team.checkedIn ? "text-emerald-700" : "text-slate-700"}>
                            {team.checkedIn ? "Checked In at Venue" : "Awaiting Check-In"}
                          </strong>
                        </span>
                      </div>

                      {/* Teammates Detail Cards */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Teammates Roster ({members.length})
                        </div>

                        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                          {members.map((member, idx) => {
                            const isLead = member.role === "lead";
                            return (
                              <div
                                key={member.id || idx}
                                className="rounded-xl border border-blue-100 bg-white p-3.5 space-y-2 shadow-sm"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div
                                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-bold text-xs ${
                                        isLead
                                          ? "bg-blue-600 text-white"
                                          : "bg-slate-100 text-slate-700 border border-slate-200"
                                      }`}
                                    >
                                      {isLead ? (
                                        <Crown className="h-4 w-4" />
                                      ) : (
                                        <User className="h-4 w-4" />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-bold text-slate-900 text-sm truncate">
                                        {member.name}
                                      </div>
                                      <span
                                        className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                          isLead
                                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                                            : "bg-slate-100 text-slate-600"
                                        }`}
                                      >
                                        {isLead ? "Team Lead" : "Member"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-1 pt-2 border-t border-slate-100 text-[11px]">
                                  <a
                                    href={`mailto:${member.email}`}
                                    className="flex items-center gap-1.5 text-blue-600 hover:underline truncate font-medium"
                                  >
                                    <Mail className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{member.email}</span>
                                  </a>
                                  <div className="flex items-center gap-1.5 text-slate-600 truncate">
                                    <Building2 className="h-3 w-3 flex-shrink-0 text-slate-400" />
                                    <span className="truncate">
                                      {member.college || team.collegeName}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
