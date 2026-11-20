"use client";

import React, { useState } from "react";
import { Sparkles, Clock, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export const LandingCalculator: React.FC<{
  onLaunchOrganizer: () => void;
}> = ({ onLaunchOrganizer }) => {
  const [attendeeCount, setAttendeeCount] = useState<number>(300);
  const [tracksCount, setTracksCount] = useState<number>(3);
  const [judgesCount, setJudgesCount] = useState<number>(6);

  // Calculations
  // Canva manual certs: 1.5 mins per certificate = attendeeCount * 1.5 / 60 hours
  const certHoursSaved = Math.round((attendeeCount * 1.5) / 60);
  // Manual gate checkin: from 45 mins queue down to 1s
  const queueMinutesSaved = Math.round((attendeeCount * 30) / 60);
  // Manual excel score aggregation & judge dispute resolution
  const judgingHoursSaved = Math.round(tracksCount * judgesCount * 0.8);
  // NAAC gathering hours
  const naacHoursSaved = 14;

  const totalHoursSaved = certHoursSaved + judgingHoursSaved + naacHoursSaved;

  return (
    <div className="rounded-3xl border border-blue-200 bg-white p-6 sm:p-10 shadow-xl shadow-blue-500/5 space-y-8">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          Coordinator Sanity Calculator
        </span>
        <h2 className="font-fortnite text-3xl sm:text-4xl text-blue-950 uppercase tracking-wide">
          CALCULATE HOW MUCH TIME FESTRA SAVES YOUR TEAM
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Move the sliders below to estimate the manual hours saved on registration queues, Canva name copy-pasting, judge disputes, and NAAC dossier compilation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive Sliders */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Attendees */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Expected Total Participants</span>
              <span className="font-fortnite text-lg text-blue-600">
                {attendeeCount} Students
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="1500"
              step="25"
              value={attendeeCount}
              onChange={(e) => setAttendeeCount(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>50 students</span>
              <span>750 students</span>
              <span>1,500 students</span>
            </div>
          </div>

          {/* Slider 2: Event Tracks */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Number of Event Tracks (Hackathons, Papers, Contests)</span>
              <span className="font-fortnite text-lg text-blue-600">
                {tracksCount} Tracks
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={tracksCount}
              onChange={(e) => setTracksCount(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>1 Track</span>
              <span>5 Tracks</span>
              <span>10 Tracks</span>
            </div>
          </div>

          {/* Slider 3: Judges */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Total Judges & Evaluators</span>
              <span className="font-fortnite text-lg text-blue-600">
                {judgesCount} Judges
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              value={judgesCount}
              onChange={(e) => setJudgesCount(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>2 Judges</span>
              <span>10 Judges</span>
              <span>20 Judges</span>
            </div>
          </div>
        </div>

        {/* Right: Live Calculated Metrics Banner */}
        <div className="lg:col-span-5 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 p-6 sm:p-7 space-y-5 shadow-sm text-center">
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Estimated Manual Work Eliminated
            </div>
            <div className="font-fortnite text-4xl sm:text-5xl text-blue-600">
              ~{totalHoursSaved} HOURS
            </div>
            <div className="text-xs font-semibold text-emerald-700">
              Saved per College Tech Fest
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left border-t border-b border-blue-100 py-3 text-xs">
            <div className="space-y-0.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Canva Name Typing</div>
              <div className="font-bold text-slate-800">~{certHoursSaved}h ➔ 2 seconds</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Gate Queue Time</div>
              <div className="font-bold text-slate-800">&lt; 1 sec per pass</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Judge Bias Conflicts</div>
              <div className="font-bold text-emerald-700">0.0% ($Z$-score)</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase">NAAC IQAC Prep</div>
              <div className="font-bold text-slate-800">1-Click PDF export</div>
            </div>
          </div>

          <button
            onClick={onLaunchOrganizer}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-fortnite text-sm uppercase tracking-wide text-white hover:bg-blue-700 transition shadow-md shadow-blue-600/20"
          >
            <span>LAUNCH ORGANIZER WORKSPACE</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
