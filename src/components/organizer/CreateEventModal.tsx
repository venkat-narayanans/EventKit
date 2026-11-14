"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { EventCategory } from "@/types";
import { X, Sparkles } from "lucide-react";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const { createEvent } = useStore();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory>("hackathon");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("Main Seminar Hall");
  const [startDate, setStartDate] = useState("2026-11-20T09:00");
  const [endDate, setEndDate] = useState("2026-11-21T18:00");
  const [isPaid, setIsPaid] = useState(false);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [upiId, setUpiId] = useState("fest@okicici");
  const [maxTeams, setMaxTeams] = useState(40);
  const [teamSizeMin, setTeamSizeMin] = useState(2);
  const [teamSizeMax, setTeamSizeMax] = useState(4);
  const [prizePool, setPrizePool] = useState("₹25,000");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createEvent({
      festId: "campus-fest-1",
      title: title.trim(),
      category,
      tagline: tagline.trim() || "National college technical competition",
      description: description.trim() || "Open to all verified college students.",
      accentColor: category === "hackathon" ? "#3b82f6" : category === "robotics" ? "#f59e0b" : "#10b981",
      venue,
      startDate,
      endDate,
      registrationDeadline: startDate,
      teamSizeMin: Number(teamSizeMin),
      teamSizeMax: Number(teamSizeMax),
      maxTeams: Number(maxTeams),
      isPaid,
      ticketPrice: isPaid ? Number(ticketPrice) : 0,
      upiId: isPaid ? upiId : undefined,
      prizes: {
        first: "Gold Trophy + Cash Award",
        second: "Silver Trophy",
        third: "Bronze Trophy",
        pool: prizePool,
      },
      rules: [
        "All participants must carry a valid institutional student ID card",
        "Plagiarism or pre-built code is strictly grounds for disqualification",
        "Jury decisions are finalized via normalized rubric scores",
      ],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-white">Create New Event Track</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-900 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="font-medium text-zinc-300">Event Title</label>
            <input
              type="text"
              required
              placeholder="e.g. CodeSprint 2026, RoboCombat, Paper Presentation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-zinc-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="hackathon">Hackathon</option>
                <option value="paper_presentation">Paper Presentation</option>
                <option value="robotics">Robotics Challenge</option>
                <option value="coding_contest">Speed Coding</option>
                <option value="project_expo">Project Expo</option>
                <option value="workshop">Technical Workshop</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-zinc-300">Venue / Lab Room</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-zinc-300">One-line Tagline</label>
            <input
              type="text"
              placeholder="e.g. 24 hours of autonomous agent design and systems hacking"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-medium text-zinc-300">Max Teams Capacity</label>
              <input
                type="number"
                min={5}
                max={200}
                value={maxTeams}
                onChange={(e) => setMaxTeams(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-zinc-300">Min Squad Size</label>
              <input
                type="number"
                min={1}
                max={5}
                value={teamSizeMin}
                onChange={(e) => setTeamSizeMin(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-zinc-300">Max Squad Size</label>
              <input
                type="number"
                min={1}
                max={8}
                value={teamSizeMax}
                onChange={(e) => setTeamSizeMax(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Registration Fee & UPI Settings */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Delegate Fee & Payment</div>
                <div className="text-[11px] text-zinc-400">Collect delegate fee via direct UPI Intent</div>
              </div>
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="h-4 w-4 rounded accent-blue-600"
              />
            </div>

            {isPaid && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800/60">
                <div>
                  <label className="font-medium text-zinc-300">Fee per Team (₹)</label>
                  <input
                    type="number"
                    min={10}
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-300">Organizer UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. acm@sbi"
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-800 px-4 py-2 font-medium text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-white px-4 py-2 font-semibold text-zinc-950 hover:bg-zinc-200 transition"
            >
              Create Track
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
