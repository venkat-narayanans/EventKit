"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Event, EventCategory } from "@/types";
import { X, Sparkles, Pencil } from "lucide-react";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingEvent?: Event | null;
}

const DEFAULT_RULES = [
  "All participants must carry a valid institutional student ID card",
  "Plagiarism or pre-built code is strictly grounds for disqualification",
  "Jury decisions are finalized via normalized rubric scores",
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  editingEvent = null,
}) => {
  const { createEvent, updateEvent } = useStore();
  const isEditMode = Boolean(editingEvent);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory>("hackathon");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("Main Seminar Hall");
  const [startDate, setStartDate] = useState("2026-11-20T09:00");
  const [endDate, setEndDate] = useState("2026-11-21T18:00");
  const [registrationDeadline, setRegistrationDeadline] = useState("2026-11-19T23:59");
  const [isPaid, setIsPaid] = useState(false);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [upiId, setUpiId] = useState("fest@okicici");
  const [maxTeams, setMaxTeams] = useState(40);
  const [teamSizeMin, setTeamSizeMin] = useState(2);
  const [teamSizeMax, setTeamSizeMax] = useState(4);
  const [prizePool, setPrizePool] = useState("₹25,000");
  const [prizeFirst, setPrizeFirst] = useState("Gold Trophy + Cash Award");
  const [prizeSecond, setPrizeSecond] = useState("Silver Trophy");
  const [prizeThird, setPrizeThird] = useState("Bronze Trophy");
  const [rulesText, setRulesText] = useState(DEFAULT_RULES.join("\n"));

  useEffect(() => {
    if (!isOpen) return;

    if (editingEvent) {
      setTitle(editingEvent.title);
      setCategory(editingEvent.category);
      setTagline(editingEvent.tagline);
      setDescription(editingEvent.description);
      setVenue(editingEvent.venue);
      setStartDate(editingEvent.startDate.slice(0, 16));
      setEndDate(editingEvent.endDate.slice(0, 16));
      setRegistrationDeadline(
        (editingEvent.registrationDeadline || editingEvent.startDate).slice(0, 16)
      );
      setIsPaid(editingEvent.isPaid);
      setTicketPrice(editingEvent.ticketPrice);
      setUpiId(editingEvent.upiId || "fest@okicici");
      setMaxTeams(editingEvent.maxTeams);
      setTeamSizeMin(editingEvent.teamSizeMin);
      setTeamSizeMax(editingEvent.teamSizeMax);
      setPrizePool(editingEvent.prizes.pool);
      setPrizeFirst(editingEvent.prizes.first);
      setPrizeSecond(editingEvent.prizes.second);
      setPrizeThird(editingEvent.prizes.third);
      setRulesText((editingEvent.rules || DEFAULT_RULES).join("\n"));
    } else {
      setTitle("");
      setCategory("hackathon");
      setTagline("");
      setDescription("");
      setVenue("Main Seminar Hall");
      setStartDate("2026-11-20T09:00");
      setEndDate("2026-11-21T18:00");
      setRegistrationDeadline("2026-11-19T23:59");
      setIsPaid(false);
      setTicketPrice(0);
      setUpiId("fest@okicici");
      setMaxTeams(40);
      setTeamSizeMin(2);
      setTeamSizeMax(4);
      setPrizePool("₹25,000");
      setPrizeFirst("Gold Trophy + Cash Award");
      setPrizeSecond("Silver Trophy");
      setPrizeThird("Bronze Trophy");
      setRulesText(DEFAULT_RULES.join("\n"));
    }
  }, [editingEvent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedRules = rulesText
      .split(/\r?\n/)
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const payload = {
      title: title.trim(),
      category,
      tagline: tagline.trim() || "National college technical competition",
      description: description.trim() || "Open to all verified college students.",
      accentColor:
        category === "hackathon"
          ? "#3b82f6"
          : category === "robotics"
          ? "#f59e0b"
          : "#10b981",
      venue: venue.trim() || "Main Seminar Hall",
      startDate,
      endDate,
      registrationDeadline: registrationDeadline || startDate,
      teamSizeMin: Number(teamSizeMin),
      teamSizeMax: Math.max(Number(teamSizeMin), Number(teamSizeMax)),
      maxTeams: Number(maxTeams),
      isPaid,
      ticketPrice: isPaid ? Number(ticketPrice) : 0,
      upiId: isPaid ? upiId.trim() : undefined,
      prizes: {
        first: prizeFirst.trim() || "Gold Trophy + Cash Award",
        second: prizeSecond.trim() || "Silver Trophy",
        third: prizeThird.trim() || "Bronze Trophy",
        pool: prizePool.trim() || "₹25,000",
      },
      rules: parsedRules.length > 0 ? parsedRules : DEFAULT_RULES,
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, payload);
    } else {
      createEvent({
        festId: "campus-fest-1",
        ...payload,
      });
    }

    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-blue-100 bg-white p-6 sm:p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white">
              {isEditMode ? (
                <Pencil className="h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </div>
            <div>
              <h2 className="font-fortnite text-2xl text-blue-950 uppercase tracking-wide leading-none">
                {isEditMode ? "Edit Event Track" : "Create New Event Track"}
              </h2>
              {isEditMode && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Updates sync immediately across Events, Student Portal, Certificates & NAAC Dossier.
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="font-semibold text-slate-700">Event Title</label>
            <input
              type="text"
              required
              placeholder="e.g. CodeSprint 2026, RoboCombat, Paper Presentation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Category + Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
              >
                <option value="hackathon">Hackathon</option>
                <option value="symposium">Technical Symposium</option>
                <option value="paper_presentation">Paper Presentation</option>
                <option value="robotics">Robotics Challenge</option>
                <option value="coding_contest">Speed Coding</option>
                <option value="project_expo">Project Expo</option>
                <option value="workshop">Technical Workshop</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700">Venue / Lab Room</label>
              <input
                type="text"
                required
                placeholder="e.g. Main Auditorium Hall B / Lab 402"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Tagline & Description */}
          <div>
            <label className="font-semibold text-slate-700">One-line Tagline</label>
            <input
              type="text"
              placeholder="e.g. 24 hours of autonomous agent design and systems hacking"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700">Description</label>
            <textarea
              rows={2}
              placeholder="Detailed overview of the track format and expectations"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Schedule: Start Date, End Date, Reg Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700">Start Date & Time</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">End Date & Time</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Registration Deadline</label>
              <input
                type="datetime-local"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Capacity & Squad Size */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700">Max Teams Capacity</label>
              <input
                type="number"
                min={5}
                max={500}
                value={maxTeams}
                onChange={(e) => setMaxTeams(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Min Squad Size</label>
              <input
                type="number"
                min={1}
                max={6}
                value={teamSizeMin}
                onChange={(e) => setTeamSizeMin(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Max Squad Size</label>
              <input
                type="number"
                min={1}
                max={10}
                value={teamSizeMax}
                onChange={(e) => setTeamSizeMax(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Prize Pool Breakdown */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 space-y-3">
            <div className="font-fortnite text-base text-blue-950 uppercase tracking-wide">
              Prize Pool & Awards
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="font-medium text-slate-700">Total Pool</label>
                <input
                  type="text"
                  value={prizePool}
                  onChange={(e) => setPrizePool(e.target.value)}
                  placeholder="₹55,000"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700">1st Prize</label>
                <input
                  type="text"
                  value={prizeFirst}
                  onChange={(e) => setPrizeFirst(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700">2nd Prize</label>
                <input
                  type="text"
                  value={prizeSecond}
                  onChange={(e) => setPrizeSecond(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700">3rd Prize</label>
                <input
                  type="text"
                  value={prizeThird}
                  onChange={(e) => setPrizeThird(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Registration Fee & UPI Settings */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-fortnite text-base text-blue-950 uppercase tracking-wide">
                  Delegate Fee & Payment
                </div>
                <div className="text-[11px] text-slate-500">
                  Collect delegate fee via direct UPI Intent
                </div>
              </div>
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
              />
            </div>

            {isPaid && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="font-medium text-slate-700">Fee per Team (₹)</label>
                  <input
                    type="number"
                    min={10}
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700">Organizer UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. acm@sbi"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Rules & Guidelines */}
          <div>
            <label className="font-semibold text-slate-700">
              Track Rules & Guidelines (1 rule per line)
            </label>
            <textarea
              rows={3}
              value={rulesText}
              onChange={(e) => setRulesText(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 font-fortnite text-sm tracking-wide text-white hover:bg-blue-700 transition shadow-sm"
            >
              {isEditMode ? "SAVE CHANGES" : "CREATE TRACK"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
